"""
API router for lead endpoints.
Handles CRUD operations and other lead-related functionality.
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Lead
from app.schemas.lead import LeadCreate, LeadInDB, LeadUpdate, LeadWithTags
from app.services import lead_service

router = APIRouter(tags=["leads"])

@router.get("/leads/", response_model=List[LeadWithTags])
async def read_leads(
    skip: int = 0,
    limit: int = 100,
    min_score: Optional[float] = None,
    tag_ids: Optional[List[int]] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all leads with optional filtering by score and tags.
    
    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum records to return
        min_score: Minimum score filter
        tag_ids: List of tag IDs to filter by
        db: Database session
    
    Returns:
        List of leads matching the criteria
    """
    leads = lead_service.get_leads(db, skip, limit, min_score, tag_ids)
    return leads

@router.get("/leads/{lead_id}", response_model=LeadWithTags)
async def read_lead(lead_id: int, db: Session = Depends(get_db)):
    """
    Get a lead by ID.
    
    Args:
        lead_id: ID of the lead to retrieve
        db: Database session
    
    Returns:
        Lead object if found
        
    Raises:
        HTTPException: If lead not found
    """
    lead = lead_service.get_lead_by_id(db, lead_id)
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with ID {lead_id} not found"
        )
    return lead

@router.get("/leads/by-address/{property_address}", response_model=LeadWithTags)
async def read_lead_by_address(property_address: str, db: Session = Depends(get_db)):
    """
    Get a lead by property address.
    
    Args:
        property_address: Address to search for
        db: Database session
    
    Returns:
        Lead object if found
        
    Raises:
        HTTPException: If lead not found
    """
    lead = lead_service.get_lead_by_address(db, property_address)
    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with address '{property_address}' not found"
        )
    return lead

@router.post("/leads/", response_model=LeadInDB, status_code=status.HTTP_201_CREATED)
async def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    """
    Create a new lead.
    
    Args:
        lead: Lead data from request body
        db: Database session
    
    Returns:
        Created lead object
        
    Raises:
        HTTPException: If a lead with the same address already exists
    """
    # Check if lead with same address already exists
    existing_lead = lead_service.get_lead_by_address(db, lead.property_address)
    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A lead with address '{lead.property_address}' already exists"
        )
    
    return lead_service.create_lead(db, lead)

@router.put("/leads/{lead_id}", response_model=LeadInDB)
async def update_lead(lead_id: int, lead_update: LeadUpdate, db: Session = Depends(get_db)):
    """
    Update a lead.
    
    Args:
        lead_id: ID of the lead to update
        lead_update: Lead update data from request body
        db: Database session
    
    Returns:
        Updated lead object
        
    Raises:
        HTTPException: If lead not found
    """
    updated_lead = lead_service.update_lead(db, lead_id, lead_update)
    if updated_lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with ID {lead_id} not found"
        )
    return updated_lead

@router.delete("/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    """
    Delete a lead.
    
    Args:
        lead_id: ID of the lead to delete
        db: Database session
    
    Returns:
        No content
        
    Raises:
        HTTPException: If lead not found
    """
    success = lead_service.delete_lead(db, lead_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with ID {lead_id} not found"
        )
    return None 