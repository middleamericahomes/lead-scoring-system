"""
Pydantic schemas for tag data validation and serialization.
These schemas define the structure of request and response data for the API.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, validator

class TagBase(BaseModel):
    """
    Base tag schema with shared attributes.
    Contains fields common to tag creation and update operations.
    """
    name: str
    base_score: float = Field(..., ge=0.0, description="Score value must be non-negative")
    expiration_days: Optional[int] = Field(None, ge=0, description="Days until expiration, null for never")

class TagCreate(TagBase):
    """
    Tag creation schema.
    Used for validating data when creating a new tag.
    """
    pass

class TagUpdate(BaseModel):
    """
    Tag update schema.
    Used for validating data when updating an existing tag.
    All fields are optional since updates may be partial.
    """
    name: Optional[str] = None
    base_score: Optional[float] = Field(None, ge=0.0)
    expiration_days: Optional[int] = Field(None, ge=0)
    
    @validator('base_score')
    def base_score_must_be_positive(cls, v):
        """Validate that base_score is positive if provided."""
        if v is not None and v < 0:
            raise ValueError("Tag score must be non-negative")
        return v

class TagInDB(TagBase):
    """
    Database tag schema.
    Used for representing tags as they exist in the database.
    """
    id: int
    created_at: datetime
    
    class Config:
        """Pydantic configuration for ORM model compatibility."""
        from_attributes = True

class LeadTagAssign(BaseModel):
    """
    Schema for assigning a tag to a lead.
    Contains just the essential fields needed for the operation.
    """
    lead_id: int
    tag_id: int
    
class LeadTagExpire(BaseModel):
    """
    Schema for expiring a tag assigned to a lead.
    Contains just the essential fields needed for the operation.
    """
    lead_id: int
    tag_id: int
    expire_now: bool = True 