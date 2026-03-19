import { createPlaceholderPage } from '../../../shared/components/placeholder-page'

export interface UserPageContent {
  username: string
  queryString: string
}

export function createUserPage(content: UserPageContent): HTMLElement {
  return createPlaceholderPage({
    eyebrow: 'User route',
    title: `User route matched for "${content.username}".`,
    description:
      'The username path parameter is being parsed from the URL and delivered to the page component.',
    actions: [
      {
        href: `/repo/${encodeURIComponent(content.username)}/Spoon-Knife`,
        label: 'Open sample repository from this user',
        variant: 'primary',
      },
      {
        href: '/',
        label: 'Back to home',
        variant: 'secondary',
      },
    ],
    details: [
      {
        title: 'Path params',
        description: `Resolved username param: ${content.username}.`,
      },
      {
        title: 'Query string',
        description: content.queryString || 'No query parameters are applied yet.',
      },
      {
        title: 'Future step',
        description:
          'This route will host the profile header, repository list, filters and pagination.',
      },
    ],
  })
}
