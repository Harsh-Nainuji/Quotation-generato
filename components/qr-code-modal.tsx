'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Download, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  proposalNumber: string;
}

export function QRCodeModal({
  open,
  onOpenChange,
  shareUrl,
  proposalNumber,
}: QRCodeModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${proposalNumber}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('QR code downloaded');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Proposal</DialogTitle>
          <DialogDescription>
            Scan this QR code or share the link below
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <div className="relative w-64 h-64">
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg break-all text-sm text-slate-600 dark:text-slate-400">
            {shareUrl}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
