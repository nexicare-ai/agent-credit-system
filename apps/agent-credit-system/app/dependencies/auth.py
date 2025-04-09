from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError

from app.core.security import oauth2_scheme, decode_access_token
from app.models.user import TokenData
from libs.core.database import get_nexi_db
from libs.core.entities.admin_user import AdminUser

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_nexi_db)):
    """
    Get the current user from the JWT token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception

    token_data = TokenData(username=username)
    user = AdminUser.find_by_username(token_data.username, db)

    if user is None:
        raise credentials_exception

    return user

async def get_current_active_user(current_user = Depends(get_current_user)):
    """
    Check if the current user is active
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
