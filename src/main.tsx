// import { StrictMode } from 'react'
import i18n from 'i18next';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { loadLocaleResources } from './lib/bootstrap';
import { routers } from './app/router';
import { ThemeProvider, FirebaseSetupRequired } from './app/shared/components';
import { AppProvider } from './app/shared/contexts/app.context';
import { AuthProvider } from './app/shared/contexts/auth.context';
import { Toaster } from './components/ui/sonner';
import { isFirebaseConfigured } from './lib/services/firebase';
import './index.css';

const router = createBrowserRouter(routers, {
  basename: '/',
});
(async () => {
  const resources = await loadLocaleResources();
  await i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem('lang') || 'vi', // Default language or fallback
    interpolation: {
      escapeValue: false,
    },
  });
  const appContainer = document.querySelector('#root');
  if (appContainer) {
    const root = createRoot(appContainer);

    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      root.render(
        <ThemeProvider defaultTheme="system" storageKey="ev-ui-theme">
          <FirebaseSetupRequired />
        </ThemeProvider>,
      );
      return;
    }

    root.render(
      <ThemeProvider defaultTheme="system" storageKey="ev-ui-theme">
        <AppProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>,
    );
  }
})();
