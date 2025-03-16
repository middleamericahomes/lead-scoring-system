# Directory Organization Plan for Lead Scoring System

## Current Issues
- Documentation files are scattered in the root directory
- Configuration files are mixed with documentation
- There's no clear separation between deployment files and application files
- macOS metadata files (._*) exist and cause issues

## Proposed Directory Structure

```
/opt/lead-scoring-system/
├── .env                       # Environment variables for Docker
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
│   └── deploy.sh              # Deployment script
└── docs/                      # Documentation
    ├── DEPLOYMENT_GUIDE.md    # Deployment guide
    ├── dns-setup.md           # DNS setup instructions
    ├── deployment-summary.md  # Deployment summary
    ├── frontend-fix-plan.md   # Frontend fix plan
    └── frontend-status.md     # Frontend status
```

## Migration Steps

1. Create the new directory structure
2. Move backend and frontend code to app/ directory
3. Move documentation files to docs/ directory
4. Move configuration files to configs/ directory
5. Move deploy.sh to scripts/ directory
6. Create a main README.md file
7. Remove macOS metadata files
8. Update paths in configuration files where necessary
9. Update documentation to reflect the new structure 