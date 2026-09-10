'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Code, Database, BrainCircuit, TerminalSquare, Wrench } from 'lucide-react';

const skills = [
  {
    category: "Frontend Development",
    icon: <Code size={24} className="text-indigo-500" />,
    tags: ["HTML5", "CSS3", "JavaScript", "Responsive Web Design", "DOM Manipulation", "Git & GitHub"]
  },
  {
    category: "Data Analytics",
    icon: <Database size={24} className="text-indigo-500" />,
    tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Data Cleaning", "Data Analysis", "Data Visualization", "EDA", "Jupyter Notebook"]
  },
  {
    category: "AI / ML",
    icon: <BrainCircuit size={24} className="text-indigo-500" />,
    tags: ["Python", "NumPy", "Pandas", "Matplotlib", "ML Fundamentals", "Data Preprocessing", "EDA", "Basic Model Evaluation"]
  },
  {
    category: "Software Development",
    icon: <TerminalSquare size={24} className="text-indigo-500" />,
    tags: ["Python", "Java", "JavaScript", "OOP", "Problem Solving"]
  },
  {
    category: "Tools & Environment",
    icon: <Wrench size={24} className="text-indigo-500" />,
    tags: ["VS Code", "Git", "GitHub", "Jupyter Notebook"]
  }
];

export function Skills() {
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
          {skills.map((skillGroup, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  {skillGroup.icon}
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
