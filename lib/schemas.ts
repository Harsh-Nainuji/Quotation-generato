import { z } from 'zod';

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  rate: z.number().nonnegative('Rate must be non-negative'),
});

export const proposalSchema = z.object({
  id: z.string(),
  clientName: z.string().min(1, 'Client name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone: z.string(),
  proposalNumber: z.string().min(1, 'Proposal number is required'),
  date: z.string(),
  dueDate: z.string(),
  description: z.string(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  notes: z.string(),
  taxRate: z.number().min(0).max(100),
  currency: z.string().default('USD'),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;
export type LineItemData = z.infer<typeof lineItemSchema>;
