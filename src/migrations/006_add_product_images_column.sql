-- Migration: Add product images column
-- Date: 2024-01-15

-- Add p_images column to store multiple image URLs as JSON
ALTER TABLE products 
ADD COLUMN p_images TEXT;

-- Drop the old p_image_url column  
ALTER TABLE products 
DROP COLUMN p_image_url; 