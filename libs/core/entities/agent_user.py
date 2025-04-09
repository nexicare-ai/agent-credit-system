from sqlalchemy import Column, String, DateTime, Numeric
from sqlalchemy.sql import func
import uuid
from datetime import datetime

from ..database import Base

class AgentUser(Base):
    __tablename__ = 'agent_user'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    mobile = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    credit = Column(Numeric(18, 2), nullable=False, default=0.00)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    def __init__(self, mobile, email, name, credit=0.00, id=None):
        self.id = id or str(uuid.uuid4())
        self.mobile = mobile
        self.email = email
        self.name = name
        self.credit = credit

    @staticmethod
    def find_by_id(id, db):
        return db.query(AgentUser).filter(AgentUser.id == id).first()

    @staticmethod
    def find_by_mobile(mobile, db):
        return db.query(AgentUser).filter(AgentUser.mobile == mobile).first()

    @staticmethod
    def find_by_email(email, db):
        return db.query(AgentUser).filter(AgentUser.email == email).first()

    @staticmethod
    def create_user(mobile, email, name, db, credit=0.00, id=None):
        user = AgentUser(mobile=mobile, email=email, name=name, credit=credit, id=id)
        db.add(user)
        db.commit()
        return user

    @staticmethod
    def get_all_users(db, skip=0, limit=100):
        return db.query(AgentUser).offset(skip).limit(limit).all()

    def update_user(self, email=None, name=None, db=None):
        if email:
            self.email = email
        if name:
            self.name = name

        if db:
            db.commit()

        return self

    def __repr__(self):
        return f"<AgentUser(id='{self.id}', mobile='{self.mobile}', email='{self.email}', name='{self.name}', credit='{self.credit}')>"
