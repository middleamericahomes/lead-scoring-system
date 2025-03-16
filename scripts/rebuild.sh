#!/bin/bash

# Rebuild script for Lead Scoring System
# This script rebuilds the Docker containers with the new directory structure

set -e

echo "=== Lead Scoring System Rebuild ==="
echo "This script will rebuild the Docker containers with the new directory structure."
echo ""

# Stop running containers
echo "Stopping running containers..."
docker-compose down

# Remove dangling images
echo "Removing dangling images..."
docker system prune -f

# Rebuild and start containers
echo "Rebuilding and starting containers..."
docker-compose up -d

# Show container status
echo ""
echo "Container status:"
docker-compose ps

echo ""
echo "=== Rebuild completed ==="
echo ""
echo "You can access the application at:"
echo "- API: http://srv754513.hstgr.cloud/api/"
echo "- API Documentation: http://srv754513.hstgr.cloud/docs/"
echo "- Frontend: http://srv754513.hstgr.cloud/" 