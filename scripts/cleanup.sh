#!/bin/bash

# Cleanup script for removing duplicate files and temporary files after directory reorganization

# Set script to exit on error
set -e

echo "Starting cleanup process..."

# Remove temporary directory and its contents if it exists
echo "Removing temporary files..."
if [ -d "./temp" ]; then
  rm -rf ./temp
fi

# Check for any macOS metadata files and remove them
echo "Removing macOS metadata files..."
find . -name ".DS_Store" -type f -delete
find . -name "._*" -type f -delete

# Remove duplicated files from the root directory that have been moved to src
echo "Removing duplicated React component files..."
rm -f lead-card.tsx lead-card-leads.tsx lead-filters.tsx button.tsx card.tsx utils.ts
rm -f nav-sidebar.tsx globals.css layout.tsx page.tsx

echo "Removing duplicated page files..."
rm -f dashboard-page.tsx leads-page.tsx leads-page-updated.tsx lead-import-page.tsx tags-page.tsx updated-page.tsx

# Remove duplicated configuration files
echo "Removing duplicated configuration files..."
rm -f tailwind.config.js tailwind-config.js postcss.config.js tsconfig.json .eslintrc.json

# Remove duplicated Docker and deployment files
echo "Removing duplicated Docker and deployment files..."
rm -f Dockerfile.frontend frontend-dockerfile improved-dockerfile.txt improved-dockerfile-2.txt
rm -f docker-compose.yml updated-docker-compose.yml improved-docker-compose.yml improved-docker-compose-pg15.yml
rm -f docker-compose-backend.yml docker-compose-minimal.yml

# Clean up temporary and unnecessary files
echo "Cleaning up temporary files..."
rm -f globals-css.txt package-json-fix.txt simplified-package.json frontend-eslintrc.txt frontend-dockerfile.txt

echo "Cleanup process completed successfully!"
echo "The project has been organized according to the structure in the README.md file."
echo "You can now safely commit the changes to your repository." 