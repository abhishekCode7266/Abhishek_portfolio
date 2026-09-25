'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Briefcase, Building2, Calendar, Search, Plus, Pencil, Trash2, X, CheckCircle2, Upload, FileText } from 'lucide-react';
import { usePortfolio, Experience as ExperienceType } from '@/app/context/PortfolioContext';
import { formatUrl } from '@/lib/utils';
import { optimizeImage } from '@/lib/imageOptimizer';

export function Experience() {
  const { data, updateData } = usePortfolio();
  const currentMode = data.careerMode || 'internship';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceType | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [roleType, setRoleType] = useState<'internship' | 'job'>('internship');
  const [isSeeking, setIsSeeking] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState<string | undefined>(undefined);

  const setMode = (mode: 'internship' | 'job') => {
    updateData({ careerMode: mode }, true);
  };

  const openAddModal = () => {
    setEditingExp(null);
    setTitle(currentMode === 'internship' ? 'Software Developer Intern' : 'Junior Software Engineer');
    setCompany('');
    setDuration('2024 - Present');
    setDescription('');
    setRoleType(currentMode);
    setIsSeeking(false);
    setCertificateUrl(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: ExperienceType) => {
    setEditingExp(exp);
    setTitle(exp.title || '');
    setCompany(exp.company || '');
    setDuration(exp.duration || '');
    setDescription(exp.description || '');
    setRoleType(exp.type || currentMode);
    setIsSeeking(!!exp.isSeeking);
    setCertificateUrl(exp.certificateUrl);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = data.experience.filter(e => e.id !== id);
    updateData({ experience: updated }, true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    if (editingExp) {
      const updatedItem: ExperienceType = {
        ...editingExp,
        title: title.trim(),
        company: company.trim(),
        duration: duration.trim(),
        description: description.trim(),
        type: roleType,
        isSeeking,
        certificateUrl: certificateUrl || undefined,
      };
      const updatedList = data.experience.map(e => e.id === editingExp.id ? updatedItem : e);
      updateData({ experience: updatedList }, true);
    } else {
      const newItem: ExperienceType = {
        id: `exp-${Date.now()}`,
        title: title.trim(),
        company: company.trim(),
        duration: duration.trim(),
        description: description.trim(),
        type: roleType,
        isSeeking,
        certificateUrl: certificateUrl || undefined,
      };
      updateData({ experience: [...data.experience, newItem] }, true);
    }

    setIsModalOpen(false);
    setEditingExp(null);
  };

  return (
    <section id="experience" className="py-24 scroll-mt-20 bg-[#f4f7fa] dark:bg-[#0b0f19] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <SectionHeading>
              {currentMode === 'internship' ? 'Internship Experience' : 'Work Experience & Roles'}
            </SectionHeading>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mt-1">
              {currentMode === 'internship'
                ? 'Technical internships, software development trainee roles, and practical experience.'
                : 'Full-time positions, software engineering experience, and production deliveries.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Switch: Internship vs Job */}
            <div className="bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center">
              <button
                type="button"
                onClick={() => setMode('internship')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentMode === 'internship'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>🎓</span> Internship Mode
              </button>
              <button
                type="button"
                onClick={() => setMode('job')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentMode === 'job'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>💼</span> Job Mode
              </button>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>{currentMode === 'internship' ? 'Add Internship' : 'Add Role'}</span>
            </button>
          </div>
        </div>

        {/* Mode active banner */}
        <div className="max-w-3xl mx-auto mb-8 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {currentMode === 'internship'
                ? 'Internship Mode Active — Tailored for summer/winter internships & trainee roles'
                : 'Job Mode Active — Tailored for full-time software developer & engineer positions'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Toggle switch above anytime to switch view
          </span>
        </div>
        
        {data.experience.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <Briefcase size={40} className="mx-auto text-indigo-500 mb-3 opacity-80" />
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Roles Added Yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Add your internships or full-time experience to showcase.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all"
            >
              + Add First Experience
            </button>
          </div>
        ) : (
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
                <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-700/80 relative overflow-hidden group">
                  {/* Action buttons */}
                  <div className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-2xs border border-slate-200/60 dark:border-slate-600 cursor-pointer"
                      title="Edit Experience"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-2xs border border-slate-200/60 dark:border-slate-600 cursor-pointer"
                      title="Delete Experience"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {exp.isSeeking && (
                    <div className="absolute inset-0 border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-3xl opacity-50 m-2 pointer-events-none" />
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start relative z-10">
                    <div className={`p-4 rounded-2xl shrink-0 border ${exp.isSeeking ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800'}`}>
                      <Briefcase size={32} />
                    </div>
                    <div className="w-full pr-12 sm:pr-14">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-xl font-bold ${exp.isSeeking ? 'text-slate-700 dark:text-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>
                              {exp.title}
                            </h3>
                            {exp.type && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                                {exp.type === 'job' ? 'Full-Time' : 'Internship'}
                              </span>
                            )}
                          </div>
                          <div className={`flex items-center gap-2 mt-1.5 text-sm ${exp.isSeeking ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            <Building2 size={15} />
                            <span>{exp.company}</span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border w-max self-start ${exp.isSeeking ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800 font-medium'}`}>
                          <Calendar size={13} />
                          <span>{exp.duration}</span>
                        </div>
                      </div>
                      
                      <p className={`leading-relaxed p-4 rounded-xl border text-xs sm:text-sm ${exp.isSeeking ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700'}`}>
                        {exp.description}
                      </p>

                      {exp.certificateUrl && (
                        <div className="mt-4">
                          <a 
                            href={formatUrl(exp.certificateUrl)} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 font-medium text-xs rounded-lg transition-colors shadow-2xs"
                          >
                            <FileText size={14} /> View Certificate
                          </a>
                        </div>
                      )}
                      
                      {exp.isSeeking && (
                        <div className="mt-6 flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-800/80 text-xs sm:text-sm">
                          <Search size={18} className="animate-pulse shrink-0" />
                          <span className="font-medium text-center sm:text-left">
                            {currentMode === 'internship'
                              ? 'Currently seeking software development and frontend internship opportunities.'
                              : 'Currently open to junior/associate software engineer and frontend developer roles.'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Experience Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                      {editingExp ? 'Edit Role Details' : 'Add Experience / Role'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Update role title, organization, duration, and key contributions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Role Mode selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Role Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRoleType('internship')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        roleType === 'internship'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      🎓 Internship / Trainee
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleType('job')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        roleType === 'job'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      💼 Full-Time Job / Engineer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                      Role / Position Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Software Developer Intern"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="e.g. Seeking Internship Opportunities"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. June 2024 - Present"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Responsibilities & Impact
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe your responsibilities, technologies used, and accomplishments..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y"
                  />
                </div>

                {/* Seeking checkbox & certificate */}
                <div className="pt-2 flex flex-col gap-3">
                  <label className="flex items-center gap-3 p-3 border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isSeeking}
                      onChange={e => setIsSeeking(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                      Mark as &ldquo;Seeking Opportunities&rdquo; status card
                    </span>
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {certificateUrl ? 'Certificate Attached' : 'Attach Internship Certificate'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs">
                        <Upload size={13} /> {certificateUrl ? 'Replace' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*,.pdf,application/pdf"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const optimized = await optimizeImage(file, 1920, 0.90);
                                setCertificateUrl(optimized);
                              } catch (err) {
                                console.error('Upload error:', err);
                              }
                            }
                          }}
                        />
                      </label>
                      {certificateUrl && (
                        <button
                          type="button"
                          onClick={() => setCertificateUrl(undefined)}
                          className="text-xs text-red-500 hover:text-red-700 p-1"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    {editingExp && (
                      <button
                        type="button"
                        onClick={() => {
                          handleDelete(editingExp.id);
                          setIsModalOpen(false);
                        }}
                        className="px-3.5 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all"
                  >
                    <CheckCircle2 size={16} /> {editingExp ? 'Update Role' : 'Save Role'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
