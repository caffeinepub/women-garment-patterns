# Garment ERP CRM - KARNI IMPEX

## Current State
App has basic garment pattern generation, cost calculator, order management, customer measurement history, Made-to-Order queue, D2C Catalog, and Subscriptions. No ERP/production modules exist.

## Requested Changes (Diff)

### Add
- **Dashboard**: KPIs - active orders, pending jobs, fabric stock alerts, revenue summary, job-wise status chart
- **Photo Master**: Upload and tag design/style photos with garment type and color labels
- **Marker Planning**: Enter fabric width, lay length, number of plies; calculate fabric consumption per marker
- **KARNI IMPEX**: Company profile page - name, GST number, address, bank details, logo; used in all bills/challans
- **Design Register**: Register designs with design number, photo, fabric type, colors, season
- **Dyeing Job**: Create dyeing jobs with lot number, fabric quantity, color, karigar assignment; generate challan PDF
- **Production Plan**: Create production plans linking order, design, target quantity, timeline
- **Fabric Purchase**: Purchase entries - supplier, fabric type, quantity, rate, GST, invoice number
- **Fabric Stock**: View current fabric stock (auto-calculated from purchase minus issues)
- **Fabric Issue**: Issue fabric to jobs - job type, job number, fabric type, quantity issued
- **Print Job**: Print job with design, quantity, karigar; challan generation
- **Embroidery Job**: Embroidery job with design, quantity, karigar; challan generation
- **Handwork Job**: Handwork job assignment with karigar; challan generation
- **Cutting Job**: Cutting job with marker number, plies, quantity; challan generation
- **Stitching Job**: Stitching job with quantity, karigar; challan generation
- **Quality Check**: QC entries per job - pass/fail/rework count
- **Pressing**: Pressing job assignment with quantity; challan generation
- **Packing**: Packing job with carton count, quantity; challan generation
- **Dispatch**: Dispatch entry with buyer, quantity, vehicle, LR number
- **Karigar Ledger**: Per-karigar ledger showing all jobs, amounts paid/pending
- **Account Ledger**: Party-wise account ledger for fabric suppliers and buyers
- **Pattern Planning AI**: Rule-based suggestions for pattern grading, fabric layout optimization based on entered measurements and garment type
- **Fabric Consumption AI**: Calculate estimated fabric consumption based on garment type, sizes, quantities
- **GST Bill**: Generate GST invoice with party details, HSN codes, CGST/SGST/IGST
- **Challan**: Auto-generate job challans at every job creation (printable/PDF)
- **P/L Account**: Monthly profit & loss summary from purchases, job costs, sales
- **Print to PDF**: Every module's view/list should have a Print/PDF button
- **Social Media**: Post design photos to sharing links (copy caption + image for WhatsApp/Instagram manual sharing)

### Modify
- App navigation: Replace current tab structure with full sidebar ERP navigation grouped by section

### Remove
- Nothing removed; existing pattern generator kept as a tab

## Implementation Plan
1. Backend: Stable data types for all ERP entities (Company, Design, FabricPurchase, FabricStock, FabricIssue, Job types, Challan, GST Bill, Karigar, Account, Ledger entries)
2. Backend: CRUD operations for all entities
3. Backend: Computed queries (stock calculation, ledger balance, P/L)
4. Frontend: Sidebar navigation with section grouping
5. Frontend: All module pages with forms, lists, print/PDF capability
6. Frontend: Challan component reused across all job types
7. Frontend: Dashboard with live KPIs
8. Frontend: GST Bill and P/L report pages
