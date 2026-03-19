export interface CleanupHandler {
  (): void
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function observeElementRemoval(
  element: Element,
  cleanupHandler: CleanupHandler,
): void {
  if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') {
    return
  }

  const observer = new MutationObserver(function handleMutations(): void {
    if (element.isConnected) {
      return
    }

    cleanupHandler()
    observer.disconnect()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}
