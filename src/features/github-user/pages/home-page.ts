import { navigate } from '../../../router/navigation'
import { isApiError } from '../../../shared/utils/api-error'
import { debounce } from '../../../shared/utils/debounce'
import { getUserByUsername } from '../services/github.service'
import {
  buildUserListRoute,
} from '../utils/build-user-list-query'
import {
  DEFAULT_REPO_SORT,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_USER_PAGE,
  DEFAULT_USER_REPOSITORIES_PER_PAGE,
  type UserPageQuery,
} from '../types/github-user.types'

const DEBOUNCE_DELAY_MS = 2000

interface HomeSuggestion {
  description: string
  username: string
}

const HOME_SUGGESTIONS: HomeSuggestion[] = [
  {
    description: 'Conta de exemplo usada na maioria dos exemplos da API do GitHub.',
    username: 'octocat',
  },
  {
    description: 'Perfil publico da organizacao da OpenAI.',
    username: 'openai',
  },
  {
    description: 'Conta do time do Vite para inspecionar repositorios focados em frontend.',
    username: 'vitejs',
  },
]

export function createHomePage(): HTMLElement {
  const pageElement = document.createElement('section')

  pageElement.className = 'home-page'
  pageElement.innerHTML = `
    <div class="home-search-panel">
      <div class="home-copy">
        <span class="section-kicker">Inicio</span>
        <h2 class="section-title">Busque qualquer usuario do GitHub e va direto para a rota do perfil.</h2>
        <p class="section-description">
          O campo abaixo valida o usuario antes da navegacao e continua aceitando envio explicito com Enter.
        </p>
      </div>
      <form class="search-form" novalidate>
        <label class="search-label" for="github-username-input">Nome de usuario do GitHub</label>
        <div class="search-input-row">
          <input
            id="github-username-input"
            class="search-input"
            name="username"
            type="search"
            placeholder="octocat"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            aria-describedby="github-username-feedback"
          />
          <button class="search-submit" type="submit">Buscar agora</button>
        </div>
        <p
          id="github-username-feedback"
          class="search-feedback"
          role="status"
          aria-live="polite"
        >
          A navegacao comeca automaticamente apos ${DEBOUNCE_DELAY_MS}ms de inatividade.
        </p>
      </form>
      <div class="home-suggestions">
        <span class="home-suggestions-label">Tente um destes:</span>
        <div class="home-suggestions-grid">
          ${HOME_SUGGESTIONS.map(createSuggestionMarkup).join('')}
        </div>
      </div>
    </div>
    <div class="home-insights">
      <article class="home-insight-card">
        <h3 class="page-card-title">Validacao com debounce</h3>
        <p class="page-card-description">
          A digitacao espera ${DEBOUNCE_DELAY_MS / 1000} segundos antes de o app verificar se o usuario existe.
        </p>
      </article>
      <article class="home-insight-card">
        <h3 class="page-card-title">Navegacao protegida</h3>
        <p class="page-card-description">
          A rota muda so depois que o GitHub confirma que o usuario existe, entao nomes invalidos continuam na home.
        </p>
      </article>
      <article class="home-insight-card">
        <h3 class="page-card-title">Fluxo amigavel ao teclado</h3>
        <p class="page-card-description">
          Pressione Enter a qualquer momento para pular a espera e validar imediatamente com o mesmo usuario normalizado.
        </p>
      </article>
    </div>
  `

  const searchFormElement = pageElement.querySelector<HTMLFormElement>('form.search-form')
  const inputElement = pageElement.querySelector<HTMLInputElement>('input.search-input')
  const feedbackElement = pageElement.querySelector<HTMLElement>('.search-feedback')
  let latestSearchToken = 0

  if (!searchFormElement || !inputElement || !feedbackElement) {
    throw new Error('Home page search elements were not found.')
  }

  const debouncedNavigate = debounce(function handleDebouncedSearch(
    rawUsername: string,
    searchToken: number,
  ): void {
    if (!pageElement.isConnected) {
      return
    }

    startUserSearch(
      rawUsername,
      searchToken,
      inputElement,
      feedbackElement,
      pageElement,
    )
  }, DEBOUNCE_DELAY_MS)

  searchFormElement.addEventListener('submit', function handleSubmit(event: SubmitEvent): void {
    event.preventDefault()
    debouncedNavigate.cancel()
    latestSearchToken += 1

    startUserSearch(
      inputElement.value,
      latestSearchToken,
      inputElement,
      feedbackElement,
      pageElement,
    )
  })

  inputElement.addEventListener('input', function handleInput(): void {
    const username = normalizeGitHubUsername(inputElement.value)

    latestSearchToken += 1

    if (username === '') {
      debouncedNavigate.cancel()
      setSearchFeedback(
        feedbackElement,
        `A navegacao comeca automaticamente apos ${DEBOUNCE_DELAY_MS}ms de inatividade.`,
        false,
      )
      return
    }

    if (!isValidGitHubUsername(username)) {
      debouncedNavigate.cancel()
      setSearchFeedback(
        feedbackElement,
        'Usuarios do GitHub podem usar letras, numeros ou hifens simples.',
        true,
      )
      return
    }

    setSearchFeedback(
      feedbackElement,
      `Aguardando ${DEBOUNCE_DELAY_MS}ms antes de verificar "${username}". Pressione Enter para verificar agora.`,
      false,
    )
    debouncedNavigate(username, latestSearchToken)
  })

  return pageElement
}

function createSuggestionMarkup(suggestion: HomeSuggestion): string {
  return `
    <a class="home-suggestion" href="${buildRouteForUsername(suggestion.username)}" data-link>
      <span class="home-suggestion-name">@${suggestion.username}</span>
      <span class="home-suggestion-description">${suggestion.description}</span>
    </a>
  `
}

function startUserSearch(
  rawUsername: string,
  searchToken: number,
  inputElement: HTMLInputElement,
  feedbackElement: HTMLElement,
  pageElement: HTMLElement,
): void {
  validateAndNavigateToUserPage(
    rawUsername,
    searchToken,
    inputElement,
    feedbackElement,
    pageElement,
  )
}

async function validateAndNavigateToUserPage(
  rawUsername: string,
  searchToken: number,
  inputElement: HTMLInputElement,
  feedbackElement: HTMLElement,
  pageElement: HTMLElement,
): Promise<void> {
  const username = normalizeGitHubUsername(rawUsername)

  if (username === '') {
    setSearchFeedback(feedbackElement, 'Digite um nome de usuario do GitHub para iniciar a busca.', true)
    return
  }

  if (!isValidGitHubUsername(username)) {
    setSearchFeedback(
      feedbackElement,
      'Informe um nome de usuario valido do GitHub antes de navegar.',
      true,
    )
    return
  }

  setSearchFeedback(
    feedbackElement,
    `Verificando se "${username}" existe no GitHub...`,
    false,
  )

  try {
    await getUserByUsername(username)

    if (!shouldApplySearchResult(searchToken, inputElement, pageElement, username)) {
      return
    }

    navigate(buildRouteForUsername(username))
    setSearchFeedback(feedbackElement, `Abrindo "${username}"...`, false)
  } catch (error: unknown) {
    if (!shouldApplySearchResult(searchToken, inputElement, pageElement, username)) {
      return
    }

    if (isApiError(error) && error.status === 404) {
      setSearchFeedback(
        feedbackElement,
        `O usuario "${username}" nao foi encontrado no GitHub. Fique aqui e tente outro nome.`,
        true,
      )
      return
    }

    setSearchFeedback(
      feedbackElement,
      'Nao foi possivel validar esse usuario do GitHub agora. Tente novamente.',
      true,
    )
  }
}

function buildRouteForUsername(username: string): string {
  const query: UserPageQuery = {
    direction: DEFAULT_SORT_DIRECTION,
    page: DEFAULT_USER_PAGE,
    perPage: DEFAULT_USER_REPOSITORIES_PER_PAGE,
    sort: DEFAULT_REPO_SORT,
    username: username,
  }

  return buildUserListRoute(query)
}

function normalizeGitHubUsername(value: string): string {
  const trimmedValue = value.trim()

  if (trimmedValue.startsWith('@')) {
    return trimmedValue.slice(1).trim()
  }

  return trimmedValue
}

function isValidGitHubUsername(username: string): boolean {
  return /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)
}

function shouldApplySearchResult(
  searchToken: number,
  inputElement: HTMLInputElement,
  pageElement: HTMLElement,
  username: string,
): boolean {
  if (!pageElement.isConnected) {
    return false
  }

  if (normalizeGitHubUsername(inputElement.value) !== username) {
    return false
  }

  return searchToken > 0
}

function setSearchFeedback(
  feedbackElement: HTMLElement,
  message: string,
  isError: boolean,
): void {
  feedbackElement.textContent = message
  feedbackElement.dataset.state = isError ? 'error' : 'default'
}
