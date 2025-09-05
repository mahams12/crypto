import React from 'react';
import { HiOutlineExclamation, HiOutlineRefresh } from 'react-icons/hi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="mx-auto w-16 h-16 bg-danger-500/20 rounded-full flex items-center justify-center mb-4">
                <HiOutlineExclamation className="w-8 h-8 text-danger-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-100 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-400 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full btn btn-primary flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <HiOutlineRefresh className="w-4 h-4 mr-2" />
                Refresh Page
              </button>

              <button
                onClick={this.handleRetry}
                className="w-full btn btn-secondary flex items-center justify-center px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-100 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                  Error Details (Development Only)
                </summary>
                <div className="mt-4 p-4 bg-dark-800 rounded-lg overflow-auto">
                  <pre className="text-xs text-red-400 whitespace-pre-wrap">
                    {this.state.error && this.state.error.toString()}
                  </pre>
                  <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;