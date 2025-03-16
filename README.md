# Lead Scoring System

A modern web application for scoring, managing, and tracking leads for real estate investors.

## Project Structure

```
lead-scoring-system/
├── config/                   # Configuration files
│   ├── .eslintrc.json        # ESLint configuration
│   ├── next.config.js        # Next.js configuration
│   ├── postcss.config.js     # PostCSS configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── tsconfig.json         # TypeScript configuration
│   └── nginx/                # Nginx configurations
│       └── lead-scoring.conf # Nginx configuration for the app
│
├── deployment/               # Deployment-related files
│   ├── .env.prod             # Production environment variables
│   ├── docker-env            # Docker environment variables
│   ├── Dockerfile            # Frontend Dockerfile
│   ├── docker-compose.yml    # Docker Compose configuration
│   └── docker/               # Additional Docker configurations
│       └── docker-compose-backend.yml # Backend-only config
│
├── docs/                     # Documentation
│   ├── deployment/           # Deployment-related documentation
│   ├── frontend/             # Frontend-related documentation
│   ├── backend/              # Backend-related documentation
│   └── infrastructure/       # Infrastructure documentation
│
├── scripts/                  # Utility scripts
│   ├── backup.sh             # Database backup script
│   ├── deploy.sh             # Deployment script
│   ├── rebuild.sh            # Rebuild application script
│   ├── setup-ssl.sh          # SSL setup script
│   └── cleanup.sh            # Cleanup script for organization
│
├── public/                   # Public assets
│   └── placeholder/          # Placeholder HTML pages
│
├── src/                      # Source code
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # Global CSS
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Dashboard page (home)
│   │   ├── leads/            # Leads pages
│   │   │   ├── page.tsx      # Leads listing page
│   │   │   └── import/       # Lead import functionality
│   │   │       └── page.tsx  # Lead import page
│   │   └── tags/             # Tags pages
│   │       └── page.tsx      # Tags management page
│   │
│   ├── components/           # Reusable components
│   │   ├── layout/           # Layout components
│   │   │   └── nav-sidebar.tsx # Navigation sidebar
│   │   ├── leads/            # Lead-related components
│   │   │   ├── lead-card.tsx # Lead card component
│   │   │   └── lead-filters.tsx # Lead filters component
│   │   ├── tags/             # Tag-related components
│   │   └── ui/               # UI components
│   │       ├── button.tsx    # Button component
│   │       └── card.tsx      # Card component
│   │
│   ├── lib/                  # Library code
│   │   └── utils.ts          # Utility functions
│   │
│   └── utils/                # Additional utilities
│
├── backend/                  # Backend application code (FastAPI)
│   ├── app/                  # Backend application
│   ├── alembic/              # Database migrations
│   └── requirements.txt      # Python dependencies
│
├── common/                   # Shared code between frontend and backend
│   └── utils/                # Shared utilities
│
├── package.json              # NPM package configuration
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose

### Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

1. Build and deploy using Docker:
   ```
   cd deployment
   docker-compose up -d
   ```

## Features

- Lead management with scoring system
- Tag-based categorization
- Lead import functionality
- Dashboard with analytics
- User-friendly interface with responsive design

## Documentation

See the [docs](./docs) directory for detailed documentation, including:

- [Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md)
- [Frontend Fix Plan](./docs/frontend/frontend-fix-plan.md)
- [Directory Organization](./docs/directory-organization-plan.md)

## License

This project is proprietary and confidential. 