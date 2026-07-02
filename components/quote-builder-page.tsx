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
    <div className="min-h-screen bg-[var(--color-canvas-light)] relative flex flex-col p-2 lg:p-4 font-sans overflow-hidden">
      
      {/* Atmospheric Lighting Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent-jade)]/20 blur-[180px] mix-blend-normal animate-atmos-1"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-[var(--color-accent-moonstone)]/15 blur-[180px] mix-blend-normal animate-atmos-2"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-[var(--color-accent-glacier)]/20 blur-[150px] mix-blend-normal animate-atmos-1" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Glass App Window */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto h-[calc(100vh-2rem)] flex flex-col glass-card">
        
        {/* Header */}
        <header className="border-b border-white/25 glass-secondary z-30 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/">
              <button className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all font-medium">
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </Link>
            
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Quote Builder</h1>
              {proposal.status && (
                <span className={`glass-badge mt-2 ${
                  proposal.status === 'agreed' ? 'text-green-600' :
                  proposal.status === 'negotiating' ? 'text-orange-600' :
                  proposal.status === 'shared' ? 'text-[var(--color-accent-highlight)]' :
                  'text-[var(--color-text-secondary)]'
                }`}>
                  {proposal.status}
                </span>
              )}
            </div>
            
            {/* Role Switcher */}
            <div className="flex glass-secondary rounded-[22px] p-1 shadow-inner border-t-0">
              <button
                onClick={() => handleRoleChange('creator')}
                className={`px-5 py-2 text-sm rounded-[18px] transition-all duration-300 font-semibold ${role === 'creator' ? 'glass-primary shadow-sm text-[var(--color-accent-highlight)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
              >
                Creator
              </button>
              <button
                onClick={() => handleRoleChange('client')}
                className={`px-5 py-2 text-sm rounded-[18px] transition-all duration-300 font-semibold ${role === 'client' ? 'glass-primary shadow-sm text-[var(--color-accent-highlight)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
              >
                Client
              </button>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex justify-center pt-6 pb-2 px-6">
          <div className="glass-secondary rounded-full px-6 py-3 flex flex-col sm:flex-row items-center justify-center gap-6 w-auto shadow-glass border border-white/20">
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
                <div className="w-px h-8 bg-white/20 hidden sm:block" />
                <a href={`mailto:?subject=Proposal%20${proposal.proposalNumber}&body=Here%20is%20your%20proposal%20link:%20${shareUrl}`} className="glass-button text-[var(--color-accent-highlight)]">
                  <Mail className="w-4 h-4 mr-2" /> Email Link
                </a>
              </>
            )}
          </div>
        </div>

        {/* Negotiation UI */}
        {proposal.shortId && proposal.status !== 'agreed' && (
          <div className="glass-secondary border-b border-orange-200/30 px-6 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">Negotiation in Progress</h3>
                <p className="text-[var(--color-text-secondary)] font-medium mt-1">
                  {proposal.lastModifiedBy === role ? "Waiting for the other party to respond." : "The other party has made changes or is waiting for your approval."}
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  className="glass-button text-[var(--color-accent-highlight)] opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => submitNegotiation(role, 'negotiate')}
                  disabled={isSaving || proposal.lastModifiedBy === role}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Counter Offer
                </button>
                <button 
                  className="glass-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => submitNegotiation(role, 'agree')}
                  disabled={isSaving || (role === 'creator' && proposal.creatorAgreed) || (role === 'client' && proposal.clientAgreed)}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {role === 'creator' && proposal.clientAgreed ? 'Finalize Deal' : role === 'client' && proposal.creatorAgreed ? 'Finalize Deal' : 'I Agree to these Terms'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {proposal.status === 'agreed' && (
          <div className="glass-primary bg-[var(--color-accent-jade)]/20 border-b border-[var(--color-accent-jade)]/30 text-emerald-800 px-6 py-5 text-center">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
              <CheckCircle className="w-7 h-7" />
              <h2 className="text-2xl font-extrabold tracking-tight">AGREED AND DEAL DONE</h2>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="glass-secondary border-b border-white/20 flex px-6 justify-center">
          <div className="max-w-7xl mx-auto flex gap-12">
            <button
              onClick={() => setPreviewTab('preview')}
              className={`py-5 font-bold tracking-wide text-sm transition-all duration-300 relative ${previewTab === 'preview' ? 'text-[var(--color-accent-highlight)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
            >
              Document View
              {previewTab === 'preview' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-accent-highlight)] rounded-t-full shadow-[0_0_10px_rgba(62,122,140,0.5)] animate-float"></div>}
            </button>
            <button
              onClick={() => setPreviewTab('flow')}
              className={`py-5 font-bold tracking-wide text-sm transition-all duration-300 relative ${previewTab === 'flow' ? 'text-[var(--color-accent-highlight)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
            >
              Architecture
              {previewTab === 'flow' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-accent-highlight)] rounded-t-full shadow-[0_0_10px_rgba(62,122,140,0.5)] animate-float"></div>}
            </button>
            {role === 'creator' && (
              <button
                onClick={() => setPreviewTab('items')}
                className={`py-5 font-bold tracking-wide text-sm transition-all duration-300 relative lg:hidden ${previewTab === 'items' ? 'text-[var(--color-accent-highlight)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
              >
                Edit
                {previewTab === 'items' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-accent-highlight)] rounded-t-full shadow-[0_0_10px_rgba(62,122,140,0.5)] animate-float"></div>}
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row w-full gap-4 p-4 sm:p-6 lg:p-8">
          
          {/* Creator Sidebar */}
          {role === 'creator' && (
            <div className={`lg:flex lg:w-[450px] overflow-y-auto ${isMobile && previewTab !== 'items' ? 'hidden' : 'flex'}`}>
              <ProposalBuilderSidebar
                proposal={proposal}
                onUpdate={updateProposal}
                onUpdateLineItem={updateLineItem}
                onAddLineItem={addLineItem}
                onRemoveLineItem={removeLineItem}
              />
            </div>
          )}

          {/* Client Sidebar for Negotiation */}
          {role === 'client' && proposal.status !== 'agreed' && (
            <div className={`lg:flex lg:w-[450px] glass-panel overflow-y-auto p-8 ${isMobile && previewTab !== 'items' ? 'hidden' : 'flex'} flex-col custom-scrollbar`}>
              <div className="space-y-8 w-full">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Adjust Proposal</h3>
                  <p className="text-[var(--color-text-secondary)] mt-2 text-sm leading-relaxed">Modify quantities or remove negotiable items to build a plan that works for you.</p>
                </div>
                
                <div className="space-y-8">
                  <div className="glass-primary p-4 rounded-[24px]">
                    <h4 className="text-sm font-bold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wider">Features & Pricing</h4>
                    <LineItemsEditor 
                      items={proposal.lineItems}
                      currency={proposal.currency}
                      onUpdateItem={updateLineItem}
                      onAddItem={addLineItem}
                      onRemoveItem={removeLineItem}
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Counter Offer Notes</h4>
                    <textarea 
                      className="w-full h-32 p-4 rounded-[16px] bg-white/50 border border-white/20 text-sm text-[var(--color-text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-highlight)]"
                      placeholder="Add any notes, conditions, or reasoning for your counter offer here..."
                      value={proposal.notes}
                      onChange={(e) => updateProposal({ notes: e.target.value })}
                    />
                  </div>
                </div>
                
                <button 
                  className="glass-button-primary w-full mt-6 h-16 text-lg font-bold" 
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
              <div id="proposal-preview" className="mx-auto max-w-4xl glass-primary rounded-[32px] overflow-hidden p-2 shadow-glass animate-glass-float" style={{ animationDuration: '8s' }}>
                <div className="bg-white rounded-[24px] overflow-hidden">
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
