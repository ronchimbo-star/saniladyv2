/*
  # Add contact email to customers table
  
  1. Changes
    - Add `contact_email` column to `customers` table for invoice communication
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add contact_email field to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS contact_email text;
