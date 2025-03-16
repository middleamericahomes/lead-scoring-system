"""
SQLAlchemy models for the Lead Scoring System database.
Defines the schema for leads, tags, and their relationships.
"""
from datetime import datetime
from typing import Optional, List

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, Table, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# Association table for many-to-many relationship between leads and tags
lead_tag = Table(
    "lead_tag",
    Base.metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("lead_id", Integer, ForeignKey("leads.id", ondelete="CASCADE")),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE")),
    Column("assigned_at", DateTime, default=datetime.utcnow, nullable=False),
    Column("expiration_at", DateTime, nullable=True),
    Column("is_expired", Boolean, default=False),
    UniqueConstraint("lead_id", "tag_id", name="unique_lead_tag"),
)

class Lead(Base):
    """Model representing a property of interest."""
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Core property information
    property_address = Column(String, nullable=False, index=True)
    property_city = Column(String, nullable=False)
    property_state = Column(String, nullable=False)
    property_zip_code = Column(String, nullable=False)
    property_zip5 = Column(String)
    property_county = Column(String)
    property_vacant = Column(Boolean, default=False)
    
    # Mailing address information
    mailing_address = Column(String)
    mailing_city = Column(String)
    mailing_state = Column(String)
    mailing_zip = Column(String)
    mailing_zip5 = Column(String)
    mailing_county = Column(String)
    mailing_vacant = Column(Boolean, default=False)
    do_not_append_mailing = Column(Boolean, default=False)

    # Owner information
    first_name = Column(String)
    last_name = Column(String)
    owner_name = Column(String)  # Combined or business name
    business_name = Column(String)
    
    # Status and categorization
    status = Column(String)
    lists = Column(String)  # Comma-separated list names
    list_stack = Column(String)
    is_verified_address = Column(Boolean, default=False)
    is_absentee = Column(Boolean, default=False)
    
    # Property details
    bedrooms = Column(Integer)
    bathrooms = Column(Float)
    sqft = Column(Integer)
    air_conditioner = Column(String)
    heating_type = Column(String)
    storeys = Column(Integer)
    year = Column(Integer)  # Year built
    above_grade = Column(String)
    rental_value = Column(Float)
    building_use_code = Column(String)
    neighborhood_rating = Column(String)
    structure_type = Column(String)
    number_of_units = Column(Integer)
    
    # Property identification
    apn = Column(String)  # Assessor's Parcel Number
    parcel_id = Column(String)
    legal_description = Column(Text)
    lot_size = Column(String)
    land_zoning = Column(String)
    
    # Tax information
    tax_auction_date = Column(String)
    total_taxes = Column(Float)
    tax_delinquent_value = Column(Float)
    tax_delinquent_year = Column(Integer)
    year_behind_on_taxes = Column(Integer)
    
    # Transaction history
    deed = Column(String)
    mls = Column(String)
    last_sale_price = Column(Float)
    last_sold = Column(String)
    
    # Distress indicators
    lien_type = Column(String)
    lien_recording_date = Column(String)
    personal_representative = Column(String)
    personal_representative_phone = Column(String)
    probate_open_date = Column(String)
    attorney_on_file = Column(String)
    foreclosure_date = Column(String)
    bankruptcy_recording_date = Column(String)
    divorce_file_date = Column(String)
    
    # Financial metrics
    loan_to_value = Column(Float)
    open_mortgages = Column(Integer)
    mortgage_type = Column(String)
    owned_since = Column(String)
    estimated_value = Column(Float)
    score = Column(Float, default=0.0)
    
    # Metadata
    exported_from_reisift = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tags = relationship("Tag", secondary=lead_tag, back_populates="leads")
    phones = relationship("LeadPhone", back_populates="lead", cascade="all, delete-orphan")
    emails = relationship("LeadEmail", back_populates="lead", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Lead(id={self.id}, address='{self.property_address}')>"


class LeadPhone(Base):
    """Model representing a phone number associated with a lead."""
    __tablename__ = "lead_phones"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    phone_number = Column(String, nullable=False)
    phone_type = Column(String)  # Cell, Home, Office, etc.
    phone_status = Column(String)  # Valid, Disconnected, etc.
    phone_tags = Column(String)  # DoNotCall, SMSOk, etc.
    
    # Relationship back to the lead
    lead = relationship("Lead", back_populates="phones")
    
    def __repr__(self) -> str:
        return f"<LeadPhone(id={self.id}, number='{self.phone_number}')>"


class LeadEmail(Base):
    """Model representing an email address associated with a lead."""
    __tablename__ = "lead_emails"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    email_address = Column(String, nullable=False)
    
    # Relationship back to the lead
    lead = relationship("Lead", back_populates="emails")
    
    def __repr__(self) -> str:
        return f"<LeadEmail(id={self.id}, email='{self.email_address}')>"


class Tag(Base):
    """Model representing a distress indicator or property attribute."""
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    base_score = Column(Float, nullable=False)
    expiration_days = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    leads = relationship("Lead", secondary=lead_tag, back_populates="tags")
    
    def __repr__(self) -> str:
        return f"<Tag(id={self.id}, name='{self.name}', score={self.base_score})>" 