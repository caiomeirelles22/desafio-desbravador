import { escapeHtml } from '../../../shared/utils/dom'

export interface ErrorStateContent {
  description: string
  title: string
}

export function createErrorStateMarkup(content: ErrorStateContent): string {
  return `
    <section class="status-card status-card--error">
      <span class="status-card-kicker">Erro</span>
      <h3 class="status-card-title">${escapeHtml(content.title)}</h3>
      <p class="status-card-description">${escapeHtml(content.description)}</p>
    </section>
  `
}
