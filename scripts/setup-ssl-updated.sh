#!/bin/bash

# SSL Setup script for Lead Scoring System
# This script sets up SSL certificates using Let's Encrypt for reiconnected.com

set -e

DOMAIN="reiconnected.com"
EMAIL="seth@midleamericahomes.com"

echo "=== Lead Scoring System SSL Setup ==="
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

# Before requesting certificate, make sure DNS is properly configured
echo "Checking DNS configuration for $DOMAIN..."
IP_ADDR=$(dig +short $DOMAIN)
SERVER_IP="147.93.44.251"

if [ "$IP_ADDR" != "$SERVER_IP" ]; then
    echo "WARNING: DNS for $DOMAIN does not point to $SERVER_IP"
    echo "Current DNS points to: $IP_ADDR"
    echo "Please update your DNS settings at GoDaddy to point to $SERVER_IP before continuing."
    echo "Would you like to continue anyway? (y/n)"
    read CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        echo "Exiting. Please run this script again after updating DNS settings."
        exit 1
    fi
fi

# Request the certificate
echo "Requesting certificate from Let's Encrypt..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

echo ""
echo "=== SSL Setup completed ==="
echo ""
echo "You can now access the application securely at:"
echo "- https://$DOMAIN"
echo "- https://www.$DOMAIN"
echo ""
echo "Next steps:"
echo "1. Test the secure connection"
echo "2. Update any hardcoded URLs in the application to use https://$DOMAIN" 