from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from decimal import Decimal

from app.models.purchasable import (
    PurchasableCreate, PurchasableUpdate, PurchasableResponse,
    PurchasablesList, ApplyPurchasableRequest
)
from app.dependencies.auth import get_current_active_user
from libs.core.database import get_nexi_db
from libs.core.entities.admin_user import AdminUser
from libs.core.entities.agent_user import AgentUser
from libs.core.entities.agent_event import AgentEvent
from libs.core.entities.purchasable import Purchasable

router = APIRouter()

@router.post("", response_model=PurchasableResponse, status_code=status.HTTP_201_CREATED)
async def create_purchasable(
    purchasable_data: PurchasableCreate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Create a new purchasable product
    """
    # Create new purchasable
    purchasable = Purchasable.create_purchasable(
        name=purchasable_data.name,
        price=purchasable_data.price,
        credit_amount=purchasable_data.credit_amount,
        meta_data=purchasable_data.meta_data,
        db=db
    )

    return purchasable

@router.get("", response_model=PurchasablesList)
async def list_purchasables(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    List all purchasable products with pagination
    """
    purchasables = Purchasable.get_all_purchasables(db, skip=skip, limit=limit)
    total = db.query(Purchasable).count()
    return {"purchasables": purchasables, "total": total}

@router.get("/{purchasable_id}", response_model=PurchasableResponse)
async def get_purchasable(
    purchasable_id: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Get a specific purchasable by ID
    """
    purchasable = Purchasable.find_by_id(purchasable_id, db)
    if not purchasable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchasable not found"
        )
    return purchasable

@router.put("/{purchasable_id}", response_model=PurchasableResponse)
async def update_purchasable(
    purchasable_id: str,
    purchasable_data: PurchasableUpdate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Update a purchasable product
    """
    purchasable = Purchasable.find_by_id(purchasable_id, db)
    if not purchasable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchasable not found"
        )

    # Update purchasable
    updated_purchasable = purchasable.update_purchasable(
        name=purchasable_data.name,
        price=purchasable_data.price,
        credit_amount=purchasable_data.credit_amount,
        meta_data=purchasable_data.meta_data,
        db=db
    )

    return updated_purchasable

@router.delete("/{purchasable_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_purchasable(
    purchasable_id: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Delete a purchasable product
    """
    purchasable = Purchasable.find_by_id(purchasable_id, db)
    if not purchasable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchasable not found"
        )

    db.delete(purchasable)
    db.commit()

    return None

@router.post("/{purchasable_id}/apply", status_code=status.HTTP_200_OK)
async def apply_purchasable(
    purchasable_id: str,
    apply_data: ApplyPurchasableRequest,
    db: Session = Depends(get_nexi_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """
    Apply a purchasable to a user, adding to their credit
    """
    # Get the purchasable
    purchasable = Purchasable.find_by_id(purchasable_id, db)
    if not purchasable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchasable not found"
        )

    # Get the user
    user = AgentUser.find_by_id(apply_data.user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Get the count (default is 1)
    count = apply_data.count

    # Calculate the amount to add (positive amount since we're adding credits)
    # Multiply by count to apply multiple purchasables
    single_amount = purchasable.credit_amount
    amount = single_amount * count

    # Get current credit balance
    previous_balance = user.credit

    # Calculate new balance
    new_balance = previous_balance + amount

    # Update user credit
    user.credit = new_balance
    db.commit()

    # Get current user ID for tracking who made the change
    created_by = current_user.id if current_user else None

    # Create a description for the credit event if none provided
    description = apply_data.description or f"Applied {count} {purchasable.name}" + ("s" if count > 1 else "")

    # Create credit event for event sourcing
    event = AgentEvent.create_credit_event(
        target_id=user.id,
        amount=amount,
        previous_balance=previous_balance,
        new_balance=new_balance,
        description=description,
        purchasable_name=purchasable.name,
        count=count,
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
        "purchasable": {
            "id": purchasable.id,
            "name": purchasable.name,
            "price": float(purchasable.price),
            "credit_amount": float(purchasable.credit_amount),
            "count": count
        },
        "event": {
            "id": event.id,
            "amount": float(amount),
            "previous_balance": float(previous_balance),
            "new_balance": float(new_balance)
        }
    }
