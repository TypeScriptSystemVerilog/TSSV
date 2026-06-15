# Setting Up Claude Code in the TSSV Project

This document covers the one-time setup required to start using Claude Code in the TSSV repository.

---

## Prerequisites

- **Node.js** — already required for TSSV, no additional installation needed

---

## 1. Install the Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

---

## 2. Install the VS Code Extension

Install the **Claude Code** extension by Anthropic from the VS Code Extensions marketplace, then connect it to your Claude Code account following the extension's sign-in prompts.

---

## 3. Initialize Claude in the TSSV Directory

Open the TSSV directory in VS Code, then run the `/init` command. Claude will analyze the codebase and generate a `CLAUDE.md` file at the repo root.

`CLAUDE.md` is automatically loaded into Claude's context at the start of every session — it contains project-specific guidance (build commands, architecture overview, simulation workflow) so Claude can be productive immediately without re-explaining the project each time.
