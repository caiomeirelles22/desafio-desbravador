import { createRepositoryPage } from '../features/github-user/pages/repository-page'
import { createHomePage } from '../features/github-user/pages/home-page'
import { createUserPage } from '../features/github-user/pages/user-page'
import { parseUserListQuery } from '../features/github-user/utils/parse-user-list-query'
import { createPlaceholderPage } from '../shared/components/placeholder-page'
import { matchRoutePath, normalizePathname, type RouteParams } from './route-params'

export type RouteName = 'home' | 'user' | 'repository' | 'favorites' | 'not-found'

export interface RouteContext {
  name: RouteName
  pathname: string
  params: RouteParams
  searchParams: URLSearchParams
}

export interface RouteDefinition {
  name: RouteName
  path: string
  createPage(context: RouteContext): HTMLElement
}

export interface MatchedRoute {
  definition: RouteDefinition
  context: RouteContext
}

const ROUTE_DEFINITIONS: RouteDefinition[] = [
  {
    name: 'home',
    path: '/',
    createPage: createHomeRoutePage,
  },
  {
    name: 'user',
    path: '/user/:username',
    createPage: createUserRoutePage,
  },
  {
    name: 'repository',
    path: '/repo/:owner/:repo',
    createPage: createRepositoryRoutePage,
  },
  {
    name: 'favorites',
    path: '/favorites',
    createPage: createFavoritesRoutePage,
  },
]

const NOT_FOUND_ROUTE: RouteDefinition = {
  name: 'not-found',
  path: '*',
  createPage: createNotFoundRoutePage,
}

export function matchRoute(pathname: string, search: string): MatchedRoute {
  const normalizedPathname = normalizePathname(pathname)
  const searchParams = new URLSearchParams(search)

  for (const routeDefinition of ROUTE_DEFINITIONS) {
    const matchedParams = matchRoutePath(routeDefinition.path, normalizedPathname)

    if (!matchedParams) {
      continue
    }

    return {
      definition: routeDefinition,
      context: createRouteContext(
        routeDefinition.name,
        normalizedPathname,
        matchedParams,
        searchParams,
      ),
    }
  }

  return {
    definition: NOT_FOUND_ROUTE,
    context: createRouteContext(
      NOT_FOUND_ROUTE.name,
      normalizedPathname,
      {},
      searchParams,
    ),
  }
}

export function buildDocumentTitle(context: RouteContext): string {
  if (context.name === 'home') {
    return 'Home'
  }

  if (context.name === 'user') {
    return `User ${context.params.username}`
  }

  if (context.name === 'repository') {
    return `Repository ${context.params.owner}/${context.params.repo}`
  }

  if (context.name === 'favorites') {
    return 'Favorites'
  }

  return 'Page not found'
}

function createRouteContext(
  name: RouteName,
  pathname: string,
  params: RouteParams,
  searchParams: URLSearchParams,
): RouteContext {
  return {
    name,
    pathname,
    params,
    searchParams,
  }
}

function createHomeRoutePage(): HTMLElement {
  return createHomePage()
}

function createUserRoutePage(context: RouteContext): HTMLElement {
  const userListQuery = parseUserListQuery(
    context.params.username,
    context.searchParams,
  )

  return createUserPage({
    query: userListQuery,
  })
}

function createRepositoryRoutePage(context: RouteContext): HTMLElement {
  return createRepositoryPage({
    owner: context.params.owner,
    repositoryName: context.params.repo,
  })
}

function createFavoritesRoutePage(): HTMLElement {
  return createPlaceholderPage({
    eyebrow: 'Favorites route',
    title: 'The optional favorites route is already mapped.',
    description:
      'This route is available early so the navigation structure does not need to change when favorites persistence is introduced.',
    actions: [
      {
        href: '/',
        label: 'Back to home',
        variant: 'primary',
      },
      {
        href: '/user/octocat',
        label: 'Open sample user route',
        variant: 'secondary',
      },
    ],
    details: [
      {
        title: 'Route pattern',
        description: 'The favorites page is mapped to "/favorites".',
      },
      {
        title: 'Reasoning',
        description:
          'Keeping this route in place now avoids changing the navigation contract later.',
      },
      {
        title: 'Future step',
        description:
          'The page will later render repositories persisted in local storage.',
      },
    ],
    note: 'Favorites persistence will be implemented in the dedicated feature step.',
  })
}

function createNotFoundRoutePage(context: RouteContext): HTMLElement {
  return createPlaceholderPage({
    eyebrow: 'Fallback route',
    title: 'No route matched the current URL.',
    description:
      'The router falls back to a dedicated not-found screen when the pathname is outside the declared route table.',
    actions: [
      {
        href: '/',
        label: 'Return home',
        variant: 'primary',
      },
    ],
    details: [
      {
        title: 'Requested pathname',
        description: context.pathname,
      },
      {
        title: 'Status',
        description: 'A route definition was not found for this location.',
      },
      {
        title: 'Navigation fallback',
        description: 'Use the button above to get back to a valid page.',
      },
    ],
  })
}
