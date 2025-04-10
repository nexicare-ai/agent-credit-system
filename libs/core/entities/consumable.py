from sqlalchemy import Column, String, DateTime, Numeric, JSON
from sqlalchemy.sql import func
import uuid
from decimal import Decimal
from datetime import datetime

from ..database import Base
from .agent_user import AgentUser
from .agent_event import AgentEvent
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

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "cost": self.cost,
            "meta_data": self.meta_data
        }

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

    @staticmethod
    def apply_consumable(consumable_id, user_id, count, description, current_user, db):
        try:
            consumable = Consumable.find_by_id(consumable_id, db)
            if not consumable:
                raise ValueError("Consumable not found")

            user = AgentUser.find_by_id(user_id, db)
            if not user:
                raise ValueError("User not found")

            single_amount = Decimal('-' + str(consumable.cost))
            amount = single_amount * count

            previous_balance = user.credit
            new_balance = previous_balance + amount

            if new_balance < 0:
                raise ValueError("User doesn't have enough credit")

            # Update user credit
            user.credit = new_balance
            db.commit()

            created_by = current_user.id if current_user else None
            description = description or f"Applied {count} {consumable.name}" + ("s" if count > 1 else "")

            # Create credit event for event sourcing
            AgentEvent.create_credit_event(
                target_id=user.id,
                amount=amount,
                previous_balance=previous_balance,
                new_balance=new_balance,
                consumable_name=consumable.name,
                count=count,
                description=description,
                created_by=created_by,
                db=db
            )

            return {
                "success": True,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "credit": float(user.credit)
                },
            }
        except Exception as e:
            db.rollback()
            raise e

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
