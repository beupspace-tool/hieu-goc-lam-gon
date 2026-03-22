# CLAUDE.md — Hiểu Gốc Làm Gọn Guide

## Project
- **Name**: Hiểu Gốc — Làm Gọn
- **Type**: Static educational website
- **URL**: claude-guide.beup.space
- **Brand**: BEUP Learning Solutions

## Tech Stack
- Pure HTML/CSS/JS (no framework, no build step)
- CSS: 3-layer token system (tokens.css → base.css → layout.css → components.css)
- JS: Vanilla, self-initializing on DOMContentLoaded
- Deploy: GitHub Pages + CNAME to claude-guide.beup.space

## File Structure
```
├── index.html              # Landing page
├── assets/css/             # Design system (6 files)
├── assets/js/              # Core JS modules (5 files)
├── levels/0-hat-giong/     # Level 0: 8 HTML files
├── levels/1-re/            # Level 1: 9 HTML files
├── levels/2-goc/           # Level 2: 10 HTML files
├── levels/3-than/          # Level 3: (planned)
├── levels/4-canh/          # Level 4: (planned)
├── levels/5-ngon/          # Level 5: (planned)
├── templates/              # Downloadable CLAUDE.md templates
└── cheatsheets/            # Quick reference cards
```

## Conventions
- Language: Vietnamese primary, English mirror in /en/
- File naming: kebab-case, descriptive
- CSS: use token variables only, no hardcoded colors
- HTML template: follow levels/0-hat-giong/phan-mem-la-gi.html as reference
- Each lesson page: sidebar + lesson-hero + content + lesson-nav + footer
- Callouts: callout-principle (purple), callout-practice (green), callout-warning (yellow)
- Code blocks: pre > code with ../../assets/js/code-copy.js for copy button

## Content Rules
- Tone: Professional but approachable, systems thinker
- Every lesson: at least 1 Nguyên lý callout + 1 Thực hành callout
- Business analogies over technical jargon
- First-principles approach: explain WHY before HOW
- Target: Vietnamese SME owners 28-45, freelancers, Gen Z

## Adding New Lessons
1. Copy template from existing lesson in same level
2. Update: title, meta, breadcrumb, sidebar active link, content, prev/next nav
3. Update level index.html to include new lesson card
4. Update landing page index.html if level card counts change
