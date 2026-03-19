import {
  createStore,
  type Store,
  type StoreUpdater,
} from '../../../shared/store/create-store'
import { loadThemeMode, saveThemeMode } from '../utils/theme-storage'

export type ThemeMode = 'light' | 'dark'

export interface ThemeState {
  mode: ThemeMode
}

export interface ThemeStore extends Store<ThemeState> {
  hydrateThemeMode(): void
  setThemeMode(themeMode: ThemeMode): void
  toggleThemeMode(): void
}

export const themeStore = createThemeStore()

export function createThemeStore(): ThemeStore {
  const store = createStore(createInitialThemeState)

  function getState(): ThemeState {
    return store.getState()
  }

  function setState(nextState: ThemeState): void {
    syncThemeMode(nextState.mode)
  }

  function patchState(partialState: Partial<ThemeState>): void {
    const nextState = {
      ...store.getState(),
      ...partialState,
    }

    syncThemeMode(nextState.mode)
  }

  function updateState(
    updater: StoreUpdater<ThemeState>,
  ): void {
    setState(updater(store.getState()))
  }

  function resetState(): void {
    syncThemeMode(createInitialThemeState().mode)
  }

  function hydrateThemeMode(): void {
    const storedThemeMode = loadThemeMode()
    const nextThemeMode = storedThemeMode ?? getState().mode

    syncThemeMode(nextThemeMode)
  }

  function setThemeMode(themeMode: ThemeMode): void {
    syncThemeMode(themeMode)
  }

  function toggleThemeMode(): void {
    const currentThemeMode = store.getState().mode
    const nextThemeMode = currentThemeMode === 'light' ? 'dark' : 'light'

    syncThemeMode(nextThemeMode)
  }

  function syncThemeMode(themeMode: ThemeMode): void {
    store.patchState({
      mode: themeMode,
    })
    saveThemeMode(themeMode)
    applyThemeMode(themeMode)
  }

  return {
    getState: getState,
    hydrateThemeMode: hydrateThemeMode,
    patchState: patchState,
    resetState: resetState,
    setState: setState,
    setThemeMode: setThemeMode,
    subscribe: store.subscribe,
    toggleThemeMode: toggleThemeMode,
    updateState: updateState,
  }
}

function createInitialThemeState(): ThemeState {
  return {
    mode: 'light',
  }
}

function applyThemeMode(themeMode: ThemeMode): void {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-bs-theme', themeMode)
}
