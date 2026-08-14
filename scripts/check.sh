#!/usr/bin/env bash
# Runs install + typecheck + lint + build and writes results to .logs/ for inspection.
NODE_BIN=""
for v in v22.23.2 v20.20.2; do
  if [ -x "$HOME/.nvm/versions/node/$v/bin/node" ]; then
    NODE_BIN="$HOME/.nvm/versions/node/$v/bin"
    break
  fi
done
export PATH="$NODE_BIN:$PATH"

cd "$(dirname "$0")/.." || exit 1
mkdir -p .logs

# npx must never try to fetch a missing binary interactively.
export npm_config_yes=false
export CI=1

{
  echo "=== node $(node -v) / npm $(npm -v) ==="
  echo
  echo "=== INSTALL ==="
  rm -rf node_modules
  npm install --no-audit --no-fund 2>&1 | tail -20
  echo "install exit=${PIPESTATUS[0]}"
  echo
  echo "=== TYPECHECK ==="
  ./node_modules/.bin/tsc --noEmit 2>&1
  echo "typecheck exit=$?"
  echo
  echo "=== LINT ==="
  ./node_modules/.bin/eslint . 2>&1
  echo "lint exit=$?"
  echo
  echo "=== TEST ==="
  ./node_modules/.bin/vitest run --reporter=basic 2>&1 | tail -40
  echo "test exit=${PIPESTATUS[0]}"
  echo
  echo "=== BUILD ==="
  ./node_modules/.bin/vite build 2>&1 | tail -40
  echo "build exit=${PIPESTATUS[0]}"
} > .logs/check.log 2>&1

echo "written to .logs/check.log"
