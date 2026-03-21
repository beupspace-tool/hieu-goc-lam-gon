# Claude Code Quick Reference Card

**This is a companion to the full research report.** Print this or bookmark it for daily use.

---

## ACTIVATION & MODES

```bash
claude                              # Start default (prompts for actions)
claude --auto-accept-edits          # Skip file edit prompts
claude --dangerously-skip-permissions # Skip all prompts (use in sandbox only)

/plan                               # Enter plan mode
Shift+Tab Shift+Tab                 # Keyboard: enter plan mode
/clear                              # Start fresh conversation
/compact                            # Summarize & compress context
/compact focus on the API changes   # Custom focus for compact
/cost                               # Check token usage
/effort low|medium|high             # Control thinking depth
/config                             # Adjust settings
```

---

## KEYBOARD SHORTCUTS (Builder.io)

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Stash prompt; ask quick question; stash restores |
| Ctrl+B | Send long bash command to background; Claude continues working |
| Shift+Tab Shift+Tab | Enter plan mode |
| `!command` | Run bash command immediately in context |
| `cc` | Alias for `claude` (skip permission prompts) |

---

## PERMISSION MODES AT A GLANCE

| Mode | File Edits | Bash | Tools | Use Case |
|------|-----------|------|-------|----------|
| **Default** | Ask | Ask | Ask | Learning, new code |
| **AcceptEdits** | Auto | Ask | Ask | Prototyping |
| **Plan** | Block | Block | Block | Design review |
| **BypassPermissions** | Auto | Auto | Auto | High-speed, parallel agents |

**Warning:** BypassPermissions inherits to subagents; can't be overridden.

---

## PLAN MODE DECISION TREE

```
Is change describable in 1 sentence?
├─ YES → Skip plan mode, just code
└─ NO
    ├─ Multi-file? → USE PLAN MODE
    ├─ Unfamiliar code? → USE PLAN MODE
    ├─ Architectural? → USE PLAN MODE
    └─ Refactor? → USE PLAN MODE (2-3 iterations typical)
```

**Pro flow:** Approve plan → `--auto-accept-edits` → Usually 1-shot from there

---

## /COMPACT IN 30 SECONDS

```bash
# When approaching context limit (proactively, not in degraded state)
/compact

# Custom focus
/compact focus on the API changes

# Result: 60-80% token reduction (150K → 30-50K typical)
```

**Why manual?** When you still have headroom, Claude provides better summaries.

---

## TOKEN COST HIERARCHY (Cheapest → Most Expensive)

| Model | Speed | Cost | Use Case |
|-------|-------|------|----------|
| **Haiku** | Fastest | ~$0.80/1M in | Quick syntax, simple edits |
| **Sonnet** | Fast | ~$3/1M in | Code implementation |
| **Opus** | Slower | ~$15/1M in | Architecture, planning, thinking |

**Strategy:** Opus for planning (thinking enabled) → Sonnet for code → Haiku for routine

---

## REAL COST NUMBERS

| Scenario | Daily Cost | Monthly Cost | Annual Cost |
|----------|-----------|--------------|------------|
| 10B tokens on API | ~$40 | ~$1,250 | ~$15K |
| Claude Max plan | ~$3 | ~$100 | ~$1,200 |
| **Savings** | **93%** | **92%** | **92%** |

**Point:** Max plan ($100/mo) pays for itself in <2 working days for heavy users.

---

## CLAUDE.MD TEMPLATE (Under 60 Lines Ideal)

```markdown
# Project: [Name]

## Quick Facts
- **Stack:** [Languages, frameworks]
- **Key Dependencies:** [Critical libs]
- **Team Size:** [If relevant]

## Architecture
- `src/` → [purpose]
- `tests/` → [purpose]
- `docs/` → [purpose]

## Code Rules
- Naming: camelCase for variables, PascalCase for classes
- Line length: 100 chars max
- Always write tests before PRs
- Security: Validate all user input

## How to Work Here
1. Create a feature branch: `git checkout -b feature/[name]`
2. Always run `npm test` before pushing
3. Use Plan Mode for multi-file changes

## Commands
- `npm run dev` → Start dev server
- `npm test` → Run tests
- `npm run lint` → Check style

## Important
- `.env.local` is local-only; never commit
- Breaking changes need RFC (see docs/rfc-template.md)
```

---

## MCP SETUP CHEAT SHEET

```bash
# Add Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Add Slack with auth
claude mcp add --transport sse slack --header "Authorization: Bearer YOUR_TOKEN"

# Add Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse

# List all configured MCPs
claude mcp list

# Test MCP connection
claude mcp test notion
```

**Check in `.mcp.json` to git** (like Boris does with Slack MCP for team sharing)

---

## HOOKS: THE 5 PRODUCTION PATTERNS

```bash
# Location: .claude/hooks/ or hooks.json in .claude/

# 1. Auto-Formatter (PostToolUse)
Prettier/Black runs after every file edit

# 2. Security Gate (PreToolUse)
Block edits to main branch

# 3. Test Enforcement (PostToolUse)
npm test / pytest on modified files

# 4. Notification (PostToolUse)
Slack message when PR pushed

# 5. Pre-commit Quality (PreEditorSave)
Lint check, abort if fails
```

---

## CUSTOM SLASH COMMANDS

```bash
# Location: .claude/commands/

# Create: .claude/commands/my-command.md
# Name: my-command
# Pattern: /my-command [args]

# Files in this directory auto-complete with `/`
# Share in git; team gets them automatically
```

**Example (from Boris):** `/commit-push-pr` used dozens of times daily

---

## GIT WORKTREES FOR PARALLEL AGENTS

```bash
# Create worktree for each agent
git worktree add worktree-feature-a feature-a-branch
git worktree add worktree-feature-b feature-b-branch

# Each agent gets:
# - Own branch
# - Own filesystem state
# - Own Claude Code session
# → NO MERGE CONFLICTS

# Clean up when done
git worktree remove worktree-feature-a
```

---

## EXTENDED THINKING BUDGET (Adaptive)

```bash
# Modern approach (Opus 4.6, Sonnet 4.6)
/effort low        # Minimal thinking
/effort medium     # Balanced
/effort high       # Deep reasoning

# Legacy approach (Opus 4.5)
MAX_THINKING_TOKENS=1024   # Minimum (cheap)
MAX_THINKING_TOKENS=8000   # Simple tasks (good default)
MAX_THINKING_TOKENS=100000 # Complex reasoning (expensive)
```

**Cost note:** Thinking tokens billed as output; default can be tens of thousands.

---

## CONVERSATION HISTORY LOCATION

```bash
~/.claude/projects/
  ├── project-a---main/          # Folder: project path with dashes
  │   ├── .claude-session-1.json
  │   └── .claude-session-2.json
  └── project-b---feature-x/
      └── .claude-session-1.json
```

**Note:** Each session stored locally; no cloud sync unless you use claude.ai/code

---

## SPEED TRICKS FROM MILES DEUTSCHER

| Trick | Benefit |
|-------|---------|
| `cc` instead of `claude` | Skip permission prompts |
| `!npm test` in prompt | Command runs immediately; result in context |
| Ctrl+S → quick question → stash restores | Non-blocking follow-ups |
| Ctrl+B for long bash | Command backgrounded; Claude keeps working |
| `/clear` between projects | Don't waste tokens on stale context |

---

## REAL WORKFLOW EXAMPLE (FROM BORIS)

```
1. `claude` → Enter plan mode (Shift+Tab twice)
2. Describe feature
3. Claude creates plan
4. Review 2-3 times, refine
5. Approve plan
6. `claude --auto-accept-edits` → Switch to accept mode
7. Claude usually 1-shot the implementation
8. `/commit-push-pr` (custom slash command)
```

**Time:** 15-30 min per feature
**Sessions in parallel:** 5-10 concurrently

---

## SUBAGENT DELEGATION PATTERN

```bash
# Don't do expensive operations in main conversation
# Delegate to subagent:

# Example: Test runner consumes verbose output
# Instead of loading full test logs in context:
1. Spawn tester subagent
2. Tester runs full test suite (verbose logs in subagent context only)
3. Tester summarizes: "3 failed tests: test-A (login), test-B (API), test-C (forms)"
4. Summary returns to main conversation
5. You fix issues; summary updates

# Result: Main context stays clean; you keep focus
```

---

## PERMISSION ESCALATION FLOW

```
Default (prompts for everything)
    ↓ (if comfortable, and you review every action)
AcceptEdits (auto-approve file edits; bash still prompts)
    ↓ (if on isolated feature branch or container)
BypassPermissions (everything auto; subagents inherit)
    ↓ (ONLY in sandboxed/containerized environment)
```

**Never skip steps.** Each level requires earned trust.

---

## COST OPTIMIZATION DECISION

```
Every prompt, ask yourself:

1. Do I need Opus (thinking)?
   └─ YES if: Planning, architecture, complex reasoning
   └─ NO → Use Sonnet or Haiku

2. Can /compact save tokens now?
   └─ YES if: Multi-turn conversation, approaching 150K context
   └─ Run it

3. Should this be a subagent?
   └─ YES if: Tests, log analysis, API calls, docs fetching
   └─ Delegate it

4. Use Batch API?
   └─ YES if: Non-urgent; 50% discount worth the wait
   └─ Schedule it
```

---

## RED FLAGS & GOTCHAS

| Flag | Meaning | Action |
|------|---------|--------|
| "Context approaching limit" | 70-80% filled | `/compact` now (not later) |
| "AI output superficially works" | Subtle bugs likely | Always test before merge |
| "Plan mode didn't resolve ambiguity" | Unclear requirements | Ask clarifying questions first |
| "Same error in every session" | Persistent issue | Check CLAUDE.md for conflicts |
| "Subagent inheriting BypassPermissions" | Security risk | Never use BypassPermissions globally |

---

## LINKS TO BOOKMARK

| Resource | URL | Use |
|----------|-----|-----|
| Official Docs | https://code.claude.com/docs/en/overview | Canonical reference |
| ClaudeLog | https://claudelog.com/ | Community knowledge |
| Awesome List | https://github.com/hesreallyhim/awesome-claude-code | Directory of skills/hooks/commands |
| YK's Tips | https://github.com/ykdojo/claude-code-tips | 45 practical tricks |
| Boris's Blog | https://boristane.com/blog/how-i-use-claude-code/ | Creator's actual workflow |
| Ultimate Guide | https://github.com/FlorianBruniaux/claude-code-ultimate-guide | Complete learning path |
| Cost Docs | https://code.claude.com/docs/en/costs | Token pricing & savings |

---

## THE 3-MINUTE MENTAL MODEL

Claude Code works best when you:

1. **Plan first** (never jump to code)
2. **Manage context** (/compact when needed, /clear between unrelated work)
3. **Use the right tool** (Opus for thinking, Sonnet for code, Haiku for routine)
4. **Automate repetition** (hooks, commands, skills; check into git)
5. **Delegate expensive ops** (tests, logs, docs fetching → subagents)
6. **Review everything** (AI is a pair programmer, not autonomous)
7. **Save aggressively** (Plan Mode + /compact + model selection = 92% cost reduction)

**Result:** 100+ PRs/week, $100/month, zero token waste.

---

**Print this. Bookmark ClaudeLog. Join r/ClaudeAI. You're now ready.**
