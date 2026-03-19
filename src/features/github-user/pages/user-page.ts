import { navigate } from '../../../router/navigation'
import { observeElementRemoval } from '../../../shared/utils/dom'
import {
  createEmptyStateMarkup,
} from '../components/empty-state'
import {
  createErrorStateMarkup,
} from '../components/error-state'
import {
  createPaginationNavMarkup,
} from '../components/pagination-nav'
import {
  createRepositoryFiltersMarkup,
} from '../components/repository-filters'
import {
  createRepositoryListMarkup,
} from '../components/repository-list'
import {
  createUserProfileCardMarkup,
} from '../components/user-profile-card'
import {
  getUserByUsername,
  getUserRepositories,
} from '../services/github.service'
import {
  createGitHubUserStore,
  type GitHubUserStore,
} from '../stores/github-user.store'
import type {
  UserPageQuery,
  UserPageState,
} from '../types/github-user.types'
import {
  buildUserListRouteWithPatch,
} from '../utils/build-user-list-query'
import {
  getGitHubErrorMessage,
} from '../utils/github-errors'
import {
  normalizeRepoSort,
  normalizeSortDirection,
  normalizeUserRepositoriesPerPage,
} from '../utils/parse-user-list-query'

export interface UserPageContent {
  query: UserPageQuery
}

export function createUserPage(content: UserPageContent): HTMLElement {
  const pageElement = document.createElement('section')
  const store = createGitHubUserStore()

  pageElement.className = 'user-page'

  initializeUserPageStore(store, content.query)

  const unsubscribe = store.subscribe(function handleStateChange(state: UserPageState): void {
    renderUserPage(pageElement, state)
  })

  pageElement.addEventListener('change', handleFilterChange)

  observeElementRemoval(pageElement, function handlePageRemoval(): void {
    pageElement.removeEventListener('change', handleFilterChange)
    unsubscribe()
  })

  renderUserPage(pageElement, store.getState())
  void loadUserPageData(pageElement, store, content.query)

  return pageElement

  function handleFilterChange(event: Event): void {
    const targetElement = event.target

    if (!(targetElement instanceof HTMLSelectElement)) {
      return
    }

    if (targetElement.dataset.filterControl === 'sort') {
      navigate(
        buildUserListRouteWithPatch(store.getState().query, {
          sort: normalizeRepoSort(targetElement.value),
        }),
      )
      return
    }

    if (targetElement.dataset.filterControl === 'direction') {
      navigate(
        buildUserListRouteWithPatch(store.getState().query, {
          direction: normalizeSortDirection(targetElement.value),
        }),
      )
      return
    }

    if (targetElement.dataset.filterControl === 'per-page') {
      navigate(
        buildUserListRouteWithPatch(store.getState().query, {
          perPage: normalizeUserRepositoriesPerPage(targetElement.value),
        }),
      )
    }
  }
}

async function loadUserPageData(
  pageElement: HTMLElement,
  store: GitHubUserStore,
  query: UserPageQuery,
): Promise<void> {
  const [userResult, repositoriesResult] = await Promise.allSettled([
    getUserByUsername(query.username),
    getUserRepositories(query),
  ])

  if (!shouldApplyPageResult(pageElement, store, query)) {
    return
  }

  if (userResult.status === 'fulfilled') {
    store.setUser(userResult.value)
  } else {
    store.setUserError(getGitHubErrorMessage(userResult.reason, 'user'))
  }

  if (repositoriesResult.status === 'fulfilled') {
    store.setRepositoriesResult(repositoriesResult.value)
  } else {
    store.setRepositoriesError(
      getGitHubErrorMessage(repositoriesResult.reason, 'repositories'),
    )
  }
}

function initializeUserPageStore(
  store: GitHubUserStore,
  query: UserPageQuery,
): void {
  store.setQuery(query)
  store.setUserLoading()
  store.setRepositoriesLoading()
}

function renderUserPage(
  pageElement: HTMLElement,
  state: UserPageState,
): void {
  pageElement.innerHTML = `
    <div class="user-page-layout">
      <aside class="user-page-sidebar">
        ${createUserProfileSectionMarkup(state)}
      </aside>
      <div class="user-page-content">
        ${createRepositoriesSectionMarkup(state)}
        ${createPaginationSectionMarkup(state)}
      </div>
    </div>
  `
}

function createUserProfileSectionMarkup(state: UserPageState): string {
  if (state.data.loadingUser) {
    return createUserProfileLoadingMarkup()
  }

  if (state.data.errorUser) {
    return createErrorStateMarkup({
      description: state.data.errorUser,
      title: 'Nao foi possivel carregar o perfil.',
    })
  }

  if (state.data.user) {
    return createUserProfileCardMarkup(state.data.user)
  }

  return createEmptyStateMarkup({
    description: 'Selecione um usuario valido para carregar as informacoes do perfil.',
    title: 'Nenhum perfil foi carregado.',
  })
}

function createRepositoriesSectionMarkup(state: UserPageState): string {
  const filtersMarkup = createRepositoryFiltersMarkup({
    pagination: state.pagination,
    query: state.query,
    repositoriesCount: state.data.repositories.length,
  })

  return `
    ${filtersMarkup}
    <section class="user-section-card">
      ${createRepositoriesBodyMarkup(state)}
    </section>
  `
}

function createRepositoriesBodyMarkup(state: UserPageState): string {
  if (state.data.loadingRepositories) {
    return createLoadingRepositoryListMarkup()
  }

  if (state.data.errorRepositories) {
    return createErrorStateMarkup({
      description: state.data.errorRepositories,
      title: 'Nao foi possivel carregar os repositorios.',
    })
  }

  if (state.data.repositories.length === 0) {
    return createEmptyStateMarkup({
      description: `O usuario "${state.query.username}" ainda nao possui repositorios publicos para esta combinacao de filtros.`,
      title: 'Nenhum repositorio foi encontrado.',
    })
  }

  return createRepositoryListMarkup(state.data.repositories)
}

function createPaginationSectionMarkup(state: UserPageState): string {
  if (state.data.loadingRepositories || state.data.errorRepositories) {
    return ''
  }

  const paginationMarkup = createPaginationNavMarkup({
    pagination: state.pagination,
    query: state.query,
  })

  if (paginationMarkup === '') {
    return ''
  }

  return `
    <section class="user-section-card">
      ${paginationMarkup}
    </section>
  `
}

function createUserProfileLoadingMarkup(): string {
  return `
    <section class="user-profile-card loading-card" aria-hidden="true">
      <div class="user-profile-header">
        <div class="loading-avatar"></div>
        <div class="loading-stack">
          <span class="loading-line loading-line--title"></span>
          <span class="loading-line loading-line--medium"></span>
        </div>
      </div>
      <div class="loading-stack">
        <span class="loading-line"></span>
        <span class="loading-line loading-line--medium"></span>
      </div>
      <div class="loading-profile-stats">
        ${createLoadingStatMarkup()}
        ${createLoadingStatMarkup()}
        ${createLoadingStatMarkup()}
        ${createLoadingStatMarkup()}
      </div>
      <div class="loading-stack">
        <span class="loading-line"></span>
        <span class="loading-line loading-line--short"></span>
      </div>
    </section>
  `
}

function createLoadingRepositoryListMarkup(): string {
  return `
    <div class="repository-list">
      ${createLoadingRepositoryCardMarkup()}
      ${createLoadingRepositoryCardMarkup()}
      ${createLoadingRepositoryCardMarkup()}
    </div>
  `
}

function createLoadingRepositoryCardMarkup(): string {
  return `
    <article class="repository-card loading-card" aria-hidden="true">
      <div class="loading-stack">
        <span class="loading-line loading-line--title"></span>
        <span class="loading-line loading-line--medium"></span>
        <span class="loading-line"></span>
        <span class="loading-line loading-line--short"></span>
      </div>
    </article>
  `
}

function createLoadingStatMarkup(): string {
  return `
    <div class="loading-stat">
      <span class="loading-line loading-line--short"></span>
      <span class="loading-line loading-line--medium"></span>
    </div>
  `
}

function shouldApplyPageResult(
  pageElement: HTMLElement,
  store: GitHubUserStore,
  query: UserPageQuery,
): boolean {
  if (!pageElement.isConnected) {
    return false
  }

  return isSameUserPageQuery(store.getState().query, query)
}

function isSameUserPageQuery(
  leftQuery: UserPageQuery,
  rightQuery: UserPageQuery,
): boolean {
  return (
    leftQuery.direction === rightQuery.direction &&
    leftQuery.page === rightQuery.page &&
    leftQuery.perPage === rightQuery.perPage &&
    leftQuery.sort === rightQuery.sort &&
    leftQuery.username === rightQuery.username
  )
}
