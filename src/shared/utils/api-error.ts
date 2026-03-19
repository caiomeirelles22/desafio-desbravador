import { isAxiosError, type AxiosError } from 'axios'

interface ApiErrorPayload {
  documentation_url?: string
  message?: string
}

export interface ApiError extends Error {
  code: string | null
  details: string | null
  isApiError: true
  isNetworkError: boolean
  isRateLimitError: boolean
  isTimeoutError: boolean
  status: number | null
}

interface ApiErrorOptions {
  code: string | null
  details: string | null
  isNetworkError: boolean
  isRateLimitError: boolean
  isTimeoutError: boolean
  message: string
  status: number | null
}

export function createApiError(options: ApiErrorOptions): ApiError {
  const apiError = new Error(options.message) as ApiError

  apiError.name = 'ApiError'
  apiError.code = options.code
  apiError.details = options.details
  apiError.isApiError = true
  apiError.isNetworkError = options.isNetworkError
  apiError.isRateLimitError = options.isRateLimitError
  apiError.isTimeoutError = options.isTimeoutError
  apiError.status = options.status

  return apiError
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  return 'isApiError' in error && error.isApiError === true
}

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error
  }

  if (isAxiosError(error)) {
    return createApiErrorFromAxiosError(error)
  }

  if (error instanceof Error) {
    return createApiError({
      code: null,
      details: null,
      isNetworkError: false,
      isRateLimitError: false,
      isTimeoutError: false,
      message: error.message || 'Unexpected application error.',
      status: null,
    })
  }

  return createApiError({
    code: null,
    details: null,
    isNetworkError: false,
    isRateLimitError: false,
    isTimeoutError: false,
    message: 'Unexpected application error.',
    status: null,
  })
}

function createApiErrorFromAxiosError(
  error: AxiosError<ApiErrorPayload>,
): ApiError {
  const status = error.response?.status ?? null
  const details = getApiErrorDetails(error)
  const isTimeoutError = error.code === 'ECONNABORTED'
  const isNetworkError = !error.response && !isTimeoutError
  const isRateLimitError = status === 403 && hasRateLimitExceeded(error)

  return createApiError({
    code: error.code ?? null,
    details,
    isNetworkError,
    isRateLimitError,
    isTimeoutError,
    message: getApiErrorMessage(error, {
      isNetworkError,
      isRateLimitError,
      isTimeoutError,
    }),
    status,
  })
}

function getApiErrorMessage(
  error: AxiosError<ApiErrorPayload>,
  flags: {
    isNetworkError: boolean
    isRateLimitError: boolean
    isTimeoutError: boolean
  },
): string {
  if (flags.isTimeoutError) {
    return 'The request took too long to complete.'
  }

  if (flags.isNetworkError) {
    return 'Unable to reach the API.'
  }

  if (flags.isRateLimitError) {
    return 'GitHub API rate limit reached.'
  }

  const responseMessage = error.response?.data?.message

  if (responseMessage && responseMessage.trim() !== '') {
    return responseMessage
  }

  if (error.message.trim() !== '') {
    return error.message
  }

  return 'Unexpected API error.'
}

function getApiErrorDetails(error: AxiosError<ApiErrorPayload>): string | null {
  const documentationUrl = error.response?.data?.documentation_url

  if (documentationUrl && documentationUrl.trim() !== '') {
    return documentationUrl
  }

  return null
}

function hasRateLimitExceeded(error: AxiosError<ApiErrorPayload>): boolean {
  const remainingRequests = getHeaderValue(
    error.response?.headers,
    'x-ratelimit-remaining',
  )

  if (remainingRequests === '0') {
    return true
  }

  return error.response?.data?.message === 'API rate limit exceeded'
}

function getHeaderValue(
  headers: Record<string, unknown> | undefined,
  headerName: string,
): string | null {
  if (!headers) {
    return null
  }

  for (const currentHeaderName of Object.keys(headers)) {
    if (currentHeaderName.toLowerCase() !== headerName.toLowerCase()) {
      continue
    }

    const headerValue = headers[currentHeaderName]

    if (typeof headerValue === 'string' && headerValue.trim() !== '') {
      return headerValue
    }

    if (typeof headerValue === 'number') {
      return String(headerValue)
    }

    if (Array.isArray(headerValue)) {
      return headerValue.join(', ')
    }
  }

  return null
}
