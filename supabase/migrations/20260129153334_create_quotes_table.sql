/*
  # Create quotes table for SaniLady application

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `property_type` (text)
      - `property_size` (text)
      - `cleaning_frequency` (text)
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `additional_services` (text array)
      - `special_requirements` (text)
      - `estimated_cost` (decimal)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `quotes` table
    - Add policy for users to view their own quotes
    - Add policy for users to create their own quotes
    - Add policy for users to update their own quotes
*/

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_type text NOT NULL,
  property_size text NOT NULL,
  cleaning_frequency text NOT NULL,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  additional_services text[] DEFAULT '{}',
  special_requirements text DEFAULT '',
  estimated_cost decimal(10,2) DEFAULT 0.00,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quotes"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quotes"
  ON quotes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);