import { z } from 'zod';

import { type ResourceCategory } from '@sovereign-university/content';
import {
  createGetBook,
  createGetBooks,
  createGetBuilder,
  createGetBuilders,
  createGetPodcast,
  createGetPodcasts,
} from '@sovereign-university/content';

import { publicProcedure } from '../../procedures/index.js';
import { createTRPCRouter } from '../../trpc/index.js';

const createGetResourcesProcedure = (category: ResourceCategory) => {
  return publicProcedure.input(
    z.object({ language: z.string().optional() }).optional(),
  );
};

const createGetResourceProcedure = (category: ResourceCategory) => {
  return publicProcedure.input(
    z.object({ id: z.number(), language: z.string() }),
  );
};

export const resourcesRouter = createTRPCRouter({
  // Books
  getBooks: createGetResourcesProcedure('books').query(async ({ ctx, input }) =>
    createGetBooks(ctx.dependencies)(input?.language),
  ),
  getBook: createGetResourceProcedure('books').query(async ({ ctx, input }) =>
    createGetBook(ctx.dependencies)(input.id, input.language),
  ),
  // Builders
  getBuilders: createGetResourcesProcedure('builders').query(
    async ({ ctx, input }) =>
      createGetBuilders(ctx.dependencies)(input?.language),
  ),
  getBuilder: createGetResourceProcedure('builders').query(
    async ({ ctx, input }) =>
      createGetBuilder(ctx.dependencies)(input.id, input.language),
  ),
  // Podcasts
  getPodcasts: createGetResourcesProcedure('podcasts').query(
    async ({ ctx, input }) =>
      createGetPodcasts(ctx.dependencies)(input?.language),
  ),
  getPodcast: createGetResourceProcedure('podcasts').query(
    async ({ ctx, input }) =>
      createGetPodcast(ctx.dependencies)(input.id, input.language),
  ),
});
