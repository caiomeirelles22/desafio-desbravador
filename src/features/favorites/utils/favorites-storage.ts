import { readJsonStorageValue, writeJsonStorageValue } from '../../../shared/utils/storage'
import type { FavoriteRepository } from '../stores/favorites.store'

const FAVORITES_STORAGE_KEY = 'github-user-explorer:favorites'

export function loadFavoriteRepositories(): FavoriteRepository[] {
  const storedValue = readJsonStorageValue<unknown[]>(FAVORITES_STORAGE_KEY, [])

  if (!Array.isArray(storedValue)) {
    return []
  }

  const repositories: FavoriteRepository[] = []

  for (const item of storedValue) {
    if (!isFavoriteRepository(item)) {
      continue
    }

    repositories.push(item)
  }

  return repositories
}

export function saveFavoriteRepositories(
  repositories: FavoriteRepository[],
): void {
  writeJsonStorageValue(FAVORITES_STORAGE_KEY, repositories)
}

function isFavoriteRepository(value: unknown): value is FavoriteRepository {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const repository = value as Record<string, unknown>

  return (
    typeof repository.id === 'number' &&
    typeof repository.fullName === 'string' &&
    typeof repository.name === 'string' &&
    typeof repository.ownerLogin === 'string' &&
    typeof repository.htmlUrl === 'string' &&
    typeof repository.stargazersCount === 'number' &&
    (typeof repository.language === 'string' || repository.language === null)
  )
}
