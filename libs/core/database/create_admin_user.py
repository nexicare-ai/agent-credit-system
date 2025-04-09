import os
import sys
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from libs.core.database.get_nexi_db import get_db_engine
from libs.core.entities.admin_user import AdminUser
from libs.core.logs import logger

def create_admin_user(username, email, password):
    """
    Create an admin user in the database.

    Args:
        username (str): The username for the admin user
        email (str): The email for the admin user
        password (str): The password for the admin user

    Returns:
        AdminUser: The created admin user object
    """
    load_dotenv()

    try:
        # Get database engine
        engine = get_db_engine()

        # Create session
        Session = sessionmaker(bind=engine)
        session = Session()

        # Check if user already exists
        existing_user = AdminUser.find_by_username(username, session)
        if existing_user:
            logger.info(f"Admin user '{username}' already exists")
            return existing_user

        # Create admin user
        admin_user = AdminUser.create_admin(username, email, password, session)
        logger.info(f"Created admin user: {username} ({email})")

        return admin_user

    except IntegrityError as e:
        logger.error(f"Error creating admin user: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating admin user: {str(e)}")
        raise

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print("Usage: python create_admin_user.py <username> <email> <password>")
        sys.exit(1)

    username = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]

    create_admin_user(username, email, password)
