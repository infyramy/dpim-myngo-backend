-- Add product link field to products table
ALTER TABLE products ADD COLUMN p_link TEXT DEFAULT NULL AFTER p_image_url;

-- Add index for faster searches on link field
CREATE INDEX idx_product_link ON products(p_link(255)); 