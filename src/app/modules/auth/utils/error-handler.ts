import type { AuthError } from '../models/auth.model';

/**
 * Utility function to handle and format authentication errors
 * @param error - The error object from API or other sources
 * @returns Formatted AuthError object
 */
export const handleAuthError = (error: unknown): AuthError => {
  // Handle Firebase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code?: string; message?: string };
    return {
      message: firebaseError.message || 'Đã xảy ra lỗi không xác định',
      code: firebaseError.code,
    };
  }

  // Handle API errors
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string; code?: string } } };
    return {
      message: apiError.response?.data?.message || 'Đã xảy ra lỗi không xác định',
      code: apiError.response?.data?.code,
    };
  }

  // Handle Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  // Default error
  return {
    message: 'Đã xảy ra lỗi không xác định',
  };
};

/**
 * Get user-friendly error message for common authentication errors
 * @param error - AuthError object
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: AuthError): string => {
  // Firebase Authentication Error Codes
  const firebaseErrors: Record<string, string> = {
    // Email/Password errors
    'auth/user-not-found': 'Không tìm thấy tài khoản với email này',
    'auth/wrong-password': 'Mật khẩu không chính xác',
    'auth/invalid-email': 'Địa chỉ email không hợp lệ',
    'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
    'auth/email-already-in-use': 'Email này đã được sử dụng',
    'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn',
    'auth/invalid-credential': 'Thông tin đăng nhập không hợp lệ',

    // Rate limiting
    'auth/too-many-requests': 'Quá nhiều lần thử. Vui lòng thử lại sau ít phút',
    'auth/operation-not-allowed': 'Phương thức đăng nhập này chưa được kích hoạt',

    // Network errors
    'auth/network-request-failed': 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet',
    'auth/timeout': 'Kết nối quá chậm. Vui lòng thử lại',

    // Token errors
    'auth/invalid-api-key': 'Cấu hình hệ thống không hợp lệ',
    'auth/app-deleted': 'Ứng dụng đã bị xóa',
    'auth/app-not-authorized': 'Ứng dụng không được phép truy cập',

    // Multi-factor authentication
    'auth/multi-factor-auth-required': 'Yêu cầu xác thực hai yếu tố',
    'auth/maximum-second-factor-count-exceeded': 'Đã vượt quá số lượng yếu tố xác thực',
  };

  // Check if we have a specific error mapping
  if (error.code && firebaseErrors[error.code]) {
    return firebaseErrors[error.code];
  }

  // Fallback to original message but make it more user-friendly
  const message = error.message;

  // Handle some common patterns in Firebase error messages
  if (message.includes('Firebase: Error (auth/')) {
    const match = message.match(/auth\/([^)]+)/);
    if (match && firebaseErrors[`auth/${match[1]}`]) {
      return firebaseErrors[`auth/${match[1]}`];
    }
  }

  // Generic fallbacks for common error patterns
  if (message.toLowerCase().includes('password')) {
    return 'Mật khẩu không chính xác';
  }

  if (message.toLowerCase().includes('email')) {
    return 'Có lỗi với địa chỉ email';
  }

  if (message.toLowerCase().includes('network') || message.toLowerCase().includes('connection')) {
    return 'Lỗi kết nối mạng. Vui lòng thử lại';
  }

  // Return original message if no mapping found
  return message || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại';
};
