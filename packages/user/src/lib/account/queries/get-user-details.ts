import { sql } from '@sovereign-university/database';
import type { UserDetails } from '@sovereign-university/types';

export const getUserDetailsQuery = (uid: string) => {
  return sql<UserDetails[]>`
    SELECT 
      uid,
      username,
      display_name,
      email,
      picture,
      contributor_id,
      created_at
    FROM users.accounts
    WHERE uid = ${uid};
  `;
};
