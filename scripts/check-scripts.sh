#!/usr/bin/env bash
# Syntax-checks the Node scripts, which sit outside the TypeScript project.
NODE_BIN=""
for v in v22.23.2 v20.20.2; do
  if [ -x "$HOME/.nvm/versions/node/$v/bin/node" ]; then
    NODE_BIN="$HOME/.nvm/versions/node/$v/bin"
    break
  fi
done
export PATH="$NODE_BIN:$PATH"

cd "$(dirname "$0")/.." || exit 1

status=0
for file in scripts/*.mjs scripts/lib/*.mjs scripts/seed/*.mjs; do
  [ -e "$file" ] || continue
  if node --check "$file" 2>/dev/null; then
    echo "  ok    $file"
  else
    echo "  FAIL  $file"
    node --check "$file"
    status=1
  fi
done

# Importing proves the module graph resolves, not just that it parses.
node -e "import('./scripts/lib/supabase.mjs').then(m => console.log('  ok    lib exports:', Object.keys(m).join(', ')))" || status=1

exit $status
