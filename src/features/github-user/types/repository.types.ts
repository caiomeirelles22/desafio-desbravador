export interface GitHubRepositoryOwner {
  avatarUrl: string
  htmlUrl: string
  id: number
  login: string
  nodeId: string
  type: string
}

export interface GitHubRepositoryLicense {
  key: string
  name: string
  nodeId: string
  spdxId: string | null
  url: string | null
}

export interface GitHubRepositoryPermissions {
  admin: boolean
  maintain: boolean
  pull: boolean
  push: boolean
  triage: boolean
}

export interface GitHubRepository {
  archived: boolean
  createdAt: string
  defaultBranch: string
  description: string | null
  disabled: boolean
  forksCount: number
  fullName: string
  hasDiscussions: boolean
  hasDownloads: boolean
  hasIssues: boolean
  hasPages: boolean
  hasProjects: boolean
  hasWiki: boolean
  homepage: string | null
  htmlUrl: string
  id: number
  isFork: boolean
  isPrivate: boolean
  language: string | null
  license: GitHubRepositoryLicense | null
  name: string
  nodeId: string
  openIssuesCount: number
  owner: GitHubRepositoryOwner
  pushedAt: string
  size: number
  stargazersCount: number
  topics: string[]
  updatedAt: string
  visibility: string | null
  watchersCount: number
}

export interface GitHubRepositoryDetails extends GitHubRepository {
  allowForking: boolean
  networkCount: number
  permissions: GitHubRepositoryPermissions | null
  subscribersCount: number
}
