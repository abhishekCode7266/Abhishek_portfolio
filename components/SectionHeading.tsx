'use client';
import { motion } from 'motion/react';

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center mb-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight"
      >
        {children}
      </motion.h2>
      <motion.div 
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="h-1.5 w-24 bg-indigo-600 mt-4 rounded-full"
      />
    </div>
  );
}
