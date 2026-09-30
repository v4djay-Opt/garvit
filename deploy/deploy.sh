#!/usr/bin/env bash
# Run on the VPS from an already prepared checkout. Existing release is untouched until build passes.
set -euo pipefail
[[ "$(node -p 'process.versions.node.split(".")[0]')" == "24" ]] || { echo 'Node 24 is required'; exit 1; }
DEPLOY_ROOT="${DEPLOY_ROOT:-/var/www/garvit}"
[[ -f "$DEPLOY_ROOT/shared/.env.production" ]] || { echo 'Missing production environment'; exit 1; }
export SITE_RELEASE=true
# Import env through Node, never source secrets as shell code.
node --env-file="$DEPLOY_ROOT/shared/.env.production" node_modules/tsx/dist/cli.mjs scripts/validate-content.ts --release
node --env-file="$DEPLOY_ROOT/shared/.env.production" node_modules/next/dist/bin/next build --webpack
RELEASE_PATH="$DEPLOY_ROOT/releases/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$RELEASE_PATH/.next"
cp -R .next/standalone/. "$RELEASE_PATH/"
cp -R .next/static "$RELEASE_PATH/.next/static"
cp -R public "$RELEASE_PATH/public"
cp ecosystem.config.js "$RELEASE_PATH/ecosystem.config.js"
PREVIOUS_RELEASE="$(readlink "$DEPLOY_ROOT/current" || true)"
ln -s "$RELEASE_PATH" "$DEPLOY_ROOT/current.next"
mv -Tf "$DEPLOY_ROOT/current.next" "$DEPLOY_ROOT/current"
pm2 startOrReload "$DEPLOY_ROOT/current/ecosystem.config.js" --env production --update-env
if ! curl --fail --retry 5 --retry-delay 2 --retry-connrefused --silent http://127.0.0.1:3000/ >/dev/null; then
  if [[ -n "$PREVIOUS_RELEASE" ]]; then
    ln -s "$PREVIOUS_RELEASE" "$DEPLOY_ROOT/current.rollback"
    mv -Tf "$DEPLOY_ROOT/current.rollback" "$DEPLOY_ROOT/current"
    pm2 startOrReload "$DEPLOY_ROOT/current/ecosystem.config.js" --env production --update-env
  fi
  echo 'Smoke test failed; previous release restored when available.'
  exit 1
fi
pm2 save
echo "Release ready: $RELEASE_PATH"
