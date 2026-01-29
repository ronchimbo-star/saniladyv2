/*
  # Fix RLS policy for anonymous contact submissions

  1. Changes
    - Drop and recreate the anonymous insert policy for contact_submissions table
    - Ensure anon role can insert contact forms without authentication

  2. Security
    - Uses explicit policy recreation to ensure proper configuration
    - Maintains admin policies for viewing and updating
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON contact_submissions;

-- Create separate policies for anon and authenticated users
CREATE POLICY "Enable insert for anon users"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also create policy for authenticated users
CREATE POLICY "Enable insert for authenticated users"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);