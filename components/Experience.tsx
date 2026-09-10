'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Briefcase, Building2, Calendar, Search } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import { formatUrl } from '@/lib/utils';

export function Experience() {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="py-24 bg-[#f4f7fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Experience & Internships</SectionHeading>
        
        <div className="space-y-8">
          {data.experience.map((exp, idx) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                {exp.isSeeking && (
                  <div className="absolute inset-0 border-2 border-dashed border-indigo-200 rounded-3xl opacity-50 m-2 pointer-events-none" />
                )}
                
                <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                  <div className={`p-4 rounded-2xl shrink-0 border ${exp.isSeeking ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                    <Briefcase size={32} />
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <div>
                        <h3 className={`text-xl font-bold ${exp.isSeeking ? 'text-slate-400' : 'text-slate-800'}`}>{exp.title}</h3>
                        <div className={`flex items-center gap-2 mt-2 ${exp.isSeeking ? 'text-slate-500' : 'text-slate-600'}`}>
                          <Building2 size={16} />
                          <span>{exp.company}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border w-max ${exp.isSeeking ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100 font-medium'}`}>
                        <Calendar size={14} />
                        <span>{exp.duration}</span>
                      </div>
                    </div>
                    
                    <p className={`leading-relaxed p-4 rounded-xl border text-sm ${exp.isSeeking ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-white text-slate-600 border-slate-100'}`}>
                      {exp.description}
                    </p>

                    {exp.certificateUrl && (
                      <div className="mt-4">
                        <a 
                          href={formatUrl(exp.certificateUrl)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-medium text-sm rounded-lg transition-colors shadow-sm"
                        >
                          <Briefcase size={16} /> View Certificate
                        </a>
                      </div>
                    )}
                    
                    {exp.isSeeking && (
                      <div className="mt-8 flex items-center justify-center gap-3 text-indigo-600 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                        <Search size={20} className="animate-pulse shrink-0" />
                        <span className="font-medium text-center sm:text-left">Currently seeking software development and frontend internship opportunities.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
