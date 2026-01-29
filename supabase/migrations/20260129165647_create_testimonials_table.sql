/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key) - unique identifier
      - `service_type` (text) - 'period-dignity' or 'waste-services'
      - `company_name` (text) - name of the company
      - `contact_name` (text) - name of the person giving testimonial
      - `contact_role` (text) - job title/role of the person
      - `testimonial_text` (text) - the testimonial content
      - `rating` (integer) - star rating (1-5)
      - `image_url` (text) - URL to testimonial image
      - `is_published` (boolean) - whether to display on site
      - `display_order` (integer) - order to display testimonials
      - `created_at` (timestamptz) - creation timestamp
      - `updated_at` (timestamptz) - last update timestamp
      
  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access (published testimonials only)
    - Add policy for admin-only write access
    
  3. Notes
    - Testimonials can be filtered by service type
    - Only published testimonials are visible to public
    - Admins can create, update, and delete testimonials
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_role text DEFAULT '',
  testimonial_text text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url text DEFAULT '',
  is_published boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Only admins can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Only admins can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Only admins can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM testimonials WHERE service_type = 'period-dignity' LIMIT 1) THEN
    INSERT INTO testimonials (service_type, company_name, contact_name, contact_role, testimonial_text, rating, image_url, display_order) VALUES
    ('period-dignity', 'TechCorp Solutions', 'Sarah Matthews', 'HR Director', 'Implementing SaniLady''s Period Dignity programme has been transformational for our workplace culture. Our female employees feel valued and supported, and we''ve seen a noticeable increase in workplace satisfaction. The service is discreet, professional, and hassle-free.', 5, 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
    ('period-dignity', 'Green Valley Academy', 'Emma Thompson', 'Facilities Manager', 'As a school, providing period dignity was essential for us. SaniLady made implementation seamless. Students and staff appreciate having free access to quality period products. It''s removed a significant barrier and created a more inclusive environment.', 5, 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800', 2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM testimonials WHERE service_type = 'waste-services' LIMIT 1) THEN
    INSERT INTO testimonials (service_type, company_name, contact_name, contact_role, testimonial_text, rating, image_url, display_order) VALUES
    ('waste-services', 'Riverside Office Park', 'David Chen', 'Operations Manager', 'SaniLady''s waste management service is exceptional. Reliable collections, professional staff, and complete compliance documentation. We never have to worry about sanitary waste disposal. Their service has exceeded our expectations in every way.', 5, 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
    ('waste-services', 'Meadowbrook Retail Centre', 'Lisa Williams', 'Facilities Director', 'After switching to SaniLady, we''ve experienced consistently excellent service. The bins are always serviced on time, cleaned thoroughly, and the team is professional and discreet. Great value for money and peace of mind knowing we''re fully compliant.', 5, 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800', 2);
  END IF;
END $$;
