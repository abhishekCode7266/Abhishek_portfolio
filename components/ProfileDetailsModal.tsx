'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, MapPin, Briefcase, FileText, X, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDetailsModal({ isOpen, onClose }: Props) {
  const { data, updateData } = usePortfolio();

  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [careerMode, setCareerMode] = useState<'internship' | 'job'>('internship');
  const [aboutBio, setAboutBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [twitter, setTwitter] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(data.name || 'Abhishek Singh Yadav');
      setHeadline(data.headline || 'Computer Science Student • Software Developer');
      setEmail(data.socialLinks?.email || 'abhisheksoraon9@gmail.com');
      setPhone(data.phone || '+91 98765 43210');
      setAddress(data.address || 'Uttar Pradesh, India');
      setCareerMode(data.careerMode || 'internship');
      setAboutBio(data.aboutBio || '');
      setGithub(data.socialLinks?.github || '');
      setLinkedin(data.socialLinks?.linkedin || '');
      setWhatsapp(data.socialLinks?.whatsapp || '');
      setTwitter(data.socialLinks?.twitter || '');
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      name: name.trim() || 'Abhishek Singh Yadav',
      headline: headline.trim() || 'Computer Science Student • Software Developer',
      phone: phone.trim() || undefined,
      address: address.trim() || 'Uttar Pradesh, India',
      careerMode,
      aboutBio: aboutBio.trim(),
      socialLinks: {
        ...data.socialLinks,
        email: email.trim(),
        github: github.trim(),
        linkedin: linkedin.trim(),
        whatsapp: whatsapp.trim(),
        twitter: twitter.trim(),
      },
    }, true);

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                <User size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                  Edit Profile & Contact Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your name, headline, phone number, address, and career mode.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Career Mode Selector */}
            <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 p-4 rounded-2xl">
              <label className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" /> Career Focus Mode
              </label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => setCareerMode('internship')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    careerMode === 'internship'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🎓 Internship Mode
                </button>
                <button
                  type="button"
                  onClick={() => setCareerMode('job')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    careerMode === 'job'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  💼 Job / Full-Time Mode
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User size={13} className="text-indigo-600 dark:text-indigo-400" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Abhishek Singh Yadav"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-indigo-600 dark:text-indigo-400" /> Professional Headline *
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="Computer Science Student • Software Developer"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail size={13} className="text-indigo-600 dark:text-indigo-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="abhisheksoraon9@gmail.com"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone size={13} className="text-indigo-600 dark:text-indigo-400" /> Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin size={13} className="text-indigo-600 dark:text-indigo-400" /> Address / Location
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Uttar Pradesh, India"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>

            {/* About / Bio */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText size={13} className="text-indigo-600 dark:text-indigo-400" /> About Bio / Summary
              </label>
              <textarea
                rows={3}
                value={aboutBio}
                onChange={e => setAboutBio(e.target.value)}
                placeholder="A brief overview of your background, technical interests, and aspirations..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y"
              />
            </div>

            {/* Social Links */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Social Profiles & Links
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={github}
                  onChange={e => setGithub(e.target.value)}
                  placeholder="GitHub URL (https://github.com/...)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-mono focus:border-indigo-500 outline-none"
                />
                <input
                  type="text"
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder="LinkedIn URL (https://linkedin.com/in/...)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-mono focus:border-indigo-500 outline-none"
                />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="WhatsApp Number or link (+91...)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-mono focus:border-indigo-500 outline-none"
                />
                <input
                  type="text"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="Twitter / X Profile URL"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-mono focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <CheckCircle2 size={16} /> Save Profile Details
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
