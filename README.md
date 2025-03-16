# Lead Scoring System

A comprehensive system for scoring real estate leads based on distress indicators and property data.

## Overview

This application helps real estate investors identify and prioritize potential investment opportunities by:
- Scoring properties based on distress indicators (tags)
- Managing property and owner information
- Automating the scoring process with configurable rules
- Supporting direct mail campaigns based on lead scores
- Tracking deals and optimizing scoring over time

## Tech Stack

- **Backend**: Python with FastAPI
- **Frontend**: React with Next.js
- **Database**: PostgreSQL
- **Caching**: Redis
- **Containerization**: Docker

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for frontend development)
- Python 3.10+ (for backend development)

### Getting Started

1. Clone the repository
   ```
   git clone https://github.com/middleamericahomes/lead-scoring-system.git
   cd lead-scoring-system
   ```

2. Start the development environment
   ```
   docker-compose up -d
   ```

3. Initialize the database
   ```
   docker-compose exec backend alembic upgrade head
   ```

4. Access the application
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Project Structure

- `/backend` - FastAPI application with scoring engine
- `/frontend` - Next.js React application
- `/common` - Shared code and utilities
- `/scripts` - Development and deployment scripts
- `/docs` - Project documentation

## Deployment

The system is designed to be deployed on a VPS, with recommended specifications:
- 2+ CPU cores
- 8GB+ RAM
- 100GB+ SSD storage