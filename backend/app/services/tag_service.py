"""
Service module for tag-related operations.
Contains business logic for managing tags and their assignments to leads.
"""
from datetime import datetime, timedelta
from typing import List, Optional, Tuple

from sqlalchemy import and_, delete, select, update
from sqlalchemy.orm import Session

from app.models.models import Lead, Tag, lead_tag
from app.schemas.tag import TagCreate, TagUpdate

def get_all_tags(db: Session, skip: int = 0, limit: int = 100) -> List[Tag]:
    """
    Get all tags with pagination.
    
    Args:
        db: Database session
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        
    Returns:
        List of Tag objects
    """
    return db.query(Tag).offset(skip).limit(limit).all()

def get_tag_by_id(db: Session, tag_id: int) -> Optional[Tag]:
    """
    Get a tag by its ID.
    
    Args:
        db: Database session
        tag_id: ID of the tag to retrieve
        
    Returns:
        Tag object if found, None otherwise
    """
    return db.query(Tag).filter(Tag.id == tag_id).first()

def get_tag_by_name(db: Session, name: str) -> Optional[Tag]:
    """
    Get a tag by its name.
    
    Args:
        db: Database session
        name: Name of the tag to retrieve
        
    Returns:
        Tag object if found, None otherwise
    """
    # Case-insensitive search
    return db.query(Tag).filter(Tag.name.ilike(name)).first()

def create_tag(db: Session, tag: TagCreate) -> Tag:
    """
    Create a new tag.
    
    Args:
        db: Database session
        tag: Tag data validated by Pydantic schema
        
    Returns:
        Created Tag object
    """
    # Create a new Tag object
    db_tag = Tag(
        name=tag.name.strip(),
        base_score=tag.base_score,
        expiration_days=tag.expiration_days
    )
    
    # Add to session and commit
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    
    return db_tag

def update_tag(db: Session, tag_id: int, tag_update: TagUpdate) -> Optional[Tag]:
    """
    Update an existing tag.
    
    Args:
        db: Database session
        tag_id: ID of the tag to update
        tag_update: Tag update data validated by Pydantic schema
        
    Returns:
        Updated Tag object if found, None otherwise
    """
    # Get the tag to update
    db_tag = get_tag_by_id(db, tag_id)
    if not db_tag:
        return None
    
    # Create a dictionary of update data, excluding None values
    update_data = tag_update.dict(exclude_unset=True)
    
    # Strip whitespace from name if provided
    if 'name' in update_data and update_data['name']:
        update_data['name'] = update_data['name'].strip()
    
    # Apply all updates
    for key, value in update_data.items():
        setattr(db_tag, key, value)
    
    # Commit changes
    db.commit()
    db.refresh(db_tag)
    
    return db_tag

def delete_tag(db: Session, tag_id: int) -> bool:
    """
    Delete a tag.
    
    Args:
        db: Database session
        tag_id: ID of the tag to delete
        
    Returns:
        True if the tag was deleted, False if not found
    """
    # Get the tag to delete
    db_tag = get_tag_by_id(db, tag_id)
    if not db_tag:
        return False
    
    # Delete the tag (cascade will remove from lead_tag table)
    db.delete(db_tag)
    db.commit()
    
    return True

def assign_tag_to_lead(db: Session, lead_id: int, tag_id: int) -> Tuple[bool, str]:
    """
    Assign a tag to a lead.
    
    Args:
        db: Database session
        lead_id: ID of the lead
        tag_id: ID of the tag to assign
        
    Returns:
        Tuple of (success, message)
    """
    # Check if the lead and tag exist
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        return False, "Lead not found"
    
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        return False, "Tag not found"
    
    # Check if the tag is already assigned
    existing = db.execute(
        select([lead_tag]).where(
            and_(
                lead_tag.c.lead_id == lead_id,
                lead_tag.c.tag_id == tag_id
            )
        )
    ).first()
    
    if existing:
        return False, "Tag already assigned to this lead"
    
    # Calculate expiration date if applicable
    expiration_at = None
    if tag.expiration_days:
        expiration_at = datetime.utcnow() + timedelta(days=tag.expiration_days)
    
    # Create the association
    stmt = lead_tag.insert().values(
        lead_id=lead_id,
        tag_id=tag_id,
        assigned_at=datetime.utcnow(),
        expiration_at=expiration_at,
        is_expired=False
    )
    db.execute(stmt)
    
    # Update the lead's score
    recalculate_lead_score(db, lead_id)
    
    db.commit()
    return True, "Tag assigned successfully"

def remove_tag_from_lead(db: Session, lead_id: int, tag_id: int) -> Tuple[bool, str]:
    """
    Remove a tag from a lead.
    
    Args:
        db: Database session
        lead_id: ID of the lead
        tag_id: ID of the tag to remove
        
    Returns:
        Tuple of (success, message)
    """
    # Check if the association exists
    stmt = delete(lead_tag).where(
        and_(
            lead_tag.c.lead_id == lead_id,
            lead_tag.c.tag_id == tag_id
        )
    )
    result = db.execute(stmt)
    
    if result.rowcount == 0:
        return False, "Tag is not assigned to this lead"
    
    # Update the lead's score
    recalculate_lead_score(db, lead_id)
    
    db.commit()
    return True, "Tag removed successfully"

def expire_tag_for_lead(db: Session, lead_id: int, tag_id: int) -> Tuple[bool, str]:
    """
    Mark a tag as expired for a lead.
    
    Args:
        db: Database session
        lead_id: ID of the lead
        tag_id: ID of the tag to expire
        
    Returns:
        Tuple of (success, message)
    """
    # Check if the association exists
    stmt = update(lead_tag).where(
        and_(
            lead_tag.c.lead_id == lead_id,
            lead_tag.c.tag_id == tag_id
        )
    ).values(
        is_expired=True,
        expiration_at=datetime.utcnow()
    )
    result = db.execute(stmt)
    
    if result.rowcount == 0:
        return False, "Tag is not assigned to this lead"
    
    # Update the lead's score
    recalculate_lead_score(db, lead_id)
    
    db.commit()
    return True, "Tag expired successfully"

def recalculate_lead_score(db: Session, lead_id: int) -> float:
    """
    Recalculate a lead's score based on its active tags.
    
    Args:
        db: Database session
        lead_id: ID of the lead
        
    Returns:
        New score value
    """
    # Get the lead
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        return 0.0
    
    # Get all active (non-expired) tags for the lead
    active_tags = []
    for tag in lead.tags:
        # Check if tag is expired
        tag_association = db.execute(
            select([lead_tag]).where(
                and_(
                    lead_tag.c.lead_id == lead_id,
                    lead_tag.c.tag_id == tag.id
                )
            )
        ).first()
        
        if tag_association and not tag_association.is_expired:
            active_tags.append(tag)
    
    # Calculate score (sum of base scores)
    new_score = sum(tag.base_score for tag in active_tags)
    
    # Update the lead's score
    lead.score = new_score
    db.commit()
    
    return new_score

def check_and_expire_tags(db: Session) -> int:
    """
    Check all tag assignments and expire any that have passed their expiration date.
    This should be called by a scheduled task.
    
    Args:
        db: Database session
        
    Returns:
        Number of tags expired
    """
    now = datetime.utcnow()
    
    # Find tag assignments that need to be expired
    expired_count = 0
    
    # Find all leads with tags
    leads_with_tags = db.query(Lead).filter(Lead.tags.any()).all()
    
    for lead in leads_with_tags:
        score_updated = False
        
        # Get tag associations for this lead
        tag_associations = db.execute(
            select([lead_tag]).where(lead_tag.c.lead_id == lead.id)
        ).fetchall()
        
        for assoc in tag_associations:
            # Skip if already expired
            if assoc.is_expired:
                continue
                
            # Check if expiration date has passed
            if assoc.expiration_at and assoc.expiration_at <= now:
                # Mark as expired
                stmt = update(lead_tag).where(
                    and_(
                        lead_tag.c.lead_id == assoc.lead_id,
                        lead_tag.c.tag_id == assoc.tag_id
                    )
                ).values(
                    is_expired=True
                )
                db.execute(stmt)
                
                expired_count += 1
                score_updated = True
        
        # Recalculate score if needed
        if score_updated:
            recalculate_lead_score(db, lead.id)
    
    db.commit()
    return expired_count 