#!/bin/bash

# Backup script for Lead Scoring System
# This script creates backups of the PostgreSQL database and configuration files

set -e

# Configuration
BACKUP_DIR="/opt/backups/lead-scoring-system"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
PROJECT_DIR="/opt/lead-scoring-system"
DB_CONTAINER="lead-scoring-system_db_1"
DB_NAME="leadscoring"
DB_USER="postgres"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR/configs"
mkdir -p "$BACKUP_DIR/database"

echo "=== Lead Scoring System Backup ==="
echo "Creating backup with timestamp: $TIMESTAMP"
echo ""

# Backup environment variables
echo "Backing up environment variables..."
cp "$PROJECT_DIR/.env" "$BACKUP_DIR/configs/.env-$TIMESTAMP"

# Backup Docker Compose configuration
echo "Backing up Docker Compose configuration..."
cp "$PROJECT_DIR/docker-compose.yml" "$BACKUP_DIR/configs/docker-compose-$TIMESTAMP.yml"

# Backup Nginx configuration
echo "Backing up Nginx configuration..."
cp "$PROJECT_DIR/configs/nginx/lead-scoring.conf" "$BACKUP_DIR/configs/nginx-$TIMESTAMP.conf"

# Backup PostgreSQL database
echo "Backing up PostgreSQL database..."
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "/tmp/db-$TIMESTAMP.dump"
docker cp "$DB_CONTAINER:/tmp/db-$TIMESTAMP.dump" "$BACKUP_DIR/database/"
docker exec "$DB_CONTAINER" rm "/tmp/db-$TIMESTAMP.dump"

# Create tarball of the entire backup
echo "Creating tarball of the backup..."
tar -czf "$BACKUP_DIR/lead-scoring-backup-$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" configs database

# Remove old backups (keep last 7 days)
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "lead-scoring-backup-*.tar.gz" -type f -mtime +7 -delete

echo ""
echo "=== Backup completed ==="
echo "Backup saved to: $BACKUP_DIR/lead-scoring-backup-$TIMESTAMP.tar.gz"
echo ""
echo "You can restore the database with:"
echo "docker exec -i $DB_CONTAINER pg_restore -U $DB_USER -d $DB_NAME -c < $BACKUP_DIR/database/db-$TIMESTAMP.dump" 