/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { firstRow } from '@sovereign-university/database';

import type { Dependencies } from '../../dependencies.js';
import { getProfessorsQuery } from '../../professors/queries/index.js';
import { formatProfessor } from '../../professors/services/utils.js';
import { getCoursePartsQuery } from '../queries/get-course-parts.js';
import { getCourseChaptersQuery, getCourseQuery } from '../queries/index.js';

export const createGetCourse =
  (dependencies: Dependencies) => async (id: string, language: string) => {
    const { postgres } = dependencies;

    const course = await postgres
      .exec(getCourseQuery(id, language))
      .then(firstRow);

    if (!course) {
      throw new Error(`Course ${id} not found`);
    }

    const parts = await postgres.exec(getCoursePartsQuery(id, language));
    const chapters = await postgres.exec(
      getCourseChaptersQuery({ courseId: id, language }),
    );
    const professors = await postgres.exec(
      getProfessorsQuery({ contributorIds: course.professors, language }),
    );

    const partsWithChapters = parts.map((part) => ({
      ...part,
      chapters: chapters.filter((chapter) => chapter.partId === part.partId),
    }));

    return {
      ...course,
      professors: professors.map((element) => formatProfessor(element)),
      parts: partsWithChapters,
      partsCount: parts.length,
      chaptersCount: chapters.length,
    };
  };
