-- Add MOF Registration Number column to businesses table
ALTER TABLE businesses ADD COLUMN b_mof_registration_number VARCHAR(100) NULL AFTER b_mof_registration;

-- Add index for better performance on MOF registration number searches
CREATE INDEX idx_mof_registration_number ON businesses(b_mof_registration_number); 