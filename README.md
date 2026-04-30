# typicaleoxx.github.io

An interactive personal portfolio designed to feel like a real development environment. Instead of scrolling through a static page, you navigate files, open tabs, and explore projects the way developers actually work.

## Why this exists

Most portfolios are static and don’t reflect how engineers interact with systems. I built this to create a more natural and structured way to explore my work, while also pushing myself to think about UI state, navigation systems, and performance without relying on frameworks.

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

## Engineering Notes

- Built with plain JavaScript to maintain full control over state and rendering
- Designed as a single-page system with dynamic content loading
- Centralized content management through a single data file
- Focused on simplicity, performance, and maintainability

## Stack

- HTML, CSS, Vanilla JavaScript
- No frameworks, no build tools, no dependencies
- Hosted on GitHub Pages

## Content Structure

All portfolio content lives in one place:

data.js

Edit this file to update:
- projects
- experience
- skills
- personal content

## Local Development

No setup required:

npx serve .
# or
python3 -m http.server 5500

## Open Source / Reuse

Feel free to explore, learn from, or adapt this project for your own portfolio.

If you build something based on it, I’d love to see it, feel free to tag me or share it with me.


Built by Sneha Lama - [typicaleoxx.github.io](https://typicaleoxx.github.io)
