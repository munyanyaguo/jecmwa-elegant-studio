#!/usr/bin/env bash
# Links the project, pushes migrations, seeds content, deploys the enquiry
# function and verifies the result. Reads everything from .env.
#
#   bash scripts/setup-db.sh
#
# Safe to re-run: migrations and seed rows are idempotent.
set -uo pipefail

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
LOG=.logs/setup-db.log
: > "$LOG"

if [ -f .env ]; then
  set -a; . ./.env; set +a
fi

SUPABASE=./node_modules/.bin/supabase
REF="${SUPABASE_PROJECT_ID:-}"
if [ -z "$REF" ] && [ -n "${VITE_SUPABASE_URL:-}" ]; then
  REF="$(echo "$VITE_SUPABASE_URL" | sed -E 's#https?://([^.]+).*#\1#')"
fi

step() { echo -e "\n=== $1 ===" | tee -a "$LOG"; }
run()  { "$@" >>"$LOG" 2>&1; local code=$?; [ $code -eq 0 ] && echo "  ok" || echo "  FAILED (exit $code) — see $LOG"; return $code; }

missing=0
for var in VITE_SUPABASE_URL VITE_SUPABASE_PUBLISHABLE_KEY SUPABASE_SERVICE_ROLE_KEY SUPABASE_ACCESS_TOKEN SUPABASE_DB_PASSWORD; do
  if [ -z "${!var:-}" ]; then echo "Missing $var in .env"; missing=1; fi
done
[ -z "$REF" ] && { echo "Could not determine the project ref"; missing=1; }
[ $missing -eq 1 ] && { echo -e "\nFill those in and re-run."; exit 1; }

echo "Project ref: $REF"

step "1/5 link"
run "$SUPABASE" link --project-ref "$REF" --password "$SUPABASE_DB_PASSWORD" || exit 1

step "2/5 push migrations"
run "$SUPABASE" db push --password "$SUPABASE_DB_PASSWORD" || exit 1

step "3/5 seed content and imagery"
run node scripts/seed/index.mjs || exit 1

step "4/5 deploy submit-enquiry"
run "$SUPABASE" functions deploy submit-enquiry || echo "  (continuing — the site works without it, but the enquiry form won't)"

step "5/5 verify as an anonymous visitor"
node scripts/verify.mjs 2>&1 | tee -a "$LOG"
