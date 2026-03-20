import { navigate } from '../../../router/navigation'
import { escapeHtml, observeElementRemoval } from '../../../shared/utils/dom'
import { formatNumber } from '../../../shared/utils/formatters'
import { createEmptyStateMarkup } from '../../github-user/components/empty-state'
import { createFavoriteButtonMarkup } from '../components/favorite-button'
import {
  favoritesStore,
  type FavoriteRepository,
} from '../stores/favorites.store'

export function createFavoritesPage(): HTMLElement {
  const pageElement = document.createElement('section')

  pageElement.className = 'favorites-page'

  favoritesStore.hydrateFavoriteRepositories()

  const unsubscribe = favoritesStore.subscribe(function handleFavoritesState(): void {
    renderFavoritesPage(pageElement)
  })

  pageElement.addEventListener('click', handlePageClick)

  observeElementRemoval(pageElement, function handlePageRemoval(): void {
    pageElement.removeEventListener('click', handlePageClick)
    unsubscribe()
  })

  renderFavoritesPage(pageElement)

  return pageElement

  function handlePageClick(event: MouseEvent): void {
    const targetElement = event.target

    if (!(targetElement instanceof Element)) {
      return
    }

    const favoriteToggleElement = targetElement.closest<HTMLElement>('[data-favorite-full-name]')

    if (!favoriteToggleElement) {
      return
    }

    const fullName = favoriteToggleElement.dataset.favoriteFullName

    if (!fullName) {
      return
    }

    favoritesStore.removeFavoriteRepository(fullName)
  }
}

function renderFavoritesPage(pageElement: HTMLElement): void {
  const repositories = favoritesStore.getState().repositories

  pageElement.innerHTML = `
    <div class="favorites-shell">
      <section class="favorites-hero">
        <div class="favorites-hero-copy">
          <span class="section-kicker">Favoritos</span>
          <h2 class="section-title">Repositorios salvos para consulta rapida.</h2>
          <p class="section-description">
            Esta lista vem do armazenamento local, entao continua disponivel entre recargas da aplicacao.
          </p>
        </div>
        <div class="favorites-summary-card">
          <span class="favorites-summary-label">Total salvo</span>
          <strong class="favorites-summary-value">${escapeHtml(
            formatNumber(repositories.length),
          )}</strong>
          <button class="page-action page-action--secondary" type="button" data-link-home>
            Ir para a busca
          </button>
        </div>
      </section>
      ${createFavoritesBodyMarkup(repositories)}
    </div>
  `

  const homeButtonElement = pageElement.querySelector<HTMLButtonElement>('[data-link-home]')

  homeButtonElement?.addEventListener('click', function handleHomeNavigation(): void {
    navigate('/')
  }, { once: true })
}

function createFavoritesBodyMarkup(repositories: FavoriteRepository[]): string {
  if (repositories.length === 0) {
    return createEmptyStateMarkup({
      actionHref: '/',
      actionLabel: 'Buscar usuarios',
      description:
        'Favorite um repositorio na listagem do usuario ou na pagina de detalhe para ele aparecer aqui.',
      title: 'Nenhum repositorio foi salvo ainda.',
    })
  }

  return `
    <div class="favorites-list">
      ${repositories
        .map(function createFavoriteCardMarkup(repository: FavoriteRepository): string {
          return `
            <article class="repository-card favorite-repository-card">
              <div class="repository-card-header">
                <div>
                  <a
                    class="repository-card-title"
                    href="/repo/${encodeURIComponent(repository.ownerLogin)}/${encodeURIComponent(repository.name)}"
                    data-link
                  >
                    ${escapeHtml(repository.name)}
                  </a>
                  <p class="repository-card-full-name">${escapeHtml(repository.fullName)}</p>
                </div>
                <div class="repository-card-actions">
                  ${createFavoriteButtonMarkup({
                    isActive: true,
                  }).replace(
                    'data-favorite-toggle',
                    `data-favorite-full-name="${escapeHtml(repository.fullName)}"`,
                  )}
                </div>
              </div>
              <div class="repository-card-meta">
                <span>Owner: ${escapeHtml(repository.ownerLogin)}</span>
                <span>Linguagem: ${escapeHtml(repository.language ?? 'Nao informada')}</span>
                <span>Stars: ${escapeHtml(formatNumber(repository.stargazersCount))}</span>
              </div>
              <div class="favorite-repository-actions">
                <a
                  class="page-action page-action--secondary"
                  href="/user/${encodeURIComponent(repository.ownerLogin)}"
                  data-link
                >
                  Ver usuario
                </a>
                <a
                  class="page-action page-action--primary"
                  href="${escapeHtml(repository.htmlUrl)}"
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no GitHub
                </a>
              </div>
            </article>
          `
        })
        .join('')}
    </div>
  `
}
