# KARNI IMPEX - Garment ERP System

## Current State
Existing app: Women's Garment Cutting Patterns with Pattern Generator, Cost Calculator, Orders, Customers, Made-to-Order, D2C Catalog, Subscriptions, Admin Panel.

## Requested Changes (Diff)

### Add
- **Dashboard**: Summary cards for orders, fabric stock, pending jobs, revenue, karigar count, recent activity feed
- **Photo Master**: Photo gallery to upload and manage design/sample photos with labels
- **Marker Planning**: Fabric marker layout planner - enter fabric width, lengths, garment count, calculate marker efficiency
- **KARNI IMPEX**: Company profile page with logo, address, GST number, contact info, bank details (used in bills/challans)
- **Design Register**: Design catalog with design number, name, category, season, fabric type, photo reference
- **Dyeing Job / Design Master**: Dyeing job card - fabric lot, color, dyer name, quantity, status, challan
- **Production Plan**: Production planning with style, quantity, delivery date, assigned karigar, stages
- **Fabric Purchase**: Purchase entries - vendor, fabric type, meters, rate, total, invoice number
- **Fabric Stock**: Current stock ledger - fabric type, color, available meters, reserved, issued
- **Fabric Issue**: Issue fabric to jobs - fabric type, meters issued, job reference, date
- **Print Job**: Print job card - design number, fabric, printer name, quantity, status, challan
- **Embroidery Job**: Embroidery job card - design, fabric, embroider name, quantity, rate, status, challan
- **Handwork Job**: Handwork job card - type, fabric, karigar, quantity, rate, status, challan
- **Cutting Job**: Cutting job card - style, fabric, cutter, layers, pieces count, status, challan
- **Stitching Job**: Stitching job card - style, tailor, quantity, rate, status, challan
- **Quality Check**: QC log - job reference, inspector, pass/fail count, remarks
- **Pressing**: Pressing job card - style, presser, quantity, status, challan
- **Packing**: Packing job card - style, packer, quantity, boxes, status, challan
- **Dispatch**: Dispatch record - buyer, quantity, transport, tracking, status
- **Karigar Ledger**: Worker account - karigar name, job entries, payments, balance
- **Account Ledger**: General ledger - debit/credit entries, balance
- **Pattern Planning AI**: Smart pattern calculator - input measurements, garment type, get optimized pattern seam allowances and layout suggestions
- **Fabric Consumption AI**: Smart fabric consumption estimator - garment type, sizes, quantity → fabric meters needed
- **BILL GST**: GST invoice generator with company details, line items, GST calculation, print/PDF
- **CHALLAN**: Challan generator available at every job - job type, party, items, print/PDF
- **P/L Account**: Profit & Loss statement - income vs expenses summary
- **Print to PDF**: Browser print for all bills, challans, and reports
- **Social Media**: Generate social media post content (text + share image preview) for new collections/designs

### Modify
- App branding: rename to KARNI IMPEX ERP
- Navigation: replace tab bar with sidebar navigation for better usability with many modules
- Keep all existing features (Pattern Generator, Cost Calculator, Orders, Customers, MTO, D2C, Subscriptions, Admin)

### Remove
- Nothing removed (backward compatible)

## Implementation Plan
1. Generate new Motoko backend with all new data types and CRUD APIs
2. Restructure App.tsx with sidebar navigation
3. Create new component files for each module
4. Implement Challan and Bill GST with print-friendly layouts
5. Implement PDF/Print using window.print() with print CSS
6. Social Media: text template generator + copy-to-clipboard share
