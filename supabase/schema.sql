-- Run this script in Supabase SQL Editor
-- It creates CRM tables and admin-only RLS policies.

create extension if not exists "pgcrypto";

create table if not exists public.crm_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.crm_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  address text,
  city text,
  tags text[] not null default '{}',
  notes text not null default '',
  total_orders integer not null default 0,
  total_spent numeric(12, 2) not null default 0,
  last_order_date timestamptz,
  join_date timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive', 'vip')),
  source text not null default 'organic' check (source in ('organic', 'referral', 'social', 'ads', 'other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, email)
);

create table if not exists public.crm_orders (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_email text not null,
  items jsonb not null default '[]'::jsonb,
  shipping_info jsonb not null default '{}'::jsonb,
  payment_method text not null check (payment_method in ('card', 'paypal', 'oxxo')),
  subtotal numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  tax numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  tracking_number text
);

create table if not exists public.crm_automations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  trigger text not null check (trigger in ('new_order', 'abandoned_cart', 'birthday', 'inactive', 'price_drop')),
  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_run timestamptz,
  run_count integer not null default 0
);

create table if not exists public.crm_campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  subject text not null,
  content text not null,
  recipients text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'sending', 'sent')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  open_rate numeric(5, 2),
  click_rate numeric(5, 2),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_crm_customers_updated_at on public.crm_customers;
create trigger trg_crm_customers_updated_at
before update on public.crm_customers
for each row execute function public.set_updated_at();

alter table public.crm_users enable row level security;
alter table public.crm_customers enable row level security;
alter table public.crm_orders enable row level security;
alter table public.crm_automations enable row level security;
alter table public.crm_campaigns enable row level security;

drop policy if exists "crm_users_admin_only" on public.crm_users;
create policy "crm_users_admin_only"
  on public.crm_users
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "crm_customers_admin_only" on public.crm_customers;
create policy "crm_customers_admin_only"
  on public.crm_customers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "crm_orders_admin_only" on public.crm_orders;
create policy "crm_orders_admin_only"
  on public.crm_orders
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "crm_automations_admin_only" on public.crm_automations;
create policy "crm_automations_admin_only"
  on public.crm_automations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "crm_campaigns_admin_only" on public.crm_campaigns;
create policy "crm_campaigns_admin_only"
  on public.crm_campaigns
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
