-- Blog posts table for admin-managed content
CREATE TABLE IF NOT EXISTS blog_posts (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  excerpt     TEXT,
  content     TEXT,                          -- HTML content
  featured_image TEXT,
  category    TEXT DEFAULT 'Species Guide',
  risk_level  TEXT DEFAULT 'General',        -- Toxic, High Risk, Low Risk, General
  region      TEXT DEFAULT 'Worldwide',      -- US North America, EU Europe, Worldwide, Temperate, Others
  is_premium  BOOLEAN DEFAULT false,
  views       INTEGER DEFAULT 0,
  read_time   TEXT DEFAULT '5 min read',
  status      TEXT DEFAULT 'draft',          -- draft, published
  author_name TEXT DEFAULT 'Paul Stamets',
  author_role TEXT DEFAULT 'Mycologist · Author · Fungi Expert',
  meta_title  TEXT,                          -- SEO meta title (max 60 chars)
  meta_description TEXT,                     -- SEO meta description (max 155 chars)
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts (status);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Admin insert/update/delete via service role (bypasses RLS)
