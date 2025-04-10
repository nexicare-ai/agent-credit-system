-- CONSOLIDATED SCHEMA MIGRATION
-- This file consolidates the following migrations:
-- 1. 1740992766863-admin_user.sql
-- 2. 1740992877111-agent_user_credit.sql
-- 3. 1741000000000-generalize_events.sql
-- 4. 1744178492062-update_agent_uuid.sql

-- Make sure we have UUID extension
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'uuid-ossp extension already exists or could not be created';
END $$;

-- Create admin_user table
CREATE TABLE IF NOT EXISTS admin_user (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- CREATE INDEX idx_admin_user_username ON admin_user(username);
-- CREATE INDEX idx_admin_user_email ON admin_user(email);

-- Create agent_user table directly with UUID as primary key
CREATE TABLE IF NOT EXISTS agent_user (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    credit DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS agent_user_email_idx ON agent_user (email);
CREATE INDEX IF NOT EXISTS agent_user_mobile_idx ON agent_user (mobile);

CREATE TABLE agent_event (
    id VARCHAR(26) PRIMARY KEY,
    event_type VARCHAR NOT NULL,
    target_id VARCHAR(36) NOT NULL,
    event_data JSONB NOT NULL,
    description TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_id) REFERENCES agent_user(id) ON DELETE CASCADE
);

-- Create indices for faster queries
CREATE INDEX idx_agent_event_target_id ON agent_event (target_id);
CREATE INDEX idx_agent_event_event_type ON agent_event (event_type);
CREATE INDEX idx_agent_event_timestamp ON agent_event (timestamp);
