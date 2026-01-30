/*
  # Create Waste Transfer Notes Table

  1. New Tables
    - `waste_transfer_notes`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers)
      - `reference_number` (text, unique)
      - `issue_date` (date)
      - `collection_address` (text)
      - `waste_classification` (text)
      - `waste_description` (text)
      - `waste_quantity` (text)
      - `ewc_code` (text - European Waste Catalogue Code)
      - `notes` (text, optional)
      - `document_path` (text - path to generated PDF)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `waste_transfer_notes` table
    - Add policies for authenticated users and admins

  3. Carrier Information (stored in application, not database)
    - Carrier: WECLEAN4U LTD
    - Registration: CBDU542939
    - Valid until: 9 July 2027
*/

CREATE TABLE IF NOT EXISTS waste_transfer_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  reference_number text UNIQUE NOT NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  collection_address text NOT NULL,
  waste_classification text NOT NULL,
  waste_description text NOT NULL,
  waste_quantity text NOT NULL,
  ewc_code text NOT NULL DEFAULT '18 01 04',
  notes text,
  document_path text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE waste_transfer_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all waste transfer notes"
  ON waste_transfer_notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Customers can view their own waste transfer notes"
  ON waste_transfer_notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = waste_transfer_notes.customer_id
      AND customers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create waste transfer notes"
  ON waste_transfer_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update waste transfer notes"
  ON waste_transfer_notes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_waste_transfer_notes_customer_id ON waste_transfer_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_waste_transfer_notes_reference_number ON waste_transfer_notes(reference_number);
CREATE INDEX IF NOT EXISTS idx_waste_transfer_notes_issue_date ON waste_transfer_notes(issue_date DESC);
