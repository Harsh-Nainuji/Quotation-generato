import mongoose from 'mongoose';

const LineItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, default: '' },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  type: { type: String, enum: ['product', 'service', 'function'], default: 'product' },
  isNegotiable: { type: Boolean, default: true },
  level: { type: Number, default: 1 }
});

const QuoteSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  clientName: { type: String, default: '' },
  companyName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  proposalNumber: { type: String, default: '' },
  date: { type: String, default: '' },
  dueDate: { type: String, default: '' },
  description: { type: String, default: '' },
  lineItems: [LineItemSchema],
  notes: { type: String, default: '' },
  taxRate: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  
  // Negotiation tracking
  status: { type: String, enum: ['draft', 'shared', 'negotiating', 'agreed'], default: 'draft' },
  creatorAgreed: { type: Boolean, default: false },
  clientAgreed: { type: Boolean, default: false },
  lastModifiedBy: { type: String, enum: ['creator', 'client'], default: 'creator' },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

export default mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);
