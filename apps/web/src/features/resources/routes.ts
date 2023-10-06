import { Route } from '@tanstack/react-router';
import { rootRoute } from '../../routes/root';
import { Resources } from './pages/explorer';
import { Book } from './pages/book-details';
import { Books } from './pages/books';
import { Builders } from './pages/builders';
import { Builder } from './pages/builder-details';
import { Podcasts } from './pages/podcasts';
import { Podcast } from './pages/podcast-details';

const resourcesRootRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'resources',
});

export const resourcesIndexRoute = new Route({
  getParentRoute: () => resourcesRootRoute,
  path: '/',
   component: Resources
})

export const booksRoute = new Route({
    getParentRoute: () => resourcesRootRoute,
    path: '/books',
    component: Books
  })

export const bookDetailsRoute = new Route({
  getParentRoute: () => resourcesRootRoute,
  path: '/book/$bookId',
  component: Book
})

export const buildersRoute = new Route({
    getParentRoute: () => resourcesRootRoute,
    path: '/builders',
    component: Builders
  })

export const builderDetailsRoute = new Route({
  getParentRoute: () => resourcesRootRoute,
  path: '/builder/$builderId',
  component: Builder
})

export const podcastsRoute = new Route({
    getParentRoute: () => resourcesRootRoute,
    path: '/podcasts',
    component: Podcasts
  })

export const podcastDetailsRoute = new Route({
  getParentRoute: () => resourcesRootRoute,
  path: '/podcast/$podcastId',
  component: Podcast
})

export const resourcesRoutes = resourcesRootRoute.addChildren([
  resourcesIndexRoute,
  booksRoute,
  bookDetailsRoute,
  buildersRoute,
  builderDetailsRoute,
  podcastsRoute,
  podcastDetailsRoute
]);
