import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth.context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string;
  fallbackPath?: string;
}

/**
 * Protected Route component that checks authentication and authorization
 */
export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/auth/login',
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

/**
 * Public Route component that redirects authenticated users
 */
export function PublicRoute({ children, redirectPath = '/' }: { children: React.ReactNode; redirectPath?: string }) {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

/**
 * Role-based Route component
 */
export function RoleRoute({
  children,
  allowedRoles,
  fallbackPath = '/unauthorized',
}: {
  children: React.ReactNode;
  allowedRoles: string | string[];
  fallbackPath?: string;
}) {
  const { isLoading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
