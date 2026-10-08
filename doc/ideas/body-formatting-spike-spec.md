# TSSV Body Construction and Formatting Spike Spec

> Status: Draft
> Scope: exploratory API and implementation spike only

## Purpose

This document proposes a second spike to improve raw body text handling in TSSV.
Today, many call sites append SystemVerilog snippets with direct string
concatenation (`this.body += ...`). The spike introduces a symmetric
`addBody()` API and a formatting pipeline that normalizes indentation in the
final generated SystemVerilog.

The goal is to reduce author friction and style drift while keeping emitted HDL
readable and predictable.

## Goals

- Add `addBody()` to make custom text insertion consistent with other `add*()`
  construction methods.
- Remove the burden on authors to manually align global indentation levels.
- Normalize indentation as a post-processing step before returning generated
  SystemVerilog.
- Integrate `verible-verilog-format` as the default post-processing formatter
  from the first spike.
- Support Verible binary usage on Linux x86_64 and macOS ARM64 initially.
- Keep backward compatibility with existing `this.body += ...` usage during the
  spike period.
- Keep behavior deterministic (same input text, same output text).

## Non-goals

- Build an in-house full SystemVerilog parser/formatter in the first spike.
- Reorder statements or rewrite logic semantics.
- Auto-refactor existing modules in this spike.
- Perfectly format every possible raw snippet edge case in v1.
- Support all host OS/architectures in the first version.

## Problem Summary

Current pain points:

- Raw body text is appended ad hoc across the codebase.
- Callers must remember indentation style for each snippet.
- Mixed indentation quality leaks into final emitted `.sv` text.
- The API is asymmetric (`addSignal`, `addRegister`, etc. vs raw `body +=`).

## Proposed API

### Core method

```typescript
addBody (
  body: string,
  opts?: {
    indentMode?: 'relative' | 'verbatim'
    trimLeadingBlankLines?: boolean
    trimTrailingBlankLines?: boolean
    ensureTrailingNewline?: boolean
  }
): void
```

Behavior:

- `indentMode: 'relative'` (default):
  - Compute minimum leading indentation across non-empty lines.
  - Remove that common indent from all lines.
  - Store the snippet as logical body content; global module indentation is
    applied later in generation.
- `indentMode: 'verbatim'`:
  - Keep original snippet indentation exactly (except optional trimming/newline
    policy).

Defaults:

- `indentMode = 'relative'`
- `trimLeadingBlankLines = true`
- `trimTrailingBlankLines = true`
- `ensureTrailingNewline = true`

### Optional helper for line-oriented use

```typescript
addBodyLine (line: string): void
```

Equivalent to `addBody(line + '\n', { indentMode: 'relative' })`.

## Authoring Examples

### Before

```typescript
this.body += `   assign en = m_axis.TREADY || !valid_pipe_1;\n`
this.body += `   assign s_axis.TREADY = en;\n`
this.body += `   assign data_in = $signed(s_axis.TDATA[${params.inWidth - 1}:0]);\n`
```

### After

```typescript
this.addBody(`
assign en = m_axis.TREADY || !valid_pipe_1;
assign s_axis.TREADY = en;
assign data_in = $signed(s_axis.TDATA[${params.inWidth - 1}:0]);
`)
```

The author only needs local self-consistency.
Global indentation is normalized at generation time.

### Mixed local indentation accepted

```typescript
this.addBody(`
    if (valid_pipe_1) begin
  m_axis.TVALID = 1'b1;
        end
`)
```

Relative normalization should preserve block structure while removing accidental
left margin drift.

## Generation and Formatting Pipeline

Recommended flow inside `writeSystemVerilog()`:

1. Collect generated sections (interfaces, module header, signals, body,
   generated register/submodule blocks).
2. Normalize body snippet indentation (if not already normalized on insert).
3. Apply global indentation policy for module interior sections.
4. Run Verible formatter as a post-processing step.
5. If Verible is unavailable or fails, apply deterministic internal fallback
   normalization and emit a warning (unless configured to fail hard).
6. Return final text.

### Indentation policy

- Module interior base indent: 2 or 3 spaces (reuse current style to minimize
  diff churn).
- Nested block indent increment: +2 spaces.
- Do not change token-level spacing in v1; only line-leading whitespace.

## Verible Integration Plan

### Initial platform scope

- Linux x86_64
- macOS ARM64

Initial release asset patterns to target:

- `verible-<tag>-linux-static-x86_64.tar.gz`
- `verible-<tag>-macOS.tar.gz`

### Binary acquisition and installation

Proposed strategy:

1. Pin a tested Verible release tag in TSSV config.
2. Download matching release archive from
   `https://github.com/chipsalliance/verible/releases`.
3. Verify SHA-256 checksum against the published release checksum.
4. Extract `verible-verilog-format` into a local tools cache
   (for example `third-party/verible/bin/` or user cache directory).
5. Mark executable (`chmod +x`) on Unix hosts.

Notes:

- Do not rely on `PATH` only; allow explicit binary path configuration.
- Keep download/install outside hot generation paths.

### Formatter invocation contract

Use Node.js process spawning (`node:child_process`) and communicate via stdin:

```text
spawn(verible-verilog-format, [flags...])
stdin  <- generated SystemVerilog text
stdout -> formatted SystemVerilog text
stderr -> diagnostics
```

Recommended defaults:

- `--indentation_spaces=2` (or project-selected value)
- `--inplace=false` behavior by using stdin/stdout mode
- Timeout guard for stalled processes

### Configuration knobs

```typescript
type FormatterConfig = {
  engine: 'verible' | 'internal' | 'off'
  veriblePath?: string
  veribleFlags?: string[]
  failOnFormatError?: boolean
  formatTimeoutMs?: number
}
```

Default for spike: `engine = 'verible'`.

Fallback behavior:

- If `engine='verible'` and binary missing/fails:
  - if `failOnFormatError=true`: throw
  - else: fallback to internal indentation normalizer and warn

### Error handling and diagnostics

- Include formatter command, exit code, and stderr in error messages.
- Truncate diagnostic payloads only when very large; keep actionable context.
- Preserve unformatted output when fallback path is selected.

## Internal Representation

Two viable approaches:

### Option A: Keep `body` string, normalize on insert

- `addBody()` appends normalized snippet to existing `body` string.
- Minimal invasive change.
- Easy backward compatibility with direct `this.body += ...`.

### Option B: Store body chunks

```typescript
private bodyChunks: Array<{ text: string, mode: 'relative' | 'verbatim' }>
```

- `addBody()` pushes structured chunks.
- Final assembly normalizes/joins chunks before emit.
- Better long-term extensibility (source mapping, debug, section tagging).

Recommendation for spike: start with Option A for speed.

## Backward Compatibility Strategy

- Keep `body` field working as-is for existing modules.
- Introduce `addBody()` and use it in new/updated modules.
- Optionally add a lint rule or grep check later to discourage new direct
  `this.body +=` usage once API is validated.

## Interaction with Existing APIs

- `addAssign()` remains preferred where it works.
- `addBody()` is for cases where raw text is required (e.g. interface member
  assigns, one-off constructs not covered by current helpers).
- Existing `addCombAlways`/`addSequentialAlways` continue to emit into body.

## Internal Fallback Formatter

Even with Verible as the default, keep a lightweight internal indentation
normalizer as a deterministic fallback path.

Fallback responsibilities:

- Normalize line-leading whitespace.
- Preserve text and statement order.
- Avoid token-level rewrites.

This fallback is primarily for resilience, unsupported host setups, and
diagnostic isolation.

## Risks and Mitigations

1. Risk: naive indent normalization can break multiline strings or comments.
   Mitigation: restrict v1 to leading whitespace normalization only; add focused
   tests for comments and string literals.

2. Risk: mixed manual + generated body sections produce inconsistent style.
   Mitigation: normalize all body content in one pass before final emit.

3. Risk: large diffs from formatting changes.
   Mitigation: keep indentation defaults aligned with current style and avoid
   token reformatting in v1.

## Validation Plan

1. Unit-level checks for `addBody()` normalization behavior.
2. Golden output comparison on a small module set before/after converting call
   sites.
3. Verible integration tests on Linux x86_64 and macOS ARM64:
  - download/extract path
  - process spawn success
  - deterministic formatted output
4. Confirm generated SV compiles/lints with existing Verilator flow.
5. Run TypeScript compile and lint to ensure no API regressions.

## Recommended First Spike Scope

Implement only the minimum needed to validate the idea:

1. Add `addBody()` to core module API.
2. Add indentation normalization utility.
3. Integrate Verible CLI formatting with configuration and fallback behavior.
4. Route final body text through normalization + formatter in generation.
5. Convert one representative module (for example FIR) from direct `body +=`
   snippets to `addBody()`.

Success criteria:

- Authors can write body snippets without managing global indentation.
- Generated SV indentation is consistent across modules.
- Verible formatting works on Linux x86_64 and macOS ARM64.
- Existing modules continue to work unchanged.
- No meaningful regression in compile/lint flow.
