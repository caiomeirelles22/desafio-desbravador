import { createThemeToggleMarkup } from '../features/theme/components/theme-toggle'
import { themeStore } from '../features/theme/stores/theme.store'
import { navigate } from '../router/navigation'
import { createRouter } from '../router/router'

interface AppElements {
  shellElement: HTMLElement
  routeViewElement: HTMLElement
}

export function createApp(rootElement: HTMLElement): void {
  const appElements = createAppShell()
  const router = createRouter(appElements.routeViewElement, appElements.shellElement)

  themeStore.hydrateThemeMode()
  renderThemeToggle(appElements.shellElement)
  appElements.shellElement.addEventListener('click', handleNavigationClick)
  appElements.shellElement.addEventListener('click', handleThemeToggleClick)
  themeStore.subscribe(function handleThemeChange(): void {
    renderThemeToggle(appElements.shellElement)
  })

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
          <div class="app-toolbar">
            <nav class="app-nav" aria-label="Principal">
              <a class="nav-link" href="/" data-link data-nav-route="home">Inicio</a>
              <a class="nav-link" href="/favorites" data-link data-nav-route="favorites">Favoritos</a>
            </nav>
            <div data-theme-toggle-slot></div>
          </div>
        </div>
        <div class="hero-panel">
          <span class="hero-eyebrow">Vanilla TypeScript + API do GitHub</span>
          <h1 class="hero-title">Busque usuarios e explore repositorios em uma aplicacao client-side leve.</h1>
          <p class="hero-description">
            O shell, o roteamento e a camada de dados ja estao no lugar, e cada proxima tela entra no mesmo fluxo guiado por URL.
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

  renderThemeToggle(shellElement)

  return {
    shellElement,
    routeViewElement,
  }
}

function renderThemeToggle(shellElement: HTMLElement): void {
  const themeToggleSlot = shellElement.querySelector<HTMLElement>('[data-theme-toggle-slot]')

  if (!themeToggleSlot) {
    return
  }

  themeToggleSlot.innerHTML = createThemeToggleMarkup({
    mode: themeStore.getState().mode,
  })
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

function handleThemeToggleClick(event: MouseEvent): void {
  const targetElement = event.target

  if (!(targetElement instanceof Element)) {
    return
  }

  const themeToggleElement = targetElement.closest('[data-theme-toggle]')

  if (!themeToggleElement) {
    return
  }

  themeStore.toggleThemeMode()
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
