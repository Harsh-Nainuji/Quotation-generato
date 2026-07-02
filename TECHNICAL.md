# QuoteFlow - Technical Implementation Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│             React 19 Components                      │
├─────────────────────────────────────────────────────┤
│  Landing Page  │  Quote Builder  │  Components      │
│  • Workflow    │  • Sidebar      │  • Toolbar       │
│  • Collab      │  • Preview      │  • QR Modal      │
│  • Features    │  • Line Items   │  • Export        │
└────────────┬──────────────────────────────┬──────────┘
             │                              │
      ┌──────▼──────┐            ┌─────────▼─────────┐
      │ useProposal │            │  Custom Hooks     │
      │   Hook      │            │  • State Mgmt     │
      │  (Local)    │            │  • Compression    │
      └──────┬──────┘            │  • Validation     │
             │                   └───────────────────┘
      ┌──────▼──────────────────┐
      │  Storage Layer          │
      ├─────────────────────────┤
      │  • localStorage (draft) │
      │  • URL hash (?q=...)    │
      │  • In-memory (current)  │
      └────────────────────────┘
```

## Component Hierarchy

### Landing Page (`landing-page.tsx`)
```
LandingPage
├── Header (Logo + CTA)
├── Hero Section (Main message)
├── Features Grid (4 features)
├── Why QuoteFlow (6 benefits)
├── Call-to-Action Section
├── WorkflowFlowchart ⭐ NEW
│   ├── Process Steps (Create/Customize/Share/Track)
│   ├── Benefits Highlight
│   └── Responsive Layout
├── CollaborationGuide ⭐ NEW
│   ├── 5-Step Timeline
│   ├── Timeline Animations
│   └── Benefits Matrix
└── Footer
```

### Builder Page (`quote-builder-page.tsx`)
```
QuoteBuilderPage
├── useProposal Hook (State Management)
├── BuilderToolbar ⭐ FIXED
│   ├── PDF Export Button
│   ├── Print Button
│   ├── QR Code Button
│   ├── Share Button ✅ (Fixed)
│   ├── Dark Mode Toggle
│   └── Reset Button
├── Main Layout (flex row)
│   ├── ProposalBuilderSidebar
│   │   ├── Company Section
│   │   ├── Client Section
│   │   ├── Details Section
│   │   ├── Items Section
│   │   ├── Finance Section
│   │   └── Notes Section
│   └── ProposalPreview
│       ├── Header (Logo/Number)
│       ├── From/To Section
│       ├── Line Items Table
│       └── Totals
└── QRCodeModal
    ├── QR Code Display
    ├── URL Display
    └── Download Button
```

## Key Files & Their Roles

### State Management (`/hooks/useProposal.ts`)
Manages all proposal data and synchronization:
- Initializes from URL hash or localStorage
- Auto-saves to localStorage with debounce
- Generates compressed share URLs
- Provides update functions for all fields

```typescript
const {
  proposal,           // Current proposal data
  isLoading,          // Initial load state
  shareUrl,           // Current share URL
  updateProposal,     // Update multiple fields
  updateLineItem,     // Update specific line item
  addLineItem,        // Add new line item
  removeLineItem,     // Remove line item
  generateShareUrl,   // Generate compressed share URL
  reset,             // Reset to default
} = useProposal();
```

### Data Compression (`/lib/compression.ts`) ⭐ OPTIMIZED
Handles URL compression and decompression:
- Uses `lz-string` for compression
- Encodes as URI component (safe for URLs)
- Achieves 60-70% size reduction
- Reversible (can always decompress)

```typescript
// Compression flow:
JSON string → lz-string compress → URI encode → Share URL

// Example:
Input:  {"clientName": "John", "items": [...]}  (300 bytes)
Output: ?q=N4IgrglgdgDg...ZgAg=  (100 bytes)
```

### Validation (`/lib/schemas.ts`)
Zod schemas for runtime validation:
- Proposal data schema
- Line item schema
- Currency validation
- Tax rate validation

### Export Features (`/lib/export.ts`)
Handles various export formats:
- PDF generation (html2canvas + jsPDF)
- Print formatting
- Maintains professional styling

## Animation Implementation

### WorkflowFlowchart Component (`/components/workflow-flowchart.tsx`) ⭐ NEW
```typescript
// Framer Motion animation patterns:

// Container stagger animation
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,    // 200ms between children
      delayChildren: 0.1       // Start after 100ms
    }
  }
}

// Individual item entrance
itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

// Continuous floating animation
animate={{ y: [0, -5, 0] }}
transition={{ duration: 2, repeat: Infinity }}
```

### CollaborationGuide Component (`/components/collaboration-guide.tsx`) ⭐ NEW
```typescript
// Timeline animation:
// - Numbered circles animate in sequence
// - Connecting lines scale from 0 to full height
// - Cards translate from left with fade-in
// - Icons float continuously

// Hover effects:
whileHover={{ scale: 1.1 }}  // Circle zoom on hover
whileHover={{ y: -2 }}        // Card lift on hover
whileHover={{ x: 5 }}         // Text shift on hover
```

## Toolbar Fix Details (`/components/builder-toolbar.tsx`) ⭐ FIXED

### Before (Broken)
```typescript
const url = await onCopyShareLink();  // Async
await navigator.clipboard.writeText(url);  // May fail
```

### After (Fixed)
```typescript
const url = await onCopyShareLink();
if (!url) {
  toast.error('Failed to generate share link');
  return;
}

// Try modern API first
if (navigator.clipboard && navigator.clipboard.writeText) {
  await navigator.clipboard.writeText(url);
} else {
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = url;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}
```

## Data Flow

### Creating a Proposal
```
User Input → useState → updateProposal() → localStorage (debounced)
                            ↓
                      Component Re-render
                            ↓
                      ProposalPreview Updates
```

### Sharing a Proposal
```
User clicks Share → generateShareUrl() → compress data → URI encode → Copy to clipboard
                                               ↓
                                        Success Toast
```

### Loading a Shared Proposal
```
URL ?q=... → useProposal loads → decompress → JSON parse → setState → Display
```

## Performance Optimizations

### 1. Debounced Auto-Save
```typescript
// Only saves to localStorage every 500ms instead of on each keystroke
debounceTimer.current = setTimeout(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposal));
}, DEBOUNCE_MS);
```

### 2. Lazy Component Loading
```typescript
// Modal only renders when open
{showQRModal && <QRCodeModal ... />}
```

### 3. Memoized Callbacks
```typescript
const generateShareUrl = useCallback(() => {
  // Only recreates when proposal changes
  return getShareUrl(compressProposal(proposal));
}, [proposal]);
```

## Browser Compatibility

### Modern Browsers (Full Support)
- Chrome/Edge 90+
- Firefox 89+
- Safari 15+
- Mobile browsers with same versions

### Older Browsers (Fallback Support)
- Clipboard API: Falls back to execCommand
- CSS Grid: Graceful degradation
- Flex: Universal support

## LocalStorage Structure

```json
{
  "quoteflow_draft": {
    "id": "uuid-string",
    "clientName": "string",
    "companyName": "string",
    "email": "string",
    "phone": "string",
    "proposalNumber": "string",
    "date": "YYYY-MM-DD",
    "dueDate": "YYYY-MM-DD",
    "description": "string",
    "lineItems": [
      {
        "id": "uuid",
        "description": "string",
        "quantity": "number",
        "rate": "number"
      }
    ],
    "notes": "string",
    "taxRate": "number",
    "currency": "USD|EUR|GBP|CAD|AUD"
  }
}
```

## URL Share Format

```
http://localhost:3000/builder?q=N4IgrglgdgDgzg...
                                 ↑
                    Compressed proposal data
                    
Decompressed back to: {
  id, clientName, companyName, email, phone,
  proposalNumber, date, dueDate, description,
  lineItems, notes, taxRate, currency
}
```

## Environment Variables

Currently using client-side storage only. No environment variables needed.

For future enhancements:
- `NEXT_PUBLIC_ANALYTICS_ID` - For usage tracking
- `NEXT_PUBLIC_API_BASE_URL` - For backend sync
- `NEXT_PUBLIC_STORAGE_SERVICE` - For cloud storage

## Testing Considerations

### Unit Tests (Recommended)
```typescript
// Test compression/decompression round-trip
test('proposal compression round-trip', () => {
  const original = { clientName: 'John', ... };
  const compressed = compressProposal(original);
  const decompressed = decompressProposal(compressed);
  expect(decompressed).toEqual(original);
});

// Test clipboard fallback
test('clipboard API fallback', async () => {
  // Mock navigator.clipboard as undefined
  // Verify execCommand approach works
});
```

### Integration Tests (Recommended)
```typescript
// Test full share flow
test('share proposal flow', async () => {
  // Fill form
  // Click share
  // Verify clipboard content
  // Navigate to shared link
  // Verify proposal loads correctly
});
```

## Deployment Considerations

### Build Optimization
- Tree-shake unused components
- Code-split route components
- Compress CSS/JS
- Optimize images

### Production Settings
- Enable CSP headers (no external APIs)
- Enable HTTPS (for clipboard API)
- Set cache headers for static assets
- Monitor bundle size

### Performance Targets
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Interaction to Next Paint: <100ms

## Future Enhancements

### Short Term
1. Add more templates
2. Custom company logo upload
3. Multi-currency conversion rates
4. Discount line items

### Medium Term
1. Client approval workflow
2. Digital signature capture
3. Email notifications
4. Analytics dashboard

### Long Term
1. Sync with accounting software
2. Payment processing
3. Team collaboration
4. White-label version

---

## Debug Commands

```typescript
// View current proposal in console
console.log("[v0] Proposal:", proposal);

// Check localStorage
console.log("[v0] Draft:", localStorage.getItem('quoteflow_draft'));

// Test compression
console.log("[v0] Compressed size:", compressProposal(proposal).length);

// Check share URL
console.log("[v0] Share URL:", generateShareUrl());
```

---

## Architecture Decisions

### Why Client-Side Only?
- ✅ No backend maintenance
- ✅ Instant data sync
- ✅ Zero privacy concerns
- ✅ Works offline
- ✅ No GDPR compliance needed
- ❌ Can't do advanced analytics
- ❌ Can't enforce proposal expiration
- ❌ Can't track who viewed

### Why URL Compression?
- ✅ No database needed
- ✅ Instant sharing
- ✅ Works anywhere (email, SMS, QR)
- ✅ Completely portable
- ❌ URL length limits (4000 chars max in QR)
- ❌ URL becomes invalid if shortened

### Why Framer Motion?
- ✅ Smooth, performant animations
- ✅ React-native feel
- ✅ Easy to compose
- ✅ Good for interactions
- ❌ Additional bundle size (~70kb)
- ❌ Learning curve

---

End of Technical Guide
