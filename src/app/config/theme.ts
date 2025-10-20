/**
 * EV Charging Station Theme Configuration
 * Defines the color palette and theme settings for the application
 */

export const evTheme = {
  colors: {
    // Primary brand colors
    primary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Main emerald
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },

    // Secondary teal colors
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6', // Main teal
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },

    // Status colors for charging stations
    status: {
      available: '#10b981', // Green - Available
      charging: '#f59e0b', // Amber - Charging
      occupied: '#ef4444', // Red - Occupied
      maintenance: '#8b5cf6', // Purple - Maintenance
      offline: '#6b7280', // Gray - Offline
    },

    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Radius values
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
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

export type EVTheme = typeof evTheme;
