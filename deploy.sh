#!/bin/bash

# Configuration
APP_NAME="kebap-evi"
PROJECT_DIR="/var/www/konya-kebap-evi"

echo "🚀 Starting deployment for $APP_NAME..."

# 1. Update project from GitHub
cd $PROJECT_DIR || exit 1
echo "📥 Pulling latest changes from main..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# 3. Build project
echo "🏗️ Building project..."
npm run build

# 4. Prepare standalone directory
echo "📂 Preparing standalone directory..."
# Next.js standalone mode needs public and static files copied manualy
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp .env .next/standalone/ 2>/dev/null || echo "⚠️ .env file not found, skipping copy."

# 5. Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 restart $APP_NAME || pm2 start .next/standalone/server.js --name $APP_NAME

# 6. Save PM2 state
pm2 save

echo "✅ Deployment completed successfully!"

# 7. Health Check
echo "🔍 Checking health status..."
sleep 5
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$STATUS_CODE" -eq 200 ]; then
    echo "✨ Site is UP (HTTP 200)"
else
    echo "❌ Site check failed with status: $STATUS_CODE"
    exit 1
fi
