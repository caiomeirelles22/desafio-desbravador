import { escapeHtml } from '../../../shared/utils/dom'
import { formatDate, formatNumber } from '../../../shared/utils/formatters'
import type { GitHubRepository } from '../types/repository.types'

export function createRepositoryCardMarkup(repository: GitHubRepository): string {
  const badges = createRepositoryBadgesMarkup(repository)
  const description = repository.description
    ? escapeHtml(repository.description)
    : 'Sem descricao informada.'

  return `
    <article class="repository-card">
      <div class="repository-card-header">
        <div>
          <a
            class="repository-card-title"
            href="/repo/${encodeURIComponent(repository.owner.login)}/${encodeURIComponent(repository.name)}"
            data-link
          >
            ${escapeHtml(repository.name)}
          </a>
          <p class="repository-card-full-name">${escapeHtml(repository.fullName)}</p>
        </div>
        <div class="repository-card-badges">
          ${badges}
        </div>
      </div>
      <p class="repository-card-description">${description}</p>
      <div class="repository-card-meta">
        <span>Linguagem: ${escapeHtml(repository.language ?? 'Nao informada')}</span>
        <span>Stars: ${formatNumber(repository.stargazersCount)}</span>
        <span>Forks: ${formatNumber(repository.forksCount)}</span>
        <span>Atualizado em ${escapeHtml(formatDate(repository.updatedAt))}</span>
      </div>
    </article>
  `
}

function createRepositoryBadgesMarkup(repository: GitHubRepository): string {
  let badgesMarkup = ''

  if (repository.isPrivate) {
    badgesMarkup += '<span class="repository-badge">Privado</span>'
  }

  if (repository.isFork) {
    badgesMarkup += '<span class="repository-badge repository-badge--muted">Fork</span>'
  }

  return badgesMarkup
}
