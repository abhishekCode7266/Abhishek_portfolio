'use client';
import { motion } from 'motion/react';

interface SectionDividerProps {
  id?: string;
  className?: string;
}

export function SectionDivider({ id, className = '' }: SectionDividerProps) {
  return (
    <div
      id={id}
      aria-hidden="true"
      className={`relative w-full flex items-center justify-center pointer-events-none select-none z-10 -my-px overflow-hidden ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scaleX: 0.85 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative flex items-center justify-center h-4"
        >
          {/* Outer fading base line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200/90 to-transparent dark:via-slate-800/90" />

          {/* Core stylized indigo highlight */}
          <div className="absolute w-36 sm:w-64 md:w-80 h-px bg-gradient-to-r from-transparent via-indigo-500/40 dark:via-indigo-400/40 to-transparent" />

          {/* Micro-ornament center point */}
          <div className="absolute flex items-center justify-center gap-1.5 px-2">
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors" />
            <span className="w-1.5 h-1.5 rotate-45 rounded-[1px] bg-indigo-500/75 dark:bg-indigo-400/75 shadow-xs shadow-indigo-500/30 transition-colors" />
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
