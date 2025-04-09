from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.models.user import Token, User, UserCreate
from app.core.security import create_access_token
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.dependencies.auth import get_current_active_user
from libs.core.database import get_nexi_db
from libs.core.entities.admin_user import AdminUser

router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_nexi_db)):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = AdminUser.find_by_username(form_data.username, db)
    if not user or not user.verify_password(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login time
    user.update_last_login()
    db.commit()

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=User)
async def register_admin(user_data: UserCreate, db: Session = Depends(get_nexi_db)):
    """
    Register a new admin user
    """
    # Check if username already exists
    if AdminUser.find_by_username(user_data.username, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check if email already exists
    if AdminUser.find_by_email(user_data.email, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new admin user
    admin = AdminUser.create_admin(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password,
        db=db
    )

    return {
        "id": admin.id,
        "username": admin.username,
        "email": admin.email,
        "is_active": admin.is_active
    }

@router.get("/me", response_model=User)
async def read_users_me(current_user = Depends(get_current_active_user)):
    """
    Get current user information
    """
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "is_active": current_user.is_active
    }