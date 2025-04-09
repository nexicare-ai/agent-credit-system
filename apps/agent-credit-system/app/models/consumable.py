from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from decimal import Decimal
from datetime import datetime

# Consumable Models
class ConsumableBase(BaseModel):
    name: str
    cost: Decimal = Field(gt=0)
    meta_data: Optional[Dict[str, Any]] = None

class ConsumableCreate(ConsumableBase):
    pass

class ConsumableUpdate(ConsumableBase):
    name: Optional[str] = None
    cost: Optional[Decimal] = None
    meta_data: Optional[Dict[str, Any]] = None

class ConsumableResponse(ConsumableBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ConsumablesList(BaseModel):
    consumables: List[ConsumableResponse]
    total: int

# Apply Consumable Models
class ApplyConsumableRequest(BaseModel):
    user_id: str
    description: Optional[str] = ""
