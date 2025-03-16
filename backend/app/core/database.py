"""
Database configuration module that sets up SQLAlchemy session and engine.
Provides session factory and Base class for model definitions.
"""
import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get database URL from environment or use a default for development
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@db:5432/leadscoring"
)

# Create SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db() -> Generator:
    """
    Dependency function that provides a database session.
    
    Yields:
        Session: Database session that will be closed after use
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 