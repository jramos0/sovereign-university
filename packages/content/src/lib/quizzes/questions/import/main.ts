import type { TransactionSql } from '@sovereign-university/database';
import { firstRow } from '@sovereign-university/database';
import type {
  ChangedFile,
  Level,
  ModifiedFile,
  QuizQuestion,
  RenamedFile,
} from '@sovereign-university/types';

import { yamlToObject } from '../../../utils.js';

import type { ChangedQuizQuestion } from './index.js';
import { parseDetailsFromPath } from './index.js';

interface QuizQuestionMain {
  chapterId: string;
  difficulty: Level;
  author?: string;
  duration?: number;
  tags?: string[];
}

export const createProcessMainFile =
  (transaction: TransactionSql) =>
  async (quizQuestion: ChangedQuizQuestion, file?: ChangedFile) => {
    if (!file) return;

    // TODO IMPOSSIBLE
    if (file.kind === 'removed') {
      // If quiz question file was removed, delete the main quiz question and all its translations (with cascade)

      await transaction`
        DELETE FROM content.quiz_questions WHERE id = ${quizQuestion.id} 
      `;

      return;
    }

    // TODO IMPOSSIBLE
    if (file.kind === 'renamed') {
      // If quiz question file was moved, update the id

      const { id: previousId } = parseDetailsFromPath(file.previousPath);

      await transaction`
        UPDATE content.quiz_questions
        SET id = ${quizQuestion.id}
        WHERE id = ${previousId}
      `;
    }

    if (
      file.kind === 'added' ||
      file.kind === 'modified' ||
      file.kind === 'renamed'
    ) {
      // If new or updated quiz file, insert or update quiz

      // Only get the tags from the main quiz file
      const parsedQuizQuestion = yamlToObject<QuizQuestionMain>(file.data);

      const lastUpdated = quizQuestion.files
        .filter(
          (file): file is ModifiedFile | RenamedFile => file.kind !== 'removed',
        )
        .sort((a, b) => b.time - a.time)[0];

      const result = await transaction<QuizQuestion[]>`
        INSERT INTO content.quiz_questions
        (id, chapter_id, difficulty, author, duration, last_updated, last_commit, last_sync)
        VALUES (
          ${quizQuestion.id},
          ${parsedQuizQuestion.chapterId}, 
          ${parsedQuizQuestion.difficulty},
          ${parsedQuizQuestion.author},
          ${parsedQuizQuestion.duration},
          ${lastUpdated.time}, 
          ${lastUpdated.commit},
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          chapter_id = EXCLUDED.chapter_id,
          difficulty = EXCLUDED.difficulty,
          author = EXCLUDED.author,
          duration = EXCLUDED.duration,
          last_updated = EXCLUDED.last_updated,
          last_commit = EXCLUDED.last_commit,
          last_sync = NOW()
        RETURNING *
      `.then(firstRow);

      // If the quiz has tags, insert them into the tags table and link them to the quiz
      if (
        result &&
        parsedQuizQuestion.tags &&
        parsedQuizQuestion.tags?.length > 0
      ) {
        await transaction`
          INSERT INTO content.tags ${transaction(
            parsedQuizQuestion.tags.map((tag) => ({ name: tag.toLowerCase() })),
          )}
          ON CONFLICT (name) DO NOTHING
        `;

        await transaction`
          INSERT INTO content.quiz_question_tags (quiz_question_id, tag_id)
          SELECT
            ${result.id}, 
            id FROM content.tags WHERE name = ANY(${parsedQuizQuestion.tags})
          ON CONFLICT DO NOTHING
        `;
      }
    }
  };
