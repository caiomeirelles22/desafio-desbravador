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
    return 'Inicio'
  }

  if (context.name === 'user') {
    return `Usuario ${context.params.username}`
  }

  if (context.name === 'repository') {
    return `Repositorio ${context.params.owner}/${context.params.repo}`
  }

  if (context.name === 'favorites') {
    return 'Favoritos'
  }

  return 'Pagina nao encontrada'
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
    eyebrow: 'Rota de favoritos',
    title: 'A rota opcional de favoritos ja esta mapeada.',
    description:
      'Essa rota entra cedo para que a estrutura de navegacao nao precise mudar quando a persistencia de favoritos for ligada.',
    actions: [
      {
        href: '/',
        label: 'Voltar para o inicio',
        variant: 'primary',
      },
      {
        href: '/user/octocat',
        label: 'Abrir usuario de exemplo',
        variant: 'secondary',
      },
    ],
    details: [
      {
        title: 'Padrao da rota',
        description: 'A pagina de favoritos esta mapeada em "/favorites".',
      },
      {
        title: 'Motivacao',
        description:
          'Manter essa rota agora evita trocar o contrato de navegacao mais tarde.',
      },
      {
        title: 'Proxima etapa',
        description:
          'A pagina vai renderizar depois os repositorios persistidos no armazenamento local.',
      },
    ],
    note: 'A persistencia de favoritos sera implementada na etapa dedicada da feature.',
  })
}

function createNotFoundRoutePage(context: RouteContext): HTMLElement {
  return createPlaceholderPage({
    eyebrow: 'Rota de fallback',
    title: 'Nenhuma rota correspondeu a URL atual.',
    description:
      'O router cai em uma tela dedicada de nao encontrado quando o pathname fica fora da tabela de rotas declarada.',
    actions: [
      {
        href: '/',
        label: 'Voltar para o inicio',
        variant: 'primary',
      },
    ],
    details: [
      {
        title: 'Pathname solicitado',
        description: context.pathname,
      },
      {
        title: 'Status',
        description: 'Nao foi encontrada uma definicao de rota para essa localizacao.',
      },
      {
        title: 'Fallback de navegacao',
        description: 'Use o botao acima para voltar a uma pagina valida.',
      },
    ],
  })
}
