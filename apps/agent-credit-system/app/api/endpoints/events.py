from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.models.agent_user import EventResponse, EventsList
from app.dependencies.auth import get_current_active_user
from libs.core.database import get_nexi_db
from libs.core.entities.agent_event import AgentEvent

router = APIRouter()

@router.get("/events", response_model=EventsList)
async def list_events(
    event_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    List all events with optional filtering by event_type
    """
    if event_type:
        events = AgentEvent.get_events_by_type(event_type, db, skip=skip, limit=limit)
        total = db.query(AgentEvent).filter(AgentEvent.event_type == event_type).count()
    else:
        events = AgentEvent.get_all_events(db, skip=skip, limit=limit)
        total = db.query(AgentEvent).count()

    return {"events": events, "total": total}

@router.get("/events/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    db: Session = Depends(get_nexi_db),
    _: dict = Depends(get_current_active_user)
):
    """
    Get a specific event by ID
    """
    event = db.query(AgentEvent).filter(AgentEvent.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return event
