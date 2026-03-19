import { createPlaceholderPage } from '../../../shared/components/placeholder-page'

export interface RepositoryPageContent {
  owner: string
  repositoryName: string
}

export function createRepositoryPage(content: RepositoryPageContent): HTMLElement {
  return createPlaceholderPage({
    eyebrow: 'Repository route',
    title: `Repository route matched for "${content.owner}/${content.repositoryName}".`,
    description:
      'The router is resolving both owner and repository segments before the API layer exists.',
    actions: [
      {
        href: `/user/${encodeURIComponent(content.owner)}`,
        label: 'Back to user route',
        variant: 'primary',
      },
      {
        href: '/',
        label: 'Return home',
        variant: 'secondary',
      },
    ],
    details: [
      {
        title: 'Owner param',
        description: `Resolved owner param: ${content.owner}.`,
      },
      {
        title: 'Repository param',
        description: `Resolved repository param: ${content.repositoryName}.`,
      },
      {
        title: 'Future step',
        description:
          'This page will later fetch repository details independently from the list screen.',
      },
    ],
  })
}
