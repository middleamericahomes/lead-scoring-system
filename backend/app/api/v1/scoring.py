"""
API router for lead scoring endpoints.
Handles score calculation and batch operations.
"""
from typing import Dict, List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import tag_service
from app.services.lead_service import get_leads

router = APIRouter(tags=["scoring"])

# Background task to process all leads
def process_all_leads_task(db: Session):
    """
    Background task to process all leads.
    Recalculates scores and expires tags as needed.
    
    Args:
        db: Database session
    """
    # First expire any tags that need to be expired
    expired_count = tag_service.check_and_expire_tags(db)
    
    # Then get all leads and recalculate their scores
    leads = get_leads(db, skip=0, limit=1000000)  # Get all leads
    for lead in leads:
        tag_service.recalculate_lead_score(db, lead.id)

@router.post("/scoring/recalculate", status_code=status.HTTP_202_ACCEPTED)
async def recalculate_all_scores(
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    """
    Recalculate scores for all leads in the database.
    
    This is a long-running operation that runs in the background.
    
    Args:
        background_tasks: FastAPI background tasks
        db: Database session
    
    Returns:
        Acceptance message
    """
    # Add the task to be run in the background
    background_tasks.add_task(process_all_leads_task, db)
    
    return {
        "message": "Score recalculation started in background",
        "status": "processing"
    }

@router.post("/scoring/lead/{lead_id}", status_code=status.HTTP_200_OK)
async def recalculate_lead_score(lead_id: int, db: Session = Depends(get_db)):
    """
    Recalculate score for a specific lead.
    
    Args:
        lead_id: ID of the lead
        db: Database session
    
    Returns:
        New score value
        
    Raises:
        HTTPException: If lead not found
    """
    new_score = tag_service.recalculate_lead_score(db, lead_id)
    
    # If score is 0 and lead doesn't exist, it will return 0
    # We need to check if the lead exists
    lead = db.query("SELECT id FROM leads WHERE id = :id").params(id=lead_id).first()
    if not lead and new_score == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with ID {lead_id} not found"
        )
    
    return {"lead_id": lead_id, "new_score": new_score}

@router.post("/scoring/expire-tags", status_code=status.HTTP_200_OK)
async def expire_tags(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Check all tag assignments and expire any that have passed their expiration date.
    
    Args:
        background_tasks: FastAPI background tasks
        db: Database session
    
    Returns:
        Acceptance message
    """
    # Process in background for large datasets
    background_tasks.add_task(tag_service.check_and_expire_tags, db)
    
    return {
        "message": "Tag expiration check started in background",
        "status": "processing"
    } 