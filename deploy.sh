#!/bin/bash

set -euo pipefail

# Configuration
APP_NAME="kebap-evi"
PROJECT_DIR="/var/www/konya-kebap-evi"

echo "Starting deployment for $APP_NAME..."

cd "$PROJECT_DIR"
echo "Pulling latest changes from main..."
git pull origin main

echo "Installing dependencies..."
if ! npm ci --prefer-offline --no-audit; then
  echo "npm ci failed, falling back to npm install..."
  npm install --prefer-offline --no-audit
fi

echo "Building project..."
npm run build

if [ ! -f ".next/standalone/server.js" ]; then
  echo "Build completed but .next/standalone/server.js is missing."
  exit 1
fi

echo "Preparing standalone directory..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp .env .next/standalone/ 2>/dev/null || echo ".env file not found, skipping copy."

echo "Restarting PM2 process..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start .next/standalone/server.js --name "$APP_NAME"
fi
pm2 save

echo "Running health check..."
for _ in 1 2 3 4 5; do
  STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || true)
  if [ "$STATUS_CODE" = "200" ]; then
    echo "Site is UP (HTTP 200)"
    echo "Deployment completed successfully."
    exit 0
  fi
  sleep 3
done

echo "Site check failed with status: ${STATUS_CODE:-000}"
exit 1
