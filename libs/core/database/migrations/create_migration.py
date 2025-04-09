import time
import sys


def migration_up():
    migration_name = sys.argv[1] if len(sys.argv) > 1 else ""
    # if not migration_name:
    #     print("Error: Migration name argument is required")
    #     sys.exit(1)
    migration_filename = f"{ int(time.time() * 1000)}-{migration_name}.sql"

    with open(migration_filename, 'w') as f:
        f.write("")

    print(f"Created migration file: {migration_filename}")

if __name__ == '__main__':
    migration_up()