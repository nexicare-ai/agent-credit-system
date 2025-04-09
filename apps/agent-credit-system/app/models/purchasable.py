from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from decimal import Decimal
from datetime import datetime

# Purchasable Models
class PurchasableBase(BaseModel):
    name: str
    price: Decimal = Field(gt=0)
    credit_amount: Decimal = Field(gt=0)
    meta_data: Optional[Dict[str, Any]] = None

class PurchasableCreate(PurchasableBase):
    pass

class PurchasableUpdate(PurchasableBase):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    credit_amount: Optional[Decimal] = None
    meta_data: Optional[Dict[str, Any]] = None

class PurchasableResponse(PurchasableBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PurchasablesList(BaseModel):
    purchasables: List[PurchasableResponse]
    total: int

# Apply Purchasable Models
class ApplyPurchasableRequest(BaseModel):
    user_id: str
    count: int = Field(default=1, ge=1, description="Number of purchasables to apply")
    description: Optional[str] = ""
