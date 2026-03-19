import { navigate } from '../router/navigation'
import { createRouter } from '../router/router'

interface AppElements {
  shellElement: HTMLElement
  routeViewElement: HTMLElement
}

export function createApp(rootElement: HTMLElement): void {
  const appElements = createAppShell()
  const router = createRouter(appElements.routeViewElement, appElements.shellElement)

  appElements.shellElement.addEventListener('click', handleNavigationClick)

  rootElement.classList.add('app-root')
  rootElement.replaceChildren(appElements.shellElement)

  router.start()
}

function createAppShell(): AppElements {
  const shellElement = document.createElement('div')

  shellElement.className = 'app-shell'
  shellElement.innerHTML = `
    <header class="app-header">
      <div class="app-container">
        <div class="app-topbar">
          <a class="brand-link" href="/" data-link>
            <span class="brand-mark">GH</span>
            <span class="brand-text">GitHub User Explorer</span>
          </a>
          <nav class="app-nav" aria-label="Primary">
            <a class="nav-link" href="/" data-link data-nav-route="home">Home</a>
            <a class="nav-link" href="/favorites" data-link data-nav-route="favorites">Favorites</a>
          </nav>
        </div>
        <div class="hero-panel">
          <span class="hero-eyebrow">Step 3</span>
          <h1 class="hero-title">History API routing is now wired into the app shell.</h1>
          <p class="hero-description">
            The application can resolve static and dynamic routes, react to browser navigation and render into a dedicated outlet.
          </p>
        </div>
      </div>
    </header>
    <main class="app-main">
      <div class="app-container">
        <div class="route-view" data-route-view></div>
      </div>
    </main>
  `

  const routeViewElement = shellElement.querySelector<HTMLElement>('[data-route-view]')

  if (!routeViewElement) {
    throw new Error('Route view container "[data-route-view]" was not found.')
  }

  return {
    shellElement,
    routeViewElement,
  }
}

function handleNavigationClick(event: MouseEvent): void {
  const targetElement = event.target

  if (!(targetElement instanceof Element)) {
    return
  }

  const linkElement = targetElement.closest('a[data-link]')

  if (!(linkElement instanceof HTMLAnchorElement)) {
    return
  }

  if (!shouldHandleNavigation(event, linkElement)) {
    return
  }

  const targetUrl = new URL(linkElement.href, window.location.origin)

  if (targetUrl.origin !== window.location.origin) {
    return
  }

  event.preventDefault()
  navigate(targetUrl.pathname + targetUrl.search + targetUrl.hash)
}

function shouldHandleNavigation(
  event: MouseEvent,
  linkElement: HTMLAnchorElement,
): boolean {
  if (event.defaultPrevented || event.button !== 0) {
    return false
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false
  }

  if (linkElement.target === '_blank' || linkElement.hasAttribute('download')) {
    return false
  }

  return true
}
