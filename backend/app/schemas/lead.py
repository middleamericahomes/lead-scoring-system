"""
Pydantic schemas for lead data validation and serialization.
These schemas define the structure of request and response data for the API.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

# Tag schema for nested representation
class TagBase(BaseModel):
    """Base tag schema with shared attributes."""
    name: str
    base_score: float

class TagInDB(TagBase):
    """Tag schema with database fields."""
    id: int
    created_at: datetime
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True

# Lead schemas
class LeadBase(BaseModel):
    """
    Base lead schema with shared attributes.
    Contains all the common fields that can be created or updated.
    """
    property_address: str
    city: str
    state: str
    zip_code: str
    mailing_address: Optional[str] = None
    mailing_city: Optional[str] = None
    mailing_state: Optional[str] = None
    mailing_zip: Optional[str] = None
    owner_name: Optional[str] = None
    is_verified_address: bool = False
    do_not_append_mailing: bool = False

class LeadCreate(LeadBase):
    """
    Lead creation schema.
    Used for validating data when creating a new lead.
    """
    # Add any fields specific to creation
    pass

class LeadUpdate(BaseModel):
    """
    Lead update schema.
    Used for validating data when updating an existing lead.
    All fields are optional since updates may be partial.
    """
    property_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    mailing_address: Optional[str] = None
    mailing_city: Optional[str] = None
    mailing_state: Optional[str] = None
    mailing_zip: Optional[str] = None
    owner_name: Optional[str] = None
    is_verified_address: Optional[bool] = None
    do_not_append_mailing: Optional[bool] = None

class LeadInDB(LeadBase):
    """
    Database lead schema.
    Used for representing leads as they exist in the database.
    """
    id: int
    score: float
    is_absentee: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True

class LeadWithTags(LeadInDB):
    """
    Lead schema with included tags.
    Used for representing leads with their related tags.
    """
    tags: List[TagInDB] = []
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True 