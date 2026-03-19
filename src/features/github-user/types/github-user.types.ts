import type { ApiError } from '../../../shared/utils/api-error'

export type RepoSort = 'created' | 'updated' | 'pushed' | 'full_name'
export type SortDirection = 'asc' | 'desc'

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

export interface PaginationMeta {
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  perPage: number
  totalPages: number
}

export type GitHubApiError = ApiError
