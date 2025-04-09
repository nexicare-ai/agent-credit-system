from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
import uuid
from datetime import datetime

from ..database import Base

class CMSUser(Base):
    __tablename__ = 'cms_user'

    mobile = Column(String, primary_key=True)  # Mobile number as primary key
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    def __init__(self, mobile, email, name):
        self.mobile = mobile
        self.email = email
        self.name = name

    @staticmethod
    def find_by_mobile(mobile, db):
        return db.query(CMSUser).filter(CMSUser.mobile == mobile).first()

    @staticmethod
    def find_by_email(email, db):
        return db.query(CMSUser).filter(CMSUser.email == email).first()

    @staticmethod
    def create_user(mobile, email, name, db):
        user = CMSUser(mobile=mobile, email=email, name=name)
        db.add(user)
        db.commit()
        return user

    @staticmethod
    def get_all_users(db, skip=0, limit=100):
        return db.query(CMSUser).offset(skip).limit(limit).all()

    def update_user(self, email=None, name=None, db=None):
        if email:
            self.email = email
        if name:
            self.name = name

        if db:
            db.commit()

        return self

    def __repr__(self):
        return f"<CMSUser(mobile='{self.mobile}', email='{self.email}', name='{self.name}')>"
