# CLAUDE.md

This file is what Claude Code (claude.ai/code) auto-loads when working in this repository.

**AGENTS.md is the canonical project doc.** The project overview, repo structure, commands,
core architecture, conventions, the GitHub issue-driven workflow, and current implementation
state all live there, and its Key Documents table indexes every doc under `doc/`. Read it
first. This file only adds notes specific to Claude Code as a tool.

## Claude-Code-specific notes

- Work follows the issue-driven workflow in AGENTS.md ("GitHub Issue-Driven Workflow") and
  `doc/process/issue-workflow.md`: issue with Acceptance Criteria → branch → PR that closes it.
  It applies equally whether the session is Claude Code or another agent.
- Commands like `npx tsc`, `node out/test/test_<Name>.js` and `verilator` need the tools from
  README.md's Setup section. Generation fails without Verible on `PATH`.
