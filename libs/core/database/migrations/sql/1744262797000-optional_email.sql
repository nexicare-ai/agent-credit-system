-- Make email field nullable in agent_user table
ALTER TABLE agent_user ALTER COLUMN email DROP NOT NULL;

-- Add a comment to the migration
COMMENT ON TABLE agent_user IS 'Agent users table with optional email';

-- NOTE: This migration makes email optional in the agent_user table,
-- allowing agents to be registered without providing an email address
-- while keeping email uniqueness constraint for users who do provide it.
