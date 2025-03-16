# Deployment Guide for Hostinger VPS

This guide provides step-by-step instructions for deploying the Lead Scoring System on a Hostinger VPS.

## VPS Specifications

The application is optimized for the following VPS specifications:
- **Plan**: KVM 2 or higher
- **CPU**: 2+ vCPU cores
- **RAM**: 8GB+
- **Storage**: 100GB+ SSD
- **OS**: Ubuntu 24.04 LTS

## Initial Server Setup

1. **Connect to your VPS**:
   ```bash
   ssh root@your_server_ip
   ```

2. **Update system packages**:
   ```bash
   apt update && apt upgrade -y
   ```

3. **Create a non-root user**:
   ```bash
   adduser appuser
   usermod -aG sudo appuser
   ```

4. **Set up SSH key authentication**:
   ```bash
   mkdir -p /home/appuser/.ssh
   nano /home/appuser/.ssh/authorized_keys
   # Paste your public key here
   chmod 700 /home/appuser/.ssh
   chmod 600 /home/appuser/.ssh/authorized_keys
   chown -R appuser:appuser /home/appuser/.ssh
   ```

5. **Install essential packages**:
   ```bash
   apt install -y git curl wget nano build-essential
   ```

## Install Docker and Docker Compose

1. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   usermod -aG docker appuser
   ```

2. **Install Docker Compose**:
   ```bash
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   ```

## Deploy the Application

1. **Clone the repository**:
   ```bash
   mkdir -p /var/www
   cd /var/www
   git clone https://github.com/middleamericahomes/lead-scoring-system.git
   cd lead-scoring-system
   ```

2. **Create environment files**:
   ```bash
   # Create .env file for the backend
   cat > backend/.env << EOL
   DATABASE_URL=postgresql://postgres:secure_password@db:5432/leadscoring
   SECRET_KEY=your_secure_secret_key
   ENVIRONMENT=production
   EOL

   # Create .env file for the frontend
   cat > frontend/.env << EOL
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   EOL
   ```

3. **Customize the docker-compose.yml file for production**:
   ```bash
   # Create a production docker-compose file
   cp docker-compose.yml docker-compose.prod.yml
   ```
   
   Edit the file to:
   - Remove development-specific settings
   - Add production configs
   - Set up volumes for persistent data
   - Configure proper restart policies

4. **Start the application**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Initialize the database**:
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

## Set Up Nginx as Reverse Proxy

1. **Install Nginx**:
   ```bash
   apt install -y nginx
   ```

2. **Configure Nginx**:
   ```bash
   nano /etc/nginx/sites-available/lead-scoring
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable the site and restart Nginx**:
   ```bash
   ln -s /etc/nginx/sites-available/lead-scoring /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

## Set Up SSL with Let's Encrypt

1. **Install Certbot**:
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificates**:
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Set up auto-renewal**:
   ```bash
   certbot renew --dry-run
   ```

## Database Backup Strategy

1. **Create a backup script**:
   ```bash
   mkdir -p /var/backups/lead-scoring
   nano /usr/local/bin/backup-db.sh
   ```

   Add the following content:
   ```bash
   #!/bin/bash
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_DIR="/var/backups/lead-scoring"
   CONTAINER_NAME="lead-scoring-system_db_1"

   # Create backup
   docker exec $CONTAINER_NAME pg_dump -U postgres leadscoring > $BACKUP_DIR/leadscoring_$TIMESTAMP.sql

   # Remove backups older than 7 days
   find $BACKUP_DIR -name "leadscoring_*.sql" -type f -mtime +7 -delete
   ```

2. **Make the script executable and set up a cron job**:
   ```bash
   chmod +x /usr/local/bin/backup-db.sh
   crontab -e
   ```

   Add the following line to run daily at 3 AM:
   ```
   0 3 * * * /usr/local/bin/backup-db.sh
   ```

## Resource Optimization for Hostinger VPS

For a KVM 2 plan (2 vCPU, 8GB RAM), optimize PostgreSQL with these settings:

1. Edit `/var/lib/docker/volumes/lead-scoring-system_postgres_data/_data/postgresql.conf`:
   ```
   max_connections = 100
   shared_buffers = 2GB
   effective_cache_size = 6GB
   work_mem = 64MB
   maintenance_work_mem = 256MB
   max_worker_processes = 2
   max_parallel_workers_per_gather = 1
   max_parallel_workers = 2
   ```

2. Configure container resource limits in docker-compose.prod.yml:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 2G
     
     frontend:
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 1G
     
     db:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 3G
   ```

## Monitoring and Maintenance

1. **Set up basic monitoring**:
   ```bash
   apt install -y htop iotop netdata
   ```

2. **Access Netdata dashboard**:
   ```
   http://your_server_ip:19999
   ```

3. **View container logs**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f [service_name]
   ```

4. **Update the application**:
   ```bash
   cd /var/www/lead-scoring-system
   git pull
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

## Firewall Configuration

1. **Set up UFW firewall**:
   ```bash
   apt install -y ufw
   ufw allow ssh
   ufw allow http
   ufw allow https
   ufw enable
   ```

2. **Verify firewall status**:
   ```bash
   ufw status
   ```