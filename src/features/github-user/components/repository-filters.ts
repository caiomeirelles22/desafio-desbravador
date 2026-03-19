import { escapeHtml } from '../../../shared/utils/dom'
import type {
  PaginationMeta,
  RepoSort,
  SortDirection,
  UserPageQuery,
} from '../types/github-user.types'

export interface RepositoryFiltersContent {
  pagination: PaginationMeta
  query: UserPageQuery
  repositoriesCount: number
}

export function createRepositoryFiltersMarkup(
  content: RepositoryFiltersContent,
): string {
  return `
    <section class="user-section-card">
      <div class="user-section-header">
        <div>
          <span class="section-kicker">Repositorios</span>
          <h3 class="user-section-title">Lista do usuario</h3>
        </div>
        <p class="user-section-meta">
          ${content.repositoriesCount} repositorio(s) nesta pagina
        </p>
      </div>
      <div class="repository-filters">
        <label class="filter-field">
          <span class="filter-label">Ordenar por</span>
          <select class="filter-select" data-filter-control="sort">
            ${createSortOptionsMarkup(content.query.sort)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">Direcao</span>
          <select class="filter-select" data-filter-control="direction">
            ${createDirectionOptionsMarkup(content.query.direction)}
          </select>
        </label>
        <label class="filter-field">
          <span class="filter-label">Por pagina</span>
          <select class="filter-select" data-filter-control="per-page">
            ${createPerPageOptionsMarkup(content.query.perPage)}
          </select>
        </label>
        <div class="filter-summary">
          <span>Pagina atual: ${content.pagination.currentPage}</span>
          <span>Total estimado: ${content.pagination.totalPages}</span>
        </div>
      </div>
    </section>
  `
}

function createSortOptionsMarkup(currentSort: RepoSort): string {
  return [
    createOptionMarkup('created', 'Criacao', currentSort === 'created'),
    createOptionMarkup('updated', 'Atualizacao', currentSort === 'updated'),
    createOptionMarkup('pushed', 'Ultimo push', currentSort === 'pushed'),
    createOptionMarkup('full_name', 'Nome completo', currentSort === 'full_name'),
  ].join('')
}

function createDirectionOptionsMarkup(currentDirection: SortDirection): string {
  return [
    createOptionMarkup('desc', 'Decrescente', currentDirection === 'desc'),
    createOptionMarkup('asc', 'Crescente', currentDirection === 'asc'),
  ].join('')
}

function createPerPageOptionsMarkup(currentPerPage: number): string {
  return [
    createOptionMarkup('10', '10', currentPerPage === 10),
    createOptionMarkup('20', '20', currentPerPage === 20),
    createOptionMarkup('30', '30', currentPerPage === 30),
    createOptionMarkup('50', '50', currentPerPage === 50),
  ].join('')
}

function createOptionMarkup(
  value: string,
  label: string,
  isSelected: boolean,
): string {
  return `
    <option value="${escapeHtml(value)}" ${isSelected ? 'selected' : ''}>
      ${escapeHtml(label)}
    </option>
  `
}
