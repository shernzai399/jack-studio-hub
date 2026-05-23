# API Routes

## Service Orders
- `GET /api/service-orders`: List service orders visible to the current role.
- `POST /api/service-orders`: Create customer and service order.
- `GET /api/service-orders/[id]`: Fetch detail, photos, customer, and timeline.
- `PATCH /api/service-orders/[id]`: Update quotation, payment status, assignment, or repair status.
- `POST /api/service-orders/[id]/photos`: Upload service photos to Supabase Storage.

## Store Requests
- `GET /api/store-requests`: List replenishment, transfer, new product, backorder, and special product requests.
- `POST /api/store-requests`: Create request and item rows.
- `GET /api/store-requests/[id]`: Fetch request detail and approval state.
- `PATCH /api/store-requests/[id]`: Approve, reject, process, send out, or mark received.

## Inventory
- `GET /api/inventory`: List inventory by role and store scope.
- `PATCH /api/inventory/[id]`: Update stock counts, reserved quantity, and reorder level.
- `GET /api/inventory/low-stock`: List rows where `quantity_on_hand <= reorder_level`.

## Admin
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/[id]`
- `GET /api/admin/stores`
