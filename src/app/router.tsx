import type { RouteObject } from 'react-router-dom';
import ErrorLayout from './layouts/error-layout';
import FullLayout from './layouts/full-layout';
import Login from './modules/auth/pages/login';
import ErrorBoundary from './shared/components/error-boundary';
import NotFound from './shared/components/not-found';
import { PublicRoute } from './shared/components/protected-route';

export const routers: RouteObject[] = [
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <FullLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
    ],
    errorElement: (
      <ErrorLayout>
        <ErrorBoundary>
          <div>An error occurred</div>
        </ErrorBoundary>
      </ErrorLayout>
    ),
  },
  {
    path: '/auth',
    element: (
      <ErrorBoundary>
        <FullLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
    ],
    errorElement: (
      <ErrorLayout>
        <ErrorBoundary>
          <div>An error occurred</div>
        </ErrorBoundary>
      </ErrorLayout>
    ),
  },
  {
    path: '*',
    element: (
      <ErrorLayout>
        <NotFound />
      </ErrorLayout>
    ),
  },
];
