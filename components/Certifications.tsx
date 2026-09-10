'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Plus, Award, ExternalLink, FileText } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import { formatUrl } from '@/lib/utils';

export function Certifications() {
  const { data } = usePortfolio();

  return (
    <section id="certifications" className="py-24 bg-[#f4f7fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Certifications</SectionHeading>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {data.certifications.map((cert, idx) => (
            <motion.div 
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Award size={28} />
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{cert.name}</h4>
              <p className="text-slate-600 mb-6">{cert.issuer}</p>
              
              <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">{cert.date}</span>
                  {cert.link && (
                    <a href={formatUrl(cert.link)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                      Verify <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                {cert.fileUrl && (
                  <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition-colors border border-slate-200">
                    <FileText size={16} /> View Certificate
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          
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
