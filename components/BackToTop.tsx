'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show button after scrolling past 300px
      if (currentScrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress percentage (0 to 1)
      if (scrollHeight > 0) {
        const progress = Math.min(Math.max(currentScrollY / scrollHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circular progress ring geometry
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex items-center justify-center group no-print"
        >
          {/* Subtle tooltip on hover for desktop */}
          <div
            className="absolute -top-10 right-1/2 translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] font-medium rounded-lg shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0 whitespace-nowrap"
            role="tooltip"
          >
            Back to top
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
          </div>

          <button
            id="back-to-top-button"
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/90 shadow-lg shadow-slate-900/10 dark:shadow-indigo-950/30 backdrop-blur-md hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 cursor-pointer"
          >
            {/* SVG Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              {/* Background Track */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-slate-200/70 dark:stroke-slate-800/70"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Active Progress Arc */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-150 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Up Arrow Icon with hover elevation */}
            <ArrowUp
              size={18}
              className="relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
