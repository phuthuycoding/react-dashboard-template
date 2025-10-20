// 🎯 MODEL - Auth interfaces, enums và types

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  refreshToken?: string;
}

// Backend API Response (từ /api/v1/auth/me)
export interface UserResponse {
  id: string;
  firebaseUid: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  permissions?: string[];
  profile?: Record<string, unknown>;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Firebase Auth User
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  firebaseUser: FirebaseUser | null;
  user: UserResponse | null; // User data từ backend
  firebaseToken: string | null;
  error: AuthError | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
