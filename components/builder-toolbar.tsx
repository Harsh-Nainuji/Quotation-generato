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
        className="glass-button h-11 px-5 gap-2 text-sm"
        title="Download as PDF"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">PDF</span>
      </button>

      <button
        onClick={onPrint}
        className="glass-button h-11 px-5 gap-2 text-sm"
        title="Print proposal"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print</span>
      </button>

      <button
        onClick={onGenerateQR}
        className="glass-button h-11 px-5 gap-2 text-sm"
        title="Generate QR code"
      >
        <QrCode className="w-4 h-4" />
        <span className="hidden sm:inline">QR</span>
      </button>

      <button
        onClick={handleCopyShareLink}
        className="glass-button h-11 px-5 gap-2 text-sm disabled:opacity-50"
        disabled={loading}
        title="Copy shareable link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </>
        )}
      </button>

      {!isClient && (
        <>
          <div className="w-px h-8 bg-white/40 mx-2 hidden sm:block" />
          <button
            onClick={handleReset}
            className="glass-button h-11 px-4 text-sm text-red-500 hover:text-red-600"
            title="Reset proposal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
