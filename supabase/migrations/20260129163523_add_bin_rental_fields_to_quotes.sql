/*
  # Add bin rental fields to quotes table

  1. Changes
    - Add number_of_bins column (integer) - number of bins required
    - Add bin_collection_frequency column (text) - how often bins need servicing
    - Add needs_bin_rental column (boolean) - whether customer needs to rent/hire bins
    
  2. Notes
    - These fields support the waste management service quotes
    - All fields are nullable for backwards compatibility
    - Default values provided for cleaner data
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quotes' AND column_name = 'number_of_bins'
  ) THEN
    ALTER TABLE quotes ADD COLUMN number_of_bins integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quotes' AND column_name = 'bin_collection_frequency'
  ) THEN
    ALTER TABLE quotes ADD COLUMN bin_collection_frequency text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quotes' AND column_name = 'needs_bin_rental'
  ) THEN
    ALTER TABLE quotes ADD COLUMN needs_bin_rental boolean DEFAULT false;
  END IF;
END $$;
