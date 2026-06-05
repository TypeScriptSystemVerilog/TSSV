#!/usr/bin/env bash
# Run from the repo root: ./lint_check.sh
# Lints all generated .sv files and writes results to LINTCHECK_RESULTS.txt.
# Auto-resolves two kinds of dependencies (bash 3.2 compatible):
#   1. Package imports:  "import Foo_pkg::*"  → finds Foo_pkg.sv
#   2. Interface uses:   "IfaceName.modport"  → finds file defining "interface IfaceName"
#      Prefers standalone interface files (named <IfaceName>.sv) over testbenches.
#      Skips adding a dep if the current file already defines the interface itself.

> LINTCHECK_RESULTS.txt

# Build flat index: "InterfaceName<TAB>filepath" — bash 3.2 compatible
# Standalone interface files (named exactly <IfaceName>.sv) go first so they're preferred
IFACE_INDEX=$(mktemp /tmp/iface_index.XXXXXX)
find sv-examples -name "*.sv" | sort | while IFS= read -r sv_file; do
  grep -o 'interface [A-Za-z_][A-Za-z0-9_]*' "$sv_file" 2>/dev/null \
    | sed 's/interface //' \
    | while IFS= read -r name; do
        # Give standalone interface files a sort prefix so they appear first
        base=$(basename "$sv_file" .sv)
        if [ "$base" = "$name" ]; then
          printf '0\t%s\t%s\n' "$name" "$sv_file"
        else
          printf '1\t%s\t%s\n' "$name" "$sv_file"
        fi
      done
done | sort | sed 's/^[01]	//' > "$IFACE_INDEX"

find_iface_file() {
  grep "^${1}	" "$IFACE_INDEX" 2>/dev/null | cut -f2 | head -1
}

lint_file() {
  local f="$1"
  local dep_args=()
  local seen=""

  add_dep() {
    local dep="$1"
    [ -z "$dep" ] && return
    [ "$dep" = "$f" ] && return
    case "$seen" in *"|${dep}|"*) return ;; esac
    seen="${seen}|${dep}|"
    dep_args+=("$dep")
  }

  # 1. Package imports: "import Foo_pkg::*" → find Foo_pkg.sv
  while IFS= read -r pkg_name; do
    [ -z "$pkg_name" ] && continue
    local pkg_file
    pkg_file=$(find sv-examples -name "${pkg_name}.sv" 2>/dev/null | head -1)
    add_dep "$pkg_file"
  done < <(grep -o 'import [^:]*' "$f" 2>/dev/null | sed 's/import //' | tr -d ' ' || true)

  # 2. Interface instantiations via modport syntax: "IfaceName.modport iname"
  #    Skip if the current file already defines the interface itself.
  while IFS= read -r iface_name; do
    [ -z "$iface_name" ] && continue
    # Skip if this file defines the interface — it's self-contained
    if grep -q "^interface ${iface_name}\b\|^ *interface ${iface_name}\b" "$f" 2>/dev/null; then
      continue
    fi
    local iface_file
    iface_file=$(find_iface_file "$iface_name")
    add_dep "$iface_file"
  done < <(grep -oE '\b[A-Za-z_][A-Za-z0-9_]+\.[a-z][A-Za-z0-9_]* [A-Za-z_][A-Za-z0-9_]*\b' "$f" 2>/dev/null \
           | sed 's/\..*//' || true)

  local result exit_code
  if [ ${#dep_args[@]} -gt 0 ]; then
    result=$(verilator --lint-only "${dep_args[@]}" "$f" 2>&1)
  else
    result=$(verilator --lint-only "$f" 2>&1)
  fi
  exit_code=$?

  printf '%s\n' "$result" >> LINTCHECK_RESULTS.txt
  if [ $exit_code -eq 0 ]; then
    echo "OK: $f" | tee -a LINTCHECK_RESULTS.txt
  else
    echo "FAIL: $f" | tee -a LINTCHECK_RESULTS.txt
  fi
}

# Lint package files first — they have no dependencies of their own
find sv-examples -name "*_pkg.sv" | sort | while IFS= read -r f; do
  lint_file "$f"
done

# Lint all other .sv files with auto-resolved dependencies
# Exclude standalone interface-only files (no module, can't be linted alone)
find sv-examples -name "*.sv" ! -name "*_pkg.sv" ! -name "memory_32_32.sv" | sort | while IFS= read -r f; do
  lint_file "$f"
done

rm -f "$IFACE_INDEX"
