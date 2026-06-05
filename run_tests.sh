#!/usr/bin/env bash
# Run from the repo root: ./run_tests.sh
# Compiles TypeScript then runs all test scripts to regenerate sv-examples/
#
# Skipped files:
#   testRegisters.js           — hardcodes paths to Runzhe's local machine
#   test_AXI4XBar.js           — requires Docker (avonancken/rocketdock:v1) to compile Chisel
#
# Skipped directories (entirely stale orphaned CLI tool artifacts):
#   out/test/convert/
#   out/test/gen_sram_wrapper/
#   out/test/reg_convert/      — except int_AIGC_APB4_reg.js which is a real test

set -uo pipefail

SKIP_DIRS=(
  "out/test/convert"
  "out/test/gen_sram_wrapper"
)

SKIP_FILES=(
  "out/test/testRegisters.js"
  "out/test/modules/test_AXI4XBar.js"
  "out/test/reg_convert/intg_regblk.js"
  "out/test/reg_convert/int_AIGC_DEMO_reg.js"
)

should_skip() {
  local f="$1"
  for d in "${SKIP_DIRS[@]}"; do
    [[ "$f" == "$d"/* ]] && return 0
  done
  for s in "${SKIP_FILES[@]}"; do
    [[ "$f" == "$s" ]] && return 0
  done
  return 1
}

echo "=== Compiling TypeScript ==="
npx tsc
echo ""

echo "=== Running tests ==="
find out/test -name "*.js" | sort | while IFS= read -r f; do
  if should_skip "$f"; then
    echo "SKIPPED: $f"
    echo ""
    continue
  fi

  echo "--- $f ---"
  if node "$f" 2>&1; then
    echo "OK: $f"
  else
    echo "FAIL: $f"
  fi
  echo ""
done

echo "=== Running gen_sram_wrapper ==="
for cfg in sv-examples/test_memWrapper/sram_config1.json \
           sv-examples/test_memWrapper/sram_config2.json \
           sv-examples/test_memWrapper/sram_config3.json \
           sv-examples/test_memWrapper/sram_config4.json; do
  echo "--- gen_sram_wrapper $cfg ---"
  if node out/src/tools/gen_sram_wrapper/gen_sram_wrapper.js "$cfg" sv-examples/test_memWrapper/sram_list 2>&1; then
    echo "OK: $cfg"
  else
    echo "FAIL: $cfg"
  fi
  echo ""
done

echo "=== Done ==="
