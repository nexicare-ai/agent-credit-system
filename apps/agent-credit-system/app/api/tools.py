from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any, Union
from decimal import Decimal

from app.models.purchasable import PurchasableResponse, PurchasablesList
from app.models.consumable import ConsumableResponse, ConsumablesList
from app.models.agent_user import AgentUserCreate, AgentUserResponse

from libs.core.database import get_nexi_db
from libs.core.entities.agent_user import AgentUser
from libs.core.entities.purchasable import Purchasable
from libs.core.entities.consumable import Consumable

router = APIRouter()

# Models for the tools

class PurchaseRequest(BaseModel):
    purchasable_id: str
    agent_user_id: str
    count: int = 1
    description: Optional[str] = None

class PurchaseResponse(BaseModel):
    success: bool
    user: AgentUserResponse
    purchasable: PurchasableResponse
    amount: Decimal
    previous_balance: Decimal
    new_balance: Decimal

class StandardResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None

# Tool endpoints

@router.get("/list_purchasables", response_model=StandardResponse)
async def list_purchasables(
    db: Session = Depends(get_nexi_db)
):
    """
    List all available purchasable products
    """
    purchasables = Purchasable.get_all_purchasables(db)
    total = db.query(Purchasable).count()
    return {
        "success": True,
        "data": {"purchasables": [p.to_dict() for p in purchasables], "total": total},
        "message": "Purchasables retrieved successfully"
    }

@router.get("/list_consumables", response_model=StandardResponse)
async def list_consumables(
    db: Session = Depends(get_nexi_db)
):
    """
    List all available consumable products
    """
    consumables = Consumable.get_all_consumables(db)
    total = db.query(Consumable).count()
    return {
        "success": True,
        "data": {"consumables": [c.to_dict() for c in consumables], "total": total},
        "message": "Consumables retrieved successfully"
    }

@router.post("/create_purchase_request", response_model=StandardResponse)
async def create_purchase_request(
    purchase_data: PurchaseRequest,
    db: Session = Depends(get_nexi_db)
):
    """
    Create a purchase request for a purchasable product
    """
    # Get the purchasable
    purchasable = Purchasable.find_by_id(purchase_data.purchasable_id, db)
    if not purchasable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchasable not found"
        )

    # Get the user
    user = AgentUser.find_by_id(purchase_data.agent_user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Calculate the amount to add
    count = purchase_data.count
    amount = purchasable.credit_amount * count

    # Get current credit balance
    previous_balance = user.credit

    # Calculate new balance
    new_balance = previous_balance + amount

    # Update user credit
    user.credit = new_balance
    db.commit()

    # Create a description for the credit event if none provided
    description = purchase_data.description or f"Applied {count} {purchasable.name}" + ("s" if count > 1 else "")

    # Create credit event for event sourcing
    event = AgentUser.create_credit_event(
        target_id=user.id,
        amount=amount,
        previous_balance=previous_balance,
        new_balance=new_balance,
        description=description,
        purchasable_name=purchasable.name,
        count=count,
        db=db
    )

    return {
        "success": True,
        "data": {
            "user": user.to_dict(),
            "purchasable": purchasable.to_dict(),
            "amount": amount,
            "previous_balance": previous_balance,
            "new_balance": new_balance
        },
        "message": "Purchase completed successfully"
    }

@router.post("/register_agent_user", response_model=StandardResponse)
async def register_agent_user(
    request: Request,
    db: Session = Depends(get_nexi_db)
):
    """
    Register a new agent user with the provided name, mobile, and email
    """
    # Get the request body
    body: AgentUserCreate = await request.json()

    # Check if mobile already exists
    if AgentUser.find_by_mobile(body["mobile"], db):
        return {
            "success": False,
            "message": "Mobile number already registered"
        }

    # Check if email already exists
    if AgentUser.find_by_email(body["email"], db):
        return {
            "success": False,
            "message": "Email already registered"
        }

    # Create user data model
    user_data = AgentUserCreate(
        name=body["name"],
        mobile=body["mobile"],
        email=body["email"],
        credit=Decimal(0)
    )

    # Create new agent user
    user = AgentUser.create_user(
        mobile=user_data.mobile,
        email=user_data.email,
        name=user_data.name,
        credit=0,
        db=db
    )

    return {
        "success": True,
        "data": {"user": user.to_dict()},
        "message": "Agent user registered successfully"
    }

@router.get("/get_agent_user/{mobile}", response_model=StandardResponse)
async def get_agent_user(
    mobile: str,
    db: Session = Depends(get_nexi_db)
):
    """
    Get agent user details by mobile number
    """
    user = AgentUser.find_by_mobile(mobile, db)
    if not user:
        return {
            "success": False,
            "message": "User not found"
        }
    return {
        "success": True,
        "data": {"user": user.to_dict()},
        "message": "Agent user retrieved successfully"
    }
