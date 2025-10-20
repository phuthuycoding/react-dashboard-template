import type { ComponentType } from 'react';
import { useAuth } from '../contexts/auth.context';

export const withAuth = <T extends object>(WrappedComponent: ComponentType<T>) => {
  return (props: T) => {
    const ctx = useAuth();
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return <WrappedComponent {...props} auth={ctx.user} isAuthenticated={ctx.isAuthenticated} />;
  };
};
