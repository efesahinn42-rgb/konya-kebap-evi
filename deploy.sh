#!/bin/bash

set -euo pipefail

# Configuration
APP_NAME="kebap-evi"
PROJECT_DIR="/var/www/konya-kebap-evi"
STANDALONE_ENTRY="$PROJECT_DIR/.next/standalone/server.js"
STANDALONE_CWD="$PROJECT_DIR/.next/standalone"

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

if [ ! -f "$STANDALONE_ENTRY" ]; then
  echo "Build completed but standalone server entrypoint is missing: $STANDALONE_ENTRY"
  exit 1
fi

echo "Preparing standalone directory..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp .env .next/standalone/ 2>/dev/null || echo ".env file not found, skipping copy."

# Set up persistent image cache to prevent Supabase Egress spikes
echo "Setting up persistent image cache..."
SHARED_CACHE_DIR="$PROJECT_DIR/shared_image_cache"
mkdir -p "$SHARED_CACHE_DIR"
mkdir -p .next/standalone/.next/cache
rm -rf .next/standalone/.next/cache/images
ln -s "$SHARED_CACHE_DIR" .next/standalone/.next/cache/images

echo "Restarting PM2 process..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  if pm2 describe "$APP_NAME" | grep -Fq "$STANDALONE_ENTRY"; then
    echo "PM2 process already uses standalone entrypoint. Restarting..."
    pm2 restart "$APP_NAME" --update-env
  else
    echo "PM2 process is not using standalone entrypoint. Recreating process..."
    pm2 delete "$APP_NAME" || true
    pm2 start "$STANDALONE_ENTRY" --name "$APP_NAME" --cwd "$STANDALONE_CWD"
  fi
else
  pm2 start "$STANDALONE_ENTRY" --name "$APP_NAME" --cwd "$STANDALONE_CWD"
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
