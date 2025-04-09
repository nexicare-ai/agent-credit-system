-- Create purchasable table
CREATE TABLE IF NOT EXISTS purchasable (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    credit_amount DECIMAL(18, 2) NOT NULL,
    meta_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for faster lookups
CREATE INDEX IF NOT EXISTS purchasable_name_idx ON purchasable (name);
