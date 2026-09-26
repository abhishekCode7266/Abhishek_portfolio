'use client';

import { useState, useEffect } from 'react';

interface PrintFooterProps {
  customUrl?: string;
  totalEstimatedPages?: number;
}

/**
 * PrintFooter Component
 * 
 * Reusable footer component that ONLY renders when printing or exporting as PDF.
 * Shows the current page URL on the left and a page number indicator (e.g., 'Page 1 of X') on the right.
 * Hidden on screen displays via CSS `.print-only`.
 */
export function PrintFooter({ 
  customUrl,
  totalEstimatedPages = 3
}: PrintFooterProps) {
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use clean URL without query or hash for professional resume reference
      const url = window.location.origin + window.location.pathname;
      setCurrentUrl(url);
    }
  }, []);

  const displayUrl = customUrl || currentUrl || 'https://abhisheksinghyadav.dev';

  return (
    <div
      className="print-only print-footer w-full border-t border-slate-300 pt-2 mt-8 text-slate-500 text-[8pt]"
      aria-hidden="true"
    >
      <div className="flex justify-between items-center w-full text-slate-600 font-mono text-[7.5pt]">
        {/* Current URL on left */}
        <div className="truncate max-w-[70%]">
          <span className="text-slate-500 hover:text-slate-700">{displayUrl}</span>
        </div>

        {/* Page numbering on right (e.g., 'Page 1 of X') */}
        <div className="text-right shrink-0 font-medium text-slate-600">
          <span className="print-page-counter">
            Page <span className="current-page-num" /> of <span className="total-pages-num">{totalEstimatedPages}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
