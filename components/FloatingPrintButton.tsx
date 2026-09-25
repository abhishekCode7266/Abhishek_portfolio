'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, Sparkles, FileText } from 'lucide-react';

export function FloatingPrintButton() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Reveal after initial render
    setMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
        className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40 no-print"
      >
        {/* Tooltip on hover */}
        <div
          className={`absolute -top-11 left-0 px-3 py-1.5 bg-slate-950 text-white dark:bg-white dark:text-slate-900 text-xs font-medium rounded-lg shadow-xl pointer-events-none transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1'
          }`}
          role="tooltip"
        >
          <FileText size={12} className="text-indigo-400 dark:text-indigo-600" />
          <span>Export clean A4 Resume (PDF)</span>
          <div className="absolute top-full left-6 -mt-1 border-4 border-transparent border-t-slate-950 dark:border-t-white" />
        </div>

        <button
          type="button"
          onClick={handlePrint}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          id="floating-print-resume-btn"
          aria-label="Print Resume or Save as PDF formatted for A4"
          className="group relative inline-flex items-center gap-2.5 px-4 py-3 sm:px-4.5 sm:py-3.5 bg-slate-900/90 dark:bg-slate-800/90 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-white rounded-full shadow-lg shadow-slate-900/20 dark:shadow-indigo-950/40 backdrop-blur-md border border-slate-700/60 dark:border-slate-700 hover:border-indigo-400/50 hover:shadow-indigo-500/25 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        >
          {/* Subtle animated shimmer gradient */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

          <div className="w-8 h-8 rounded-full bg-indigo-500/20 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <Printer
              size={17}
              className="text-indigo-400 dark:text-indigo-300 group-hover:text-white transition-colors duration-200 group-hover:rotate-[-6deg]"
              aria-hidden="true"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-white group-hover:text-white transition-colors">
              Print Resume
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white/90 group-hover:bg-white/25 rounded-md transition-colors">
              PDF
            </span>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
