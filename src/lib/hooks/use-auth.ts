import { Auth, type AuthContext } from '@/app/shared/contexts/auth.context';
import React from 'react';

/**
 * Custom hook to use the authentication context.
 *
 * @returns {AuthContext} The authentication context.
 * @throws {Error} If used outside an AuthProvider.
 */
export const useAuth = (): AuthContext => {
  const context = React.useContext(Auth);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
