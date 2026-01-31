/*
  # Fix Admin RLS Policies for Settings and Testimonials

  This migration removes duplicate and incorrect RLS policies that check auth.users.raw_app_meta_data
  and keeps only the correct policies that check public.users.role.

  ## Changes
  
  1. **site_settings table**
    - Remove policies checking auth.users.raw_app_meta_data
    - Keep policies checking public.users.role
    
  2. **testimonials table**
    - Remove policies checking auth.users.raw_app_meta_data
    - Keep policies checking public.users.role

  ## Security
  - All admin actions require authentication and admin role in public.users table
  - Public can view published content
*/

-- Drop incorrect site_settings policies that check auth.users
DROP POLICY IF EXISTS "Only admins can insert site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;

-- Drop duplicate site_settings policies (keep the ones checking public.users)
-- The "Admins can insert/update/delete site settings" policies are correct

-- Drop incorrect testimonials policies that check auth.users  
DROP POLICY IF EXISTS "Only admins can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admins can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON testimonials;

-- Create correct testimonials policies that check public.users
CREATE POLICY "Admins can manage testimonials - insert"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage testimonials - update"
  ON testimonials FOR UPDATE
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

CREATE POLICY "Admins can manage testimonials - delete"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all testimonials - select"
  ON testimonials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );