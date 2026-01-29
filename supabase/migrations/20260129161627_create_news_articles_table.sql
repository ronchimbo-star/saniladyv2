/*
  # Create news articles table

  1. New Tables
    - `news_articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique) - URL-friendly version of title
      - `content` (text) - HTML content
      - `excerpt` (text) - Short description/meta description
      - `category` (text) - Article category
      - `thumbnail_url` (text) - URL for thumbnail image
      - `thumbnail_alt` (text) - Alt text for thumbnail
      - `featured_image_url` (text) - URL for featured image
      - `featured_image_alt` (text) - Alt text for featured image
      - `meta_title` (text) - SEO title
      - `meta_description` (text) - SEO description (max 160 chars)
      - `meta_keywords` (text) - SEO keywords
      - `status` (text) - 'draft' or 'published'
      - `author_id` (uuid) - References user who created it
      - `published_at` (timestamptz) - When published
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `news_articles` table
    - Add policy for public to view published articles
    - Add policy for admins to manage all articles
*/

CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  excerpt text DEFAULT '',
  category text DEFAULT 'general',
  thumbnail_url text DEFAULT '',
  thumbnail_alt text DEFAULT '',
  featured_image_url text DEFAULT '',
  featured_image_alt text DEFAULT '',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id uuid REFERENCES auth.users(id),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS news_articles_slug_idx ON news_articles(slug);
CREATE INDEX IF NOT EXISTS news_articles_status_idx ON news_articles(status);
CREATE INDEX IF NOT EXISTS news_articles_published_at_idx ON news_articles(published_at DESC);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON news_articles
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can view all articles"
  ON news_articles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert articles"
  ON news_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update articles"
  ON news_articles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete articles"
  ON news_articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'published' AND OLD.status = 'draft' THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_at();
