'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Plus } from 'lucide-react';

export function Certifications() {
  return (
    <section id="certifications" className="py-24 bg-[#f4f7fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Certifications</SectionHeading>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Active Certifications would go here when available */}
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/50 border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[250px] hover:bg-slate-50 transition-colors cursor-default col-span-full md:col-span-1"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <Plus size={24} />
            </div>
            <h4 className="text-lg font-semibold text-slate-600 mb-2">More Certifications</h4>
            <p className="text-slate-500 text-sm">Coming soon...</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
