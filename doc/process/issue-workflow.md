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
- Reading or editing the board's `Status` field from the CLI (`gh project ...`) needs the
  `project` scope on top of `repo` (`gh auth refresh -s project`). Nothing else here
  requires it: Type is set via `gh issue`, and Status is normally moved in the board UI.
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

### Status (project board field — exactly one)

An issue's Status is where it stands *while open*. It lives in the **Status** field on the
[TSSV project board](https://github.com/orgs/TypeScriptSystemVerilog/projects/4), not in a
label. The board was copied from `tssv-noc`'s, so the two repos share one vocabulary. A
project workflow adds new issues to the board when they're filed, and another adds the
sub-issues of anything already on it.

| Status | Meaning |
|---|---|
| `Triage` | Newly filed; not yet scoped or accepted (where new issues land) |
| `Ready` | Scoped, AC written and agreed, ready for someone (human or agent) to start |
| `In Progress` | Branch exists, actively being worked |
| `In Review` | PR open, awaiting review/merge |
| `Blocked` | Waiting on an external dependency or a decision |
| `Done` | Terminal; kept in lockstep with the issue's closed state (below) |

Project workflows move Status for you at the ends of the lifecycle:

- **`Pull request linked to issue`**: a PR that references the issue opens → `In Review`
- **`Item closed`** / **`Pull request merged`**: the issue closes (any reason) or its PR
  merges → `Done`
- **`Auto-close issue`**: `Status` set to `Done` → the issue closes

`Ready`, `In Progress` and `Blocked` are set by hand. Closing via a PR's `Closes #N` (§4) is
the normal path to `Done`; setting `Status` to `Done` is a convenience.

The board has three views: **Backlog (Table)** and **Backlog (Board)** show every item not
`Done`, and **Shared Pool** shows `Ready` issues labelled `help wanted`, meaning anyone can
pick them up rather than waiting to be assigned.

### Labels

No custom labels are required. The repo's stock labels (`duplicate`, `wontfix`, `question`,
`good first issue`, `help wanted`) remain available as resolution/attribute tags — they're
orthogonal to Type, not a substitute for it. Don't use the stock `bug`, `enhancement`, or
`documentation` labels on new issues; the Issue Type already carries that information.

### Relationships: sub-issues and dependencies

Two relationships, kept separate:

- **Hierarchy** (an `Epic`'s children, or a `Task` split across several PRs): native
  **sub-issues**, via `gh issue edit <child> --parent <n>`. The board rolls these up as
  `Parent issue` and `Sub-issues progress`.
- **Blocking** (A can't start until B merges): native **issue dependencies**, via
  `gh issue edit <n> --add-blocked-by <blocker>`, readable with
  `gh issue view <n> --json blockedBy`. Boards can't render blocked-by as a column, so
  `Status = Blocked` is the board-visible signal.

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
| **PR description** | Summary of the overall change, the `Closes #N` link, the Acceptance Criteria checklist copied from the issue with boxes checked only against verified evidence (§7), the test plan (commands actually run), what the change does to the generated SV ([below](#showing-the-generated-sv)), and any deviations from the issue's original scope. |
| **PR comments** | The generated-SV evidence: one comment per example or module, linked from the description ([below](#showing-the-generated-sv)). |

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

### Showing the generated SV

`sv-examples/` is git-ignored, so a PR that changes what TSSV generates shows its TypeScript
diff but not the SystemVerilog that comes out of it. Reviewing that diff alone means guessing
at the SV, or checking out both branches and regenerating it. The author shows it instead.
tssv-noc's `doc/process/issue-workflow.md` §6 has the same rules for tssv-noc PRs; keep the two
in step.

**What to show** depends on the change:

| The PR… | Show |
|---|---|
| changes an existing generation API helper (an `add*` method in `ts/src/core/Base.ts`) | The SV an example call emits, before and after the change. A change that affects more than one mode or option of the helper needs an example for each mode that changes. |
| adds a generation API | Enough example calls, each with the SV it emits, to show how the API behaves, including each mode or option that changes the output. |
| changes an existing module (`ts/src/modules/*`) | The diff of the module's generated SV, if it is about 100 changed lines or fewer. Larger than that: the commands below for the reviewer to run, and which generated files and parameter sets to read. The key hunks can still go inline. |
| changes no generated SV | One line in the description: "No change to generated SV." Run the diff below to check this rather than assume it. |

"Changed lines" means lines added plus lines removed in the diff, which the count command
below prints. A module's test usually generates several parameter sets, and one change often
repeats in each of them. When it does, show one set, list the others it applies to, and count
that one set against the threshold. The `ts/test/test_add*.ts` scripts are a ready source of
example calls for a helper.

**Where it goes:** in PR comments, not the description. Post one comment per example or per
module, with its SV inside a `<details>` block: a `diff` fence for before/after, a
`systemverilog` fence for new output. Then list those comments in the description's
**Generated SV** section, one link each (a comment's link is its timestamp). This keeps the
description readable, and gives each example a comment that collapses on its own and that
review feedback can link to. The comments only exist once the PR does, so open the PR, post
them, then edit the description to add the links.

**Generating the "before" SV.** Build the base branch in a scratch worktree outside the repo
tree (`mktemp -d`), so it can't collide with your checkout or another session's. The base is
`origin/main`, or the parent branch for a stacked PR. `runAllTests.sh` regenerates every
example, so run it on both sides and diff the two `sv-examples/` trees:

```bash
# From your checkout of the PR's branch
git fetch origin
base=origin/main                  # or origin/<parent-branch> for a stacked PR
scratch=$(mktemp -d)
git worktree add --detach "$scratch/TSSV" "$base"
(cd "$scratch/TSSV" && npm ci && bash runAllTests.sh)
bash runAllTests.sh               # head side, regenerates sv-examples/ here

# The IpXactComponent examples record their inputs' absolute paths; -I ignores those lines
ignore='// [A-Za-z]*Path = /'
diff -rq -I "$ignore" "$scratch/TSSV/sv-examples" sv-examples      # which files changed
# <dir>: a directory that changed, such as SFIFO
diff -ru -I "$ignore" "$scratch/TSSV/sv-examples/<dir>" sv-examples/<dir> > "$scratch/<dir>.diff"
grep -E '^[-+]' "$scratch/<dir>.diff" | grep -vcE '^(\+\+\+|---) '   # changed lines

# Once the evidence is posted
git worktree remove --force "$scratch/TSSV" && rm -rf "$scratch"
```

For a module diff too large to post, put this block in the comment with `base` filled in, so
the reviewer can run it from their own checkout of the PR's branch, and name the files to read.
`runAllTests.sh` skips `test_AXI4XBar`, which needs Docker; a change to `AXI4XBar` needs that
test run by hand on both sides.

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
