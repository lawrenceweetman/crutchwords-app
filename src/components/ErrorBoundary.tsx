import { Component, ErrorInfo, ReactNode } from 'react';

import { logger } from '@/utils/logger';

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary Component
 *
 * Catches rendering errors in React components and displays a user-friendly
 * error message. All errors are logged for debugging.
 *
 * Required by development-guide.md section 2.6 (Structured Error Handling)
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our logging service
    logger.error('React Error Boundary caught an error', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      stack: error.stack,
    });

    this.setState({
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 xs:p-6">
          <div className="max-w-md w-full bg-background-secondary rounded-lg shadow-lg p-6 xs:p-8">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-danger bg-opacity-20 rounded-full mb-4 xs:mb-6">
              <svg
                className="w-6 h-6 text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-text-secondary text-center mb-6">
              We encountered an unexpected error. Don't worry, your data is safe. Please try
              refreshing the page.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-4 p-4 bg-background-tertiary rounded text-sm">
                <summary className="cursor-pointer text-text-primary font-medium mb-2">
                  Error Details (Development Mode)
                </summary>
                <pre className="text-danger text-xs overflow-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 xs:gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-3 xs:px-6 xs:py-3 min-h-touch-target bg-background-tertiary text-text-primary rounded-lg hover:bg-opacity-80 transition-colors text-sm xs:text-base font-medium"
                type="button"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-3 xs:px-6 xs:py-3 min-h-touch-target bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm xs:text-base font-medium"
                type="button"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
