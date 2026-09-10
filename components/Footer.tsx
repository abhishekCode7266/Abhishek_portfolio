'use client';
import { Github, Linkedin, Mail, Facebook, Instagram, MessageCircle, Send, Twitter, Youtube } from 'lucide-react';
import { usePortfolio } from '@/app/context/PortfolioContext';

export function Footer() {
  const { data } = usePortfolio();
  
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold text-white tracking-tight mb-2 block">ASY.</span>
            <p className="text-sm max-w-sm">Designing and building modern digital experiences. Available for new opportunities.</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href={data.socialLinks?.github || "#"} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href={data.socialLinks?.linkedin || "#"} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            {data.socialLinks?.whatsapp && (
              <a href={`https://wa.me/${data.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="WhatsApp">
                <MessageCircle size={20} />
              </a>
            )}
            {data.socialLinks?.telegram && (
              <a href={data.socialLinks.telegram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Telegram">
                <Send size={20} />
              </a>
            )}
            {data.socialLinks?.instagram && (
              <a href={data.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Instagram">
                <Instagram size={20} />
              </a>
            )}
            {data.socialLinks?.facebook && (
              <a href={data.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Facebook">
                <Facebook size={20} />
              </a>
            )}
            {data.socialLinks?.twitter && (
              <a href={data.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Twitter / X">
                <Twitter size={20} />
              </a>
            )}
            {data.socialLinks?.youtube && (
              <a href={data.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="YouTube">
                <Youtube size={20} />
              </a>
            )}
            <a href={data.socialLinks?.email ? `mailto:${data.socialLinks.email}` : "#"} className="hover:text-white transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800/50 text-xs">
          <p>&copy; {new Date().getFullYear()} Abhishek Singh Yadav. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
