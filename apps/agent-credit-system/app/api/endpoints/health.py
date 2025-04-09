from fastapi import APIRouter

router = APIRouter()

@router.get("/ready")
async def healthcheck():
    """Health check endpoint"""
    return {"status": "ok"} 