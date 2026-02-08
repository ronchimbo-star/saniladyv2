/*
  # Add Archive Functionality to Quotes Table

  ## Changes
  1. Add `archived` boolean field to quotes table (default false)
  2. Add `archived_at` timestamp field to track when quote was archived
  
  ## Purpose
  - Allow admins to archive quote requests
  - Keep historical data while hiding from main view
  - Enable deletion of archived quotes
  
  ## Security
  - Only admins can archive/unarchive quotes (existing RLS policies apply)
*/

-- Add archived field to quotes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'archived'
  ) THEN
    ALTER TABLE quotes ADD COLUMN archived boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE quotes ADD COLUMN archived_at timestamptz;
  END IF;
END $$;

-- Add policy for admins to delete quotes
DROP POLICY IF EXISTS "Admins can delete quotes" ON quotes;

CREATE POLICY "Admins can delete quotes"
  ON quotes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
