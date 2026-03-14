# Women's Garment Cutting Patterns

## Current State
The app has:
- Pattern Generator: select garment, enter measurements, view pattern with cutting/fold lines, fabric estimation on virtual table, photo reference upload, ready-made sizes (S/M/L/XL)
- Admin Panel: add/edit/delete garment types and pattern pieces, import patterns via JSON/CSV
- Backend: garment CRUD, pattern calculation

## Requested Changes (Diff)

### Add
- **Fabric Cost Calculator**: input fabric price per meter, quantity required (from pattern), calculate total cost including waste %; support multiple fabric types
- **Order Management**: create orders with customer name, garment type, size/measurements, status (Pending/In Progress/Completed/Delivered); list/filter orders by status; update order status
- **Customer Measurement History**: save customer profiles with name, phone, and measurements (bust/waist/hip/length); view/edit/delete saved customers; load measurements into Pattern Generator directly

### Modify
- App.tsx: add 3 new tabs - Cost Calculator, Orders, Customers
- Navigation to include 5 tabs total

### Remove
- Nothing removed

## Implementation Plan
1. Backend: add Order type (id, customerName, garmentName, measurements, status, createdAt), Customer type (id, name, phone, measurements); CRUD for orders and customers
2. Frontend CostCalculator component: fabric type inputs, price/meter, quantity, waste % slider, total cost output
3. Frontend OrderManager component: create order form, order list with status badges, status update
4. Frontend CustomerManager component: add/edit customer profiles, load measurements button
5. Update App.tsx with 3 new tabs
