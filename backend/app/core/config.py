"""
Application configuration module that uses Pydantic settings management.
All application settings should be defined and accessed through this module.
"""
from typing import List, Optional, Union

from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application settings with environment variable parsing.
    
    Attributes:
        API_V1_STR: API version prefix
        SECRET_KEY: Secret key for security features
        PROJECT_NAME: Name of the project
        BACKEND_CORS_ORIGINS: List of origins for CORS
        DATABASE_URL: PostgreSQL connection string
        REDIS_URL: Redis connection string
    """
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "development_secret_key"  # Override in production
    PROJECT_NAME: str = "Lead Scoring System"
    
    # CORS configuration
    BACKEND_CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = ["http://localhost:3000"]
    
    # Database
    DATABASE_URL: PostgresDsn = "postgresql://postgres:postgres@db:5432/leadscoring"
    
    # Redis (for caching)
    REDIS_URL: str = "redis://redis:6379/0"
    
    # Tag scoring
    DEFAULT_TAG_EXPIRATION_DAYS: int = 180  # Default of 6 months
    
    # Schedule settings
    RUN_DAILY_SCORING_UPDATE: bool = True
    SCORING_UPDATE_HOUR: int = 2  # Run at 2 AM
    
    @field_validator("BACKEND_CORS_ORIGINS")
    def validate_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Validate and normalize CORS origins."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        if isinstance(v, list):
            return v
        raise ValueError("BACKEND_CORS_ORIGINS should be a list or comma-separated string")

    class Config:
        """Pydantic configuration class."""
        env_file = ".env"
        case_sensitive = True

# Initialize settings instance
settings = Settings() 