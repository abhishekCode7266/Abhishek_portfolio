'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Sparkles, CheckCircle2, Award, Calendar, Building2, Link as LinkIcon, Loader2, FileText } from 'lucide-react';
import { usePortfolio, Certification } from '@/app/context/PortfolioContext';
import { optimizeImage } from '@/lib/imageOptimizer';
import { extractCertificateDetails } from '@/lib/certificateExtractor';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (cert: Certification) => void;
  editingCert?: Certification | null;
  onDelete?: (certId: string) => void;
}

function generateCertId(name: string, count: number): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24);
  return `cert-${clean || 'item'}-${Date.now().toString().slice(-6)}`;
}

export function CertificateUploadModal({ isOpen, onClose, onSuccess, editingCert, onDelete }: Props) {
  const { data, updateData } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // Form fields (auto-populated by AI or pre-filled for edit)
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certStartDate, setCertStartDate] = useState('');
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certLink, setCertLink] = useState('');
  const [aiExtracted, setAiExtracted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever modal opens or editingCert changes
  useEffect(() => {
    if (isOpen) {
      if (editingCert) {
        setCertName(editingCert.name || '');
        setCertIssuer(editingCert.issuer || '');
        setCertDate(editingCert.date || '');
        setCertStartDate(editingCert.startDate || '');
        setCertCredentialId(editingCert.credentialId || '');
        setCertLink(editingCert.link || '');
        setFilePreview(editingCert.fileUrl || null);
        setFileName(editingCert.name ? `${editingCert.name}` : 'Existing Certificate Document');
        setAiExtracted(false);
        setErrorMessage(null);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingCert]);

  const handleFileChange = async (file: File) => {
    try {
      setErrorMessage(null);
      setIsProcessing(true);
      setFileName(file.name);
      setProcessingStep('Compressing & preparing document...');

      // 1. Optimize image or read PDF into data URL
      const optimized = await optimizeImage(file, 1920, 0.90);
      setFilePreview(optimized);

      // 2. Call AI Extractor
      setProcessingStep('AI is analyzing certificate & extracting details...');
      const extracted = await extractCertificateDetails(optimized, file.name);

      // 3. Auto-populate fields (keep existing if already set and user is replacing file, or populate extracted)
      if (extracted.name) setCertName(extracted.name);
      if (extracted.issuer) setCertIssuer(extracted.issuer);
      if (extracted.date) setCertDate(extracted.date);
      if (extracted.startDate) setCertStartDate(extracted.startDate);
      if (extracted.credentialId) setCertCredentialId(extracted.credentialId);
      if (extracted.link) setCertLink(extracted.link);
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

    if (editingCert) {
      // Update existing certificate
      const updatedCert: Certification = {
        ...editingCert,
        name: certName.trim(),
        issuer: certIssuer.trim() || 'Verified Organization',
        date: certDate.trim() || 'VERIFIED',
        startDate: certStartDate.trim() || undefined,
        credentialId: certCredentialId.trim() || undefined,
        link: certLink.trim() || (filePreview || ''),
        fileUrl: filePreview || undefined,
      };

      const updatedCerts = data.certifications.map(c => 
        c.id === editingCert.id ? updatedCert : c
      );
      updateData({ certifications: updatedCerts }, true);

      if (onSuccess) {
        onSuccess(updatedCert);
      }
    } else {
      // Add new certificate
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
      updateData({ certifications: updatedCerts }, true);

      if (onSuccess) {
        onSuccess(newCert);
      }
    }

    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (!editingCert) return;
    if (onDelete) {
      onDelete(editingCert.id);
    } else {
      const filtered = data.certifications.filter(c => c.id !== editingCert.id);
      updateData({ certifications: filtered }, true);
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

  const isPdf = filePreview ? (filePreview.startsWith('data:application/pdf') || filePreview.toLowerCase().includes('.pdf')) : false;

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
                {editingCert ? 'Edit & Correct Certificate' : 'Upload & Auto-Extract Certificate'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingCert 
                  ? 'Update certificate information, correct typos, or replace the attached file.' 
                  : 'Upload your certificate image — AI auto-fills the name, organization & dates!'}
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
                accept="image/*,.pdf,application/pdf"
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
                Drop certificate image or PDF here, or tap to browse
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                Supports JPG, PNG, WebP, or PDF documents.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xs">
                <Sparkles size={14} /> AI Auto-Fill Enabled
              </span>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {!isPdf && (filePreview.startsWith('data:image') || filePreview.startsWith('http')) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-16 h-16 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs" 
                    />
                  ) : (
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950/80 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <FileText size={28} />
                    </div>
                  )}
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{fileName || certName || 'Certificate Document'}</h5>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={13} /> {isPdf ? 'PDF Document Attached' : 'Image Certificate Attached'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer text-xs font-semibold px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5">
                    <Upload size={13} /> Replace File
                    <input
                      type="file"
                      accept="image/*,.pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(file);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFilePreview(null);
                      setAiExtracted(false);
                    }}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* In-modal high-clarity preview banner if image is loaded */}
              {!isPdf && filePreview && (
                <div className="w-full max-h-48 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={filePreview} 
                    alt="Certificate Preview" 
                    className="max-h-44 w-auto object-contain rounded"
                  />
                </div>
              )}
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
              <span>AI automatically extracted certificate details below! You can review or manually correct any field before saving.</span>
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {editingCert && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Delete Certificate
              </button>
            )}
          </div>
          <button
            type="button"
            disabled={isProcessing || !certName.trim()}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 size={16} /> {editingCert ? 'Update Certificate' : 'Save to Portfolio'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
