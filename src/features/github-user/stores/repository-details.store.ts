import { createStore, type Store } from '../../../shared/store/create-store'
import type {
  GitHubRepositoryDetails,
  RepositoryDetailsState,
} from '../types/repository.types'

export interface RepositoryDetailsStore extends Store<RepositoryDetailsState> {
  resetRepositoryDetailsState(): void
  setRepository(repository: GitHubRepositoryDetails | null): void
  setRepositoryError(message: string | null): void
  setRepositoryLoading(): void
}

export const repositoryDetailsStore = createRepositoryDetailsStore()

export function createRepositoryDetailsStore(): RepositoryDetailsStore {
  const store = createStore(createInitialRepositoryDetailsState)

  function setRepositoryLoading(): void {
    store.patchState({
      error: null,
      loading: true,
    })
  }

  function setRepository(
    repository: GitHubRepositoryDetails | null,
  ): void {
    store.patchState({
      error: null,
      loading: false,
      repository: repository,
    })
  }

  function setRepositoryError(message: string | null): void {
    store.patchState({
      error: message,
      loading: false,
      repository: null,
    })
  }

  function resetRepositoryDetailsState(): void {
    store.resetState()
  }

  return {
    getState: store.getState,
    patchState: store.patchState,
    resetRepositoryDetailsState: resetRepositoryDetailsState,
    resetState: store.resetState,
    setRepository: setRepository,
    setRepositoryError: setRepositoryError,
    setRepositoryLoading: setRepositoryLoading,
    setState: store.setState,
    subscribe: store.subscribe,
    updateState: store.updateState,
  }
}

function createInitialRepositoryDetailsState(): RepositoryDetailsState {
  return {
    error: null,
    loading: false,
    repository: null,
  }
}
