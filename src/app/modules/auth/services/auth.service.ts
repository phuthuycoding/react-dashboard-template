import { signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/services/firebase';
import { useApiClient } from '@/lib/api-client';
import type { LoginCredentials, UserResponse, FirebaseUser } from '../models/auth.model';

export class AuthService {
  private apiClient: ReturnType<typeof useApiClient>;

  constructor(apiClient: ReturnType<typeof useApiClient>) {
    this.apiClient = apiClient;
  }

  // Firebase Authentication
  async loginWithFirebase(credentials: LoginCredentials): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);

    const user = userCredential.user;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }

  // Get Firebase ID Token
  async getFirebaseToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;

    return await user.getIdToken();
  }

  // Get user data from our backend
  async getCurrentUser(firebaseToken: string): Promise<UserResponse> {
    const response = await this.apiClient.get<UserResponse>('/auth/me', {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    });
    return response;
  }

  // Complete login flow: Firebase + Backend
  async login(
    credentials: LoginCredentials,
  ): Promise<{ firebaseUser: FirebaseUser; user: UserResponse; token: string }> {
    // 1. Login với Firebase
    const firebaseUser = await this.loginWithFirebase(credentials);

    // 2. Lấy Firebase ID token
    const firebaseToken = await this.getFirebaseToken();
    if (!firebaseToken) {
      throw new Error('Failed to get Firebase token');
    }

    // 3. Gọi backend API để lấy user data
    const user = await this.getCurrentUser(firebaseToken);

    // 4. Store token
    this.storeToken(firebaseToken);

    return { firebaseUser, user, token: firebaseToken };
  }

  async logout(): Promise<void> {
    try {
      // 1. Logout từ Firebase
      await signOut(auth);

      // 2. Call backend logout API nếu có token
      const token = this.getStoredToken();
      if (token) {
        try {
          await this.apiClient.post(
            '/auth/logout',
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } catch (error) {
          console.warn('Backend logout failed:', error);
        }
      }

      // 3. Clear local storage
      this.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage anyway
      this.clearToken();
      throw error;
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('firebaseToken');
  }

  storeToken(token: string): void {
    localStorage.setItem('firebaseToken', token);
  }

  clearToken(): void {
    localStorage.removeItem('firebaseToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser && !!this.getStoredToken();
  }

  // Get current Firebase user
  getCurrentFirebaseUser(): User | null {
    return auth.currentUser;
  }
}

// Hook để sử dụng AuthService
export const useAuthService = () => {
  const apiClient = useApiClient();
  return new AuthService(apiClient);
};
