'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ProposalData } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PROPOSAL: ProposalData = {
  id: uuidv4(),
  clientName: '',
  companyName: '',
  email: '',
  phone: '',
  proposalNumber: `PROP-${Date.now()}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  description: '',
  lineItems: [
    { id: uuidv4(), description: '', quantity: 1, rate: 0, type: 'product', isNegotiable: true },
  ],
  notes: '',
  taxRate: 0,
  currency: 'USD',
  status: 'draft',
};

const STORAGE_KEY = 'quoteflow_draft';
const DEBOUNCE_MS = 1000;

export function useProposal() {
  const [proposal, setProposal] = useState<ProposalData>(DEFAULT_PROPOSAL);
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize from URL or localStorage
  useEffect(() => {
    const fetchProposal = async (shortId: string) => {
      try {
        const res = await fetch(`/api/quotes/${shortId}`);
        const data = await res.json();
        if (data.success && data.quote) {
          setProposal(data.quote);
        }
      } catch (error) {
        console.error('Failed to load quote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const shortId = params.get('id');

    if (shortId) {
      fetchProposal(shortId);
      return;
    }

    // Try to load from localStorage
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        setProposal(JSON.parse(draft));
      } catch (error) {
        console.error('[v0] Failed to load draft:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Auto-save to localStorage with debounce (only for drafts)
  useEffect(() => {
    if (isLoading || proposal.shortId) return; // Don't auto-save to localstorage if it's from API

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proposal));
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [proposal, isLoading]);

  const updateProposal = useCallback((updates: Partial<ProposalData>) => {
    setProposal(prev => ({ ...prev, ...updates }));
  }, []);

  const updateLineItem = useCallback((id: string, updates: Partial<ProposalData['lineItems'][0]>) => {
    setProposal(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  }, []);

  const addLineItem = useCallback((type: 'product' | 'service' | 'function' = 'product') => {
    setProposal(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: uuidv4(), description: '', quantity: 1, rate: 0, type, isNegotiable: true },
      ],
    }));
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setProposal(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }));
  }, []);

  const generateShareUrl = useCallback(async () => {
    setIsSaving(true);
    try {
      if (proposal.shortId) {
        // Update existing
        const res = await fetch(`/api/quotes/${proposal.shortId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proposal)
        });
        const data = await res.json();
        if (!data.success) {
          if (data.error === 'Quote not found' || res.status === 404) {
            updateProposal({ shortId: undefined });
            throw new Error('Quote not found in database (it may have been deleted). We have reset your link state. Please click Share again to create a new link.');
          }
          throw new Error(data.error || 'Failed to update quote');
        }
        const url = `${window.location.origin}${window.location.pathname}?id=${proposal.shortId}`;
        setShareUrl(url);
        return url;
      } else {
        // Create new
        const res = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proposal)
        });
        const data = await res.json();
        
        if (data.success && data.quote) {
          setProposal(data.quote);
          const url = `${window.location.origin}${window.location.pathname}?id=${data.quote.shortId}`;
          setShareUrl(url);
          return url;
        } else {
          throw new Error(data.error || 'Failed to create quote');
        }
      }
    } catch (error) {
      console.error('Failed to generate share URL:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [proposal]);
  
  const submitNegotiation = useCallback(async (role: 'creator' | 'client', action: 'agree' | 'negotiate') => {
    if (!proposal.shortId) return false;
    setIsSaving(true);
    try {
      const updates: Partial<ProposalData> = {
        lastModifiedBy: role,
        status: action === 'agree' ? (proposal.status === 'shared' ? 'negotiating' : 'agreed') : 'negotiating'
      };
      
      if (role === 'creator') updates.creatorAgreed = action === 'agree';
      if (role === 'client') updates.clientAgreed = action === 'agree';
      
      // If both agreed, set status to agreed
      if ((role === 'creator' && action === 'agree' && proposal.clientAgreed) || 
          (role === 'client' && action === 'agree' && proposal.creatorAgreed)) {
        updates.status = 'agreed';
      } else if (action === 'negotiate') {
        // If one negotiated, reset the other's agreement
        if (role === 'creator') updates.clientAgreed = false;
        if (role === 'client') updates.creatorAgreed = false;
      }
      
      const merged = { ...proposal, ...updates };
      
      const res = await fetch(`/api/quotes/${proposal.shortId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      
      const data = await res.json();
      if (data.success) {
        setProposal(data.quote);
        return true;
      }
      console.error('API Error:', data.error);
      return false;
    } catch (error) {
      console.error('Failed to submit negotiation:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [proposal]);

  const reset = useCallback(() => {
    setProposal({ ...DEFAULT_PROPOSAL, id: uuidv4() });
    localStorage.removeItem(STORAGE_KEY);
    setShareUrl('');
  }, []);

  return {
    proposal,
    isLoading,
    isSaving,
    shareUrl,
    updateProposal,
    updateLineItem,
    addLineItem,
    removeLineItem,
    generateShareUrl,
    submitNegotiation,
    reset,
  };
}
