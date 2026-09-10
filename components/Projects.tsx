'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Github, Folder, ExternalLink } from 'lucide-react';

const featuredProject = {
  title: "Hospital Management System",
  description: "A comprehensive Java-based OOP desktop application designed for managing patient records, doctor schedules, and hospital administrative tasks efficiently.",
  tags: ["Java", "OOP", "Data Structures", "Desktop App"],
  github: "#"
};

const otherProjects = [
  {
    title: "Hotel Booking System",
    description: "An intuitive booking application managing room reservations, customer data, and billing operations.",
    tags: ["Java", "OOP"],
    github: "#"
  },
  {
    title: "Student ERP System",
    description: "A robust ERP solution handling student registrations, grades, and administrative data workflows.",
    tags: ["Java", "Software Development"],
    github: "#"
  },
  {
    title: "Grocery Application",
    description: "A digital inventory and sales management tool handling grocery items, stock, and basic transactions.",
    tags: ["Python", "Data Handling"],
    github: "#"
  },
  {
    title: "T20 Cricket Data Project",
    description: "An analytical project parsing and visualizing T20 cricket statistics to uncover player performance trends.",
    tags: ["Python", "Data Analytics", "Pandas"],
    github: "#"
  },
  {
    title: "Basic Chatbot",
    description: "A logic-based conversational bot capable of answering simple predefined queries and tasks.",
    tags: ["Python", "Logic Programming"],
    github: "#"
  },
  {
    title: "Frontend Development Project",
    description: "A responsive and interactive web interface showcasing modern UI/UX design principles.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    github: "#"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Featured Projects</SectionHeading>
        
        {/* Featured Project */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden group"
        >
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-indigo-400 font-mono text-sm mb-4 tracking-wider uppercase">Featured Project</div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">{featuredProject.title}</h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                {featuredProject.description}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-10">
                {featuredProject.tags.map((tag, idx) => (
                  <span key={idx} className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-full text-sm font-medium border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <a href={featuredProject.github} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
                  <Github size={20} />
                  View Source
                </a>
              </div>
            </div>
            <div className="hidden lg:block relative h-full min-h-[300px] w-full bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl group-hover:border-indigo-500/50 transition-colors">
               {/* Decorative Terminal Window */}
               <div className="absolute inset-0 flex flex-col">
                 <div className="h-10 bg-slate-900 border-b border-slate-700 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                 </div>
                 <div className="flex-1 p-6 font-mono text-sm text-indigo-300/80 leading-relaxed overflow-hidden flex flex-col gap-2">
                    <p>{'>'} Initializing HMS Component...</p>
                    <p>{'>'} Loading Patient Records: 100%</p>
                    <p>{'>'} Syncing Doctor Schedules...</p>
                    <p className="text-green-400 mt-4">System Online and Ready.</p>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Other Projects Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {otherProjects.map((project, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Folder size={28} />
                </div>
                <div className="flex gap-3 text-slate-400">
                  <a href={project.github} className="hover:text-indigo-600 transition-colors"><Github size={20} /></a>
                  <a href="#" className="hover:text-indigo-600 transition-colors"><ExternalLink size={20} /></a>
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{project.title}</h4>
              <p className="text-slate-600 leading-relaxed mb-8 flex-1">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
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
