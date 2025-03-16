"""
API router for tag endpoints.
Handles CRUD operations and tag assignment/removal functionality.
"""
from typing import List, Optional, Tuple

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Tag
from app.schemas.tag import (
    LeadTagAssign, LeadTagExpire, TagCreate, TagInDB, TagUpdate
)
from app.services import tag_service

router = APIRouter(tags=["tags"])

@router.get("/tags/", response_model=List[TagInDB])
async def read_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all tags with pagination.
    
    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum records to return
        db: Database session
    
    Returns:
        List of tags
    """
    tags = tag_service.get_all_tags(db, skip, limit)
    return tags

@router.get("/tags/{tag_id}", response_model=TagInDB)
async def read_tag(tag_id: int, db: Session = Depends(get_db)):
    """
    Get a tag by ID.
    
    Args:
        tag_id: ID of the tag to retrieve
        db: Database session
    
    Returns:
        Tag object if found
        
    Raises:
        HTTPException: If tag not found
    """
    tag = tag_service.get_tag_by_id(db, tag_id)
    if tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with ID {tag_id} not found"
        )
    return tag

@router.post("/tags/", response_model=TagInDB, status_code=status.HTTP_201_CREATED)
async def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    """
    Create a new tag.
    
    Args:
        tag: Tag data from request body
        db: Database session
    
    Returns:
        Created tag object
        
    Raises:
        HTTPException: If a tag with the same name already exists
    """
    # Check if tag with same name already exists
    existing_tag = tag_service.get_tag_by_name(db, tag.name)
    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A tag with name '{tag.name}' already exists"
        )
    
    return tag_service.create_tag(db, tag)

@router.put("/tags/{tag_id}", response_model=TagInDB)
async def update_tag(tag_id: int, tag_update: TagUpdate, db: Session = Depends(get_db)):
    """
    Update a tag.
    
    Args:
        tag_id: ID of the tag to update
        tag_update: Tag update data from request body
        db: Database session
    
    Returns:
        Updated tag object
        
    Raises:
        HTTPException: If tag not found or name conflict
    """
    # Check if updating name and if it would conflict
    if tag_update.name:
        existing_tag = tag_service.get_tag_by_name(db, tag_update.name)
        if existing_tag and existing_tag.id != tag_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"A tag with name '{tag_update.name}' already exists"
            )
    
    updated_tag = tag_service.update_tag(db, tag_id, tag_update)
    if updated_tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with ID {tag_id} not found"
        )
    return updated_tag

@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    """
    Delete a tag.
    
    Args:
        tag_id: ID of the tag to delete
        db: Database session
    
    Returns:
        No content
        
    Raises:
        HTTPException: If tag not found
    """
    success = tag_service.delete_tag(db, tag_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with ID {tag_id} not found"
        )
    return None

@router.post("/leads/tag", status_code=status.HTTP_200_OK)
async def assign_tag_to_lead(
    assignment: LeadTagAssign, 
    db: Session = Depends(get_db)
):
    """
    Assign a tag to a lead.
    
    Args:
        assignment: Data containing lead_id and tag_id
        db: Database session
    
    Returns:
        Success message
        
    Raises:
        HTTPException: If lead or tag not found, or already assigned
    """
    success, message = tag_service.assign_tag_to_lead(
        db, assignment.lead_id, assignment.tag_id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {"message": message}

@router.delete("/leads/tag", status_code=status.HTTP_200_OK)
async def remove_tag_from_lead(
    assignment: LeadTagAssign, 
    db: Session = Depends(get_db)
):
    """
    Remove a tag from a lead.
    
    Args:
        assignment: Data containing lead_id and tag_id
        db: Database session
    
    Returns:
        Success message
        
    Raises:
        HTTPException: If lead or tag not found, or not assigned
    """
    success, message = tag_service.remove_tag_from_lead(
        db, assignment.lead_id, assignment.tag_id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {"message": message}

@router.post("/leads/tag/expire", status_code=status.HTTP_200_OK)
async def expire_tag_for_lead(
    expiration: LeadTagExpire, 
    db: Session = Depends(get_db)
):
    """
    Mark a tag as expired for a lead.
    
    Args:
        expiration: Data containing lead_id and tag_id
        db: Database session
    
    Returns:
        Success message
        
    Raises:
        HTTPException: If lead or tag not found, or not assigned
    """
    success, message = tag_service.expire_tag_for_lead(
        db, expiration.lead_id, expiration.tag_id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {"message": message} 