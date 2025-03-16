#!/bin/bash

# SSL Setup script for Lead Scoring System
# This script sets up SSL certificates using Let's Encrypt

set -e

echo "=== Lead Scoring System SSL Setup ==="
echo "This script will set up SSL certificates for the domain."
echo ""

# Prompt for domain if not provided
if [ -z "$1" ]; then
    echo "Enter the domain (e.g., lead-scoring.midleamericahomes.com): "
    read DOMAIN
else
    DOMAIN=$1
fi

# Prompt for email if not provided
if [ -z "$2" ]; then
    echo "Enter your email address: "
    read EMAIL
else
    EMAIL=$2
fi

echo "Setting up SSL for domain: $DOMAIN with email: $EMAIL"
echo ""

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Installing..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Ensure Nginx is running
systemctl start nginx

# Request the certificate
echo "Requesting certificate from Let's Encrypt..."
certbot --nginx -d $DOMAIN -d srv754513.hstgr.cloud --non-interactive --agree-tos --email $EMAIL

echo ""
echo "=== SSL Setup completed ==="
echo ""
echo "You can now access the application securely at:"
echo "- https://$DOMAIN"
echo "- https://srv754513.hstgr.cloud" 