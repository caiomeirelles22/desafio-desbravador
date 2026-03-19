export interface GitHubApiErrorField {
  code?: string
  field?: string
  message?: string
  resource?: string
}

export interface GitHubApiErrorResponse {
  documentation_url?: string
  errors?: Array<GitHubApiErrorField | string>
  message: string
}

export interface GitHubUserResponse {
  avatar_url: string
  bio: string | null
  blog: string
  company: string | null
  created_at: string
  email: string | null
  followers: number
  following: number
  html_url: string
  id: number
  location: string | null
  login: string
  name: string | null
  node_id: string
  public_gists: number
  public_repos: number
  twitter_username: string | null
  type: string
  updated_at: string
}

export interface GitHubRepositoryOwnerResponse {
  avatar_url: string
  html_url: string
  id: number
  login: string
  node_id: string
  type: string
}

export interface GitHubRepositoryLicenseResponse {
  key: string
  name: string
  node_id: string
  spdx_id: string | null
  url: string | null
}

export interface GitHubRepositoryPermissionsResponse {
  admin: boolean
  maintain: boolean
  pull: boolean
  push: boolean
  triage: boolean
}

export interface GitHubRepositoryResponse {
  allow_forking?: boolean
  archived: boolean
  created_at: string
  default_branch: string
  description: string | null
  disabled: boolean
  fork: boolean
  forks_count: number
  full_name: string
  has_discussions?: boolean
  has_downloads: boolean
  has_issues: boolean
  has_pages: boolean
  has_projects: boolean
  has_wiki: boolean
  homepage: string | null
  html_url: string
  id: number
  language: string | null
  license: GitHubRepositoryLicenseResponse | null
  name: string
  node_id: string
  open_issues_count: number
  owner: GitHubRepositoryOwnerResponse
  private: boolean
  pushed_at: string
  size: number
  stargazers_count: number
  topics?: string[]
  updated_at: string
  visibility?: string
  watchers_count: number
}

export interface GitHubRepositoryDetailsResponse extends GitHubRepositoryResponse {
  allow_forking: boolean
  has_discussions: boolean
  network_count: number
  permissions?: GitHubRepositoryPermissionsResponse
  subscribers_count: number
  topics: string[]
  visibility: string
}
