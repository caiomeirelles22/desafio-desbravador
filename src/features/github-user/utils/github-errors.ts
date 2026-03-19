import { isApiError } from '../../../shared/utils/api-error'

export type GitHubResourceName = 'repositories' | 'repository' | 'user'

export function getGitHubErrorMessage(
  error: unknown,
  resourceName: GitHubResourceName,
): string {
  if (!isApiError(error)) {
    return 'Ocorreu um erro inesperado. Tente novamente.'
  }

  if (error.isTimeoutError) {
    return 'A requisicao demorou mais do que o esperado. Tente novamente.'
  }

  if (error.isNetworkError) {
    return 'Sem conexao com a internet ou falha de rede.'
  }

  if (error.isRateLimitError) {
    return 'Limite de requisicoes da API do GitHub atingido.'
  }

  if (error.status === 404) {
    return getNotFoundMessage(resourceName)
  }

  if (error.status !== null && error.status >= 500) {
    return 'O GitHub recusou a requisicao no momento. Tente novamente mais tarde.'
  }

  return 'Nao foi possivel concluir a operacao agora. Tente novamente.'
}

function getNotFoundMessage(resourceName: GitHubResourceName): string {
  if (resourceName === 'user') {
    return 'Usuario nao encontrado.'
  }

  if (resourceName === 'repository') {
    return 'Repositorio nao encontrado.'
  }

  return 'Nao foi possivel carregar os repositorios desse usuario.'
}
