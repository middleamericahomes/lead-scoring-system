# DNS Setup for Lead Scoring System

## Server Information

- **VPS Hostname:** srv754513.hstgr.cloud (pre-configured)
- **IP Address:** 147.93.44.251

## Immediate Access

You can immediately access your application using the VPS hostname:

```
http://srv754513.hstgr.cloud
```

Once SSL is configured:

```
https://srv754513.hstgr.cloud
```

## Setup Custom Domain DNS Records

To use your custom domain `lead-scoring.midleamericahomes.com`, add the following DNS record to your domain registrar or DNS provider:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | lead-scoring | 147.93.44.251 | 3600 |

This will create the subdomain `lead-scoring.midleamericahomes.com` pointing to your VPS IP address.

## Verify DNS Configuration

After adding the DNS record, you can verify it has propagated with:

```bash
nslookup lead-scoring.midleamericahomes.com
```

It may take up to 48 hours for DNS changes to propagate fully, but typically it happens within a few hours.

## Enable HTTPS

Once DNS is properly configured, run the following on your server to obtain an SSL certificate for both hostnames:

```bash
certbot --nginx -d lead-scoring.midleamericahomes.com -d srv754513.hstgr.cloud --non-interactive --agree-tos --email seth@midleamericahomes.com
```

This will automatically configure HTTPS for both your custom domain and the default server hostname. 