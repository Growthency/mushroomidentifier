-- ============================================================
-- Mushroom Identifiers — Complete Supabase Setup
-- ============================================================
-- Run this ONCE in a NEW Supabase project's SQL Editor.
-- It creates all tables, indexes, RLS policies, and storage buckets.
-- After running, update .env.local with the new project credentials.
-- ============================================================

-- ── 1. PROFILES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  full_name  TEXT,
  credits    INTEGER DEFAULT 3,
  total_identifications INTEGER DEFAULT 0,
  signup_ip  TEXT,
  plan       TEXT DEFAULT 'free',
  referral_code TEXT,
  referred_by   UUID REFERENCES auth.users(id),
  country    TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS idx_profiles_signup_ip ON profiles(signup_ip);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    3
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 2. ANALYSES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analyses (
  id           SERIAL PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address   TEXT,
  image_hash   TEXT,
  result       JSONB,
  credits_used INTEGER DEFAULT 1,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_image_hash ON analyses(image_hash);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);


-- ── 3. IP USAGE (rate limiting) ──────────────────────────────
CREATE TABLE IF NOT EXISTS ip_usage (
  ip_address TEXT PRIMARY KEY,
  count      INTEGER DEFAULT 0,
  reset_date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE ip_usage ENABLE ROW LEVEL SECURITY;

-- Service role only — no direct user access
CREATE POLICY "Service role can insert ip_usage"
  ON ip_usage FOR INSERT TO service_role USING (true);
CREATE POLICY "Service role can select ip_usage"
  ON ip_usage FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can update ip_usage"
  ON ip_usage FOR UPDATE TO service_role USING (true);

CREATE INDEX IF NOT EXISTS idx_ip_usage_ip_address ON ip_usage(ip_address);


-- ── 4. TRANSACTIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id                    SERIAL PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  paddle_transaction_id TEXT,
  credits_added         INTEGER,
  amount_paid           DECIMAL(10,2),
  pack_name             TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_paddle_tx_id
  ON transactions(paddle_transaction_id) WHERE paddle_transaction_id IS NOT NULL;


-- ── 5. CONTACT REQUESTS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_requests (
  id         SERIAL PRIMARY KEY,
  name       TEXT,
  email      TEXT,
  subject    TEXT,
  message    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Service role only
CREATE POLICY "Service role can insert contacts"
  ON contact_requests FOR INSERT TO service_role USING (true);
CREATE POLICY "Service role can select contacts"
  ON contact_requests FOR SELECT TO service_role USING (true);


-- ── 6. BLOG POSTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id               SERIAL PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  excerpt          TEXT,
  content          TEXT,
  featured_image   TEXT,
  category         TEXT DEFAULT 'Species Guide',
  risk_level       TEXT DEFAULT 'General',
  region           TEXT DEFAULT 'Worldwide',
  is_premium       BOOLEAN DEFAULT false,
  views            INTEGER DEFAULT 0,
  read_time        TEXT DEFAULT '5 min read',
  status           TEXT DEFAULT 'draft',
  author_name      TEXT DEFAULT 'Paul Stamets',
  author_role      TEXT DEFAULT 'Mycologist · Author · Fungi Expert',
  meta_title       TEXT,
  meta_description TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  published_at     TIMESTAMPTZ
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);


-- ── 7. BLOG COMMENTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_comments (
  id            SERIAL PRIMARY KEY,
  article_slug  TEXT NOT NULL,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON blog_comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON blog_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own comments"
  ON blog_comments FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own comments"
  ON blog_comments FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS idx_blog_comments_article ON blog_comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user ON blog_comments(user_id);


-- ── 8. SAVED ARTICLES (favorites) ────────────────────────────
CREATE TABLE IF NOT EXISTS saved_articles (
  id               SERIAL PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug     TEXT NOT NULL,
  article_title    TEXT,
  article_image    TEXT,
  article_excerpt  TEXT,
  article_category TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_slug)
);

ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved articles"
  ON saved_articles FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can save articles"
  ON saved_articles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can unsave articles"
  ON saved_articles FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS idx_saved_articles_user ON saved_articles(user_id);


-- ── 9. RANK TRACKER (keywords + positions) ───────────────────
CREATE TABLE IF NOT EXISTS rank_keywords (
  id            SERIAL PRIMARY KEY,
  keyword       TEXT NOT NULL UNIQUE,
  position      INTEGER,
  prev_position INTEGER,
  change        INTEGER,
  rank_url      TEXT,
  checked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rank_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access rank_keywords"
  ON rank_keywords FOR ALL TO service_role USING (true);


-- ── 10. STORAGE BUCKETS ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for both buckets
CREATE POLICY "Public read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Authenticated users can upload to images bucket
CREATE POLICY "Auth users can upload images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Users can upload their own avatars
CREATE POLICY "Auth users can upload avatars" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');


-- ============================================================
-- DONE! All tables, policies, indexes, and storage buckets created.
-- ============================================================
