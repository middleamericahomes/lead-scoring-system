# Lead Scoring System for reiconnected.com

This repository contains the configuration and deployment files for the Lead Scoring System, deployed at reiconnected.com.

## System Architecture

The Lead Scoring System is built with the following components:

- **Backend**: FastAPI application with PostgreSQL database and Redis for caching
- **Frontend**: Next.js application (React)
- **Deployment**: Docker Compose for container orchestration
- **Web Server**: Nginx for HTTP serving and reverse proxy
- **SSL**: Let's Encrypt for HTTPS certificates

## Directory Structure

```
/opt/lead-scoring-system/
├── .env                       # Environment variables for Docker
├── .gitignore                 # Git ignore file
├── README.md                  # Main project documentation
├── docker-compose.yml         # Main Docker Compose configuration
├── app/                       # Application code
│   ├── backend/               # Backend application code
│   └── frontend/              # Frontend application code
├── configs/                   # Configuration files
│   ├── nginx/                 # Nginx configuration files
│   │   └── lead-scoring.conf
│   └── docker/                # Docker configurations
│       └── .env.example       # Example environment file
├── scripts/                   # Utility scripts
│   ├── backup.sh              # Database backup script
│   ├── deploy.sh              # Deployment script
│   ├── rebuild.sh             # Container rebuild script
│   └── setup-ssl-reiconnected.sh # SSL setup script for reiconnected.com
└── docs/                      # Documentation
    ├── DEPLOYMENT_GUIDE.md    # Deployment guide
    ├── godaddy-dns-setup.md   # DNS setup instructions for GoDaddy
    ├── reiconnected-deployment-plan.md # Deployment plan for reiconnected.com
    └── frontend-fix-steps.md  # Steps to fix frontend issues
```

## Access Information

- **Domain**: reiconnected.com
- **Server**: srv754513.hstgr.cloud (147.93.44.251)
- **API Endpoint**: https://reiconnected.com/api/
- **API Documentation**: https://reiconnected.com/docs/

## Deployment Steps

1. Configure DNS settings at GoDaddy (see `docs/godaddy-dns-setup.md`)
2. Set up SSL certificates (see `scripts/setup-ssl-reiconnected.sh`)
3. Deploy application with Docker Compose:
   ```bash
   cd /opt/lead-scoring-system
   docker-compose up -d
   ```

## Maintenance Tasks

### Backups

Backups are automatically performed daily at 2 AM using a cronjob:

```bash
# View current backup schedule
crontab -l

# Run backup manually
/opt/lead-scoring-system/scripts/backup.sh
```

Backups are stored in `/opt/backups/lead-scoring-system/`.

### Updates

To update the application:

```bash
cd /opt/lead-scoring-system
git pull
docker-compose down
docker-compose up -d
```

### SSL Certificate Renewal

Let's Encrypt certificates auto-renew with certbot. To check certificate status:

```bash
certbot certificates
```

## Troubleshooting

### Checking Services

```bash
# Check Docker containers
docker ps

# Check Nginx service
systemctl status nginx

# Check database connection
docker exec -it lead-scoring-system_db_1 psql -U postgres -d leadscoring
```

### Logs

```bash
# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Docker logs
docker logs lead-scoring-system_backend_1
docker logs lead-scoring-system_frontend_1
```

## Contact Information

For support, contact:
- Email: seth@midleamericahomes.com

## License

Copyright © 2025 reiconnected.com. All rights reserved. 