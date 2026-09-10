'use client';
import { useRef } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Upload, Download, ArrowDown } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import Image from 'next/image';

export function Hero() {
  const { data, updateData } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden bg-[#f4f7fa]">
      {/* Blurred background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Available for Internships
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            Hi, I&apos;m <br className="hidden lg:block" />
            <span className="text-indigo-600">Abhishek Singh Yadav</span>
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-medium text-slate-600">
            Computer Science Student &bull; Software Developer
          </h2>
          
          <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
            B.Tech Computer Science undergrad at LDC Institute of Technical Studies. 
            Passionate about software development, web development, Python, Java, 
            and building practical applications.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
            <a 
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              View Projects
              <ArrowDown size={18} />
            </a>
            <a 
              href={data.resumeUrl || "#"} 
              download={data.resumeUrl ? data.resumeName || "Resume.pdf" : undefined}
              className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors shadow-sm border ${
                data.resumeUrl 
                  ? "bg-white text-slate-700 hover:bg-slate-50 border-slate-200" 
                  : "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (!data.resumeUrl) {
                  e.preventDefault();
                  alert("Please upload your resume via the Edit Portfolio button in the bottom right corner.");
                }
              }}
            >
              <Download size={18} />
              Download Resume
            </a>
          </div>

          <div className="flex gap-4 mt-4">
            <a href={data.socialLinks?.github || "#"} target="_blank" rel="noreferrer" className="p-3 text-slate-500 hover:text-indigo-600 hover:-translate-y-1 transition-all bg-white rounded-full shadow-sm border border-slate-100">
              <Github size={22} />
            </a>
            <a href={data.socialLinks?.linkedin || "#"} target="_blank" rel="noreferrer" className="p-3 text-slate-500 hover:text-indigo-600 hover:-translate-y-1 transition-all bg-white rounded-full shadow-sm border border-slate-100">
              <Linkedin size={22} />
            </a>
            <a href={data.socialLinks?.email ? `mailto:${data.socialLinks.email}` : "#"} className="p-3 text-slate-500 hover:text-indigo-600 hover:-translate-y-1 transition-all bg-white rounded-full shadow-sm border border-slate-100">
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
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-8 border-white shadow-2xl bg-slate-200 relative transition-transform duration-300 group-hover:scale-[1.02]">
              {data.profileImage ? (
                <Image src={data.profileImage} alt="Abhishek Singh Yadav" fill className="object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-indigo-50">
                  <Upload size={48} className="mb-4 text-indigo-300" />
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
