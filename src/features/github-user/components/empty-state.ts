import { escapeHtml } from '../../../shared/utils/dom'

export interface EmptyStateContent {
  actionHref?: string
  actionLabel?: string
  description: string
  kicker?: string
  title: string
}

export function createEmptyStateMarkup(content: EmptyStateContent): string {
  return `
    <section class="status-card status-card--empty">
      <span class="status-card-kicker">${escapeHtml(content.kicker ?? 'Sem resultados')}</span>
      <h3 class="status-card-title">${escapeHtml(content.title)}</h3>
      <p class="status-card-description">${escapeHtml(content.description)}</p>
      ${createStateActionMarkup(content.actionHref, content.actionLabel)}
    </section>
  `
}

function createStateActionMarkup(
  actionHref?: string,
  actionLabel?: string,
): string {
  if (!actionHref || !actionLabel) {
    return ''
  }

  return `
    <a class="status-card-action" href="${escapeHtml(actionHref)}" data-link>
      ${escapeHtml(actionLabel)}
    </a>
  `
}
