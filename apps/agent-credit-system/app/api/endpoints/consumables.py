from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.models.consumable import (
    ConsumableCreate, ConsumableUpdate, ConsumableResponse,
    ConsumablesList
)
from app.dependencies.auth import get_current_active_user
from libs.core.database import get_nexi_db
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
