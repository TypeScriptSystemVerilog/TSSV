#!/usr/bin/env bash
# Build TSSV and run every compiled test script under out/test/, from the repo
# root (the scripts write their output under sv-examples/). Prints each failing
# script and exits 1 if any failed. CI runs this (.github/workflows/test.yml).

cd "$(dirname "$0")" || exit 1

# Scripts that need tools outside the pinned toolchain (README Setup), so they
# can't run here or in CI.
#   test_AXI4XBar: runs Rocket Chip's Scala generator, via Docker
#                  (third-party/rocket-chip-component-gen)
skip=(out/test/modules/test_AXI4XBar.js)

npx tsc || exit 1

passed=0
failures=()

while IFS= read -r -d '' file; do
  if [[ " ${skip[*]} " == *" $file "* ]]; then
    echo "SKIP: $file"
    continue
  fi
  if node "$file"; then
    ((passed++))
  else
    echo "FAIL: $file"
    failures+=("$file")
  fi
done < <(find out/test -name "*.js" -print0 | sort -z)

echo ""
echo "$passed passed, ${#failures[@]} failed, ${#skip[@]} skipped"

if [ ${#failures[@]} -gt 0 ]; then
  echo ""
  echo "Failing scripts:"
  printf '  %s\n' "${failures[@]}"
  exit 1
fi
