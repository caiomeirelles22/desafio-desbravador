import { escapeHtml } from '../../../shared/utils/dom'
import { formatNumber } from '../../../shared/utils/formatters'
import type { GitHubUser } from '../types/github-user.types'

export function createUserProfileCardMarkup(user: GitHubUser): string {
  const metadataItems = createMetadataItems(user)
  let metadataMarkup = ''

  for (const item of metadataItems) {
    metadataMarkup += `
      <li class="user-profile-meta-item">
        <span class="user-profile-meta-label">${escapeHtml(item.label)}</span>
        <span class="user-profile-meta-value">${item.value}</span>
      </li>
    `
  }

  return `
    <section class="user-profile-card">
      <div class="user-profile-copy">
        <span class="section-kicker">Perfil</span>
        <h2 class="user-profile-name">${escapeHtml(user.name ?? user.login)}</h2>
      </div>
      <div class="user-profile-header">
        <img
          class="user-profile-avatar"
          src="${escapeHtml(user.avatarUrl)}"
          alt="Avatar de ${escapeHtml(user.login)}"
          width="104"
          height="104"
        />
        <div class="user-profile-identity">
          <p class="user-profile-login">@${escapeHtml(user.login)}</p>
        </div>
      </div>
      <p class="user-profile-bio">${escapeHtml(user.bio ?? 'Sem biografia informada.')}</p>
      <dl class="user-profile-stats">
        ${createStatMarkup('Seguidores', formatNumber(user.followers))}
        ${createStatMarkup('Seguindo', formatNumber(user.following))}
        ${createStatMarkup('Repositorios', formatNumber(user.publicRepos))}
        ${createStatMarkup('Gists', formatNumber(user.publicGists))}
      </dl>
      <ul class="user-profile-meta">
        ${metadataMarkup}
      </ul>
      <a
        class="user-profile-link"
        href="${escapeHtml(user.htmlUrl)}"
        target="_blank"
        rel="noreferrer"
      >
        Ver perfil no GitHub
      </a>
    </section>
  `
}

function createStatMarkup(label: string, value: string): string {
  return `
    <div class="user-profile-stat">
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `
}

function createMetadataItems(user: GitHubUser): Array<{ label: string; value: string }> {
  const items: Array<{ label: string; value: string }> = []

  if (user.company) {
    items.push({
      label: 'Empresa',
      value: escapeHtml(user.company),
    })
  }

  if (user.location) {
    items.push({
      label: 'Localizacao',
      value: escapeHtml(user.location),
    })
  }

  if (user.email) {
    items.push({
      label: 'E-mail',
      value: escapeHtml(user.email),
    })
  }

  if (user.blog) {
    items.push({
      label: 'Site',
      value: createOptionalLinkMarkup(user.blog),
    })
  }

  return items
}

function createOptionalLinkMarkup(rawValue: string): string {
  const normalizedValue = normalizeExternalUrl(rawValue)

  if (!normalizedValue) {
    return escapeHtml(rawValue)
  }

  return `
    <a href="${escapeHtml(normalizedValue)}" target="_blank" rel="noreferrer">
      ${escapeHtml(rawValue)}
    </a>
  `
}

function normalizeExternalUrl(rawValue: string): string | null {
  const value = rawValue.trim()

  if (value === '') {
    return null
  }

  try {
    return new URL(value).toString()
  } catch {
    try {
      return new URL(`https://${value}`).toString()
    } catch {
      return null
    }
  }
}
