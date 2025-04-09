from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from passlib.hash import bcrypt
import uuid
from datetime import datetime

from ..database import Base

class AdminUser(Base):
    __tablename__ = 'admin_user'

    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    last_login = Column(DateTime, nullable=True)

    def __init__(self, username, email, password, id=None, is_active=True):
        self.id = id or str(uuid.uuid4())
        self.username = username
        self.email = email
        self.password_hash = self.hash_password(password)
        self.is_active = is_active

    @staticmethod
    def hash_password(password):
        return bcrypt.hash(password)

    def verify_password(self, password):
        return bcrypt.verify(password, self.password_hash)

    def update_last_login(self):
        self.last_login = datetime.now()

    @staticmethod
    def find_by_username(username, db):
        return db.query(AdminUser).filter(AdminUser.username == username).first()

    @staticmethod
    def find_by_email(email, db):
        return db.query(AdminUser).filter(AdminUser.email == email).first()

    @staticmethod
    def find_by_id(id, db):
        return db.query(AdminUser).filter(AdminUser.id == id).first()

    @staticmethod
    def create_admin(username, email, password, db, is_active=True):
        admin = AdminUser(username=username, email=email, password=password, is_active=is_active)
        db.add(admin)
        db.commit()
        return admin

    def __repr__(self):
        return f"<AdminUser(id='{self.id}', username='{self.username}', email='{self.email}')>"