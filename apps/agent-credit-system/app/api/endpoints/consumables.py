from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from decimal import Decimal

from app.models.consumable import (
    ConsumableCreate, ConsumableUpdate, ConsumableResponse,
    ConsumablesList, ApplyConsumableRequest
)
from app.dependencies.auth import get_current_active_user
from libs.core.database import get_nexi_db
from libs.core.entities.admin_user import AdminUser
from libs.core.entities.agent_user import AgentUser
from libs.core.entities.agent_event import AgentEvent
from libs.core.entities.consumable import Consumable

router = APIRouter()

@router.post("", response_model=ConsumableResponse, status_code=status.HTTP_201_CREATED)
async def create_consumable(
    consumable_data: ConsumableCreate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Create a new consumable product
    """
    # Create new consumable
    consumable = Consumable.create_consumable(
        name=consumable_data.name,
        cost=consumable_data.cost,
        meta_data=consumable_data.meta_data,
        db=db
    )

    return consumable

@router.get("", response_model=ConsumablesList)
async def list_consumables(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    List all consumable products with pagination
    """
    consumables = Consumable.get_all_consumables(db, skip=skip, limit=limit)
    total = db.query(Consumable).count()
    return {"consumables": consumables, "total": total}

@router.get("/{consumable_id}", response_model=ConsumableResponse)
async def get_consumable(
    consumable_id: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Get a specific consumable by ID
    """
    consumable = Consumable.find_by_id(consumable_id, db)
    if not consumable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consumable not found"
        )
    return consumable

@router.put("/{consumable_id}", response_model=ConsumableResponse)
async def update_consumable(
    consumable_id: str,
    consumable_data: ConsumableUpdate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Update a consumable product
    """
    consumable = Consumable.find_by_id(consumable_id, db)
    if not consumable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consumable not found"
        )

    # Update consumable
    updated_consumable = consumable.update_consumable(
        name=consumable_data.name,
        cost=consumable_data.cost,
        meta_data=consumable_data.meta_data,
        db=db
    )

    return updated_consumable

@router.delete("/{consumable_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_consumable(
    consumable_id: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Delete a consumable product
    """
    consumable = Consumable.find_by_id(consumable_id, db)
    if not consumable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consumable not found"
        )

    db.delete(consumable)
    db.commit()

    return None

@router.post("/{consumable_id}/apply", status_code=status.HTTP_200_OK)
async def apply_consumable(
    consumable_id: str,
    apply_data: ApplyConsumableRequest,
    db: Session = Depends(get_nexi_db),
    current_user: AdminUser = Depends(get_current_active_user)
):
    """
    Apply a consumable to a user, updating their credit
    """
    # Get the consumable
    consumable = Consumable.find_by_id(consumable_id, db)
    if not consumable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consumable not found"
        )

    # Get the user
    user = AgentUser.find_by_id(apply_data.user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Calculate the amount to deduct (negative amount since we're deducting credits)
    amount = Decimal('-' + str(consumable.cost))

    # Get current credit balance
    previous_balance = user.credit

    # Calculate new balance
    new_balance = previous_balance + amount

    # # Check if the user has enough credit
    # if new_balance < 0:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="User doesn't have enough credit"
    #     )

    # Update user credit
    user.credit = new_balance
    db.commit()

    # Get current user ID for tracking who made the change
    created_by = current_user.id if current_user else None

    # Create a description for the credit event if none provided
    description = apply_data.description or f"Applied consumable: {consumable.name}"

    # Create credit event for event sourcing
    event = AgentEvent.create_credit_event(
        target_id=user.id,
        amount=amount,
        previous_balance=previous_balance,
        new_balance=new_balance,
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
        "consumable": {
            "id": consumable.id,
            "name": consumable.name,
            "cost": float(consumable.cost)
        },
        "event": {
            "id": event.id,
            "amount": float(amount),
            "previous_balance": float(previous_balance),
            "new_balance": float(new_balance)
        }
    }
