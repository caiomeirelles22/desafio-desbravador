import { escapeHtml } from '../../../shared/utils/dom'
import type {
  PaginationMeta,
  UserPageQuery,
} from '../types/github-user.types'
import { buildUserListRouteWithPatch } from '../utils/build-user-list-query'

type PaginationItem = number | 'ellipsis'

export interface PaginationNavContent {
  pagination: PaginationMeta
  query: UserPageQuery
}

export function createPaginationNavMarkup(content: PaginationNavContent): string {
  if (content.pagination.totalPages <= 1) {
    return ''
  }

  const items = createPaginationItems(
    content.pagination.currentPage,
    content.pagination.totalPages,
  )
  let itemsMarkup = ''

  for (const item of items) {
    if (item === 'ellipsis') {
      itemsMarkup += '<span class="pagination-ellipsis" aria-hidden="true">...</span>'
      continue
    }

    const isCurrentPage = item === content.pagination.currentPage

    itemsMarkup += `
      <a
        class="pagination-link ${isCurrentPage ? 'is-current' : ''}"
        href="${buildUserListRouteWithPatch(content.query, { page: item })}"
        data-link
        ${isCurrentPage ? 'aria-current="page"' : ''}
      >
        ${item}
      </a>
    `
  }

  return `
    <nav class="pagination-nav" aria-label="Paginacao dos repositorios">
      <a
        class="pagination-link pagination-link--ghost ${content.pagination.hasPreviousPage ? '' : 'is-disabled'}"
        href="${content.pagination.hasPreviousPage ? buildUserListRouteWithPatch(content.query, { page: content.pagination.currentPage - 1 }) : '#'}"
        ${content.pagination.hasPreviousPage ? 'data-link' : 'aria-disabled="true" tabindex="-1"'}
      >
        Anterior
      </a>
      <div class="pagination-pages">
        ${itemsMarkup}
      </div>
      <a
        class="pagination-link pagination-link--ghost ${content.pagination.hasNextPage ? '' : 'is-disabled'}"
        href="${content.pagination.hasNextPage ? buildUserListRouteWithPatch(content.query, { page: content.pagination.currentPage + 1 }) : '#'}"
        ${content.pagination.hasNextPage ? 'data-link' : 'aria-disabled="true" tabindex="-1"'}
      >
        Proxima
      </a>
      <p class="pagination-summary">
        Pagina ${content.pagination.currentPage} de ${escapeHtml(String(content.pagination.totalPages))}
      </p>
    </nav>
  `
}

function createPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return createSequentialItems(1, totalPages)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ]
}

function createSequentialItems(start: number, end: number): number[] {
  const items: number[] = []

  for (let currentValue = start; currentValue <= end; currentValue += 1) {
    items.push(currentValue)
  }

  return items
}
