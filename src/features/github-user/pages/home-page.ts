import { createPlaceholderPage } from '../../../shared/components/placeholder-page'

export function createHomePage(): HTMLElement {
  return createPlaceholderPage({
    eyebrow: 'Home route',
    title: 'The router is resolving the root path.',
    description:
      'This screen is already controlled by the native router and acts as the entry point for the GitHub search journey.',
    actions: [
      {
        href: '/user/octocat',
        label: 'Open sample user route',
        variant: 'primary',
      },
      {
        href: '/repo/octocat/Spoon-Knife',
        label: 'Open sample repository route',
        variant: 'secondary',
      },
    ],
    details: [
      {
        title: 'Route pattern',
        description: 'The home page is mapped to the "/" path.',
      },
      {
        title: 'Navigation model',
        description:
          'Internal links are intercepted and rerender the outlet without reloading the document.',
      },
      {
        title: 'Next integration point',
        description: 'The search UI can be attached here in the next feature steps.',
      },
    ],
  })
}
