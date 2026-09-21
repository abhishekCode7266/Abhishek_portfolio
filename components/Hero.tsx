'use client';
import { useRef } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Upload, Download, ArrowDown, FileText, Facebook, Instagram, MessageCircle, Send, Twitter, Youtube } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import Image from 'next/image';
import { formatUrl } from '@/lib/utils';
import { optimizeImage } from '@/lib/imageOptimizer';

export function Hero() {
  const { data, updateData } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImage(file, 800, 0.88);
        updateData({ profileImage: optimized });
      } catch (err) {
        console.error('Failed to optimize profile photo:', err);
      }
    }
  };

  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', '#projects');
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden bg-[#f4f7fa] dark:bg-[#0b0f19] transition-colors duration-200">
      {/* Blurred background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-200/50 dark:bg-indigo-950/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-200/40 dark:bg-blue-950/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 order-2 lg:order-1"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            Hi, I&apos;m <br className="hidden lg:block" />
            <span className="text-indigo-600 dark:text-indigo-400">Abhishek Singh Yadav</span>
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-medium text-slate-600 dark:text-slate-300">
            Computer Science Student &bull; Software Developer
          </h2>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-xl">
            B.Tech Computer Science undergrad at LDC Institute of Technical Studies. 
            Passionate about software development, web development, Python, Java, 
            and building practical applications.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
            <a 
              id="hero-view-projects-btn"
              href="#projects"
              onClick={scrollToProjects}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-indigo-300/40 dark:hover:shadow-indigo-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg shadow-indigo-200/50 dark:shadow-none cursor-pointer"
            >
              View Projects
              <ArrowDown size={18} />
            </a>
            <a 
              id="hero-download-cv-btn"
              href={data.resumeUrl || "/Abhishek_Singh_Yadav_Resume.pdf"} 
              download={data.resumeName || "Abhishek_Singh_Yadav_Resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Abhishek Singh Yadav's CV in PDF format"
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/80 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 border border-slate-200/90 dark:border-slate-700 cursor-pointer overflow-hidden"
            >
              {/* Subtle light shimmer on hover */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              <FileText size={18} className="text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200" />
              <span>Download CV</span>
              <Download size={16} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <a href={formatUrl(data.socialLinks?.github)} target="_blank" rel="noreferrer" className="p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
              <Github size={22} />
            </a>
            <a href={formatUrl(data.socialLinks?.linkedin)} target="_blank" rel="noreferrer" className="p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
              <Linkedin size={22} />
            </a>
            {data.socialLinks?.whatsapp && (
              <a href={`https://wa.me/${data.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-3 text-slate-500 dark:text-slate-400 hover:text-green-500 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700" title="WhatsApp">
                <MessageCircle size={22} />
              </a>
            )}
            {data.socialLinks?.telegram && (
              <a href={formatUrl(data.socialLinks.telegram)} target="_blank" rel="noreferrer" className="p-3 text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700" title="Telegram">
                <Send size={22} />
              </a>
            )}
            {data.socialLinks?.instagram && (
              <a href={formatUrl(data.socialLinks.instagram)} target="_blank" rel="noreferrer" className="p-3 text-slate-500 dark:text-slate-400 hover:text-pink-600 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700" title="Instagram">
                <Instagram size={22} />
              </a>
            )}
            {data.socialLinks?.facebook && (
              <a href={formatUrl(data.socialLinks.facebook)} target="_blank" rel="noreferrer" className="p-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700" title="Facebook">
                <Facebook size={22} />
              </a>
            )}
            {data.socialLinks?.twitter && (
              <a href={formatUrl(data.socialLinks.twitter)} target="_blank" rel="noreferrer" className="p-3 text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700" title="Twitter / X">
                <Twitter size={22} />
              </a>
            )}
            {data.socialLinks?.youtube && (
              <a href={formatUrl(data.socialLinks.youtube)} target="_blank" rel="noreferrer" className="p-3 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700" title="YouTube">
                <Youtube size={22} />
              </a>
            )}
            <a href={data.socialLinks?.email ? `mailto:${data.socialLinks.email}` : "#"} className="p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-1 transition-all bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
              <Mail size={22} />
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center order-1 lg:order-2 lg:justify-end"
        >
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl bg-slate-200 dark:bg-slate-700 relative transition-transform duration-300 group-hover:scale-[1.02]">
              {data.profileImage ? (
                <Image src={data.profileImage} alt="Abhishek Singh Yadav" fill className="object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-indigo-50 dark:bg-slate-800">
                  <Upload size={48} className="mb-4 text-indigo-300 dark:text-indigo-400" />
                  <span className="font-medium text-indigo-400">Upload Photo</span>
                </div>
              )}
            </div>
            {/* Hover Overlay */}
            <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10 m-2">
              <span className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                <Upload size={18} /> Update Photo
              </span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
