import { Component } from 'react';

import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProperties {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | undefined;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProperties,
  ErrorBoundaryState
> {
  constructor(properties: ErrorBoundaryProperties) {
    super(properties);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
          <h2 className="text-lg font-semibold text-danger">
            Something went wrong
          </h2>
          <pre className="max-w-lg overflow-auto rounded-lg bg-bg-secondary p-4 text-xs text-text-secondary">
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <button
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
            onClick={() => {
              this.setState({ error: undefined });
            }}
            type="button"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
