import {
  DEFAULT_USER_PAGE,
  type UserPageQuery,
  type UserPageQueryPatch,
} from '../types/github-user.types'
import {
  normalizeRepoSort,
  normalizeSortDirection,
  normalizeUserPageNumber,
  normalizeUserRepositoriesPerPage,
} from './parse-user-list-query'

export function buildUserListQuery(query: UserPageQuery): string {
  const normalizedQuery = normalizeUserPageQuery(query)
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(normalizedQuery.page))
  searchParams.set('perPage', String(normalizedQuery.perPage))
  searchParams.set('sort', normalizedQuery.sort)
  searchParams.set('direction', normalizedQuery.direction)

  return searchParams.toString()
}

export function buildUserListRoute(query: UserPageQuery): string {
  const queryString = buildUserListQuery(query)

  return `/user/${encodeURIComponent(query.username)}?${queryString}`
}

export function buildUserListRouteWithPatch(
  query: UserPageQuery,
  patch: UserPageQueryPatch,
): string {
  return buildUserListRoute(applyUserPageQueryPatch(query, patch))
}

export function applyUserPageQueryPatch(
  query: UserPageQuery,
  patch: UserPageQueryPatch,
): UserPageQuery {
  const nextSort =
    patch.sort !== undefined ? normalizeRepoSort(patch.sort) : query.sort
  const nextDirection =
    patch.direction !== undefined
      ? normalizeSortDirection(patch.direction)
      : query.direction
  const nextPerPage =
    patch.perPage !== undefined
      ? normalizeUserRepositoriesPerPage(patch.perPage)
      : query.perPage
  const shouldResetPage =
    nextSort !== query.sort ||
    nextDirection !== query.direction ||
    nextPerPage !== query.perPage
  let nextPage = query.page

  if (shouldResetPage) {
    nextPage = DEFAULT_USER_PAGE
  } else if (patch.page !== undefined) {
    nextPage = normalizeUserPageNumber(patch.page)
  }

  return {
    direction: nextDirection,
    page: nextPage,
    perPage: nextPerPage,
    sort: nextSort,
    username: query.username,
  }
}

function normalizeUserPageQuery(query: UserPageQuery): UserPageQuery {
  return {
    direction: normalizeSortDirection(query.direction),
    page: normalizeUserPageNumber(query.page),
    perPage: normalizeUserRepositoriesPerPage(query.perPage),
    sort: normalizeRepoSort(query.sort),
    username: query.username,
  }
}
