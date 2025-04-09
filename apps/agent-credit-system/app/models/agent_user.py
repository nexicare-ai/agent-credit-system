from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from decimal import Decimal
from datetime import datetime

# Agent User Models
class AgentUserBase(BaseModel):
    mobile: str
    email: EmailStr
    name: str

class AgentUserCreate(AgentUserBase):
    credit: Decimal = Field(default=0.00, ge=0)

class AgentUserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None

class AgentUserResponse(AgentUserBase):
    id: str
    credit: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AgentUsersList(BaseModel):
    users: List[AgentUserResponse]
    total: int

# Event Models
class EventBase(BaseModel):
    event_type: str
    description: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: str
    target_id: str
    event_data: Dict[str, Any]
    timestamp: datetime

    class Config:
        orm_mode = True

class EventsList(BaseModel):
    events: List[EventResponse]
    total: int

# Credit Event Models
class CreditEventBase(BaseModel):
    amount: Decimal
    event_type: str = "agent_credit"
    description: Optional[str] = None

class CreditEventCreate(CreditEventBase):
    pass

class CreditEventResponse(EventResponse):
    @property
    def amount(self) -> Decimal:
        return Decimal(self.event_data.get("amount", "0"))

    @property
    def previous_balance(self) -> Decimal:
        return Decimal(self.event_data.get("previous_balance", "0"))

    @property
    def new_balance(self) -> Decimal:
        return Decimal(self.event_data.get("new_balance", "0"))

class CreditEventsList(BaseModel):
    events: List[CreditEventResponse]
    total: int

# Add BaseEventResponse and BaseEventsList for backward compatibility
BaseEventResponse = EventResponse
BaseEventsList = EventsList
