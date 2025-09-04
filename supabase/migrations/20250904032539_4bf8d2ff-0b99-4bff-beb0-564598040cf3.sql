-- USERS
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  country text,
  currency_code text,
  wallet_balance numeric default 0,
  zuka_balance numeric default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- APP SETTINGS
create table if not exists app_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  splash_completed boolean default false,
  created_at timestamp with time zone default now()
);

-- CURRENCY RATES
create table if not exists currency_rates (
  id uuid primary key default uuid_generate_v4(),
  currency_code text not null unique,
  rate_to_usd numeric not null,
  updated_at timestamp with time zone default now()
);

-- MINING
create table if not exists mining_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  mined_amount numeric not null,
  date_mined date not null default current_date,
  created_at timestamp with time zone default now()
);

-- INVESTMENTS
create table if not exists investment_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  investment_name text not null,
  status text check (status in ('active','completed','pending')) default 'pending',
  profit numeric default 0,
  created_at timestamp with time zone default now()
);

-- SOCIAL POSTS
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  content text,
  media_url text,
  created_at timestamp with time zone default now()
);

-- SOCIAL ENGAGEMENT
create table if not exists social_engagement (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  type text check (type in ('like','comment','share')),
  content text,
  created_at timestamp with time zone default now()
);

-- EVENTS
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  date timestamp with time zone,
  created_by uuid references users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- EVENT REGISTRATION
create table if not exists event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- COURSES
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  video_url text,
  reward numeric default 0,
  created_at timestamp with time zone default now()
);

-- COURSE PROGRESS
create table if not exists course_progress (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

-- ADVERTS
create table if not exists adverts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  media_url text,
  caption text,
  is_boosted boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mining_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE adverts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for app_settings
CREATE POLICY "Users can view their own settings" ON app_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON app_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON app_settings FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for currency_rates (public read)
CREATE POLICY "Currency rates are publicly readable" ON currency_rates FOR SELECT USING (true);

-- RLS Policies for mining_records
CREATE POLICY "Users can view their own mining records" ON mining_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mining records" ON mining_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for investment_records
CREATE POLICY "Users can view their own investments" ON investment_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own investments" ON investment_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Posts are publicly viewable" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for social_engagement
CREATE POLICY "Engagement is publicly viewable" ON social_engagement FOR SELECT USING (true);
CREATE POLICY "Users can create engagement" ON social_engagement FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Events are publicly viewable" ON events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for courses
CREATE POLICY "Courses are publicly viewable" ON courses FOR SELECT USING (true);

-- RLS Policies for course_progress
CREATE POLICY "Users can view their own progress" ON course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress" ON course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON course_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for adverts
CREATE POLICY "Adverts are publicly viewable" ON adverts FOR SELECT USING (true);
CREATE POLICY "Users can create their own adverts" ON adverts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- REWARD FUNCTIONS + TRIGGERS

-- Reward values
CREATE OR REPLACE FUNCTION reward_for_action(action text)
RETURNS numeric AS $$
BEGIN
  CASE action
    WHEN 'like' THEN RETURN 50;
    WHEN 'comment' THEN RETURN 20;
    WHEN 'share' THEN RETURN 100;
    ELSE RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Engagement rewards
CREATE OR REPLACE FUNCTION handle_engagement_reward()
RETURNS trigger AS $$
BEGIN
  UPDATE users
  SET wallet_balance = wallet_balance + reward_for_action(NEW.type)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_engagement_reward
AFTER INSERT ON social_engagement
FOR EACH ROW EXECUTE FUNCTION handle_engagement_reward();

-- Mining rewards
CREATE OR REPLACE FUNCTION handle_mining_reward()
RETURNS trigger AS $$
BEGIN
  UPDATE users
  SET zuka_balance = zuka_balance + NEW.mined_amount
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mining_reward
AFTER INSERT ON mining_records
FOR EACH ROW EXECUTE FUNCTION handle_mining_reward();

-- Course completion rewards
CREATE OR REPLACE FUNCTION handle_course_completion()
RETURNS trigger AS $$
DECLARE reward_value numeric;
BEGIN
  IF NEW.completed = true THEN
    SELECT reward INTO reward_value FROM courses WHERE id = NEW.course_id;
    UPDATE users
    SET wallet_balance = wallet_balance + COALESCE(reward_value,0)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_course_completion
AFTER INSERT OR UPDATE ON course_progress
FOR EACH ROW EXECUTE FUNCTION handle_course_completion();

-- User creation trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, country, currency_code, wallet_balance, zuka_balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    COALESCE(NEW.raw_user_meta_data->>'currency_code', 'USD'),
    0,
    0
  );
  
  INSERT INTO public.app_settings (user_id, splash_completed)
  VALUES (NEW.id, false);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();