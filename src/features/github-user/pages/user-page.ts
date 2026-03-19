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
    eyebrow: 'User route',
    title: `User route matched for "${query.username}".`,
    description:
      'The user list query is now parsed, normalized and rebuilt from the URL before the page consumes it.',
    actions: [
      {
        href: buildUserListRouteWithPatch(query, { page: query.page + 1 }),
        label: 'Go to next page',
        variant: 'primary',
      },
      {
        href: buildUserListRouteWithPatch(query, { sort: getAlternativeSort(query.sort) }),
        label: 'Change sort',
        variant: 'secondary',
      },
      {
        href: buildUserListRouteWithPatch(query, {
          direction: query.direction === 'asc' ? 'desc' : 'asc',
        }),
        label: 'Flip direction',
        variant: 'secondary',
      },
      {
        href: buildUserListRouteWithPatch(query, {
          perPage: getAlternativePerPage(query.perPage),
        }),
        label: 'Change per page',
        variant: 'secondary',
      },
    ],
    details: [
      {
        title: 'Path params',
        description: `Resolved username param: ${query.username}.`,
      },
      {
        title: 'Normalized query',
        description: `?${buildUserListQuery(query)}`,
      },
      {
        title: 'Current controls',
        description: `page=${query.page}, perPage=${query.perPage}, sort=${query.sort}, direction=${query.direction}.`,
      },
      {
        title: 'Navigation rule',
        description:
          'Changing sort, direction or perPage resets the page to 1; changing only the page keeps the other params.',
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
