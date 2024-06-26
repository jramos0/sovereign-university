import type { TransactionSql } from '@sovereign-university/database';
import { firstRow } from '@sovereign-university/database';
import type {
  ChangedFile,
  ModifiedFile,
  RenamedFile,
  Resource,
} from '@sovereign-university/types';

import { yamlToObject } from '../../utils.js';

import type { ChangedResource } from './index.js';

export const createProcessMainFile =
  (transaction: TransactionSql) =>
  async (resource: ChangedResource, file?: ChangedFile) => {
    if (!file) return;

    if (file.kind === 'removed') {
      // If resource file was removed, delete the main resource and all its translations (with cascade)

      await transaction`
        DELETE FROM content.resources WHERE path = ${resource.path} 
      `;

      return;
    }

    if (file.kind === 'renamed') {
      // If resource file was moved, update the path
      // We assume the whole resource folder was moved

      const previousPath = file.previousPath.split('/').slice(0, -1).join('/');

      await transaction`
        UPDATE content.resources
        SET path = ${resource.path}
        WHERE path = ${previousPath}
      `;
    }

    if (
      file.kind === 'added' ||
      file.kind === 'modified' ||
      file.kind === 'renamed'
    ) {
      // If new or updated resource file, insert or update resource

      // Only get the tags from the main resource file
      const parsedResource = yamlToObject<{
        tags?: string[];
      }>(file.data);

      const lastUpdated = resource.files
        .filter(
          (file): file is ModifiedFile | RenamedFile => file.kind !== 'removed',
        )
        .sort((a, b) => b.time - a.time)[0];

      const result = await transaction<Resource[]>`
        INSERT INTO content.resources (category, path, last_updated, last_commit, last_sync)
        VALUES (
          ${resource.category}, 
          ${resource.path},
          ${lastUpdated.time}, 
          ${lastUpdated.commit},
          NOW()
        )
        ON CONFLICT (category, path) DO UPDATE SET
          last_updated = ${lastUpdated.time},
          last_commit = ${lastUpdated.commit},
          last_sync = NOW()
        RETURNING *
      `.then(firstRow);

      // Remove tags related to the resource before inserting the new one
      if (result) {
        await transaction`
        DELETE FROM content.resource_tags
        WHERE resource_id = ${result.id}
      `;
      }

      // If the resource has tags, insert them into the tags table and link them to the resource
      if (result && parsedResource.tags && parsedResource.tags?.length > 0) {
        const lowercaseTags = parsedResource.tags.map((tag) =>
          tag.toLowerCase(),
        );

        await transaction`
          INSERT INTO content.tags ${transaction(
            lowercaseTags.map((tag) => ({ name: tag })),
          )}
          ON CONFLICT (name) DO NOTHING
        `;

        await transaction`
          INSERT INTO content.resource_tags (resource_id, tag_id)
          SELECT
            ${result.id}, 
            id FROM content.tags WHERE name = ANY(${lowercaseTags})
          ON CONFLICT DO NOTHING
        `;
      }
    }
  };
