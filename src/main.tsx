import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts'
import './styles/globals.css'
import App from './App'
import { ReactQueryProvider } from './lib/ReactQueryProvider'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no documento.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </StrictMode>,
)
