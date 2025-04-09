from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class CMSUserBase(BaseModel):
    email: EmailStr
    name: str

class CMSUserCreate(CMSUserBase):
    mobile: str = Field(..., description="Mobile number with country code (e.g., +85212345678)")

class CMSUserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None

class CMSUserResponse(CMSUserBase):
    mobile: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class CMSUsersList(BaseModel):
    users: list[CMSUserResponse]
    total: int
