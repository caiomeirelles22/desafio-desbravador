import {
  registerNavigateHandler,
  type NavigateOptions,
} from './navigation'
import {
  buildDocumentTitle,
  matchRoute,
  type RouteName,
} from './routes'

export interface Router {
  start(): void
  renderCurrentRoute(): void
}

export function createRouter(
  routeViewElement: HTMLElement,
  navigationRootElement: ParentNode,
): Router {
  function start(): void {
    registerNavigateHandler(handleNavigate)
    window.addEventListener('popstate', handlePopState)
    renderCurrentRoute()
  }

  function renderCurrentRoute(): void {
    const matchedRoute = matchRoute(
      window.location.pathname,
      window.location.search,
    )
    const pageElement = matchedRoute.definition.createPage(matchedRoute.context)

    routeViewElement.replaceChildren(pageElement)
    updateActiveNavigation(navigationRootElement, matchedRoute.context.name)
    document.title = `GitHub User Explorer | ${buildDocumentTitle(matchedRoute.context)}`
  }

  function handleNavigate(to: string, options: NavigateOptions = {}): void {
    const targetUrl = new URL(to, window.location.origin)

    if (isCurrentLocation(targetUrl)) {
      return
    }

    if (options.replace) {
      window.history.replaceState(
        null,
        '',
        targetUrl.pathname + targetUrl.search + targetUrl.hash,
      )
    } else {
      window.history.pushState(
        null,
        '',
        targetUrl.pathname + targetUrl.search + targetUrl.hash,
      )
    }

    renderCurrentRoute()
  }

  function handlePopState(): void {
    renderCurrentRoute()
  }

  return {
    start,
    renderCurrentRoute,
  }
}

function isCurrentLocation(targetUrl: URL): boolean {
  return (
    window.location.pathname === targetUrl.pathname &&
    window.location.search === targetUrl.search &&
    window.location.hash === targetUrl.hash
  )
}

function updateActiveNavigation(
  navigationRootElement: ParentNode,
  routeName: RouteName,
): void {
  const navigationLinks =
    navigationRootElement.querySelectorAll<HTMLAnchorElement>('[data-nav-route]')

  for (const navigationLink of navigationLinks) {
    const linkRouteName = navigationLink.dataset.navRoute
    const isActive = linkRouteName === routeName

    if (isActive) {
      navigationLink.setAttribute('aria-current', 'page')
      continue
    }

    navigationLink.removeAttribute('aria-current')
  }
}
