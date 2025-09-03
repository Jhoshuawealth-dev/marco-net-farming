-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==============
-- TABLES
-- ==============

-- Users Table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  country text not null,
  currency_code text not null,
  wallet_balance numeric not null default 0,
  zuka_balance numeric not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Keep updated_at current
create or replace function update_updated_at()
returns trigger as $$
begin
   new.updated_at = now();
   return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on users
for each row
execute procedure update_updated_at();

-- App Settings (splash completed, etc.)
create table if not exists app_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  splash_completed boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Currency Rates (for multi-currency support)
create table if not exists currency_rates (
  id uuid primary key default uuid_generate_v4(),
  currency_code text unique not null,
  rate_to_usd numeric not null,
  updated_at timestamp with time zone default now()
);

-- Mining Records (for ZukaCoin mining history)
create table if not exists mining_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  mined_amount numeric not null check (mined_amount > 0),
  date_mined date not null default current_date,
  created_at timestamp with time zone default now()
);

-- Investment Records
create table if not exists investment_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  investment_name text not null,
  status text not null check (status in ('active', 'completed', 'pending')) default 'pending',
  profit numeric not null default 0,
  created_at timestamp with time zone default now()
);

-- Social Engagement Records
create table if not exists social_engagement (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  likes int not null default 0 check (likes >= 0),
  comments int not null default 0 check (comments >= 0),
  shares int not null default 0 check (shares >= 0),
  created_at timestamp with time zone default now()
);

-- ==============
-- INDEXES
-- ==============
create index if not exists idx_users_email on users(email);
create index if not exists idx_mining_user on mining_records(user_id);
create index if not exists idx_investment_user on investment_records(user_id);
create index if not exists idx_social_user on social_engagement(user_id);

-- ==============
-- SEED DATA
-- ==============
-- Insert only real currency rates (needed for multi-currency support)
insert into currency_rates (currency_code, rate_to_usd) values
('USD', 1),
('NGN', 0.0013),
('GHS', 0.085),
('KES', 0.0078),
('ZAR', 0.054)
on conflict (currency_code) do nothing;

-- ==================================
-- Enable RLS
-- ==================================
alter table users enable row level security;
alter table app_settings enable row level security;
alter table mining_records enable row level security;
alter table investment_records enable row level security;
alter table social_engagement enable row level security;

-- ==================================
-- USERS TABLE
-- ==================================
-- Users can see and update only their own profile
create policy "Users can view their own profile"
on users for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on users for update
using (auth.uid() = id);

-- ==================================
-- APP SETTINGS
-- ==================================
-- Each user manages only their own settings
create policy "Users can view their own settings"
on app_settings for select
using (auth.uid() = user_id);

create policy "Users can update their own settings"
on app_settings for update
using (auth.uid() = user_id);

-- ==================================
-- MINING RECORDS
-- ==================================
create policy "Users can view their own mining records"
on mining_records for select
using (auth.uid() = user_id);

create policy "Users can insert their own mining records"
on mining_records for insert
with check (auth.uid() = user_id);

-- ==================================
-- INVESTMENT RECORDS
-- ==================================
create policy "Users can view their own investments"
on investment_records for select
using (auth.uid() = user_id);

create policy "Users can insert their own investments"
on investment_records for insert
with check (auth.uid() = user_id);

-- ==================================
-- SOCIAL ENGAGEMENT
-- ==================================
create policy "Users can view their own social stats"
on social_engagement for select
using (auth.uid() = user_id);

create policy "Users can insert their own engagement"
on social_engagement for insert
with check (auth.uid() = user_id);

create policy "Users can update their own engagement"
on social_engagement for update
using (auth.uid() = user_id);