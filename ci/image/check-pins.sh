#!/usr/bin/env bash
# Fails if the CI image's Verilator/Verible pins differ from the README's
# Setup section, which is the source of truth for both. Run from the repo root.
set -euo pipefail

dockerfile=ci/image/Dockerfile
readme=README.md

pin() {  # pin <file> <regex with one capture group>
  sed -n -E "s/$2/\1/p" "$1" | head -n1
}

status=0
check() {  # check <tool> <dockerfile value> <readme value>
  if [ -z "$2" ] || [ -z "$3" ]; then
    echo "::error::$1: pin not found (Dockerfile '${2}', README '${3}')"
    status=1
  elif [ "$2" != "$3" ]; then
    echo "::error::$1 pin mismatch: $dockerfile has $2, $readme has $3"
    status=1
  else
    echo "$1: $2 (matches README)"
  fi
}

check Verilator \
  "$(pin "$dockerfile" '^ARG VERILATOR_VERSION=(.+)$')" \
  "$(pin "$readme" '^VERILATOR_VERSION=(\S+).*$')"
check Verible \
  "$(pin "$dockerfile" '^ARG VERIBLE_VERSION=(.+)$')" \
  "$(pin "$readme" '^\s*VERIBLE=(\S+).*$')"

exit $status
