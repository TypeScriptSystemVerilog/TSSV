# TSSV Body Formatting Spike Implementation Plan

> Status: Draft
> Depends on: `claude-info/body-formatting-spike-spec.md`

## Objective

Implement the spike in a low-risk sequence:

1. Add `addBody()` API for symmetric body construction.
2. Integrate Verible CLI formatting (Linux x86_64 and macOS ARM64 first).
3. Preserve backward compatibility with existing `this.body += ...` usage.
4. Convert one representative module (FIR) to validate ergonomics.

## Phase 0: Configuration Model

### Files

- `ts/src/core/Base.ts`
- `ts/src/core/TSSVLib.ts` (if re-export updates are needed)
- optional new: `ts/src/core/FormatterConfig.ts`

### Tasks

1. Define a formatter config type in core:
   - `engine: 'verible' | 'internal' | 'off'`
   - `veriblePath?: string`
   - `veribleFlags?: string[]`
   - `failOnFormatError?: boolean`
   - `formatTimeoutMs?: number`
2. Add module-level default formatter config (static/global) with safe defaults.
3. Add API to override config per process (or per module if desired):
   - `Module.setFormatterConfig(...)`

### Acceptance checks

- TypeScript compile passes.
- Existing module generation unchanged with default `engine='off'` (if staged) or
  deterministic behavior with chosen default.

## Phase 1: addBody API and Internal Normalizer

### Files

- `ts/src/core/Base.ts`
- optional new: `ts/src/core/svText.ts`

### Tasks

1. Add method:
   - `addBody(body: string, opts?)`
   - `addBodyLine(line: string)` (optional convenience)
2. Implement relative-indent normalization utility:
   - trim optional leading/trailing blank lines
   - compute minimum left indent on non-empty lines
   - strip common indent
   - ensure trailing newline
3. Route all new body insertion through `addBody()`.
4. Keep `this.body` field and existing append behavior functional.

### Acceptance checks

- Unit test: mixed indentation snippet normalizes as expected.
- Unit test: `indentMode='verbatim'` preserves indentation.
- Existing tests/scripts still generate valid SV.

## Phase 2: Verible Runner Integration

### Files

- new: `ts/src/tools/formatters/verible.ts`
- optional new: `ts/src/tools/formatters/process.ts`
- `ts/src/core/Base.ts`

### Tasks

1. Implement process wrapper using `node:child_process` spawn.
2. Feed generated SV via stdin, capture stdout/stderr.
3. Add timeout handling and robust non-zero exit diagnostics.
4. Implement fallback policy:
   - if Verible missing/fails and `failOnFormatError=false` -> internal fallback + warning
   - if `failOnFormatError=true` -> throw with diagnostic context

### Acceptance checks

- Integration test for successful format invocation.
- Integration test for missing binary path fallback behavior.
- Integration test for timeout path.

## Phase 3: Verible Binary Acquisition Workflow

### Files

- new script: `scripts/install-verible.sh`
- optional TS wrapper: `ts/src/tools/verible_install.ts`
- docs update location: `README.md` or `claude-info/setup.md`

### Tasks

1. Add install script supporting:
   - Linux x86_64 -> `verible-<tag>-linux-static-x86_64.tar.gz`
   - macOS ARM64 -> `verible-<tag>-macOS.tar.gz`
2. Verify archive checksum (SHA-256).
3. Extract `verible-verilog-format` into deterministic local path.
4. Document environment variable override for binary path.

### Acceptance checks

- Script works on supported target platforms.
- Installed binary is executable and discoverable by formatter runner.

## Phase 4: writeSystemVerilog Hook

### Files

- `ts/src/core/Base.ts`

### Tasks

1. After assembling full Verilog text, pass through formatting pipeline:
   - if `engine='verible'`: run Verible
   - if `engine='internal'`: run internal normalizer
   - if `engine='off'`: return raw assembled text
2. Ensure formatted result is returned by `writeSystemVerilog()`.
3. Keep failure behavior configurable via `failOnFormatError`.

### Acceptance checks

- Golden output snapshots stable under pinned formatter settings.
- Verilator lint still passes on generated examples.

## Phase 5: Pilot Conversion (FIR)

### Files

- `ts/src/modules/FIR/FIR.ts`

### Tasks

1. Replace direct `this.body += ...` snippets with `this.addBody(...)` where
   practical.
2. Keep existing behavior identical.
3. Confirm generated `sv-examples/FIR/...` output remains semantically
   equivalent.

### Acceptance checks

- `npx tsc` succeeds.
- FIR test script runs and emits valid SV.
- Verilator lint on generated FIR SV still passes.

## Phase 6: Guardrails and Cleanup

### Files

- `README.md` (or docs note)
- optional lint policy (if desired)

### Tasks

1. Document preferred usage:
   - Use `addBody()` for raw SV snippets
   - Avoid new direct `this.body +=` call sites
2. Optionally add a grep-based CI check warning on new direct body appends.
3. Defer broad call-site migration until spike review concludes.

### Acceptance checks

- Contributor guidance is clear and discoverable.
- No forced large refactor in initial spike.

## Suggested Execution Order

1. Phase 1 (addBody + normalizer)
2. Phase 2 (Verible runner)
3. Phase 4 (writeSystemVerilog hook)
4. Phase 5 (FIR pilot)
5. Phase 3 + 6 (installer/docs/guardrails)

Reasoning:

- Establish core API and behavior first.
- Add external dependency integration second.
- Wire into main generation path only after fallback behavior is solid.
- Validate ergonomics in one real module before broad rollout.

## Definition of Done (Spike)

- `addBody()` is available and used in at least one production module.
- Verible formatting works on Linux x86_64 and macOS ARM64.
- Missing/failed formatter cases are handled deterministically.
- Generated SV readability improves without semantic regressions.
- Existing projects continue to function without mandatory migration.
