#!/usr/bin/env bash
# Reports what's available for applying migrations and seeding.
# Prints only whether a value is SET or MISSING — never the value itself.
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

report() {
  if [ -n "${2:-}" ]; then echo "$1: SET (${#2} chars)"; else echo "$1: MISSING"; fi
}

{
  echo "=== tooling ==="
  echo "node: $(node -v 2>&1)"
  echo "supabase cli: $(supabase --version 2>&1 || echo 'not installed')"
  echo "npx supabase: $(npx --no-install supabase --version 2>&1 || echo 'not available')"
  echo "psql: $(psql --version 2>&1 || echo 'not installed')"
  echo
  echo "=== project link ==="
  if [ -f supabase/.temp/project-ref ]; then
    echo "linked ref file: present"
  else
    echo "linked ref file: absent (supabase link not run)"
  fi
  echo "config.toml project_id: $(grep -m1 project_id supabase/config.toml 2>/dev/null || echo 'none')"
  echo
  echo "=== .env presence (values never printed) ==="
  if [ -f .env ]; then
    set -a; . ./.env 2>/dev/null; set +a
    report "VITE_SUPABASE_URL" "${VITE_SUPABASE_URL:-}"
    report "VITE_SUPABASE_PUBLISHABLE_KEY" "${VITE_SUPABASE_PUBLISHABLE_KEY:-}"
    report "VITE_SITE_URL" "${VITE_SITE_URL:-}"
    report "SUPABASE_SERVICE_ROLE_KEY" "${SUPABASE_SERVICE_ROLE_KEY:-}"
    report "SUPABASE_PROJECT_ID" "${SUPABASE_PROJECT_ID:-}"
    report "SUPABASE_ACCESS_TOKEN" "${SUPABASE_ACCESS_TOKEN:-}"
    report "SUPABASE_DB_PASSWORD" "${SUPABASE_DB_PASSWORD:-}"
    echo "project ref from url: $(echo "${VITE_SUPABASE_URL:-}" | sed -E 's#https?://([^.]+).*#\1#')"
    case "${VITE_SUPABASE_PUBLISHABLE_KEY:-}" in
      sb_publishable_*) echo "publishable key format: new (sb_publishable_)" ;;
      ey*)              echo "publishable key format: legacy JWT" ;;
      "")               echo "publishable key format: n/a" ;;
      *)                echo "publishable key format: UNRECOGNISED" ;;
    esac
    case "${SUPABASE_SERVICE_ROLE_KEY:-}" in
      sb_secret_*) echo "secret key format: new (sb_secret_)" ;;
      ey*)         echo "secret key format: legacy JWT" ;;
      "")          echo "secret key format: n/a" ;;
      *)           echo "secret key format: UNRECOGNISED" ;;
    esac
  else
    echo ".env: MISSING"
  fi
  echo
  echo "=== migrations on disk ==="
  ls -1 supabase/migrations 2>/dev/null
  echo
  echo "=== seed assets ==="
  echo "files: $(ls seed-assets/portfolio 2>/dev/null | wc -l) in seed-assets/portfolio"
} > .logs/env-report.log 2>&1

cat .logs/env-report.log
