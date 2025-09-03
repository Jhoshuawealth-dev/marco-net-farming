-- Ads Table (campaigns / boosted posts)
create table if not exists ads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade, -- advertiser
  ad_type text check (ad_type in ('boost_post', 'video_ad', 'banner')) default 'boost_post',
  content_url text not null, -- video or image
  caption text,
  target_country text[],
  target_age_range int4range,
  budget numeric not null,
  spent numeric default 0,
  status text check (status in ('active', 'paused', 'completed')) default 'active',
  created_at timestamp with time zone default now()
);

-- Ad Impressions (like TikTok views/likes/shares)
create table if not exists ad_impressions (
  id uuid primary key default uuid_generate_v4(),
  ad_id uuid references ads(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  impression_type text check (impression_type in ('view', 'like', 'comment', 'share', 'click')) not null,
  created_at timestamp with time zone default now()
);

-- Ad Billing (spend tracking & admin revenue)
create table if not exists ad_billing (
  id uuid primary key default uuid_generate_v4(),
  ad_id uuid references ads(id) on delete cascade,
  cost_per_view numeric default 0.01,
  total_spent numeric default 0,
  admin_share numeric default 0,
  created_at timestamp with time zone default now()
);

-- Link Ad revenue into overall platform revenue
create table if not exists revenue_records (
  id uuid primary key default uuid_generate_v4(),
  source text check (source in ('ads', 'events', 'investment', 'mining', 'social')) not null,
  amount numeric not null,
  created_at timestamp with time zone default now()
);

-- ==============
-- INDEXES
-- ==============
create index if not exists idx_ads_user on ads(user_id);
create index if not exists idx_ads_status on ads(status);
create index if not exists idx_impressions_ad on ad_impressions(ad_id);
create index if not exists idx_impressions_user on ad_impressions(user_id);
create index if not exists idx_billing_ad on ad_billing(ad_id);
create index if not exists idx_revenue_source on revenue_records(source);

-- ==================================
-- Enable RLS
-- ==================================
alter table ads enable row level security;
alter table ad_impressions enable row level security;
alter table ad_billing enable row level security;
alter table revenue_records enable row level security;

-- ==================================
-- ADS TABLE POLICIES
-- ==================================
-- Users can view, create, and update their own ads
create policy "Users can view their own ads"
on ads for select
using (auth.uid() = user_id);

create policy "Users can create their own ads"
on ads for insert
with check (auth.uid() = user_id);

create policy "Users can update their own ads"
on ads for update
using (auth.uid() = user_id);

-- Users can view ads targeted to them (for ad serving)
create policy "Users can view targeted ads"
on ads for select
using (status = 'active');

-- ==================================
-- AD IMPRESSIONS POLICIES
-- ==================================
-- Users can view impressions on their ads
create policy "Ad owners can view impressions on their ads"
on ad_impressions for select
using (exists (
  select 1 from ads where ads.id = ad_impressions.ad_id and ads.user_id = auth.uid()
));

-- Users can create impressions on any active ad
create policy "Users can create impressions"
on ad_impressions for insert
with check (auth.uid() = user_id);

-- Users can view their own impressions
create policy "Users can view their own impressions"
on ad_impressions for select
using (auth.uid() = user_id);

-- ==================================
-- AD BILLING POLICIES
-- ==================================
-- Only ad owners can view billing for their ads
create policy "Ad owners can view billing"
on ad_billing for select
using (exists (
  select 1 from ads where ads.id = ad_billing.ad_id and ads.user_id = auth.uid()
));

-- ==================================
-- REVENUE RECORDS POLICIES
-- ==================================
-- Only admins can view revenue records (you may want to adjust this)
create policy "Admins can view revenue records"
on revenue_records for select
using (auth.role() = 'admin');