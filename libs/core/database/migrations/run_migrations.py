import os

def run_migrations():
    """
    Run database migrations.
    """
    from sqlalchemy import create_engine, text
    from libs.core.database.get_nexi_db import get_db_engine
    from libs.core.logs import logger
    import dotenv
    dotenv.load_dotenv()

    try:
        # Get database engine
        print("DB_HOST", os.environ['DB_HOST'])
        engine = get_db_engine()

        # Create migrations table if it doesn't exist
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS migrations (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                -- ALTER TABLE migrations RENAME COLUMN filename TO name;
                -- ALTER TABLE migrations RENAME COLUMN applied_at TO timestamp;
            """))
            conn.commit()

        # Get list of migration files
        migration_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sql')
        # print(f"Migration directory: {migration_dir}")
        migration_files = sorted([f for f in os.listdir(migration_dir)
                                if f.endswith('.sql') and f != 'schema.sql'])

        print(f"Running migrations from {migration_files}")
        # Execute each migration file
        with engine.connect() as conn:
            for migration_file in migration_files:
                # Check if migration was already applied
                result = conn.execute(
                    text("SELECT id FROM migrations WHERE name = :name"),
                    {"name": migration_file}
                )
                if result.fetchone() is None:
                    # Read and execute migration
                    with open(os.path.join(migration_dir, migration_file)) as f:
                        migration_sql = f.read()
                        try:
                            conn.execute(text(migration_sql))

                            # Record migration
                            conn.execute(
                                text("INSERT INTO migrations (name) VALUES (:name)"),
                                {"name": migration_file}
                            )
                            conn.commit()
                            logger.info(f"Applied migration: {migration_file}")
                        except Exception as e:
                            conn.rollback()
                            logger.error(f"Error applying migration: {str(e)}")
                            raise e
                else:
                    logger.info(f"Skipping migration: {migration_file} (already applied)")

        logger.info("Database migrations completed successfully")

    except Exception as e:
        logger.error(f"Error running migrations: {str(e)}")
        raise
