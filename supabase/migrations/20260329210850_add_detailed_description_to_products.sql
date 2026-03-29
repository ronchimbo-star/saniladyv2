/*
  # Add Detailed Description to Sanitary Bin Products

  1. Changes
    - Add `detailed_description` column to `sanitary_bin_base_products` table
    - This will store comprehensive HTML product descriptions similar to WashroomHub

  2. Notes
    - Field is nullable to support existing products
    - Default value is empty string for consistency
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sanitary_bin_base_products' AND column_name = 'detailed_description'
  ) THEN
    ALTER TABLE sanitary_bin_base_products ADD COLUMN detailed_description text DEFAULT '';
  END IF;
END $$;