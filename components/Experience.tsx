'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Briefcase, Building2, Calendar, Search } from 'lucide-react';

export function Experience() {
  return (
    <section id="experience" className="py-24 bg-[#f4f7fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Experience & Internships</SectionHeading>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 relative overflow-hidden">
            {/* Decorative dashed border to indicate "future/seeking" state */}
            <div className="absolute inset-0 border-2 border-dashed border-indigo-200 rounded-3xl opacity-50 m-2 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 shrink-0 border border-slate-100">
                <Briefcase size={32} />
              </div>
              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-400">[ Future Role Title ]</h3>
                    <div className="flex items-center gap-2 text-slate-500 mt-2">
                      <Building2 size={16} />
                      <span>[ Company Name ]</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-max">
                    <Calendar size={14} />
                    <span>[ Duration ]</span>
                  </div>
                </div>
                
                <p className="text-slate-400 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                  [ Description of responsibilities and achievements will go here. Awaiting internship opportunities to apply technical skills in a professional environment. ]
                </p>
                
                <div className="mt-8 flex items-center justify-center gap-3 text-indigo-600 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <Search size={20} className="animate-pulse shrink-0" />
                  <span className="font-medium text-center sm:text-left">Currently seeking software development and frontend internship opportunities.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
