from fastapi import APIRouter

from app.api.endpoints import auth, health, cms_users

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(cms_users.router, prefix="/cms", tags=["cms"])
