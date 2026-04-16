/* global FILES, TREE, COMMANDS, TERMINAL_RESPONSES, FORMSPREE_URL */

/* ================================================================
   STATE
   ================================================================ */
const state = {
  tabs: [],
  activeTabId: null,
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'dark',
  paletteOpen: false,
  terminalOpen: false,
  problemsOpen: false,
  paletteHistory: JSON.parse(localStorage.getItem('paletteHistory') || '[]'),
  terminalHistory: [],
  terminalHistoryIndex: -1,
  activePaletteIndex: 0,
  filteredCommands: [],
  resizing: false,
  resizeStartX: 0,
  resizeStartW: 0,
};

/* ================================================================
   UTILS
   ================================================================ */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function $(id) { return document.getElementById(id); }

function fileExt(name) {
  const m = name.match(/\.([^.]+)$/);
  return m ? m[1] : '';
}

function fileBase(name) {
  return name.replace(/\.[^.]+$/, '');
}

function tabId(path) {
  return 'tab-' + path.replace(/[^a-z0-9]/gi, '-');
}

function showToast(msg, duration = 2400) {
  const t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.hidden = true; }, duration);
}

/* ================================================================
   THEME
   ================================================================ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  state.theme = theme;
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  showToast('Theme switched to ' + state.theme);
}

/* ================================================================
   FILE ICONS (inline SVG strings)
   ================================================================ */
const ICONS = {
  'file-md': `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="tree-icon icon-md">
    <rect x="2" y="1" width="10" height="14" rx="1" stroke="currentColor" stroke-width="1.2"/>
    <path d="M5 6h6M5 8.5h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,
  'file-json': `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="tree-icon icon-json">
    <rect x="2" y="1" width="10" height="14" rx="1" stroke="currentColor" stroke-width="1.2"/>
    <path d="M5 5.5l-1 .5 1 .5M11 5.5l1 .5-1 .5M8 5l-1 4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
  </svg>`,
  'file-pdf': `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="tree-icon icon-pdf">
    <rect x="2" y="1" width="10" height="14" rx="1" stroke="currentColor" stroke-width="1.2"/>
    <text x="4.5" y="10" font-size="5" fill="currentColor" font-family="sans-serif" font-weight="bold">PDF</text>
  </svg>`,
  'folder': `<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="tree-icon icon-folder">
    <path d="M1.5 4.5A1.5 1.5 0 013 3h3.086a1.5 1.5 0 011.06.44l.915.914A.5.5 0 008.414 4.5H13A1.5 1.5 0 0114.5 6v5.5A1.5 1.5 0 0113 13H3a1.5 1.5 0 01-1.5-1.5V4.5z"/>
  </svg>`,
  'folder-open': `<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="tree-icon icon-folder">
    <path d="M1.5 4.5A1.5 1.5 0 013 3h3.086a1.5 1.5 0 011.06.44l.915.914A.5.5 0 008.414 4.5H13A1.5 1.5 0 0114.5 6v.5H2.5A1 1 0 001.5 7.5v4A1.5 1.5 0 003 13h10a1.5 1.5 0 001.5-1.5v-5A1.5 1.5 0 0013 5H8.414l-.915-.914A1.5 1.5 0 006.086 3.5H3A1.5 1.5 0 001.5 5v-.5z"/>
  </svg>`,
  'chevron': `<svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'close': `<svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>`,
  'external': `<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z"/></svg>`,
  'theme': `<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.5V13.5A5.5 5.5 0 018 2.5z"/></svg>`,
  'terminal': `<svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M0 2.5A1.5 1.5 0 011.5 1h13A1.5 1.5 0 0116 2.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 010 13.5v-11zM1.5 2a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-13zM2 6l4 4-4 4 1 1 5-5-5-5-1 1zm5 6h7v-1H7v1z"/></svg>`,
};

function getFileIcon(name) {
  const ext = fileExt(name);
  if (ext === 'md')   return ICONS['file-md'];
  if (ext === 'json') return ICONS['file-json'];
  if (ext === 'pdf')  return ICONS['file-pdf'];
  return ICONS['file-md'];
}

function getPaletteIcon(type) {
  return ICONS[type] || ICONS['file-md'];
}

/* ================================================================
   FILE TREE
   ================================================================ */
const treeState = {};

function buildTree(container, nodes, depth = 0, parentPath = '') {
  nodes.forEach(node => {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;

    if (node.type === 'folder') {
      if (treeState[path] === undefined) treeState[path] = false;

      const row = document.createElement('div');
      row.className = 'tree-row';
      row.setAttribute('role', 'treeitem');
      row.setAttribute('aria-expanded', treeState[path]);
      row.dataset.path = path;
      row.dataset.type = 'folder';
      row.innerHTML = `
        <span class="tree-indent" style="width:${depth * 16}px"></span>
        <span class="tree-chevron${treeState[path] ? ' open' : ''}">${ICONS.chevron}</span>
        ${treeState[path] ? ICONS['folder-open'] : ICONS['folder']}
        <span class="tree-name">${esc(node.name)}</span>
      `;
      container.appendChild(row);

      const childContainer = document.createElement('div');
      childContainer.className = 'tree-children';
      childContainer.hidden = !treeState[path];
      container.appendChild(childContainer);

      buildTree(childContainer, node.children, depth + 1, path);

      row.addEventListener('click', (e) => {
        e.stopPropagation();
        treeState[path] = !treeState[path];
        rebuildTree();
      });

    } else {
      const row = document.createElement('div');
      row.className = 'tree-row';
      row.setAttribute('role', 'treeitem');
      row.dataset.path = path;
      row.dataset.type = 'file';
      row.innerHTML = `
        <span class="tree-indent" style="width:${(depth * 16) + 16}px"></span>
        ${getFileIcon(node.name)}
        <span class="tree-name">${esc(node.name)}</span>
      `;
      container.appendChild(row);

      row.addEventListener('click', () => openFile(path));
    }
  });
}

function rebuildTree() {
  const container = $('file-tree');
  container.innerHTML = '';
  buildTree(container, TREE);
  highlightActiveInTree();
}

function highlightActiveInTree() {
  const activeTab = state.tabs.find(t => t.id === state.activeTabId);
  document.querySelectorAll('.tree-row').forEach(row => {
    row.classList.toggle('active', activeTab ? row.dataset.path === activeTab.path : false);
  });
}

function expandFolder(folderName) {
  const key = Object.keys(treeState).find(k => k === folderName || k.endsWith('/' + folderName));
  if (key !== undefined) {
    treeState[key] = true;
    rebuildTree();
  }
}

/* ================================================================
   TABS
   ================================================================ */
function openFile(path) {
  const existing = state.tabs.find(t => t.path === path);
  if (existing) {
    switchTab(existing.id);
    return;
  }

  const id = tabId(path);
  const name = path.split('/').pop();
  state.tabs.push({ id, path, name });
  switchTab(id);
}

function switchTab(id) {
  state.activeTabId = id;
  renderTabs();
  renderEditor();
  highlightActiveInTree();
}

function closeTab(id, e) {
  if (e) e.stopPropagation();
  const idx = state.tabs.findIndex(t => t.id === id);
  if (idx === -1) return;
  state.tabs.splice(idx, 1);

  if (state.activeTabId === id) {
    const next = state.tabs[idx] || state.tabs[idx - 1];
    state.activeTabId = next ? next.id : null;
  }

  renderTabs();
  renderEditor();
  highlightActiveInTree();
}

function closeAllTabs() {
  state.tabs = [];
  state.activeTabId = null;
  renderTabs();
  renderEditor();
  highlightActiveInTree();
  showToast('All tabs closed');
}

function renderTabs() {
  const inner = $('tabbar-inner');
  inner.innerHTML = '';

  state.tabs.forEach(tab => {
    const div = document.createElement('div');
    div.className = 'tab' + (tab.id === state.activeTabId ? ' active' : '');
    div.setAttribute('role', 'tab');
    div.setAttribute('aria-selected', tab.id === state.activeTabId);
    div.setAttribute('title', tab.path);
    div.innerHTML = `
      ${getFileIcon(tab.name)}
      <span class="tab-name">${esc(tab.name)}</span>
      <button class="tab-close" title="Close" aria-label="Close ${esc(tab.name)}">${ICONS.close}</button>
    `;
    div.addEventListener('click', () => switchTab(tab.id));
    div.querySelector('.tab-close').addEventListener('click', (e) => closeTab(tab.id, e));
    div.addEventListener('mousedown', (e) => { if (e.button === 1) closeTab(tab.id); });
    inner.appendChild(div);
  });
}

/* ================================================================
   MARKDOWN RENDERER
   ================================================================ */
function inlineMd(text) {
  text = esc(text);
  // bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // italic
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // link
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const safeHref = href.startsWith('mailto:') || href.startsWith('http') ? href : '#';
    return `<a href="${esc(safeHref)}" target="_blank" rel="noopener">${label}</a>`;
  });
  return text;
}

function highlightJSON(raw) {
  return esc(raw)
    .replace(/"([^"]+)"(\s*:)/g, '<span class="json-key">"$1"</span>$2')
    .replace(/:\s*"([^"]*)"/g, (_, v) => `: <span class="json-string">"${v}"</span>`)
    .replace(/:\s*(\d+\.?\d*)/g, (_, v) => `: <span class="json-number">${v}</span>`)
    .replace(/:\s*(true|false)/g, (_, v) => `: <span class="json-boolean">${v}</span>`)
    .replace(/:\s*(null)/g, `: <span class="json-null">null</span>`)
    .replace(/([{}\[\],])/g, '<span class="json-punct">$1</span>');
}

function renderMarkdown(text) {
  const lines = text.split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim().toLowerCase();
      let code = '';
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      const inner = lang === 'json' ? highlightJSON(code.trimEnd()) : `<span>${esc(code.trimEnd())}</span>`;
      html += `<pre><span class="code-lang-label">${esc(lang)}</span><code>${inner}</code></pre>`;
      i++;
      continue;
    }

    // headings
    const hm = line.match(/^(#{1,4})\s+(.*)/);
    if (hm) {
      const lvl = hm[1].length;
      html += `<h${lvl}>${inlineMd(hm[2])}</h${lvl}>`;
      i++;
      continue;
    }

    // hr
    if (/^---+$/.test(line.trim())) {
      html += '<hr>';
      i++;
      continue;
    }

    // contact form
    if (line.includes('<contact-form>')) {
      html += renderContactForm();
      i++;
      continue;
    }

    // table — detect header + separator
    if (line.startsWith('|') && lines[i + 1] && /^\|[-| :]+\|/.test(lines[i + 1])) {
      const headers = line.split('|').slice(1, -1);
      html += '<table><thead><tr>' +
        headers.map(h => `<th>${inlineMd(h.trim())}</th>`).join('') +
        '</tr></thead><tbody>';
      i += 2;
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i].split('|').slice(1, -1);
        html += '<tr>' + cells.map(c => `<td>${inlineMd(c.trim())}</td>`).join('') + '</tr>';
        i++;
      }
      html += '</tbody></table>';
      continue;
    }

    // unordered list
    if (/^[-*] /.test(line)) {
      html += '<ul>';
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        html += `<li>${inlineMd(lines[i].slice(2))}</li>`;
        i++;
      }
      html += '</ul>';
      continue;
    }

    // ordered list
    if (/^\d+\. /.test(line)) {
      html += '<ol>';
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        html += `<li>${inlineMd(lines[i].replace(/^\d+\. /, ''))}</li>`;
        i++;
      }
      html += '</ol>';
      continue;
    }

    // blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // paragraph
    html += `<p>${inlineMd(line)}</p>`;
    i++;
  }

  return html;
}

function renderPDFFile(filename) {
  return `
    <div class="pdf-viewer">
      <div class="pdf-toolbar">
        <span class="pdf-filename">${esc(filename)}</span>
        <a class="pdf-download-btn" href="assets/${esc(filename)}" download="${esc(filename)}">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M8 12l-4-4h2.5V2h3v6H12L8 12zm-5 2h10v-1H3v1z"/></svg>
          Download
        </a>
      </div>
      <iframe
        class="pdf-frame"
        src="assets/${esc(filename)}"
        title="${esc(filename)}"
      ></iframe>
    </div>
  `;
}

function renderJSONFile(text) {
  let formatted;
  try {
    formatted = JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    formatted = text;
  }
  return `<pre style="margin:0;padding:0;background:none;border:none"><code>${highlightJSON(formatted)}</code></pre>`;
}

function renderContactForm() {
  return `
    <form class="contact-form" id="contact-form">
      <div class="form-row">
        <label for="cf-name">Name</label>
        <input type="text" id="cf-name" name="name" placeholder="Your name" required>
      </div>
      <div class="form-row">
        <label for="cf-email">Email</label>
        <input type="email" id="cf-email" name="email" placeholder="your@email.com" required>
      </div>
      <div class="form-row">
        <label for="cf-subject">Subject</label>
        <input type="text" id="cf-subject" name="subject" placeholder="What's this about?">
      </div>
      <div class="form-row">
        <label for="cf-msg">Message</label>
        <textarea id="cf-msg" name="message" placeholder="What's on your mind?" required></textarea>
      </div>
      <div class="form-submit">
        <button type="submit" class="btn-send">Send message</button>
        <span class="form-status" id="form-status"></span>
      </div>
    </form>
  `;
}

function wireContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-send');
    const status = document.getElementById('form-status');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    status.className = 'form-status';
    status.textContent = '';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (res.ok) {
        status.className = 'form-status success';
        status.textContent = 'Message sent!';
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = 'Something went wrong. Email directly: lsneha991@gmail.com';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send message';
    }
  });
}

/* ================================================================
   EDITOR RENDER
   ================================================================ */
function renderEditor() {
  const emptyEl  = $('editor-empty');
  const paneEl   = $('editor-pane');
  const contentEl = $('editor-content');
  const gutterEl  = $('gutter');
  const bcrumbEl  = $('breadcrumb');
  const filetypeEl = $('sb-filetype');

  if (!state.activeTabId) {
    emptyEl.hidden  = false;
    paneEl.hidden   = true;
    filetypeEl.textContent = '-';
    return;
  }

  const tab = state.tabs.find(t => t.id === state.activeTabId);
  if (!tab) return;

  emptyEl.hidden = true;
  paneEl.hidden  = false;

  const ext = fileExt(tab.name);

  if (ext === 'pdf') {
    gutterEl.innerHTML = '';
    contentEl.innerHTML = renderPDFFile(tab.name);
    filetypeEl.textContent = 'PDF';
    const parts = tab.path.split('/');
    bcrumbEl.innerHTML = parts.map((part, idx) => {
      const isLast = idx === parts.length - 1;
      const partPath = parts.slice(0, idx + 1).join('/');
      const icon = idx === 0 ? '' : (isLast ? getFileIcon(part) : ICONS['folder']);
      return `<span class="breadcrumb-seg">${idx > 0 ? '<span class="breadcrumb-sep">›</span>' : ''}${icon}<a data-path="${esc(partPath)}">${esc(part)}</a></span>`;
    }).join('');
    syncEditorPadding();
    return;
  }

  const rawContent = FILES[tab.path] || `# ${esc(tab.name)}\n\nContent coming soon.`;

  // render content
  let rendered;
  if (ext === 'json') {
    rendered = renderJSONFile(rawContent);
    filetypeEl.textContent = 'JSON';
  } else {
    rendered = renderMarkdown(rawContent);
    filetypeEl.textContent = 'Markdown';
  }

  contentEl.innerHTML = rendered;

  // wire contact form if present
  wireContactForm();

  // breadcrumb
  const parts = tab.path.split('/');
  bcrumbEl.innerHTML = parts.map((part, idx) => {
    const isLast = idx === parts.length - 1;
    const partPath = parts.slice(0, idx + 1).join('/');
    const icon = idx === 0 ? '' : (isLast ? getFileIcon(part) : ICONS['folder']);
    return `<span class="breadcrumb-seg">${idx > 0 ? '<span class="breadcrumb-sep">›</span>' : ''}${icon}<a data-path="${esc(partPath)}">${esc(part)}</a></span>`;
  }).join('');

  bcrumbEl.querySelectorAll('a[data-path]').forEach(a => {
    a.addEventListener('click', () => {
      const p = a.dataset.path;
      if (FILES[p]) openFile(p);
    });
  });

  // line numbers
  const lineCount = rawContent.split('\n').length;
  gutterEl.innerHTML = Array.from({ length: lineCount }, (_, i) =>
    `<span class="gutter-line">${i + 1}</span>`
  ).join('');

  // scroll to top on new file
  const scroll = $('editor-scroll');
  if (scroll) scroll.scrollTop = 0;

  // keep padding in sync with terminal height
  syncEditorPadding();

  // update minimap
  updateMinimap();
}

/* ================================================================
   MINIMAP
   ================================================================ */
function updateMinimap() {
  const content = $('editor-content');
  const inner   = $('minimap-inner');
  const slider  = $('minimap-slider');
  const scroll  = $('editor-scroll');
  if (!inner || !scroll || !content) return;

  inner.innerHTML = content.innerHTML;

  function syncSlider() {
    const ratio = scroll.scrollTop / (scroll.scrollHeight - scroll.clientHeight || 1);
    const mapH  = $('minimap').clientHeight;
    const sliderH = Math.max(20, mapH * (scroll.clientHeight / (scroll.scrollHeight || 1)));
    slider.style.height = sliderH + 'px';
    slider.style.top    = (ratio * (mapH - sliderH)) + 'px';
  }

  syncSlider();
  content.addEventListener('scroll', syncSlider, { passive: true });

  $('minimap').onclick = (e) => {
    const mapH = $('minimap').clientHeight;
    const ratio = e.offsetY / mapH;
    const scroll = $('editor-scroll');
    scroll.scrollTop = ratio * scroll.scrollHeight;
  };
}

/* ================================================================
   SIDEBAR PANELS
   ================================================================ */
function showPanel(panel) {
  // mark activity bar
  document.querySelectorAll('.ab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.ab-btn[data-panel="${panel}"]`);
  if (btn) btn.classList.add('active');

  const sidebar = $('sidebar');
  const header  = sidebar.querySelector('.sidebar-header .sidebar-title');
  const tree    = $('file-tree');

  switch (panel) {
    case 'explorer':
      header.textContent = 'SNEHA_LAMA';
      tree.innerHTML = '';
      buildTree(tree, TREE);
      highlightActiveInTree();
      break;

    case 'search':
      openPalette();
      return;

    case 'git':
      header.textContent = 'SOURCE CONTROL';
      tree.innerHTML = `<div class="git-panel"><pre>
<span class="git-commit-hash">a1b2c3d</span> <span style="color:var(--text-muted)">(HEAD → main)</span>
<span class="git-author">Sneha Lama</span> &lt;lsneha991@gmail.com&gt;
   finally finished the portfolio at 2am

<span class="git-commit-hash">f9e8d7c</span>
<span class="git-author">Sneha Lama</span>
   fixed that one bug that was definitely not my fault

<span class="git-commit-hash">3a4b5c6</span>
<span class="git-author">Sneha Lama</span>
   added more projects (hired yet?)

<span class="git-commit-hash">7f8e9d0</span>
<span class="git-author">Sneha Lama</span>
   initial commit: existence
</pre></div>`;
      break;

    case 'extensions':
      header.textContent = 'SKILLS';
      renderSkillsPanel(tree);
      break;
  }
}

function renderSkillsPanel(container) {
  let raw;
  try { raw = JSON.parse(FILES['skills.json']); } catch { return; }

  container.innerHTML = '';
  const panel = document.createElement('div');
  panel.className = 'skills-panel';

  const sectionOrder = [
    ['languages', 'Languages'],
    ['frameworks', 'Frameworks'],
    ['security', 'Security'],
    ['tools', 'Tools'],
    ['databases', 'Databases'],
    ['cloud', 'Cloud'],
    ['certifications', 'Certifications'],
    ['currently_learning', 'Learning'],
  ];

  sectionOrder.forEach(([key, label]) => {
    if (!raw[key] || !raw[key].length) return;
    const section = document.createElement('div');
    section.className = 'skills-section';

    const hdr = document.createElement('div');
    hdr.className = 'skills-section-header';
    hdr.textContent = label;
    section.appendChild(hdr);

    const items = document.createElement('div');
    items.className = 'skills-items';
    raw[key].forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = skill;
      tag.title = skill;
      items.appendChild(tag);
    });
    section.appendChild(items);
    panel.appendChild(section);
  });

  container.appendChild(panel);
}

/* ================================================================
   COMMAND PALETTE
   ================================================================ */
function openPalette() {
  state.paletteOpen = true;
  const overlay = $('palette-overlay');
  overlay.hidden = false;
  const input = $('palette-input');
  input.value = '';
  input.focus();
  renderPaletteResults('');
}

function closePalette() {
  state.paletteOpen = false;
  $('palette-overlay').hidden = true;
}

function fuzzyScore(query, label) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const s = label.toLowerCase();
  const exact = s.indexOf(q);
  if (exact !== -1) return 1000 - exact;
  let qi = 0, score = 0;
  for (let i = 0; i < s.length && qi < q.length; i++) {
    if (s[i] === q[qi]) { score += 10; qi++; }
  }
  return qi === q.length ? score : -1;
}

function renderPaletteResults(query) {
  const resultsEl = $('palette-results');
  const labelEl   = $('palette-label');

  let items;
  if (!query) {
    labelEl.textContent = 'Recently Used';
    const recent = state.paletteHistory.slice(0, 5);
    items = recent.length
      ? COMMANDS.filter(c => recent.includes(c.id))
      : COMMANDS.slice(0, 8);
  } else {
    labelEl.textContent = 'Commands';
    items = COMMANDS
      .map(c => ({ cmd: c, score: fuzzyScore(query, c.label) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.cmd);
  }

  state.filteredCommands = items;
  state.activePaletteIndex = 0;
  resultsEl.innerHTML = '';

  items.forEach((cmd, idx) => {
    const div = document.createElement('div');
    div.className = 'palette-item' + (idx === 0 ? ' selected' : '');
    div.setAttribute('role', 'option');
    div.setAttribute('aria-selected', idx === 0);
    div.dataset.idx = idx;
    div.innerHTML = `
      <span class="palette-item-icon">${getPaletteIcon(cmd.icon)}</span>
      <span class="palette-item-label">${highlightMatch(cmd.label, query)}</span>
    `;
    div.addEventListener('mouseenter', () => selectPaletteItem(idx));
    div.addEventListener('click', () => runPaletteCommand(cmd));
    resultsEl.appendChild(div);
  });
}

function highlightMatch(label, query) {
  if (!query) return esc(label);
  const q = query.toLowerCase();
  const s = label.toLowerCase();
  const idx = s.indexOf(q);
  if (idx !== -1) {
    return esc(label.slice(0, idx)) +
      `<mark>${esc(label.slice(idx, idx + q.length))}</mark>` +
      esc(label.slice(idx + q.length));
  }
  let result = '';
  let qi = 0;
  for (let i = 0; i < label.length; i++) {
    if (qi < q.length && label[i].toLowerCase() === q[qi]) {
      result += `<mark>${esc(label[i])}</mark>`;
      qi++;
    } else {
      result += esc(label[i]);
    }
  }
  return result;
}

function selectPaletteItem(idx) {
  state.activePaletteIndex = idx;
  document.querySelectorAll('.palette-item').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
    el.setAttribute('aria-selected', i === idx);
  });
}

function runPaletteCommand(cmd) {
  // track history
  state.paletteHistory = [cmd.id, ...state.paletteHistory.filter(id => id !== cmd.id)].slice(0, 10);
  localStorage.setItem('paletteHistory', JSON.stringify(state.paletteHistory));

  closePalette();
  cmd.action();
}

/* ================================================================
   TERMINAL
   ================================================================ */
function syncEditorPadding() {
  const content = $('editor-content');
  if (!content) return;
  const panel = $('terminal-panel');
  const termH = (state.terminalOpen && panel) ? panel.offsetHeight : 0;
  content.style.paddingBottom = (termH + 32) + 'px';
}

function toggleTerminal(forceOpen) {
  const panel = $('terminal-panel');
  const shouldOpen = forceOpen !== undefined ? forceOpen : panel.hidden;
  state.terminalOpen = shouldOpen;
  panel.hidden = !shouldOpen;
  if (shouldOpen) {
    $('terminal-input').focus();
    if ($('terminal-output').children.length === 0) {
      printTerminal(`<span class="t-green">sneha@portfolio</span>:<span class="t-blue">~</span>$ Welcome. Type <span class="t-blue">help</span> to see available commands.`);
    }
  }
  syncEditorPadding();
}

function printTerminal(html) {
  const out = $('terminal-output');
  const line = document.createElement('span');
  line.className = 't-line';
  line.innerHTML = html;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

function runTerminalCommand(raw) {
  const cmd = raw.trim().toLowerCase();

  printTerminal(`<span class="t-prompt-text">sneha@portfolio:~$</span> <span class="t-cmd">${esc(raw)}</span>`);

  if (!cmd) return;

  // history tracking
  state.terminalHistory.unshift(raw);
  state.terminalHistoryIndex = -1;

  if (cmd === 'clear') {
    $('terminal-output').innerHTML = '';
    return;
  }

  if (cmd === 'open resume' || cmd === 'open resume.pdf') {
    downloadResume();
    printTerminal('<span class="t-green">downloading resume.pdf...</span>');
    return;
  }

  if (cmd.startsWith('open ')) {
    const target = cmd.slice(5).trim();
    const match = Object.keys(FILES).find(k =>
      k.endsWith(target) || k.endsWith(target + '.md') || k.endsWith(target + '.json')
    );
    if (match) {
      openFile(match);
      printTerminal(`<span class="t-green">opened ${match}</span>`);
    } else {
      printTerminal(`<span class="t-error">file not found: ${esc(target)}</span>`);
    }
    return;
  }

  const response = TERMINAL_RESPONSES[cmd];
  if (response) {
    printTerminal(response);
  } else {
    printTerminal(`<span class="t-error">command not found: ${esc(cmd)}</span> - type <span class="t-blue">help</span>`);
  }
}

/* ================================================================
   RESUME DOWNLOAD
   ================================================================ */
function downloadResume(filename) {
  const file = filename || 'Sneha_Lama_SWE.pdf';
  const a = document.createElement('a');
  a.href = 'assets/' + file;
  a.download = file;
  a.click();
  showToast('Downloading ' + file + '...');
}

/* ================================================================
   STATUS BAR CLOCK
   ================================================================ */
function startClock() {
  function tick() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    $('sb-clock').textContent = `${h}:${m}`;
  }
  tick();
  setInterval(tick, 10000);
}

/* ================================================================
   RESIZE HANDLE
   ================================================================ */
function initResize() {
  const handle = $('resize-handle');
  const sidebar = $('sidebar');
  if (!handle || !sidebar) return;

  handle.addEventListener('mousedown', (e) => {
    state.resizing = true;
    state.resizeStartX = e.clientX;
    state.resizeStartW = sidebar.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!state.resizing) return;
    const delta = e.clientX - state.resizeStartX;
    const newW = Math.min(480, Math.max(140, state.resizeStartW + delta));
    sidebar.style.width = newW + 'px';
    document.documentElement.style.setProperty('--sidebar-w', newW + 'px');
  });

  document.addEventListener('mouseup', () => {
    if (!state.resizing) return;
    state.resizing = false;
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
}

/* ================================================================
   MOBILE SIDEBAR
   ================================================================ */
function closeMobileSidebar() {
  const sidebar  = $('sidebar');
  const backdrop = $('sidebar-backdrop');
  const btn      = $('mobile-menu-btn');
  sidebar.classList.remove('open');
  backdrop.classList.remove('visible');
  btn.setAttribute('aria-expanded', false);
}

function initMobileSidebar() {
  const btn      = $('mobile-menu-btn');
  const sidebar  = $('sidebar');
  const backdrop = $('sidebar-backdrop');

  btn.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    backdrop.classList.toggle('visible', open);
    btn.setAttribute('aria-expanded', open);
  });

  // close via backdrop tap
  backdrop.addEventListener('click', closeMobileSidebar);

  // close on file open (mobile)
  $('file-tree').addEventListener('click', () => {
    if (window.innerWidth <= 768) closeMobileSidebar();
  });

  // close on swipe left
  let touchStartX = 0;
  sidebar.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  sidebar.addEventListener('touchend', (e) => {
    if (touchStartX - e.changedTouches[0].clientX > 60) closeMobileSidebar();
  }, { passive: true });
}

/* ================================================================
   KEYBOARD SHORTCUTS
   ================================================================ */
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey;

    // Command palette
    if (ctrl && e.key === 'k') {
      e.preventDefault();
      state.paletteOpen ? closePalette() : openPalette();
      return;
    }

    // Close tab
    if (ctrl && e.key === 'w') {
      e.preventDefault();
      if (state.activeTabId) closeTab(state.activeTabId);
      return;
    }

    // Cycle tabs
    if (ctrl && e.key === 'Tab') {
      e.preventDefault();
      if (state.tabs.length < 2) return;
      const idx = state.tabs.findIndex(t => t.id === state.activeTabId);
      const next = e.shiftKey
        ? (idx - 1 + state.tabs.length) % state.tabs.length
        : (idx + 1) % state.tabs.length;
      switchTab(state.tabs[next].id);
      return;
    }

    // Toggle terminal
    if (ctrl && e.key === '`') {
      e.preventDefault();
      toggleTerminal();
      return;
    }

    // Palette navigation
    if (state.paletteOpen) {
      if (e.key === 'Escape') { closePalette(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectPaletteItem(Math.min(state.activePaletteIndex + 1, state.filteredCommands.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectPaletteItem(Math.max(state.activePaletteIndex - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = state.filteredCommands[state.activePaletteIndex];
        if (cmd) runPaletteCommand(cmd);
        return;
      }
    }

    // Close terminal with Escape
    if (!state.paletteOpen && e.key === 'Escape' && state.terminalOpen) {
      toggleTerminal(false);
      return;
    }
  });

  // Terminal input handling
  const termInput = $('terminal-input');
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runTerminalCommand(termInput.value);
      termInput.value = '';
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.terminalHistoryIndex = Math.min(state.terminalHistoryIndex + 1, state.terminalHistory.length - 1);
      termInput.value = state.terminalHistory[state.terminalHistoryIndex] || '';
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.terminalHistoryIndex = Math.max(state.terminalHistoryIndex - 1, -1);
      termInput.value = state.terminalHistoryIndex >= 0 ? state.terminalHistory[state.terminalHistoryIndex] : '';
      return;
    }
  });

  // Palette input
  $('palette-input').addEventListener('input', (e) => {
    renderPaletteResults(e.target.value);
  });

  // Palette backdrop click
  $('palette-backdrop').addEventListener('click', closePalette);
}

/* ================================================================
   ACTIVITY BAR CLICKS
   ================================================================ */
function initActivityBar() {
  document.querySelectorAll('.ab-btn[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.panel;
      const sidebar = $('sidebar');

      if (btn.classList.contains('active') && panel !== 'search') {
        btn.classList.remove('active');
        sidebar.style.width = '0';
        sidebar.style.minWidth = '0';
        state.sidebarOpen = false;
      } else {
        if (!state.sidebarOpen) {
          sidebar.style.width = '';
          sidebar.style.minWidth = '';
          state.sidebarOpen = true;
        }
        showPanel(panel);
      }
    });
  });
}

/* ================================================================
   STATUS BAR CLICKS
   ================================================================ */
function initStatusBar() {
  $('sb-problems').addEventListener('click', () => {
    const panel = $('problems-panel');
    panel.hidden = !panel.hidden;
    state.problemsOpen = !panel.hidden;
  });

  $('problems-close').addEventListener('click', () => {
    $('problems-panel').hidden = true;
    state.problemsOpen = false;
  });
}

/* ================================================================
   TERMINAL CONTROLS + RESIZE
   ================================================================ */
function initTerminalControls() {
  $('terminal-close').addEventListener('click', () => toggleTerminal(false));
  $('terminal-clear').addEventListener('click', () => {
    $('terminal-output').innerHTML = '';
  });

  const handle = $('terminal-resize-handle');
  const panel  = $('terminal-panel');
  let dragging = false;
  let startY = 0;
  let startH = 0;

  handle.addEventListener('mousedown', (e) => {
    dragging = true;
    startY = e.clientY;
    startH = panel.offsetHeight;
    handle.classList.add('dragging');
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const delta = startY - e.clientY;
    const newH = Math.min(window.innerHeight * 0.7, Math.max(80, startH + delta));
    panel.style.height = newH + 'px';
    document.documentElement.style.setProperty('--terminal-h', newH + 'px');
    syncEditorPadding();
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  // touch support
  handle.addEventListener('touchstart', (e) => {
    dragging = true;
    startY = e.touches[0].clientY;
    startH = panel.offsetHeight;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const delta = startY - e.touches[0].clientY;
    const newH = Math.min(window.innerHeight * 0.7, Math.max(80, startH + delta));
    panel.style.height = newH + 'px';
    document.documentElement.style.setProperty('--terminal-h', newH + 'px');
  }, { passive: true });

  document.addEventListener('touchend', () => { dragging = false; });
}

/* ================================================================
   BOOT SEQUENCE
   ================================================================ */
function boot() {
  applyTheme(state.theme);

  const isFirstVisit = !localStorage.getItem('visited');
  const vscode = $('vscode');
  const bootScreen = $('boot-screen');
  const bootLine = $('boot-line');

  if (!isFirstVisit) {
    bootScreen.hidden = true;
    vscode.classList.add('visible');
    init();
    return;
  }

  localStorage.setItem('visited', '1');

  const text = 'sneha@portfolio:~$ ./portfolio.sh';
  let idx = 0;

  function typeChar() {
    if (idx < text.length) {
      bootLine.textContent += text[idx++];
      setTimeout(typeChar, 42);
    } else {
      setTimeout(() => {
        bootScreen.classList.add('hidden');
        vscode.classList.add('visible');
        setTimeout(init, 200);
        setTimeout(() => { bootScreen.hidden = true; }, 700);
      }, 500);
    }
  }

  setTimeout(typeChar, 300);
}

/* ================================================================
   INIT
   ================================================================ */
function init() {
  rebuildTree();
  renderTabs();
  renderEditor();
  startClock();
  initKeyboard();
  initActivityBar();
  initStatusBar();
  initTerminalControls();
  initResize();
  initMobileSidebar();

  // open welcome.md on first visit (after boot)
  const hasOpenedWelcome = localStorage.getItem('openedWelcome');
  if (!hasOpenedWelcome) {
    localStorage.setItem('openedWelcome', '1');
    setTimeout(() => openFile('welcome.md'), 100);
  }

  // open terminal on load
  setTimeout(() => toggleTerminal(true), 300);

  // sidebar hint for new visitors
  const hasSeenHint = localStorage.getItem('seenHint');
  if (!hasSeenHint) {
    localStorage.setItem('seenHint', '1');
    setTimeout(() => {
      showToast('Click any file on the left to open it, or press Ctrl+K', 4000);
    }, 1600);
  }
}

/* ================================================================
   START
   ================================================================ */
boot();
