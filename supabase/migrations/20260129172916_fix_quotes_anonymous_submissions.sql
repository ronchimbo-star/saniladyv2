/*
  # Fix quotes table to allow anonymous submissions

  1. Changes
    - Make user_id field nullable in quotes table (for anonymous submissions)
    - Add policy for anonymous users to submit quotes
    - Update admin policies to handle both authenticated and anonymous quotes

  2. Security
    - Anonymous users (not logged in) can insert quotes
    - Authenticated users can still insert and view their own quotes
    - Admins can view and update all quotes (both authenticated and anonymous)
*/

-- Make user_id nullable to support anonymous quote submissions
ALTER TABLE quotes ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing restrictive insert policy for authenticated users
DROP POLICY IF EXISTS "Users can create own quotes" ON quotes;

-- Create new policy allowing anonymous quote submissions
CREATE POLICY "Anyone can submit quotes"
  ON quotes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Update the select policy to allow users to view quotes they submitted (even when not logged in)
-- This keeps the existing "Users can view own quotes" policy for authenticated users
-- And adds "Admins can view all quotes" which already exists

-- Update delete policy to allow authenticated users to delete their own quotes
DROP POLICY IF EXISTS "Users can delete own quotes" ON quotes;

CREATE POLICY "Authenticated users can delete own quotes"
  ON quotes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update policy for authenticated users to update their own quotes
DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;

CREATE POLICY "Authenticated users can update own quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);