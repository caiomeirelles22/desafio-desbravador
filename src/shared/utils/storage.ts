export function readJsonStorageValue<Value>(
  key: string,
  fallbackValue: Value,
): Value {
  const rawValue = readStorageValue(key)

  if (rawValue === null) {
    return fallbackValue
  }

  try {
    return JSON.parse(rawValue) as Value
  } catch {
    return fallbackValue
  }
}

export function writeJsonStorageValue(key: string, value: unknown): void {
  try {
    writeStorageValue(key, JSON.stringify(value))
  } catch {
    return
  }
}

export function readStorageValue(key: string): string | null {
  const storage = getLocalStorage()

  if (!storage) {
    return null
  }

  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorageValue(key: string, value: string): void {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(key, value)
  } catch {
    return
  }
}

export function removeStorageValue(key: string): void {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  try {
    storage.removeItem(key)
  } catch {
    return
  }
}

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}
