import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/tokens.css'
import './styles/globals.css'
import { createApp } from './app/app'

const rootElement = document.querySelector<HTMLDivElement>('#app')

if (!rootElement) {
  throw new Error('Root container "#app" was not found.')
}

createApp(rootElement)
