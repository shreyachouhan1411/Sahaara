import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  comfortMode: boolean;
  setComfortMode: (active: boolean) => void;
  toggleComfortMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'sahaara_theme_pref';
const COMFORT_KEY = 'sahaara_comfort_pref';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch (e) {
      // fallback
    }
    return 'light';
  });

  const [comfortMode, setComfortModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COMFORT_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveTheme: 'light' | 'dark' =
    theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      body.classList.remove('dark');
    }
  }, [effectiveTheme]);

  useEffect(() => {
    const body = document.body;
    if (comfortMode) {
      body.classList.add('comfort-mode');
    } else {
      body.classList.remove('comfort-mode');
    }
  }, [comfortMode]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {
      // ignore
    }
  };

  const toggleTheme = () => {
    if (effectiveTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const setComfortMode = (active: boolean) => {
    setComfortModeState(active);
    try {
      localStorage.setItem(COMFORT_KEY, String(active));
    } catch (e) {
      // ignore
    }
  };

  const toggleComfortMode = () => setComfortMode(!comfortMode);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        effectiveTheme,
        setTheme,
        toggleTheme,
        comfortMode,
        setComfortMode,
        toggleComfortMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
