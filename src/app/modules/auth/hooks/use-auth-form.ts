import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../models/auth.schema';

/**
 * Custom hook for managing authentication form state and validation
 * @returns Form instance with validation
 */
export const useAuthForm = () => {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange', // Validate on change for better UX
  });
};
