// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { CourseChaptersChapter } from './CourseChapters';
import type { CoursesId } from './Courses';
import type { CoursesLocalizedLanguage } from './CoursesLocalized';

/** Represents the table content.course_chapters_localized */
export default interface CourseChaptersLocalized {
  course_id: CoursesId | CoursesId | CoursesId;

  chapter: CourseChaptersChapter;

  language: CoursesLocalizedLanguage;

  title: string;

  sections: string[];

  raw_content: string;
}

/** Represents the initializer for the table content.course_chapters_localized */
export interface CourseChaptersLocalizedInitializer {
  course_id: CoursesId | CoursesId | CoursesId;

  chapter: CourseChaptersChapter;

  language: CoursesLocalizedLanguage;

  title: string;

  sections: string[];

  raw_content: string;
}

/** Represents the mutator for the table content.course_chapters_localized */
export interface CourseChaptersLocalizedMutator {
  course_id?: CoursesId | CoursesId | CoursesId;

  chapter?: CourseChaptersChapter;

  language?: CoursesLocalizedLanguage;

  title?: string;

  sections?: string[];

  raw_content?: string;
}