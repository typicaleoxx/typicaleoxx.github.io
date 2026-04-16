# Portfolio Website — Product Requirements Document

**Project:** Sneha Lama — Developer Portfolio
**Last Updated:** 2026-04-16
**Status:** Planning

---

## 1. Overview

A personal portfolio website styled as a VS Code IDE. Visitors navigate using a file explorer sidebar, open files in tabs, and trigger a command palette with `Ctrl+K`. Content is presented as developer files: Markdown pages and JSON configs.

The VS Code concept makes it memorable for technical visitors. For non-technical visitors (recruiters, HR, hiring managers), clear labels, tooltips, a welcome prompt on first load, and a persistent "not sure where to start?" hint make it easy to navigate without knowing what VS Code is.

**URL:** sneha-lama.github.io
**Future domain:** snehalama.dev (or .com)
**Stack:** HTML, CSS, Vanilla JavaScript (no frameworks, no build step)
**Hosting:** GitHub Pages

**Who this is for:**
- Recruiters and hiring managers in software, security, and AI
- Technical interviewers who appreciate attention to craft
- Collaborators looking for a backend or security-focused engineer
- Anyone deciding whether to reach out with an opportunity

---

## 2. Goals

- Present Sneha as a backend software engineer and security professional, not just a student
- Show real projects with context, tech decisions, and measurable impact
- Be memorable through the VS Code concept without sacrificing usability
- Guide non-technical visitors to the right content without them feeling lost
- Load in under 1 second
- Be easy to update: changing content means editing one data file, not refactoring HTML

---

## 3. The Core Concept

Visitors land on what looks like VS Code. The file explorer on the left holds the navigation. Clicking a file opens it in a tab. The editor area renders the content with line numbers and syntax highlighting. The command palette handles power navigation. A terminal panel handles easter egg commands.

The illusion should be convincing enough to make a developer smile and a recruiter curious. A small "Welcome" file opens automatically on first load that explains how to navigate in plain language, so nobody feels stranded.

---

## 4. File Structure

### Repository layout

```
sneha-lama.github.io/
  index.html
  style.css
  main.js
  data/
    about.md
    projects.json
    skills.json
    experience.md
    contact.md
    welcome.md
  assets/
    resume.pdf
    avatar.png
    icons/
      (SVG icons: file-md, file-json, file-pdf, folder, folder-open)
      (Activity bar icons: explorer, search, git, extensions, person)
```

### Explorer tree (what the visitor sees)

```
SNEHA_LAMA/
  welcome.md            <- opens automatically on first visit
  about-me.md
  projects/
    syllabAI.md
    ai-code-explainer.md
    ai-wellbeing-companion.md
    soc-macro-extension.md
  skills.json
  experience.md
  contact.md
  resume.pdf
```

---

## 5. UI Layout

Single-page application. No page reloads. Everything rendered and swapped via JavaScript.

```
+-------------------------------------------------------------------+
|  [•][•][•]          sneha-lama -- portfolio -- VS Code            |
+-----+--------+-----------------------------------------------------+
|     |        |  welcome.md  x  about-me.md  x                     |
|  A  |  File  +-----------------------------------------------------+
|  c  |  Tree  |  SNEHA_LAMA > welcome.md                (breadcrumb)|
|  t  |        +------------------------------------------+----------+
|  i  |        |                                          |  Mini   |
|  v  |        |   Editor Area                            |  Map    |
|  i  |        |   (line numbers + content)               |         |
|  t  |        |                                          |         |
|  y  |        |                                          |         |
|     |        |                                          |         |
+-----+--------+------------------------------------------+----------+
|  ⎇ main   ✓ No Problems   Open to Work   UTF-8   Markdown   12:34  |
+-------------------------------------------------------------------+
```

---

## 6. Component Specifications

### 6.1 Title Bar

- macOS traffic lights (red, yellow, green circles) on the left, decorative
- Centered text: `sneha-lama — portfolio — VS Code`
- Full-width, fixed at top

---

### 6.2 Activity Bar

Leftmost vertical strip with icon buttons.

| Icon | Tooltip | Action |
|------|---------|--------|
| Files | Explorer | Show/hide file tree |
| Search | Command Palette | Open Ctrl+K palette |
| Git | Source Control | Easter egg: fake git log |
| Extensions | Skills | Jump to skills.json |
| Person | About | Jump to about-me.md |

Clicking an active icon collapses the sidebar. Active icon is highlighted with the accent blue.

---

### 6.3 Explorer Sidebar

- Folder rows show a chevron that rotates on expand/collapse (150ms)
- File rows show a file icon matching the extension
- Clicking a file opens or refocuses its tab
- Active file is highlighted
- `resume.pdf` triggers a download, not a render
- Keyboard support: arrows move focus, Enter opens, Space toggles folders

**First-visit behavior:**
- `welcome.md` opens automatically in a tab
- A subtle tooltip on the sidebar reads "click any file to open it" for 4 seconds, then fades

---

### 6.4 Tab Bar

- Multiple tabs open at once
- Active tab matches the editor background (`#1e1e1e`), inactive tabs are darker (`#2d2d2d`)
- File icon + filename on each tab
- Close button (×) visible on hover and always visible on active tab
- Middle-click closes a tab
- If tabs overflow: horizontal scroll, no wrapping
- Modified dot (●) appears on the contact tab if the form has unsaved input
- `Ctrl+W` closes active tab
- `Ctrl+Tab` / `Ctrl+Shift+Tab` cycles forward and back

---

### 6.5 Editor Area

**Line numbers:**
- Left gutter, muted color (`#858585`), matches VS Code style

**Syntax highlighting:**

*Markdown (.md):*
- `# Heading` lines: `--accent-yellow` (#dcdcaa)
- `## Subheading`: `--accent-blue` (#569cd6)
- `**bold**`: `--accent-purple` (#c586c0)
- `` `inline code` ``: `--accent-orange` (#ce9178)
- `[links](url)`: `--accent-blue`, underline on hover
- Plain text: `--text-primary` (#d4d4d4)
- Comments / muted notes: `--text-muted` (#858585)

*JSON (.json):*
- Keys: `--accent-blue`
- String values: `--accent-orange`
- Number values: `--accent-green` (#4ec9b0)
- Booleans: `--accent-purple`
- Punctuation: `--text-muted`

**Breadcrumb:**
- Row above editor: `SNEHA_LAMA > projects > syllabAI.md`
- Each segment is a clickable link

**Cursor blink:**
- A blinking cursor on the last visible line of the active file (cosmetic, CSS animation)

**Minimap:**
- Right side of editor, ~60px wide
- Blurred scaled-down version of the content
- Click to jump to that scroll position

**Smooth transitions:**
- Tab switch: 80ms fade
- File open: content slides in from right (100ms)

---

### 6.6 Command Palette

**Trigger:** `Ctrl+K`, `Cmd+K`, or clicking the search icon in the activity bar

**Appearance:**
- Centered overlay, ~600px wide, ~400px tall max
- Semi-transparent backdrop blur behind it
- Input field focused on open
- Results list below input

**Behavior:**
- Fuzzy search filters results as you type
- Arrow keys navigate results, Enter runs the selected command, Escape closes
- Top of list shows "recent" commands before any input is typed (like real VS Code)
- Results animate in (no layout shift on filter)

**All commands:**

| Command | Action |
|---------|--------|
| Open About Me | Opens about-me.md |
| View Projects | Expands projects folder |
| syllabAI | Opens syllabAI.md |
| AI Code Explainer | Opens ai-code-explainer.md |
| AI Wellbeing Companion | Opens ai-wellbeing-companion.md |
| SOC Macro Extension | Opens soc-macro-extension.md |
| View Skills | Opens skills.json |
| Open Experience | Opens experience.md |
| Download Resume | Downloads resume.pdf |
| Contact Me | Opens contact.md |
| Open GitHub | Opens github.com/typicaleoxx in new tab |
| Open LinkedIn | Opens linkedin.com/in/snehalama in new tab |
| Toggle Theme | Switches dark and light theme |
| Open Terminal | Slides up the terminal panel |
| Clear All Tabs | Closes all open tabs |

---

### 6.7 Status Bar

**Left:**
- `⎇ main` — links to the GitHub repo
- `✓ No Problems` — clicking opens a joke Problems panel

**Right:**
- `Open to Work` with a pulsing green dot
- `UTF-8`
- Active file type: `Markdown` or `JSON`
- Live clock (updates every second)

**Problems panel (easter egg):**
Single entry: `WARNING  sneha-lama   Still not hired? Fix that: lsneha991@gmail.com`

---

### 6.8 Terminal Panel (P2)

Slides up from the bottom, triggered by `Ctrl+backtick` or command palette.

Prompt: `sneha@portfolio:~$`

**Supported commands:**

| Command | Output |
|---------|--------|
| `whoami` | Short bio paragraph |
| `ls` | Lists files in SNEHA_LAMA/ |
| `ls projects` | Lists all four projects |
| `open resume` | Downloads resume.pdf |
| `open <filename>` | Opens that file in the editor |
| `skills` | Prints skills.json as formatted text |
| `contact` | Prints contact info |
| `help` | Lists all commands |
| `clear` | Clears terminal output |
| `git log` | Easter egg: fake commit history (funny messages) |
| `git blame` | Easter egg: blames sneha for everything |
| `git status` | Easter egg: "nothing to commit, everything is deployed" |

Blinking cursor, scrollback history, supports arrow up/down for command history.

---

## 7. Page Content

### welcome.md

Opens on first visit. Written in plain language for any visitor.

```
# welcome.md

Hey, glad you're here.

This site is styled to look like VS Code, a tool developers use to write code.
But you don't need to know that to get around.

Here's how it works:
- Click any file on the left to open it
- Use Ctrl+K (or the search icon) to jump anywhere fast
- Click the X on a tab to close it

Quick links if you want to skip straight to something:
- About me           -> about-me.md
- My projects        -> projects/
- Skills             -> skills.json
- Work experience    -> experience.md
- Resume             -> resume.pdf (downloads automatically)
- Contact            -> contact.md
```

---

### about-me.md

Written to position Sneha for backend, AI, and security roles. Personal but professional.

```
# about-me.md

## Hi, I'm Sneha

I'm a computer science student at the University of South Florida (GPA 3.72, Dean's List 2025).
I build backend systems and security automation tools. Right now I'm a Security Analyst
at Cyber Florida, where I write automation for a 10+ analyst SOC team and investigate
50+ daily alerts using Splunk and Microsoft Defender.

## What I'm Good At

Backend development: I build APIs with Python and FastAPI, containerize with Docker,
and deploy on AWS and cloud platforms. I care about clean architecture and systems
that hold up under real use.

Security engineering: I write automation that makes SOC work faster and more consistent.
I've blocked 15+ malicious IPs weekly through threat analysis and built tools that
reduced analyst reporting time by 25%.

AI integration: I've shipped tools that put LLMs to practical use: a code explainer
that combines static analysis with LLM reasoning, an AI planner that parses syllabus
PDFs into study schedules, and a wellbeing companion with structured reasoning.

## Right Now

Security Analyst at Cyber Florida. Computer Science student. Building side projects
on weekends. Looking for full-time roles in backend engineering, security engineering,
or AI tooling.

## Outside of Code

Bellini College Ambassador at USF. Tech Lead at Google Developers Group USF.
Development Director at Trinket for Education.
```

---

### projects.json

Five project objects. Each follows this schema:

```json
{
  "name": "string",
  "tagline": "one-line pitch for non-technical readers",
  "description": "two to three sentence explanation of what it does and why",
  "tech": ["array", "of", "tech"],
  "github_url": "https://...",
  "live_url": "https://... (if deployed)",
  "impact": "what it changed or what it measured",
  "status": "deployed | in progress | completed",
  "highlights": ["bullet 1", "bullet 2", "bullet 3"]
}
```

**Project entries:**

1. **SyllabAI** — turns any syllabus into a week-by-week study plan with risk scoring and calendar export. Stack: Next.js 14, FastAPI, Groq API, PyPDF2, TypeScript, Tailwind CSS. Deployed.

2. **AI Code Explainer** — paste any source code and get back an explanation of the logic, security risks, and performance issues. Stack: Python, FastAPI, Docker, AWS ECS, Python AST. Deployed.

3. **AI Wellbeing Companion** — conversational assistant for stress and anxiety messages, built on a 5-stage reasoning framework that improved response clarity by 50%. Stack: Python, LLM APIs.

4. **SOC Macro Chrome Extension** — Chrome extension for SOC analysts that automates repetitive incident documentation. Adopted by 10+ analysts, cut reporting time by 25%. Stack: JavaScript, Chrome APIs, CI/CD.

5. (Reserved for future project)

---

### skills.json

```json
{
  "languages": ["Python", "JavaScript", "Java", "C", "C++", "SQL"],
  "frameworks": ["FastAPI", "Django", "Django REST Framework", "Next.js", "Streamlit"],
  "databases": ["PostgreSQL", "Firestore"],
  "security": [
    "Splunk",
    "Microsoft Defender",
    "Incident Response",
    "Threat Modeling",
    "NIST CSF",
    "ICS/OT Security"
  ],
  "tools": ["Git", "Docker", "Linux", "Postman", "Hugging Face", "CI/CD Pipelines"],
  "cloud": ["AWS ECS", "Vercel", "Render"],
  "currently_learning": ["Distributed Systems", "Cloud Infrastructure"],
  "certifications": ["Security BTL1", "SANS ICS410", "SANS ICS310"]
}
```

---

### experience.md

Sections: Education, Work Experience, Leadership. Bullet points pulled from resume, written naturally without jargon overload.

Key beats to hit:
- USF, 3.72, Dean's List, expected graduation
- Cyber Florida Security Analyst: SOC automation, Splunk, Python, reduced analyst effort 25%
- NIST Security Assistant: ICS/OT assessments, threat modeling, Python simulations
- GDG Tech Lead: Firebase, Firestore, Next.js, mentoring
- Bellini College Ambassador
- Trinket for Education Development Director
- NSA USF Secretary

---

### contact.md

```
# contact.md

## Let's Talk

I'm open to backend engineering, security engineering, and AI tooling roles.
Internships or full-time.

| | |
|-|-|
| Email | lsneha991@gmail.com |
| GitHub | github.com/typicaleoxx |
| LinkedIn | linkedin.com/in/snehalama |

## Send a Message

[Name field]
[Email field]
[Subject field]
[Message field]
[Send button]
```

- Formspree integration for form submission
- Email rendered via JS to avoid scrapers
- Success and error states shown inline after submit

---

## 8. Design System

### Colors

| Token | Value | Use |
|-------|-------|-----|
| `--bg-editor` | `#1e1e1e` | Main editor background |
| `--bg-sidebar` | `#252526` | Explorer and panel backgrounds |
| `--bg-tab-inactive` | `#2d2d2d` | Inactive tabs |
| `--bg-tab-active` | `#1e1e1e` | Active tab |
| `--bg-statusbar` | `#007acc` | Status bar |
| `--accent-blue` | `#569cd6` | Keywords, links, JSON keys |
| `--accent-green` | `#4ec9b0` | Class names, success states |
| `--accent-orange` | `#ce9178` | Strings |
| `--accent-yellow` | `#dcdcaa` | Function names, headings |
| `--accent-purple` | `#c586c0` | Control flow, bold |
| `--text-primary` | `#d4d4d4` | Body text |
| `--text-muted` | `#858585` | Line numbers, comments |
| `--border` | `#3c3c3c` | Dividers |
| `--selection` | `#264f78` | Text selection |

### Light Theme

Triggered by Toggle Theme. Swaps to a One Light-inspired palette. All `--tokens` swap. No layout changes.

### Typography

| Use | Font |
|-----|------|
| Editor content | `'Fira Code', 'Cascadia Code', 'Consolas', monospace` |
| UI labels | `'Segoe UI', system-ui, sans-serif` |
| Editor font size | 14px, line-height 1.6 |
| UI font size | 13px |

### Animations

- Tab open: 80ms fade
- Sidebar expand/collapse: 150ms ease
- Command palette open: 100ms scale from 0.97 + fade
- Terminal slide: 200ms ease
- Cursor blink: CSS animation, 1s interval
- "Open to Work" dot: CSS pulse, 2s loop
- All transitions respect `prefers-reduced-motion: reduce`

---

## 9. Interactive Features

| Feature | Trigger | Priority |
|---------|---------|----------|
| File explorer navigation | Click | P0 |
| Tab open, close, switch | Click, Ctrl+W, Ctrl+Tab | P0 |
| Syntax-highlighted content | Auto on render | P0 |
| Breadcrumbs | Auto on tab switch | P0 |
| Command palette | Ctrl+K, search icon | P0 |
| Fuzzy search in palette | Typing | P0 |
| Keyboard navigation throughout | Arrows, Enter, Escape | P0 |
| Resume download | File click or command | P0 |
| Welcome file on first visit | Auto | P0 |
| Contact form with Formspree | Submit | P1 |
| Responsive layout | Viewport resize | P1 |
| Theme toggle | Command or shortcut | P1 |
| Minimap scroll | Click | P2 |
| Terminal panel | Ctrl+backtick | P2 |
| Easter eggs | Commands and status bar | P2 |
| Boot/loading sequence | First visit | P2 |

---

## 10. Responsive Design

| Breakpoint | Behavior |
|------------|----------|
| 1024px+ | Full VS Code layout |
| 768-1024px | Sidebar collapsible, tab bar scrolls |
| Below 768px | Sidebar becomes a drawer with a toggle button, editor is full width, command palette still works |

On mobile the VS Code aesthetic is secondary to usability. Labels and buttons must be clearly tappable (minimum 44px touch targets).

---

## 11. Performance Requirements

- First Contentful Paint under 1 second
- No frameworks, no npm, no build step
- All assets combined under 100KB before compression
- Avatar image: WebP, under 50KB
- SVG icons inlined or loaded as `<img>` (no icon font)
- Content lazy-loaded when a tab is opened, not on page load
- No third-party analytics by default

---

## 12. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Open command palette |
| Ctrl+W | Close active tab |
| Ctrl+Tab | Next tab |
| Ctrl+Shift+Tab | Previous tab |
| Ctrl+backtick | Toggle terminal |
| Escape | Close palette or terminal |
| Arrow Up/Down | Navigate palette or file tree |
| Enter | Open selected item |
| Space | Toggle folder in explorer |

---

## 13. Build Phases

### Phase 1 — Shell
- Title bar, activity bar, file explorer, tab bar, editor area, status bar
- Color system and typography in CSS variables
- Static welcome.md and about-me.md rendering

### Phase 2 — Navigation and Content
- Folder expand/collapse, tab open/close/switch
- Syntax highlighting for Markdown and JSON
- All content pages filled in
- Breadcrumbs and minimap
- Resume download

### Phase 3 — Command Palette
- Overlay, fuzzy search, keyboard navigation
- All commands wired up
- Theme toggle (dark/light)

### Phase 4 — Polish and Responsive
- Mobile and tablet layouts
- Contact form with Formspree
- Animations, transitions, reduced-motion support
- First-visit welcome behavior and sidebar tooltip

### Phase 5 — Extras
- Terminal panel with all commands
- Easter eggs (git log, problems panel)
- Boot sequence on first load

---

## 14. Deployment

- Repo: github.com/typicaleoxx/sneha-lama.github.io
- Hosting: GitHub Pages, branch `main`, root `/`
- No build step: push HTML/CSS/JS directly
- CNAME file ready for snehalama.dev when purchased

---

## 15. What This Project Demonstrates

- **UI system design from scratch:** a multi-component interface with no framework
- **State management:** tabs, navigation history, palette state, theme, all in vanilla JS
- **Keyboard interaction design:** a full shortcut system mirroring a real IDE
- **Performance discipline:** no bloat, fast load, intentional tradeoffs
- **Accessibility awareness:** keyboard navigation, reduced-motion, touch targets on mobile
- **Attention to craft:** cursor blink, minimap, status bar clock, easter eggs

---

## 16. Out of Scope (for now)

- GitHub activity graph integration
- Analytics dashboard
- Search indexing across content
- Additional theme variations
- CMS or admin panel

---
