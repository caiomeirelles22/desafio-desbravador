import { escapeHtml } from '../utils/dom'

export interface PlaceholderAction {
  href: string
  label: string
  variant: 'primary' | 'secondary'
}

export interface PlaceholderDetail {
  title: string
  description: string
}

export interface PlaceholderPageContent {
  eyebrow: string
  title: string
  description: string
  actions: PlaceholderAction[]
  details: PlaceholderDetail[]
  note?: string
}

export function createPlaceholderPage(content: PlaceholderPageContent): HTMLElement {
  const pageElement = document.createElement('section')

  pageElement.className = 'page-panel'
  pageElement.innerHTML = `
    <div class="page-header">
      <div class="page-copy">
        <span class="section-kicker">${escapeHtml(content.eyebrow)}</span>
        <h2 class="section-title">${escapeHtml(content.title)}</h2>
        <p class="section-description">${escapeHtml(content.description)}</p>
      </div>
      ${createActionsMarkup(content.actions)}
    </div>
    ${createDetailsMarkup(content.details)}
    ${createNoteMarkup(content.note)}
  `

  return pageElement
}

function createActionsMarkup(actions: PlaceholderAction[]): string {
  if (actions.length === 0) {
    return ''
  }

  let actionsMarkup = '<div class="page-actions">'

  for (const action of actions) {
    actionsMarkup += `
      <a
        class="page-action page-action--${action.variant}"
        href="${escapeHtml(action.href)}"
        data-link
      >
        ${escapeHtml(action.label)}
      </a>
    `
  }

  actionsMarkup += '</div>'

  return actionsMarkup
}

function createDetailsMarkup(details: PlaceholderDetail[]): string {
  if (details.length === 0) {
    return ''
  }

  let detailsMarkup = '<div class="page-grid">'

  for (const detail of details) {
    detailsMarkup += `
      <article class="page-card">
        <h3 class="page-card-title">${escapeHtml(detail.title)}</h3>
        <p class="page-card-description">${escapeHtml(detail.description)}</p>
      </article>
    `
  }

  detailsMarkup += '</div>'

  return detailsMarkup
}

function createNoteMarkup(note?: string): string {
  if (!note) {
    return ''
  }

  return `<p class="page-note">${escapeHtml(note)}</p>`
}
