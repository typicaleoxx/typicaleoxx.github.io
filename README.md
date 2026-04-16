# sneha-lama.github.io

My personal portfolio, built to look and feel like VS Code.

You can navigate it like an IDE - click files in the explorer, open tabs, use `Ctrl+K` for the command palette, and `Ctrl+\`` for a terminal. It runs entirely in the browser with no frameworks or build step.

## What's inside

- **File explorer** with expand/collapse folders and active file highlighting
- **Tab system** - open multiple files, close with `Ctrl+W`, cycle with `Ctrl+Tab`
- **Command palette** (`Ctrl+K`) with fuzzy search across all navigation commands
- **Terminal** with real commands: `whoami`, `ls`, `open <file>`, `git log`, `skills`, and a few easter eggs
- **Syntax highlighting** for `.md` and `.json` files
- **Light/dark theme** toggle
- **Responsive** - works on mobile with a sidebar drawer and swipe-to-close
- **Contact form** powered by Formspree

## Stack

Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no dependencies. Hosted on GitHub Pages.

## Content

All content lives in `data.js`. To update anything - bio, projects, skills, experience - just edit that one file.

## Local development

No setup needed. Just open `index.html` in a browser, or run a local server:

```bash
npx serve .
# or
python3 -m http.server 5500
```

## Deploying

Push to the `main` branch. GitHub Pages serves it automatically from the root.

---

Built by Sneha Lama - [sneha-lama.github.io](https://sneha-lama.github.io)
