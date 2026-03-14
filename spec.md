# Women's Garment Cutting Patterns

## Current State
App has: Pattern Generator, Cost Calculator, Orders, Customers, Admin Panel.
Backend supports: garments, patterns, orders (CRUD + status), customers (CRUD).

## Requested Changes (Diff)

### Add
- **Made-to-Order tab**: Production queue for custom orders. Each entry tracks garment, customer measurements, delivery deadline, priority, and production status (Queued / Cutting / Stitching / Quality Check / Ready). Shows overstock-free summary (only produce what's ordered).
- **D2C Catalog tab**: Brand catalog where you list garment products with name, description, price (INR), fabric type, sizes available, and in-stock status. Supports add/edit/delete. Represents direct-to-consumer product listings.
- **Subscriptions tab**: Manage subscription plans (Monthly/Quarterly/Yearly) for fashion services. Each plan has name, description, price, billing cycle, and list of included services. Manage subscribers: name, phone, plan, start date, status (Active/Paused/Cancelled).

### Modify
- App.tsx: Add 3 new tabs (Made-to-Order, D2C Catalog, Subscriptions) alongside existing tabs.

### Remove
- Nothing removed.

## Implementation Plan
1. Generate Motoko backend with new types: MadeToOrderItem, CatalogProduct, SubscriptionPlan, Subscriber.
2. Add backend methods: CRUD for catalog products, subscription plans, subscribers; made-to-order queue CRUD with production status.
3. Update backend.d.ts with new interfaces.
4. Update useQueries.ts with new hooks.
5. Create MadeToOrderQueue.tsx, D2CCatalog.tsx, SubscriptionManager.tsx components.
6. Add 3 new tabs to App.tsx.
