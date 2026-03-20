import { createFavoriteButtonMarkup } from '../../favorites/components/favorite-button'
import {
  favoritesStore,
  type FavoriteRepository,
} from '../../favorites/stores/favorites.store'
import { escapeHtml, observeElementRemoval } from '../../../shared/utils/dom'
import { formatDate, formatNumber } from '../../../shared/utils/formatters'
import { createEmptyStateMarkup } from '../components/empty-state'
import { createErrorStateMarkup } from '../components/error-state'
import {
  createRepositoryDetailsSkeletonMarkup,
  createRepositorySidebarSkeletonMarkup,
} from '../components/skeletons'
import { getRepositoryDetails } from '../services/github.service'
import {
  createRepositoryDetailsStore,
  type RepositoryDetailsStore,
} from '../stores/repository-details.store'
import type { GitHubRepositoryDetails } from '../types/repository.types'
import { getGitHubErrorMessage } from '../utils/github-errors'

export interface RepositoryPageContent {
  owner: string
  repositoryName: string
}

export function createRepositoryPage(content: RepositoryPageContent): HTMLElement {
  const pageElement = document.createElement('section')
  const detailsStore = createRepositoryDetailsStore()

  pageElement.className = 'repository-page'

  favoritesStore.hydrateFavoriteRepositories()
  detailsStore.setRepositoryLoading()

  const unsubscribeDetails = detailsStore.subscribe(function handleDetailsState(): void {
    renderRepositoryPage(pageElement, content, detailsStore)
  })
  const unsubscribeFavorites = favoritesStore.subscribe(function handleFavoritesState(): void {
    renderRepositoryPage(pageElement, content, detailsStore)
  })

  pageElement.addEventListener('click', handlePageClick)

  observeElementRemoval(pageElement, function handlePageRemoval(): void {
    pageElement.removeEventListener('click', handlePageClick)
    unsubscribeDetails()
    unsubscribeFavorites()
  })

  renderRepositoryPage(pageElement, content, detailsStore)
  void loadRepositoryPageData(pageElement, content, detailsStore)

  return pageElement

  function handlePageClick(event: MouseEvent): void {
    const targetElement = event.target

    if (!(targetElement instanceof Element)) {
      return
    }

    const favoriteButtonElement = targetElement.closest<HTMLButtonElement>(
      'button[data-favorite-toggle]',
    )

    if (!favoriteButtonElement) {
      return
    }

    const repository = detailsStore.getState().repository

    if (!repository) {
      return
    }

    favoritesStore.toggleFavoriteRepository(mapFavoriteRepository(repository))
  }
}

async function loadRepositoryPageData(
  pageElement: HTMLElement,
  content: RepositoryPageContent,
  detailsStore: RepositoryDetailsStore,
): Promise<void> {
  try {
    const repository = await getRepositoryDetails(
      `${content.owner}/${content.repositoryName}`,
    )

    if (!pageElement.isConnected) {
      return
    }

    detailsStore.setRepository(repository)
  } catch (error: unknown) {
    if (!pageElement.isConnected) {
      return
    }

    detailsStore.setRepositoryError(getGitHubErrorMessage(error, 'repository'))
  }
}

function renderRepositoryPage(
  pageElement: HTMLElement,
  content: RepositoryPageContent,
  detailsStore: RepositoryDetailsStore,
): void {
  const state = detailsStore.getState()
  const repository = state.repository

  pageElement.innerHTML = `
    <div class="repository-page-layout">
      ${createRepositoryMainSectionMarkup(content, repository, state.loading, state.error)}
      ${createRepositorySidebarMarkup(repository, state.loading, state.error)}
    </div>
  `
}

function createRepositoryMainSectionMarkup(
  content: RepositoryPageContent,
  repository: GitHubRepositoryDetails | null,
  isLoading: boolean,
  errorMessage: string | null,
): string {
  if (isLoading) {
    return createRepositoryDetailsSkeletonMarkup()
  }

  if (errorMessage) {
    return `
      <section class="repository-main-card">
        ${createErrorStateMarkup({
          actionHref: `/user/${encodeURIComponent(content.owner)}`,
          actionLabel: 'Voltar para o usuario',
          description: errorMessage,
          title: 'Nao foi possivel carregar o repositorio.',
        })}
      </section>
    `
  }

  if (!repository) {
    return `
      <section class="repository-main-card">
        ${createEmptyStateMarkup({
          actionHref: '/',
          actionLabel: 'Ir para o inicio',
          description: `Nenhum detalhe foi encontrado para "${content.owner}/${content.repositoryName}".`,
          title: 'Repositorio indisponivel.',
        })}
      </section>
    `
  }

  return `
    <section class="repository-main-card">
      <div class="repository-hero">
        <div class="repository-hero-copy">
          <span class="section-kicker">Repositorio</span>
          <h2 class="section-title">${escapeHtml(repository.name)}</h2>
          <p class="repository-hero-full-name">${escapeHtml(repository.fullName)}</p>
          <p class="section-description">
            ${escapeHtml(
              repository.description ?? 'Sem descricao informada para este repositorio.',
            )}
          </p>
        </div>
        <div class="repository-hero-actions">
          ${createFavoriteButtonMarkup({
            isActive: favoritesStore.hasFavoriteRepository(repository.fullName),
          })}
          <a
            class="page-action page-action--primary"
            href="${escapeHtml(repository.htmlUrl)}"
            target="_blank"
            rel="noreferrer"
          >
            Abrir no GitHub
          </a>
          <a
            class="page-action page-action--secondary"
            href="/user/${encodeURIComponent(repository.owner.login)}"
            data-link
          >
            Voltar para o usuario
          </a>
        </div>
      </div>
      <div class="repository-metrics-grid">
        ${createMetricCardMarkup('Stars', formatNumber(repository.stargazersCount))}
        ${createMetricCardMarkup('Forks', formatNumber(repository.forksCount))}
        ${createMetricCardMarkup('Watchers', formatNumber(repository.watchersCount))}
        ${createMetricCardMarkup('Issues abertas', formatNumber(repository.openIssuesCount))}
      </div>
      <div class="repository-info-grid">
        ${createInfoCardMarkup('Linguagem principal', repository.language ?? 'Nao informada')}
        ${createInfoCardMarkup('Licenca', repository.license?.name ?? 'Nao informada')}
        ${createInfoCardMarkup('Branch padrao', repository.defaultBranch)}
        ${createInfoCardMarkup('Visibilidade', repository.visibility ?? 'Nao informada')}
        ${createInfoCardMarkup('Ultima atualizacao', formatDate(repository.updatedAt))}
        ${createInfoCardMarkup('Ultimo push', formatDate(repository.pushedAt))}
        ${createInfoCardMarkup('Criado em', formatDate(repository.createdAt))}
        ${createInfoCardMarkup('Tamanho', `${formatNumber(repository.size)} KB`)}
      </div>
      ${createTopicsSectionMarkup(repository.topics)}
    </section>
  `
}

function createRepositorySidebarMarkup(
  repository: GitHubRepositoryDetails | null,
  isLoading: boolean,
  errorMessage: string | null,
): string {
  if (isLoading) {
    return createRepositorySidebarSkeletonMarkup()
  }

  if (errorMessage || !repository) {
    return ''
  }

  return `
    <aside class="repository-sidebar-card">
      <div class="repository-sidebar-section">
        <span class="section-kicker">Resumo tecnico</span>
        <h3 class="user-section-title">Sinais rapidos da API</h3>
      </div>
      <dl class="repository-sidebar-list">
        ${createSidebarItemMarkup('Owner', repository.owner.login)}
        ${createSidebarItemMarkup('Tipo do owner', repository.owner.type)}
        ${createSidebarItemMarkup('Network', formatNumber(repository.networkCount))}
        ${createSidebarItemMarkup('Subscribers', formatNumber(repository.subscribersCount))}
        ${createSidebarItemMarkup('Discussions', repository.hasDiscussions ? 'Ativadas' : 'Desativadas')}
        ${createSidebarItemMarkup('Projects', repository.hasProjects ? 'Disponivel' : 'Indisponivel')}
        ${createSidebarItemMarkup('Wiki', repository.hasWiki ? 'Disponivel' : 'Indisponivel')}
        ${createSidebarItemMarkup('Pages', repository.hasPages ? 'Ativado' : 'Desativado')}
        ${createSidebarItemMarkup('Downloads', repository.hasDownloads ? 'Ativado' : 'Desativado')}
        ${createSidebarItemMarkup('Permissao de push', repository.permissions?.push ? 'Sim' : 'Nao')}
      </dl>
    </aside>
  `
}

function createMetricCardMarkup(label: string, value: string): string {
  return `
    <article class="repository-metric-card">
      <span class="repository-metric-label">${escapeHtml(label)}</span>
      <strong class="repository-metric-value">${escapeHtml(value)}</strong>
    </article>
  `
}

function createInfoCardMarkup(label: string, value: string): string {
  return `
    <article class="repository-info-card">
      <span class="repository-info-label">${escapeHtml(label)}</span>
      <strong class="repository-info-value">${escapeHtml(value)}</strong>
    </article>
  `
}

function createTopicsSectionMarkup(topics: string[]): string {
  if (topics.length === 0) {
    return `
      <section class="repository-topics-card">
        <h3 class="user-section-title">Topicos</h3>
        <p class="status-card-description">
          Este repositorio nao expoe topicos publicos no momento.
        </p>
      </section>
    `
  }

  return `
    <section class="repository-topics-card">
      <h3 class="user-section-title">Topicos</h3>
      <div class="repository-topics-list">
        ${topics
          .map(function createTopicMarkup(topic: string): string {
            return `<span class="repository-topic">${escapeHtml(topic)}</span>`
          })
          .join('')}
      </div>
    </section>
  `
}

function createSidebarItemMarkup(label: string, value: string): string {
  return `
    <div class="repository-sidebar-item">
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `
}

function mapFavoriteRepository(
  repository: GitHubRepositoryDetails,
): FavoriteRepository {
  return {
    fullName: repository.fullName,
    htmlUrl: repository.htmlUrl,
    id: repository.id,
    language: repository.language,
    name: repository.name,
    ownerLogin: repository.owner.login,
    stargazersCount: repository.stargazersCount,
  }
}
