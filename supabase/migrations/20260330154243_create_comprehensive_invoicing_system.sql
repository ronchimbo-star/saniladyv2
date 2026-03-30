/*
  # Comprehensive Invoicing System
  
  ## Overview
  Creates a complete invoicing system supporting both proforma and regular invoices with line items,
  customer details, payment tracking, and document generation.
  
  ## New Tables
  
  ### `invoice_line_items`
  - `id` (uuid, primary key)
  - `invoice_id` (uuid, foreign key to invoices_v2)
  - `description` (text) - Item description
  - `quantity` (integer) - Number of units
  - `unit_price` (numeric) - Price per unit
  - `line_total` (numeric) - Calculated total for this line
  - `sort_order` (integer) - Display order
  - `created_at` (timestamptz)
  
  ### `invoices_v2`
  - `id` (uuid, primary key)
  - `invoice_number` (text, unique) - Invoice/Proforma number (e.g., SLPF-2026-001)
  - `invoice_type` (text) - 'proforma' or 'invoice'
  - `customer_id` (uuid, foreign key) - Link to customers table
  - `issue_date` (date) - Date invoice issued
  - `due_date` (date) - Payment due date
  - `valid_until` (date) - For proforma invoices
  - `reference` (text) - Customer reference
  - `billing_company_name` (text)
  - `billing_address_line_1` (text)
  - `billing_address_line_2` (text)
  - `billing_city` (text)
  - `billing_postcode` (text)
  - `billing_country` (text)
  - `service_location_name` (text) - Site name
  - `service_address_line_1` (text)
  - `service_address_line_2` (text)
  - `service_city` (text)
  - `service_postcode` (text)
  - `service_country` (text)
  - `subtotal` (numeric) - Total before VAT
  - `vat_rate` (numeric) - VAT percentage (e.g., 20)
  - `vat_amount` (numeric) - Calculated VAT
  - `total_amount` (numeric) - Total including VAT
  - `status` (text) - 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  - `payment_terms` (text) - Payment terms description
  - `notes` (text) - Additional notes
  - `paid_date` (timestamptz) - When payment received
  - `created_by` (uuid) - User who created
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Admins can view and manage all invoices
  - Customers can only view their own invoices
  - Invoice numbers are auto-generated with proper sequencing
*/

-- Create invoices_v2 table
CREATE TABLE IF NOT EXISTS invoices_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  invoice_type text NOT NULL CHECK (invoice_type IN ('proforma', 'invoice')),
  customer_id uuid REFERENCES customers(id) ON DELETE RESTRICT,
  
  -- Dates
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  valid_until date,
  
  -- Customer reference
  reference text,
  
  -- Billing address (registered office for invoicing)
  billing_company_name text NOT NULL,
  billing_address_line_1 text NOT NULL,
  billing_address_line_2 text,
  billing_city text NOT NULL,
  billing_postcode text NOT NULL,
  billing_country text NOT NULL DEFAULT 'United Kingdom',
  
  -- Service location (actual site)
  service_location_name text,
  service_address_line_1 text,
  service_address_line_2 text,
  service_city text,
  service_postcode text,
  service_country text DEFAULT 'United Kingdom',
  
  -- Financial details
  subtotal numeric(10,2) NOT NULL DEFAULT 0.00,
  vat_rate numeric(5,2) NOT NULL DEFAULT 20.00,
  vat_amount numeric(10,2) NOT NULL DEFAULT 0.00,
  total_amount numeric(10,2) NOT NULL DEFAULT 0.00,
  
  -- Status and payment
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  payment_terms text,
  notes text,
  paid_date timestamptz,
  
  -- Audit
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice_line_items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices_v2(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL,
  line_total numeric(10,2) NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_v2_customer_id ON invoices_v2(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_v2_status ON invoices_v2(status);
CREATE INDEX IF NOT EXISTS idx_invoices_v2_invoice_type ON invoices_v2(invoice_type);
CREATE INDEX IF NOT EXISTS idx_invoices_v2_issue_date ON invoices_v2(issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);

-- Enable RLS
ALTER TABLE invoices_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices_v2

-- Admins can do everything
CREATE POLICY "Admins can view all invoices"
  ON invoices_v2 FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert invoices"
  ON invoices_v2 FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update invoices"
  ON invoices_v2 FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete invoices"
  ON invoices_v2 FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Customers can view their own invoices
CREATE POLICY "Customers can view own invoices"
  ON invoices_v2 FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for invoice_line_items

-- Admins can manage all line items
CREATE POLICY "Admins can view all line items"
  ON invoice_line_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert line items"
  ON invoice_line_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update line items"
  ON invoice_line_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete line items"
  ON invoice_line_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Customers can view line items for their invoices
CREATE POLICY "Customers can view own line items"
  ON invoice_line_items FOR SELECT
  TO authenticated
  USING (
    invoice_id IN (
      SELECT id FROM invoices_v2
      WHERE customer_id IN (
        SELECT id FROM customers WHERE user_id = auth.uid()
      )
    )
  );

-- Function to generate next invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(invoice_type_param text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  prefix text;
  year_part text;
  next_number integer;
  invoice_num text;
BEGIN
  -- Set prefix based on type
  prefix := CASE 
    WHEN invoice_type_param = 'proforma' THEN 'SLPF'
    ELSE 'SLINV'
  END;
  
  -- Get current year
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Find the highest number for this year and type
  SELECT COALESCE(
    MAX(
      CAST(
        SUBSTRING(invoice_number FROM '[0-9]+$') AS integer
      )
    ),
    0
  ) + 1
  INTO next_number
  FROM invoices_v2
  WHERE invoice_number LIKE prefix || '-' || year_part || '-%';
  
  -- Format as prefix-YYYY-NNN
  invoice_num := prefix || '-' || year_part || '-' || LPAD(next_number::text, 3, '0');
  
  RETURN invoice_num;
END;
$$;

-- Function to update invoice totals when line items change
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  invoice_subtotal numeric;
  invoice_vat_amount numeric;
  invoice_total numeric;
  invoice_vat_rate numeric;
BEGIN
  -- Get the VAT rate for this invoice
  SELECT vat_rate INTO invoice_vat_rate
  FROM invoices_v2
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Calculate new subtotal from all line items
  SELECT COALESCE(SUM(line_total), 0)
  INTO invoice_subtotal
  FROM invoice_line_items
  WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Calculate VAT and total
  invoice_vat_amount := ROUND(invoice_subtotal * invoice_vat_rate / 100, 2);
  invoice_total := invoice_subtotal + invoice_vat_amount;
  
  -- Update the invoice
  UPDATE invoices_v2
  SET 
    subtotal = invoice_subtotal,
    vat_amount = invoice_vat_amount,
    total_amount = invoice_total,
    updated_at = now()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger to auto-update invoice totals
DROP TRIGGER IF EXISTS trigger_update_invoice_totals ON invoice_line_items;
CREATE TRIGGER trigger_update_invoice_totals
  AFTER INSERT OR UPDATE OR DELETE ON invoice_line_items
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_totals();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_invoices_v2_updated_at ON invoices_v2;
CREATE TRIGGER trigger_invoices_v2_updated_at
  BEFORE UPDATE ON invoices_v2
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();