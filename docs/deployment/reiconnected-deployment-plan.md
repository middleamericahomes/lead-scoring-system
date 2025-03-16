# Deployment Plan for reiconnected.com

This document outlines the complete plan for deploying the Lead Scoring System to reiconnected.com.

## 1. Domain Configuration

### GoDaddy DNS Setup
- Update A record for @ to point to 147.93.44.251
- Add A record for www to point to 147.93.44.251
- Optional: Add A record for api to point to 147.93.44.251
- Verify DNS propagation using `dig reiconnected.com`

## 2. Server Configuration

### Update Nginx Configuration
- Upload the new Nginx configuration:
  ```bash
  scp reiconnected-nginx.conf root@srv754513.hstgr.cloud:/etc/nginx/sites-available/reiconnected.conf
  ssh root@srv754513.hstgr.cloud "ln -s /etc/nginx/sites-available/reiconnected.conf /etc/nginx/sites-enabled/"
  ssh root@srv754513.hstgr.cloud "nginx -t && systemctl reload nginx"
  ```

### SSL Certificate Setup
- Upload the updated SSL script:
  ```bash
  scp setup-ssl-updated.sh root@srv754513.hstgr.cloud:/opt/lead-scoring-system/scripts/
  ssh root@srv754513.hstgr.cloud "chmod +x /opt/lead-scoring-system/scripts/setup-ssl-updated.sh"
  ```
- After DNS propagation, run the SSL setup script:
  ```bash
  ssh root@srv754513.hstgr.cloud "cd /opt/lead-scoring-system/scripts && ./setup-ssl-updated.sh"
  ```

## 3. Frontend Fixes

### Remove macOS Metadata Files
```bash
ssh root@srv754513.hstgr.cloud "cd /opt/lead-scoring-system/app/frontend && find . -name '._*' -type f -delete"
```

### Add ESLint Configuration
```bash
scp .eslintrc.json root@srv754513.hstgr.cloud:/opt/lead-scoring-system/app/frontend/.eslintrc.json
```

### Add Next.js Configuration
```bash
scp next.config.js root@srv754513.hstgr.cloud:/opt/lead-scoring-system/app/frontend/next.config.js
```

### Create Frontend Dockerfile
```bash
scp frontend-dockerfile root@srv754513.hstgr.cloud:/opt/lead-scoring-system/app/frontend/Dockerfile
```

### Update Docker Compose Configuration
```bash
scp docker-compose.yml root@srv754513.hstgr.cloud:/opt/lead-scoring-system/docker-compose.yml
```

## 4. Application Deployment

### Rebuild and Start Services
```bash
ssh root@srv754513.hstgr.cloud "cd /opt/lead-scoring-system && docker-compose down && docker-compose up -d"
```

### Verify Services
```bash
ssh root@srv754513.hstgr.cloud "docker ps"
```

## 5. Testing

### Test API Endpoint
```bash
curl -I https://reiconnected.com/api/
```

### Test API Documentation
```bash
curl -I https://reiconnected.com/docs/
```

### Test Frontend
```bash
curl -I https://reiconnected.com
```

## 6. Post-Deployment Tasks

### Update Application URLs
- Check for any hardcoded URLs in the application and update them to use https://reiconnected.com

### Set Up Monitoring
- Install and configure monitoring tools (Prometheus, Grafana, etc.)
- Set up alerts for critical services

### Set Up Backup Schedule
- Verify that the backup script is running correctly
- Ensure backups are being stored securely

## 7. Maintenance Plan

### Regular Updates
- Schedule regular updates for:
  - Operating system packages
  - Docker containers
  - Application dependencies

### SSL Certificate Renewal
- Verify that automatic renewal is working
- Set up alerts for certificate expiration

### Performance Monitoring
- Monitor application performance
- Optimize as needed

## 8. Documentation

### Update User Documentation
- Create user guides for the application
- Document administrator tasks

### Update Technical Documentation
- Document system architecture
- Document deployment procedures
- Document troubleshooting steps 