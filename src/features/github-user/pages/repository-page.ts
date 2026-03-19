import { createPlaceholderPage } from '../../../shared/components/placeholder-page'

export interface RepositoryPageContent {
  owner: string
  repositoryName: string
}

export function createRepositoryPage(content: RepositoryPageContent): HTMLElement {
  return createPlaceholderPage({
    eyebrow: 'Rota do repositorio',
    title: `Rota do repositorio carregada para "${content.owner}/${content.repositoryName}".`,
    description:
      'O router esta resolvendo owner e repository antes mesmo de a camada final da pagina de detalhe ser montada.',
    actions: [
      {
        href: `/user/${encodeURIComponent(content.owner)}`,
        label: 'Voltar para o usuario',
        variant: 'primary',
      },
      {
        href: '/',
        label: 'Voltar para o inicio',
        variant: 'secondary',
      },
    ],
    details: [
      {
        title: 'Parametro owner',
        description: `Parametro owner resolvido: ${content.owner}.`,
      },
      {
        title: 'Parametro repository',
        description: `Parametro repository resolvido: ${content.repositoryName}.`,
      },
      {
        title: 'Proxima etapa',
        description:
          'Esta pagina vai buscar os detalhes do repositorio de forma independente da tela de listagem.',
      },
    ],
  })
}
