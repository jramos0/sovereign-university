import { sql } from '@sovereign-university/database';
import type { JoinedCoursePartLocalized } from '@sovereign-university/types';

export const getCoursePartsQuery = (id: string, language?: string) => {
  return sql<JoinedCoursePartLocalized[]>`
    SELECT cpl.part_id, cpl.language, cpl.title, cp.part_index
    FROM content.course_parts_localized cpl
    LEFT JOIN content.course_parts cp
    on cp.part_id = cpl.part_id
    WHERE cpl.course_id = ${id} 
    ${language ? sql`AND cpl.language = ${language}` : sql``}
    ORDER BY cp.part_index ASC
  `;
};
