import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || undefined,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Oops! Có lỗi xảy ra
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Ứng dụng gặp phải lỗi không mong muốn. Chúng tôi đã ghi nhận và sẽ khắc phục sớm nhất.
              </p>
            </div>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-muted p-4 rounded-lg text-left max-w-full overflow-auto">
                <h3 className="font-semibold text-foreground mb-2">Chi tiết lỗi:</h3>
                <pre className="text-sm text-destructive whitespace-pre-wrap">{this.state.error.message}</pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Stack trace
                    </summary>
                    <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{this.state.errorInfo}</pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center text-white gap-2 px-6 py-3 bg-destructive rounded-lg hover:bg-destructive/90 transition-colors duration-200 font-medium">
                <RefreshCw className="w-5 h-5" />
                Tải lại trang
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors duration-200 font-medium">
                Thử lại
              </button>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium">
                <Home className="w-5 h-5" />
                Về trang chủ
              </Link>
            </div>

            {/* Help Text */}
            <div className="text-sm text-muted-foreground">
              <p>Nếu lỗi vẫn tiếp tục, vui lòng liên hệ với bộ phận hỗ trợ.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
