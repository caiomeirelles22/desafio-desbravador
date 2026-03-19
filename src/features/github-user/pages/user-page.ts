import {
  buildUserListQuery,
  buildUserListRouteWithPatch,
} from '../utils/build-user-list-query'
import { createPlaceholderPage } from '../../../shared/components/placeholder-page'
import {
  VALID_USER_REPOSITORIES_PER_PAGE_OPTIONS,
  type RepoSort,
  type UserPageQuery,
} from '../types/github-user.types'

export interface UserPageContent {
  query: UserPageQuery
}

export function createUserPage(content: UserPageContent): HTMLElement {
  const query = content.query

  return createPlaceholderPage({
    eyebrow: 'Rota do usuario',
    title: `Rota do usuario carregada para "${query.username}".`,
    description:
      'A query da listagem agora e lida, normalizada e reconstruida a partir da URL antes de a pagina consumir o estado.',
    actions: [
      {
        href: buildUserListRouteWithPatch(query, { page: query.page + 1 }),
        label: 'Ir para proxima pagina',
        variant: 'primary',
      },
      {
        href: buildUserListRouteWithPatch(query, { sort: getAlternativeSort(query.sort) }),
        label: 'Trocar ordenacao',
        variant: 'secondary',
      },
      {
        href: buildUserListRouteWithPatch(query, {
          direction: query.direction === 'asc' ? 'desc' : 'asc',
        }),
        label: 'Inverter direcao',
        variant: 'secondary',
      },
      {
        href: buildUserListRouteWithPatch(query, {
          perPage: getAlternativePerPage(query.perPage),
        }),
        label: 'Trocar por pagina',
        variant: 'secondary',
      },
    ],
    details: [
      {
        title: 'Parametros da rota',
        description: `Parametro de username resolvido: ${query.username}.`,
      },
      {
        title: 'Query normalizada',
        description: `?${buildUserListQuery(query)}`,
      },
      {
        title: 'Controles atuais',
        description: `page=${query.page}, perPage=${query.perPage}, sort=${query.sort}, direction=${query.direction}.`,
      },
      {
        title: 'Regra de navegacao',
        description:
          'Trocar sort, direction ou perPage reseta a pagina para 1; mudar apenas a pagina preserva os outros parametros.',
      },
    ],
  })
}

function getAlternativeSort(currentSort: RepoSort): RepoSort {
  if (currentSort === 'updated') {
    return 'created'
  }

  return 'updated'
}

function getAlternativePerPage(currentPerPage: number): number {
  const currentIndex = VALID_USER_REPOSITORIES_PER_PAGE_OPTIONS.indexOf(currentPerPage)

  if (currentIndex === -1) {
    return VALID_USER_REPOSITORIES_PER_PAGE_OPTIONS[0]
  }

  const nextIndex =
    (currentIndex + 1) % VALID_USER_REPOSITORIES_PER_PAGE_OPTIONS.length

  return VALID_USER_REPOSITORIES_PER_PAGE_OPTIONS[nextIndex]
}
