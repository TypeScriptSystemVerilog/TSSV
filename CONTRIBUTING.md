# Contributing to TSSV

TSSV is licensed under the [Apache License 2.0](LICENSE). A contribution you submit is
licensed under it too, as Section 5 of the license says. There is no contributor license
agreement (CLA), and you keep the copyright in your contribution.

How work is planned, reviewed and merged (issues, branches, pull requests) is in
[`AGENTS.md`](AGENTS.md) and [`doc/process/issue-workflow.md`](doc/process/issue-workflow.md).

## Sign off every commit

Every commit needs a `Signed-off-by:` line with the name and email of its author:

```
Signed-off-by: Jane Doe <jane@example.com>
```

With it you certify the [Developer Certificate of Origin](#developer-certificate-of-origin)
(DCO) below: in short, that you have the right to submit the change under this project's
license. `git commit -s` adds the line from your `user.name` and `user.email`. Its email must
match the commit's author email.

The `dco` check fails a pull request if any of its commits, other than a merge commit, has
no matching sign-off. To fix one:

- The last commit: `git commit --amend --no-edit -s`
- Every commit on your branch: `git rebase --signoff origin/main`

Then `git push --force-with-lease`. `npm run check:dco` runs the same check locally, on the
commits between `origin/main` and `HEAD`.

Commits made in the GitHub web editor are signed off for you.

### Commits an AI agent writes

The person running the agent is the contributor. The agent commits with `git commit -s`
under that person's git identity, so the sign-off is that person's certification, and they
answer for the change as if they had written it. An agent never signs off as itself, or for
anyone other than the person running it. A `Co-Authored-By:` line that names an agent is
attribution only.

## Developer Certificate of Origin

From <https://developercertificate.org/>:

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.


Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```
