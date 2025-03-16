"""
Service module for importing lead data from CSV files.
Contains functions for parsing CSV data and creating lead records.
"""
import csv
import io
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.models import Lead, LeadPhone, LeadEmail
from app.schemas.lead import LeadCreate

def import_leads_csv(csv_content: str, db: Session) -> Dict[str, Any]:
    """
    Import leads from a CSV file.
    
    Args:
        csv_content: CSV file content as a string
        db: Database session
        
    Returns:
        Dictionary with import results including:
        - imported: Number of successfully imported leads
        - errors: List of error messages for failed imports
        - skipped: Number of skipped leads (e.g., duplicates)
    """
    csv_file = io.StringIO(csv_content)
    reader = csv.DictReader(csv_file)
    
    imported = 0
    errors = []
    skipped = 0
    
    for row_idx, row in enumerate(reader, start=2):  # Start at 2 to account for header row
        try:
            # Check for required fields
            if not row.get('property_address') and not row.get('Property address'):
                errors.append(f"Row {row_idx}: Missing required property address")
                continue
                
            # Check if lead already exists
            property_address = row.get('property_address') or row.get('Property address', '')
            existing_lead = db.query(Lead).filter(
                Lead.property_address == property_address.strip()
            ).first()
            
            if existing_lead:
                skipped += 1
                continue
            
            # Create lead from CSV row
            lead = create_lead_from_row(row)
            db.add(lead)
            db.flush()  # Get lead ID for use in related records
            
            # Create phone records
            phone_records = create_phones_from_row(row, lead.id)
            for phone in phone_records:
                db.add(phone)
            
            # Create email records
            email_records = create_emails_from_row(row, lead.id)
            for email in email_records:
                db.add(email)
            
            db.commit()
            imported += 1
            
        except Exception as e:
            db.rollback()
            errors.append(f"Row {row_idx}: {str(e)}")
    
    return {
        "imported": imported,
        "errors": errors,
        "skipped": skipped
    }

def create_lead_from_row(row: Dict[str, str]) -> Lead:
    """
    Create a Lead model instance from a CSV row.
    
    Args:
        row: Dictionary representing a row from the CSV file
        
    Returns:
        Lead model instance
    """
    # Helper function to safely get values with case-insensitive keys
    def get_value(keys, default=None):
        for key in keys:
            # Try exact match first
            if key in row and row[key]:
                return row[key].strip()
            
            # Try case-insensitive match
            for k in row:
                if k.lower() == key.lower() and row[k]:
                    return row[k].strip()
        return default
    
    # Helper function to convert string to int/float safely
    def safe_number(value, converter, default=0):
        if not value:
            return default
        try:
            return converter(value.replace(',', ''))
        except (ValueError, TypeError):
            return default
    
    # Helper function to convert string to boolean
    def parse_bool(value):
        if not value:
            return False
        return value.lower() in ('yes', 'true', 'y', '1', 't')
    
    # Core property information
    property_address = get_value(['property_address', 'Property address'], '')
    property_city = get_value(['property_city', 'Property city'], '')
    property_state = get_value(['property_state', 'Property state'], '')
    property_zip = get_value(['property_zip', 'property_zip_code', 'Property zip'], '')
    
    # Create lead instance
    lead = Lead(
        # Core property information
        property_address=property_address,
        property_city=property_city,
        property_state=property_state,
        property_zip_code=property_zip,
        property_zip5=get_value(['property_zip5', 'Property zip5']),
        property_county=get_value(['property_county', 'Property county']),
        property_vacant=parse_bool(get_value(['property_vacant', 'Property vacant'])),
        
        # Mailing address information
        mailing_address=get_value(['mailing_address', 'Mailing address']),
        mailing_city=get_value(['mailing_city', 'Mailing city']),
        mailing_state=get_value(['mailing_state', 'Mailing state']),
        mailing_zip=get_value(['mailing_zip', 'Mailing zip']),
        mailing_zip5=get_value(['mailing_zip5', 'Mailing zip5']),
        mailing_county=get_value(['mailing_county', 'Mailing county']),
        mailing_vacant=parse_bool(get_value(['mailing_vacant', 'Mailing vacant'])),
        do_not_append_mailing=parse_bool(get_value(['do_not_append_mailing', 'Do not append mailing'])),
        
        # Owner information
        first_name=get_value(['first_name', 'First name', 'First Name']),
        last_name=get_value(['last_name', 'Last name', 'Last Name']),
        owner_name=get_value(['owner_name', 'Owner name', 'Owner Name']),
        business_name=get_value(['business_name', 'Business name', 'Business Name']),
        
        # Status and categorization
        status=get_value(['status', 'Status']),
        lists=get_value(['lists', 'Lists']),
        list_stack=get_value(['list_stack', 'List stack', 'List Stack']),
        is_verified_address=parse_bool(get_value(['is_verified_address', 'verified_address', 'Verified address'])),
        
        # Property details
        bedrooms=safe_number(get_value(['bedrooms', 'Bedrooms']), int),
        bathrooms=safe_number(get_value(['bathrooms', 'Bathrooms']), float),
        sqft=safe_number(get_value(['sqft', 'Sqft', 'square_feet', 'Square feet']), int),
        air_conditioner=get_value(['air_conditioner', 'Air conditioner', 'Air Conditioner']),
        heating_type=get_value(['heating_type', 'Heating type']),
        storeys=safe_number(get_value(['storeys', 'Storeys', 'stories', 'Stories']), int),
        year=safe_number(get_value(['year', 'Year', 'year_built', 'Year built']), int),
        above_grade=get_value(['above_grade', 'Above grade']),
        rental_value=safe_number(get_value(['rental_value', 'Rental value']), float),
        building_use_code=get_value(['building_use_code', 'Building use code']),
        neighborhood_rating=get_value(['neighborhood_rating', 'Neighborhood rating']),
        structure_type=get_value(['structure_type', 'Structure type']),
        number_of_units=safe_number(get_value(['number_of_units', 'Number of units']), int),
        
        # Property identification
        apn=get_value(['apn', 'Apn', 'APN']),
        parcel_id=get_value(['parcel_id', 'Parcel id', 'Parcel ID']),
        legal_description=get_value(['legal_description', 'Legal description']),
        lot_size=get_value(['lot_size', 'Lot size']),
        land_zoning=get_value(['land_zoning', 'Land zoning']),
        
        # Tax information
        tax_auction_date=get_value(['tax_auction_date', 'Tax auction date']),
        total_taxes=safe_number(get_value(['total_taxes', 'Total taxes']), float),
        tax_delinquent_value=safe_number(get_value(['tax_delinquent_value', 'Tax delinquent value']), float),
        tax_delinquent_year=safe_number(get_value(['tax_delinquent_year', 'Tax delinquent year']), int),
        year_behind_on_taxes=safe_number(get_value(['year_behind_on_taxes', 'Year behind on taxes']), int),
        
        # Transaction history
        deed=get_value(['deed', 'Deed']),
        mls=get_value(['mls', 'Mls', 'MLS']),
        last_sale_price=safe_number(get_value(['last_sale_price', 'Last sale price']), float),
        last_sold=get_value(['last_sold', 'Last sold']),
        
        # Distress indicators
        lien_type=get_value(['lien_type', 'Lien type']),
        lien_recording_date=get_value(['lien_recording_date', 'Lien recording date']),
        personal_representative=get_value(['personal_representative', 'Personal representative']),
        personal_representative_phone=get_value(['personal_representative_phone', 'Personal representative phone']),
        probate_open_date=get_value(['probate_open_date', 'Probate open date']),
        attorney_on_file=get_value(['attorney_on_file', 'Attorney on file']),
        foreclosure_date=get_value(['foreclosure_date', 'Foreclosure date']),
        bankruptcy_recording_date=get_value(['bankruptcy_recording_date', 'Bankruptcy recording date']),
        divorce_file_date=get_value(['divorce_file_date', 'Divorce file date']),
        
        # Financial metrics
        loan_to_value=safe_number(get_value(['loan_to_value', 'Loan to value', 'LTV']), float),
        open_mortgages=safe_number(get_value(['open_mortgages', 'Open mortgages']), int),
        mortgage_type=get_value(['mortgage_type', 'Mortgage type']),
        owned_since=get_value(['owned_since', 'Owned since']),
        estimated_value=safe_number(get_value(['estimated_value', 'Estimated value']), float),
        
        # Metadata
        exported_from_reisift=get_value(['exported_from_reisift', 'exported from REISift.io']),
        
        # Auto-calculated fields
        is_absentee=False,  # Will be calculated after checking mailing vs property address
        score=0.0  # Will be calculated later based on tags
    )
    
    # Calculate absentee status
    if (lead.mailing_address and lead.property_address and 
        lead.mailing_address != lead.property_address):
        lead.is_absentee = True
    
    return lead

def create_phones_from_row(row: Dict[str, str], lead_id: int) -> List[LeadPhone]:
    """
    Create LeadPhone model instances from a CSV row.
    
    Args:
        row: Dictionary representing a row from the CSV file
        lead_id: ID of the lead these phones belong to
        
    Returns:
        List of LeadPhone model instances
    """
    phones = []
    
    # Look for Phone 1 through Phone 30
    for i in range(1, 31):
        phone_key = f"Phone {i}"
        phone_type_key = f"Phone Type {i}"
        phone_status_key = f"Phone Status {i}"
        phone_tags_key = f"Phone Tags {i}"
        
        # Try case variations too
        phone_variations = [phone_key, phone_key.lower(), phone_key.upper()]
        
        # Find the phone number
        phone_number = None
        for key_var in phone_variations:
            if key_var in row and row[key_var]:
                phone_number = row[key_var].strip()
                break
        
        if not phone_number:
            continue
        
        # Find associated metadata
        phone_type = None
        phone_status = None
        phone_tags = None
        
        for key in row:
            if key.lower() == phone_type_key.lower() and row[key]:
                phone_type = row[key].strip()
            elif key.lower() == phone_status_key.lower() and row[key]:
                phone_status = row[key].strip()
            elif key.lower() == phone_tags_key.lower() and row[key]:
                phone_tags = row[key].strip()
        
        # Create phone record
        phone = LeadPhone(
            lead_id=lead_id,
            phone_number=phone_number,
            phone_type=phone_type,
            phone_status=phone_status,
            phone_tags=phone_tags
        )
        phones.append(phone)
    
    return phones

def create_emails_from_row(row: Dict[str, str], lead_id: int) -> List[LeadEmail]:
    """
    Create LeadEmail model instances from a CSV row.
    
    Args:
        row: Dictionary representing a row from the CSV file
        lead_id: ID of the lead these emails belong to
        
    Returns:
        List of LeadEmail model instances
    """
    emails = []
    
    # Look for Email 1 through Email 10
    for i in range(1, 11):
        email_key = f"Email {i}"
        
        # Try case variations too
        email_variations = [email_key, email_key.lower(), email_key.upper()]
        
        # Find the email address
        email_address = None
        for key_var in email_variations:
            if key_var in row and row[key_var]:
                email_address = row[key_var].strip()
                break
        
        if not email_address:
            continue
        
        # Create email record
        email = LeadEmail(
            lead_id=lead_id,
            email_address=email_address
        )
        emails.append(email)
    
    return emails 