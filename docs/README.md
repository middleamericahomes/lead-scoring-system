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
│   └── tsconfig.json         # TypeScript configuration
│
├── deployment/               # Deployment-related files
│   ├── .env.prod             # Production environment variables
│   ├── Dockerfile            # Frontend Dockerfile
│   └── docker-compose.yml    # Docker Compose configuration
│
├── scripts/                  # Utility scripts
│   ├── backup.sh             # Database backup script
│   ├── deploy.sh             # Deployment script
│   ├── rebuild.sh            # Rebuild application script
│   └── setup-ssl.sh          # SSL setup script
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
└── package.json              # NPM package configuration
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

## License

This project is proprietary and confidential. 