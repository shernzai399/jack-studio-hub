create type app_role as enum (
  'store_staff',
  'store_manager',
  'hub_admin',
  'inventory_admin',
  'super_admin'
);

create type service_order_status as enum (
  'New Request',
  'Waiting Review',
  'Quotation Sent',
  'Customer Approved',
  'Waiting Item Drop Off',
  'In Progress',
  'Waiting Parts',
  'Ready For Collection',
  'Completed',
  'Cancelled'
);

create type store_request_status as enum (
  'New Request',
  'Under Review',
  'Approved',
  'Rejected',
  'Waiting Stock',
  'Processing',
  'Sent Out',
  'Received by Store',
  'Completed'
);

create type store_request_type as enum (
  'replenishment',
  'stock_transfer',
  'new_product',
  'backorder',
  'special_product'
);

create type payment_status as enum (
  'unpaid',
  'deposit_paid',
  'paid',
  'refunded',
  'waived'
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  address text,
  phone text,
  is_hub boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  store_id uuid references public.stores(id),
  full_name text not null,
  email text not null unique,
  role app_role not null default 'store_staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  preferred_contact text default 'whatsapp',
  created_at timestamptz not null default now()
);

create table public.service_orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  customer_id uuid not null references public.customers(id),
  store_id uuid not null references public.stores(id),
  service_type text not null check (service_type in ('luggage_repair', 'leather_care', 'handcraft', 'engraving_customization')),
  item_brand text,
  item_model text,
  item_color text,
  item_description text not null,
  issue_description text not null,
  requested_work text,
  quotation_amount numeric(12,2),
  quotation_notes text,
  payment_status payment_status not null default 'unpaid',
  status service_order_status not null default 'New Request',
  expected_completion_date date,
  assigned_to uuid references public.users(id),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_photos (
  id uuid primary key default gen_random_uuid(),
  service_order_id uuid not null references public.service_orders(id) on delete cascade,
  storage_path text not null,
  caption text,
  uploaded_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  category text,
  brand text default 'JACK STUDIO',
  unit_cost numeric(12,2),
  retail_price numeric(12,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  product_id uuid not null references public.products(id),
  quantity_on_hand integer not null default 0,
  quantity_reserved integer not null default 0,
  reorder_level integer not null default 3,
  updated_at timestamptz not null default now(),
  unique (store_id, product_id)
);

create table public.store_requests (
  id uuid primary key default gen_random_uuid(),
  request_no text not null unique,
  request_type store_request_type not null,
  from_store_id uuid references public.stores(id),
  to_store_id uuid references public.stores(id),
  status store_request_status not null default 'New Request',
  reason text not null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'urgent')),
  hq_notes text,
  approved_by uuid references public.users(id),
  requested_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.store_request_items (
  id uuid primary key default gen_random_uuid(),
  store_request_id uuid not null references public.store_requests(id) on delete cascade,
  product_id uuid references public.products(id),
  sku text,
  product_name text not null,
  requested_quantity integer not null check (requested_quantity > 0),
  approved_quantity integer check (approved_quantity >= 0),
  notes text
);

create table public.backorders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  store_id uuid not null references public.stores(id),
  product_id uuid references public.products(id),
  store_request_id uuid references public.store_requests(id),
  quantity integer not null check (quantity > 0),
  customer_deposit numeric(12,2) default 0,
  status text not null default 'open' check (status in ('open', 'ordered', 'arrived', 'collected', 'cancelled')),
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns app_role
language sql
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.current_user_store_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select store_id from public.users where id = auth.uid()
$$;

alter table public.users enable row level security;
alter table public.stores enable row level security;
alter table public.customers enable row level security;
alter table public.service_orders enable row level security;
alter table public.service_photos enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.store_requests enable row level security;
alter table public.store_request_items enable row level security;
alter table public.backorders enable row level security;

create policy "users can read active users"
on public.users for select
using (public.current_user_role() in ('store_manager', 'hub_admin', 'inventory_admin', 'super_admin'));

create policy "stores are visible to authenticated users"
on public.stores for select
using (auth.role() = 'authenticated');

create policy "customers visible by operations"
on public.customers for select
using (public.current_user_role() in ('store_staff', 'store_manager', 'hub_admin', 'super_admin'));

create policy "stores create customers"
on public.customers for insert
with check (public.current_user_role() in ('store_staff', 'store_manager', 'hub_admin', 'super_admin'));

create policy "service orders visible by store or hub"
on public.service_orders for select
using (
  public.current_user_role() in ('hub_admin', 'super_admin')
  or store_id = public.current_user_store_id()
);

create policy "service orders created by stores"
on public.service_orders for insert
with check (
  public.current_user_role() in ('store_staff', 'store_manager', 'hub_admin', 'super_admin')
  and (
    public.current_user_role() in ('hub_admin', 'super_admin')
    or store_id = public.current_user_store_id()
  )
);

create policy "service orders updated by store managers or hub"
on public.service_orders for update
using (
  public.current_user_role() in ('hub_admin', 'super_admin')
  or (
    public.current_user_role() = 'store_manager'
    and store_id = public.current_user_store_id()
  )
);

create policy "service photos visible with parent order"
on public.service_photos for select
using (
  exists (
    select 1 from public.service_orders so
    where so.id = service_order_id
    and (
      public.current_user_role() in ('hub_admin', 'super_admin')
      or so.store_id = public.current_user_store_id()
    )
  )
);

create policy "service photos uploaded by order users"
on public.service_photos for insert
with check (
  exists (
    select 1 from public.service_orders so
    where so.id = service_order_id
    and (
      public.current_user_role() in ('hub_admin', 'super_admin')
      or so.store_id = public.current_user_store_id()
    )
  )
);

create policy "products visible to authenticated users"
on public.products for select
using (auth.role() = 'authenticated');

create policy "products managed by inventory admins"
on public.products for all
using (public.current_user_role() in ('inventory_admin', 'super_admin'))
with check (public.current_user_role() in ('inventory_admin', 'super_admin'));

create policy "inventory visible by store or inventory admins"
on public.inventory for select
using (
  public.current_user_role() in ('inventory_admin', 'hub_admin', 'super_admin')
  or store_id = public.current_user_store_id()
);

create policy "inventory updated by inventory admins"
on public.inventory for update
using (public.current_user_role() in ('inventory_admin', 'super_admin'))
with check (public.current_user_role() in ('inventory_admin', 'super_admin'));

create policy "store requests visible by store or HQ"
on public.store_requests for select
using (
  public.current_user_role() in ('hub_admin', 'inventory_admin', 'super_admin')
  or from_store_id = public.current_user_store_id()
  or to_store_id = public.current_user_store_id()
);

create policy "store requests created by stores"
on public.store_requests for insert
with check (
  public.current_user_role() in ('store_staff', 'store_manager', 'inventory_admin', 'hub_admin', 'super_admin')
);

create policy "store requests updated by managers and HQ"
on public.store_requests for update
using (
  public.current_user_role() in ('store_manager', 'hub_admin', 'inventory_admin', 'super_admin')
);

create policy "request items visible with parent"
on public.store_request_items for select
using (
  exists (
    select 1 from public.store_requests sr
    where sr.id = store_request_id
    and (
      public.current_user_role() in ('hub_admin', 'inventory_admin', 'super_admin')
      or sr.from_store_id = public.current_user_store_id()
      or sr.to_store_id = public.current_user_store_id()
    )
  )
);

create policy "request items created with parent"
on public.store_request_items for insert
with check (
  exists (
    select 1 from public.store_requests sr
    where sr.id = store_request_id
    and (
      public.current_user_role() in ('hub_admin', 'inventory_admin', 'super_admin')
      or sr.from_store_id = public.current_user_store_id()
    )
  )
);

create policy "request items updated by HQ"
on public.store_request_items for update
using (public.current_user_role() in ('hub_admin', 'inventory_admin', 'super_admin'))
with check (public.current_user_role() in ('hub_admin', 'inventory_admin', 'super_admin'));

create policy "backorders visible by store or HQ"
on public.backorders for select
using (
  public.current_user_role() in ('hub_admin', 'inventory_admin', 'super_admin')
  or store_id = public.current_user_store_id()
);

create policy "backorders created by stores or HQ"
on public.backorders for insert
with check (
  public.current_user_role() in ('store_staff', 'store_manager', 'hub_admin', 'inventory_admin', 'super_admin')
  and (
    public.current_user_role() in ('hub_admin', 'inventory_admin', 'super_admin')
    or store_id = public.current_user_store_id()
  )
);

create index service_orders_store_status_idx on public.service_orders(store_id, status);
create index store_requests_status_idx on public.store_requests(status);
create index inventory_low_stock_idx on public.inventory(store_id, product_id) where quantity_on_hand <= reorder_level;

create view public.low_stock_inventory
with (security_invoker = true)
as
select
  inventory.*,
  products.sku,
  products.name as product_name,
  stores.name as store_name
from public.inventory
join public.products on products.id = inventory.product_id
join public.stores on stores.id = inventory.store_id
where inventory.quantity_on_hand <= inventory.reorder_level;
