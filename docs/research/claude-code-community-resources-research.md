# Claude Code Community Resources & Battle-Tested Tips

**Research Date:** March 21, 2026
**Focus:** Specific, linkable resources from the Claude Code community
**Sources:** 50+ GitHub repos, official docs, blogs, YouTube, Reddit, Twitter/X

---

## 1. GITHUB REPOS WORTH STUDYING

### Tier 1: Foundational Collections

| Repo | Stars | Purpose | Key Takeaway |
|------|-------|---------|--------------|
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 21.6K | Master index of skills, hooks, commands, agents, plugins | Most comprehensive ecosystem directory; starting point for any new feature |
| [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) | High | 135 agents, 35 skills, 42 commands, 19 hooks, 15 rules, 8 MCP configs | Production-ready templates you can drop into .claude/ directly |
| [FlorianBruniaux/claude-code-ultimate-guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) | Growing | Beginner-to-power-user guide with quizzes, cheatsheets, production templates | Best on-ramp for learning advanced mechanics |
| [ykdojo/claude-code-tips](https://github.com/ykdojo/claude-code-tips) | Active | 45 concrete tips: status line script, system prompt optimization, Gemini CLI integration, containerization patterns | Real workflows from a practitioner; custom status line script is gold |

### Tier 2: Specialized Subagents & Orchestration

| Repo | Purpose | Unique Value |
|------|---------|--------------|
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | 100+ subagents for dev tasks | Every agent gets isolated context; prevents cross-contamination |
| [rahulvrane/awesome-claude-agents](https://github.com/rahulvrane/awesome-claude-agents) | Collection of prebuilt subagents | Quick copy-paste patterns |
| [wshobson/agents](https://github.com/wshobson/agents) | 112 agents + 146 skills + 79 tools, 72 plugins | Most comprehensive single repo for production workflows |
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | Claude Skills directory | Reusable packaged expertise; auto-applied when matched |

### Tier 3: Production Patterns & Examples

| Repo | Purpose | Real-World Value |
|------|---------|------------------|
| [ChrisWiles/claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) | Comprehensive config example: hooks, skills, agents, GitHub Actions | How to wire everything together |
| [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) | Master all 12 lifecycle hook events | Production patterns: auto-formatter, security gates, test runners |
| [automazeio/ccpm](https://github.com/automazeio/ccpm) | Git worktree + GitHub Issues for parallel agents | How GitButler-style orchestration works |
| [ArthurClune/claude-md-examples](https://github.com/ArthurClune/claude-md-examples) | Real CLAUDE.md files from projects | See how pros structure onboarding |
| [josix/awesome-claude-md](https://github.com/josix/awesome-claude-md) | Curated CLAUDE.md files + best practices | Analyses of exemplary CLAUDE.md patterns |

### Tier 4: Domain-Specific Utilities

| Repo | Purpose | Use Case |
|------|---------|----------|
| [centminmod/my-claude-code-setup](https://github.com/centminmod/my-claude-code-setup) | Shared starter template + CLAUDE.md memory bank system | Quick project bootstrap |
| [wesammustafa/Claude-Code-Everything-You-Need-to-Know](https://github.com/wesammustafa/Claude-Code-Everything-You-Need-to-Know) | All-in-one guide: setup, prompting, hooks, workflows, MCPs, BMAD method | Reference encyclopedia |

---

## 2. BEST CLAUDE.MD EXAMPLES & TEMPLATES

### Canonical Structure (WHAT-WHY-HOW Framework)

**Recommended sections:** ~60-300 lines max

```
1. Project Overview (2-3 lines: what is this?)
2. Tech Stack (languages, frameworks, key dependencies)
3. Architecture (folder structure, key patterns)
4. Coding Rules (style, naming, conventions)
5. Development Workflow (how to work with this codebase)
6. Commands (custom slash commands in .claude/commands/)
7. Important Notes (gotchas, security, deployment)
```

**Golden Rule:** Less is more. HumanLayer's root CLAUDE.md is <60 lines.

### Key Resources

- [CLAUDE.md Best Practices (UX Planet)](https://uxplanet.org/claude-md-best-practices-1ef4f861ce7c) — 10 essential sections
- [Writing a Good CLAUDE.md (HumanLayer Blog)](https://www.humanlayer.dev/blog/writing-a-good-claude-md) — Conciseness advice + framework
- [Builder.io CLAUDE.md Guide](https://www.builder.io/blog/claude-md-guide) — How-to with examples
- [CLAUDE MD Templates (GitHub Wiki)](https://github.com/ruvnet/ruflo/wiki/CLAUDE-MD-Templates) — Copy-paste starters
- [YK's GLOBAL-CLAUDE.md](https://github.com/ykdojo/claude-code-tips/blob/main/GLOBAL-CLAUDE.md) — Reusable global context

### Pro Tip from Boris Cherny
Keep CLAUDE.md focused on universally applicable instructions only. Workflow-specific guidance goes in separate `.claude/rules/` files.

---

## 3. HOOKS PRODUCTION EXAMPLES

### What Are Hooks?
Deterministic shell/HTTP/LLM commands that fire at 12 lifecycle points: `BeforeToolUse`, `PostToolUse`, `PreEditorSave`, etc.

### Real Production Patterns

| Hook Type | Trigger | Example |
|-----------|---------|---------|
| **Auto-Formatter** | PostToolUse | Prettier/Black runs after every file edit → consistent style without review |
| **Security Gate** | PreToolUse | Block edits to main branch (`git rev-parse --abbrev-ref HEAD`) |
| **Test Enforcement** | PostToolUse | `npm test` or `pytest` on modified files |
| **Notification Alert** | PostToolUse | Slack message when PR pushed |
| **Pre-commit Quality** | PreEditorSave | Lint check, abort if fails |

### Key Resource
[Claude Code Hooks: A Practical Guide (2026)](https://www.eesel.ai/blog/hooks-in-claude-code) — Real lifecycle event breakdown + examples

**Advanced:** GitButler uses hooks to auto-manage Git branches as Claude works—state-of-the-art orchestration pattern.

---

## 4. TOKEN SAVING STRATEGIES & CONTEXT MANAGEMENT

### /compact Command (The Game-Changer)

```bash
/compact                              # Default: summarize full conversation
/compact focus on the API changes      # Custom focus
```

**Impact:** Typical 60-80% reduction (150K context → 30-50K)
**Rule:** Manual compact while headroom remains > auto-compact in degraded state

### Built-in Optimizations Claude Handles Automatically

- **Prompt Caching:** Repeated content (like system prompts) cached → 90% cost reduction
- **Auto-Compaction:** Fires when approaching context limit (but at degraded state)
- **Extended Thinking Budgets:** Default is tens of thousands; set `MAX_THINKING_TOKENS=8000` for simple tasks

### Real Savings from Daily Users

| Usage Pattern | Monthly Spend | Annual Spend |
|---------------|---------------|-------------|
| 10B tokens on API pricing | ~$1,250+ | $15K+ |
| Same on Claude Max plan | ~$100 | ~$1,200 |
| **Savings** | **92%** | **92%** |

*Real example: Developer with 201 sessions across 45+ projects in July 2025: $5,623 on API vs. <5 years of Max 5x plan.*

### Practical Techniques

1. **Model Selection:** Opus (thinking) → plan → Sonnet (implementation) → Haiku (routine)
2. **Prompt Efficiency:** 1-turn solution vs. 3-turn: ~50K token difference ($1+ Opus)
3. **Context Clearing:** `/clear` often when switching unrelated work
4. **/effort Levels:** Adjust thinking depth with `/effort low/medium/high` instead of manual budgets
5. **Batch API:** Flat 50% discount on all token usage
6. **Subagent Delegation:** Verbose outputs (tests, logs) stay in subagent context; only summary returns

### Resources

- [Claude Code Cost Management (Official Docs)](https://code.claude.com/docs/en/costs)
- [Cut Costs by 80%: 6 Strategies](https://www.thecaio.ai/blog/reduce-claude-code-costs)
- [Token Management: Save 50-70%](https://dev.to/richardporter/claude-code-token-management-8-strategies-to-save-50-70-on-pro-plan-3hob)
- [Extended Thinking Tips (Official)](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips)
- [Compaction Guide (Steve Kinney)](https://stevekinney.com/courses/ai-development/claude-code-compaction)

---

## 5. MCP SERVERS WORTH KNOWING

### Official/Stable Servers

| Server | Setup | Use Case |
|--------|-------|----------|
| **Notion** | `claude mcp add --transport http notion https://mcp.notion.com/mcp` | Read/write Notion databases; knowledge bases |
| **Slack** | `claude mcp add --transport sse slack --header "Authorization: Bearer..."` | Search Slack, post updates, integrate workflows |
| **GitHub** | Built-in | Interact with repos, issues, PRs, CI/CD |
| **Asana** | `claude mcp add --transport sse asana https://mcp.asana.com/sse` | Project mgmt; task automation |
| **Cloudflare** | 16 specialized servers | Edge functions, DNS, CDN, Workers |

### Business-Use MCP Servers

- **Notion MCP:** Official at https://developers.notion.com/guides/mcp/get-started-with-mcp
- **Twitter/X Integration:** [Composio MCP](https://composio.dev/toolkits/twitter/framework/claude-code) (official workaround)
- **Google Drive, Jira, Slack:** Searchable through Notion MCP integration

### Advanced: Custom MCP Servers

- [Official MCP SDK](https://github.com/modelcontextprotocol/servers) — Build your own
- [MCPcat.io](https://mcpcat.io/) — Hundreds of community servers
- Community servers: 400K+ skills via SkillKit integration

**Boris Cherny's Setup:** Slack MCP checked into `.mcp.json` and shared with team; Claude queries BigQuery, posts Slack updates, fetches Sentry logs automatically.

---

## 6. BEST YOUTUBE RESOURCES & CREATORS

### Top Creators & Their Specialty

| Creator | Focus | Key Course | Why It's Worth It |
|---------|-------|-----------|------------------|
| **Sabrina Ramonov** (Forbes 30<30) | Marketing automation | [ULTIMATE Claude Code Tutorial](https://www.sabrina.dev/p/claude-code-full-course-for-beginners) | Beginner-friendly; builds AI Marketing Officer in 90 min (no coding required) |
| **Nick Saraev** | Agent teams + DevOps | 4-Hour Masterclass | Covers Git worktrees, agent parallel execution, cloud deployment (Modal) |
| **Boris Cherny** (Creator) | Full setup walkthrough | [How I Use Claude Code](https://boristane.com/blog/how-i-use-claude-code/) | Vanilla setup from the source; runs 5-10 Claudes in parallel |
| **Anthropic Team** | Official training | [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) | Comprehensive official course |
| **Paige Niedringhaus** | Advanced patterns | [Getting the Most out of Claude Code](https://www.paigeniedringhaus.com/blog/getting-the-most-out-of-claude-code/) | Power user techniques |

### Video Ranking (Quality-to-View Ratio)

[Best Claude Code YouTube Videos Ranked — 2026 Guide](https://medium.com/@rentierdigital/i-watched-25-claude-code-youtube-videos-so-you-dont-have-to-the-definitive-ranking-550aa6863840) — Medium article ranking 25 videos; 853K view range down to 4K niche content

### Community Knowledge Hub

- [ClaudeLog](https://claudelog.com/) — #1 Claude Code community resource: docs, guides, FAQs, mechanics breakdown
- [The Neuron](https://www.theneuron.ai/explainer-articles/claude-code-guide-how-to-use-it%20/) — Beginner-to-advanced guides

---

## 7. POWER-USER WORKFLOWS FROM REAL ENGINEERS

### Boris Cherny's Setup (Creator of Claude Code)

**Philosophy:** "Works great out of the box; I don't customize much."

**Actual Setup:**
- Runs 5 Claudes in parallel locally (tabs 1-5) + 5-10 on claude.ai + 2-3 on iOS app
- Model: Opus 4.5 with thinking enabled (bigger/slower, but requires less steering)
- Plan Mode for every PR workflow (Shift+Tab twice)
- After plan approval: switches to `--auto-accept-edits`, usually 1-shot from there
- Commands in `.claude/commands/`: `/commit-push-pr` used dozens of times daily
- MCP Setup: Slack (checked into `.mcp.json`, shared with team), BigQuery, Sentry integrated

**Key Quote:** "The overhead of planning prevents solving the wrong problem for 20 minutes."

Resource: [How I Use Claude Code (Boris Tane)](https://boristane.com/blog/how-i-use-claude-code/) + [Twitter Thread](https://twitter-thread.com/t/2007179832300581177)

### Addy Osmani's LLM Coding Workflow (Chrome DevTools, Web Perf Expert)

**Core Philosophy:** Treat Claude as a powerful pair programmer requiring clear direction, context, and oversight—not autonomous judgment.

**Workflow Pattern:**
1. Break work into small chunks (avoid monolithic asks)
2. Provide extensive context (docs, code, constraints)
3. Always review what AI suggests
4. Use Claude Skills to package reusable expertise

**Key Finding:** ~90% of Claude Code itself is written by Claude Code at Anthropic
**Truth:** Using LLMs for programming is "difficult and unintuitive"—requires learning new patterns

Resource: [My LLM Coding Workflow Going Into 2026](https://addyosmani.com/blog/ai-coding-workflow/) (Addy Osmani official blog)

### Sanity's Staff Engineer: "First Attempt Will Be 95% Garbage"

**Key Insight:** AI can't retain learning between sessions; every conversation starts fresh.

**Budget Reality:** $1,000-1,500/month for a senior engineer going all-in on AI

**Approach:** Use AI "to think with" rather than for one-shot code generation; review like mentoring a junior

Resource: [First Attempt Will Be 95% Garbage (Sanity Blog)](https://www.sanity.io/blog/first-attempt-will-be-95-garbage)

### Builder.io Miles Deutscher: 50 Practical Tips

**Top 3 Speed Hacks:**
- Type `cc` instead of `claude` to skip permission prompts
- Type `!git status` or `!npm test` and command runs immediately in context
- Press Ctrl+S to stash prompt, ask quick question, stash restores automatically
- Press Ctrl+B to send long bash commands to background

**Context Strategy:** `/clear` often between unrelated work

**Parallel Development:** Spin up 3-5 Git worktrees, each running own Claude session

Resource: [50 Claude Code Tips and Best Practices](https://www.builder.io/blog/claude-code-tips-best-practices) (Builder.io blog)

### YK's Practitioner Tips (45-tip repository)

**Notable Patterns:**
- Conversation history stored locally in `~/.claude/projects/` (folder names = project path with dashes)
- Voice transcription faster than typing
- Custom status line script shows: model, directory, git branch, uncommitted files, sync status, context usage
- Use `npx cc-safe <directory>` to scan Claude Code settings for security issues
- Gemini CLI as fallback for sites Claude's WebFetch can't access

Resource: [ykdojo/claude-code-tips](https://github.com/ykdojo/claude-code-tips/blob/main/README.md)

---

## 8. PLAN MODE: WHEN & HOW TO USE

### When to Use Plan Mode

✅ **Good use cases:**
- Multi-file changes
- Unfamiliar code
- Architectural decisions
- Complex refactors (2-3 revisions typical)
- Code reviews/technical debt assessment
- New library/framework integration

❌ **Skip if:**
- Change describable in 1 sentence
- Single-file, mechanical edit
- You know exactly what you want

### Activation

```bash
/plan                    # v2.1.0+
Shift+Tab Shift+Tab      # Keyboard shortcut
```

### Key Benefits

- **Fast:** No tool execution, lightning-quick responses, fewer tokens
- **Safe:** Structured, predictable output; no surprise edits
- **Iterative:** 2-3 dialogue rounds to refine before coding begins
- **Documented:** Save plan to PLAN.md and commit to git

### Pro Pattern

Approve plan → Switch to `--auto-accept-edits` mode → Usually 1-shot implementation

Resource: [Mastering Claude Code Plan Mode](https://agiinprogress.substack.com/p/mastering-claude-code-plan-mode-the) (Agiinprogress newsletter)

---

## 9. PERMISSION MODES: Speed vs. Safety Trade-Off

### Four Modes Explained

| Mode | Behavior | Use Case | Trade-Off |
|------|----------|----------|-----------|
| **Default** | Prompts for each action | New projects, unfamiliar code | Slower; safe |
| **AcceptEdits** | Auto-approves file ops; other tools prompt | Prototyping, isolated directory | Fast editing; bash still prompted |
| **Plan Mode** | No tool execution; analysis only | Exploration, design review | Plans but no execution |
| **BypassPermissions** | Everything approved; still protects `.git/.claude` | Parallel agents, high-volume sessions | Full autonomy; inherits to subagents |

### Dangerous Flag

```bash
claude --dangerously-skip-permissions
```

**When Safe:** Containerized/sandboxed environments for research, experimentation
**When Not:** Production codebases, sensitive repos

Resource: [Configure Permissions (Official Docs)](https://code.claude.com/docs/en/permissions)

---

## 10. REDDIT & SOCIAL MEDIA INSIGHTS

### r/ClaudeAI (612K Members)

**Top Discussion Themes:**
1. **Dialogue-Based Debugging:** Claude Code superior to Cursor/Copilot for explaining reasoning, not just fixes
2. **Large Codebase Handling:** Process 200K input tokens; drop 3,000-line C# files; one-shot refactors succeed
3. **Innovative Applications:** Reverse-engineered 13-year-old game binary; open-source scientific writing workspace
4. **Pricing Reality:** Claude Max ($100/mo) is standard for daily users; called "main tool" by power users

Resource: [ClaudeLog: What is Claude AI Reddit?](https://claudelog.com/faqs/what-is-claude-ai-reddit/)

### X/Twitter Patterns

**Active Threads:**
- Boris Cherny's parallel session setups
- Token optimization hacks & /compact strategies
- Custom command workflows
- Worktree patterns for parallel agents

**Note:** No official Twitter/X MCP yet; community workarounds available through Composio

---

## 11. COST OPTIMIZATION REAL NUMBERS

### Claude Max ROI Example

**Scenario:** Senior engineer, 201 sessions, 45+ projects (July 2025)

| Plan | Cost | Calculation |
|------|------|-------------|
| **Claude Max** | <$100/month | ~$500/quarter from 5x plan |
| **API Equivalent** | $5,623 | Same usage on pay-as-you-go |
| **Savings** | 96% | Single month = <5 years of Max 5x |

### Specific Cost-Saving Techniques Ranked by ROI

1. **Model Selection** (70% potential savings)
   - Opus (reasoning) → Sonnet (code) → Haiku (routine)
   - Daily difference: $2-5; Monthly: $60-150

2. **Prompt Efficiency** (50K+ token saves per task)
   - 1-turn solution vs. 3-turn: ~$1 Opus, multiplied across dozens of tasks/day

3. **Batch API** (50% flat discount)
   - For non-urgent work; slower but 50% cheaper

4. **Prompt Caching** (90% reduction on repeated content)
   - Repeated system prompts, boilerplate cached

5. **Manual Compaction** (60-80% reduction)
   - Better summaries when headroom remains vs. auto-compact in degraded state

Resource: [Claude Code Pricing Guide: Which Plan Saves You Money](https://www.ksred.com/claude-code-pricing-guide-which-plan-actually-saves-you-money/)

---

## 12. LESSER-KNOWN TOOLS & PATTERNS

### Custom Slash Commands Pattern

**Location:** `.claude/commands/`
**Format:** Markdown files with prompt templates
**Usage:** Type `/command-name` in Claude Code
**Benefit:** Reusable, checked into git, shared with team

**Boris's Example:** `/commit-push-pr` used dozens of times daily; precomputes git status inline for speed

### Git Worktrees for Parallel Agents

```bash
git worktree add worktree-feature-a feature-a-branch
git worktree add worktree-feature-b feature-b-branch
```

**Benefit:** Each agent gets own branch + filesystem state; no merge conflicts
**Pattern:** GitButler-style orchestration; now built-in to Claude Code CLI

Resource: [Agent Teams: Git Worktrees](https://engineering.intility.com/article/agent-teams-or-how-i-learned-to-stop-worrying-about-merge-conflicts-and-love-git-worktrees/)

### Gemini CLI as Fallback

**Use Case:** WebFetch blocked on a site? Use Gemini CLI as fallback MCP

**Pattern:** Custom skill that invokes Gemini when Claude's tools fail

Resource: [ykdojo/claude-code-tips](https://github.com/ykdojo/claude-code-tips)

### Status Line Script

**What It Shows:** Model, directory, git branch, uncommitted file count, sync status, context usage
**Location:** [YK's status line script](https://github.com/ykdojo/claude-code-tips/tree/main/scripts)

---

## 13. UNRESOLVED QUESTIONS & GAPS

1. **Conversation History Persistence:** Best practices for multi-month projects with many sessions?
2. **Subagent Context Isolation:** How do teams ensure agents don't leak sensitive info between sessions?
3. **Performance Benchmarks:** Measured data on plan mode iteration counts across project sizes?
4. **Custom Skill Maturity:** Adoption rate of community skills vs. built-in functions?
5. **MCP Security:** Trust framework for third-party MCP servers in production?
6. **Extended Thinking Calibration:** Optimal budget by task type (no official guidance published)?

---

## 14. QUICK REFERENCE: BEST LINKS BY INTENT

| I Want To... | Best Resource | Time Investment |
|--------------|---------------|-----------------|
| **Get started** | [Sabrina's 90-min Tutorial](https://www.sabrina.dev/p/claude-code-full-course-for-beginners) | 90 min |
| **Learn all features** | [Florian's Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) | 2-3 hours |
| **Copy production patterns** | [rohitg00 toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) + [ChrisWiles showcase](https://github.com/ChrisWiles/claude-code-showcase) | 30 min |
| **Optimize costs** | [Official Cost Docs](https://code.claude.com/docs/en/costs) + [80% Savings Guide](https://www.thecaio.ai/blog/reduce-claude-code-costs) | 20 min |
| **Master hooks** | [Disler hooks mastery](https://github.com/disler/claude-code-hooks-mastery) + [EESEL practical guide](https://www.eesel.ai/blog/hooks-in-claude-code) | 45 min |
| **Plan Mode deep dive** | [Agiinprogress breakdown](https://agiinprogress.substack.com/p/mastering-claude-code-plan-mode-the) | 15 min |
| **Write good CLAUDE.md** | [HumanLayer blog](https://www.humanlayer.dev/blog/writing-a-good-claude-md) + [UX Planet](https://uxplanet.org/claude-md-best-practices-1ef4f861ce7c) | 20 min |
| **Find community knowledge** | [ClaudeLog.com](https://claudelog.com/) | Ongoing reference |
| **See production setup** | [Boris Cherny's blog](https://boristane.com/blog/how-i-use-claude-code/) | 10 min |
| **Copy 45 practical tips** | [YK's repo](https://github.com/ykdojo/claude-code-tips) + [Builder.io's 50 tips](https://www.builder.io/blog/claude-code-tips-best-practices) | 30 min |

---

## SUMMARY: THE SYNTHESIS

**The Claude Code community has converged on a unified pattern:**

1. **Research → Plan → Execute → Review → Ship** (Every major workflow follows this)
2. **Plan Mode first** (Shift+Tab twice; iterate 2-3 times before coding)
3. **CLAUDE.md <300 lines** (Focus on universally applicable rules; specific guidance in `.claude/rules/`)
4. **Hooks for automation** (Auto-formatters, security gates, test runners at lifecycle points)
5. **Cost management is real** (92-96% savings possible; /compact is essential; model selection matters)
6. **Git worktrees + parallel agents** (Multi-agent orchestration without conflicts)
7. **Subagent delegation** (Verbose outputs stay in subagent context; only summaries return)
8. **Treat Claude as a pair programmer** (Requires clear direction, context, oversight—not autonomy)

**The community's #1 truth:** Plan phase prevents 20 minutes of solving the wrong problem. Always plan first.

---

**Next Steps:**
- Start with Boris Cherny's setup (vanilla, proven)
- Copy patterns from rohitg00 toolkit
- Master Plan Mode first (biggest ROI)
- Optimize costs with /compact + model selection
- Join r/ClaudeAI for community wisdom
- Check ClaudeLog.com for ongoing mechanics updates
