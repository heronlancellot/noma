# Agent Teams — Patterns Reference

> Synthesized from a three-agent research session (Researcher · Strategist · Critic).
> Sections cover: Configuration Reference, Use Case Patterns, and Gaps & Recommendations.

---

## Table of Contents

1. [Configuration Reference](#1-configuration-reference)
2. [Use Case Patterns](#2-use-case-patterns)
3. [Gaps & Recommendations](#3-gaps--recommendations)

---

## 1. Configuration Reference

*Sourced from Researcher's full codebase + docs inventory, augmented with Critic-identified gaps.*

### 1.1 Enabling Agent Teams

Agent teams are an experimental feature. They must be explicitly enabled:

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or export in shell before launching:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

**Minimum version:** Claude Code v2.1.32+. Verify with `claude --version`.

---

### 1.2 Architecture

**Roles:**
- **Team lead** — the main session. Creates the team, spawns teammates, coordinates work, synthesizes results. Leadership cannot be transferred.
- **Teammates** — separate Claude Code instances, each with their own independent context window. They work, communicate, and claim tasks autonomously.

**Core infrastructure:**
- **Task list** — a shared list of work items that all teammates can read, claim, and update. Stored at `~/.claude/tasks/{team-name}/`.
- **Mailbox** — an asynchronous message-passing system for direct agent-to-agent communication. Messages are delivered automatically; no polling required.

**Storage locations:**

| Path | Purpose |
|---|---|
| `~/.claude/teams/{name}/config.json` | Team config: member names, agent IDs, agent types |
| `~/.claude/tasks/{name}/` | Shared task list directory |

> **Warning:** Do not hand-edit `config.json` — it is overwritten on every state update.
>
> **Note:** A `.claude/teams/teams.json` inside a *project* directory is NOT recognized as valid config. Config must live under `~/.claude/teams/`.

---

### 1.3 CLI Flags

| Flag | Effect |
|---|---|
| `--teammate-mode in-process` | Override display mode for this session |
| `--teammate-mode tmux` | Force tmux split panes for this session |
| `--dangerously-skip-permissions` | If set on the lead, **all teammates inherit it** |

> **Security note:** `--dangerously-skip-permissions` propagates silently to every teammate. There is no per-teammate audit trail or override. Use with extreme caution. See [§3.2](#32-underdocumented-security-risk---dangerously-skip-permissions) for recommendations.

---

### 1.4 Display Modes

Set persistently in `~/.claude/settings.json`:

```json
{ "teammateMode": "in-process" }
```

| Value | Behavior |
|---|---|
| `"in-process"` | All teammates run inside the main terminal |
| `"tmux"` | Each teammate gets its own split pane |
| `"auto"` | Split panes if inside a tmux session; otherwise in-process **(default)** |

**Override for a single session:**
```bash
claude --teammate-mode in-process
claude --teammate-mode tmux
```

**Split-pane prerequisites:**
- **tmux** — install via system package manager. On macOS with iTerm2, use `tmux -CC`.
- **iTerm2** — requires `it2` CLI and Python API enabled: Settings → General → Magic → Enable Python API.

**Not supported for split panes:** VS Code integrated terminal, Windows Terminal, Ghostty. Use `"in-process"` mode in those environments.

**In-process keyboard shortcuts:**

| Shortcut | Action |
|---|---|
| `Shift+Down` | Cycle through teammates (wraps back to lead) |
| `Enter` | View a teammate's session |
| `Escape` | Interrupt current turn |
| `Ctrl+T` | Toggle task list |

---

### 1.5 Task Management

**Task lifecycle:**

```
pending → in_progress → completed
```

| State | Meaning |
|---|---|
| `pending` | Not yet started; may be blocked by dependencies |
| `in_progress` | Claimed and actively worked on |
| `completed` | Done; dependent tasks automatically unblocked |

**Assignment patterns:**
- **Lead assigns** — lead tells a specific teammate to take a task by name.
- **Self-claim** — after finishing a task, a teammate auto-picks the next unassigned, unblocked task in ID order (lowest ID first — earlier tasks often provide context for later ones).

**Race condition protection:** File locking prevents two teammates from claiming the same task simultaneously.

**Sizing guidance:**
- Tasks too small → coordination overhead exceeds benefit.
- Tasks too large → long gaps between check-ins, wasted effort risk.
- Recommended ratio: **5–6 tasks per teammate**.

> **Known gap:** Crashed-teammate task recovery is undocumented. If a teammate crashes mid-task, there is no documented mechanism to detect the crash, recover the task to `pending`, or reassign it. See [§3.4](#34-task-system-failure-modes).

---

### 1.6 Communication Between Agents

- Messages are delivered automatically — no polling or inbox-checking needed.
- **Idle notifications** — a teammate automatically notifies the lead when their turn ends.
- **Targeted messaging** — send to one specific teammate by name. There is no single broadcast-all mechanism; send one message per intended recipient.
- **Teammate context isolation** — teammates do NOT inherit the lead's conversation history. Each teammate's context comes from: the spawn prompt, CLAUDE.md in the project directory, any MCP servers, and skills in the working directory.

> **Best practice:** Use CLAUDE.md as a shared context mechanism. It is the primary way to give all teammates common background without repeating it in every spawn prompt. (This is currently buried in Best Practices in the reference docs — it should be treated as a primary pattern, not an afterthought.)

---

### 1.7 Permissions Behavior

- Teammates start with the **lead's permission settings** at spawn time.
- `--dangerously-skip-permissions` on the lead **propagates to all teammates**.
- Per-teammate permission modes **can** be changed after spawning (via natural language to the lead).
- Per-teammate modes **cannot** be set at spawn time.

**Subagent definitions as teammates:**
- Reference a named subagent type to reuse role definitions (tools allowlist, model).
- The definition body appends to the teammate's system prompt — it does not replace it.
- `SendMessage` and task management tools are always available, even when `tools` restricts others.
- **Exception:** `skills` and `mcpServers` frontmatter fields in subagent definitions are NOT applied when running as a teammate. Those load from project/user settings instead.

---

### 1.8 Hooks — Quality Gates

Hooks are configured in `~/.claude/settings.json` under the `hooks` key. They are **static shell scripts** — not Claude agent instances. They execute synchronously at the named event.

| Event | Trigger | Exit code 2 effect |
|---|---|---|
| `TeammateIdle` | Teammate about to go idle | Block idle, send feedback, keep teammate working |
| `TaskCreated` | A task is being created | Prevent creation, send feedback to creator |
| `TaskCompleted` | A task is being marked complete | Prevent completion, send feedback to completer |

**Exit code semantics:**
- Exit `0` — allow the action to proceed.
- Exit `2` — block the action and return the hook's stdout to the agent as feedback.

> **Critical gap:** No example hook configuration exists in the docs. No payload schema is documented. There is no specification of what data the hook script receives (environment variables? stdin JSON?). Additionally, no hooks exist for teammate spawn, teammate shutdown, or team cleanup lifecycle events. See [§3.1](#31-hooks-critically-incomplete) for recommendations.

---

### 1.9 Plan Approval Flow

1. Teammate works in read-only plan mode.
2. Teammate sends a `plan_approval_request` to the lead.
3. Lead approves or rejects with feedback.
4. If rejected: teammate revises and resubmits.
5. Once approved: teammate exits plan mode and begins implementation.

---

### 1.10 Shutdown & Cleanup

- **Shutdown** — lead sends a `shutdown_request` to a teammate. Teammate approves (graceful exit) or rejects with explanation. Teammate finishes its current request/tool call before exiting.
- **Cleanup** — always done from the lead, never from a teammate. **Cleanup fails if any teammates are still running** — shut them all down first.

> **Known gap:** No documentation exists for partial cleanup state. If cleanup is interrupted mid-run, there is no guidance on how to identify and clean up residual state. See [§3.7](#37-cleanup-failure-modes).

---

### 1.11 Token Costs

- Usage scales **linearly** with number of active teammates. Each teammate has its own independent context window.
- Agent teams are significantly more expensive than a single session or subagents.
- Recommended team size: **3–5 teammates** for most workflows.
- Single session or subagents are more cost-effective for routine, sequential tasks.

> **Known gap:** No worked example or order-of-magnitude estimate exists. The "5–6 tasks per teammate" ratio has no cited empirical basis. See [§3.6](#36-token-cost-section-has-no-actionable-numbers).

---

### 1.12 Agent Teams vs. Subagents

| Dimension | Subagents | Agent Teams |
|---|---|---|
| Context | Own context; results return to caller | Own context; fully independent |
| Communication | Report to main agent only | Teammates message each other directly |
| Coordination | Main agent manages all work | Shared task list with self-coordination |
| Persistence | Scoped to one call | Scoped to one session (not cross-session) |
| Best for | Focused tasks where only the result matters | Complex work requiring peer collaboration |
| Token cost | Lower | Higher |

---

### 1.13 Known Limitations

| Limitation | Detail |
|---|---|
| No session resumption | `/resume` and `/rewind` do not restore in-process teammates |
| Task status lag | Teammates sometimes fail to mark tasks complete; update manually if stuck |
| Slow shutdown | Teammate finishes current request/tool call before exiting |
| One team per session | Lead can only manage one team at a time; clean up before starting a new one |
| No nested teams | Teammates cannot spawn their own teams or sub-teammates |
| Fixed lead | Leadership cannot be transferred to a teammate |
| Permissions set at spawn | Per-teammate modes only configurable after spawning, not before |
| Split-pane terminal limits | Not supported in VS Code integrated terminal, Windows Terminal, Ghostty |

---

### 1.14 Quick Reference

```
ENABLE:     CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 (settings.json env)
VERSION:    claude --version  (requires v2.1.32+)
NAVIGATE:   Shift+Down → cycle teammates  |  Ctrl+T → toggle task list
DISPLAY:    teammateMode: "in-process" | "tmux" | "auto"
TEAM SIZE:  3–5 teammates, ~5–6 tasks per teammate
CLEANUP:    Always from the lead, never from a teammate
STORAGE:    ~/.claude/teams/{name}/config.json
            ~/.claude/tasks/{name}/
HOOKS:      TeammateIdle | TaskCreated | TaskCompleted  (exit 2 = block + feedback)
HOOKS ARE:  Static shell scripts — not agent instances
```

---

## 2. Use Case Patterns

*Sourced from Strategist's use cases, corrected and refined by Critic's review.*

---

### Use Case 1 — Full-Stack Feature Shipping with Parallel Layer Ownership

**Scenario:** Ship a new feature (e.g., "user notifications") spanning database schema, API endpoints, frontend components, and tests — all in one sprint.

**Why agent teams beat alternatives:**
- A single session context-switches between layers, losing depth on each.
- Serial subagents miss natural parallelism (backend and frontend can proceed simultaneously once an API contract is locked).
- Agent teams let each layer owner hold persistent, deep context about their slice.

**Recommended team structure (3–4 teammates + lead):**
- **Lead** — drafts the API contract, coordinates synchronization points, resolves interface mismatches.
- **Backend Agent** — schema migration + API endpoints.
- **Frontend Agent** — components + state management.
- **Test Agent** — integration/e2e tests written against the contract spec.
- *(DevOps changes are small enough for the lead or a late-stage subagent — a full DevOps teammate is over-engineered for most features.)*

**Expected workflow:**
1. Lead drafts and locks the API contract (request/response shapes). **This is a hard synchronization point** — parallel work should not start until the contract is finalized.
2. Backend and Frontend agents begin in parallel, each owning distinct files (no merge conflicts).
3. Test Agent writes test stubs and schema validators against the contract spec in parallel; **full integration test execution must wait until implementation is complete** — this is a sequential dependency, not true parallelism.
4. Lead reviews each agent's output, resolves any interface mismatches, and merges.

**Pitfalls:**
- If the API contract needs revision mid-work, all parallel agents must pause and re-sync. Build in an explicit contract review checkpoint before claiming parallelism.
- Teammates do not inherit the lead's codebase context. Give each agent explicit file paths and module boundaries in their spawn prompt.

---

### Use Case 2 — Security Audit with Adversarial Sub-Teams *(recommended)*

**Scenario:** Pre-launch security audit of authentication, payment processing, and data storage — reviewed simultaneously from multiple threat model angles.

**Why agent teams beat alternatives:**
- Serial review of three modules takes hours and builds context bloat.
- Subagents launched independently miss the adversarial dynamic: one agent's finding should immediately inform another's probe.
- Agent teams enable real cross-agent challenge ("Auth agent: does the session token expire after payment initiation?").

**Recommended team structure (5 teammates + lead):**
- **Lead** — scopes audit, triages findings, writes final risk-ranked report.
- **Auth Auditor** — authentication flows, session handling, token storage.
- **Payment Auditor** — payment processing, input validation, PCI surface.
- **Storage Auditor** — data-at-rest encryption, PII handling, DB permissions.
- **Threat Synthesizer** — correlates findings across modules; identifies cross-cutting attack chains.

**Expected workflow:**
1. Lead spawns all auditors with explicit file paths and module boundaries in each spawn prompt.
2. Lead also spawns Threat Synthesizer with **full context about all modules** at spawn time (not just partial results as they arrive). This is required for meaningful cross-module correlation.
3. Auditors work in parallel, each messaging Threat Synthesizer as they complete sections.
4. Threat Synthesizer identifies cross-module attack chains, messages targeted follow-up questions back to specific auditors.
5. Auditors do targeted follow-ups; Synthesizer assembles a unified threat model.
6. Lead collects all threads, produces final risk-ranked report.

**Pitfalls:**
- Define a deduplication mechanism for overlapping findings (e.g., both Auth and Payment auditors flag the same shared utility). Assign module boundaries strictly at spawn time.
- Threat Synthesizer's spawn prompt must include full module context — relying solely on incremental messages produces shallow correlation.

---

### Use Case 3 — Multi-Hypothesis Incident Response *(recommended)*

**Scenario:** A nightly ETL pipeline has failed silently for 3 nights. Root cause unknown — could be source schema drift, transformation logic bugs, or infrastructure/resource limits. Every hour of uncertainty costs downstream dashboards.

**Why agent teams beat alternatives:**
- A single session investigating all three hypotheses serially could take hours; during an incident, speed matters.
- Each hypothesis requires deep, persistent context about a different part of the stack — a subagent launched and dismissed loses that context.
- Agent teams allow all three hypotheses to be investigated simultaneously with findings messaged to a coordinator in real time.

**Recommended team structure (4 teammates + lead):**
- **Lead** — incident commander. Coordinates investigation, owns the fix decision.
- **Schema Investigator** — source system schema change logs, diffs against last known-good run.
- **Logic Investigator** — transformation scripts, dbt models, test coverage gaps.
- **Infra Investigator** — resource utilization, job scheduler logs, dependency failures.

**Expected workflow:**
1. Lead briefs all three investigators simultaneously with incident symptoms and timeline.
2. All three investigate in parallel, each holding deep context about distinct logs, configs, and codebases.
3. Investigators message the lead as soon as they can confirm or rule out their hypothesis.
4. Lead narrows the search in real time, can redirect an investigator to assist a more promising thread.
5. Once root cause is identified, lead shuts down investigators, then spawns a Fix Agent and Test Agent (in a new team if needed — note the one-team-per-session constraint).

**Pitfalls:**
- Spawning a Fix Agent + Test Agent after root cause identification conflicts with the one-team-per-session constraint if investigators are still running. **Shut down all investigators explicitly before starting a fix team.**
- The context handoff from investigation findings to the Fix Agent spawn prompt is non-trivial — include all relevant findings explicitly in the spawn prompt, not just a summary.

> *Note: This replaces the original "Multi-Source Research Synthesis" use case, which the Critic identified as better suited to subagents (read-only parallel work with no peer-to-peer coordination is the subagent pattern, not an agent team advantage). Use subagents when researchers don't need to adversarially challenge each other's findings.*

---

### Use Case 4 — Documentation Quality Gate with Peer Validation *(corrected model)*

**Scenario:** A large open-source project has 200+ public API functions. Every merged PR may change function signatures or deprecate methods — documentation must stay in sync.

**Why agent teams beat alternatives:**
- Doc agents need peer challenge, not just completion. A single-pass doc update misses gaps that a second agent reviewing the output would catch.
- Subagents with no quality enforcement can mark tasks complete with incomplete docs.
- Agent teams support a peer validation model where a Validator teammate explicitly blocks completion until coverage is confirmed.

**Recommended team structure (3 teammates + lead):**
- **Lead** — triages incoming PRs, assigns modules to doc agents, final reviewer.
- **Doc Agent A** — owns API reference docs for a defined module range.
- **Doc Agent B** — owns API reference docs for a separate module range (no file conflicts).
- **Validator Agent** — receives a message from a doc agent when they believe their work is complete; reviews for missing params, broken examples, deprecated-but-not-flagged methods; replies with approval or a specific list of gaps to address.

**Expected workflow:**
1. Lead receives PR diff, splits changed modules between Doc Agent A and B.
2. Agents update docs in parallel (no file conflicts — each owns distinct modules).
3. When a doc agent believes their section is complete, they **message Validator Agent directly** — not via a hook.
4. Validator reviews and either approves or replies with specific gaps to address.
5. Doc agent revises and re-messages Validator. Repeat until Validator approves.
6. Doc agent marks their task complete only after Validator approval.

**Pitfalls:**
- **Hooks are shell scripts, not agent instances.** Do not design the Validator as a hook — hooks cannot read docs, assess coverage, or engage in back-and-forth. Peer messaging is the correct mechanism.
- Agent teams are **session-scoped** — this pattern applies within a single work session, not as a persistent process across separate PR events. For continuous CI-style enforcement, this requires a different architecture.

---

### Use Case 5 — Full-Stack Feature Shipping with Competing Approaches *(adversarial variant)*

**Scenario:** An engineering team is choosing between two architectural approaches for a critical new module (e.g., event-driven vs. request-response for a notifications system). They want both approaches prototyped and stress-tested before committing.

**Why agent teams beat alternatives:**
- A single session can only hold one deep implementation context at a time.
- Subagents launched serially can prototype both, but can't challenge each other's assumptions.
- Agent teams allow both prototypes to develop in parallel, with an explicit Critic role that stress-tests both and forces a comparison.

**Recommended team structure (4 teammates + lead):**
- **Lead** — defines requirements and constraints, facilitates comparison, makes final call.
- **Approach A Agent** — implements and documents the event-driven approach.
- **Approach B Agent** — implements and documents the request-response approach.
- **Critic Agent** — receives both implementations, stress-tests against edge cases, identifies failure modes, produces a head-to-head comparison.

**Expected workflow:**
1. Lead defines shared requirements (performance targets, failure tolerance, operational complexity constraints) and sends to both approach agents.
2. Approach A and B agents implement in parallel, each in isolated directories or branches.
3. Both send their completed implementations and rationale to the Critic.
4. Critic produces a structured comparison: strengths, weaknesses, edge case behavior, operational risk.
5. Critic sends comparison to the lead. Lead makes the architectural decision with full adversarial evidence.

**Pitfalls:**
- Give each approach agent its own file directory at spawn time to prevent overwrites.
- The Critic needs full context of both implementations — include file paths explicitly in the spawn prompt, not just summaries.
- Token cost is high (4 full context windows + implementation work). Only worthwhile for genuinely high-stakes architectural decisions.

---

## 3. Gaps & Recommendations

*Sourced from Critic's structured review. Each gap includes a priority rating and a recommended doc change.*

---

### 3.1 Hooks: Critically Incomplete

**Priority: High**

The hooks section names three events and their exit code semantics, but provides no:
- Example hook configuration in `settings.json`
- Payload schema (what data does the shell script receive? Environment variables? stdin JSON?)
- Feedback mechanism specification (how does the hook's stdout reach the agent?)
- Lifecycle hooks for: teammate spawn, teammate shutdown, or team cleanup

**Recommended additions:**
1. Add a worked example — a `TaskCompleted` hook that rejects tasks missing a "test coverage" field.
2. Document the full payload each hook event delivers to the script.
3. Clarify the feedback path: does the script write to stdout? Does it set a specific env var?
4. Either add spawn/shutdown/cleanup hooks, or explicitly document that they don't exist and explain the consequence.

---

### 3.2 Underdocumented Security Risk: `--dangerously-skip-permissions`

**Priority: High**

The current docs mention this flag but treat it as a configuration note. It warrants a dedicated callout:
- No warning that the flag propagates silently to all teammates.
- No guidance on auditing teammate permission states after the fact.
- No documentation of the post-spawn permission change mechanism (the only mitigation).

**Recommended additions:**
1. Add a `> Warning:` callout block explaining silent propagation to all teammates.
2. Document the post-spawn mechanism for restricting individual teammates.
3. Recommend using `--dangerously-skip-permissions` only in isolated, auditable environments.

---

### 3.3 Context Propagation: No Structured Guidance

**Priority: High**

"Be explicit in the spawn prompt" is the only documented mechanism for context sharing. The docs bury `CLAUDE.md` as shared context in Best Practices rather than surfacing it as the **primary solution** for cross-teammate context.

**Recommended additions:**
1. Promote `CLAUDE.md`-as-shared-context to a dedicated section, not a Best Practices aside.
2. Add a structured spawn prompt template showing: project context, role, owned files/modules, known teammate roles.
3. Document the precedence order for context loading (spawn prompt → CLAUDE.md → project MCP servers → skills).

---

### 3.4 Task System Failure Modes

**Priority: High**

Three critical scenarios are completely undocumented:
- **Crashed-teammate task recovery** — if a teammate crashes mid-task, there is no documented mechanism to detect the crash, recover the task to `pending`, or reassign it.
- **File lock timeout/deadlock** — the file locking mechanism for race condition protection has no documented timeout or deadlock behavior.
- **Task state persistence across session resume** — it is unclear whether task state survives a `/resume`.

**Recommended additions:**
1. Document the manual recovery path for crashed-teammate tasks (lead manually calls `TaskUpdate` to reset status and reassign).
2. Specify lock timeout behavior, or document that it is undefined and advise avoiding concurrent task claims on the same task.
3. Explicitly document whether `~/.claude/tasks/{name}/` persists across session resume and what state is recoverable.

---

### 3.5 `"tmux"` Display Mode Value Not Named in Prose

**Priority: Medium**

Section 6 of the reference describes split-pane behavior in full but never gives the canonical `settings.json` string value. The value `"tmux"` only appears in the Quick Reference Card.

**Recommended fix:** Name the canonical value explicitly in the Display Modes section prose, not only in the reference card.

*(This document corrects this — see [§1.4](#14-display-modes).)*

---

### 3.6 Token Cost Section Has No Actionable Numbers

**Priority: Medium**

The current docs recommend 3–5 teammates and cite "5–6 tasks per teammate" with no empirical basis or worked example. There is no order-of-magnitude estimate (e.g., "a 4-teammate session for a 2-hour task costs approximately N tokens").

**Recommended additions:**
1. Add a worked example: a 3-teammate session on a representative task with approximate token counts per role.
2. Either cite the source for the "5–6 tasks per teammate" ratio or reframe it as a rule of thumb.
3. Add qualitative decision guidance: "if the task fits in one session without context bloat, use a single session."

---

### 3.7 Cleanup Failure Modes

**Priority: Medium**

The docs say "cleanup fails if any teammates are still running" but do not document:
- How to identify which teammates are still running after an unexpected lead exit.
- What partial cleanup state looks like and how to resolve it.
- Whether `~/.claude/tasks/{name}/` directories are cleaned up automatically or require manual removal.

**Recommended additions:**
1. Document a cleanup checklist: verify all teammates are shut down, then run cleanup from the lead.
2. Document manual cleanup path: what files to remove if the lead session exits uncleanly.
3. Clarify automatic vs. manual task directory cleanup.

---

### 3.8 Multi-Phase Team Handoff: No Documented Pattern

**Priority: Medium**

The one-team-per-session constraint means multi-phase work (team A investigates → team B implements) has no documented pattern. This is a real operational gap for any workflow longer than a single work session.

**Recommended additions:**
1. Document the explicit handoff pattern: shut down team A, capture findings in a handoff document (or CLAUDE.md), then start a new session and spawn team B with the handoff doc in the spawn prompt.
2. Acknowledge that task state from team A does not automatically transfer to team B.
3. Consider this a known architectural limitation and flag it clearly for users planning multi-phase workflows.

---

### 3.9 Cross-Cutting Use Case Pitfalls

*Additional gaps identified by Critic that apply across all use cases.*

**Token cost not addressed in use case guidance:**
No use case includes even qualitative cost guidance. For production teams, token cost is a primary decision factor — every use case should include a rough cost tier (low / medium / high) and a "when the cost is worth it" statement.

**Display mode assumptions:**
Several patterns implicitly assume split-pane monitoring is available. This is unsupported in VS Code integrated terminal, Windows Terminal, and Ghostty. Use cases should note the `"in-process"` fallback explicitly.

**Lead drift:**
The docs warn that leads can start doing implementation work instead of delegating. None of the documented use case workflows include a mitigation step. Recommended: add a "lead health check" prompt to each workflow — a periodic step where the lead verifies they are coordinating, not implementing.

**Session resumption risk:**
In-process teammates are not restored on `/resume`. Long-running use cases (full-stack feature shipping, documentation maintenance) have a significant operational gap: if the session exits unexpectedly, all teammate context is lost. This should be called out explicitly in those use cases.

---

*Document generated 2026-05-07 by research-team (Researcher, Strategist, Critic).*
