#!/bin/bash

set -euo pipefail

APP_NAME="${APP_NAME:-kebap-evi}"
ACCESS_LOG="${ACCESS_LOG:-/var/log/nginx/access.log}"
LINES="${1:-3000}"

echo "=== Image Health Check ($(date -u '+%Y-%m-%d %H:%M:%S UTC')) ==="

# Load Node/PM2 from NVM when available
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh"
fi

if [ -f "$ACCESS_LOG" ]; then
  TMP_FILE="$(mktemp)"
  sudo tail -n "$LINES" "$ACCESS_LOG" > "$TMP_FILE"

  NEXT_IMAGE_TOTAL="$(awk '/_next\/image\?/ {count++} END {print count+0}' "$TMP_FILE")"
  echo "Nginx /_next/image request count (last $LINES lines): $NEXT_IMAGE_TOTAL"

  if [ "$NEXT_IMAGE_TOTAL" -gt 0 ]; then
    echo "Status breakdown:"
    awk '/_next\/image\?/ {status[$9]++} END {for (code in status) print status[code], code}' "$TMP_FILE" | sort -nr

    echo "Recent image-related failures (400/404/500/504):"
    awk '/_next\/image\?/ && ($9==400 || $9==404 || $9==500 || $9==504) {print $4, $9, $7}' "$TMP_FILE" | tail -n 20
  fi

  rm -f "$TMP_FILE"
else
  echo "Access log not found: $ACCESS_LOG"
fi

if command -v pm2 >/dev/null 2>&1; then
  echo "--- PM2 ---"
  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    pm2 describe "$APP_NAME" | sed -n '1,30p'
    echo "Recent PM2 image/optimizer warnings:"
    pm2 logs "$APP_NAME" --lines 120 --nostream 2>&1 | grep -E "_next/image|upstream image response|sharp|next start|standalone" | tail -n 40 || echo "No recent image-related PM2 warnings."
  else
    echo "PM2 process not found: $APP_NAME"
  fi
else
  echo "pm2 command not found on this host."
fi

echo "--- System Snapshot ---"
uptime
free -h
df -h /
