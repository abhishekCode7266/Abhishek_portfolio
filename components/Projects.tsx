'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Github, Folder, ExternalLink, Globe } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import Image from 'next/image';
import { formatUrl } from '@/lib/utils';
import { GithubCodeSnippet } from './GithubCodeSnippet';

export function Projects() {
  const { data } = usePortfolio();
  
  // Find the featured project, default to the first one if none selected
  const featuredProject = data.projects.find(p => p.featured) || data.projects[0];
  const otherProjects = data.projects.filter(p => p.id !== featuredProject?.id);

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Featured Projects</SectionHeading>
        
        {/* Featured Project */}
        {featuredProject && (
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
                
                <div className="flex flex-wrap items-center gap-4">
                  <a href={formatUrl(featuredProject.github)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
                    <Github size={20} />
                    View Source Code
                  </a>
                  {featuredProject.demoUrl && (
                    <a href={formatUrl(featuredProject.demoUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                      <Globe size={20} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
              <div className="hidden lg:block relative h-full min-h-[300px] w-full bg-[#1e1e1e] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl group-hover:border-indigo-500/50 transition-colors">
                <GithubCodeSnippet githubUrl={featuredProject.github} />
              </div>
            </div>
          </motion.div>
        )}

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
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col h-full relative overflow-hidden"
            >
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Folder size={28} />
                </div>
              </div>

              {project.github && (
                <div className="relative z-10 w-full h-32 mb-6 rounded-xl border border-slate-700 overflow-hidden bg-[#1e1e1e] shadow-inner group-hover:border-indigo-500/50 transition-colors">
                  <div className="absolute inset-0 scale-[0.6] origin-top-left w-[166.66%] h-[166.66%]">
                     <GithubCodeSnippet githubUrl={project.github} />
                  </div>
                </div>
              )}
              
              <h4 className="relative z-10 text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{project.title}</h4>
              <p className="relative z-10 text-slate-600 leading-relaxed mb-6 flex-1">{project.description}</p>
              
              <div className="relative z-10 flex flex-wrap gap-2 mb-6 mt-auto">
                {project.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative z-10 flex items-center gap-6 mt-auto pt-4 border-t border-slate-100">
                  <a href={formatUrl(project.github)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                    <Github size={18} /> View Source Code
                  </a>
                  {project.demoUrl && (
                    <a href={formatUrl(project.demoUrl)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                      <ExternalLink size={18} /> Live Demo
                    </a>
                  )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
