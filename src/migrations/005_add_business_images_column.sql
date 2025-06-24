-- Migration: Add business images column and remove URL column
-- Date: 2024-12-28

-- Add b_images column to store JSON array of image paths
ALTER TABLE businesses ADD COLUMN b_images TEXT;

-- Remove the old b_url column
ALTER TABLE businesses DROP COLUMN IF EXISTS b_url; 