#!/usr/bin/env bash
# Runs npm inside WSL with the nvm-managed Node on PATH.
# Usage: bash scripts/dev.sh <npm-args...>   e.g. bash scripts/dev.sh run build
set -euo pipefail

NODE_BIN=""
for v in v22.23.2 v20.20.2; do
  if [ -x "$HOME/.nvm/versions/node/$v/bin/node" ]; then
    NODE_BIN="$HOME/.nvm/versions/node/$v/bin"
    break
  fi
done

if [ -z "$NODE_BIN" ]; then
  NODE_BIN="$(dirname "$(find "$HOME/.nvm/versions/node" -maxdepth 3 -name node -type f | head -1)")"
fi

export PATH="$NODE_BIN:$PATH"
cd "$(dirname "$0")/.."
exec npm "$@"
