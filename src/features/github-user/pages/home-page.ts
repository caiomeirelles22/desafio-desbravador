import { navigate } from '../../../router/navigation'
import { debounce } from '../../../shared/utils/debounce'
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
    description: 'GitHub sample account used in most API examples.',
    username: 'octocat',
  },
  {
    description: 'OpenAI public organization profile.',
    username: 'openai',
  },
  {
    description: 'Vite team account to inspect frontend-oriented repositories.',
    username: 'vitejs',
  },
]

export function createHomePage(): HTMLElement {
  const pageElement = document.createElement('section')

  pageElement.className = 'home-page'
  pageElement.innerHTML = `
    <div class="home-search-panel">
      <div class="home-copy">
        <span class="section-kicker">Home</span>
        <h2 class="section-title">Search any GitHub username and jump straight into the user route.</h2>
        <p class="section-description">
          The input below navigates automatically after a short pause and still supports explicit submission with Enter.
        </p>
      </div>
      <form class="search-form" novalidate>
        <label class="search-label" for="github-username-input">GitHub username</label>
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
          <button class="search-submit" type="submit">Search now</button>
        </div>
        <p
          id="github-username-feedback"
          class="search-feedback"
          role="status"
          aria-live="polite"
        >
          Navigation starts automatically after ${DEBOUNCE_DELAY_MS}ms of inactivity.
        </p>
      </form>
      <div class="home-suggestions">
        <span class="home-suggestions-label">Try one of these:</span>
        <div class="home-suggestions-grid">
          ${HOME_SUGGESTIONS.map(createSuggestionMarkup).join('')}
        </div>
      </div>
    </div>
    <div class="home-insights">
      <article class="home-insight-card">
        <h3 class="page-card-title">Debounced navigation</h3>
        <p class="page-card-description">
          Typing pauses for half a second before the app moves to the user page, reducing noisy route changes.
        </p>
      </article>
      <article class="home-insight-card">
        <h3 class="page-card-title">Keyboard-friendly flow</h3>
        <p class="page-card-description">
          Press Enter at any time to bypass the wait and navigate immediately with the same normalized username.
        </p>
      </article>
      <article class="home-insight-card">
        <h3 class="page-card-title">Query-ready route</h3>
        <p class="page-card-description">
          The generated destination already uses the user list route contract that the next screens will consume.
        </p>
      </article>
    </div>
  `

  const searchFormElement = pageElement.querySelector<HTMLFormElement>('form.search-form')
  const inputElement = pageElement.querySelector<HTMLInputElement>('input.search-input')
  const feedbackElement = pageElement.querySelector<HTMLElement>('.search-feedback')

  if (!searchFormElement || !inputElement || !feedbackElement) {
    throw new Error('Home page search elements were not found.')
  }

  const debouncedNavigate = debounce(function handleDebouncedSearch(
    rawUsername: string,
  ): void {
    if (!pageElement.isConnected) {
      return
    }

    const navigationResult = navigateToUserPage(rawUsername)

    setSearchFeedback(feedbackElement, navigationResult.feedback, navigationResult.isError)
  }, DEBOUNCE_DELAY_MS)

  searchFormElement.addEventListener('submit', function handleSubmit(event: SubmitEvent): void {
    event.preventDefault()
    debouncedNavigate.cancel()

    const navigationResult = navigateToUserPage(inputElement.value)

    setSearchFeedback(feedbackElement, navigationResult.feedback, navigationResult.isError)
  })

  inputElement.addEventListener('input', function handleInput(): void {
    const username = normalizeGitHubUsername(inputElement.value)

    if (username === '') {
      debouncedNavigate.cancel()
      setSearchFeedback(
        feedbackElement,
        `Navigation starts automatically after ${DEBOUNCE_DELAY_MS}ms of inactivity.`,
        false,
      )
      return
    }

    if (!isValidGitHubUsername(username)) {
      debouncedNavigate.cancel()
      setSearchFeedback(
        feedbackElement,
        'GitHub usernames can use letters, numbers or single hyphens.',
        true,
      )
      return
    }

    setSearchFeedback(
      feedbackElement,
      `Waiting ${DEBOUNCE_DELAY_MS}ms before opening "${username}". Press Enter to open now.`,
      false,
    )
    debouncedNavigate(username)
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

function navigateToUserPage(rawUsername: string): {
  feedback: string
  isError: boolean
} {
  const username = normalizeGitHubUsername(rawUsername)

  if (username === '') {
    return {
      feedback: 'Type a GitHub username to start a search.',
      isError: true,
    }
  }

  if (!isValidGitHubUsername(username)) {
    return {
      feedback: 'Enter a valid GitHub username before navigating.',
      isError: true,
    }
  }

  navigate(buildRouteForUsername(username))

  return {
    feedback: `Opening "${username}"...`,
    isError: false,
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

function setSearchFeedback(
  feedbackElement: HTMLElement,
  message: string,
  isError: boolean,
): void {
  feedbackElement.textContent = message
  feedbackElement.dataset.state = isError ? 'error' : 'default'
}
