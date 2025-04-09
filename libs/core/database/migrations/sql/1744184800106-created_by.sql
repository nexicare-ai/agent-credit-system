ALTER TABLE agent_event ADD COLUMN created_by VARCHAR(36) DEFAULT NULL;
ALTER TABLE agent_event ADD FOREIGN KEY (created_by) REFERENCES admin_user(id);
-- Cannot use subqueries in generated columns, so we need to create a trigger instead
ALTER TABLE agent_event ADD COLUMN created_by_username VARCHAR(255);

-- Create a function to update the username
CREATE OR REPLACE FUNCTION update_created_by_username()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by_username := (SELECT username FROM admin_user WHERE id = NEW.created_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set username on insert and update
CREATE TRIGGER set_created_by_username
BEFORE INSERT OR UPDATE ON agent_event
FOR EACH ROW
WHEN (NEW.created_by IS NOT NULL)
EXECUTE FUNCTION update_created_by_username();

-- Update existing records
UPDATE agent_event
SET created_by_username = (SELECT username FROM admin_user WHERE id = created_by)
WHERE created_by IS NOT NULL;