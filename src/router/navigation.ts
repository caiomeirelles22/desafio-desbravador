export interface NavigateOptions {
  replace?: boolean
}

export interface NavigateHandler {
  (to: string, options?: NavigateOptions): void
}

let registeredNavigateHandler: NavigateHandler | null = null

export function registerNavigateHandler(handler: NavigateHandler): void {
  registeredNavigateHandler = handler
}

export function navigate(to: string, options: NavigateOptions = {}): void {
  if (!registeredNavigateHandler) {
    throw new Error('Navigate handler is not registered yet.')
  }

  registeredNavigateHandler(to, options)
}
