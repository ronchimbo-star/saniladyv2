/*
  # Make customer user_id optional
  
  1. Changes
    - Make `user_id` column nullable in `customers` table
    - This allows creating customer records for invoicing without requiring user accounts
  
  2. Security
    - Maintain existing RLS policies
    - Customers with user accounts can still access their data via the user_id link
*/

-- Make user_id nullable to allow customers without user accounts
ALTER TABLE customers 
ALTER COLUMN user_id DROP NOT NULL;
