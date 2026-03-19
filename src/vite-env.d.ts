/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_API_ACCEPT_HEADER: string
  readonly VITE_GITHUB_API_BASE_URL: string
  readonly VITE_GITHUB_API_TIMEOUT_MS: string
  readonly VITE_GITHUB_API_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
