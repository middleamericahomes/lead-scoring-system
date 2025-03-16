"""
Service module for lead-related operations.
Contains business logic for creating, retrieving, updating, and deleting leads.
"""
from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.models import Lead, Tag, lead_tag
from app.schemas.lead import LeadCreate, LeadUpdate

def get_leads(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    min_score: Optional[float] = None,
    tag_ids: Optional[List[int]] = None
) -> List[Lead]:
    """
    Get all leads with optional filtering by score and tags.
    
    Args:
        db: Database session
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        min_score: Minimum score filter
        tag_ids: List of tag IDs to filter by
        
    Returns:
        List of Lead objects matching the criteria
    """
    query = db.query(Lead)
    
    # Apply filters if provided
    if min_score is not None:
        query = query.filter(Lead.score >= min_score)
        
    if tag_ids:
        # Filter leads that have all the specified tags
        for tag_id in tag_ids:
            query = query.filter(Lead.tags.any(Tag.id == tag_id))
    
    # Order by score descending and apply pagination
    return query.order_by(desc(Lead.score)).offset(skip).limit(limit).all()

def get_lead_by_id(db: Session, lead_id: int) -> Optional[Lead]:
    """
    Get a lead by its ID.
    
    Args:
        db: Database session
        lead_id: ID of the lead to retrieve
        
    Returns:
        Lead object if found, None otherwise
    """
    return db.query(Lead).filter(Lead.id == lead_id).first()

def get_lead_by_address(db: Session, property_address: str) -> Optional[Lead]:
    """
    Get a lead by its property address.
    
    Args:
        db: Database session
        property_address: Property address to search for
        
    Returns:
        Lead object if found, None otherwise
    """
    # Convert to uppercase for case-insensitive comparison
    normalized_address = property_address.strip().upper()
    return db.query(Lead).filter(
        Lead.property_address.upper() == normalized_address
    ).first()

def create_lead(db: Session, lead: LeadCreate) -> Lead:
    """
    Create a new lead.
    
    Args:
        db: Database session
        lead: Lead data validated by Pydantic schema
        
    Returns:
        Created Lead object
    """
    # Create a new Lead object
    db_lead = Lead(
        property_address=lead.property_address.strip(),
        city=lead.city.strip(),
        state=lead.state.strip().upper(),
        zip_code=lead.zip_code.strip(),
        mailing_address=lead.mailing_address.strip() if lead.mailing_address else None,
        mailing_city=lead.mailing_city.strip() if lead.mailing_city else None,
        mailing_state=lead.mailing_state.strip().upper() if lead.mailing_state else None,
        mailing_zip=lead.mailing_zip.strip() if lead.mailing_zip else None,
        owner_name=lead.owner_name.strip() if lead.owner_name else None,
        is_verified_address=lead.is_verified_address,
        do_not_append_mailing=lead.do_not_append_mailing,
        # Set default values for other fields
        score=0.0,
        is_absentee=False
    )
    
    # Check if mailing address differs from property address
    if (db_lead.mailing_address and db_lead.mailing_address != db_lead.property_address):
        db_lead.is_absentee = True
    
    # Add to session and commit
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    
    return db_lead

def update_lead(db: Session, lead_id: int, lead_update: LeadUpdate) -> Optional[Lead]:
    """
    Update an existing lead.
    
    Args:
        db: Database session
        lead_id: ID of the lead to update
        lead_update: Lead update data validated by Pydantic schema
        
    Returns:
        Updated Lead object if found, None otherwise
    """
    # Get the lead to update
    db_lead = get_lead_by_id(db, lead_id)
    if not db_lead:
        return None
    
    # Create a dictionary of update data, excluding None values
    update_data = lead_update.dict(exclude_unset=True)
    
    # Strip whitespace from string fields
    for field in ['property_address', 'city', 'state', 'zip_code', 
                 'mailing_address', 'mailing_city', 'mailing_state', 
                 'mailing_zip', 'owner_name']:
        if field in update_data and update_data[field] is not None:
            update_data[field] = update_data[field].strip()
            
    # Convert states to uppercase
    if 'state' in update_data and update_data['state']:
        update_data['state'] = update_data['state'].upper()
    if 'mailing_state' in update_data and update_data['mailing_state']:
        update_data['mailing_state'] = update_data['mailing_state'].upper()
    
    # Check if we need to update absentee status
    if ('property_address' in update_data or 'mailing_address' in update_data):
        property_address = update_data.get('property_address', db_lead.property_address)
        mailing_address = update_data.get('mailing_address', db_lead.mailing_address)
        
        # Update absentee status if both addresses are available
        if property_address and mailing_address:
            update_data['is_absentee'] = (property_address != mailing_address)
    
    # Apply all updates
    for key, value in update_data.items():
        setattr(db_lead, key, value)
    
    # Update the updated_at timestamp
    db_lead.updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    db.refresh(db_lead)
    
    return db_lead

def delete_lead(db: Session, lead_id: int) -> bool:
    """
    Delete a lead.
    
    Args:
        db: Database session
        lead_id: ID of the lead to delete
        
    Returns:
        True if the lead was deleted, False if not found
    """
    # Get the lead to delete
    db_lead = get_lead_by_id(db, lead_id)
    if not db_lead:
        return False
    
    # Delete the lead
    db.delete(db_lead)
    db.commit()
    
    return True 