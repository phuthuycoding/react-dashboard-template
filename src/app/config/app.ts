export interface AppConfig {
  theme: string;
  locale: string;
  sidebar: {
    sidebarWith: number;
    collapsed: boolean;
  };
  apiUrl: string;
  uploadUrl: string;
  auth: {
    loginUrl: string;
  };
}

export const app: AppConfig = {
  theme: 'light',
  locale: 'vi',
  sidebar: {
    sidebarWith: 320,
    collapsed: false,
  },
  apiUrl: import.meta.env.VITE_BASE_API_URL || 'http://localhost:9000/api',
  uploadUrl: `${import.meta.env.VITE_BASE_API_URL}/upload`,
  auth: {
    loginUrl: '/auth/login',
  },
};
