import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

window.addEventListener('error', (event) => {
  console.error('[PetConnect] Uncaught error:', event.error ?? event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[PetConnect] Unhandled promise rejection:', event.reason)
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    'Root element with id "root" not found. Ensure index.html contains <div id="root"></div>.',
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
