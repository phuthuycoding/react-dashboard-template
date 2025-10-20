import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Config from '../../config';
export type AppContext = {
  lang: string;
  mode: string;
  changeLanguage(locale: string): void;
  changeThemeMode(mode: string): void;
};

export const App = createContext<AppContext | undefined>(undefined);

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [lang, setLang] = useState<string>(Config.app.locale);
  const [themeMode, setThemeMode] = useState<string>(Config.app.theme);
  const { i18n } = useTranslation();
  const changeLanguage = (locale: string) => {
    setLang(locale);
    localStorage.setItem('lang', locale);
    i18n.changeLanguage(locale);
  };
  const changeThemeMode = (themeMode: string) => {
    setThemeMode(themeMode);
    localStorage.setItem('themeMode', themeMode);
  };
  return (
    <App.Provider
      value={{
        lang,
        mode: themeMode,
        changeLanguage,
        changeThemeMode,
      }}>
      {children}
    </App.Provider>
  );
};
