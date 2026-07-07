import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error boundary caught', error, info);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center"
            role="alert"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                backgroundColor: 'var(--danger-subtle)',
                color: 'var(--danger)',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              页面出现异常
            </h2>
            <p
              className="text-sm max-w-md mb-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              抱歉，页面在渲染时遇到了意外错误。可以尝试刷新页面，或返回首页继续操作。
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary"
              >
                刷新页面
              </button>
              <a href="/" className="btn-secondary">
                返回首页
              </a>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
