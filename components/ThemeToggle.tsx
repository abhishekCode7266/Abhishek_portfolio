'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

interface ThemeToggleProps {
  id?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({
  id = 'theme-toggle-btn',
  className = '',
  showLabel = false,
  size = 'md',
}: ThemeToggleProps) {
  const { toggleTheme, isDark, mounted } = useTheme();

  // Handle SSR hydration gracefully
  const activeDark = mounted ? isDark : false;

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const currentIconSize = iconSizes[size];

  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      suppressHydrationWarning
      aria-label={activeDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={activeDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`group relative flex items-center justify-center rounded-xl font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-95 ${
        showLabel
          ? 'gap-2.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
          : 'p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {activeDark ? (
            <motion.div
              key="sun-icon"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center justify-center text-amber-400 group-hover:rotate-12 transition-transform duration-300"
            >
              <Sun
                size={currentIconSize}
                className="fill-amber-400/20 stroke-[2.2]"
                aria-hidden="true"
              />
            </motion.div>
          ) : (
            <motion.div
              key="moon-icon"
              initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:-rotate-12 transition-transform duration-300"
            >
              <Moon
                size={currentIconSize}
                className="fill-slate-700/10 stroke-[2.2]"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="select-none font-medium">
          {activeDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
