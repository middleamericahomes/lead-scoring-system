#!/bin/bash
# Deployment script for Lead Scoring System

# Exit on error
set -e

# Configuration
DEPLOY_DIR="/opt/lead-scoring-system"
GITHUB_REPO="https://github.com/sethdawson/lead-scoring-system.git"
NGINX_CONF="/etc/nginx/sites-available/lead-scoring.conf"
DOMAIN="lead-scoring.midleamericahomes.com"
SERVER_HOSTNAME="srv754513.hstgr.cloud"

# Print colored messages
print_message() {
    echo -e "\e[1;34m[DEPLOY] $1\e[0m"
}

print_error() {
    echo -e "\e[1;31m[ERROR] $1\e[0m"
}

print_success() {
    echo -e "\e[1;32m[SUCCESS] $1\e[0m"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  print_error "Please run as root"
  exit 1
fi

# Update system
print_message "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_message "Installing required packages..."
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# Create deploy directory
print_message "Creating deployment directory..."
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# Copy configuration files
print_message "Copying configuration files..."
cp /opt/lead-scoring-system/docker-compose.prod.yml $DEPLOY_DIR/docker-compose.yml
cp /opt/lead-scoring-system/.env.prod $DEPLOY_DIR/.env
cp /opt/lead-scoring-system/lead-scoring.conf $NGINX_CONF

# Link Nginx configuration
if [ ! -f /etc/nginx/sites-enabled/lead-scoring.conf ]; then
    print_message "Enabling Nginx site..."
    ln -s $NGINX_CONF /etc/nginx/sites-enabled/
fi

# Restart Nginx
print_message "Restarting Nginx..."
systemctl restart nginx

# Setup SSL certificate for custom domain (if DNS is configured)
if nslookup $DOMAIN > /dev/null 2>&1; then
    print_message "Setting up SSL certificate for $DOMAIN..."
    certbot --nginx -d $DOMAIN -d $SERVER_HOSTNAME --non-interactive --agree-tos --email seth@midleamericahomes.com
else
    print_message "Setting up SSL certificate for $SERVER_HOSTNAME only..."
    certbot --nginx -d $SERVER_HOSTNAME --non-interactive --agree-tos --email seth@midleamericahomes.com
    print_message "Note: DNS for $DOMAIN is not configured yet. Run certbot again after DNS setup."
fi

# Clone or pull repository
if [ ! -d "$DEPLOY_DIR/backend" ]; then
    print_message "Cloning repository..."
    git clone $GITHUB_REPO .
else
    print_message "Updating repository..."
    git pull
fi

# Start Docker services
print_message "Starting Docker services..."
cd $DEPLOY_DIR
docker-compose down
docker-compose up -d

# Create initial admin user
print_message "Creating admin user..."
docker-compose exec backend python -m app.create_admin || print_message "Could not create admin user. Will try later."

# Success message
print_success "Deployment completed successfully!"
print_success "You can access the application at https://$SERVER_HOSTNAME (server hostname)"
if nslookup $DOMAIN > /dev/null 2>&1; then
    print_success "Or at https://$DOMAIN (custom domain)"
else
    print_message "Custom domain is not set up yet. Add DNS record and run certbot again."
fi 