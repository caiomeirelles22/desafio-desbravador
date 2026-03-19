import { readStorageValue, writeStorageValue } from '../../../shared/utils/storage'
import type { ThemeMode } from '../stores/theme.store'

const THEME_STORAGE_KEY = 'github-user-explorer:theme'

export function loadThemeMode(): ThemeMode | null {
  const storedValue = readStorageValue(THEME_STORAGE_KEY)

  if (storedValue === 'light' || storedValue === 'dark') {
    return storedValue
  }

  return null
}

export function saveThemeMode(themeMode: ThemeMode): void {
  writeStorageValue(THEME_STORAGE_KEY, themeMode)
}
