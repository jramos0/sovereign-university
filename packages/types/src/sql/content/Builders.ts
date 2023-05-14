// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ResourcesId } from './Resources';

/** Represents the table content.builders */
export default interface Builders {
  resource_id: ResourcesId;

  name: string;

  website_url: string | null;

  twitter_url: string | null;

  github_url: string | null;

  nostr: string | null;
}

/** Represents the initializer for the table content.builders */
export interface BuildersInitializer {
  resource_id: ResourcesId;

  name: string;

  website_url?: string | null;

  twitter_url?: string | null;

  github_url?: string | null;

  nostr?: string | null;
}

/** Represents the mutator for the table content.builders */
export interface BuildersMutator {
  resource_id?: ResourcesId;

  name?: string;

  website_url?: string | null;

  twitter_url?: string | null;

  github_url?: string | null;

  nostr?: string | null;
}