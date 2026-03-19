import type { ApiError } from '../../../shared/utils/api-error'
import type { GitHubRepository } from './repository.types'

export type RepoSort = 'created' | 'updated' | 'pushed' | 'full_name'
export type SortDirection = 'asc' | 'desc'

export const DEFAULT_USER_PAGE = 1
export const DEFAULT_USER_REPOSITORIES_PER_PAGE = 10
export const DEFAULT_REPO_SORT: RepoSort = 'updated'
export const DEFAULT_SORT_DIRECTION: SortDirection = 'desc'
export const VALID_REPO_SORTS: RepoSort[] = [
  'created',
  'updated',
  'pushed',
  'full_name',
]
export const VALID_SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc']
export const VALID_USER_REPOSITORIES_PER_PAGE_OPTIONS: number[] = [10, 20, 30, 50]

export interface GitHubUser {
  avatarUrl: string
  bio: string | null
  blog: string
  company: string | null
  createdAt: string
  email: string | null
  followers: number
  following: number
  htmlUrl: string
  id: number
  location: string | null
  login: string
  name: string | null
  nodeId: string
  publicGists: number
  publicRepos: number
  twitterUsername: string | null
  type: string
  updatedAt: string
}

export interface UserPageQuery {
  direction: SortDirection
  page: number
  perPage: number
  sort: RepoSort
  username: string
}

export interface UserPageQueryPatch {
  direction?: SortDirection
  page?: number
  perPage?: number
  sort?: RepoSort
}

export interface PaginationMeta {
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  perPage: number
  totalPages: number
}

export interface UserRepositoriesResult {
  pagination: PaginationMeta
  repositories: GitHubRepository[]
}

export type GitHubApiError = ApiError
