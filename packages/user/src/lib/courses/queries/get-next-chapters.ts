import { sql } from '@sovereign-university/database';
import type { CourseChapter } from '@sovereign-university/types';

export const getNextChaptersQuery = (uid: string) => {
  return sql<
    Array<
      Pick<CourseChapter, 'courseId' | 'chapterId' | 'chapterIndex'> & {
        partIndex: number;
      }
    >
  >`
    WITH AllChapters AS (
      SELECT DISTINCT c.course_id, cp.chapter_id, cp.part_id, cp.chapter_index, cpa.part_index
      FROM content.course_chapters cp
      LEFT JOIN users.course_user_chapter c 
        ON cp.course_id = c.course_id
      LEFT JOIN content.course_parts cpa
        ON cp.part_id = cp.part_id
      WHERE c.uid = ${uid}
    ),
    CompletedChapters AS (
      SELECT course_id, chapter_id 
      FROM users.course_user_chapter
      WHERE uid = ${uid} AND completed_at is not null
    ),
    NextChapters AS (
      SELECT
        ac.course_id,
        ac.chapter_id,
        ac.chapter_index,
        ac.part_index,
        ROW_NUMBER() OVER (PARTITION BY ac.course_id ORDER BY ac.part_index ASC, ac.chapter_index ASC) AS rn
      FROM AllChapters ac
      LEFT JOIN CompletedChapters cc ON ac.course_id = cc.course_id AND ac.chapter_id = cc.chapter_id
      WHERE cc.chapter_id IS NULL
    )
    SELECT course_id, chapter_id, part_index, chapter_index
    FROM NextChapters
    WHERE rn = 1;
  `;
};
