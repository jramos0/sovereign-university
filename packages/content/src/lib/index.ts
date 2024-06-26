import type { ChangedFile } from '@sovereign-university/types';

import { supportedContentTypes } from './const.js';
import {
  createDeleteCourses,
  createUpdateCourses,
  groupByCourse,
} from './courses/import/index.js';
import type { Dependencies } from './dependencies.js';
import {
  createDeleteEvents,
  createUpdateEvents,
  groupByEvent,
} from './events/import/index.js';
import {
  createDeleteProfessors,
  createUpdateProfessors,
  groupByProfessor,
} from './professors/import/index.js';
import {
  createDeleteQuizQuestions,
  createUpdateQuizQuestions,
  groupByQuizQuestion,
} from './quizzes/questions/import/index.js';
import {
  createDeleteResources,
  createUpdateResources,
  groupByResource,
} from './resources/import/index.js';
import {
  createDeleteTutorials,
  createUpdateTutorials,
  groupByTutorial,
} from './tutorials/import/index.js';

/**
 * Updates the database from the content files
 */
export const createProcessContentFiles = (dependencies: Dependencies) => {
  const updateResources = createUpdateResources(dependencies);
  const updateCourses = createUpdateCourses(dependencies);
  const updateTutorials = createUpdateTutorials(dependencies);
  const updateQuizQuestions = createUpdateQuizQuestions(dependencies);
  const updateProfessors = createUpdateProfessors(dependencies);
  const updateEvents = createUpdateEvents(dependencies);

  return async (files: ChangedFile[]): Promise<string[]> => {
    const filteredFiles = files.filter((file) =>
      supportedContentTypes.some((value) => file.path.startsWith(value)),
    );
    const errors: string[] = [];

    const resources = groupByResource(filteredFiles, errors);
    console.log(`-- Sync procedure: Syncing ${resources.length} resources`);
    for (const resource of resources) {
      await updateResources(resource, errors);
    }

    const courses = groupByCourse(filteredFiles, errors);
    console.log(`-- Sync procedure: Syncing ${courses.length} courses`);
    for (const course of courses) {
      await updateCourses(course, errors);
    }

    const tutorials = groupByTutorial(filteredFiles, errors);
    console.log(`-- Sync procedure: Syncing ${tutorials.length} tutorials`);
    for (const tutorial of tutorials) {
      await updateTutorials(tutorial, errors);
    }

    const quizQuestions = groupByQuizQuestion(filteredFiles, errors);
    console.log(
      `-- Sync procedure: Syncing ${quizQuestions.length} quizQuestions`,
    );
    for (const quizQuestion of quizQuestions) {
      await updateQuizQuestions(quizQuestion, errors);
    }

    const professors = groupByProfessor(filteredFiles, errors);
    console.log(`-- Sync procedure: Syncing ${professors.length} professors`);
    for (const professor of professors) {
      await updateProfessors(professor, errors);
    }

    const events = groupByEvent(filteredFiles, errors);
    console.log(`-- Sync procedure: Syncing ${events.length} events`);
    for (const event of events) {
      await updateEvents(event, errors);
    }

    return errors;
  };
};

export const createProcessDeleteOldEntities = (dependencies: Dependencies) => {
  const deleteProfessors = createDeleteProfessors(dependencies);
  const deleteCourses = createDeleteCourses(dependencies);
  const deleteQuizQuestions = createDeleteQuizQuestions(dependencies);
  const deleteTutorials = createDeleteTutorials(dependencies);
  const deleteResources = createDeleteResources(dependencies);
  const deleteEvents = createDeleteEvents(dependencies);

  return async (sync_date: number, errors: string[]) => {
    const timeKey = '-- Sync procedure: Removing old entities';
    console.log(timeKey + '...');
    console.time(timeKey);

    await deleteProfessors(sync_date, errors);
    await deleteCourses(sync_date, errors);
    await deleteQuizQuestions(sync_date, errors);
    await deleteTutorials(sync_date, errors);
    await deleteResources(sync_date, errors);
    await deleteEvents(sync_date, errors);

    console.timeEnd(timeKey);
  };
};
