#!/bin/bash

# Local Development Backup Script for Lead Scoring System
# This script creates a compressed backup of the entire project directory

# Exit on any error
set -e

# Configuration
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
PROJECT_DIR="$(pwd)"
BACKUP_DIR="$HOME/Backups/lead-scoring-system"
BACKUP_FILE="lead-scoring-system-backup-$TIMESTAMP.zip"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "=== Lead Scoring System Local Backup ==="
echo "Creating backup with timestamp: $TIMESTAMP"
echo "Project directory: $PROJECT_DIR"
echo "Backup destination: $BACKUP_DIR/$BACKUP_FILE"
echo ""

# Create the backup - exclude node_modules, env files and other large directories
echo "Creating backup archive..."
zip -r "$BACKUP_DIR/$BACKUP_FILE" "$PROJECT_DIR" \
    -x "*/node_modules/*" \
    -x "*/venv/*" \
    -x "*/.git/*" \
    -x "*/data/*" \
    -x "*/__pycache__/*" \
    -x "*.pyc" \
    -x "*.pyo" \
    -x "*.env" \
    -x "*/.DS_Store" \
    -x "*/build/*" \
    -x "*/dist/*" \
    -x "*/.next/*"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "=== Backup completed successfully ==="
    echo "Backup saved to: $BACKUP_DIR/$BACKUP_FILE"
    
    # Calculate size of backup
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "Backup size: $BACKUP_SIZE"
    
    # List the last 5 backups
    echo ""
    echo "Recent backups:"
    ls -lt "$BACKUP_DIR" | grep "lead-scoring-system-backup" | head -5
else
    echo ""
    echo "=== Backup failed ==="
    echo "Please check the error messages above."
fi 