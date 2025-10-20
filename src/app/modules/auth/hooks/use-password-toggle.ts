import { useState, useCallback } from 'react';

/**
 * Custom hook for managing password visibility toggle
 * @returns Object with showPassword state and toggle function
 */
export const usePasswordToggle = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    showPassword,
    togglePassword,
  };
};
