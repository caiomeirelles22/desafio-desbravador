import type { ThemeMode } from '../stores/theme.store'

export interface ThemeToggleContent {
  mode: ThemeMode
}

export function createThemeToggleMarkup(content: ThemeToggleContent): string {
  const isDarkMode = content.mode === 'dark'
  const label = isDarkMode ? 'Modo escuro' : 'Modo claro'
  const helper = isDarkMode ? 'Trocar para claro' : 'Trocar para escuro'
  const icon = isDarkMode ? '☾' : '☀'

  return `
    <button
      class="theme-toggle ${isDarkMode ? 'is-dark' : 'is-light'}"
      type="button"
      data-theme-toggle
      aria-pressed="${isDarkMode ? 'true' : 'false'}"
      aria-label="${helper}"
      title="${helper}"
    >
      <span class="theme-toggle-icon" aria-hidden="true">${icon}</span>
      <span class="theme-toggle-copy">
        <span class="theme-toggle-label">${label}</span>
        <span class="theme-toggle-helper">${helper}</span>
      </span>
    </button>
  `
}
