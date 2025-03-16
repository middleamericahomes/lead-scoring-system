"""
SQLAlchemy models for the Lead Scoring System database.
Defines the database schema for leads, tags, and relationships.
"""
from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey, 
    Integer, String, Table, UniqueConstraint
)
from sqlalchemy.orm import relationship

from app.core.database import Base

# Lead-Tag association table (many-to-many relationship)
lead_tag = Table(
    "lead_tag",
    Base.metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("lead_id", Integer, ForeignKey("leads.id", ondelete="CASCADE")),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE")),
    Column("assigned_at", DateTime, default=datetime.utcnow),
    Column("expiration_at", DateTime, nullable=True),
    Column("is_expired", Boolean, default=False),
    UniqueConstraint("lead_id", "tag_id", name="uix_lead_tag"),
)

class Lead(Base):
    """
    Lead model representing a property of interest.
    
    Attributes:
        id: Unique identifier
        property_address: Physical address of the property
        city: City of the property
        state: State of the property
        zip_code: ZIP code of the property
        mailing_address: Owner's mailing address
        mailing_city: Owner's mailing city
        mailing_state: Owner's mailing state
        mailing_zip: Owner's mailing ZIP code
        owner_name: Name of the property owner
        score: Current lead score
        is_verified_address: Whether the address has been verified
        do_not_append_mailing: Whether to ignore mailing address updates
        is_absentee: Whether the owner lives at a different address
        created_at: When the lead was created
        updated_at: When the lead was last updated
        tags: Relationship to tags through lead_tag table
    """
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    property_address = Column(String, index=True, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    
    mailing_address = Column(String, nullable=True)
    mailing_city = Column(String, nullable=True)
    mailing_state = Column(String, nullable=True)
    mailing_zip = Column(String, nullable=True)
    
    owner_name = Column(String, nullable=True)
    score = Column(Float, default=0.0)
    
    is_verified_address = Column(Boolean, default=False)
    do_not_append_mailing = Column(Boolean, default=False)
    is_absentee = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tags = relationship(
        "Tag", 
        secondary=lead_tag, 
        back_populates="leads",
        lazy="joined"
    )
    
    def __repr__(self):
        return f"<Lead {self.id}: {self.property_address}>"

class Tag(Base):
    """
    Tag model representing a distress indicator or property attribute.
    
    Attributes:
        id: Unique identifier
        name: Name of the tag (e.g., "Foreclosure", "Vacant")
        base_score: Score value added when this tag is assigned to a lead
        expiration_days: Number of days until the tag expires
        created_at: When the tag was created
        leads: Relationship to leads through lead_tag table
    """
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    base_score = Column(Float, default=0.0, nullable=False)
    expiration_days = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    leads = relationship(
        "Lead", 
        secondary=lead_tag, 
        back_populates="tags",
        lazy="joined"
    )
    
    def __repr__(self):
        return f"<Tag {self.id}: {self.name}>" 