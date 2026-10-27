#!/usr/bin/env bash
# Run verilator --lint-only on the SV under sv-examples/.
#
# Module.writeSystemVerilogFiles() writes one guarded file per module and interface, and each
# file includes the files it needs inside `ifdef USE_INCLUDES. SV a test script writes by hand to
# instantiate a design (a lint wrapper, a testbench) includes the design the same way
# (ts/test/models/guardSV.ts). So every lint defines USE_INCLUDES and puts the unit's directory on
# the include path, and each .sv that no other file in its directory includes is a top, linted on
# its own: its lint reaches everything it includes. An included file is never linted alone, since
# one with interface ports can't be a top.
#
# A Verilator filelist, <top>.f, ties generated SV to a testbench outside sv-examples/
# (ts/test/models/lintFilelist.ts). Each filelist is linted with -F, and the .sv files it names
# aren't tops.
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
  lint "$filelist" +define+USE_INCLUDES "+incdir+$dir" -F "$filelist"
done < <(find sv-examples -path sv-examples/rtl_style_ts -prune -o -name "*.f" -print0 | sort -z)

svfiles=()
while IFS= read -r -d '' file; do svfiles+=("$file"); done \
  < <(find sv-examples -path sv-examples/rtl_style_ts -prune -o -name "*.sv" -print0 | sort -z)

# The files another file includes, each from the including file's directory
declare -A included
for file in "${svfiles[@]}"; do
  dir=$(dirname "$file")
  # sed prints <file> from each include line, `include "<file>"
  while IFS= read -r inc; do
    included[$(realpath -m --relative-to=. "$dir/$inc")]=1
  done < <(sed -n 's/^[[:space:]]*`include[[:space:]]*"\([^"]*\)".*/\1/p' "$file")
done

for file in "${svfiles[@]}"; do
  [[ -n ${grouped[$file]} || -n ${included[$file]} ]] && continue
  lint "$file" +define+USE_INCLUDES "+incdir+$(dirname "$file")" "$file"
done

echo ""
echo "$passed passed, ${#failures[@]} failed"

if [ ${#failures[@]} -gt 0 ]; then
  echo ""
  echo "Failing files:"
  printf '  %s\n' "${failures[@]}"
  exit 1
fi
