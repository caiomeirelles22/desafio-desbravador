export interface RouteParams {
  [key: string]: string
}

export function matchRoutePath(pattern: string, pathname: string): RouteParams | null {
  const patternSegments = createPathSegments(pattern)
  const pathnameSegments = createPathSegments(pathname)

  if (patternSegments.length !== pathnameSegments.length) {
    return null
  }

  const params: RouteParams = {}

  for (let index = 0; index < patternSegments.length; index += 1) {
    const patternSegment = patternSegments[index]
    const pathnameSegment = pathnameSegments[index]

    if (!patternSegment || !pathnameSegment) {
      return null
    }

    if (isParameterSegment(patternSegment)) {
      params[getParameterName(patternSegment)] = decodeURIComponent(pathnameSegment)
      continue
    }

    if (patternSegment !== pathnameSegment) {
      return null
    }
  }

  return params
}

export function normalizePathname(pathname: string): string {
  if (pathname === '' || pathname === '/') {
    return '/'
  }

  const pathnameWithoutTrailingSlash = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname

  if (pathnameWithoutTrailingSlash === '') {
    return '/'
  }

  return pathnameWithoutTrailingSlash.startsWith('/')
    ? pathnameWithoutTrailingSlash
    : `/${pathnameWithoutTrailingSlash}`
}

function createPathSegments(pathname: string): string[] {
  const normalizedPathname = normalizePathname(pathname)

  if (normalizedPathname === '/') {
    return []
  }

  return normalizedPathname.slice(1).split('/')
}

function isParameterSegment(segment: string): boolean {
  return segment.startsWith(':')
}

function getParameterName(segment: string): string {
  return segment.slice(1)
}
