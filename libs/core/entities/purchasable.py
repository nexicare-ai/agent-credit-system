from sqlalchemy import Column, String, DateTime, Numeric, JSON
from sqlalchemy.sql import func
import uuid
from datetime import datetime

from ..database import Base

class Purchasable(Base):
    __tablename__ = 'purchasable'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    price = Column(Numeric(18, 2), nullable=False)
    credit_amount = Column(Numeric(18, 2), nullable=False)
    meta_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    def __init__(self, name, price, credit_amount, meta_data=None, id=None):
        self.id = id or str(uuid.uuid4())
        self.name = name
        self.price = price
        self.credit_amount = credit_amount
        self.meta_data = meta_data or {}

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "credit_amount": self.credit_amount,
            "meta_data": self.meta_data
        }

    @staticmethod
    def find_by_id(id, db):
        return db.query(Purchasable).filter(Purchasable.id == id).first()

    @staticmethod
    def create_purchasable(name, price, credit_amount, db, meta_data=None, id=None):
        purchasable = Purchasable(name=name, price=price, credit_amount=credit_amount, meta_data=meta_data, id=id)
        db.add(purchasable)
        db.commit()
        return purchasable

    @staticmethod
    def get_all_purchasables(db, skip=0, limit=100):
        return db.query(Purchasable).order_by(Purchasable.name).offset(skip).limit(limit).all()

    def update_purchasable(self, name=None, price=None, credit_amount=None, meta_data=None, db=None):
        if name:
            self.name = name
        if price is not None:
            self.price = price
        if credit_amount is not None:
            self.credit_amount = credit_amount
        if meta_data is not None:
            self.meta_data = meta_data

        if db:
            db.commit()

        return self

    def __repr__(self):
        return f"<Purchasable(id='{self.id}', name='{self.name}', price='{self.price}', credit_amount='{self.credit_amount}')>"
