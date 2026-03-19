import axios, {
  AxiosHeaders,
  type AxiosHeaderValue,
  type AxiosInstance,
  type AxiosResponse,
  type AxiosResponseHeaders,
  type RawAxiosResponseHeaders,
} from 'axios'
import { normalizeApiError } from '../utils/api-error'

export type ApiResponseHeaders =
  | AxiosHeaders
  | AxiosResponseHeaders
  | Partial<RawAxiosResponseHeaders>

export const apiClient = createApiClient()

export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: getRequiredEnv('VITE_GITHUB_API_BASE_URL'),
    headers: createDefaultHeaders(),
    timeout: getNumberEnv('VITE_GITHUB_API_TIMEOUT_MS'),
  })

  client.interceptors.response.use(handleResponseSuccess, handleResponseError)

  return client
}

export function getResponseHeader(
  headers: ApiResponseHeaders | undefined,
  headerName: string,
): string | null {
  if (!headers) {
    return null
  }

  if (headers instanceof AxiosHeaders) {
    const headerValue = headers.get(headerName)

    return normalizeHeaderValue(headerValue)
  }

  for (const currentHeaderName of Object.keys(headers)) {
    if (currentHeaderName.toLowerCase() !== headerName.toLowerCase()) {
      continue
    }

    const headerValue = headers[currentHeaderName]

    return normalizeHeaderValue(headerValue)
  }

  return null
}

function createDefaultHeaders(): Record<string, string> {
  return {
    Accept: getRequiredEnv('VITE_GITHUB_API_ACCEPT_HEADER'),
    'X-GitHub-Api-Version': getRequiredEnv('VITE_GITHUB_API_VERSION'),
  }
}

function handleResponseSuccess(response: AxiosResponse): AxiosResponse {
  return response
}

function handleResponseError(error: unknown): Promise<never> {
  return Promise.reject(normalizeApiError(error))
}

function normalizeHeaderValue(headerValue: AxiosHeaderValue | undefined): string | null {
  if (typeof headerValue === 'string' && headerValue.trim() !== '') {
    return headerValue
  }

  if (typeof headerValue === 'number') {
    return String(headerValue)
  }

  if (Array.isArray(headerValue)) {
    return headerValue.join(', ')
  }

  return null
}

function getRequiredEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]

  if (typeof value === 'string' && value.trim() !== '') {
    return value
  }

  throw new Error(`Missing required environment variable "${name}".`)
}

function getNumberEnv(name: keyof ImportMetaEnv): number {
  const value = getRequiredEnv(name)
  const parsedValue = Number(value)

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue
  }

  throw new Error(`Environment variable "${name}" must be a positive number.`)
}
