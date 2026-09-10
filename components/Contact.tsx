'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { MapPin, Mail, Github, Linkedin, Send, CheckCircle2, Loader2 } from 'lucide-react';

export function Contact() {
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
    <section id="contact" className="py-24 bg-white">
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
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Let&apos;s Connect</h3>
              <p className="text-slate-600 leading-relaxed">
                Whether you have a question, an internship opportunity, or just want to say hi, 
                I&apos;ll try my best to get back to you!
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-1">Email</h4>
                  <a href="mailto:abhisheksoraon9@gmail.com" className="text-slate-600 hover:text-indigo-600 transition-colors">
                    abhisheksoraon9@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-1">Location</h4>
                  <span className="text-slate-600">Uttar Pradesh, India</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-8 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Social Profiles</h4>
              <div className="flex gap-4">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-3 bg-slate-50 text-slate-600 hover:text-white hover:bg-indigo-600 rounded-xl transition-all">
                  <Github size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-3 bg-slate-50 text-slate-600 hover:text-white hover:bg-indigo-600 rounded-xl transition-all">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-[#f4f7fa] p-8 md:p-10 rounded-3xl"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-600 bg-white shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-600 bg-white shadow-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-600 bg-white shadow-sm"
                  placeholder="Internship Opportunity"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-600 bg-white shadow-sm resize-none"
                  placeholder="Hi Abhishek, I would like to discuss..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={formStatus !== 'idle'}
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
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
