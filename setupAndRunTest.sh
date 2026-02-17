#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Installing dependencies ==="
npm install

echo "=== Installing Playwright browsers ==="
npx playwright install

if [ ! -f .env ]; then
  echo "=== Creating .env from .env_template ==="
  cp .env_template .env
else
  echo "=== .env already exists, skipping ==="
fi

echo "=== Running tests ==="
npm test
