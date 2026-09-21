'use client';
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Sparkles, CheckCircle2, Award, Calendar, Building2, Link as LinkIcon, Loader2, FileText } from 'lucide-react';
import { usePortfolio, Certification } from '@/app/context/PortfolioContext';
import { optimizeImage } from '@/lib/imageOptimizer';
import { extractCertificateDetails } from '@/lib/certificateExtractor';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (cert: Certification) => void;
}

function generateCertId(name: string, count: number): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24);
  return `cert-${clean || 'item'}-${count + 1}`;
}

export function CertificateUploadModal({ isOpen, onClose, onSuccess }: Props) {
  const { data, updateData } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // Form fields (auto-populated by AI)
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certStartDate, setCertStartDate] = useState('');
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certLink, setCertLink] = useState('');
  const [aiExtracted, setAiExtracted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (file: File) => {
    try {
      setErrorMessage(null);
      setIsProcessing(true);
      setFileName(file.name);
      setProcessingStep('Compressing & preparing image...');

      // 1. Optimize image into lightweight high-res data URL
      const optimized = await optimizeImage(file, 1920, 0.90);
      setFilePreview(optimized);

      // 2. Call AI Extractor
      setProcessingStep('AI is analyzing certificate & extracting details...');
      const extracted = await extractCertificateDetails(optimized, file.name);

      // 3. Auto-populate fields
      setCertName(extracted.name || '');
      setCertIssuer(extracted.issuer || '');
      setCertDate(extracted.date || '');
      setCertStartDate(extracted.startDate || '');
      setCertCredentialId(extracted.credentialId || '');
      setCertLink(extracted.link || '');
      setAiExtracted(true);
      setProcessingStep('');
    } catch (err) {
      console.error('Extraction error:', err);
      setErrorMessage('Could not auto-extract details. You can enter them manually below.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!certName.trim()) {
      setErrorMessage('Please provide a certificate title.');
      return;
    }

    const certId = generateCertId(certName, data.certifications.length);
    const newCert: Certification = {
      id: certId,
      name: certName.trim(),
      issuer: certIssuer.trim() || 'Verified Organization',
      date: certDate.trim() || 'VERIFIED',
      startDate: certStartDate.trim() || undefined,
      credentialId: certCredentialId.trim() || undefined,
      link: certLink.trim() || (filePreview || ''),
      fileUrl: filePreview || undefined,
    };

    const updatedCerts = [newCert, ...data.certifications];
    updateData({ certifications: updatedCerts });

    if (onSuccess) {
      onSuccess(newCert);
    }
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFilePreview(null);
    setFileName('');
    setCertName('');
    setCertIssuer('');
    setCertDate('');
    setCertStartDate('');
    setCertCredentialId('');
    setCertLink('');
    setAiExtracted(false);
    setIsProcessing(false);
    setErrorMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                Upload & Auto-Extract Certificate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your certificate image — AI auto-fills the name, organization & dates!
              </p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Dropzone / Upload area */}
          {!filePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileChange(file);
              }}
              className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                Drop certificate image here or tap to browse
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                Supports JPG, PNG, WebP, or PDF. Captured photos from mobile cameras work great!
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xs">
                <Sparkles size={14} /> AI Auto-Fill Enabled
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3">
                {filePreview.startsWith('data:image') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={filePreview} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-950/80 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FileText size={24} />
                  </div>
                )}
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{fileName || 'Certificate Image'}</h5>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 size={13} /> Attached & Analyzed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFilePreview(null);
                  setAiExtracted(false);
                }}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Change File
              </button>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-indigo-950 dark:text-indigo-200">Extracting Certificate Information</p>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">{processingStep}</p>
              </div>
            </div>
          )}

          {/* AI Extracted Notification */}
          {aiExtracted && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>AI automatically extracted and populated your certificate fields below! Review or edit anytime.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Award size={14} className="text-indigo-600 dark:text-indigo-400" /> Certificate / Course Title *
              </label>
              <input
                type="text"
                value={certName}
                onChange={e => setCertName(e.target.value)}
                placeholder="e.g. Fundamentals of Artificial Intelligence"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 size={14} className="text-indigo-600 dark:text-indigo-400" /> Issuing Organization *
                </label>
                <input
                  type="text"
                  value={certIssuer}
                  onChange={e => setCertIssuer(e.target.value)}
                  placeholder="e.g. Wadhwani Foundation"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-600 dark:text-indigo-400" /> Completion / Issue Date *
                </label>
                <input
                  type="text"
                  value={certDate}
                  onChange={e => setCertDate(e.target.value)}
                  placeholder="e.g. 18/JULY/2026"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Start Date (Optional)
                </label>
                <input
                  type="text"
                  value={certStartDate}
                  onChange={e => setCertStartDate(e.target.value)}
                  placeholder="e.g. 01/JUNE/2026"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={certCredentialId}
                  onChange={e => setCertCredentialId(e.target.value)}
                  placeholder="e.g. WF-AI-2026-8891"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <LinkIcon size={14} className="text-indigo-600 dark:text-indigo-400" /> Verification URL / Link (Optional)
              </label>
              <input
                type="text"
                value={certLink}
                onChange={e => setCertLink(e.target.value)}
                placeholder="https://verify.example.com/certificate/..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-indigo-600 dark:text-indigo-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => { resetForm(); onClose(); }}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessing || !certName.trim()}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 size={16} /> Save to Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
}
