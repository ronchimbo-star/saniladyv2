/*
  # Fix News Articles RLS Policies

  This migration cleans up duplicate news articles policies and ensures all admin checks
  use the public.users table consistently.

  ## Changes
  
  1. **news_articles table**
    - Remove duplicate policies
    - Remove policies using is_admin() function
    - Keep only policies checking public.users.role
    
  ## Security
  - Admins can manage all articles (requires authenticated user with admin role in public.users)
  - Public can view published articles
*/

-- Drop duplicate and incorrect policies
DROP POLICY IF EXISTS "Admins can delete articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can delete news articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can insert news articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can update articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can update news articles" ON news_articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON news_articles;
DROP POLICY IF EXISTS "Published articles are publicly readable" ON news_articles;

-- Create clean, consistent policies using public.users table
CREATE POLICY "Admins can manage articles - insert"
  ON news_articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage articles - update"
  ON news_articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage articles - delete"
  ON news_articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all articles - select"
  ON news_articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );