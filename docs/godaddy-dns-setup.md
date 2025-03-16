# GoDaddy DNS Configuration Guide for reiconnected.com

This guide will help you configure your GoDaddy DNS settings to point to your Hostinger VPS where the Lead Scoring System is deployed.

## Required Information

- **Domain Name**: reiconnected.com
- **Server IP Address**: 147.93.44.251
- **Hostinger Server Name**: srv754513.hstgr.cloud

## DNS Configuration Steps

1. **Log in to your GoDaddy account**
   - Go to [godaddy.com](https://www.godaddy.com)
   - Sign in with your account credentials

2. **Access DNS Management**
   - Click on "My Products"
   - Find reiconnected.com and click "DNS"

3. **Update A Records**
   - Look for the A record with "@" (represents the root domain)
   - Click edit and change the value to: `147.93.44.251`
   - Set TTL to 1 Hour (or 3600 seconds)
   - Save changes

4. **Add www Subdomain**
   - If there's no A record for "www", add a new A record:
     - Type: A
     - Name: www
     - Value: 147.93.44.251
     - TTL: 1 Hour
   - Save changes

5. **Optional: Add API Subdomain**
   - If you want to use api.reiconnected.com for API access:
     - Type: A
     - Name: api
     - Value: 147.93.44.251
     - TTL: 1 Hour
   - Save changes

## Verification

After making these changes, it may take some time (up to 48 hours, but typically 15-60 minutes) for DNS changes to propagate globally. You can verify your DNS configuration using:

```bash
dig reiconnected.com
dig www.reiconnected.com
```

You should see your server IP (147.93.44.251) in the results.

## Next Steps

After DNS propagation is complete:

1. Run the SSL setup script:
   ```bash
   cd /opt/lead-scoring-system/scripts
   bash setup-ssl-updated.sh
   ```

2. Test the secure connection:
   ```bash
   curl -I https://reiconnected.com
   ```

3. Update any hardcoded URLs in the application to use https://reiconnected.com 