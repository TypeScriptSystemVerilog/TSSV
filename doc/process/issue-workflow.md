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
| changes an existing module (`ts/src/modules/*`) | The diff of the module's generated SV, if it is about 100 changed lines or fewer. Larger than that: the `scripts/gen-sv` command (below) for the reviewer to run, and which generated files and parameter sets to read. The key hunks can still go inline. |
| changes no generated SV | One line in the description: "No change to generated SV." Check it with `scripts/gen-sv --base` (below) rather than assume it. |

"Changed lines" means lines added plus lines removed in the diff, as `scripts/gen-sv` counts
them. A module's test usually generates several parameter sets, and one change often
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

**Generating the SV: `scripts/gen-sv`.** It regenerates `sv-examples/`, and with `--base`
diffs it against another branch or commit:

```bash
git fetch origin
scripts/gen-sv --base origin/main                      # every test; or origin/<parent> for a stacked PR
scripts/gen-sv --base origin/main ts/test/modules/test_SFIFO.ts   # just the tests named
scripts/gen-sv ts/test/test_addMux.ts                  # no --base: regenerate only
```

With `--base`, it builds the base in a scratch worktree outside the repo tree (under
`$TMPDIR`), runs the same tests on both sides, and compares only the files those tests wrote.
The base is the merge base of the ref and your `HEAD`, as GitHub compares a PR, so commits that
landed on `main` after you branched don't show up as changes.
The head side is your checkout as it stands, uncommitted changes included. It prints each
changed file with its changed-line count, the total, and any files added or removed, and saves
the full unified diff (added files included whole) to a file whose path it prints: that file is
where the snippets to post come from. It exits 0 when nothing differs, which is the check behind
"No change to generated SV", and 1 when something does. `--keep` keeps the base worktree for a
closer look; `scripts/gen-sv --help` has the details.

With no tests named it runs every script under `ts/test/` except those
`scripts/test-skips.sh` lists, which takes about 15 s. `test_AXI4XBar` is one of those, since it
needs Docker, so a change to `AXI4XBar` needs that test named and run where Docker is available.
For a module diff too large to post, give the reviewer the `scripts/gen-sv --base …` line with
the tests to name, and say which files to read.

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

Signed-off-by: <your name> <your git email>
```

`<type>` is a Conventional-Commits-style tag describing the diff itself: `feat`, `fix`,
`refactor`, `docs`, `test`, `chore`, `perf`, or `build`. Example:

```
feat(#51): add APB-to-register-block bridge module

Adds APBBridge with a typed Parameters interface and APB4 slave
IOs, plus test_APBBridge.ts emitting sv-examples output.

Refs #51

Signed-off-by: Jane Doe <jane@example.com>
```

Any agent-attribution footer (e.g. `Co-Authored-By:`) goes after `Refs #<issue>`.

Every commit needs the `Signed-off-by:` line, the DCO sign-off described in
`CONTRIBUTING.md`: commit with `git commit -s`, which adds it last. The `dco` check fails a
PR with a commit that lacks it. An agent signs off with the git identity of the person
running it, never its own.

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
- Merge with **Create a merge commit**, not squash or rebase. The `main` ruleset already
  refuses a squash merge. A merge commit keeps each commit as it was reviewed, and a PR
  stacked on this one keeps showing only its own commits (§8).

## 8. Stacked PRs

Sometimes new work needs content that only exists on another open PR's branch. Base your
branch on that branch, and open its PR against that branch, not `main`.

The PR's base is what keeps a stack readable. A PR shows the commits on its branch that
aren't on its base. Opened against `main`, a stacked PR also shows every commit of the PRs
below it as its own. Opened against its parent's branch, it shows only its own commits.

### Create the branch

Push the parent first, then start your branch from the parent as pushed:

```bash
git fetch origin
git checkout -b <type>/<n>-<slug> --no-track origin/<parent-branch>
# or, in a worktree of its own:
git worktree add -b <type>/<n>-<slug> --no-track <path> origin/<parent-branch>
```

`--no-track` matters for the reason in §4. Without it, the new branch's upstream is the
parent's branch, and a push that targets the upstream lands your commits on the parent.

### Open the PR

```bash
gh pr view <parent-PR> --json state --jq .state    # OPEN: stack on it; MERGED: use main
gh pr create --base <parent-branch> ...
```

Always pass `--base`: without it, `gh` opens the PR against `main`. If the parent has already
merged, open the PR against `main`. If the parent was closed without merging, your branch
still holds its commits, so decide by hand what to do with them.

Start the body with the merge order, for example `**Stacked on #<parent-PR>**: merge that
first.` Keep `Closes #<N>` in the body as usual. GitHub acts on it only when the PR merges
into `main`, which it will once everything below it has merged ("Merge from the bottom up",
below). To show what the PR does to the generated SV (§5), diff against the parent:
`scripts/gen-sv --base origin/<parent-branch>`.

No `pull_request` trigger under `.github/workflows/` filters on the base branch, so CI runs
on a stacked PR as on any other.

### Change an open PR's base

On a recent `gh`, run `gh pr edit <PR> --base <branch>`, or use **Edit** next to the PR
title. On `gh` 2.46.0, every `gh pr edit` fails, whatever it edits, with
`GraphQL: Projects (classic) is being deprecated …`. Upgrade `gh` (§1), or call the
`updatePullRequest` mutation directly:

```bash
id=$(gh pr view <PR> --json id --jq .id)
gh api graphql -f id="$id" -f base=<branch> -f query='
mutation($id: ID!, $base: String!) {
  updatePullRequest(input: {pullRequestId: $id, baseRefName: $base}) {
    pullRequest { number baseRefName }
  }
}'
```

### Link the PRs into a GitHub stack

Once both PRs are open, make them a GitHub
[stacked pull request](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs)
with the `gh stack` extension, bottom PR first:

```bash
gh extension install github/gh-stack     # once per machine; needs git 2.36 or later
gh stack link <parent-PR> <your-PR>      # prints "Created stack with 2 PRs (stack #<S>)"
gh stack link <S> <next-PR>              # add a PR to the top of an existing stack
```

Pass PR numbers. `gh stack link` then only records the stack on GitHub: it pushes nothing and
keeps no local state. A branch name passed instead is pushed, and gets a PR opened for it if
it has none. #78 and #91 became stack #93 this way. A stack is a single linear chain in which
each PR's base is the branch of the PR below it, so set the bases first, as above.

What the stack adds, per GitHub's documentation:

- Each PR shows a stack icon with its layer number, and the merge box shows a map of the whole
  stack with every PR's status.
- The `main` ruleset applies to every PR in the stack: one approving review and the `dco`
  check. CI that runs for PRs against `main` runs for every PR in the stack.
- When a PR in the stack merges, GitHub changes the base of the PRs above it to `main` and
  rebases their branches. Fetch before you work on an upper branch again ("When a lower
  branch changes during review", below).

Use only `link`, `merge` and `unstack` from `gh stack`. The others (`init`, `add`, `submit`,
`sync`, `rebase`, `push`) keep their own local record of the stack, and `sync`, `rebase` and
`push` rebase and force-push every branch in it. That conflicts with the rule below of adding
commits to a branch that has others stacked on it.

To check a PR's stack without `gh stack`:

```bash
gh api graphql -f query='{ repository(owner: "TypeScriptSystemVerilog", name: "TSSV") {
  pullRequest(number: <N>) { baseRefName stack { number size } } } }'
```

To undo a stack, run `gh stack unstack <S>`. It removes the stack on GitHub and doesn't close
the PRs.

### Merge from the bottom up

1. Merge the bottom PR, the one whose base is `main`, with **Create a merge commit** (§7).
2. GitHub changes the base of each PR above it to `main`. In a GitHub stack it also rebases
   their branches. Outside one, the change of base happens because GitHub deletes the merged
   branch, so stacking relies on the repository setting **Automatically delete head
   branches** staying on. Either way, those PRs now show only their own commits.
3. Merge the next PR up the same way, once it has its own approval.

To check the setting (it prints `true`):

```bash
gh api repos/TypeScriptSystemVerilog/TSSV --jq .delete_branch_on_merge
```

Merging one PR at a time is the norm, and every TSSV stack so far has landed that way.
GitHub's documentation says a PR in a stack can only be merged through its newer,
asynchronous merge API, which `gh pr merge` on `gh` 2.46.0 predates. Use the merge button on
the PR page, or `gh stack merge <PR> --merge`. Pass `--merge` every time: without a method,
`gh stack merge` uses the one you used last.

**Merging a PR in a GitHub stack also merges every PR below it.** On the PR page and with
`gh stack merge <PR>`, the merge takes everything from the bottom up to that PR in one
all-or-nothing operation, so every one of them needs its approval first. Merge several at
once only when every PR up to that one is approved and meant to land.

Outside a GitHub stack, never merge a PR whose base is still another branch. It merges into
that branch, not `main`, and its `Closes #<N>` closes nothing. Check the base shown under the
PR title before merging. If a merged branch isn't deleted, GitHub doesn't change the base of
the PRs above it, so change them to `main` by hand.

### One parent, several children

A GitHub stack is a single chain, so only one child of a parent can join the parent's stack.
Each other child does one of these:

- **Waits** until the parent merges, then branches from `main`. This is the default.
- **Stacks by base only**, when the parent's own base is `main`: it branches from the parent
  and opens its PR against the parent's branch, as above, but stays out of the GitHub stack.
  When the parent merges, GitHub changes the child's base to `main` (step 2 above); don't
  merge it before then. A parent that is higher up a stack is a bad base for this: when a PR
  below it merges, GitHub rebases its branch, and the child shows the parent's old commits as
  its own.

### If a parent was rebase- or squash-merged anyway

In a GitHub stack, GitHub rebases the PRs above for you whichever merge method was used, so
skip this subsection. Outside a stack, either method puts new commits on `main` in place of
the parent's. The `main` ruleset refuses a squash merge but allows a rebase merge. The PR above
still holds the parent's original commits, so once its base is `main` it shows them again as
its own. Move only your own commits onto `main`, from your branch:

```bash
git fetch origin
old_tip=$(gh pr view <parent-PR> --json headRefOid --jq .headRefOid)
git rebase --onto origin/main "$old_tip"
git push --force-with-lease origin HEAD
```

### When a lower branch changes during review

Add commits to it. Don't rebase or force-push a branch that has others stacked on it.

GitHub is the exception: when a PR in a GitHub stack merges, it rebases the branches above it.
Before adding commits to such a branch, run `git fetch origin` and `git status -sb`. If your
branch has diverged from `origin` and you have no unpushed commits, run
`git reset --hard origin/<your-branch>`. Otherwise run `git rebase origin/<your-branch>`.

New commits on the parent don't disturb the PR above: it still shows only its own commits. If
your branch needs the parent's new content, merge it in:

```bash
git fetch origin
git merge origin/<parent-branch>
git push origin HEAD
```

## 9. Gotchas

- **Don't write `#N` as an ordinal.** GitHub turns any bare `#<number>` into a link to that
  issue/PR, including when you meant "the 2nd through 5th item." Spell out real issue
  numbers, or reword.
- **Pending PR reviews are invisible.** Inline review comments in a `PENDING` review are
  visible only to their author until the review is submitted. Check
  `gh api repos/TypeScriptSystemVerilog/TSSV/pulls/<n>/reviews` before treating feedback as
  communicated.
