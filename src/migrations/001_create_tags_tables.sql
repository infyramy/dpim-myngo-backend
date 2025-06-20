-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    t_id INT PRIMARY KEY AUTO_INCREMENT,
    t_name VARCHAR(100) NOT NULL,
    t_slug VARCHAR(100) NOT NULL,
    t_user_id INT NOT NULL,
    t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tag_per_user (t_name, t_user_id),
    UNIQUE KEY unique_slug_per_user (t_slug, t_user_id),
    INDEX idx_user_id (t_user_id),
    INDEX idx_name (t_name),
    INDEX idx_slug (t_slug)
);

-- Create product_tags junction table
CREATE TABLE IF NOT EXISTS product_tags (
    pt_id INT PRIMARY KEY AUTO_INCREMENT,
    pt_product_id INT NOT NULL,
    pt_tag_id INT NOT NULL,
    pt_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_product_tag (pt_product_id, pt_tag_id),
    INDEX idx_product_id (pt_product_id),
    INDEX idx_tag_id (pt_tag_id),
    FOREIGN KEY (pt_product_id) REFERENCES products(p_id) ON DELETE CASCADE,
    FOREIGN KEY (pt_tag_id) REFERENCES tags(t_id) ON DELETE CASCADE
); 