import matter from 'gray-matter';
import { marked } from 'marked';

import { firstRow } from '@sovereign-academy/database';
import type { ChangedFile, Course } from '@sovereign-academy/types';

import type { Language } from '../const';
import { Dependencies } from '../dependencies';
import { ChangedContent } from '../types';
import { getContentType, separateContentFiles, yamlToObject } from '../utils';

interface CourseDetails {
  id: string;
  path: string;
  language?: Language;
}

export interface ChangedCourse extends ChangedContent {
  id: string;
}

/**
 * Get the relative path of the file compared to the course directory if it's a regular file
 * or the course assets directory if it's an asset.
 *
 * Examples:
 *  - `courses/btc101/en.yml` -> `en.yml`
 *  - `courses/btc101/assets/logo.png` -> `logo.png`
 *
 * @param path - Path of the file
 * @returns Relative path of the file
 */
const getRelativePath = (path: string) => {
  const pathElements = path.split('/');

  return (
    pathElements[2] === 'assets' ? pathElements.slice(3) : pathElements.slice(2)
  ).join('/');
};

/**
 * Parse course details from path
 *
 * @param path - Path of the file
 * @returns Resource details
 */
const parseDetailsFromPath = (path: string): CourseDetails => {
  const pathElements = path.split('/');

  // Validate that the path has at least 3 elements (courses/name)
  if (pathElements.length < 2) throw new Error('Invalid resource path');

  return {
    id: pathElements[1],
    path: pathElements.slice(0, 2).join('/'),
    language: pathElements[2].replace(/\..*/, '') as Language,
  };
};

export const groupByCourse = (files: ChangedFile[], baseUrl: string) => {
  const coursesFiles = files.filter(
    (item) => getContentType(item.path) === 'courses'
  );

  const groupedCourses = new Map<string, ChangedCourse>();

  for (const file of coursesFiles) {
    const { id, path: coursePath, language } = parseDetailsFromPath(file.path);

    const course =
      groupedCourses.get(coursePath) ||
      ({
        type: 'courses',
        id,
        path: coursePath,
        sourceUrl: `${baseUrl}/blob/${file.commit}/${coursePath}`,
        files: [],
        assets: [],
      } as ChangedCourse);

    if (file.isAsset) {
      course.assets.push({
        ...file,
        path: getRelativePath(file.path),
      });
    } else {
      course.files.push({
        ...file,
        path: getRelativePath(file.path),
        language,
      });
    }

    groupedCourses.set(coursePath, course);
  }

  return Array.from(groupedCourses.values());
};

interface CourseMain {
  level: string;
  hours: number;
  tags?: string[];
}

interface Chapter {
  title: string;
  raw_content: string;
}

const extractChapters = (markdown: string): Chapter[] => {
  const tokens = marked.lexer(markdown);
  const chapters: Chapter[] = [];

  tokens.forEach((token) => {
    if (token.type === 'heading' && token.depth === 1) {
      chapters.push({
        title: token.text,
        raw_content: '',
      });
    } else if (chapters.length > 0) {
      chapters[chapters.length - 1].raw_content += token.raw;
    }
  });

  return chapters;
};

export const createProcessChangedCourse =
  (dependencies: Dependencies) => async (course: ChangedCourse) => {
    const { postgres } = dependencies;

    console.log(course);

    const { main, files } = separateContentFiles(course, 'course.yml');

    return postgres.begin(async (transaction) => {
      if (main) {
        if (main.kind === 'removed') {
          // If course file was removed, delete the main course and all its translations (with cascade)

          await transaction`
            DELETE FROM content.courses WHERE id = ${course.id} 
          `;

          return;
        }

        if (main.kind === 'renamed') {
          // If course file was moved, update the id

          await transaction`
            UPDATE content.resources
            SET id = ${course.id}
            WHERE path = ${main.previousPath.split('/')[1]}
          `;
        }

        if (
          main.kind === 'added' ||
          main.kind === 'modified' ||
          main.kind === 'renamed'
        ) {
          // If new or updated resource file, insert or update resource

          // Only get the tags from the main resource file
          const parsedCourse = yamlToObject<CourseMain>(main.data);

          const lastUpdated = [...course.files, ...course.assets].sort(
            (a, b) => b.time - a.time
          )[0];

          const result = await transaction<Course[]>`
            INSERT INTO content.courses (id, level, hours, last_updated, last_commit)
            VALUES (
              ${course.id}, 
              ${parsedCourse.level},
              ${parsedCourse.hours},
              ${lastUpdated.time}, 
              ${lastUpdated.commit}
            )
            ON CONFLICT (id) DO UPDATE SET
              level = EXCLUDED.level,
              hours = EXCLUDED.hours,
              last_updated = EXCLUDED.last_updated,
              last_commit = EXCLUDED.last_commit
            RETURNING *
          `.then(firstRow);

          // If the resource has tags, insert them into the tags table and link them to the resource
          if (result && parsedCourse.tags && parsedCourse.tags?.length > 0) {
            await transaction`
              INSERT INTO content.tags ${transaction(
                parsedCourse.tags.map((tag) => ({ name: tag }))
              )}
              ON CONFLICT DO NOTHING
            `;

            await transaction`
              INSERT INTO content.course_tags (course_id, tag_id)
              SELECT
                ${result.id}, 
                id FROM content.tags WHERE name = ANY(${parsedCourse.tags})
              ON CONFLICT DO NOTHING
            `;
          }
        }
      }

      for (const file of files) {
        if (file.kind === 'removed') {
          // If file was deleted, delete the translation from the database

          await transaction`
            DELETE FROM content.courses_localized
            WHERE course_id = ${course.id} AND language = ${file.language}
          `;

          continue;
        }

        const header = matter(file.data, { excerpt: true });

        if (header.excerpt) {
          header.content = header.content.replace(`${header.excerpt}---\n`, '');
          header.excerpt = header.excerpt.trim();
        }

        const chapters = extractChapters(header.content);

        await transaction`
          INSERT INTO content.courses_localized (
            course_id, language, name, goal, raw_description
          )
          VALUES (
            ${course.id},
            ${file.language},
            ${header.data['name']},
            ${header.data['goal']?.trim()},
            ${header.excerpt}
          )
          ON CONFLICT (course_id, language) DO UPDATE SET
            name = EXCLUDED.name,
            goal = EXCLUDED.goal,
            raw_description = EXCLUDED.raw_description
        `;

        await transaction`
            INSERT INTO content.course_chapters_localized ${transaction(
              chapters.map((chapter, index) => ({
                course_id: course.id,
                language: file.language,
                chapter: index + 1,
                title: chapter.title,
                raw_content: chapter.raw_content.trim(),
              })),
              'course_id',
              'language',
              'chapter',
              'title',
              'raw_content'
            )}
            ON CONFLICT (course_id, language, chapter) DO UPDATE SET
              title = EXCLUDED.title,
              raw_content = EXCLUDED.raw_content
          `;
      }
    });
  };
