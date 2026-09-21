'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { MapPin, Mail, Github, Linkedin, Send, CheckCircle2, Loader2, Facebook, Instagram, MessageCircle, Twitter, Youtube } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import { formatUrl } from '@/lib/utils';

export function Contact() {
  const { data } = usePortfolio();
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    // Simulate network request
    setTimeout(() => {
      setFormStatus('success');
      // Reset after 3 seconds
      setTimeout(() => setFormStatus('idle'), 3000);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 scroll-mt-20 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Get In Touch</SectionHeading>
        
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 max-w-6xl mx-auto">
          {/* Left Column - Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Let&apos;s Connect</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you have a question, an internship opportunity, or just want to say hi, 
                I&apos;ll try my best to get back to you!
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1">Email</h4>
                  <a href={data.socialLinks?.email ? `mailto:${data.socialLinks.email}` : "#"} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {data.socialLinks?.email || "Email address"}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1">Location</h4>
                  <span className="text-slate-600 dark:text-slate-400">Uttar Pradesh, India</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">Social Profiles</h4>
              <div className="flex flex-wrap gap-4">
                <a href={formatUrl(data.socialLinks?.github)} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 rounded-xl border border-slate-100 dark:border-slate-700/80 transition-all">
                  <Github size={20} />
                </a>
                <a href={formatUrl(data.socialLinks?.linkedin)} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 rounded-xl border border-slate-100 dark:border-slate-700/80 transition-all">
                  <Linkedin size={20} />
                </a>
                {data.socialLinks?.whatsapp && (
                  <a href={`https://wa.me/${data.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-green-500 rounded-xl border border-slate-100 dark:border-slate-700/80 transition-all" title="WhatsApp">
                    <MessageCircle size={20} />
                  </a>
                )}
                {data.socialLinks?.telegram && (
                  <a href={formatUrl(data.socialLinks.telegram)} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-blue-500 rounded-xl border border-slate-100 dark:border-slate-700/80 transition-all" title="Telegram">
                    <Send size={20} />
                  </a>
                )}
                {data.socialLinks?.instagram && (
                  <a href={formatUrl(data.socialLinks.instagram)} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-pink-600 rounded-xl border border-slate-100 dark:border-slate-700/80 transition-all" title="Instagram">
                    <Instagram size={20} />
                  </a>
                )}
                {data.socialLinks?.facebook && (
                  <a href={formatUrl(data.socialLinks.facebook)} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-blue-600 rounded-xl border border-slate-100 dark:border-slate-700/80 transition-all" title="Facebook">
                    <Facebook size={20} />
                  </a>
                )}
                {data.socialLinks?.twitter && (
                  <a href={formatUrl(data.socialLinks.twitter)} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-sky-500 rounded-xl border border-slate-100 dark:border-slate-700/80 transition-all" title="Twitter / X">
                    <Twitter size={20} />
                  </a>
                )}
                {data.socialLinks?.youtube && (
                  <a href={formatUrl(data.socialLinks.youtube)} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-red-600 rounded-xl border border-slate-100 dark:border-slate-700/80 transition-all" title="YouTube">
                    <Youtube size={20} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-[#f4f7fa] dark:bg-slate-800/80 p-8 md:p-10 rounded-3xl border border-transparent dark:border-slate-700/80"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm outline-none transition-all"
                  placeholder="Internship Opportunity"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm resize-none outline-none transition-all"
                  placeholder="Hi Abhishek, I would like to discuss..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={formStatus !== 'idle'}
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2 cursor-pointer shadow-sm"
              >
                {formStatus === 'idle' && (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
                {formStatus === 'loading' && (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                )}
                {formStatus === 'success' && (
                  <>
                    <CheckCircle2 size={18} />
                    Message Sent
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
