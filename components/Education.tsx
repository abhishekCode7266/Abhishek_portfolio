'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';

export function Education() {
  return (
    <section id="education" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Education</SectionHeading>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100"
        >
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 shrink-0">
              <GraduationCap size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">B.Tech – Computer Science</h3>
              <p className="text-lg text-slate-600 font-medium mb-4">
                LDC Institute of Technical Studies <br className="sm:hidden" />
                <span className="text-sm text-slate-500 font-normal sm:ml-1">(Affiliated with AKTU)</span>
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-slate-500 text-sm">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" />
                  7th Semester (2024–2027)
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-500" />
                  Uttar Pradesh, India
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
