/*
  # Add Archive and Viewed Tracking to Contact Submissions

  ## Changes
  1. Add `viewed_by_admin` boolean field to track if admin has viewed the message
  2. Add `archived` boolean field to allow archiving old messages
  3. Add `archived_at` timestamp field to track when message was archived
  4. Add `admin_notes` text field for admin internal notes
  5. Update RLS policies to allow admins full access
  
  ## Purpose
  - Track which contact submissions have been reviewed
  - Allow admins to archive old messages
  - Keep historical data while hiding from main view
  - Enable deletion of archived messages
  
  ## Security
  - Only admins can view, update, and delete contact submissions
  - Anonymous users can still insert contact submissions
*/

-- Add new fields to contact_submissions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'viewed_by_admin'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN viewed_by_admin boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'archived'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN archived boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN archived_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN admin_notes text;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON contact_submissions;

-- Create admin policies that check the users table
CREATE POLICY "Admins can view all contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all contact submissions"
  ON contact_submissions
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

CREATE POLICY "Admins can delete contact submissions"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
