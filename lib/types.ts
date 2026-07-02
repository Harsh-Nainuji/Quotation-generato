export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  type?: 'product' | 'service' | 'function';
  isNegotiable?: boolean;
  level?: number;
}

export type QuoteStatus = 'draft' | 'shared' | 'negotiating' | 'agreed';

export interface ProposalData {
  id: string;
  shortId?: string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  proposalNumber: string;
  date: string;
  dueDate: string;
  description: string;
  lineItems: LineItem[];
  notes: string;
  taxRate: number;
  currency: string;
  
  // Negotiation tracking
  status?: QuoteStatus;
  creatorAgreed?: boolean;
  clientAgreed?: boolean;
  lastModifiedBy?: 'creator' | 'client';
  version?: number;
}
