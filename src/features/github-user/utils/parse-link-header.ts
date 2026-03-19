import type { PaginationMeta } from '../types/github-user.types'

type LinkRelationName = 'first' | 'prev' | 'next' | 'last'

interface LinkRelationPages {
  first: number | null
  last: number | null
  next: number | null
  prev: number | null
}

interface PaginationMetaOptions {
  currentPage: number
  itemCount: number
  linkHeader: string | null
  perPage: number
}

export function createPaginationMetaFromLinkHeader(
  options: PaginationMetaOptions,
): PaginationMeta {
  const relationPages = parseLinkRelationPages(options.linkHeader)
  const totalPages = resolveTotalPages(options, relationPages)

  return {
    currentPage: options.currentPage,
    hasNextPage: relationPages.next !== null,
    hasPreviousPage: relationPages.prev !== null || options.currentPage > 1,
    perPage: options.perPage,
    totalPages,
  }
}

function parseLinkRelationPages(linkHeader: string | null): LinkRelationPages {
  const relationPages = createEmptyLinkRelationPages()

  if (!linkHeader || linkHeader.trim() === '') {
    return relationPages
  }

  const linkEntries = linkHeader.split(',')

  for (const linkEntry of linkEntries) {
    const parsedLinkEntry = parseLinkEntry(linkEntry)

    if (!parsedLinkEntry) {
      continue
    }

    relationPages[parsedLinkEntry.relation] = parsedLinkEntry.page
  }

  return relationPages
}

function createEmptyLinkRelationPages(): LinkRelationPages {
  return {
    first: null,
    last: null,
    next: null,
    prev: null,
  }
}

function parseLinkEntry(
  linkEntry: string,
): { page: number; relation: LinkRelationName } | null {
  const matchedEntry = linkEntry.match(/<([^>]+)>\s*;\s*rel="([^"]+)"/)

  if (!matchedEntry) {
    return null
  }

  const urlValue = matchedEntry[1]
  const relationValue = matchedEntry[2]

  if (!isLinkRelationName(relationValue)) {
    return null
  }

  const page = parsePageFromUrl(urlValue)

  if (page === null) {
    return null
  }

  return {
    page,
    relation: relationValue,
  }
}

function parsePageFromUrl(urlValue: string): number | null {
  let parsedUrl: URL

  try {
    parsedUrl = new URL(urlValue)
  } catch {
    return null
  }

  const pageValue = parsedUrl.searchParams.get('page')

  if (!pageValue) {
    return null
  }

  const parsedPage = Number(pageValue)

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return null
  }

  return parsedPage
}

function isLinkRelationName(value: string): value is LinkRelationName {
  return value === 'first' || value === 'prev' || value === 'next' || value === 'last'
}

function resolveTotalPages(
  options: PaginationMetaOptions,
  relationPages: LinkRelationPages,
): number {
  if (relationPages.last !== null) {
    return Math.max(relationPages.last, 1)
  }

  if (relationPages.next !== null) {
    return Math.max(relationPages.next, options.currentPage + 1)
  }

  if (relationPages.prev !== null && options.itemCount === 0) {
    return Math.max(relationPages.prev, 1)
  }

  if (options.itemCount < options.perPage) {
    return Math.max(options.currentPage, 1)
  }

  return Math.max(options.currentPage, 1)
}
