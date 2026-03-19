import { apiClient, getResponseHeader } from '../../../shared/services/api'
import type {
  GitHubRepositoryDetailsResponse,
  GitHubRepositoryLicenseResponse,
  GitHubRepositoryOwnerResponse,
  GitHubRepositoryPermissionsResponse,
  GitHubRepositoryResponse,
  GitHubUserResponse,
} from '../types/github-api.types'
import type {
  GitHubUser,
  UserPageQuery,
  UserRepositoriesResult,
} from '../types/github-user.types'
import type {
  GitHubRepository,
  GitHubRepositoryDetails,
  GitHubRepositoryLicense,
  GitHubRepositoryOwner,
  GitHubRepositoryPermissions,
} from '../types/repository.types'
import { createPaginationMetaFromLinkHeader } from '../utils/parse-link-header'

export async function getUserByUsername(username: string): Promise<GitHubUser> {
  const response = await apiClient.get<GitHubUserResponse>(
    `/users/${encodeURIComponent(username)}`,
  )

  return mapGitHubUser(response.data)
}

export async function getUserRepositories(
  query: UserPageQuery,
): Promise<UserRepositoriesResult> {
  const response = await apiClient.get<GitHubRepositoryResponse[]>(
    `/users/${encodeURIComponent(query.username)}/repos`,
    {
      params: {
        direction: query.direction,
        page: query.page,
        per_page: query.perPage,
        sort: query.sort,
      },
    },
  )
  const linkHeader = getResponseHeader(response.headers, 'link')
  const repositories = response.data.map(mapGitHubRepository)
  const pagination = createPaginationMetaFromLinkHeader({
    currentPage: query.page,
    itemCount: repositories.length,
    linkHeader,
    perPage: query.perPage,
  })

  return {
    pagination,
    repositories,
  }
}

export async function getRepositoryDetails(
  fullName: string,
): Promise<GitHubRepositoryDetails> {
  const repositoryPath = createRepositoryPath(fullName)
  const response = await apiClient.get<GitHubRepositoryDetailsResponse>(
    `/repos/${repositoryPath}`,
  )

  return mapGitHubRepositoryDetails(response.data)
}

function createRepositoryPath(fullName: string): string {
  const segments = fullName.split('/')

  if (segments.length !== 2 || segments[0] === '' || segments[1] === '') {
    throw new Error('Repository full name must use the "owner/repository" format.')
  }

  return `${encodeURIComponent(segments[0])}/${encodeURIComponent(segments[1])}`
}

function mapGitHubUser(user: GitHubUserResponse): GitHubUser {
  return {
    avatarUrl: user.avatar_url,
    bio: user.bio,
    blog: user.blog,
    company: user.company,
    createdAt: user.created_at,
    email: user.email,
    followers: user.followers,
    following: user.following,
    htmlUrl: user.html_url,
    id: user.id,
    location: user.location,
    login: user.login,
    name: user.name,
    nodeId: user.node_id,
    publicGists: user.public_gists,
    publicRepos: user.public_repos,
    twitterUsername: user.twitter_username,
    type: user.type,
    updatedAt: user.updated_at,
  }
}

function mapGitHubRepository(
  repository: GitHubRepositoryResponse,
): GitHubRepository {
  return {
    archived: repository.archived,
    createdAt: repository.created_at,
    defaultBranch: repository.default_branch,
    description: repository.description,
    disabled: repository.disabled,
    forksCount: repository.forks_count,
    fullName: repository.full_name,
    hasDiscussions: repository.has_discussions ?? false,
    hasDownloads: repository.has_downloads,
    hasIssues: repository.has_issues,
    hasPages: repository.has_pages,
    hasProjects: repository.has_projects,
    hasWiki: repository.has_wiki,
    homepage: repository.homepage,
    htmlUrl: repository.html_url,
    id: repository.id,
    isFork: repository.fork,
    isPrivate: repository.private,
    language: repository.language,
    license: mapGitHubRepositoryLicense(repository.license),
    name: repository.name,
    nodeId: repository.node_id,
    openIssuesCount: repository.open_issues_count,
    owner: mapGitHubRepositoryOwner(repository.owner),
    pushedAt: repository.pushed_at,
    size: repository.size,
    stargazersCount: repository.stargazers_count,
    topics: repository.topics ?? [],
    updatedAt: repository.updated_at,
    visibility: repository.visibility ?? null,
    watchersCount: repository.watchers_count,
  }
}

function mapGitHubRepositoryDetails(
  repository: GitHubRepositoryDetailsResponse,
): GitHubRepositoryDetails {
  const mappedRepository = mapGitHubRepository(repository)

  return {
    ...mappedRepository,
    allowForking: repository.allow_forking,
    networkCount: repository.network_count,
    permissions: mapGitHubRepositoryPermissions(repository.permissions),
    subscribersCount: repository.subscribers_count,
  }
}

function mapGitHubRepositoryOwner(
  owner: GitHubRepositoryOwnerResponse,
): GitHubRepositoryOwner {
  return {
    avatarUrl: owner.avatar_url,
    htmlUrl: owner.html_url,
    id: owner.id,
    login: owner.login,
    nodeId: owner.node_id,
    type: owner.type,
  }
}

function mapGitHubRepositoryLicense(
  license: GitHubRepositoryLicenseResponse | null,
): GitHubRepositoryLicense | null {
  if (!license) {
    return null
  }

  return {
    key: license.key,
    name: license.name,
    nodeId: license.node_id,
    spdxId: license.spdx_id,
    url: license.url,
  }
}

function mapGitHubRepositoryPermissions(
  permissions: GitHubRepositoryPermissionsResponse | undefined,
): GitHubRepositoryPermissions | null {
  if (!permissions) {
    return null
  }

  return {
    admin: permissions.admin,
    maintain: permissions.maintain,
    pull: permissions.pull,
    push: permissions.push,
    triage: permissions.triage,
  }
}
