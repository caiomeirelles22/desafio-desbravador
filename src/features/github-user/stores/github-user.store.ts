import { createStore, type Store } from '../../../shared/store/create-store'
import {
  DEFAULT_REPO_SORT,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_USER_PAGE,
  DEFAULT_USER_REPOSITORIES_PER_PAGE,
  type GitHubUser,
  type PaginationMeta,
  type UserPageQuery,
  type UserPageState,
  type UserRepositoriesResult,
} from '../types/github-user.types'

export interface GitHubUserStore extends Store<UserPageState> {
  resetUserPageState(): void
  setRepositoriesError(message: string | null): void
  setRepositoriesLoading(): void
  setRepositoriesResult(result: UserRepositoriesResult): void
  setQuery(query: UserPageQuery): void
  setUser(user: GitHubUser | null): void
  setUserError(message: string | null): void
  setUserLoading(): void
}

export const githubUserStore = createGitHubUserStore()

export function createGitHubUserStore(): GitHubUserStore {
  const store = createStore(createInitialUserPageState)

  function setQuery(query: UserPageQuery): void {
    store.updateState(function updateState(state: UserPageState): UserPageState {
      return {
        ...state,
        pagination: createEmptyPaginationMeta(query),
        query: query,
      }
    })
  }

  function setUserLoading(): void {
    store.updateState(function updateState(state: UserPageState): UserPageState {
      return {
        ...state,
        data: {
          ...state.data,
          errorUser: null,
          loadingUser: true,
        },
      }
    })
  }

  function setUser(user: GitHubUser | null): void {
    store.updateState(function updateState(state: UserPageState): UserPageState {
      return {
        ...state,
        data: {
          ...state.data,
          errorUser: null,
          loadingUser: false,
          user: user,
        },
      }
    })
  }

  function setUserError(message: string | null): void {
    store.updateState(function updateState(state: UserPageState): UserPageState {
      return {
        ...state,
        data: {
          ...state.data,
          errorUser: message,
          loadingUser: false,
          user: null,
        },
      }
    })
  }

  function setRepositoriesLoading(): void {
    store.updateState(function updateState(state: UserPageState): UserPageState {
      return {
        ...state,
        data: {
          ...state.data,
          errorRepositories: null,
          loadingRepositories: true,
        },
      }
    })
  }

  function setRepositoriesResult(result: UserRepositoriesResult): void {
    store.updateState(function updateState(state: UserPageState): UserPageState {
      return {
        ...state,
        data: {
          ...state.data,
          errorRepositories: null,
          loadingRepositories: false,
          repositories: result.repositories,
        },
        pagination: result.pagination,
      }
    })
  }

  function setRepositoriesError(message: string | null): void {
    store.updateState(function updateState(state: UserPageState): UserPageState {
      return {
        ...state,
        data: {
          ...state.data,
          errorRepositories: message,
          loadingRepositories: false,
          repositories: [],
        },
        pagination: createEmptyPaginationMeta(state.query),
      }
    })
  }

  function resetUserPageState(): void {
    store.resetState()
  }

  return {
    getState: store.getState,
    patchState: store.patchState,
    resetState: store.resetState,
    resetUserPageState: resetUserPageState,
    setRepositoriesError: setRepositoriesError,
    setRepositoriesLoading: setRepositoriesLoading,
    setRepositoriesResult: setRepositoriesResult,
    setQuery: setQuery,
    setState: store.setState,
    setUser: setUser,
    setUserError: setUserError,
    setUserLoading: setUserLoading,
    subscribe: store.subscribe,
    updateState: store.updateState,
  }
}

function createInitialUserPageState(): UserPageState {
  const initialQuery = createInitialUserPageQuery()

  return {
    data: {
      errorRepositories: null,
      errorUser: null,
      loadingRepositories: false,
      loadingUser: false,
      repositories: [],
      user: null,
    },
    pagination: createEmptyPaginationMeta(initialQuery),
    query: initialQuery,
  }
}

function createInitialUserPageQuery(): UserPageQuery {
  return {
    direction: DEFAULT_SORT_DIRECTION,
    page: DEFAULT_USER_PAGE,
    perPage: DEFAULT_USER_REPOSITORIES_PER_PAGE,
    sort: DEFAULT_REPO_SORT,
    username: '',
  }
}

function createEmptyPaginationMeta(query: UserPageQuery): PaginationMeta {
  return {
    currentPage: query.page,
    hasNextPage: false,
    hasPreviousPage: query.page > DEFAULT_USER_PAGE,
    perPage: query.perPage,
    totalPages: Math.max(query.page, 1),
  }
}
