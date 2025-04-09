from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from decimal import Decimal

from app.models.agent_user import (
    AgentUserCreate, AgentUserUpdate, AgentUserResponse,
    AgentUsersList, CreditEventCreate, CreditEventResponse,
    CreditEventsList
)
from app.dependencies.auth import get_current_active_user
from libs.core.database import get_nexi_db
from libs.core.entities.agent_user import AgentUser
from libs.core.entities.agent_event import AgentEvent

router = APIRouter()

@router.post("/users", response_model=AgentUserResponse, status_code=status.HTTP_201_CREATED)
async def create_agent_user(
    user_data: AgentUserCreate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Create a new agent user
    """
    # Check if mobile already exists
    if AgentUser.find_by_mobile(user_data.mobile, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered"
        )

    # Check if email already exists
    if AgentUser.find_by_email(user_data.email, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new agent user
    user = AgentUser.create_user(
        mobile=user_data.mobile,
        email=user_data.email,
        name=user_data.name,
        credit=user_data.credit,
        db=db
    )

    return user

@router.get("/users/{mobile}", response_model=AgentUserResponse)
async def get_agent_user(
    mobile: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Get a specific agent user by mobile number
    """
    user = AgentUser.find_by_mobile(mobile, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/users", response_model=AgentUsersList)
async def list_agent_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    List all agent users with pagination
    """
    users = AgentUser.get_all_users(db, skip=skip, limit=limit)
    total = db.query(AgentUser).count()
    return {"users": users, "total": total}

@router.put("/users/{mobile}", response_model=AgentUserResponse)
async def update_agent_user(
    mobile: str,
    user_update: AgentUserUpdate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Update an agent user
    """
    user = AgentUser.find_by_mobile(mobile, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # If updating email, check if it's not already taken
    if user_update.email and user_update.email != user.email:
        existing_user = AgentUser.find_by_email(user_update.email, db)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Update user
    updated_user = user.update_user(
        email=user_update.email,
        name=user_update.name,
        db=db
    )

    return updated_user

@router.delete("/users/{mobile}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent_user(
    mobile: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Delete an agent user
    """
    user = AgentUser.find_by_mobile(mobile, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return None

# Credit management endpoints
@router.post("/users/{mobile}/credit", response_model=CreditEventResponse)
async def update_user_credit(
    mobile: str,
    credit_event: CreditEventCreate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Update user credit with event sourcing
    """
    user = AgentUser.find_by_mobile(mobile, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Get current credit balance
    previous_balance = user.credit

    # Calculate new balance
    new_balance = previous_balance + credit_event.amount

    # Update user credit
    user.credit = new_balance
    db.commit()

    # Create credit event for event sourcing
    event = AgentEvent.create_credit_event(
        target_id=user.id,
        amount=credit_event.amount,
        previous_balance=previous_balance,
        new_balance=new_balance,
        description=credit_event.description,
        db=db
    )

    return event

@router.get("/users/{mobile}/credit/history", response_model=CreditEventsList)
async def get_user_credit_history(
    mobile: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Get credit history for a specific user
    """
    user = AgentUser.find_by_mobile(mobile, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    events = AgentEvent.get_target_events(user.id, db, skip=skip, limit=limit)
    total = AgentEvent.count_target_events(user.id, db)

    return {"events": events, "total": total}

@router.get("/users/id/{id}", response_model=AgentUserResponse)
async def get_agent_user_by_id(
    id: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Get a specific agent user by ID
    """
    user = AgentUser.find_by_id(id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
