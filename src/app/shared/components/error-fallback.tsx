import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

export const ErrorFallback = ({
  error,
  resetError,
  title = 'Có lỗi xảy ra',
  message = 'Ứng dụng gặp phải lỗi không mong muốn. Vui lòng thử lại.',
}: ErrorFallbackProps) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="text-center space-y-6 p-8">
      {/* Error Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
      </div>

      {/* Error Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
      </div>

      {/* Error Details (Development) */}
      {process.env.NODE_ENV === 'development' && error && (
        <div className="bg-muted p-4 rounded-lg text-left max-w-full overflow-auto">
          <h3 className="font-semibold text-foreground mb-2">Chi tiết lỗi:</h3>
          <pre className="text-sm text-destructive whitespace-pre-wrap">{error.message}</pre>
          {error.stack && (
            <details className="mt-2">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Stack trace</summary>
              <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{error.stack}</pre>
            </details>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {resetError && (
          <button
            onClick={resetError}
            className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors duration-200 font-medium">
            Thử lại
          </button>
        )}

        <button
          onClick={handleReload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors duration-200 font-medium">
          <RefreshCw className="w-4 h-4" />
          Tải lại
        </button>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium">
          <Home className="w-4 h-4" />
          Trang chủ
        </Link>
      </div>
    </div>
  );
};

export default ErrorFallback;
