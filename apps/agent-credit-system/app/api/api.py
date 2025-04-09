from fastapi import APIRouter

from app.api.endpoints import auth, health, agent_users, events, consumables, purchasables

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(agent_users.router, prefix="/agents", tags=["agents"])
api_router.include_router(events.router, prefix="/system", tags=["events"])
api_router.include_router(consumables.router, prefix="/consumables", tags=["consumables"])
api_router.include_router(purchasables.router, prefix="/purchasables", tags=["purchasables"])
