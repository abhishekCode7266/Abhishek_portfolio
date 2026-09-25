'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, Printer } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ['about', 'skills', 'education', 'experience', 'projects', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + 140;

      if (window.scrollY < 200) {
        setActiveSection('');
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const elem = document.getElementById(id);
        if (elem) {
          const top = elem.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (href === '#' || href === '#hero') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-900/85 backdrop-blur-md shadow-sm dark:shadow-slate-950/50 py-4 border-b border-slate-100 dark:border-slate-800/80' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a 
          href="#" 
          onClick={(e) => scrollToSection(e, '#')}
          className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 tracking-tight flex items-center gap-1.5 group cursor-pointer"
        >
          <span>ASY.</span>
        </a>
        
        {/* Desktop Nav & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex gap-8 items-center">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span 
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700/80" />

          {/* Export PDF / Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
            title="Export portfolio as PDF / Print formatted for A4"
          >
            <Printer size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>PDF</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <ThemeToggle id="theme-toggle-desktop" size="md" />
        </div>

        {/* Mobile Actions: Theme Toggle + Menu Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle id="theme-toggle-mobile-header" size="md" />

          <button 
            id="mobile-menu-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 absolute w-full shadow-xl dark:shadow-slate-950/80"
        >
          <nav className="flex flex-col px-4 py-6 gap-2">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </a>
              );
            })}

            <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5 px-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Appearance
                </span>
                <ThemeToggle id="theme-toggle-mobile-drawer" showLabel={true} size="sm" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => window.print(), 200);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-100 dark:border-indigo-900/60 transition-colors cursor-pointer"
              >
                <Printer size={15} />
                <span>Export / Print Portfolio (PDF)</span>
              </button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}

