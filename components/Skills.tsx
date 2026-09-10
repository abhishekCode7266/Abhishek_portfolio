'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Code, Database, BrainCircuit, TerminalSquare, Wrench, Layers } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('frontend') || cat.includes('web') || cat.includes('ui')) return <Code size={24} className="text-indigo-500" />;
  if (cat.includes('data') || cat.includes('backend') || cat.includes('sql')) return <Database size={24} className="text-indigo-500" />;
  if (cat.includes('ai') || cat.includes('ml') || cat.includes('learning')) return <BrainCircuit size={24} className="text-indigo-500" />;
  if (cat.includes('software') || cat.includes('app') || cat.includes('mobile')) return <TerminalSquare size={24} className="text-indigo-500" />;
  if (cat.includes('tools') || cat.includes('git') || cat.includes('env')) return <Wrench size={24} className="text-indigo-500" />;
  return <Layers size={24} className="text-indigo-500" />;
};

export function Skills() {
  const { data } = usePortfolio();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (!data.skills || data.skills.length === 0) return null;

  return (
    <section id="skills" className="py-24 bg-[#f4f7fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Technical Skills</SectionHeading>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {data.skills.map((skillGroup, index) => (
            <motion.div 
              key={skillGroup.id || index} 
              variants={itemVariants}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  {getCategoryIcon(skillGroup.category)}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{skillGroup.category}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skillGroup.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="px-3 py-1.5 bg-slate-50 text-slate-600 text-sm font-medium rounded-xl border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
