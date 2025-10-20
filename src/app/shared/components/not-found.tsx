import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="text-center space-y-8">
      {/* 404 Illustration */}
      <div className="relative">
        <div className="text-9xl font-bold text-muted/20 select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search className="w-16 h-16 text-primary animate-pulse" />
        </div>
      </div>

      {/* Error Message */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Trang không tìm thấy
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium">
          <Home className="w-5 h-5" />
          Về trang chủ
        </Link>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors duration-200 font-medium">
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
      </div>

      {/* Help Text */}
      <div className="text-sm text-muted-foreground space-y-2">
        <p>Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ với chúng tôi.</p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="text-primary hover:text-primary/80 underline">
            Dashboard
          </Link>
          <span className="text-muted">|</span>
          <Link to="/auth/login" className="text-primary hover:text-primary/80 underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
