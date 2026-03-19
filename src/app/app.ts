interface FoundationItem {
  title: string
  description: string
}

const FOUNDATION_ITEMS: FoundationItem[] = [
  {
    title: 'Application shell',
    description:
      'Estrutura base com header, area principal e um ponto de montagem para as proximas rotas.',
  },
  {
    title: 'Global styles',
    description:
      'Tokens visuais e resets prontos para sustentar a interface em mobile e desktop.',
  },
  {
    title: 'Bootstrap ready',
    description:
      'Grid, utilitarios e componentes basicos ja estao disponiveis para as proximas etapas.',
  },
]

export function createApp(rootElement: HTMLElement): void {
  rootElement.classList.add('app-root')
  rootElement.replaceChildren(createAppShell())
}

function createAppShell(): HTMLElement {
  const shell = document.createElement('div')

  shell.className = 'app-shell'
  shell.innerHTML = `
    <header class="app-header">
      <div class="app-container">
        <div class="hero-panel">
          <span class="hero-eyebrow">Desafio front-end GitHub</span>
          <h1 class="hero-title">GitHub User Explorer</h1>
          <p class="hero-description">
            A base da aplicacao esta pronta para receber roteamento, integracao com a API e as telas da jornada principal.
          </p>
        </div>
      </div>
    </header>
    <main class="app-main">
      <div class="app-container">
        <div class="route-view" data-route-view>
          <section class="foundation-panel" aria-labelledby="foundation-title">
            <div class="foundation-copy">
              <span class="section-kicker">Passo 2</span>
              <h2 id="foundation-title" class="section-title">Base da aplicacao configurada</h2>
              <p class="section-description">
                O starter do Vite foi removido e o projeto agora tem um shell inicial, container raiz e estilos globais alinhados ao plano.
              </p>
            </div>
            <div class="foundation-grid">
              ${FOUNDATION_ITEMS.map(createFoundationCardMarkup).join('')}
            </div>
          </section>
        </div>
      </div>
    </main>
  `

  return shell
}

function createFoundationCardMarkup(item: FoundationItem): string {
  return `
    <article class="foundation-card">
      <h3 class="foundation-card-title">${item.title}</h3>
      <p class="foundation-card-description">${item.description}</p>
    </article>
  `
}
