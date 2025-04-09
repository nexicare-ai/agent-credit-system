from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.models.cms_user import CMSUserCreate, CMSUserUpdate, CMSUserResponse, CMSUsersList
from app.dependencies.auth import get_current_active_user
from libs.core.database import get_nexi_db
from libs.core.entities.cms_user import CMSUser

router = APIRouter()

@router.post("/users", response_model=CMSUserResponse, status_code=status.HTTP_201_CREATED)
async def create_cms_user(
    user_data: CMSUserCreate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Create a new CMS user
    """
    # Check if mobile already exists
    if CMSUser.find_by_mobile(user_data.mobile, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number already registered"
        )

    # Check if email already exists
    if CMSUser.find_by_email(user_data.email, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new CMS user
    user = CMSUser.create_user(
        mobile=user_data.mobile,
        email=user_data.email,
        name=user_data.name,
        db=db
    )

    return user

@router.get("/users/{mobile}", response_model=CMSUserResponse)
async def get_cms_user(
    mobile: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Get a specific CMS user by mobile number
    """
    user = CMSUser.find_by_mobile(mobile, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/users", response_model=CMSUsersList)
async def list_cms_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    List all CMS users with pagination
    """
    users = CMSUser.get_all_users(db, skip=skip, limit=limit)
    total = db.query(CMSUser).count()
    return {"users": users, "total": total}

@router.put("/users/{mobile}", response_model=CMSUserResponse)
async def update_cms_user(
    mobile: str,
    user_update: CMSUserUpdate,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Update a CMS user
    """
    user = CMSUser.find_by_mobile(mobile, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # If updating email, check if it's not already taken
    if user_update.email and user_update.email != user.email:
        existing_user = CMSUser.find_by_email(user_update.email, db)
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
async def delete_cms_user(
    mobile: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Delete a CMS user
    """
    user = CMSUser.find_by_mobile(mobile, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return None
