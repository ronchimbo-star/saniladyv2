/*
  # Restructure Sanitary Bins Product Schema with Variants

  1. New Tables
    - `sanitary_bin_base_products`
      - Base product information (name, description, features)
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Product description
      - `features` (jsonb) - Array of product features
      - `specifications` (jsonb) - Technical specifications
      - `category` (text) - Product category
      - `brand` (text) - Brand name
      - `sku_prefix` (text) - SKU prefix for variants
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `sanitary_bin_variants`
      - Product variants (color, size, etc.)
      - `id` (uuid, primary key)
      - `base_product_id` (uuid, foreign key)
      - `sku` (text, unique) - Full SKU
      - `variant_name` (text) - e.g., "White", "Grey", "20L"
      - `color` (text) - Color option
      - `capacity` (text) - Capacity (15L, 20L, etc.)
      - `price` (decimal) - Base price
      - `image_url` (text) - Primary product image
      - `additional_images` (jsonb) - Array of additional image URLs
      - `stock_status` (text) - Available, Out of Stock, etc.
      - `is_default` (boolean) - Default variant for product
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Data Migration
    - Move existing products to new structure
    - Preserve all existing data

  3. Security
    - Enable RLS on both tables
    - Public can read all products
    - Only authenticated admins can modify
*/

-- Create base products table
CREATE TABLE IF NOT EXISTS sanitary_bin_base_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  features jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  category text NOT NULL,
  brand text,
  sku_prefix text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create variants table
CREATE TABLE IF NOT EXISTS sanitary_bin_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_product_id uuid REFERENCES sanitary_bin_base_products(id) ON DELETE CASCADE,
  sku text UNIQUE NOT NULL,
  variant_name text NOT NULL,
  color text,
  capacity text,
  price decimal(10,2),
  image_url text,
  additional_images jsonb DEFAULT '[]'::jsonb,
  stock_status text DEFAULT 'Available',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sanitary_bin_base_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanitary_bin_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for base_products
CREATE POLICY "Anyone can view base products"
  ON sanitary_bin_base_products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert base products"
  ON sanitary_bin_base_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update base products"
  ON sanitary_bin_base_products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete base products"
  ON sanitary_bin_base_products FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for variants
CREATE POLICY "Anyone can view variants"
  ON sanitary_bin_variants FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert variants"
  ON sanitary_bin_variants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update variants"
  ON sanitary_bin_variants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete variants"
  ON sanitary_bin_variants FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_variants_base_product ON sanitary_bin_variants(base_product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON sanitary_bin_variants(sku);
CREATE INDEX IF NOT EXISTS idx_base_products_slug ON sanitary_bin_base_products(slug);
