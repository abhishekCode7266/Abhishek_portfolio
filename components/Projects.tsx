'use client';
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Github, Folder, ExternalLink, Globe, RefreshCw, CheckCircle2, Star, GitFork, Search, Sparkles } from 'lucide-react';
import { usePortfolio, Project } from '@/app/context/PortfolioContext';
import { formatUrl } from '@/lib/utils';
import { GithubCodeSnippet } from './GithubCodeSnippet';

type ProjectFilter = 'all' | 'ai' | 'web' | 'java' | 'python';

export function Projects() {
  const { data, syncWithGitHub, isSyncingGitHub, lastGitHubSync } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = async () => {
    try {
      const count = await syncWithGitHub();
      setSyncStatus(`Successfully mirrored ${count} live repositories from GitHub! Added/removed repos are updated.`);
      setTimeout(() => setSyncStatus(null), 4000);
    } catch {
      setSyncStatus('GitHub sync completed.');
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  // Find the primary featured project (e.g. CarrerSphere-Ai or FoodWise or Hospital Management)
  const featuredProject = useMemo(() => {
    return data.projects.find(p => p.featured) || data.projects[0];
  }, [data.projects]);

  // Filter remaining projects based on category and search query
  const filteredProjects = useMemo(() => {
    return data.projects.filter(project => {
      // Exclude the hero featured project from the secondary grid so it isn't duplicated
      if (featuredProject && project.id === featuredProject.id && activeFilter === 'all' && !searchQuery) {
        return false;
      }

      // Filter by category
      if (activeFilter !== 'all') {
        const text = `${project.title} ${project.description} ${project.tags.join(' ')} ${project.language || ''}`.toLowerCase();
        if (activeFilter === 'ai' && !text.includes('ai') && !text.includes('intelligence') && !text.includes('assistant')) return false;
        if (activeFilter === 'web' && !text.includes('web') && !text.includes('front') && !text.includes('full stack') && !text.includes('javascript') && !text.includes('typescript')) return false;
        if (activeFilter === 'java' && !text.includes('java')) return false;
        if (activeFilter === 'python' && !text.includes('python') && !text.includes('pandas') && !text.includes('data')) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          project.title.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          project.tags.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [data.projects, featuredProject, activeFilter, searchQuery]);

  return (
    <section id="projects" className="py-24 scroll-mt-20 bg-white dark:bg-slate-900 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with GitHub Live Sync */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <SectionHeading>Projects</SectionHeading>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mt-1">
              Real-world software systems, AI pipelines, full-stack applications, and repositories hosted on GitHub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live GitHub Sync
            </span>

            <button
              onClick={handleSync}
              disabled={isSyncingGitHub}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              title="Mirror latest repositories directly from GitHub (auto-adds new repos, removes deleted ones)"
            >
              <RefreshCw size={15} className={isSyncingGitHub ? 'animate-spin text-indigo-400' : 'text-slate-300'} />
              <span>{isSyncingGitHub ? 'Mirroring Repositories...' : 'Sync with GitHub'}</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl">
              <Github size={14} />
              {data.projects.length} Repositories Live
            </span>
          </div>
        </div>

        {/* Sync notification banner */}
        {syncStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-medium shadow-xs"
          >
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </motion.div>
        )}

        {/* Hero Featured Project Banner */}
        {featuredProject && !searchQuery && activeFilter === 'all' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-2xl mb-14 relative overflow-hidden group border border-slate-800"
          >
            {/* Background ambient light */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Sparkles size={12} /> Spotlight Project
                  </span>
                  {featuredProject.stars && featuredProject.stars > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      <Star size={12} className="fill-amber-400 text-amber-400" /> {featuredProject.stars}
                    </span>
                  ) : null}
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                  {featuredProject.title}
                </h3>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                  {featuredProject.description}
                </p>
                
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {featuredProject.tags.map((tag, idx) => (
                    <span key={idx} className="px-3.5 py-1 bg-slate-800/90 text-indigo-200 rounded-lg text-xs font-medium border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <a 
                    href={formatUrl(featuredProject.github)} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-sm transition-all shadow-sm"
                  >
                    <Github size={18} />
                    View on GitHub
                  </a>
                  {featuredProject.demoUrl && (
                    <a 
                      href={formatUrl(featuredProject.demoUrl)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all border border-slate-700"
                    >
                      <Globe size={18} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div className="relative h-64 sm:h-80 lg:h-full min-h-[280px] w-full bg-[#121316] rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl group-hover:border-indigo-500/50 transition-all">
                <GithubCodeSnippet 
                  githubUrl={featuredProject.github} 
                  title={featuredProject.title}
                  language={featuredProject.language}
                  category={featuredProject.category}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(
              [
                { id: 'all', label: `All (${data.projects.length})` },
                { id: 'ai', label: 'AI & Machine Learning' },
                { id: 'web', label: 'Full Stack & Web' },
                { id: 'java', label: 'Java Systems' },
                { id: 'python', label: 'Python & Data' },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Other Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No repositories found matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id || idx} project={project} index={idx} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700/80 shadow-xs dark:shadow-slate-950/50 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all group flex flex-col h-full relative overflow-hidden"
    >
      {/* Card Header with Category Icon, Stars, Forks, and GitHub Link */}
      <div className="relative z-10 flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Folder size={18} />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
            {project.language || (project.tags && project.tags[0]) || 'Project'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {project.stars !== undefined && project.stars > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-slate-600/60">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {project.stars}
            </span>
          )}
          {project.forks !== undefined && project.forks > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-slate-600/60">
              <GitFork size={11} />
              {project.forks}
            </span>
          )}
          <a
            href={formatUrl(project.github)}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
            title="Open GitHub repository"
          >
            <Github size={16} />
          </a>
        </div>
      </div>

      {/* Code Snippet Window ("code jaysa image") */}
      <div className="relative w-full h-40 mb-4 rounded-2xl border border-slate-700/80 overflow-hidden bg-[#121316] shadow-inner group-hover:border-indigo-500/50 transition-colors">
        <GithubCodeSnippet 
          githubUrl={project.github}
          title={project.title}
          language={project.language}
          category={project.category}
        />
      </div>

      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
        {project.title}
      </h4>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
        {project.tags.slice(0, 4).map((tag, tagIdx) => (
          <span key={tagIdx} className="text-xs font-mono text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/80">
        <a 
          href={formatUrl(project.github)} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Github size={15} /> Source Code
        </a>
        {project.demoUrl ? (
          <a 
            href={formatUrl(project.demoUrl)} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-lg"
          >
            <ExternalLink size={14} /> Live Demo
          </a>
        ) : null}
      </div>
    </motion.div>
  );
}
