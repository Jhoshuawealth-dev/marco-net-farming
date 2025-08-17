-- =============================================
-- COMPREHENSIVE DATABASE SCHEMA FOR MARCO-NET FARMING APP
-- =============================================

-- Create enums for various categories and statuses
CREATE TYPE public.investment_type AS ENUM ('virtual', 'real');
CREATE TYPE public.investment_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE public.post_type AS ENUM ('text', 'image', 'video', 'poll');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE public.course_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.ad_type AS ENUM ('banner', 'video', 'interactive', 'sponsored_post');
CREATE TYPE public.transaction_type AS ENUM ('mining_reward', 'investment_profit', 'social_reward', 'event_reward', 'ad_reward', 'purchase');

-- =============================================
-- SOCIAL SECTION TABLES
-- =============================================

-- Posts table for user content
CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    post_type post_type NOT NULL DEFAULT 'text',
    image_url TEXT,
    video_url TEXT,
    poll_options JSONB,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    shares_count INTEGER NOT NULL DEFAULT 0,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comments on posts
CREATE TABLE public.comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Likes for posts and comments
CREATE TABLE public.likes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, comment_id),
    CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- User follows
CREATE TABLE public.follows (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- =============================================
-- INVESTMENT SECTION TABLES
-- =============================================

-- Investment categories
CREATE TABLE public.investment_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Available investments
CREATE TABLE public.investments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.investment_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    investment_type investment_type NOT NULL,
    minimum_amount DECIMAL(15,2) NOT NULL,
    expected_return_rate DECIMAL(5,2) NOT NULL,
    duration_days INTEGER,
    risk_level INTEGER NOT NULL CHECK (risk_level BETWEEN 1 AND 5),
    is_active BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User investment portfolios
CREATE TABLE public.user_investments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    investment_id UUID NOT NULL REFERENCES public.investments(id),
    amount_invested DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    profit_loss DECIMAL(15,2) NOT NULL DEFAULT 0,
    status investment_status NOT NULL DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- MINING SECTION TABLES
-- =============================================

-- User ZukaCoin balances and mining stats
CREATE TABLE public.user_mining (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    zukacoin_balance DECIMAL(18,8) NOT NULL DEFAULT 0,
    total_mined DECIMAL(18,8) NOT NULL DEFAULT 0,
    mining_power INTEGER NOT NULL DEFAULT 1,
    last_mining_session TIMESTAMP WITH TIME ZONE,
    consecutive_days INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mining sessions history
CREATE TABLE public.mining_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    zukacoin_earned DECIMAL(18,8) NOT NULL,
    mining_duration INTEGER NOT NULL, -- in seconds
    bonus_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mining equipment/upgrades
CREATE TABLE public.mining_equipment (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    power_boost INTEGER NOT NULL,
    cost_zukacoin DECIMAL(18,8) NOT NULL,
    cost_real_money DECIMAL(10,2),
    duration_hours INTEGER,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User owned equipment
CREATE TABLE public.user_equipment (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    equipment_id UUID NOT NULL REFERENCES public.mining_equipment(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, equipment_id)
);

-- =============================================
-- EVENTS SECTION TABLES
-- =============================================

-- Event categories
CREATE TABLE public.event_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color_hex TEXT NOT NULL DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.event_categories(id),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_participants INTEGER,
    reward_zukacoin DECIMAL(18,8) NOT NULL DEFAULT 0,
    reward_description TEXT,
    requirements JSONB,
    status event_status NOT NULL DEFAULT 'upcoming',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User event participations
CREATE TABLE public.event_participations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed BOOLEAN NOT NULL DEFAULT false,
    completion_date TIMESTAMP WITH TIME ZONE,
    reward_claimed BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(user_id, event_id)
);

-- =============================================
-- CRYPTO SECTION TABLES
-- =============================================

-- Supported cryptocurrencies
CREATE TABLE public.cryptocurrencies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    current_price DECIMAL(18,8) NOT NULL DEFAULT 0,
    market_cap DECIMAL(20,2),
    volume_24h DECIMAL(20,2),
    price_change_24h DECIMAL(5,2) NOT NULL DEFAULT 0,
    logo_url TEXT,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User crypto holdings
CREATE TABLE public.user_crypto_holdings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    crypto_id UUID NOT NULL REFERENCES public.cryptocurrencies(id),
    amount DECIMAL(18,8) NOT NULL DEFAULT 0,
    average_buy_price DECIMAL(18,8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, crypto_id)
);

-- Crypto transactions
CREATE TABLE public.crypto_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    crypto_id UUID NOT NULL REFERENCES public.cryptocurrencies(id),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'transfer_in', 'transfer_out')),
    amount DECIMAL(18,8) NOT NULL,
    price_per_unit DECIMAL(18,8) NOT NULL,
    total_value DECIMAL(18,8) NOT NULL,
    fees DECIMAL(18,8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- LEARN SECTION TABLES
-- =============================================

-- Course categories
CREATE TABLE public.course_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Learning courses
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.course_categories(id),
    title TEXT NOT NULL,
    description TEXT,
    difficulty course_difficulty NOT NULL DEFAULT 'beginner',
    duration_minutes INTEGER NOT NULL,
    reward_zukacoin DECIMAL(18,8) NOT NULL DEFAULT 0,
    thumbnail_url TEXT,
    content JSONB NOT NULL, -- Course lessons and content
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User course progress
CREATE TABLE public.user_course_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    completed BOOLEAN NOT NULL DEFAULT false,
    completion_date TIMESTAMP WITH TIME ZONE,
    current_lesson INTEGER NOT NULL DEFAULT 1,
    time_spent_minutes INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, course_id)
);

-- User achievements/certificates
CREATE TABLE public.user_achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID REFERENCES public.courses(id),
    title TEXT NOT NULL,
    description TEXT,
    badge_url TEXT,
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- ADVERTS SECTION TABLES
-- =============================================

-- Advertisement campaigns
CREATE TABLE public.advertisements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    ad_type ad_type NOT NULL,
    content_url TEXT, -- Image, video, or content URL
    click_url TEXT,
    reward_zukacoin DECIMAL(18,8) NOT NULL DEFAULT 0,
    max_views_per_user INTEGER NOT NULL DEFAULT 1,
    total_budget DECIMAL(12,2),
    daily_budget DECIMAL(12,2),
    target_audience JSONB,
    is_active BOOLEAN NOT NULL DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User ad interactions
CREATE TABLE public.user_ad_interactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    ad_id UUID NOT NULL REFERENCES public.advertisements(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'click', 'complete')),
    reward_earned DECIMAL(18,8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, ad_id, interaction_type)
);

-- =============================================
-- TRANSACTIONS & REWARDS SYSTEM
-- =============================================

-- Universal transaction log for all ZukaCoin movements
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    balance_after DECIMAL(18,8) NOT NULL,
    description TEXT,
    reference_id UUID, -- Reference to related record (post_id, event_id, etc.)
    reference_table TEXT, -- Table name for the reference
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User notifications
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mining ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mining_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mining_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cryptocurrencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_crypto_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ad_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Posts policies
CREATE POLICY "Users can view all posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view all comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view all likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can create their own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view all follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can create their own follows" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Investment categories (public read)
CREATE POLICY "Anyone can view investment categories" ON public.investment_categories FOR SELECT USING (true);

-- Investments (public read)
CREATE POLICY "Anyone can view investments" ON public.investments FOR SELECT USING (true);

-- User investments policies
CREATE POLICY "Users can view their own investments" ON public.user_investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own investments" ON public.user_investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own investments" ON public.user_investments FOR UPDATE USING (auth.uid() = user_id);

-- Mining policies
CREATE POLICY "Users can view their own mining data" ON public.user_mining FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mining data" ON public.user_mining FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mining data" ON public.user_mining FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own mining sessions" ON public.mining_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mining sessions" ON public.mining_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Equipment policies
CREATE POLICY "Anyone can view mining equipment" ON public.mining_equipment FOR SELECT USING (true);

CREATE POLICY "Users can view their own equipment" ON public.user_equipment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can purchase equipment" ON public.user_equipment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own equipment" ON public.user_equipment FOR UPDATE USING (auth.uid() = user_id);

-- Event categories (public read)
CREATE POLICY "Anyone can view event categories" ON public.event_categories FOR SELECT USING (true);

-- Events policies
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Event creators can update their events" ON public.events FOR UPDATE USING (auth.uid() = created_by);

-- Event participations
CREATE POLICY "Users can view their own participations" ON public.event_participations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join events" ON public.event_participations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own participations" ON public.event_participations FOR UPDATE USING (auth.uid() = user_id);

-- Crypto policies
CREATE POLICY "Anyone can view cryptocurrencies" ON public.cryptocurrencies FOR SELECT USING (true);

CREATE POLICY "Users can view their own crypto holdings" ON public.user_crypto_holdings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create crypto holdings" ON public.user_crypto_holdings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own crypto holdings" ON public.user_crypto_holdings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own crypto transactions" ON public.crypto_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create crypto transactions" ON public.crypto_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Course policies
CREATE POLICY "Anyone can view course categories" ON public.course_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own course progress" ON public.user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create course progress" ON public.user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own course progress" ON public.user_course_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Advertisement policies
CREATE POLICY "Anyone can view active ads" ON public.advertisements FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own ad interactions" ON public.user_ad_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create ad interactions" ON public.user_ad_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transaction policies
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notification policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Update triggers for updated_at columns
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_investments_updated_at BEFORE UPDATE ON public.user_investments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_mining_updated_at BEFORE UPDATE ON public.user_mining FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_crypto_holdings_updated_at BEFORE UPDATE ON public.user_crypto_holdings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON public.user_course_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON public.advertisements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================

-- Social indexes
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

-- Investment indexes
CREATE INDEX idx_user_investments_user_id ON public.user_investments(user_id);
CREATE INDEX idx_user_investments_status ON public.user_investments(status);

-- Mining indexes
CREATE INDEX idx_mining_sessions_user_id ON public.mining_sessions(user_id);
CREATE INDEX idx_mining_sessions_created_at ON public.mining_sessions(created_at DESC);

-- Event indexes
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_event_participations_user_id ON public.event_participations(user_id);

-- Transaction indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample investment categories
INSERT INTO public.investment_categories (name, description) VALUES
('Agriculture', 'Farming and agricultural investments'),
('Technology', 'Tech startups and digital assets'),
('Real Estate', 'Property and land investments'),
('Green Energy', 'Renewable energy projects');

-- Insert sample event categories
INSERT INTO public.event_categories (name, description, color_hex) VALUES
('Daily Challenges', 'Daily farming challenges', '#10B981'),
('Community Events', 'Community farming events', '#3B82F6'),
('Competitions', 'Farming competitions', '#F59E0B'),
('Educational', 'Learning events', '#8B5CF6');

-- Insert sample course categories
INSERT INTO public.course_categories (name, description) VALUES
('Farming Basics', 'Learn the fundamentals of farming'),
('Investment Strategies', 'Smart investment techniques'),
('Cryptocurrency', 'Understanding digital currencies'),
('Business Management', 'Managing your farming business');

-- Insert sample cryptocurrencies
INSERT INTO public.cryptocurrencies (symbol, name, current_price) VALUES
('ZUKA', 'ZukaCoin', 0.50),
('BTC', 'Bitcoin', 45000.00),
('ETH', 'Ethereum', 3000.00),
('FARM', 'FarmToken', 1.25);

-- Insert sample mining equipment
INSERT INTO public.mining_equipment (name, description, power_boost, cost_zukacoin) VALUES
('Basic Pickaxe', 'Standard mining tool', 2, 10.0),
('Advanced Drill', 'High-speed mining equipment', 5, 50.0),
('Mining Rig', 'Professional mining setup', 10, 200.0),
('Quantum Miner', 'Next-gen mining technology', 25, 1000.0);