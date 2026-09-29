# Issue-Driven Workflow

Canonical spec for how work enters this repo, gets scoped, gets implemented (by a human,
by an agent, or both together), and gets merged. `AGENTS.md` carries the short version and
the step-by-step agent procedure; this document is the authoritative reference for the
schema, naming conventions, and templates it points to.

The workflow has one goal: every change traces back to an issue with explicit Acceptance
Criteria (AC), and nothing merges until those criteria are verified true, not just "should
work."

## 1. Tooling

Issue/PR read-write happens through the `gh` CLI, authenticated as the human operator's own
GitHub account (not a separate bot identity — commits and merges should be attributable to a
person).

- Verify with `gh auth status`. The token needs at minimum the `repo` scope (classic token)
  or, for a fine-grained token, **Issues: read/write**, **Pull requests: read/write**, and
  **Contents: read/write** on this repository. Re-run `gh auth login --scopes repo` if it
  shows expired or missing scopes.
- The `gh issue edit --type`/`--parent`/`--add-blocked-by` flags used below need a recent
  `gh` (`--add-blocked-by` needs ≥ 2.94.0). Check `gh issue edit --help` if one is rejected,
  and upgrade `gh` rather than working around it.

## 2. Issue classification

### Type (native Issue Type — exactly one)

Set from the issue form's `type:` key when filed through the web UI (§3), or with
`gh issue create --type <Type>` / `gh issue edit <n> --type <Type>`. Read it back with
`gh issue view <n> --json issueType`. The vocabulary is defined org-wide under
**Organization → Settings → Planning → Issue types**.

| Type | Meaning | Typically has a branch/PR? |
|---|---|---|
| `Idea` | Unrefined proposal or design question; not yet scoped enough to implement | Rarely — sometimes a throwaway branch to explore |
| `Epic` | Large multi-issue initiative, tracked via its native sub-issues | No direct branch; tracks its `Task`/`Subtask` children |
| `Task` | A scoped, independently-mergeable unit of implementation work | Yes |
| `Subtask` | A child of an epic or of a task too large for one PR | Yes |
| `Bug` | Existing code/tooling behaves incorrectly | Yes |
| `Docs` | Documentation-only change | Yes |
| `Spike` | Time-boxed investigation whose output is a decision or a doc, not necessarily code | Sometimes |
| `Chore` | Tooling/process maintenance with no change to generated SystemVerilog | Yes |

GitHub's stock `Feature` type is not used. New functionality is an `Idea` until it's scoped,
then a `Task` or `Epic`.

### Status

There is no project board or status label. An issue's state is read from GitHub itself:

| State | How you can tell |
|---|---|
| Open, not started | Open, no assignee, no linked branch/PR |
| In progress | Assigned, `Links` field (§5) shows a branch |
| In review | `Links` field shows an open PR |
| Blocked | Has a native blocked-by dependency (below) |
| Done | Closed — normally by a merged PR's `Closes #N` |

### Labels

No custom labels are required. The repo's stock labels (`duplicate`, `wontfix`, `question`,
`good first issue`, `help wanted`) remain available as resolution/attribute tags — they're
orthogonal to Type, not a substitute for it. Don't use the stock `bug`, `enhancement`, or
`documentation` labels on new issues; the Issue Type already carries that information.

### Relationships: sub-issues and dependencies

Two relationships, kept separate:

- **Hierarchy** (an `Epic`'s children, or a `Task` split across several PRs): native
  **sub-issues**, via `gh issue edit <child> --parent <n>`.
- **Blocking** (A can't start until B merges): native **issue dependencies**, via
  `gh issue edit <n> --add-blocked-by <blocker>`, readable with
  `gh issue view <n> --json blockedBy`.

Don't record either as prose in the issue body. Create a blocking link only for a real
blocker on someone's next action, not to note that two issues are related.

## 3. Issue templates

`.github/ISSUE_TEMPLATE/` has one GitHub Issue Form (YAML) per type: `idea.yml`, `epic.yml`,
`task.yml`, `subtask.yml`, `bug.yml`, `spike.yml`, `docs.yml`, `chore.yml`. Blank issues are
disabled (`config.yml`) so every issue goes through a template and therefore always has an
**Acceptance Criteria** field — every template requires one, including `idea` and `spike`,
where the "criteria" are what would make the idea worth accepting or the investigation worth
closing (e.g. "a written recommendation with a go/no-go call" rather than a code behavior).

Each template sets its Issue Type via the form's top-level `type:` key (e.g. `type: Bug`
in `bug.yml`); the value must match an org-level Issue Type name exactly. From the CLI,
`gh issue create --template <file>` only seeds the body text — it does *not* apply the
`type:` key — so pass `--type` explicitly too.

## 4. Branch and PR naming

Branch name: `<type>/<issue-number>-<kebab-slug>`, where `<type>` is the issue's Issue
Type lowercased (`task`, `bug`, `subtask`, `spike`, `chore`, `docs`, `epic`, `idea`) and
`<kebab-slug>` is a short slug of the issue title.

```
task/51-add-apb-bridge-module
bug/53-fir-coeff-width-overflow
docs/54-typedoc-register-examples
```

Create it from `origin/main` with `--no-track`:

```bash
git fetch origin
git checkout -b <type>/<n>-<slug> --no-track origin/main
```

Without `--no-track`, the new branch's upstream is `origin/main`, and anything that pushes
to the upstream (VSCode's "Sync Changes", `push.default=upstream`, or the
`git push origin HEAD:main` that git itself suggests) puts your commits directly on `main`.
Push the branch with `git push -u origin <branch>`.

PR title: same as the issue title (or a more precise description if the PR is one of several
against the same issue). PR body must reference the issue with a GitHub closing keyword —
`Closes #23`, `Fixes #31`, or `Resolves #24` — so merging the PR auto-closes the issue. A
`Subtask` PR closes its own subtask issue, not the parent epic/task.

## 5. What goes where

| Artifact | Contents |
|---|---|
| **Issue body** | Problem statement, context, links to relevant source/specs, and the Acceptance Criteria checklist. Written once at scoping time; edited later only to refine scope, not to log progress — **with one narrow exception**: the `Links` field (below). |
| **Issue comments** | The running log: "started branch X", investigation notes, decisions/deviations made mid-implementation. This is where an agent narrates *why* something changed from the original plan. |
| **Commit messages** | One atomic, technical description per commit of *what changed and why*, using the template in §6. Commit type is about the nature of the diff, independent of the issue's Issue Type — a `Task` issue can still contain `fix` or `test` commits. |
| **PR description** | Summary of the overall change, the `Closes #N` link, the Acceptance Criteria checklist copied from the issue with boxes checked only against verified evidence (§7), the test plan (commands actually run), and any deviations from the issue's original scope. |

**Backfilling the `Links` field.** Every template except `epic.yml` starts with a `Links`
field (`- Branch: _(none yet)_` / `- PR: _(none yet)_`) so the issue stays a self-contained
entry point. Fill in the Branch line once the branch is pushed and the PR line once the PR
is open. `gh issue edit --body` replaces the whole body, so this is fetch → replace →
write back:

```bash
gh issue view <N> --json body -q .body > issue-body.md
# A bare branch name doesn't autolink, so give it an explicit link:
sed -i 's|- Branch: _(none yet)_|- Branch: [<n>-<slug>](https://github.com/TypeScriptSystemVerilog/TSSV/tree/<type>/<n>-<slug>)|' issue-body.md
# A bare "#N" does autolink:
sed -i 's|- PR: _(none yet)_|- PR: #<pr-number>|' issue-body.md
gh issue edit <N> --body-file issue-body.md
```

If someone has edited the body since it was filed, the `sed` can silently no-op — check what
you're writing back.

## 6. Commit message template

`.github/COMMIT_TEMPLATE.txt` holds this; point git at it locally with
`git config commit.template .github/COMMIT_TEMPLATE.txt` if you want it pre-filled in
`$EDITOR`.

```
<type>(#<issue>): <imperative summary, ≤50 chars>

<body: what changed and why, wrapped at ~72 cols. Explain the "why"
if it's not obvious from the diff. Note any deviation from the
issue's stated scope.>

Refs #<issue>
```

`<type>` is a Conventional-Commits-style tag describing the diff itself: `feat`, `fix`,
`refactor`, `docs`, `test`, `chore`, `perf`, or `build`. Example:

```
feat(#51): add APB-to-register-block bridge module

Adds APBBridge with a typed Parameters interface and APB4 slave
IOs, plus test_APBBridge.ts emitting sv-examples output.

Refs #51
```

Any agent-attribution footer (e.g. `Co-Authored-By:`) goes after `Refs #<issue>`.

## 7. Acceptance Criteria: writing and gating

- Every issue template requires an "Acceptance Criteria" section written as a GitHub task
  list (`- [ ] criterion`), each item concrete and checkable (a test that passes, a lint
  command that's clean, a doc section that exists) — not "works correctly."
- The PR description reproduces that checklist. **Checking a box in the PR means it was
  verified against actual output** (a `npx tsc` build, a test run, a
  `verilator --lint-only` pass, a diff review) — never checked speculatively.
- There's no automated gate on this. Don't merge a PR with an unchecked box, a missing
  `Closes #N`, or a missing Acceptance Criteria section.
- Merging is the human's call. An agent opens the PR, verifies and checks off AC, then
  waits for approval — it doesn't merge on its own even when its token could.

## 8. Gotchas

- **Don't write `#N` as an ordinal.** GitHub turns any bare `#<number>` into a link to that
  issue/PR, including when you meant "the 2nd through 5th item." Spell out real issue
  numbers, or reword.
- **Stacking on an unmerged branch.** If new work needs content only on another open
  branch, base on the local branch (`git checkout -b <new> <other-branch>`). The PR will
  show the other branch's diff until it merges; then `git fetch origin && git rebase
  origin/main`.
- **Pending PR reviews are invisible.** Inline review comments in a `PENDING` review are
  visible only to their author until the review is submitted. Check
  `gh api repos/TypeScriptSystemVerilog/TSSV/pulls/<n>/reviews` before treating feedback as
  communicated.
