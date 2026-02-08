/*
  # Fix Quotes RLS Policies to Use Correct Users Table

  ## Problem
  The RLS policies for the quotes table are checking the `user_profiles` table
  for admin role verification, but the application uses the `users` table instead.
  This prevents admins from viewing and managing quotes.

  ## Changes
  1. Drop existing admin RLS policies that check `user_profiles`
  2. Create new admin RLS policies that check the `users` table
  
  ## Security
  - Admins (users.role = 'admin') can view all quotes
  - Admins can update all quotes
  - Anonymous users can still insert quotes
  - Authenticated users can view, update, and delete their own quotes
*/

-- Drop existing admin policies that check user_profiles
DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can update all quotes" ON quotes;

-- Create new admin policies that check the users table
CREATE POLICY "Admins can view all quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all quotes"
  ON quotes
  FOR UPDATE
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
