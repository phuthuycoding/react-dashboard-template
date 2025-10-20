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
      message: firebaseError.message || 'An unknown error occurred',
      code: firebaseError.code,
    };
  }

  // Handle API errors
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string; code?: string } } };
    return {
      message: apiError.response?.data?.message || 'An unknown error occurred',
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
    message: 'An unknown error occurred',
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
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'Account has been disabled',
    'auth/email-already-in-use': 'This email is already in use',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password',
    'auth/invalid-credential': 'Invalid credentials',

    // Rate limiting
    'auth/too-many-requests': 'Too many attempts. Please try again in a few minutes',
    'auth/operation-not-allowed': 'This sign-in method is not enabled',

    // Network errors
    'auth/network-request-failed': 'Network connection error. Please check your internet connection',
    'auth/timeout': 'Connection timed out. Please try again',

    // Token errors
    'auth/invalid-api-key': 'Invalid system configuration',
    'auth/app-deleted': 'Application has been deleted',
    'auth/app-not-authorized': 'Application is not authorized',

    // Multi-factor authentication
    'auth/multi-factor-auth-required': 'Two-factor authentication required',
    'auth/maximum-second-factor-count-exceeded': 'Maximum authentication factors exceeded',
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
    return 'Incorrect password';
  }

  if (message.toLowerCase().includes('email')) {
    return 'There is an issue with the email address';
  }

  if (message.toLowerCase().includes('network') || message.toLowerCase().includes('connection')) {
    return 'Network connection error. Please try again';
  }

  // Return original message if no mapping found
  return message || 'An unknown error occurred. Please try again';
};
