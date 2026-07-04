'use client';

import {
  Copy,
  QrCode,
  Download,
  Printer,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BuilderToolbarProps {
  onExportPDF: () => void;
  onPrint: () => void;
  onGenerateQR: () => void;
  onCopyShareLink: () => Promise<string>;
  onReset: () => void;
  shareUrl: string;
  isClient?: boolean;
}

export function BuilderToolbar({
  onExportPDF,
  onPrint,
  onGenerateQR,
  onCopyShareLink,
  onReset,
  shareUrl,
  isClient,
}: BuilderToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopyShareLink = async () => {
    setLoading(true);
    try {
      const url = await onCopyShareLink();
      if (!url) {
        toast.error('Failed to generate share link');
        setLoading(false);
        return;
      }
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      toast.success('Share link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[v0] Copy failed:', error);
      toast.error('Failed to copy share link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the proposal? This cannot be undone.')) {
      onReset();
      toast.success('Proposal reset');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={onExportPDF}
        className="hand-button-secondary !py-2 !px-4 text-sm hover:-rotate-2"
        title="Download as PDF"
      >
        <Download className="w-5 h-5 mr-1 stroke-[3px]" />
        <span className="hidden sm:inline">PDF</span>
      </button>

      <button
        onClick={onPrint}
        className="hand-button-secondary !py-2 !px-4 text-sm hover:rotate-2"
        title="Print proposal"
      >
        <Printer className="w-5 h-5 mr-1 stroke-[3px]" />
        <span className="hidden sm:inline">Print</span>
      </button>

      <button
        onClick={onGenerateQR}
        className="hand-button-secondary !py-2 !px-4 text-sm hover:-rotate-1"
        title="Generate QR code"
      >
        <QrCode className="w-5 h-5 mr-1 stroke-[3px]" />
        <span className="hidden sm:inline">QR</span>
      </button>

      <button
        onClick={handleCopyShareLink}
        className="hand-button !py-2 !px-4 text-sm disabled:opacity-50 hover:rotate-1"
        disabled={loading}
        title="Copy shareable link"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 mr-1 stroke-[3px]" />
            <span className="hidden sm:inline">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5 mr-1 stroke-[3px]" />
            <span className="hidden sm:inline">Share</span>
          </>
        )}
      </button>

      {!isClient && (
        <>
          <div className="w-0.5 h-8 bg-[var(--color-pencil)] mx-2 hidden sm:block rotate-6" />
          <button
            onClick={handleReset}
            className="text-[var(--color-marker-red)] hover:scale-110 transition-transform p-2"
            title="Reset proposal"
          >
            <RotateCcw className="w-5 h-5 stroke-[3px]" />
          </button>
        </>
      )}
    </div>
  );
}
