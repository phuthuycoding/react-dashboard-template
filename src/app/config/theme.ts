/**
 * Professional Business Theme Configuration
 * Defines the color palette and theme settings for the application
 */

export const businessTheme = {
  colors: {
    // Primary brand colors - Professional Blue
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Secondary slate colors
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Main slate
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },

    // Status colors for business applications
    status: {
      active: '#10b981', // Green - Active/Success
      pending: '#f59e0b', // Amber - Pending/Warning
      error: '#ef4444', // Red - Error/Inactive
      info: '#3b82f6', // Blue - Information
      neutral: '#6b7280', // Gray - Neutral/Disabled
    },

    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Radius values
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },

  // Shadows for depth
  shadows: {
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    floating: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
} as const;

export type BusinessTheme = typeof businessTheme;
