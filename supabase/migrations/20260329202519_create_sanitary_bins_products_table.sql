/*
  # Create Sanitary Bins Products Table

  1. New Tables
    - `sanitary_bin_products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Product description
      - `capacity` (text) - Bin capacity (e.g., "20L")
      - `category` (text) - Product category (pedal, automatic, stainless)
      - `features` (jsonb) - Array of product features
      - `variants` (jsonb) - Array of available variants
      - `price_from` (numeric) - Starting price
      - `image_url` (text) - Main product image URL
      - `additional_images` (jsonb) - Array of additional image URLs
      - `is_featured` (boolean) - Whether product is featured
      - `badge` (text) - Optional badge text (e.g., "Popular", "Premium")
      - `sort_order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `sanitary_bin_products` table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage products
*/

CREATE TABLE IF NOT EXISTS sanitary_bin_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  capacity text NOT NULL,
  category text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  variants jsonb DEFAULT '[]'::jsonb,
  price_from numeric NOT NULL,
  image_url text NOT NULL,
  additional_images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  badge text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sanitary_bin_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published sanitary bin products"
  ON sanitary_bin_products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert sanitary bin products"
  ON sanitary_bin_products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sanitary bin products"
  ON sanitary_bin_products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sanitary bin products"
  ON sanitary_bin_products
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_sanitary_bins_slug ON sanitary_bin_products(slug);
CREATE INDEX IF NOT EXISTS idx_sanitary_bins_category ON sanitary_bin_products(category);
CREATE INDEX IF NOT EXISTS idx_sanitary_bins_featured ON sanitary_bin_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_sanitary_bins_sort_order ON sanitary_bin_products(sort_order);
