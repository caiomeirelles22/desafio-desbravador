import { escapeHtml } from '../../../shared/utils/dom'

export interface EmptyStateContent {
  description: string
  title: string
}

export function createEmptyStateMarkup(content: EmptyStateContent): string {
  return `
    <section class="status-card status-card--empty">
      <span class="status-card-kicker">Sem resultados</span>
      <h3 class="status-card-title">${escapeHtml(content.title)}</h3>
      <p class="status-card-description">${escapeHtml(content.description)}</p>
    </section>
  `
}
