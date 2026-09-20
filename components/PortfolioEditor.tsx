'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import { Settings, X, Plus, Trash2, Upload, FileText, Image as ImageIcon, Download, Copy, Check, RefreshCw, Smartphone, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { optimizeImage } from '@/lib/imageOptimizer';

const TABS = ['General', 'About', 'Skills', 'Education', 'Experience & Internships', 'Projects', 'Certifications', 'Deploy & Sync'];

export function PortfolioEditor() {
  const { data, updateData, isEditorOpen, setIsEditorOpen, exportDataJSON, importDataJSON, resetData } = usePortfolio();
  const [activeTab, setActiveTab] = useState('General');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const importFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + E to toggle the editor
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsEditorOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsEditorOpen]);

  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const jsonStr = exportDataJSON();
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('Clipboard error:', err);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importDataJSON(content);
          if (success) {
            setImportStatus('Successfully imported portfolio data!');
            setTimeout(() => setImportStatus(null), 4000);
          } else {
            setImportStatus('Failed to parse JSON file. Please check format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTextImport = () => {
    if (!importText.trim()) return;
    const success = importDataJSON(importText.trim());
    if (success) {
      setImportStatus('Successfully imported portfolio data!');
      setImportText('');
      setTimeout(() => setImportStatus(null), 4000);
    } else {
      setImportStatus('Invalid JSON format. Please verify the code.');
    }
  };

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
            <button onClick={() => setIsEditorOpen(false)} className="p-2 text-slate-500 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors" title="Close"><X size={16}/></button>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-100 shrink-0 gap-4">
            <h3 className="text-2xl font-bold text-slate-800">{activeTab}</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Quick Export & Sync buttons */}
              <button
                type="button"
                onClick={handleDownloadJSON}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors border border-slate-200 shadow-2xs"
                title="Download updated portfolio-data.json"
              >
                <Download size={14} /> Download JSON
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('Deploy & Sync')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 font-semibold text-xs rounded-xl transition-colors border shadow-2xs ${
                  activeTab === 'Deploy & Sync' 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}
              >
                <Globe size={14} /> Deploy & Sync
              </button>

              {/* Global Profile Image Upload */}
              <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                {data.profileImage ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 shrink-0">
                    <ImageIcon size={14} />
                  </div>
                )}
                <label className="cursor-pointer text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors whitespace-nowrap">
                  Upload Profile
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const optimized = await optimizeImage(file, 800, 0.88);
                          updateData({ profileImage: optimized });
                        } catch (err) {
                          console.error('Failed to optimize profile photo:', err);
                        }
                      }
                    }}
                  />
                </label>
                {data.profileImage && (
                  <button 
                    onClick={() => updateData({ profileImage: null })}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove Image"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button 
                onClick={() => setIsEditorOpen(false)} 
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
              >
                Save & Close
              </button>
            </div>
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
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Start Date</label>
                           <input type="text" value={edu.startDate || ''} onChange={e => handleArrayUpdate('education', idx, 'startDate', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="e.g. 2024" />
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">End Date</label>
                           <input type="text" value={edu.endDate || ''} onChange={e => handleArrayUpdate('education', idx, 'endDate', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="e.g. 2027 (or Present)" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Percentage / CGPA</label>
                           <input type="text" value={edu.percentage || ''} onChange={e => handleArrayUpdate('education', idx, 'percentage', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="e.g. 75% or 8.5 CGPA" />
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Location</label>
                           <input type="text" value={edu.location} onChange={e => handleArrayUpdate('education', idx, 'location', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="City, Country" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => handleArrayAdd('education', { id: Date.now().toString(), degree: '', institution: '', startDate: '', endDate: '', percentage: '', location: '' })} className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 py-4 rounded-2xl transition-colors">
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

                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Project Preview Image (Optional)</label>
                        <div className="flex items-center gap-3 flex-wrap">
                          <label className="cursor-pointer px-4 py-2 bg-white border border-indigo-200 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm shadow-2xs">
                            <Upload size={16} /> Choose Image
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const optimized = await optimizeImage(file, 1200, 0.88);
                                    handleArrayUpdate('projects', idx, 'imageUrl', optimized);
                                  } catch (err) {
                                    console.error('Failed to optimize project image:', err);
                                  }
                                }
                              }} 
                            />
                          </label>
                          {proj.imageUrl && (
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={proj.imageUrl} alt="preview" className="w-6 h-6 object-cover rounded" />
                              <span className="text-slate-700 font-medium">Image uploaded</span>
                              <button 
                                type="button" 
                                onClick={() => handleArrayUpdate('projects', idx, 'imageUrl', '')} 
                                className="text-red-500 hover:text-red-700 font-bold ml-1 p-0.5"
                                title="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-950">
                      Certificates ({data.certifications.length})
                    </h4>
                    <p className="text-xs text-indigo-700/80">
                      Upload your certificates without size errors. All 20+ certificates are fully supported with auto-compression.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleArrayAdd('certifications', { id: Date.now().toString(), name: '', issuer: '', date: '', link: '', fileUrl: '' })} 
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
                  >
                    <Plus size={16} /> Add Certificate
                  </button>
                </div>

                {data.certifications.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-sm text-slate-500 mb-3">No certificates added yet.</p>
                    <button 
                      onClick={() => handleArrayAdd('certifications', { id: Date.now().toString(), name: '', issuer: '', date: '', link: '', fileUrl: '' })} 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={16} /> Add Your First Certificate
                    </button>
                  </div>
                ) : (
                  data.certifications.map((cert, idx) => (
                    <div key={cert.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm relative group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                          #{idx + 1}
                        </span>
                        <button 
                          onClick={() => handleArrayRemove('certifications', idx)} 
                          className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                          title="Remove certificate"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Certification Name</label>
                            <input 
                              type="text" 
                              value={cert.name} 
                              onChange={e => handleArrayUpdate('certifications', idx, 'name', e.target.value)} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                              placeholder="e.g. Fundamentals of Artificial Intelligence"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Certificate Image / Document</label>
                            <div className="flex items-center gap-3 flex-wrap">
                              <label className="cursor-pointer px-4 py-2.5 bg-white border border-indigo-200 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm shadow-xs">
                                <Upload size={16} /> Choose File
                                <input 
                                  type="file" 
                                  accept="image/*,.pdf"
                                  className="hidden" 
                                   onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const optimized = await optimizeImage(file, 1920, 0.90);
                                        handleArrayUpdate('certifications', idx, 'fileUrl', optimized);
                                        if (!cert.link) {
                                          handleArrayUpdate('certifications', idx, 'link', optimized);
                                        }
                                      } catch (err) {
                                        console.error('Failed to optimize certificate image:', err);
                                      }
                                    }
                                  }}
                                />
                              </label>

                              {cert.fileUrl && (
                                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-medium">
                                  {cert.fileUrl.startsWith('data:image') || !cert.fileUrl.includes('.pdf') ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={cert.fileUrl} alt="Preview" className="w-6 h-6 object-cover rounded" />
                                  ) : (
                                    <FileText size={16} />
                                  )}
                                  <span>Attached</span>
                                  <button
                                    type="button"
                                    onClick={() => handleArrayUpdate('certifications', idx, 'fileUrl', '')}
                                    className="ml-1 text-slate-400 hover:text-red-600 font-bold p-0.5"
                                    title="Remove attachment"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Issuing Organization</label>
                            <input 
                              type="text" 
                              value={cert.issuer} 
                              onChange={e => handleArrayUpdate('certifications', idx, 'issuer', e.target.value)} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                              placeholder="e.g. Wadhwani Foundation"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Date Achieved</label>
                            <input 
                              type="text" 
                              value={cert.date} 
                              onChange={e => handleArrayUpdate('certifications', idx, 'date', e.target.value)} 
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                              placeholder="e.g. 18/JULY/2026" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Credential / Verification URL</label>
                          <input 
                            type="text" 
                            value={cert.link} 
                            onChange={e => handleArrayUpdate('certifications', idx, 'link', e.target.value)} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                            placeholder="https://verify.example.com/cert/..." 
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <button onClick={() => handleArrayAdd('certifications', { id: Date.now().toString(), name: '', issuer: '', date: '', link: '', fileUrl: '' })} className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 py-4 rounded-2xl transition-colors">
                  <Plus size={18} /> Add Another Certification
                </button>
              </div>
            )}

            {activeTab === 'Deploy & Sync' && (
              <div className="space-y-8">
                {/* Status Notice */}
                <div className="bg-indigo-50/70 border border-indigo-200 p-6 rounded-3xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl shrink-0 mt-0.5 shadow-sm">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        How to Make Your Uploads Permanent on Mobile & Deployments
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        When you upload certificates or photos, they are securely saved in this browser. To make sure your changes are visible on mobile phones, tablets, GitHub Pages, and any shared link, use the options below:
                      </p>
                    </div>
                  </div>
                </div>

                {importStatus && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    {importStatus}
                  </div>
                )}

                {/* Grid with 2 primary methods */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Option 1: Download JSON for Repository / Deploy */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-base mb-2">
                        <Download size={20} />
                        <span>1. Download for GitHub / Production</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        Download your current portfolio data file. Place it in the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono text-xs">public/portfolio-data.json</code> folder of your project and commit to GitHub. Then every visitor on mobile or desktop will automatically see all your uploaded certificates and changes!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadJSON}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-sm transition-colors text-sm"
                    >
                      <Download size={16} />
                      Download portfolio-data.json
                    </button>
                  </div>

                  {/* Option 2: Copy & Sync Across Devices */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 text-indigo-600 font-bold text-base mb-2">
                        <Smartphone size={20} />
                        <span>2. Copy & Sync to Mobile</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        Copy your portfolio data code to clipboard. Send it to your phone via WhatsApp or Email, then open your portfolio on mobile and paste it in the Import section below.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyJSON}
                      className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-2xl shadow-sm transition-colors text-sm border ${
                        copied 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check size={16} /> Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy size={16} /> Copy Portfolio JSON
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Import section */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Upload size={16} className="text-indigo-600" />
                    Import Data from File or Code
                  </h4>
                  <p className="text-xs text-slate-500">
                    Use this on your mobile device or any other browser to instantly load all your certificates and profile settings.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="file"
                      ref={importFileInputRef}
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => importFileInputRef.current?.click()}
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
                    >
                      <Upload size={14} /> Upload portfolio-data.json
                    </button>

                    <button
                      type="button"
                      onClick={resetData}
                      className="px-4 py-2.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                      title="Reset to default data"
                    >
                      <RefreshCw size={14} /> Reset Defaults
                    </button>
                  </div>

                  <div className="pt-2">
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Or paste your exported JSON data here..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleTextImport}
                      disabled={!importText.trim()}
                      className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition-colors"
                    >
                      Apply Pasted Data
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
