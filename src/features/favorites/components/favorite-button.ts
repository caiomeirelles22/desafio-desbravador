import { escapeHtml } from '../../../shared/utils/dom'

export interface FavoriteButtonContent {
  isActive: boolean
}

export function createFavoriteButtonMarkup(
  content: FavoriteButtonContent,
): string {
  const label = content.isActive
    ? 'Remover dos favoritos'
    : 'Salvar nos favoritos'

  return `
    <button
      class="favorite-button ${content.isActive ? 'is-active' : ''}"
      type="button"
      data-favorite-toggle
      aria-pressed="${content.isActive ? 'true' : 'false'}"
    >
      <span class="favorite-button-icon" aria-hidden="true">${
        content.isActive ? '★' : '☆'
      }</span>
      <span>${escapeHtml(label)}</span>
    </button>
  `
}
