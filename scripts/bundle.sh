#!/usr/bin/env bash
# Generates .logs/apply.sql and reports the Supabase CLI version.
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

{
  echo "supabase cli: $(./node_modules/.bin/supabase --version 2>&1)"
  node scripts/sql-bundle.mjs
  echo "lines: $(wc -l < .logs/apply.sql)"
  echo "policies: $(grep -c 'create policy' .logs/apply.sql)"
  echo "buckets: $(grep -c "storage.buckets" .logs/apply.sql)"
} > .logs/bundle.log 2>&1

cat .logs/bundle.log
