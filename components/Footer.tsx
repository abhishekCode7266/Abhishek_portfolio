import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="text-center md:text-left">
          <span className="text-2xl font-bold text-white tracking-tight mb-2 block">ASY.</span>
          <p className="text-sm">&copy; {new Date().getFullYear()} Abhishek Singh Yadav. All rights reserved.</p>
        </div>

        <div className="flex gap-5">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="mailto:abhisheksoraon9@gmail.com" className="hover:text-white transition-colors">
            <Mail size={20} />
          </a>
        </div>
        
      </div>
    </footer>
  );
}
