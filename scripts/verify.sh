#!/usr/bin/env bash
# Runs the anonymous-visitor verification and tees it to .logs/verify.log
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

node scripts/verify.mjs > .logs/verify.log 2>&1
echo "verify exit=$?" >> .logs/verify.log
cat .logs/verify.log
