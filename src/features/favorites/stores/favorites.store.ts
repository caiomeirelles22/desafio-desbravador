import {
  createStore,
  type Store,
  type StoreUpdater,
} from '../../../shared/store/create-store'
import {
  loadFavoriteRepositories,
  saveFavoriteRepositories,
} from '../utils/favorites-storage'

export interface FavoriteRepository {
  fullName: string
  htmlUrl: string
  id: number
  language: string | null
  name: string
  ownerLogin: string
  stargazersCount: number
}

export interface FavoritesState {
  repositories: FavoriteRepository[]
}

export interface FavoritesStore extends Store<FavoritesState> {
  addFavoriteRepository(repository: FavoriteRepository): void
  clearFavoriteRepositories(): void
  hasFavoriteRepository(fullName: string): boolean
  hydrateFavoriteRepositories(): void
  removeFavoriteRepository(fullName: string): void
  toggleFavoriteRepository(repository: FavoriteRepository): void
}

export const favoritesStore = createFavoritesStore()

export function createFavoritesStore(): FavoritesStore {
  const store = createStore(createInitialFavoritesState)

  function getState(): FavoritesState {
    return store.getState()
  }

  function setState(nextState: FavoritesState): void {
    syncFavoriteRepositories(nextState.repositories)
  }

  function patchState(partialState: Partial<FavoritesState>): void {
    const nextState = {
      ...store.getState(),
      ...partialState,
    }

    syncFavoriteRepositories(nextState.repositories)
  }

  function updateState(
    updater: StoreUpdater<FavoritesState>,
  ): void {
    setState(updater(store.getState()))
  }

  function resetState(): void {
    clearFavoriteRepositories()
  }

  function hydrateFavoriteRepositories(): void {
    syncFavoriteRepositories(loadFavoriteRepositories())
  }

  function hasFavoriteRepository(fullName: string): boolean {
    const repositories = store.getState().repositories

    return findFavoriteRepositoryIndex(repositories, fullName) !== -1
  }

  function addFavoriteRepository(repository: FavoriteRepository): void {
    const repositories = store.getState().repositories

    if (hasFavoriteRepository(repository.fullName)) {
      return
    }

    syncFavoriteRepositories([...repositories, repository])
  }

  function removeFavoriteRepository(fullName: string): void {
    const repositories = store.getState().repositories
    const filteredRepositories = repositories.filter(
      function filterRepository(repository: FavoriteRepository): boolean {
        return repository.fullName !== fullName
      },
    )

    syncFavoriteRepositories(filteredRepositories)
  }

  function toggleFavoriteRepository(repository: FavoriteRepository): void {
    if (hasFavoriteRepository(repository.fullName)) {
      removeFavoriteRepository(repository.fullName)
      return
    }

    addFavoriteRepository(repository)
  }

  function clearFavoriteRepositories(): void {
    syncFavoriteRepositories([])
  }

  function syncFavoriteRepositories(
    repositories: FavoriteRepository[],
  ): void {
    const uniqueRepositories = removeDuplicatedFavoriteRepositories(repositories)

    store.patchState({
      repositories: uniqueRepositories,
    })
    saveFavoriteRepositories(uniqueRepositories)
  }

  return {
    addFavoriteRepository: addFavoriteRepository,
    clearFavoriteRepositories: clearFavoriteRepositories,
    getState: getState,
    hasFavoriteRepository: hasFavoriteRepository,
    hydrateFavoriteRepositories: hydrateFavoriteRepositories,
    patchState: patchState,
    removeFavoriteRepository: removeFavoriteRepository,
    resetState: resetState,
    setState: setState,
    subscribe: store.subscribe,
    toggleFavoriteRepository: toggleFavoriteRepository,
    updateState: updateState,
  }
}

function createInitialFavoritesState(): FavoritesState {
  return {
    repositories: [],
  }
}

function findFavoriteRepositoryIndex(
  repositories: FavoriteRepository[],
  fullName: string,
): number {
  return repositories.findIndex(
    function findRepository(repository: FavoriteRepository): boolean {
      return repository.fullName === fullName
    },
  )
}

function removeDuplicatedFavoriteRepositories(
  repositories: FavoriteRepository[],
): FavoriteRepository[] {
  const uniqueRepositories: FavoriteRepository[] = []
  const repositoryNames = new Set<string>()

  for (const repository of repositories) {
    if (repositoryNames.has(repository.fullName)) {
      continue
    }

    repositoryNames.add(repository.fullName)
    uniqueRepositories.push(repository)
  }

  return uniqueRepositories
}
