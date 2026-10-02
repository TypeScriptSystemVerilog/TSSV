#!/usr/bin/env bash
# Runs inside the CI image. Checks tool versions against the pins passed in
# the environment, then builds and runs a traced --timing model.
set -euo pipefail
cd "$(dirname "$0")"

expect() {  # expect <command output> <ERE it must match>
  echo "$1"
  grep -qE "$2" <<<"$1" || { echo "::error::expected /$2/" >&2; exit 1; }
}
expect "$(verilator --version)" "^Verilator ${VERILATOR_VERSION#v} "
expect "$(verible-verilog-format --version)" "^Version[[:space:]]+${VERIBLE_VERSION}$"
expect "$(node --version)" '^v24\.'

out=$(mktemp -d)
verilator --binary --timing --trace-fst --Mdir "$out" smoke_tb.sv
(cd "$out" && ./Vsmoke_tb)
test -s "$out/smoke.fst"
echo "FST written: $(stat -c %s "$out/smoke.fst") bytes"
