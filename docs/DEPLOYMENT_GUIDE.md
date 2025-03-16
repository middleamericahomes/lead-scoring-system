# Lead Scoring System Deployment Guide

This guide provides step-by-step instructions for setting up and deploying the Lead Scoring System on a Hostinger VPS.

## Server Information

- **Server IP:** 147.93.44.251
- **Server Hostname:** srv754513.hstgr.cloud
- **OS:** Ubuntu 24.04.2 LTS
- **Resources:** 4 vCPUs, 8GB RAM, 100GB SSD

## 1. Initial Server Setup

### 1.1 SSH Access

```bash
# Generate SSH key (if not already done)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to Hostinger dashboard
cat ~/.ssh/id_ed25519.pub

# Test SSH connection (using IP)
ssh root@147.93.44.251

# Or using hostname
ssh root@srv754513.hstgr.cloud
```

### 1.2 Update System Packages

```bash
apt update && apt upgrade -y
```

### 1.3 Set Up Firewall

```bash
apt install -y ufw
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable
```

## 2. Software Installation

### 2.1 Install Docker and Docker Compose

```bash
apt install -y docker.io docker-compose
```

### 2.2 Install Nginx and Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
```

## 3. Application Deployment

### 3.1 Create Deployment Directory

```bash
mkdir -p /opt/lead-scoring-system
cd /opt/lead-scoring-system
```

### 3.2 Copy Configuration Files

```bash
# On your local machine
scp docker-compose.prod.yml .env.prod lead-scoring.conf deploy.sh dns-setup.md root@srv754513.hstgr.cloud:/opt/lead-scoring-system/
```

### 3.3 Set Up Nginx Configuration

```bash
cp /opt/lead-scoring-system/lead-scoring.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/lead-scoring.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 3.4 Deploy Application

Option 1: Clone from GitHub
```bash
cd /opt/lead-scoring-system
git clone https://github.com/sethdawson/lead-scoring-system.git .
```

Option 2: Use deployment script
```bash
cd /opt/lead-scoring-system
mv docker-compose.prod.yml docker-compose.yml
mv .env.prod .env
chmod +x deploy.sh
./deploy.sh
```

## 4. DNS Configuration

You can immediately access your application using the server hostname:
```
http://srv754513.hstgr.cloud
```

For custom domain setup, add the following A record to your domain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | lead-scoring | 147.93.44.251 | 3600 |

## 5. SSL Certificate

For the default server hostname (works immediately):
```bash
certbot --nginx -d srv754513.hstgr.cloud --non-interactive --agree-tos --email seth@midleamericahomes.com
```

After custom domain DNS propagation:
```bash
certbot --nginx -d lead-scoring.midleamericahomes.com -d srv754513.hstgr.cloud --non-interactive --agree-tos --email seth@midleamericahomes.com
```

## 6. Maintenance and Updates

### 6.1 Update Application

```bash
cd /opt/lead-scoring-system
git pull
docker-compose down
docker-compose up -d
```

### 6.2 Database Backup

```bash
cd /opt/lead-scoring-system
docker-compose exec db pg_dump -U postgres leadscoring > backup_$(date +%Y%m%d).sql
```

### 6.3 Monitoring and Logs

```bash
# View container status
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

## 7. Security Best Practices

1. Regularly update system packages: `apt update && apt upgrade -y`
2. Regularly rotate SSH keys
3. Implement fail2ban for SSH protection
4. Only open necessary ports in the firewall
5. Regularly backup data
6. Monitor system resources and logs

## 8. Troubleshooting

### 8.1 Nginx Issues

```bash
# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# View Nginx logs
tail -f /var/log/nginx/error.log
```

### 8.2 Docker Issues

```bash
# Restart Docker
systemctl restart docker

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 8.3 SSL Certificate Issues

```bash
# Renew certificates manually
certbot renew
```

## 9. Contact Information

For support, contact:
- **Email:** seth@midleamericahomes.com 