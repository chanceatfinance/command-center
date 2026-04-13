#!/bin/bash
# Starts a Cloudflare quick tunnel and saves the public URL
LOG="/Users/clawdbot/command-center/logs/tunnel.log"
URL_FILE="/Users/clawdbot/command-center/data/tunnel-url.txt"

/opt/homebrew/bin/cloudflared tunnel --url http://localhost:3141 2>&1 | while IFS= read -r line; do
  echo "$line" >> "$LOG"
  # Extract the trycloudflare URL
  if echo "$line" | grep -q "trycloudflare.com"; then
    URL=$(echo "$line" | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com')
    if [ -n "$URL" ]; then
      echo "$URL" > "$URL_FILE"
      echo "$(date): Tunnel URL saved: $URL" >> "$LOG"
    fi
  fi
done
