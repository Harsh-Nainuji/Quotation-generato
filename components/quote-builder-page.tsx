'use client';

import { useState, useCallback, useEffect } from 'react';
import { useProposal } from '@/hooks/useProposal';
import { ProposalBuilderSidebar } from './proposal-builder-sidebar';
import { ProposalPreview } from './proposal-preview';
import { LineItemsEditor } from './line-items-editor';
import { BuilderToolbar } from './builder-toolbar';
import { QRCodeModal } from './qr-code-modal';
import { QuoteNodeFlow } from './quote-node-flow';
import { exportToPDF, printProposal } from '@/lib/export';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronLeft, Save, CheckCircle, Mail, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { setCookie, getCookie } from 'cookies-next';

export function QuoteBuilderPage() {
  const {
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
  } = useProposal();

  const [showQRModal, setShowQRModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [previewTab, setPreviewTab] = useState<'preview' | 'items' | 'flow'>('preview');
  
  // Use a cookie to track role, defaulting to creator
  const [role, setRole] = useState<'creator' | 'client'>('creator');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check role from cookie or URL
    const savedRole = getCookie('quote_role') as 'creator' | 'client';
    const params = new URLSearchParams(window.location.search);
    const hasId = params.get('id');
    
    if (savedRole) {
      setRole(savedRole);
    } else if (hasId) {
      // If they open a shared link and have no role cookie, default to client
      setRole('client');
      setCookie('quote_role', 'client', { maxAge: 60 * 60 * 24 * 365 });
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRoleChange = (newRole: 'creator' | 'client') => {
    setRole(newRole);
    setCookie('quote_role', newRole, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    toast.success(`Switched to ${newRole} view`);
  };

  const handleExportPDF = useCallback(async () => {
    try {
      // html2canvas fails on modern oklch/lab CSS colors used by Tailwind.
      // Native window.print() paired with our new @media print CSS is much better!
      window.print();
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  }, []);

  const handlePrint = useCallback(() => {
    try {
      window.print();
    } catch (error) {
      toast.error('Failed to print proposal');
    }
  }, []);

  const handleGenerateQR = useCallback(async () => {
    try {
      const url = await generateShareUrl();
      if (url) {
        setShowQRModal(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate QR code');
    }
  }, [generateShareUrl]);

  const handleCopyShareLink = useCallback(async () => {
    try {
      const url = await generateShareUrl();
      if (!url) {
        throw new Error('Failed to generate URL');
      }
      return url;
    } catch (error: any) {
      console.error('Share link generation failed:', error);
      toast.error(error.message || 'Failed to generate share link');
      throw error;
    }
  }, [generateShareUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-canvas-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your proposal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] relative flex flex-col p-2 lg:p-4 font-sans overflow-hidden">
      
      {/* Main Hand-Drawn App Window */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto h-[calc(100vh-2rem)] flex flex-col hand-card overflow-hidden bg-white">
        
        {/* Header */}
        <header className="border-b-2 border-dashed border-[var(--color-pencil)] bg-[var(--color-paper)] z-30 px-6 py-4 relative">
          <div className="deco-tape"></div>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/">
              <button className="flex items-center gap-2 text-[var(--color-pencil)] font-heading font-bold text-lg hover:-translate-x-1 transition-transform">
                <ChevronLeft className="w-5 h-5 stroke-[3]" />
                <span>Back</span>
              </button>
            </Link>
            
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold font-heading text-[var(--color-pencil)] rotate-1">Quote Builder</h1>
              {proposal.status && (
                <span className={`glass-badge mt-2 ${
                  proposal.status === 'agreed' ? 'text-green-700 bg-green-100' :
                  proposal.status === 'negotiating' ? 'text-orange-700 bg-orange-100' :
                  proposal.status === 'shared' ? 'text-[var(--color-pen-blue)] bg-blue-100' :
                  'text-[var(--color-pencil)] bg-gray-200'
                }`}>
                  {proposal.status}
                </span>
              )}
            </div>
            
            {/* Role Switcher */}
            <div className="flex border-2 border-[var(--color-pencil)] rounded-xl overflow-hidden shadow-[2px_2px_0_0_#2d2d2d] bg-white -rotate-1">
              <button
                onClick={() => handleRoleChange('creator')}
                className={`px-4 py-1.5 text-sm font-bold font-heading border-r-2 border-[var(--color-pencil)] transition-colors ${role === 'creator' ? 'bg-[var(--color-marker-red)] text-white' : 'hover:bg-[var(--color-paper)]'}`}
              >
                Creator
              </button>
              <button
                onClick={() => handleRoleChange('client')}
                className={`px-4 py-1.5 text-sm font-bold font-heading transition-colors ${role === 'client' ? 'bg-[var(--color-marker-red)] text-white' : 'hover:bg-[var(--color-paper)]'}`}
              >
                Client
              </button>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex justify-center pt-6 pb-4 px-6 relative z-20">
          <div className="bg-[var(--color-postit)] border-2 border-[var(--color-pencil)] shadow-[4px_4px_0_0_#2d2d2d] px-6 py-3 flex flex-col sm:flex-row items-center justify-center gap-6 w-auto rotate-1" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
            <BuilderToolbar
              onExportPDF={handleExportPDF}
              onPrint={handlePrint}
              onGenerateQR={handleGenerateQR}
              onCopyShareLink={handleCopyShareLink}
              onReset={reset}
              shareUrl={shareUrl}
              isClient={role === 'client'}
            />
            {shareUrl && (
              <>
                <div className="w-0.5 h-8 bg-[var(--color-pencil)] hidden sm:block rotate-12" />
                <a href={`mailto:?subject=Proposal%20${proposal.proposalNumber}&body=Here%20is%20your%20proposal%20link:%20${shareUrl}`} className="hand-button-secondary py-2 px-4 text-sm -rotate-2">
                  <Mail className="w-4 h-4 mr-2" /> Email Link
                </a>
              </>
            )}
          </div>
        </div>

        {/* Negotiation UI */}
        {proposal.shortId && proposal.status !== 'agreed' && (
          <div className="bg-orange-100 border-b-2 border-dashed border-[var(--color-pencil)] px-6 py-5 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold font-heading text-[var(--color-pencil)] tracking-tight">Negotiation in Progress</h3>
                <p className="text-[var(--color-pencil)] text-lg mt-1 opacity-80">
                  {proposal.lastModifiedBy === role ? "Waiting for the other party to respond." : "The other party has made changes or is waiting for your approval."}
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  className="hand-button-secondary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => submitNegotiation(role, 'negotiate')}
                  disabled={isSaving || proposal.lastModifiedBy === role}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Counter Offer
                </button>
                <button 
                  className="hand-button text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => submitNegotiation(role, 'agree')}
                  disabled={isSaving || (role === 'creator' && proposal.creatorAgreed) || (role === 'client' && proposal.clientAgreed)}
                >
                  <CheckCircle className="w-5 h-5 mr-2 stroke-[3]" />
                  {role === 'creator' && proposal.clientAgreed ? 'Finalize Deal' : role === 'client' && proposal.creatorAgreed ? 'Finalize Deal' : 'I Agree to these Terms'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {proposal.status === 'agreed' && (
          <div className="bg-green-100 border-b-2 border-[var(--color-pencil)] text-green-800 px-6 py-5 text-center relative z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
              <CheckCircle className="w-8 h-8 stroke-[3]" />
              <h2 className="text-3xl font-heading font-extrabold tracking-tight rotate-1">AGREED AND DEAL DONE</h2>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b-2 border-dashed border-[var(--color-pencil)] bg-white flex px-6 justify-center relative z-10">
          <div className="max-w-7xl mx-auto flex gap-12">
            <button
              onClick={() => setPreviewTab('preview')}
              className={`py-4 font-heading font-bold tracking-wide text-xl transition-all duration-300 relative ${previewTab === 'preview' ? 'text-[var(--color-pen-blue)]' : 'text-[var(--color-pencil)]/60 hover:text-[var(--color-pencil)]'}`}
            >
              Document View
              {previewTab === 'preview' && <div className="absolute bottom-0 left-0 w-full h-2 scribble-underline opacity-80"></div>}
            </button>
            <button
              onClick={() => setPreviewTab('flow')}
              className={`py-4 font-heading font-bold tracking-wide text-xl transition-all duration-300 relative ${previewTab === 'flow' ? 'text-[var(--color-pen-blue)]' : 'text-[var(--color-pencil)]/60 hover:text-[var(--color-pencil)]'}`}
            >
              Architecture
              {previewTab === 'flow' && <div className="absolute bottom-0 left-0 w-full h-2 scribble-underline opacity-80"></div>}
            </button>
            {role === 'creator' && (
              <button
                onClick={() => setPreviewTab('items')}
                className={`py-4 font-heading font-bold tracking-wide text-xl transition-all duration-300 relative lg:hidden ${previewTab === 'items' ? 'text-[var(--color-pen-blue)]' : 'text-[var(--color-pencil)]/60 hover:text-[var(--color-pencil)]'}`}
              >
                Edit
                {previewTab === 'items' && <div className="absolute bottom-0 left-0 w-full h-2 scribble-underline opacity-80"></div>}
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row w-full gap-4 p-4 sm:p-6 lg:p-8">
          
          {/* Creator Sidebar */}
          {role === 'creator' && (
            <div className={`lg:flex lg:w-[450px] hand-card overflow-y-auto p-6 ${isMobile && previewTab !== 'items' ? 'hidden' : 'flex'} flex-col custom-scrollbar bg-[var(--color-paper)]`}>
              <div className="deco-tape"></div>
              <div className="w-full mt-4">
                <ProposalBuilderSidebar
                  proposal={proposal}
                  onUpdate={updateProposal}
                  onUpdateLineItem={updateLineItem}
                  onAddLineItem={addLineItem}
                  onRemoveLineItem={removeLineItem}
                />
              </div>
            </div>
          )}

          {/* Client Sidebar for Negotiation */}
          {role === 'client' && proposal.status !== 'agreed' && (
            <div className={`lg:flex lg:w-[450px] hand-card overflow-y-auto p-8 ${isMobile && previewTab !== 'items' ? 'hidden' : 'flex'} flex-col custom-scrollbar`}>
              <div className="deco-tape"></div>
              <div className="space-y-8 w-full mt-2">
                <div>
                  <h3 className="text-3xl font-heading font-extrabold text-[var(--color-pencil)] tracking-tight">Adjust Proposal</h3>
                  <p className="text-[var(--color-pencil)] mt-2 text-lg leading-relaxed opacity-80">Modify quantities or remove negotiable items to build a plan that works for you.</p>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-white border-[3px] border-[var(--color-pencil)] p-4 shadow-[4px_4px_0_0_#2d2d2d]" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
                    <h4 className="text-xl font-heading font-bold text-[var(--color-pencil)] mb-4">Features & Pricing</h4>
                    <LineItemsEditor 
                      items={proposal.lineItems}
                      currency={proposal.currency}
                      onUpdateItem={updateLineItem}
                      onAddItem={addLineItem}
                      onRemoveItem={removeLineItem}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-heading font-bold text-[var(--color-pencil)] mb-2">Counter Offer Notes</h4>
                    <textarea 
                      className="hand-input h-32 resize-none"
                      placeholder="Add any notes, conditions, or reasoning for your counter offer here..."
                      value={proposal.notes}
                      onChange={(e) => updateProposal({ notes: e.target.value })}
                    />
                  </div>
                </div>
                
                <button 
                  className="hand-button w-full mt-6 text-xl bg-[var(--color-postit)]" 
                  onClick={async () => {
                    const success = await submitNegotiation('client', 'negotiate');
                    if (success) {
                      const url = `${window.location.origin}${window.location.pathname}?id=${proposal.shortId}`;
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(url);
                      }
                      toast.success('Counter offer saved and link copied to clipboard!');
                    } else {
                      toast.error('Failed to save counter offer. Please try again.');
                    }
                  }}
                  disabled={isSaving}
                >
                  Save & Copy Counter Offer Link
                </button>
              </div>
            </div>
          )}

          {/* Preview Area */}
          <div className={`flex-1 overflow-y-auto bg-transparent custom-scrollbar ${isMobile && previewTab === 'items' ? 'hidden' : 'block'}`}>
            {previewTab === 'preview' && (
              <div id="proposal-preview" className="mx-auto max-w-4xl hand-card bg-white p-4 lg:p-8" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
                <div className="bg-white">
                  <ProposalPreview proposal={proposal} />
                </div>
              </div>
            )}
            
            {previewTab === 'flow' && (
              <div className="mx-auto w-full h-full min-h-[600px] glass-primary rounded-[32px] shadow-glass p-2 animate-glass-float" style={{ animationDuration: '9s' }}>
                <QuoteNodeFlow proposal={proposal} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* QR Code Modal */}
      <QRCodeModal
        open={showQRModal}
        onOpenChange={setShowQRModal}
        shareUrl={shareUrl}
        proposalNumber={proposal.proposalNumber}
      />
    </div>
  );
}
