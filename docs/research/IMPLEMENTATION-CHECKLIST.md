# Claude Code Implementation Checklist

**Use this to bring community best practices into your workflow.**

---

## PHASE 1: FOUNDATION (Week 1 — 2-3 hours)

### Setup & Basics
- [ ] Install Claude Code: `npm install -g claude`
- [ ] Verify installation: `claude --version`
- [ ] Watch [Sabrina Ramonov's 90-min tutorial](https://www.sabrina.dev/p/claude-code-full-course-for-beginners)
- [ ] Read [Boris Cherny's blog](https://boristane.com/blog/how-i-use-claude-code/) (10 min)
- [ ] Print & bookmark [Quick Reference Card](./claude-code-quick-reference.md)

### First Project Setup
- [ ] Create project directory: `mkdir my-claude-project && cd my-claude-project`
- [ ] Initialize git: `git init`
- [ ] Create `CLAUDE.md` using template from quick reference
  - Project overview
  - Tech stack
  - Architecture
  - Coding rules
  - Commands
- [ ] Create `.claude/` directory: `mkdir -p .claude/commands .claude/hooks .claude/rules`
- [ ] Create empty `hooks.json` in `.claude/`
- [ ] Git commit: `git add . && git commit -m "Initial Claude Code setup"`

### First Workflow Trial
- [ ] Open Claude Code: `claude`
- [ ] Enter Plan Mode: `Shift+Tab Shift+Tab` (or `/plan`)
- [ ] Describe a simple feature (e.g., "Add login validation")
- [ ] Review the plan without approving execution
- [ ] Iterate 1-2 times based on feedback
- [ ] Approve plan
- [ ] Switch mode: `claude --auto-accept-edits`
- [ ] Let Claude code
- [ ] Review output
- [ ] Run tests
- [ ] Commit: `git add . && git commit -m "feat: add login validation"`

### Baseline Metrics
- [ ] Note your token usage: `/cost` command
- [ ] Save screenshot of initial cost baseline
- [ ] Time this workflow (should be 15-30 min per feature)

---

## PHASE 2: OPTIMIZATION (Week 2 — 2-3 hours)

### Cost Management
- [ ] Read [Official Cost Docs](https://code.claude.com/docs/en/costs) (15 min)
- [ ] Review Section 11 of research report (Real Numbers)
- [ ] Set up `/compact` command in your workflow
  - [ ] Create alias: `alias cc='claude'`
  - [ ] Use `/compact` when context approaches 150K tokens
- [ ] Switch to model rotation:
  - Opus (planning + thinking)
  - Sonnet (implementation)
  - Haiku (routine edits)
- [ ] Run 5 features with cost tracking
  - [ ] Compare Opus-only vs. Opus+Sonnet+Haiku costs
  - [ ] Document savings

### Context Management
- [ ] Learn `/clear` vs. `/compact` difference
  - [ ] `/clear` → completely wipe history
  - [ ] `/compact` → compress & preserve
- [ ] Set up custom compact instructions
  - Add to CLAUDE.md: "Compact Instructions: Focus on TODOs and major decisions"
- [ ] Create workflow: Use `/clear` when starting unrelated work

### Permission Modes
- [ ] Understand 4 modes (read quick reference section)
- [ ] Try Default mode (prompts for everything) — establish baseline
- [ ] Try AcceptEdits mode (auto-approve file ops)
  - [ ] Use on feature branch only
  - [ ] Note speed improvement
- [ ] Understand BypassPermissions (DON'T use in main repo yet)

### Metrics to Track
- [ ] Average tokens per feature
- [ ] Average time per feature (plan + code + review)
- [ ] Cost per feature
- [ ] Months until Claude Max ($100/mo) pays for itself

---

## PHASE 3: AUTOMATION (Week 3 — 2-3 hours)

### Hooks Setup
- [ ] Read [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)
- [ ] Implement these 3 hooks in your `.claude/hooks.json`:

#### 1. Auto-Formatter Hook
```json
{
  "trigger": "PostToolUse",
  "condition": "file_edited",
  "action": "bash",
  "script": "prettier --write $CLAUDE_FILE || black $CLAUDE_FILE"
}
```
- [ ] Test on a file edit
- [ ] Verify formatting applied automatically

#### 2. Security Gate Hook
```json
{
  "trigger": "PreToolUse",
  "condition": "bash_command",
  "action": "bash",
  "script": "if [ $(git rev-parse --abbrev-ref HEAD) = 'main' ]; then exit 1; fi"
}
```
- [ ] Test: Try editing on main branch (should block)

#### 3. Test Enforcement Hook
```json
{
  "trigger": "PostToolUse",
  "condition": "file_edited && file.includes('src/')",
  "action": "bash",
  "script": "npm test"
}
```
- [ ] Test: Edit a source file, watch tests run automatically

### Custom Slash Commands
- [ ] Create `.claude/commands/` directory
- [ ] Create `commit-push-pr.md` (example from Boris)
  - Markdown file with prompt template
  - Auto-triggers with `/commit-push-pr`
- [ ] Create `start-sprint.md`
  - Generates sprint template
  - Pulls open issues
- [ ] Create `code-review.md`
  - Requests full code review before commit
- [ ] Verify commands appear in autocomplete with `/`

### Integration Rules
- [ ] Create `.claude/rules/code-quality.md`
  - Linting standards
  - Type checking
  - Testing thresholds
- [ ] Create `.claude/rules/git-flow.md`
  - Branch naming
  - Commit message format
  - PR requirements
- [ ] Link from CLAUDE.md: "See .claude/rules/ for specific development standards"

### Metrics
- [ ] Measure time reduction with automation
- [ ] Count bugs caught by hooks before commit
- [ ] Monitor command usage frequency

---

## PHASE 4: SCALING (Week 4 — 3-4 hours)

### MCP Server Setup
- [ ] Choose 1 MCP server for your team (recommend Notion or Slack)
- [ ] Copy command from quick reference:
  ```bash
  claude mcp add --transport http notion https://mcp.notion.com/mcp
  ```
- [ ] Verify connection: `claude mcp test notion`
- [ ] Use in workflow:
  - [ ] Create task in Notion from Claude prompt
  - [ ] Query Notion database for context
  - [ ] Update status from Claude Code
- [ ] Commit `.mcp.json` to git (share with team)

### Subagent Delegation Pattern
- [ ] Identify expensive operations (tests, logs, API calls)
- [ ] Create first subagent task:
  ```
  Delegate to tester agent:
  "Run full test suite on the current branch. Only return summary of pass/fail counts and failing test names."
  ```
- [ ] Measure context savings (before/after)
- [ ] Create 2-3 more delegatable tasks

### Git Worktrees (Multi-Session)
- [ ] Create feature branch: `git checkout -b feature/x`
- [ ] Create worktree: `git worktree add ../worktree-feature-x feature/x`
- [ ] Open Claude in worktree: `cd ../worktree-feature-x && claude`
- [ ] Run parallel session while main session works on feature-y
- [ ] After feature-x complete: `git worktree remove ../worktree-feature-x`

### Team Integration
- [ ] Share quick reference with team
- [ ] Share CLAUDE.md template
- [ ] Share `.claude/` directory patterns
- [ ] Run team workshop (30 min):
  - Boris's workflow walkthrough
  - Plan Mode demo
  - Cost optimization results
  - Hook automation showcase

### Metrics
- [ ] Features completed per week (should increase 50-100%)
- [ ] Cost per feature (should decrease 40-70%)
- [ ] Team time spent in manual review (should decrease 30-50%)

---

## PHASE 5: MASTERY (Week 5+)

### Advanced Patterns
- [ ] Read [Florian's Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide)
- [ ] Study [rohitg00 toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit)
  - 135 agents
  - 35 skills
  - 42 commands
  - Copy patterns relevant to your domain
- [ ] Implement 2-3 domain-specific skills
- [ ] Create custom agent for your most-repeated task

### Production Readiness
- [ ] Review all hooks for safety
- [ ] Add pre-push checks (prevent accidental pushes to main)
- [ ] Set up logging/monitoring for Claude Code usage
- [ ] Document team's Claude Code standards in contributing guide
- [ ] Train new team members using your playbook

### Community Connection
- [ ] Subscribe to ClaudeLog.com
- [ ] Join r/ClaudeAI
- [ ] Follow Boris Cherny for updates
- [ ] Share patterns you've created back (open source)

---

## DAILY WORKFLOW CHECKLIST

### Every Session
- [ ] Start in Plan Mode (Shift+Tab twice)
  - Describe feature/task
  - Claude creates plan
  - Review plan (2-3 iterations typical)
- [ ] Approve plan
- [ ] Switch mode: `claude --auto-accept-edits`
- [ ] Let Claude code
- [ ] Review output
- [ ] Run tests
- [ ] Use `/commit-push-pr` (custom command)

### Weekly
- [ ] Check `/cost` for token usage
- [ ] Run `/compact` if context >70%
- [ ] Review hook logs for issues
- [ ] Share metrics with team

### Monthly
- [ ] Visit ClaudeLog.com for new patterns
- [ ] Review cost optimization savings
- [ ] Identify new patterns to adopt
- [ ] One team retrospective on Claude Code workflow

---

## RED FLAG MONITORING

### Watch for These Issues
- [ ] Context approaching 150K tokens
  - **Action:** `/compact` immediately

- [ ] Plan Mode producing unclear plans
  - **Action:** Ask more specific questions; clarify ambiguity first

- [ ] Hooks not firing
  - **Action:** Check `.claude/hooks.json` syntax; run `claude mcp test`

- [ ] Permission mode causing friction
  - **Action:** Switch to AcceptEdits for feature work

- [ ] Subagent inheriting BypassPermissions
  - **Action:** Never use BypassPermissions globally; only in sandboxed environments

- [ ] Same bug appearing across multiple sessions
  - **Action:** Check CLAUDE.md for conflicting instructions

---

## SUCCESS METRICS BY PHASE

### Phase 1 (Week 1)
- ✅ First feature completed using Plan Mode → Code workflow
- ✅ CLAUDE.md written (<300 lines)
- ✅ `.claude/` directory initialized

### Phase 2 (Week 2)
- ✅ Cost tracking baseline established
- ✅ Token usage 30-50% lower with `/compact`
- ✅ Model rotation showing savings

### Phase 3 (Week 3)
- ✅ 3 hooks running automatically
- ✅ 2-3 custom commands created
- ✅ Rules documented in `.claude/rules/`
- ✅ Zero manual formatting needed

### Phase 4 (Week 4)
- ✅ MCP server integrated
- ✅ Subagent delegation reducing main context by 40-60%
- ✅ Git worktrees enabling parallel work
- ✅ Team trained on new workflow

### Phase 5 (Ongoing)
- ✅ 100+ PRs per month (or proportional to team size)
- ✅ <$100/month per developer on Max plan
- ✅ New team members up to speed in <2 hours
- ✅ Custom agents/skills specific to your domain

---

## QUICK WINS (Do These Today)

### 30-Minute Wins
1. [ ] Read Boris's blog (10 min)
2. [ ] Create CLAUDE.md (15 min)
3. [ ] Create `.claude/` directory (5 min)

### 1-Hour Wins
1. [ ] Do first Plan Mode workflow
2. [ ] Try 3 different permission modes
3. [ ] Set up `/compact` command

### 2-Hour Wins
1. [ ] Implement auto-formatter hook
2. [ ] Create first custom slash command
3. [ ] Track baseline token cost

---

## RESOURCES REFERENCE

| Task | Resource | Time |
|------|----------|------|
| Learn basics | [Sabrina's tutorial](https://www.sabrina.dev/p/claude-code-full-course-for-beginners) | 90 min |
| Creator workflow | [Boris's blog](https://boristane.com/blog/how-i-use-claude-code/) | 10 min |
| Cost optimization | [Official cost docs](https://code.claude.com/docs/en/costs) | 15 min |
| CLAUDE.md template | Quick Reference Card | 5 min |
| Hooks patterns | [disler/hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) | 30 min |
| Copy-paste patterns | [rohitg00 toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) | 20 min |
| Plan Mode mastery | [Agiinprogress guide](https://agiinprogress.substack.com/p/mastering-claude-code-plan-mode-the) | 15 min |
| Advanced patterns | [Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) | 2-3 hours |

---

## NOTES FOR TEAM LEADS

### Before Rolling Out to Team
- [ ] Complete all 5 phases yourself
- [ ] Document your workflow in a team playbook
- [ ] Create team CLAUDE.md template
- [ ] Set up shared `.claude/` patterns in a starter repo
- [ ] Prepare 30-min training session

### Training Session Outline (30 min)
1. **Why Claude Code** (5 min)
   - Show your cost/time metrics
   - Demonstrate 100 PRs/week at Boris's scale

2. **Workflow Demo** (10 min)
   - Plan Mode (live)
   - Code generation (live)
   - Commit via `/commit-push-pr` (live)

3. **Cost Savings** (5 min)
   - Show /compact impact
   - Show model rotation ROI
   - Compare Max plan vs. API pricing

4. **Hands-on Trial** (7 min)
   - Each person tries Plan Mode
   - Each person tries /compact
   - Quick questions

5. **Next Steps** (3 min)
   - When to use this workflow
   - When to ask for help
   - Weekly check-in cadence

### Team Metrics to Track
- [ ] PRs per developer per week
- [ ] Cost per PR (tokens)
- [ ] Time to "ready for review" per feature
- [ ] Bugs caught pre-commit (hooks)
- [ ] Team satisfaction survey

---

## FINAL CHECKLIST

When you've completed all phases, you should:

- [ ] Understand Plan Mode deeply (never code without planning)
- [ ] Know your token usage & cost baseline
- [ ] Have `/compact` as a habit
- [ ] Run 3-5 hooks automatically
- [ ] Have custom commands in muscle memory
- [ ] Use Model rotation instinctively
- [ ] Delegate expensive operations to subagents
- [ ] Feel comfortable with BypassPermissions in sandboxed environments
- [ ] Know every link in Quick Reference by heart
- [ ] Be able to explain Claude Code workflow to new team member in <10 min

**Congratulations!** You're now operating at the community standard.

---

**Next?** Share this checklist with your team and start Phase 1 together.
