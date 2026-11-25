<!--
See doc/process/issue-workflow.md for the full spec. In short:
- Every PR closes exactly one issue (or one subtask of one).
- The Acceptance Criteria checklist below must be copied verbatim from that issue.
- Check a box only after verifying it against actual output (a test run, a lint pass,
  a diff review) — never speculatively. Don't merge with any box still unchecked.
- If it changes generated DUT RTL, run scripts/rtl-pr and name its RTL PR under Generated SV.
- Every commit needs a DCO sign-off (`git commit -s`); the `dco` check enforces it.
  See CONTRIBUTING.md.
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
If this PR changes generated DUT RTL, run scripts/rtl-pr after pushing; it opens the RTL PR.
Name it here: "RTL PR: #<n>". Reviewers approve it, and the "Generated RTL reviewed" check
waits for that approval.
If it changes none, replace this with "No change to generated DUT RTL." scripts/rtl-pr
prints which.
For SV that no RTL PR shows (a generation helper's mode that no DUT uses, AXI4XBar, or
testbench files when they help review), post it as PR comments with the SV inside
<details>, and link each one here.
-->

## Notes

<!-- Deviations from the issue's original scope, follow-up issues filed, etc. -->
