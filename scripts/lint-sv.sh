#!/usr/bin/env bash
# Run verilator --lint-only on every .sv file under sv-examples/.
#
# A test script that emits SV which can't be linted alone (a testbench emitted apart from its
# DUT, a module whose interface definitions are in another file, a library of models with no
# top of its own) writes a Verilator filelist, <top>.f, next to it
# (ts/test/models/lintFilelist.ts). Each filelist is linted with -F, and the .sv files it names
# aren't linted alone. Every other .sv file is linted alone.
#
# sv-examples/rtl_style_ts/ is left out. `npm run check:rtl-style` writes it, not the test
# scripts, from the TSSV guide's examples, and lints each one against what the example expects:
# a "Don't" example is meant to fail.
#
# Every lint passes the common waivers file, doc/rtl-style/sv-style/common_waivers.vlt (SV guide,
# section 8).
#
# Prints Verilator's output for each failure. Exits 0 if all pass, 1 if any fail.

cd "$(dirname "$0")/.." || exit 1

COMMON_WAIVERS=doc/rtl-style/sv-style/common_waivers.vlt

if ! command -v verilator &>/dev/null; then
  echo "ERROR: verilator not found on PATH"
  exit 1
fi

passed=0
failures=()
declare -A grouped

# lint <label> <verilator args...>
lint() {
  local label=$1 out
  shift
  if out=$(verilator --lint-only "$COMMON_WAIVERS" "$@" 2>&1); then
    echo "PASS: $label"
    ((passed++))
  else
    echo "FAIL: $label"
    sed 's/^/    /' <<<"$out"
    failures+=("$label")
  fi
}

while IFS= read -r -d '' filelist; do
  dir=$(dirname "$filelist")
  # The .sv files it names, relative to its own directory as -F reads them
  while IFS= read -r line; do
    [[ $line == *.sv ]] && grouped[$(realpath -m --relative-to=. "$dir/$line")]=1
  done < <(grep -v -e '^[[:space:]]*//' -e '^[[:space:]]*-' "$filelist")
  lint "$filelist" -F "$filelist"
done < <(find sv-examples -path sv-examples/rtl_style_ts -prune -o -name "*.f" -print0 | sort -z)

while IFS= read -r -d '' file; do
  [[ -n ${grouped[$file]} ]] && continue
  lint "$file" "$file"
done < <(find sv-examples -path sv-examples/rtl_style_ts -prune -o -name "*.sv" -print0 | sort -z)

echo ""
echo "$passed passed, ${#failures[@]} failed"

if [ ${#failures[@]} -gt 0 ]; then
  echo ""
  echo "Failing files:"
  printf '  %s\n' "${failures[@]}"
  exit 1
fi
