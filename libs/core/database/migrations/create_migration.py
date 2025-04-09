import time
import sys
import os


def migration_up():
    migration_name = sys.argv[1] if len(sys.argv) > 1 else ""
    # if not migration_name:
    #     print("Error: Migration name argument is required")
    #     sys.exit(1)
    migration_filename = f"{ int(time.time() * 1000)}-{migration_name}.sql"

    # Create migration file in the sql directory
    migration_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sql')
    migration_path = os.path.join(migration_dir, migration_filename)

    with open(migration_path, 'w') as f:
        f.write("")

    print(f"Created migration file: {migration_path}")

if __name__ == '__main__':
    migration_up()
