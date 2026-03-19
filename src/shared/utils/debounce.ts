export interface DebounceCallback<Args extends unknown[]> {
  (...args: Args): void
}

export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void
  cancel(): void
}

export function debounce<Args extends unknown[]>(
  callback: DebounceCallback<Args>,
  waitMs: number,
): DebouncedFunction<Args> {
  let lastArguments: Args | null = null
  let timeoutId: number | null = null

  function debouncedFunction(...args: Args): void {
    lastArguments = args

    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(function runCallback(): void {
      timeoutId = null

      if (!lastArguments) {
        return
      }

      const nextArguments = lastArguments

      lastArguments = null
      callback(...nextArguments)
    }, waitMs)
  }

  debouncedFunction.cancel = function cancel(): void {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
    }

    lastArguments = null
    timeoutId = null
  }

  return debouncedFunction
}
