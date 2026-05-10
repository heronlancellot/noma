# Agent Teams — Master Reference Guide

Source: https://code.claude.com/docs/en/agent-teams
Requires: Claude Code v2.1.32+, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

---

## Table of Contents

1. [What Are Agent Teams](#1-what-are-agent-teams)
2. [Enable Agent Teams](#2-enable-agent-teams)
3. [Architecture](#3-architecture)
4. [Agent Teams vs Subagents](#4-agent-teams-vs-subagents)
5. [Starting a Team](#5-starting-a-team)
6. [Display Modes](#6-display-modes)
7. [Controlling the Team](#7-controlling-the-team)
8. [Task Management](#8-task-management)
9. [Communication Between Agents](#9-communication-between-agents)
10. [Permissions & Models](#10-permissions--models)
11. [Hooks for Quality Gates](#11-hooks-for-quality-gates)
12. [Token Costs](#12-token-costs)
13. [Best Practices](#13-best-practices)
14. [Use Case Examples](#14-use-case-examples)
15. [Troubleshooting](#15-troubleshooting)
16. [Known Limitations](#16-known-limitations)

---

## 1. What Are Agent Teams

Agent teams coordinate multiple Claude Code instances working together. One session acts as the **team lead**, which coordinates work, assigns tasks, and synthesizes results. **Teammates** work independently in their own context windows and can communicate directly with each other.

Key differentiator from subagents: teammates can message each other without going through the lead, and the user can also interact with individual teammates directly.

**Best for:**
- Research and review (multiple angles simultaneously)
- New modules/features (each teammate owns a separate piece)
- Debugging with competing hypotheses (parallel theory testing)
- Cross-layer work spanning frontend, backend, and tests

**Not ideal for:**
- Sequential tasks
- Same-file edits
- Work with many dependencies
- Routine, single-context tasks (single session is more cost-effective)

---

## 2. Enable Agent Teams

Set the environment variable in `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or export it in your shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---

## 3. Architecture

| Component   | Role                                                                 |
|-------------|----------------------------------------------------------------------|
| Team lead   | Main session; creates team, spawns teammates, coordinates work       |
| Teammates   | Separate Claude Code instances; each works on assigned tasks         |
| Task list   | Shared list of work items teammates claim and complete               |
| Mailbox     | Messaging system for direct agent-to-agent communication             |

**Storage locations (local):**
- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`

> Do NOT hand-edit `config.json` — it is overwritten on every state update.

The `config.json` contains a `members` array with each teammate's name, agent ID, and agent type. Any teammate can read this to discover other team members.

**Important:** A file like `.claude/teams/teams.json` inside your project directory is NOT recognized as configuration — Claude treats it as an ordinary file.

---

## 4. Agent Teams vs Subagents

| Dimension     | Subagents                                         | Agent Teams                                          |
|---------------|---------------------------------------------------|------------------------------------------------------|
| Context       | Own context window; results return to caller      | Own context window; fully independent                |
| Communication | Report results to main agent only                 | Teammates message each other directly                |
| Coordination  | Main agent manages all work                       | Shared task list with self-coordination              |
| Best for      | Focused tasks where only the result matters       | Complex work requiring discussion and collaboration  |
| Token cost    | Lower — results summarized back to main context   | Higher — each teammate is a separate Claude instance |

**Rule of thumb:** Use subagents when you need quick, focused workers that report back. Use agent teams when teammates need to share findings, challenge each other, and coordinate on their own.

---

## 5. Starting a Team

Tell Claude to create a team and describe the task and team structure in natural language:

```
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude will:
1. Create the team with a shared task list
2. Spawn teammates for each role
3. Have them explore the problem
4. Synthesize findings
5. Attempt to clean up when finished

You can also specify teammate count and models explicitly:

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

**Two ways teams get started:**
- You explicitly request a team
- Claude proposes one (and you confirm before it proceeds)

---

## 6. Display Modes

### In-Process (default fallback)
- All teammates run inside your main terminal
- Use `Shift+Down` to cycle through teammates
- Type to send messages directly
- Works in any terminal — no extra setup

### Split Panes
- Each teammate gets its own pane
- See everyone's output simultaneously
- Click into a pane to interact directly
- Requires **tmux** or **iTerm2**

**Default behavior (`"auto"`):**  
Uses split panes if already inside a tmux session; otherwise uses in-process.

**Configure in `~/.claude/settings.json`:**

```json
{
  "teammateMode": "in-process"
}
```

Or override for a single session:

```bash
claude --teammate-mode in-process
```

**Installing split-pane dependencies:**
- tmux: install via system package manager (see [tmux wiki](https://github.com/tmux/tmux/wiki/Installing))
- iTerm2: install the [`it2` CLI](https://github.com/mkusaka/it2), then enable **iTerm2 → Settings → General → Magic → Enable Python API**

> `tmux` works best on macOS. Using `tmux -CC` in iTerm2 is the recommended entrypoint.

**Navigation shortcuts (in-process mode):**
- `Shift+Down` — cycle through teammates (wraps back to lead after last teammate)
- `Enter` — view a teammate's session
- `Escape` — interrupt current turn
- `Ctrl+T` — toggle the task list

---

## 7. Controlling the Team

All control is in natural language directed at the lead.

### Require plan approval before implementation

```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

Flow:
1. Teammate works in read-only plan mode
2. Sends plan approval request to lead
3. Lead reviews and approves or rejects with feedback
4. If rejected: teammate stays in plan mode, revises, resubmits
5. Once approved: teammate exits plan mode and begins implementation

To influence the lead's judgment, add criteria:
```
Only approve plans that include test coverage.
Reject plans that modify the database schema.
```

### Shut down a teammate

```
Ask the researcher teammate to shut down
```

The lead sends a shutdown request; the teammate approves (exits gracefully) or rejects with an explanation.

### Clean up the team

```
Clean up the team
```

> Always use the **lead** to clean up. Never run cleanup from a teammate — their team context may not resolve correctly, leaving resources in an inconsistent state.

Cleanup fails if any teammates are still running — shut them down first.

---

## 8. Task Management

The shared task list coordinates work. Tasks have three states:

| State       | Description                                          |
|-------------|------------------------------------------------------|
| Pending     | Not yet started; may be blocked by dependencies      |
| In progress | Claimed by a teammate                                |
| Completed   | Done; dependents become unblocked automatically      |

**Task assignment:**
- **Lead assigns**: tell the lead which task to give which teammate
- **Self-claim**: after finishing a task, a teammate picks up the next unassigned, unblocked task automatically

Task claiming uses **file locking** to prevent race conditions when multiple teammates try to claim the same task.

**Sizing tasks:**
- Too small → coordination overhead exceeds benefit
- Too large → long periods without check-ins, higher risk of wasted effort
- Just right → self-contained unit with a clear deliverable (e.g., a function, a test file, a review)

**Recommended ratio:** 5–6 tasks per teammate keeps everyone productive without excessive context switching.

---

## 9. Communication Between Agents

- **Automatic message delivery**: messages are delivered automatically; the lead does not need to poll
- **Idle notifications**: when a teammate finishes, it automatically notifies the lead
- **Shared task list**: all agents can see task status and claim available work
- **Targeted messaging**: send a message to one specific teammate by name; to reach everyone, send one message per recipient

The lead assigns every teammate a name at spawn. To get predictable names you can reference in later prompts, specify what to call each teammate in the spawn instruction.

**Teammates do NOT inherit the lead's conversation history.** They load project context (CLAUDE.md, MCP servers, skills) from their working directory and the spawn prompt from the lead.

---

## 10. Permissions & Models

- Teammates start with the **lead's permission settings**
- If the lead runs with `--dangerously-skip-permissions`, all teammates do too
- You can change individual teammate modes after spawning
- You **cannot** set per-teammate modes at spawn time

**Using subagent definitions for teammates:**

Reference a named subagent type to reuse role definitions:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

The teammate honors that definition's `tools` allowlist and `model`. The definition body is appended to the teammate's system prompt (not replacing it). Team coordination tools (`SendMessage`, task management tools) are always available even when `tools` restricts others.

> `skills` and `mcpServers` frontmatter fields in subagent definitions are NOT applied when running as a teammate. Those load from project/user settings instead.

---

## 11. Hooks for Quality Gates

Use hooks to enforce quality checks at key team lifecycle events:

| Hook Event       | Trigger                                  | Exit code 2 effect                          |
|------------------|------------------------------------------|---------------------------------------------|
| `TeammateIdle`   | Teammate is about to go idle             | Send feedback and keep teammate working     |
| `TaskCreated`    | A task is being created                  | Prevent creation and send feedback          |
| `TaskCompleted`  | A task is being marked complete          | Prevent completion and send feedback        |

Configure hooks in `~/.claude/settings.json` under the `hooks` key (see hooks documentation for structure).

---

## 12. Token Costs

Token usage scales **linearly** with the number of active teammates. Each has its own context window consuming tokens independently.

**Guidelines:**
- 3–5 teammates balances parallel work with manageable cost for most workflows
- Scale up only when parallel work genuinely benefits the task
- Three focused teammates often outperform five scattered ones
- For routine tasks, a single session is more cost-effective

See the [agent team token costs](https://code.claude.com/docs/en/costs#agent-team-token-costs) page for detailed usage guidance.

---

## 13. Best Practices

### Give teammates enough context at spawn time
Teammates don't inherit the lead's conversation history. Be explicit in the spawn prompt:

```
Spawn a security reviewer teammate with the prompt: "Review the authentication
module at src/auth/ for security vulnerabilities. Focus on token handling,
session management, and input validation. The app uses JWT tokens stored in
httpOnly cookies. Report any issues with severity ratings."
```

### Choose appropriate team size
- Start with **3–5 teammates** for most workflows
- Scale up only when genuinely warranted
- Aim for **5–6 tasks per teammate**

### Make teammates adversarial for investigation tasks
When root cause is unclear, assign teammates competing hypotheses and have them actively try to disprove each other's theories. The surviving theory is more likely correct.

### Avoid file conflicts
Two teammates editing the same file leads to overwrites. Break work so each teammate owns a distinct set of files.

### Pre-approve common permissions
Pre-approve expected operations in permission settings before spawning to reduce permission prompt interruptions.

### Start with research and review
If new to agent teams, begin with tasks that have clear boundaries and don't require writing code: reviewing a PR, researching a library, investigating a bug.

### Monitor and steer
Check in on progress, redirect approaches that aren't working, synthesize findings as they arrive. Don't let a team run unattended too long.

### If the lead starts doing work instead of delegating
```
Wait for your teammates to complete their tasks before proceeding
```

### Use CLAUDE.md for project-wide guidance
Teammates read CLAUDE.md from their working directory normally. Use it to provide project-specific context all teammates will see automatically.

---

## 14. Use Case Examples

### Parallel code review

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

Why it works: each reviewer applies a different filter to the same PR. The lead synthesizes findings across all three. No overlap, no missed angles.

### Investigate with competing hypotheses

```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific debate.
Update the findings doc with whatever consensus emerges.
```

Why it works: sequential investigation suffers from anchoring — once one theory is explored, subsequent investigation is biased toward it. Active adversarial debate forces the strongest theory to survive.

### Explore new features from multiple angles

```
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

---

## 15. Troubleshooting

| Problem | Solution |
|---------|----------|
| Teammates not appearing | Press `Shift+Down` to cycle — they may be running but not visible. Also verify the task was complex enough to warrant a team. |
| Split panes not working | Run `which tmux` to verify installation. For iTerm2, confirm `it2` CLI is installed and Python API is enabled in preferences. |
| Too many permission prompts | Pre-approve common operations in permission settings before spawning teammates. |
| Teammate stopped on error | Check output with `Shift+Down` or pane click. Give additional instructions directly or spawn a replacement. |
| Lead shuts down before work is done | Tell it to keep going. Instruct it to wait for teammates before proceeding. |
| Orphaned tmux sessions | `tmux ls` to list, then `tmux kill-session -t <session-name>` |
| Task appears stuck | Check if work is actually done. Update task status manually or tell the lead to nudge the teammate. |

---

## 16. Known Limitations

| Limitation | Detail |
|------------|--------|
| No session resumption with in-process teammates | `/resume` and `/rewind` don't restore in-process teammates. After resuming, tell the lead to spawn new ones. |
| Task status can lag | Teammates sometimes fail to mark tasks complete, blocking dependents. Update manually if stuck. |
| Slow shutdown | Teammates finish their current request/tool call before shutting down. |
| One team per session | A lead can only manage one team at a time. Clean up before starting a new one. |
| No nested teams | Teammates cannot spawn their own teams or teammates. Only the lead can manage the team. |
| Fixed lead | The session that creates the team is lead for its lifetime. Leadership cannot be transferred. |
| Permissions set at spawn | All teammates start with lead's permission mode. Per-teammate modes can only be changed after spawning. |
| Split panes require tmux or iTerm2 | Not supported in VS Code integrated terminal, Windows Terminal, or Ghostty. |

---

## Quick Reference Card

```
ENABLE:     CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 in settings.json env
VERSION:    claude --version  (requires v2.1.32+)
NAVIGATE:   Shift+Down → cycle teammates | Ctrl+T → toggle task list
DISPLAY:    teammateMode: "in-process" | "tmux" | "auto"
TEAM SIZE:  3–5 teammates, 5–6 tasks per teammate
CLEANUP:    Always from the lead, never from a teammate
STORAGE:    ~/.claude/teams/{name}/config.json | ~/.claude/tasks/{name}/
HOOKS:      TeammateIdle | TaskCreated | TaskCompleted (exit 2 = block + feedback)
```
