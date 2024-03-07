// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

import type { z } from 'zod';

import {
  courseChapterLocalizedSchema,
  courseChapterSchema,
  courseLocalizedSchema,
  coursePartLocalizedSchema,
  coursePartSchema,
  courseSchema,
  joinedCourseChapterSchema,
  joinedCourseChapterWithContentSchema,
  joinedCourseSchema,
  joinedCourseWithAllSchema,
} from '@sovereign-university/schemas';

export type CourseChapterLocalized = z.infer<
  typeof courseChapterLocalizedSchema
>;
export type CourseChapter = z.infer<typeof courseChapterSchema>;
export type CourseLocalized = z.infer<typeof courseLocalizedSchema>;
export type CoursePartLocalized = z.infer<typeof coursePartLocalizedSchema>;
export type CoursePart = z.infer<typeof coursePartSchema>;
export type Course = z.infer<typeof courseSchema>;
export type JoinedCourseChapter = z.infer<typeof joinedCourseChapterSchema>;
export type JoinedCourseChapterWithContent = z.infer<
  typeof joinedCourseChapterWithContentSchema
>;
export type JoinedCourse = z.infer<typeof joinedCourseSchema>;
export type JoinedCourseWithAll = z.infer<typeof joinedCourseWithAllSchema>;
