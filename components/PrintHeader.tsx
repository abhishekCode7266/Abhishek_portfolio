'use client';

import { useState, useEffect } from 'react';
import { usePortfolio } from '@/app/context/PortfolioContext';

interface PrintHeaderProps {
  name?: string;
  subtitle?: string;
}

/**
 * PrintHeader Component
 * 
 * Reusable header that ONLY renders when printing or exporting as PDF.
 * Features 'Abhishek Singh Yadav' on the left and the current export date on the right.
 * Hidden on screen displays via CSS `.print-only`.
 */
export function PrintHeader({ 
  name,
  subtitle = 'Curriculum Vitae • Portfolio'
}: PrintHeaderProps) {
  const { data } = usePortfolio();
  const [currentDate, setCurrentDate] = useState<string>('');

  const displayName = name || data?.name || 'Abhishek Singh Yadav';

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formatted);
  }, []);

  return (
    <div 
      className="print-only print-header w-full border-b border-slate-300 pb-2 mb-4"
      aria-hidden="true"
    >
      <div className="flex justify-between items-center w-full text-slate-800">
        <div className="flex items-center gap-2">
          <span className="print-name font-bold text-sm tracking-tight text-slate-900 uppercase flex items-center">
            {displayName}
          </span>
          {subtitle && (
            <span className="text-[11px] text-slate-500 font-normal">
              | {subtitle}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-500 font-mono tracking-normal">
            {currentDate || 'Export Date: 2026'}
          </span>
        </div>
      </div>
    </div>
  );
}
