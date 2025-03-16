"""
Script to seed the database with initial data.
This creates some default tags for testing purposes.
"""
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our app
sys.path.append(str(Path(__file__).parent.parent.parent))

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.models import Tag

# Define default tags and their scores
DEFAULT_TAGS = [
    {"name": "Foreclosure", "base_score": 1500, "expiration_days": 180},
    {"name": "Vacant", "base_score": 2000, "expiration_days": 180},
    {"name": "Tax Lien", "base_score": 800, "expiration_days": 365},
    {"name": "Probate", "base_score": 1000, "expiration_days": 365},
    {"name": "Divorce", "base_score": 600, "expiration_days": 180},
    {"name": "Bankruptcy", "base_score": 1200, "expiration_days": 365},
    {"name": "Pre-Foreclosure", "base_score": 1300, "expiration_days": 90},
    {"name": "Code Violation", "base_score": 400, "expiration_days": 180},
    {"name": "Absentee Owner", "base_score": 500, "expiration_days": None},
    {"name": "High Equity", "base_score": 600, "expiration_days": None},
]

def seed_tags(db: Session):
    """
    Seed the database with default tags.
    
    Args:
        db: Database session
    
    Returns:
        Number of tags created
    """
    created_count = 0
    
    for tag_data in DEFAULT_TAGS:
        # Check if tag already exists
        existing_tag = db.query(Tag).filter(Tag.name == tag_data["name"]).first()
        if existing_tag:
            print(f"Tag '{tag_data['name']}' already exists, skipping.")
            continue
        
        # Create new tag
        tag = Tag(**tag_data)
        db.add(tag)
        created_count += 1
        print(f"Created tag: {tag_data['name']}")
    
    # Commit changes
    db.commit()
    
    return created_count

def main():
    """Main function to run the seed script."""
    db = SessionLocal()
    try:
        print("Seeding database...")
        tags_created = seed_tags(db)
        print(f"Created {tags_created} new tags.")
    finally:
        db.close()
    
    print("Seeding completed.")

if __name__ == "__main__":
    main() 