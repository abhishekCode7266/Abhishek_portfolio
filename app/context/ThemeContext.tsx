'use client';
import { createContext, useContext, useEffect, useSyncExternalStore, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeClass(newTheme: Theme) {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }
}

const emptySubscribe = () => () => {};

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener('portfolio-theme-change', onStoreChange);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener('portfolio-theme-change', onStoreChange);
    mediaQuery.removeEventListener('change', onStoreChange);
  };
}

function getThemeSnapshot(): Theme {
  try {
    const stored = localStorage.getItem('portfolio_theme') || localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mounted = useIsMounted();
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem('portfolio_theme', newTheme);
      localStorage.setItem('theme', newTheme);
    } catch {
      // ignore storage error
    }
    applyThemeClass(newTheme);
    window.dispatchEvent(new Event('portfolio-theme-change'));
  }, []);

  const toggleTheme = useCallback(() => {
    const current = getThemeSnapshot();
    const nextTheme: Theme = current === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        mounted,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

