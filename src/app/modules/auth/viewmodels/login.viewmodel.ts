import { useAuth } from '@/app/shared/contexts/auth.context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthForm, usePasswordToggle } from '../hooks';
import type { LoginFormData } from '../models';
import { getErrorMessage, handleAuthError } from '../utils';

export const useLoginViewModel = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const form = useAuthForm();
  const { showPassword, togglePassword } = usePasswordToggle();

  const handleLogin = async (credentials: LoginFormData) => {
    try {
      // Use login method from AuthContext
      await auth.login(credentials);
      // Success toast and navigation
      navigate('/');
    } catch (error: unknown) {
      const authError = handleAuthError(error);
      const errorMessage = getErrorMessage(authError);

      toast.error(errorMessage);
    }
  };

  return {
    form,
    authState: {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      firebaseUser: auth.firebaseUser,
      user: auth.user,
      firebaseToken: auth.firebaseToken,
      error: auth.error,
    },
    showPassword,
    handleLogin,
    togglePassword,
  };
};
