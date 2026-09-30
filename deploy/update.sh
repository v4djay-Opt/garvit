#!/usr/bin/env bash
# Pull the latest main from origin into this checkout.
# Refuses to merge: only fast-forwards, so local uncommitted changes are never overwritten.
set -euo pipefail
cd "$(dirname "$0")/.."
BRANCH="${1:-main}"
REMOTE="${REMOTE:-origin}"
git fetch "$REMOTE" "$BRANCH"
if ! git merge-base --is-ancestor HEAD "$REMOTE/$BRANCH"; then
  echo "Local checkout has commits or conflicts not on $REMOTE/$BRANCH — resolve manually." >&2
  exit 1
fi
git merge --ff-only "$REMOTE/$BRANCH"
echo "Updated to $(git rev-parse --short HEAD)"
