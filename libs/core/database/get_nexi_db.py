from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime
from typing import Generator
from sqlalchemy.exc import OperationalError, StatementError
from sqlalchemy.orm.query import Query as _Query
from sqlalchemy.orm import Session, declarative_base
from libs.core.logs import logger
from libs.core.configs import config
# Create base class for declarative models
Base = declarative_base()

# Database connection setup
def get_db_engine():
    db_config = config.db.base
    db_host = db_config.host
    db_port = db_config.port
    db_name = db_config.name
    db_user = db_config.user
    db_password = db_config.password
    print(f"[core/database] DB_HOST: {db_host}, DB_PORT: {db_port}, DB_NAME: {db_name}, DB_USER: {db_user}")
    engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}',
        # Increase pool size for better throughput
        pool_size=10,
        # Limit max overflow to prevent too many connections
        max_overflow=20,
        # Set pool_recycle to a lower value to ensure connections are recycled before they're terminated by the server
        # Most PostgreSQL servers have a default timeout of 1-2 hours
        pool_recycle=1800,  # 30 minutes
        # Enable pool_pre_ping to detect stale connections before using them
        pool_pre_ping=True,
        # Enable pool timeout to prevent waiting too long for connections
        pool_timeout=30,
        # Use LIFO for better performance with intermittent usage patterns
        pool_use_lifo=True,
        # Enable echo when debugging
        echo=config.environment == 'demo' or config.environment == 'local' or config.environment == 'staging',
        # Set connect_args with keepalives options to prevent server-side timeouts
        connect_args={
            'sslmode': 'disable',
            'keepalives': 1,
            'keepalives_idle': 30,
            'keepalives_interval': 10,
            'keepalives_count': 5
        })
    return engine

# Create database tables
print("--- Creating db engine")
engine = get_db_engine()
print("--- Creating db tables")
Base.metadata.create_all(engine)

SessionLocal: Session = sessionmaker(
    autocommit=False,
    expire_on_commit=False,
    autoflush=False,
    bind=engine,
)

# class GenDBInterface:
#     # create db session
#     session: Session = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)

#     def begin(self):
#         return self.session.begin()

def get_nexi_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    except OperationalError as e:
        # Log the error and rollback if needed
        logger.error(f"Database operational error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

def create_nexi_db_session():
    return SessionLocal()
