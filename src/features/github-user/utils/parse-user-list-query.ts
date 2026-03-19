import {
  DEFAULT_REPO_SORT,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_USER_PAGE,
  DEFAULT_USER_REPOSITORIES_PER_PAGE,
  VALID_REPO_SORTS,
  VALID_SORT_DIRECTIONS,
  VALID_USER_REPOSITORIES_PER_PAGE_OPTIONS,
  type RepoSort,
  type SortDirection,
  type UserPageQuery,
} from '../types/github-user.types'

export function parseUserListQuery(
  username: string,
  searchParamsInput: URLSearchParams | string,
): UserPageQuery {
  const searchParams = createSearchParams(searchParamsInput)

  return {
    direction: normalizeSortDirection(searchParams.get('direction')),
    page: normalizeUserPageNumber(searchParams.get('page')),
    perPage: normalizeUserRepositoriesPerPage(searchParams.get('perPage')),
    sort: normalizeRepoSort(searchParams.get('sort')),
    username,
  }
}

export function normalizeUserPageNumber(value: number | string | null | undefined): number {
  const parsedValue = parseInteger(value)

  if (parsedValue !== null && parsedValue >= 1) {
    return parsedValue
  }

  return DEFAULT_USER_PAGE
}

export function normalizeUserRepositoriesPerPage(
  value: number | string | null | undefined,
): number {
  const parsedValue = parseInteger(value)

  if (
    parsedValue !== null &&
    VALID_USER_REPOSITORIES_PER_PAGE_OPTIONS.includes(parsedValue)
  ) {
    return parsedValue
  }

  return DEFAULT_USER_REPOSITORIES_PER_PAGE
}

export function normalizeRepoSort(value: string | null | undefined): RepoSort {
  if (value && isRepoSort(value)) {
    return value
  }

  return DEFAULT_REPO_SORT
}

export function normalizeSortDirection(
  value: string | null | undefined,
): SortDirection {
  if (value && isSortDirection(value)) {
    return value
  }

  return DEFAULT_SORT_DIRECTION
}

function createSearchParams(
  searchParamsInput: URLSearchParams | string,
): URLSearchParams {
  if (searchParamsInput instanceof URLSearchParams) {
    return searchParamsInput
  }

  return new URLSearchParams(searchParamsInput)
}

function parseInteger(value: number | string | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : null
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }

  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue)) {
    return null
  }

  return parsedValue
}

function isRepoSort(value: string): value is RepoSort {
  return VALID_REPO_SORTS.includes(value as RepoSort)
}

function isSortDirection(value: string): value is SortDirection {
  return VALID_SORT_DIRECTIONS.includes(value as SortDirection)
}
