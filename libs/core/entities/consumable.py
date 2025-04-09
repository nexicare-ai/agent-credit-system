from sqlalchemy import Column, String, DateTime, Numeric, JSON
from sqlalchemy.sql import func
import uuid
from datetime import datetime

from ..database import Base

class Consumable(Base):
    __tablename__ = 'consumable'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    cost = Column(Numeric(18, 2), nullable=False)
    meta_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    def __init__(self, name, cost, meta_data=None, id=None):
        self.id = id or str(uuid.uuid4())
        self.name = name
        self.cost = cost
        self.meta_data = meta_data or {}

    @staticmethod
    def find_by_id(id, db):
        return db.query(Consumable).filter(Consumable.id == id).first()

    @staticmethod
    def create_consumable(name, cost, db, meta_data=None, id=None):
        consumable = Consumable(name=name, cost=cost, meta_data=meta_data, id=id)
        db.add(consumable)
        db.commit()
        return consumable

    @staticmethod
    def get_all_consumables(db, skip=0, limit=100):
        return db.query(Consumable).order_by(Consumable.name).offset(skip).limit(limit).all()

    def update_consumable(self, name=None, cost=None, meta_data=None, db=None):
        if name:
            self.name = name
        if cost is not None:
            self.cost = cost
        if meta_data is not None:
            self.meta_data = meta_data

        if db:
            db.commit()

        return self

    def __repr__(self):
        return f"<Consumable(id='{self.id}', name='{self.name}', cost='{self.cost}')>"
