import { Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';

interface ErrorLayoutProps {
  children?: ReactNode;
}

export const ErrorLayout = ({ children }: ErrorLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">{children || <Outlet />}</div>
    </div>
  );
};

export default ErrorLayout;
