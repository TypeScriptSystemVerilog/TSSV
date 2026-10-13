<!--
See doc/process/issue-workflow.md for the full spec. In short:
- Every PR closes exactly one issue (or one subtask of one).
- The Acceptance Criteria checklist below must be copied verbatim from that issue.
- Check a box only after verifying it against actual output (a test run, a lint pass,
  a diff review) — never speculatively. Don't merge with any box still unchecked.
- If it changes generated SV, show that SV in PR comments and link them under Generated SV.
-->

## Summary

<!-- What does this PR do, and why? -->

## Related Issue

Closes #

## Acceptance Criteria

<!-- Copy the checklist from the issue. -->

- [ ]

## Test Plan

<!-- Commands actually run, and their results. -->

## Generated SV

<!--
See doc/process/issue-workflow.md §5, "Showing the generated SV".
scripts/gen-sv --base origin/main [test ...] regenerates the SV on both sides and diffs it.
If this PR changes generated SystemVerilog, post the evidence as PR comments, one per example
or module with the SV inside <details>, and link each one here:
- A changed add* helper: the SV for an example call, before and after, for each mode that changes.
- A new generation API: example calls and the SV each emits.
- A changed module: the generated-SV diff if it is about 100 changed lines or fewer; otherwise
  the scripts/gen-sv line for the reviewer to run, and which files to read.
If it changes none (scripts/gen-sv --base exits 0), replace this with "No change to generated SV."
-->

## Notes

<!-- Deviations from the issue's original scope, follow-up issues filed, etc. -->
