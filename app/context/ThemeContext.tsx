'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

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

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('portfolio_theme') || localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    if (document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
  } catch {
    // fallback
  }
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    applyThemeClass(initialTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('portfolio_theme') || localStorage.getItem('theme');
      if (!stored) {
        const sysTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(sysTheme);
        applyThemeClass(sysTheme);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio_theme' || e.key === 'theme') {
        const val = e.newValue as Theme;
        if (val === 'dark' || val === 'light') {
          setThemeState(val);
          applyThemeClass(val);
        }
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('portfolio_theme', newTheme);
      localStorage.setItem('theme', newTheme);
    } catch {
      // ignore storage error
    }
    applyThemeClass(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextTheme: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('portfolio_theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
      } catch {
        // ignore storage error
      }
      applyThemeClass(nextTheme);
      return nextTheme;
    });
  }, []);

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

