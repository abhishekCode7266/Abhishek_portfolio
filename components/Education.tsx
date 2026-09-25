'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { GraduationCap, MapPin, Calendar, Plus, Pencil, Trash2, X, CheckCircle2, BookOpen } from 'lucide-react';
import { usePortfolio, Education as EducationType } from '@/app/context/PortfolioContext';

export function Education() {
  const { data, updateData } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationType | null>(null);

  // Form state
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [percentage, setPercentage] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingEdu(null);
    setDegree('');
    setInstitution('');
    setStartDate('');
    setEndDate('');
    setPercentage('');
    setLocation('Uttar Pradesh, India');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (edu: EducationType) => {
    setEditingEdu(edu);
    setDegree(edu.degree || '');
    setInstitution(edu.institution || '');
    setStartDate(edu.startDate || '');
    setEndDate(edu.endDate || '');
    setPercentage(edu.percentage || '');
    setLocation(edu.location || '');
    setDescription(edu.description || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = data.education.filter(e => e.id !== id);
    updateData({ education: updated }, true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !institution.trim()) return;

    if (editingEdu) {
      const updatedItem: EducationType = {
        ...editingEdu,
        degree: degree.trim(),
        institution: institution.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        percentage: percentage.trim() || undefined,
        location: location.trim() || 'Uttar Pradesh, India',
        description: description.trim() || undefined,
      };
      const updatedList = data.education.map(e => e.id === editingEdu.id ? updatedItem : e);
      updateData({ education: updatedList }, true);
    } else {
      const newItem: EducationType = {
        id: `edu-${Date.now()}`,
        degree: degree.trim(),
        institution: institution.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        percentage: percentage.trim() || undefined,
        location: location.trim() || 'Uttar Pradesh, India',
        description: description.trim() || undefined,
      };
      updateData({ education: [...data.education, newItem] }, true);
    }

    setIsModalOpen(false);
    setEditingEdu(null);
  };

  return (
    <section id="education" className="py-24 scroll-mt-20 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <SectionHeading>Education</SectionHeading>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mt-1">
              Academic qualifications, degrees, and educational background.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Add Education</span>
          </button>
        </div>
        
        {data.education.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700">
            <GraduationCap size={40} className="mx-auto text-indigo-500 mb-3 opacity-80" />
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Education Records Yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Add your college, degree, diploma, or schooling details.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all"
            >
              + Add Education
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {data.education.map((edu, idx) => (
              <motion.div 
                key={edu.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-700/80 relative group"
              >
                {/* Action buttons */}
                <div className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(edu)}
                    className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors shadow-2xs border border-slate-200/60 dark:border-slate-600 cursor-pointer"
                    title="Edit Education Record"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors shadow-2xs border border-slate-200/60 dark:border-slate-600 cursor-pointer"
                    title="Delete Education Record"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start">
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-950/80 rounded-2xl text-indigo-600 dark:text-indigo-400 shrink-0">
                    <GraduationCap size={36} />
                  </div>
                  <div className="pr-12 sm:pr-16 w-full">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1.5">{edu.degree}</h3>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium mb-4">
                      {edu.institution.split('(')[0].trim()}
                      {edu.institution.includes('(') && (
                        <>
                          <br className="sm:hidden" />
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-normal sm:ml-1">({edu.institution.split('(')[1]}</span>
                        </>
                      )}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-5 text-slate-500 dark:text-slate-400 text-xs sm:text-sm flex-wrap">
                      {(edu.startDate || edu.endDate) && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={15} className="text-indigo-500 dark:text-indigo-400" />
                          {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                        </span>
                      )}
                      {edu.percentage && (
                        <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-800/60 px-3 py-1 rounded-full font-medium">
                          Percentage / CGPA: {edu.percentage}
                        </span>
                      )}
                      {edu.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} className="text-indigo-500 dark:text-indigo-400" />
                          {edu.location}
                        </span>
                      )}
                    </div>

                    {edu.description && (
                      <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Education Modal */}
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
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                      {editingEdu ? 'Edit Education Record' : 'Add Education Record'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter details about your academic degree, coursework, or school.
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
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Degree / Course / Standard *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={e => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech – Computer Science"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Institution / University / School *
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="e.g. LDC Institute of Technical Studies (Affiliated with AKTU)"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                      Start Year / Date
                    </label>
                    <input
                      type="text"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                      End Year / Date
                    </label>
                    <input
                      type="text"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      placeholder="e.g. 2027 (or Present)"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                      Percentage / CGPA
                    </label>
                    <input
                      type="text"
                      value={percentage}
                      onChange={e => setPercentage(e.target.value)}
                      placeholder="e.g. 75% or 8.5 CGPA"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Uttar Pradesh, India"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Description / Key Coursework (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Core focus in Data Structures, Algorithms, Web Technologies, Database Systems..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y"
                  />
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
                    {editingEdu && (
                      <button
                        type="button"
                        onClick={() => {
                          handleDelete(editingEdu.id);
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
                    <CheckCircle2 size={16} /> {editingEdu ? 'Update Education' : 'Save Education'}
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
