#!/usr/bin/env bash
# Warn if module or interface files use direct this.body += instead of this.addBody().
# Exits 0 always — this is a warning, not a hard failure.

matches=$(grep -rn "this\.body +=" ts/src/modules/ ts/src/interfaces/ 2>/dev/null)

if [ -n "$matches" ]; then
  echo "WARNING: Direct this.body += found in the following locations."
  echo "Prefer this.addBody() for new code:"
  echo ""
  echo "$matches"
  echo ""
  echo "See doc/ideas/body-formatting-spike-implementation-plan.md for guidance."
else
  echo "OK: No direct this.body += found in modules or interfaces."
fi
