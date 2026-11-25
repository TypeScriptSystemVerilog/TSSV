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
| **PR description** | Summary of the overall change, the `Closes #N` link, the Acceptance Criteria checklist copied from the issue with boxes checked only against verified evidence (§7), the test plan (commands actually run), the RTL PR that shows what the change does to the generated DUT RTL ([below](#showing-the-generated-sv)), and any deviations from the issue's original scope. |
| **PR comments** | Review discussion, and the generated SV that no RTL PR shows: a generation helper's example calls, for one ([below](#showing-the-generated-sv)). |
| **RTL PR** | The generated DUT RTL of a PR that changes it, from `rtl/<N>` into `rtl/main`, made by `scripts/rtl-pr` ([below](#showing-the-generated-sv)). |

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

A PR that changes what TSSV generates shows its TypeScript diff, but not the SystemVerilog that
comes out of it. The *RTL PR* shows that SystemVerilog, with the whole of GitHub's review: new
modules in full, context around each change, line comments and approval. tssv-noc's
`doc/process/issue-workflow.md` §6 has the same rules for tssv-noc PRs; keep the two in step.

**Where the generated RTL lives.** In each checkout, `sv-examples/` is a git worktree on an
orphan branch (README.md, "Setup"): the main checkout's is on `rtl/main`, and an issue
worktree's is on `rtl/<N>`. `rtl/main` holds the DUT RTL generated from `main`: every file under
a `dut/` folder, which is all that the branch's `.gitignore` lets in. Generated testbench files
and test data stay on disk and out of git. Each commit on `rtl/main` records the `main` commit
it was generated from in a `Generated-from:` trailer.

**The RTL PR.** A PR that changes generated DUT RTL (the *generator PR*) gets a companion PR from
`rtl/<N>` into `rtl/main`. After pushing the generator PR's branch and opening the PR, run
`scripts/rtl-pr` in the issue worktree. Run it again after each push that changes generated RTL.

```bash
scripts/rtl-pr --dry-run     # what it would commit, and the RTL PR's description; no branch or PR needed
scripts/rtl-pr               # commit, push, and open or update the RTL PR
```

It takes under a minute, most of it in running every test script. It:

1. **Checks where `rtl/main` stands.** It refuses if the branch lacks the `main` commit that
   `rtl/main` was generated from: merge `origin/main` first. A generator PR stacked on another
   issue's branch is compared with that issue's `rtl/<P>` instead, when it has one.
2. **Regenerates `sv-examples/` from scratch** with `scripts/gen-sv --clean`, which deletes every
   file under a `dut/` folder first, so a configuration that the change removes shows as deleted.
   It refuses if a test script fails. Then `scripts/check-rtl.mjs` checks the files it would
   commit:
   - they are exactly the files under `dut/` folders;
   - every `` `include `` resolves to a committed file;
   - every DUT folder declares a module.
3. **Commits them to `rtl/<N>` and pushes.** The commit is signed off with your git identity, as
   [`CONTRIBUTING.md`](../../CONTRIBUTING.md) asks. It merges in `rtl/main` first if it has moved.
   If the files are the same as `rtl/<N>`'s head, it makes no commit, so an approval there still
   holds.
4. **Opens the RTL PR, or updates its description.** On opening, it requests the generator PR's
   reviewers and links the RTL PR on the generator PR. After a new commit, it asks for a review
   again from those who asked for changes, and from those whose approval no longer holds (below).
   If the change no longer touches generated DUT RTL, it closes an open RTL PR.

The RTL PR's description lists the *distinct changes*, made by `scripts/rtl-changes.mjs`. A
generator change usually repeats across every configuration that uses the changed class, so the
list shows each kind of change once:
- it groups changed files by the class named in their file header's Generator line;
- within a class, it groups files by the lines their diff removes and adds, counting changes
  that differ only in numbers, such as a width, as one;
- each row shows one example file's lines, with a link to that file;
- DUT folders added, deleted or moved whole are listed by folder.

GitHub's Files tab shows at most 300 files of a PR; past that, the list is what reviewers read.

**Rules for RTL PRs:**
- **An RTL PR closes no issue.** Its generator PR closes the issue, so the closing-keyword rule
  in §4 and the PR template don't apply to it.
- **Reviewers approve the RTL PR, and the generator PR waits for that approval.** The required
  check "Generated RTL reviewed" enforces it (below).
- **An approval holds while the RTL PR's own change stays the same** (Adam, 2026-11-24). A
  commit's *own change* is its diff against its merge base with `rtl/main` in the files under
  `dut/` folders, without line numbers or context; `scripts/rtl-own-change` prints a fingerprint
  of it. So merging in `rtl/main`, or regenerating after another PR's RTL has landed, keeps an
  approval. A regeneration that changes the RTL PR's own change needs a new one. `rtl/main`'s
  ruleset doesn't dismiss approvals on a push; the check compares the fingerprints instead.
- **Nobody merges an RTL PR, or commits to `rtl/main`, by hand.** Agents never push to it. CI
  lands the RTL after the generator PR merges (below).
- **The generator PR's description** names its RTL PR in the **Generated SV** section, or says
  "No change to generated DUT RTL". `scripts/rtl-pr` prints which.

**The "Generated RTL reviewed" check** (`.github/workflows/rtl-reviewed.yml`, a required check on
`main`) runs on every PR, docs-only ones too: a required check that a path filter skips never
reports. It regenerates the DUT RTL from the PR's merge commit, and `scripts/rtl-reviewed`
decides:
- **It passes** when the regenerated DUT files are the same as `rtl/main`'s, because the PR
  changes no DUT RTL.
- **It also passes** when the RTL PR from `rtl/<N>` holds exactly those files at its head, and
  someone's approval holds by the rule above, with no request for changes since.
- **Otherwise it fails** and says what's missing: an RTL PR (run `scripts/rtl-pr`), an RTL PR
  that matches (run it again), or an approval.

`rtl/main` has two workflows of its own, because GitHub reads an RTL PR's workflows from
`rtl/main`. Their sources are in `.github/rtl-branch/` on `main`, and CI copies them to
`rtl/main`:
- `rtl-approved.yml` re-runs the generator PR's check whenever a review on its RTL PR is
  submitted or dismissed, since an approval doesn't run the generator PR's checks;
- `dco.yml` is the `dco` check for RTL PRs. It runs `main`'s `scripts/check-dco.sh`.

**CI keeps `rtl/main` current** (`.github/workflows/rtl-main.yml`, logic in
`scripts/rtl-update`). It pushes with a deploy key, which `rtl/main`'s ruleset lets through.
- **After each push to `main`,** it regenerates. If the merged PR's RTL PR makes the same own
  change, its approval holds and every commit in it is signed off, CI merges it: the merge commit
  has the regenerated files and the RTL PR's head as its second parent, so GitHub marks the RTL
  PR merged. Otherwise CI commits the regenerated files and closes the RTL PR with a note saying
  why. RTL PRs stacked on the merged one move onto `rtl/main`.
- **It commits only when every test script and `scripts/check-rtl.mjs` pass.** Otherwise
  `rtl/main` stays as it is, and the run posts to Slack through `scripts/notify`.
  `gh workflow run rtl-main.yml` catches `rtl/main` up by hand, once the cause is fixed: it
  regenerates `main`'s head and commits only if something changed. Started with `--ref` on
  another branch, it runs that branch's scripts as a dry run, which tries a change to the
  workflow before it merges.
- **Its commits carry no sign-off** (Adam, 2026-11-25). They are generated from signed-off commits
  on `main` and pushed directly, so no `dco` check sees them. `CONTRIBUTING.md` says so.

Every commit CI makes carries a `Generated-from:` trailer, so `git log -1 origin/rtl/main` always
says what `rtl/main` was generated from.

**What the RTL PR doesn't show:**

| The PR… | Show |
|---|---|
| changes or adds a generation helper or API (an `add*` method in `ts/src/core/Base.ts`) in a mode or option that no DUT uses | Enough example calls, each with the SV it emits, to show how it behaves, before and after for a change. Post them as PR comments, with the SV inside a `<details>` block, and link each one from the **Generated SV** section. The `ts/test/test_add*.ts` scripts are a ready source of example calls. |
| changes `AXI4XBar` | Its test needs Docker, so `scripts/test-skips.sh` skips it and `rtl/main` has no AXI4XBar files. Post the diff from `scripts/gen-sv --base` with that test named (below), run where Docker is available, as a PR comment. |
| changes generated testbench files (harnesses, testbench components) | Nothing is required. When it helps review, post the diff from `scripts/gen-sv --base` (below) as a PR comment. |

**`scripts/gen-sv`** regenerates `sv-examples/`, and with `--base` diffs everything the tests write
against another branch or commit, testbench files included. tssv-noc has the same script.

```bash
git fetch origin
scripts/gen-sv --base origin/main                      # every test; or origin/<parent> for a stacked PR
scripts/gen-sv --base origin/main ts/test/modules/test_SFIFO.ts   # just the tests named
scripts/gen-sv ts/test/test_addMux.ts                  # no --base: regenerate only
```

With `--base`, it builds the base in a scratch worktree outside the repo tree (under `$TMPDIR`),
runs the same tests on both sides, and compares only the files those tests wrote. The base is the
merge base of the ref and your `HEAD`, as GitHub compares a PR, so commits that landed on `main`
after you branched don't show up as changes. The head side is your checkout as it stands,
uncommitted changes included. It prints each changed file with its changed-line count, and saves
the full unified diff to a file whose path it prints. It exits 0 when nothing differs and 1 when
something does. With no tests named, it runs every script under `ts/test/` except those
`scripts/test-skips.sh` lists. `scripts/gen-sv --help` has the details.

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
below). `scripts/rtl-pr` compares a stacked PR's RTL with its parent's `rtl/<P>` and opens its RTL
PR into `rtl/<P>`; CI moves it onto `rtl/main` when the parent's RTL lands (§5, "Showing the
generated SV"). To diff testbench files against the parent, use
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
