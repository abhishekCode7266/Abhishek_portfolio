'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

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
  const { toggleTheme, isDark, mounted } = useTheme();

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

  const showDark = mounted && isDark;

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

          {/* Dark Mode Toggle Button */}
          <button
            id="theme-toggle-desktop"
            type="button"
            onClick={toggleTheme}
            suppressHydrationWarning
            aria-label={showDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={showDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
          >
            <AnimatePresence mode="wait" initial={false}>
              {showDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <Sun size={18} className="text-amber-400 fill-amber-400/20" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <Moon size={18} className="text-slate-700 fill-slate-700/10" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Actions: Theme Toggle + Menu Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            id="theme-toggle-mobile-header"
            type="button"
            onClick={toggleTheme}
            suppressHydrationWarning
            aria-label={showDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer"
          >
            {showDark ? (
              <Sun size={20} className="text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon size={20} className="text-slate-700 fill-slate-700/10" />
            )}
          </button>

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

            <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Appearance
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                suppressHydrationWarning
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {showDark ? (
                  <>
                    <Sun size={14} className="text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-slate-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}

