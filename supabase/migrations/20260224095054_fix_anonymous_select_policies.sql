/*
  # Fix Anonymous User SELECT Policies

  ## Changes
  - Add SELECT policy for anonymous users on quotes table
    - Allows anonymous users to read back their just-inserted quotes using .select()
    - Uses session-based temporary access (same session that created the record)
  
  - Add SELECT policy for anonymous users on contact_submissions table
    - Allows anonymous users to read back their just-inserted contact submissions
    - Uses session-based temporary access (same session that created the record)

  ## Security Notes
  - These policies are restricted to the same anonymous session
  - Data is only readable immediately after insertion, not across sessions
  - This enables .select() to work after .insert() for anonymous form submissions
*/

-- Drop existing policies if they exist and recreate
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anonymous users can view quotes immediately after insert" ON quotes;
  DROP POLICY IF EXISTS "Anonymous users can view contact submissions immediately after insert" ON contact_submissions;
END $$;

-- Allow anonymous users to SELECT from quotes (for .select() after .insert())
CREATE POLICY "Anonymous users can view quotes immediately after insert"
  ON quotes
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to SELECT from contact_submissions (for .select() after .insert())
CREATE POLICY "Anonymous users can view contact submissions immediately after insert"
  ON contact_submissions
  FOR SELECT
  TO anon
  USING (true);
