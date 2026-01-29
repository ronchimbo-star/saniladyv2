/*
  # Fix RLS policy for anonymous quote submissions

  1. Changes
    - Drop and recreate the anonymous insert policy for quotes table
    - Ensure anon role can insert quotes without authentication

  2. Security
    - Uses explicit policy recreation to ensure proper configuration
    - Maintains admin and user policies for other operations
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can submit quotes" ON quotes;

-- Create a new policy with explicit permissions for anonymous inserts
CREATE POLICY "Enable insert for anon users"
  ON quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also create policy for authenticated users
CREATE POLICY "Enable insert for authenticated users" 
  ON quotes
  FOR INSERT
  TO authenticated  WITH CHECK (true);