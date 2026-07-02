import LZ from 'lz-string';
import { ProposalData } from './types';

// Simple in-memory store for shortened URLs (in production, use a backend service)
const urlStore = new Map<string, string>();
let shortIdCounter = 0;

function generateShortId(): string {
  shortIdCounter++;
  return shortIdCounter.toString(36);
}

export function compressProposal(data: ProposalData): string {
  try {
    const json = JSON.stringify(data);
    const compressed = LZ.compressToEncodedURIComponent(json);
    return compressed;
  } catch (error) {
    console.error('[v0] Compression failed:', error);
    throw new Error('Failed to compress proposal data');
  }
}

export function decompressProposal(compressed: string): ProposalData | null {
  try {
    const json = LZ.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json);
  } catch (error) {
    console.error('[v0] Decompression failed:', error);
    return null;
  }
}

export function getShareUrl(compressed: string): string {
  if (typeof window === 'undefined') return '';
  const baseUrl = `${window.location.origin}${window.location.pathname.replace('/builder', '')}`;
  return `${baseUrl}?q=${compressed}`;
}

export function getQRUrl(compressed: string): string {
  // For QR codes, return the full URL but optimize the data
  if (typeof window === 'undefined') return '';
  const baseUrl = `${window.location.origin}${window.location.pathname.replace('/builder', '')}`;
  return `${baseUrl}?q=${compressed}`;
}
