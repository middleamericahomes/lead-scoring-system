"""
Pydantic schemas for lead data validation and serialization.
These schemas define the structure of request and response data for the API.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

# Phone schemas
class PhoneBase(BaseModel):
    """Base schema for phone information."""
    phone_number: str
    phone_type: Optional[str] = None
    phone_status: Optional[str] = None
    phone_tags: Optional[str] = None

class PhoneCreate(PhoneBase):
    """Schema for creating a phone record."""
    pass

class PhoneInDB(PhoneBase):
    """Schema for phone record with database fields."""
    id: int
    lead_id: int
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True

# Email schemas
class EmailBase(BaseModel):
    """Base schema for email information."""
    email_address: str

class EmailCreate(EmailBase):
    """Schema for creating an email record."""
    pass

class EmailInDB(EmailBase):
    """Schema for email record with database fields."""
    id: int
    lead_id: int
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True

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
    # Core property information
    property_address: str
    property_city: str
    property_state: str
    property_zip_code: str
    property_zip5: Optional[str] = None
    property_county: Optional[str] = None
    property_vacant: Optional[bool] = False
    
    # Mailing address information
    mailing_address: Optional[str] = None
    mailing_city: Optional[str] = None
    mailing_state: Optional[str] = None
    mailing_zip: Optional[str] = None
    mailing_zip5: Optional[str] = None
    mailing_county: Optional[str] = None
    mailing_vacant: Optional[bool] = False
    do_not_append_mailing: Optional[bool] = False

    # Owner information
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    owner_name: Optional[str] = None
    business_name: Optional[str] = None
    
    # Status and categorization
    status: Optional[str] = None
    lists: Optional[str] = None
    list_stack: Optional[str] = None
    is_verified_address: Optional[bool] = False
    
    # Property details
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    sqft: Optional[int] = None
    air_conditioner: Optional[str] = None
    heating_type: Optional[str] = None
    storeys: Optional[int] = None
    year: Optional[int] = None
    above_grade: Optional[str] = None
    rental_value: Optional[float] = None
    building_use_code: Optional[str] = None
    neighborhood_rating: Optional[str] = None
    structure_type: Optional[str] = None
    number_of_units: Optional[int] = None
    
    # Property identification
    apn: Optional[str] = None
    parcel_id: Optional[str] = None
    legal_description: Optional[str] = None
    lot_size: Optional[str] = None
    land_zoning: Optional[str] = None
    
    # Tax information
    tax_auction_date: Optional[str] = None
    total_taxes: Optional[float] = None
    tax_delinquent_value: Optional[float] = None
    tax_delinquent_year: Optional[int] = None
    year_behind_on_taxes: Optional[int] = None
    
    # Transaction history
    deed: Optional[str] = None
    mls: Optional[str] = None
    last_sale_price: Optional[float] = None
    last_sold: Optional[str] = None
    
    # Distress indicators
    lien_type: Optional[str] = None
    lien_recording_date: Optional[str] = None
    personal_representative: Optional[str] = None
    personal_representative_phone: Optional[str] = None
    probate_open_date: Optional[str] = None
    attorney_on_file: Optional[str] = None
    foreclosure_date: Optional[str] = None
    bankruptcy_recording_date: Optional[str] = None
    divorce_file_date: Optional[str] = None
    
    # Financial metrics
    loan_to_value: Optional[float] = None
    open_mortgages: Optional[int] = None
    mortgage_type: Optional[str] = None
    owned_since: Optional[str] = None
    estimated_value: Optional[float] = None
    
    # Metadata
    exported_from_reisift: Optional[str] = None

class LeadCreate(LeadBase):
    """
    Lead creation schema.
    Used for validating data when creating a new lead.
    """
    # Optional related data
    phones: Optional[List[PhoneCreate]] = []
    emails: Optional[List[EmailCreate]] = []

class LeadUpdate(BaseModel):
    """
    Lead update schema.
    Used for validating data when updating an existing lead.
    All fields are optional since updates may be partial.
    """
    # Core property information
    property_address: Optional[str] = None
    property_city: Optional[str] = None
    property_state: Optional[str] = None
    property_zip_code: Optional[str] = None
    property_zip5: Optional[str] = None
    property_county: Optional[str] = None
    property_vacant: Optional[bool] = None
    
    # Mailing address information
    mailing_address: Optional[str] = None
    mailing_city: Optional[str] = None
    mailing_state: Optional[str] = None
    mailing_zip: Optional[str] = None
    mailing_zip5: Optional[str] = None
    mailing_county: Optional[str] = None
    mailing_vacant: Optional[bool] = None
    do_not_append_mailing: Optional[bool] = None

    # Owner information
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    owner_name: Optional[str] = None
    business_name: Optional[str] = None
    
    # Status and categorization
    status: Optional[str] = None
    lists: Optional[str] = None
    list_stack: Optional[str] = None
    is_verified_address: Optional[bool] = None
    
    # Property details
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    sqft: Optional[int] = None
    air_conditioner: Optional[str] = None
    heating_type: Optional[str] = None
    storeys: Optional[int] = None
    year: Optional[int] = None
    above_grade: Optional[str] = None
    rental_value: Optional[float] = None
    building_use_code: Optional[str] = None
    neighborhood_rating: Optional[str] = None
    structure_type: Optional[str] = None
    number_of_units: Optional[int] = None
    
    # Property identification
    apn: Optional[str] = None
    parcel_id: Optional[str] = None
    legal_description: Optional[str] = None
    lot_size: Optional[str] = None
    land_zoning: Optional[str] = None
    
    # Tax information
    tax_auction_date: Optional[str] = None
    total_taxes: Optional[float] = None
    tax_delinquent_value: Optional[float] = None
    tax_delinquent_year: Optional[int] = None
    year_behind_on_taxes: Optional[int] = None
    
    # Transaction history
    deed: Optional[str] = None
    mls: Optional[str] = None
    last_sale_price: Optional[float] = None
    last_sold: Optional[str] = None
    
    # Distress indicators
    lien_type: Optional[str] = None
    lien_recording_date: Optional[str] = None
    personal_representative: Optional[str] = None
    personal_representative_phone: Optional[str] = None
    probate_open_date: Optional[str] = None
    attorney_on_file: Optional[str] = None
    foreclosure_date: Optional[str] = None
    bankruptcy_recording_date: Optional[str] = None
    divorce_file_date: Optional[str] = None
    
    # Financial metrics
    loan_to_value: Optional[float] = None
    open_mortgages: Optional[int] = None
    mortgage_type: Optional[str] = None
    owned_since: Optional[str] = None
    estimated_value: Optional[float] = None
    
    # Metadata
    exported_from_reisift: Optional[str] = None

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

class LeadWithRelations(LeadWithTags):
    """
    Lead schema with all related data.
    Used for representing leads with complete information.
    """
    phones: List[PhoneInDB] = []
    emails: List[EmailInDB] = []
    
    class Config:
        """Pydantic configuration."""
        from_attributes = True 