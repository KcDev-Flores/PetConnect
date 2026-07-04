import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PetConnect] Render error:', error, errorInfo.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message ?? 'An unexpected error occurred.'}</p>
          <button type="button" onClick={this.handleRetry}>
            Try again
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
