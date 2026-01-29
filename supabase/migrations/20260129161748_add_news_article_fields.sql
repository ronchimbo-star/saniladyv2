/*
  # Add missing fields to news_articles table

  1. Changes
    - Add category column
    - Add thumbnail_url column
    - Add thumbnail_alt column
    
  2. Notes
    - Table already exists with other fields
    - Adding these to complete the required structure
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news_articles' AND column_name = 'category'
  ) THEN
    ALTER TABLE news_articles ADD COLUMN category text DEFAULT 'general';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news_articles' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE news_articles ADD COLUMN thumbnail_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news_articles' AND column_name = 'thumbnail_alt'
  ) THEN
    ALTER TABLE news_articles ADD COLUMN thumbnail_alt text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news_articles' AND column_name = 'featured_image_url'
  ) THEN
    ALTER TABLE news_articles ADD COLUMN featured_image_url text DEFAULT '';
  END IF;
END $$;
