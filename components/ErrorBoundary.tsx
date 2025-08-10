"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Call the optional onError callback
    this.props.onError?.(error, errorInfo);
    
    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, or other error tracking service
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
          <Image
            src="/purr-lying-happy.png"
            alt="Error illustration"
            width={120}
            height={120}
            className="rounded-full opacity-80"
          />
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 max-w-md">
              We&apos;re sorry, but something unexpected happened. Please try again or contact support if the problem persists.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => this.setState({ hasError: false })}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-emerald)] text-white"
            >
              Try Again
            </Button>
            <Link href="/support">
              <Button
                variant="outline"
                className="border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
              >
                Contact Support
              </Button>
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left text-sm text-gray-500 max-w-lg">
              <summary className="cursor-pointer font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap bg-gray-50 p-3 rounded border text-xs overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}