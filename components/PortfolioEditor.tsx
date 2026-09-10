'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import { Settings, X, Plus, Trash2, Upload, FileText } from 'lucide-react';

const TABS = ['General', 'About', 'Skills', 'Education', 'Experience & Internships', 'Projects', 'Certifications'];

export function PortfolioEditor() {
  const { data, updateData, isEditorOpen, setIsEditorOpen } = usePortfolio();
  const [activeTab, setActiveTab] = useState('General');

  if (!isEditorOpen) {
    return (
      <button 
        onClick={() => setIsEditorOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 flex items-center justify-center group"
        title="Edit Portfolio Content"
      >
        <Settings size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    );
  }

  // Generic Array Editor Helpers
  const handleArrayUpdate = (key: keyof typeof data, index: number, field: string, value: any) => {
    const arr = [...(data[key] as any[])];
    arr[index] = { ...arr[index], [field]: value };
    updateData({ [key]: arr });
  };

  const handleArrayAdd = (key: keyof typeof data, emptyItem: any) => {
    updateData({ [key]: [...(data[key] as any[]), emptyItem] });
  };

  const handleArrayRemove = (key: keyof typeof data, index: number) => {
    const arr = [...(data[key] as any[])];
    arr.splice(index, 1);
    updateData({ [key]: arr });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-5xl h-[85vh] mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200"
      >
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0">
          <div className="flex justify-between items-center mb-4 md:mb-8 md:px-2 shrink-0">
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Portfolio Editor</h2>
              <p className="text-xs text-slate-500">Update your content</p>
            </div>
            <button onClick={() => setIsEditorOpen(false)} className="md:hidden p-2 text-slate-500 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors"><X size={16}/></button>
          </div>
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white relative flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 shrink-0">
            <h3 className="text-2xl font-bold text-slate-800">{activeTab}</h3>
            <button 
              onClick={() => setIsEditorOpen(false)} 
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Save & Close
            </button>
          </div>

          <div className="space-y-8 max-w-3xl flex-1 pb-10">
            {activeTab === 'General' && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800 mb-2">Resume Upload</h4>
                  <p className="text-sm text-slate-500 mb-4">Upload your resume PDF to make the &quot;Download Resume&quot; button functional.</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="cursor-pointer px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2">
                      <Upload size={18} />
                      Choose File
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateData({ resumeUrl: reader.result as string, resumeName: file.name });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {data.resumeName && (
                      <span className="text-sm font-medium text-slate-700 flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 px-4 py-2 rounded-xl">
                        <FileText size={18} className="text-indigo-500" />
                        {data.resumeName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800 mb-4">Social Links</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">GitHub Profile</label>
                      <input 
                        type="text" 
                        value={data.socialLinks?.github || ''} 
                        onChange={e => updateData({ socialLinks: { ...data.socialLinks, github: e.target.value } })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                        placeholder="https://github.com/yourusername" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">LinkedIn Profile</label>
                      <input 
                        type="text" 
                        value={data.socialLinks?.linkedin || ''} 
                        onChange={e => updateData({ socialLinks: { ...data.socialLinks, linkedin: e.target.value } })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                        placeholder="https://linkedin.com/in/yourusername" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                      <input 
                        type="email" 
                        value={data.socialLinks?.email || ''} 
                        onChange={e => updateData({ socialLinks: { ...data.socialLinks, email: e.target.value } })} 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                        placeholder="your.email@example.com" 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">WhatsApp Number</label>
                        <input 
                          type="text" 
                          value={data.socialLinks?.whatsapp || ''} 
                          onChange={e => updateData({ socialLinks: { ...data.socialLinks, whatsapp: e.target.value } })} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                          placeholder="e.g. +91 9876543210" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Telegram Profile URL</label>
                        <input 
                          type="text" 
                          value={data.socialLinks?.telegram || ''} 
                          onChange={e => updateData({ socialLinks: { ...data.socialLinks, telegram: e.target.value } })} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                          placeholder="https://t.me/yourusername" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Instagram URL</label>
                        <input 
                          type="text" 
                          value={data.socialLinks?.instagram || ''} 
                          onChange={e => updateData({ socialLinks: { ...data.socialLinks, instagram: e.target.value } })} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                          placeholder="https://instagram.com/yourusername" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Facebook URL</label>
                        <input 
                          type="text" 
                          value={data.socialLinks?.facebook || ''} 
                          onChange={e => updateData({ socialLinks: { ...data.socialLinks, facebook: e.target.value } })} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                          placeholder="https://facebook.com/yourusername" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Twitter / X URL</label>
                        <input 
                          type="text" 
                          value={data.socialLinks?.twitter || ''} 
                          onChange={e => updateData({ socialLinks: { ...data.socialLinks, twitter: e.target.value } })} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                          placeholder="https://twitter.com/yourusername" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">YouTube URL</label>
                        <input 
                          type="text" 
                          value={data.socialLinks?.youtube || ''} 
                          onChange={e => updateData({ socialLinks: { ...data.socialLinks, youtube: e.target.value } })} 
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                          placeholder="https://youtube.com/@yourchannel" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'About' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">About Me (Bio)</label>
                <textarea 
                  value={data.aboutBio}
                  onChange={(e) => updateData({ aboutBio: e.target.value })}
                  rows={12}
                  className="w-full p-5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-y transition-all outline-none"
                  placeholder="Write your bio here..."
                />
                <p className="text-xs text-slate-500 mt-2">Line breaks will be preserved as paragraphs on the website.</p>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setIsEditorOpen(false)} className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                    Update Details
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Skills' && (
              <div className="space-y-6">
                {data.skills?.map((skillGroup, idx) => (
                  <div key={skillGroup.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm relative group">
                    <button onClick={() => handleArrayRemove('skills', idx)} className="absolute top-4 right-4 text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={18}/></button>
                    <div className="grid gap-4 pr-10">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Category Name</label>
                        <input type="text" value={skillGroup.category} onChange={e => handleArrayUpdate('skills', idx, 'category', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="e.g. Frontend Development" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Skills (comma separated)</label>
                        <input type="text" value={skillGroup.tags.join(', ')} onChange={e => handleArrayUpdate('skills', idx, 'tags', e.target.value.split(',').map(t => t.trim()))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="HTML, CSS, JavaScript, React" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => handleArrayAdd('skills', { id: Date.now().toString(), category: 'New Category', tags: [] })} className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 py-4 rounded-2xl transition-colors">
                  <Plus size={18} /> Add Skill Category
                </button>
              </div>
            )}

            {activeTab === 'Education' && (
              <div className="space-y-6">
                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm relative group">
                    <button onClick={() => handleArrayRemove('education', idx)} className="absolute top-4 right-4 text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={18}/></button>
                    <div className="grid gap-4 pr-10">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Degree / Course / Standard</label>
                        <input type="text" value={edu.degree} onChange={e => handleArrayUpdate('education', idx, 'degree', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="e.g. B.Tech, 12th Standard, Web Dev Course" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Institution / School</label>
                        <input type="text" value={edu.institution} onChange={e => handleArrayUpdate('education', idx, 'institution', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="School, University or College Name" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Time Period</label>
                           <input type="text" value={edu.period} onChange={e => handleArrayUpdate('education', idx, 'period', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="e.g. 2024–2027" />
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Location</label>
                           <input type="text" value={edu.location} onChange={e => handleArrayUpdate('education', idx, 'location', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="City, Country" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => handleArrayAdd('education', { id: Date.now().toString(), degree: '', institution: '', period: '', location: '' })} className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 py-4 rounded-2xl transition-colors">
                  <Plus size={18} /> Add Education Record (Degree, 12th, 10th)
                </button>
              </div>
            )}

            {activeTab === 'Experience & Internships' && (
              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm relative group">
                    <button onClick={() => handleArrayRemove('experience', idx)} className="absolute top-4 right-4 text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={18}/></button>
                    <div className="grid gap-4 pr-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Job / Role Title</label>
                           <input type="text" value={exp.title} onChange={e => handleArrayUpdate('experience', idx, 'title', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Software Engineer Intern" />
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Company</label>
                           <input type="text" value={exp.company} onChange={e => handleArrayUpdate('experience', idx, 'company', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Tech Corp" />
                        </div>
                      </div>
                      <div>
                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Duration</label>
                         <input type="text" value={exp.duration} onChange={e => handleArrayUpdate('experience', idx, 'duration', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="June 2024 - Present" />
                      </div>
                      <div>
                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                         <textarea value={exp.description} onChange={e => handleArrayUpdate('experience', idx, 'description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y" placeholder="Summarize your responsibilities..." rows={3} />
                      </div>
                      <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <label className="flex items-center gap-3 p-3 border border-indigo-100 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors w-max">
                          <input type="checkbox" checked={exp.isSeeking} onChange={e => handleArrayUpdate('experience', idx, 'isSeeking', e.target.checked)} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                          <span className="text-sm font-medium text-indigo-900">Mark as &quot;Seeking Opportunities&quot; Placeholder</span>
                        </label>

                        <div className="flex items-center gap-4 border border-indigo-100 p-3 rounded-xl bg-indigo-50/20">
                          <label className="cursor-pointer px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm shadow-sm">
                            <Upload size={16} /> Upload Certificate
                            <input 
                              type="file" 
                              accept="image/*,application/pdf"
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => handleArrayUpdate('experience', idx, 'certificateUrl', reader.result);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {exp.certificateUrl && <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1"><FileText size={14}/> Attached</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => handleArrayAdd('experience', { id: Date.now().toString(), title: '', company: '', duration: '', description: '', isSeeking: false })} className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 py-4 rounded-2xl transition-colors">
                  <Plus size={18} /> Add Experience / Internship
                </button>
              </div>
            )}

            {activeTab === 'Projects' && (
              <div className="space-y-6">
                {data.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm relative group">
                    <button onClick={() => handleArrayRemove('projects', idx)} className="absolute top-4 right-4 text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={18}/></button>
                    <div className="grid gap-5 pr-10">
                      
                      {/* Project Image Upload */}
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Project Image</label>
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm border border-indigo-200">
                            <Upload size={16} /> Choose Image
                            <input 
                              type="file" 
                              accept="image/*"
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => handleArrayUpdate('projects', idx, 'imageUrl', reader.result);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {proj.imageUrl && <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">Image uploaded successfully</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Project Title</label>
                          <input type="text" value={proj.title} onChange={e => handleArrayUpdate('projects', idx, 'title', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Tags (comma separated)</label>
                          <input type="text" value={proj.tags.join(', ')} onChange={e => handleArrayUpdate('projects', idx, 'tags', e.target.value.split(',').map(t => t.trim()))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="React, Node, Tailwind" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">GitHub Link</label>
                          <input type="text" value={proj.github} onChange={e => handleArrayUpdate('projects', idx, 'github', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="https://github.com/..." />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Live Demo Link (Optional)</label>
                          <input type="text" value={proj.demoUrl || ''} onChange={e => handleArrayUpdate('projects', idx, 'demoUrl', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="https://yourproject.com" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                        <textarea value={proj.description} onChange={e => handleArrayUpdate('projects', idx, 'description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y" rows={3} />
                      </div>
                      
                      <div className="pt-2">
                        <label className="flex items-center gap-3 p-3 border border-indigo-100 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors w-max">
                          <input type="checkbox" checked={proj.featured} onChange={e => handleArrayUpdate('projects', idx, 'featured', e.target.checked)} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                          <span className="text-sm font-medium text-indigo-900">Feature this project (shows large format at the top)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => handleArrayAdd('projects', { id: Date.now().toString(), title: 'New Project', description: '', github: '', demoUrl: '', imageUrl: '', tags: [], featured: false })} className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 py-4 rounded-2xl transition-colors">
                  <Plus size={18} /> Add Project
                </button>
              </div>
            )}

            {activeTab === 'Certifications' && (
              <div className="space-y-6">
                 {data.certifications.map((cert, idx) => (
                  <div key={cert.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm relative group">
                    <button onClick={() => handleArrayRemove('certifications', idx)} className="absolute top-4 right-4 text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={18}/></button>
                    <div className="grid gap-4 pr-10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Certification Name</label>
                           <input type="text" value={cert.name} onChange={e => handleArrayUpdate('certifications', idx, 'name', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Certificate Image/PDF</label>
                           <div className="flex items-center gap-3">
                             <label className="cursor-pointer px-4 py-2.5 bg-white border border-indigo-200 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm">
                               <Upload size={16} /> Upload
                               <input 
                                 type="file" 
                                 accept="image/*,.pdf"
                                 className="hidden" 
                                 onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                     const reader = new FileReader();
                                     reader.onloadend = () => handleArrayUpdate('certifications', idx, 'fileUrl', reader.result);
                                     reader.readAsDataURL(file);
                                   }
                                 }}
                               />
                             </label>
                             {cert.fileUrl && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded border border-green-200">Attached</span>}
                           </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Issuing Organization</label>
                           <input type="text" value={cert.issuer} onChange={e => handleArrayUpdate('certifications', idx, 'issuer', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Date Achieved</label>
                           <input type="text" value={cert.date} onChange={e => handleArrayUpdate('certifications', idx, 'date', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="e.g. Aug 2024" />
                        </div>
                      </div>
                      <div>
                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Credential URL</label>
                         <input type="text" value={cert.link} onChange={e => handleArrayUpdate('certifications', idx, 'link', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="https://..." />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => handleArrayAdd('certifications', { id: Date.now().toString(), name: '', issuer: '', date: '', link: '', fileUrl: '' })} className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 py-4 rounded-2xl transition-colors">
                  <Plus size={18} /> Add Certification
                </button>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
