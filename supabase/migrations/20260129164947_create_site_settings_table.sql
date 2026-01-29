/*
  # Create site settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key) - unique identifier
      - `google_analytics_id` (text) - GA tracking ID
      - `header_logo_url` (text) - URL to header logo
      - `footer_logo_url` (text) - URL to footer logo
      - `favicon_url` (text) - URL to favicon
      - `contact_phone` (text) - business phone number
      - `contact_email` (text) - business email
      - `contact_address` (text) - business address
      - `updated_at` (timestamptz) - last update timestamp
      - `updated_by` (uuid) - admin who last updated
      
  2. Security
    - Enable RLS on `site_settings` table
    - Add policy for public read access (everyone needs to see contact info)
    - Add policy for admin-only write access
    
  3. Notes
    - Single row table for global settings
    - Public can read settings for displaying contact info
    - Only admins can modify settings
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_analytics_id text DEFAULT '',
  header_logo_url text DEFAULT '/sanilady-logo-header.png',
  footer_logo_url text DEFAULT '/sanilady-logo-footer.png',
  favicon_url text DEFAULT '/sanilady-favicon-v2.png',
  contact_phone text DEFAULT '',
  contact_email text DEFAULT '',
  contact_address text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Only admins can insert site settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1) THEN
    INSERT INTO site_settings (
      google_analytics_id,
      header_logo_url,
      footer_logo_url,
      favicon_url,
      contact_phone,
      contact_email,
      contact_address
    ) VALUES (
      '',
      '/sanilady-logo-header.png',
      '/sanilady-logo-footer.png',
      '/sanilady-favicon-v2.png',
      '0800 123 4567',
      'info@sanilady.co.uk',
      'Serving Kent, London & Essex'
    );
  END IF;
END $$;
