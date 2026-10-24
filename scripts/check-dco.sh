#!/usr/bin/env bash
# Fail if any non-merge commit in <base>..<head> lacks a DCO sign-off: a
# Signed-off-by trailer whose email matches the commit's author email
# (CONTRIBUTING.md). Merge commits are skipped: branches merge origin/main in,
# and a merge adds no work of its own.
#
# Usage: scripts/check-dco.sh [<base> [<head>]]   (defaults: origin/main, HEAD)

set -euo pipefail

base=${1:-origin/main}
head=${2:-HEAD}

missing=()
for sha in $(git rev-list --no-merges "$base..$head"); do
  author=$(git log -1 --format='%ae' "$sha")
  signoffs=$(git log -1 --format='%(trailers:key=Signed-off-by,valueonly)' "$sha")
  if ! grep -qiF "<$author>" <<< "$signoffs"; then
    missing+=("$(git log -1 --format='%h %s' "$sha") (author: $author)")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "ERROR: these commits have no Signed-off-by matching their author email:"
  printf '  %s\n' "${missing[@]}"
  echo ""
  echo "Fix with 'git rebase --signoff $base' and 'git push --force-with-lease'."
  echo "See CONTRIBUTING.md."
  exit 1
fi
echo "OK: every commit in $base..$head is signed off."
