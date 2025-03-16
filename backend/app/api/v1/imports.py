"""
API router for imports.
Handles file uploads for leads and other data.
"""
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.import_service import import_leads_csv

router = APIRouter(prefix="/imports", tags=["imports"])

@router.post("/leads", status_code=status.HTTP_201_CREATED)
async def import_leads(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Import leads from a CSV file.
    
    Args:
        file: CSV file to import
        db: Database session
    
    Returns:
        Import results including counts and errors
    
    Raises:
        HTTPException: If file is not a CSV
    """
    # Check file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    # Read file content
    contents = await file.read()
    
    # Convert bytes to string
    csv_content = contents.decode("utf-8-sig", errors="replace")
    
    # Process the import
    result = import_leads_csv(csv_content, db)
    
    return {
        "filename": file.filename,
        "imported_count": result["imported"],
        "skipped_count": result["skipped"],
        "error_count": len(result["errors"]),
        "errors": result["errors"][:10],  # Limit errors to avoid huge responses
        "has_more_errors": len(result["errors"]) > 10
    } 