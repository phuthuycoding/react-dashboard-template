import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { usePasswordToggle } from '../hooks';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/**
 * Reusable password input component with toggle visibility
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
  const { showPassword, togglePassword } = usePasswordToggle();

  return (
    <div className="relative">
      <Input ref={ref} type={showPassword ? 'text' : 'password'} className={`pr-10 ${className || ''}`} {...props} />
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        tabIndex={-1}>
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
