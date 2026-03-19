import type { GitHubRepository } from '../types/repository.types'
import { createRepositoryCardMarkup } from './repository-card'

export function createRepositoryListMarkup(
  repositories: GitHubRepository[],
): string {
  let cardsMarkup = ''

  for (const repository of repositories) {
    cardsMarkup += createRepositoryCardMarkup(repository)
  }

  return `
    <div class="repository-list">
      ${cardsMarkup}
    </div>
  `
}
