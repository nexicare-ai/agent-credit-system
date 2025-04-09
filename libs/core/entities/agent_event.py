from sqlalchemy import Column, String, DateTime, JSON, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
import ulid

from ..database import Base
from .agent_user import AgentUser

class AgentEvent(Base):
    __tablename__ = 'agent_event'

    id = Column(String, primary_key=True, default=lambda: str(ulid.ulid()))
    event_type = Column(String, nullable=False)
    target_id = Column(String, ForeignKey('agent_user.id', ondelete='CASCADE'), nullable=False)
    event_data = Column(JSONB, nullable=False)
    description = Column(Text)
    created_by = Column(String, ForeignKey('admin_user.id', ondelete='SET NULL'), nullable=True)
    created_by_username = Column(String, nullable=True, info={'readonly': True})
    timestamp = Column(DateTime, default=datetime.now)

    def __init__(self, event_type, target_id, event_data, description=None, created_by=None, id=None):
        self.id = id or str(ulid.ulid())
        self.event_type = event_type
        self.target_id = target_id
        self.event_data = event_data
        self.description = description
        self.created_by = created_by

    @staticmethod
    def create_credit_event(target_id, amount, previous_balance, new_balance, consumable_name=None, count=None, purchasable_name=None, description=None, created_by=None, db=None):
        """Create a credit related event for an agent user"""
        event_data = {
            "amount": str(amount),
            "previous_balance": str(previous_balance),
            "new_balance": str(new_balance),
        }

        if consumable_name:
            event_data["consumable_name"] = consumable_name
        if purchasable_name:
            event_data["purchasable_name"] = purchasable_name
        if count:
            event_data["count"] = count

        event = AgentEvent(
            event_type="agent_credit",
            target_id=target_id,
            event_data=event_data,
            description=description,
            created_by=created_by
        )

        if db:
            db.add(event)
            db.commit()

        return event

    @staticmethod
    def get_all_events(db, skip=0, limit=100):
        return db.query(AgentEvent).order_by(AgentEvent.timestamp.desc())\
            .offset(skip).limit(limit).all()

    @staticmethod
    def get_events_by_type(event_type, db, skip=0, limit=100):
        return db.query(AgentEvent).filter(AgentEvent.event_type == event_type)\
            .order_by(AgentEvent.timestamp.desc())\
            .offset(skip).limit(limit).all()

    @staticmethod
    def get_target_events(target_id, db, skip=0, limit=100):
        return db.query(AgentEvent).filter(AgentEvent.target_id == target_id)\
            .order_by(AgentEvent.timestamp.desc())\
            .offset(skip).limit(limit).all()

    @staticmethod
    def count_target_events(target_id, db):
        """Count the total number of events for a specific target"""
        return db.query(AgentEvent).filter(AgentEvent.target_id == target_id).count()

    def __repr__(self):
        return f"<AgentEvent(id='{self.id}', type='{self.event_type}', target='{self.target_id}')>"
