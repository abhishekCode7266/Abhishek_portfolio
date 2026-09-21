'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading } from './SectionHeading';
import { Award, ExternalLink, FileText, Search, X, Maximize2, Download, CheckCircle2, Sparkles, Plus } from 'lucide-react';
import { usePortfolio, Certification } from '@/app/context/PortfolioContext';
import { formatUrl } from '@/lib/utils';
import { CertificateUploadModal } from './CertificateUploadModal';

export function Certifications() {
  const { data, setIsEditorOpen } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Extract unique issuers for filtering
  const issuers = useMemo(() => {
    const list = data.certifications
      .map(c => c.issuer.trim())
      .filter(Boolean);
    return ['All', ...Array.from(new Set(list))];
  }, [data.certifications]);

  // Filter certifications based on search and issuer filter
  const filteredCertifications = useMemo(() => {
    return data.certifications.filter(cert => {
      const matchesSearch = 
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.date && cert.date.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesIssuer = selectedIssuer === 'All' || cert.issuer.trim().toLowerCase() === selectedIssuer.toLowerCase();

      return matchesSearch && matchesIssuer;
    });
  }, [data.certifications, searchQuery, selectedIssuer]);

  return (
    <section id="certifications" className="py-24 scroll-mt-20 bg-[#f4f7fa] dark:bg-[#0b0f19] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <SectionHeading>Certifications</SectionHeading>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mt-1">
              Verified professional credentials, licenses, and course completions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Upload Certificate (Auto-Fill)</span>
            </button>

            {data.certifications.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl shadow-2xs">
                <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400" />
                {data.certifications.length} {data.certifications.length === 1 ? 'Certificate' : 'Certificates'}
              </span>
            )}
          </div>
        </div>

        {/* Search & Filter Bar (shown if there are multiple certifications) */}
        {data.certifications.length > 3 && (
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by certificate title, skill, or organization..."
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-xs"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Issuer filter pills if more than 1 issuer exists */}
            {issuers.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">Filter:</span>
                {issuers.map(issuer => (
                  <button
                    key={issuer}
                    onClick={() => setSelectedIssuer(issuer)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedIssuer === issuer
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {issuer}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State when no certificates match or none uploaded */}
        {data.certifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-100 dark:border-slate-700 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Award size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">No Certificates Added Yet</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              You can easily upload and showcase all of your 20+ certificates using the portfolio manager.
            </p>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Add Your First Certificate
            </button>
          </div>
        ) : filteredCertifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-100 dark:border-slate-700 text-center max-w-md mx-auto shadow-xs">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">No certificates match your search query &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedIssuer('All'); }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCertifications.map((cert, idx) => (
              <motion.div 
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700/80 shadow-xs dark:shadow-slate-950/50 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Award size={24} />
                  </div>
                  {cert.date && (
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-600/50">
                      {cert.date}
                    </span>
                  )}
                </div>
                
                {/* Visual Certificate Card Preview */}
                {cert.fileUrl && !cert.fileUrl.toLowerCase().endsWith('.pdf') && (
                  <div 
                    onClick={() => setPreviewCert(cert)}
                    className="relative w-full h-44 mb-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 shadow-inner flex items-center justify-center p-2 cursor-pointer group/img"
                    title="Click to view full certificate"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={cert.fileUrl} 
                      alt={cert.name} 
                      className="object-contain w-full h-full rounded transition-transform duration-300 group-hover/img:scale-[1.02]" 
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold rounded-2xl backdrop-blur-[2px]">
                      <Maximize2 size={16} /> Click to expand
                    </div>
                  </div>
                )}

                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {cert.name || 'Certificate'}
                </h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">{cert.issuer}</p>
                
                <div className="flex flex-col gap-2.5 mt-auto pt-5 border-t border-slate-100 dark:border-slate-700/80">
                  <div className="flex items-center justify-between gap-2">
                    {/* Certificate view / expand button */}
                    {cert.fileUrl && (
                      <button 
                        onClick={() => setPreviewCert(cert)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 transition-colors cursor-pointer"
                      >
                        <FileText size={15} /> View Full
                      </button>
                    )}

                    {/* Direct verify link or fallback to image */}
                    {(cert.link || cert.fileUrl) && (
                      <a 
                        href={cert.link ? formatUrl(cert.link) : cert.fileUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="ml-auto flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors bg-indigo-50/80 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg"
                      >
                        Verify <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* High-Resolution Certificate Lightbox Modal */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 dark:bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80">
                <div className="pr-4">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg line-clamp-1">{previewCert.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{previewCert.issuer} {previewCert.date ? `• ${previewCert.date}` : ''}</p>
                </div>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body / Image View */}
              <div className="p-4 sm:p-6 flex-1 overflow-auto flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/60 min-h-[300px]">
                {previewCert.fileUrl && previewCert.fileUrl.startsWith('data:image') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewCert.fileUrl}
                    alt={previewCert.name}
                    className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                ) : previewCert.fileUrl ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-indigo-500 dark:text-indigo-400 mb-3" />
                    <p className="text-slate-700 dark:text-slate-200 font-semibold mb-4">PDF Certificate Document</p>
                    <a
                      href={previewCert.fileUrl}
                      download={`${previewCert.name || 'certificate'}.pdf`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Download size={16} /> Download PDF Document
                    </a>
                  </div>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-sm">No preview file attached.</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex-wrap gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">Official Certificate Preview</span>
                <div className="flex items-center gap-3">
                  {previewCert.fileUrl && (
                    <a
                      href={previewCert.fileUrl}
                      download={`${previewCert.name || 'certificate'}.jpg`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                    >
                      <Download size={14} /> Download
                    </a>
                  )}
                  {(previewCert.link || previewCert.fileUrl) && (
                    <a
                      href={previewCert.link ? formatUrl(previewCert.link) : previewCert.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      Verify Credential <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Certificate AI Upload & Auto-Extraction Modal */}
      <CertificateUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </section>
  );
}
