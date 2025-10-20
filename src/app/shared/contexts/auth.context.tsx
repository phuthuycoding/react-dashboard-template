import React, { createContext, useContext, useEffect, useState, type JSX } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/services/firebase';
import { useAuthService } from '@/app/modules/auth/services/auth.service';
import type { FirebaseUser } from '@/app/modules/auth/models/auth.model';
import { toast } from 'sonner';

/**
 * Interface defining the structure for authentication user data.
 */
export interface AuthUser {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  profileImage?: string;
  phoneNumber?: string;
}

/**
 * Type defining the state structure for authentication.
 */
export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  firebaseUser: FirebaseUser | null;
  user: AuthUser | null;
  firebaseToken: string | null;
  error: { message: string } | null;
};

/**
 * Type defining the context structure for authentication, including functions for login, logout, and checking roles and permissions.
 */
export type AuthContext = AuthState & {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
};

/**
 * Authentication context created with React's createContext, initially undefined.
 */
export const Auth = createContext<AuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provides authentication context to child components.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }): JSX.Element => {
  const authService = useAuthService();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true, // Loading initially để check auth state
    isAuthenticated: false,
    firebaseUser: null,
    user: null,
    firebaseToken: null,
    error: null,
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // User is signed in, get token and user data
          const token = await firebaseUser.getIdToken();
          const userData = await authService.getCurrentUser(token);

          // Store token
          authService.storeToken(token);

          // Convert UserResponse to AuthUser
          const authUser: AuthUser = {
            id: userData.id,
            firebaseUid: userData.firebaseUid,
            name: userData.name || userData.email,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            permissions: userData.permissions || [],
            profileImage: userData.avatar,
            phoneNumber: userData.phone,
          };

          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            firebaseUser: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
            },
            user: authUser,
            firebaseToken: token,
            error: null,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If backend fails, clear everything
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            firebaseUser: null,
            user: null,
            firebaseToken: null,
            error: { message: 'Failed to fetch user data' },
          });

          // Sign out from Firebase if backend fails
          await authService.logout();
        }
      } else {
        // User is signed out
        authService.clearToken();
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          firebaseUser: null,
          user: null,
          firebaseToken: null,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { firebaseUser, user, token } = await authService.login(credentials);

      // Convert UserResponse to AuthUser
      const authUser: AuthUser = {
        id: user.id,
        firebaseUid: user.firebaseUid,
        name: user.name || user.email,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions || [],
        profileImage: user.avatar,
        phoneNumber: user.phone,
      };

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        firebaseUser,
        user: authUser,
        firebaseToken: token,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        firebaseUser: null,
        user: null,
        firebaseToken: null,
        error: { message: error instanceof Error ? error.message : 'Login failed' },
      }));
      throw error;
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
      // State will be updated by onAuthStateChanged listener
    } catch (error) {
      toast.error(`Logout failed ${error instanceof Error ? error.message : 'Logout failed'}`);
      // Force clear state even if logout fails
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        firebaseUser: null,
        user: null,
        firebaseToken: null,
        error: null,
      });
    }
  };

  const refreshUser = async () => {
    if (!authState.firebaseToken) return;

    try {
      const userData = await authService.getCurrentUser(authState.firebaseToken);

      // Convert UserResponse to AuthUser
      const authUser: AuthUser = {
        id: userData.id,
        firebaseUid: userData.firebaseUid,
        name: userData.name || userData.email,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        permissions: userData.permissions || [],
        profileImage: userData.avatar,
        phoneNumber: userData.phone,
      };

      setAuthState((prev) => ({
        ...prev,
        user: authUser,
      }));
    } catch (error) {
      toast.error(`Refresh user failed ${error instanceof Error ? error.message : 'Refresh user failed'}`);
      window.location.href = '/auth/login';
    }
  };

  /**
   * Checks if the authenticated user has a specific role.
   */
  const hasRole = (role: string | string[]): boolean => {
    if (!authState.user) return false;

    if (role.toString() === '*') {
      return true;
    }

    if (Array.isArray(role)) {
      return role.includes(authState.user.role);
    } else {
      return authState.user.role === role;
    }
  };

  /**
   * Checks if the authenticated user has a specific permission.
   */
  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    return authState.user.permissions.includes(permission);
  };

  const contextValue: AuthContext = {
    ...authState,
    login,
    logout,
    refreshUser,
    hasRole,
    hasPermission,
  };

  return <Auth.Provider value={contextValue}>{children}</Auth.Provider>;
};

/**
 * Hook to use the Auth context
 */
export function useAuth() {
  const context = useContext(Auth);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
