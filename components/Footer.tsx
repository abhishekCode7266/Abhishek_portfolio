'use client';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Send, 
  Youtube, 
  ArrowUp,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';
import { formatUrl } from '@/lib/utils';

export function Footer() {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  const primarySocials = [
    {
      name: 'GitHub',
      handle: 'abhishekCode7266',
      url: data.socialLinks?.github || 'https://github.com/abhishekCode7266',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      handle: 'Abhishek Singh Yadav',
      url: data.socialLinks?.linkedin || 'https://www.linkedin.com/in/abhishek-singh-yadav-0b4453303/',
      icon: Linkedin,
    },
    {
      name: 'Twitter / X',
      handle: '@AbhishekSingh',
      url: data.socialLinks?.twitter || 'https://twitter.com',
      icon: Twitter,
    },
  ];

  const secondarySocials = [
    data.socialLinks?.email && {
      name: 'Email',
      url: `mailto:${data.socialLinks.email}`,
      icon: Mail,
    },
    data.socialLinks?.whatsapp && {
      name: 'WhatsApp',
      url: `https://wa.me/${data.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`,
      icon: MessageCircle,
    },
    data.socialLinks?.telegram && {
      name: 'Telegram',
      url: formatUrl(data.socialLinks.telegram),
      icon: Send,
    },
    data.socialLinks?.instagram && {
      name: 'Instagram',
      url: formatUrl(data.socialLinks.instagram),
      icon: Instagram,
    },
    data.socialLinks?.youtube && {
      name: 'YouTube',
      url: formatUrl(data.socialLinks.youtube),
      icon: Youtube,
    },
    data.socialLinks?.facebook && {
      name: 'Facebook',
      url: formatUrl(data.socialLinks.facebook),
      icon: Facebook,
    },
  ].filter(Boolean) as { name: string; url: string; icon: typeof Mail }[];

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Identity & Bio */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <button 
                onClick={scrollToTop}
                className="text-2xl font-bold text-white tracking-tight mb-3 inline-block hover:text-indigo-400 transition-colors cursor-pointer"
              >
                ASY<span className="text-indigo-400">.</span>
              </button>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
                B.Tech Computer Science student &amp; developer crafting modern software applications with Python, Java, and Next.js.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Open to Software Engineering Roles
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800/60 flex items-center gap-3">
              <button
                onClick={scrollToTop}
                title="Back to top"
                aria-label="Back to top"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <ArrowUp size={15} />
                Back to top
              </button>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map(link => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={e => scrollToSection(e, link.href)}
                    className="text-slate-400 hover:text-indigo-400 transition-colors inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Dedicated Social Media Section */}
          <div className="md:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-400" />
                Social Media &amp; Profiles
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Connect</span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Follow my latest code releases, open-source work, and professional updates.
            </p>

            {/* Featured Social Links Cards: GitHub, LinkedIn, Twitter/X */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {primarySocials.map(item => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={formatUrl(item.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="group p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-700/50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-400 flex items-center justify-center transition-colors">
                        <IconComponent size={16} />
                      </div>
                      <ExternalLink size={12} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        {item.handle}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Secondary Channels (Email, WhatsApp, Telegram, etc.) */}
            {secondarySocials.length > 0 && (
              <div>
                <span className="text-[11px] text-slate-500 font-mono block mb-2">More Ways to Connect</span>
                <div className="flex flex-wrap gap-2">
                  {secondarySocials.map(sub => {
                    const SubIcon = sub.icon;
                    return (
                      <a
                        key={sub.name}
                        href={formatUrl(sub.url)}
                        target="_blank"
                        rel="noreferrer"
                        title={sub.name}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-all"
                      >
                        <SubIcon size={14} className="text-slate-400" />
                        <span>{sub.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright and Legal Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Abhishek Singh Yadav. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-slate-500">Built with Next.js &amp; Tailwind</span>
            <button 
              onClick={scrollToTop}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Top &uarr;
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
