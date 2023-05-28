import { JoinedBuilder } from '@sovereign-academy/types';

import { Dependencies } from '../../dependencies';

export const createGetBuilders =
  (dependencies: Dependencies) => async (language?: string) => {
    const { postgres } = dependencies;

    const result = await postgres<JoinedBuilder[]>`
      SELECT 
        r.id, r.path, bl.language, b.name, b.website_url, b.twitter_url, 
        b.github_url, b.nostr, bl.description, r.last_updated, r.last_commit
      FROM content.builders b
      JOIN content.resources r ON r.id = b.resource_id
      JOIN content.builders_localized bl ON bl.builder_id = b.resource_id
      ${language ? postgres`WHERE bl.language = ${language}` : postgres``}
    `;

    return result;
  };