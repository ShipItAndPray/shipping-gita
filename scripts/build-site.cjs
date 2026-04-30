#!/usr/bin/env node
/**
 * build-site.cjs — Build the static site at docs/ from chapters/ + verse JSONs.
 *
 * IP DISCIPLINE
 * -------------
 * The site source lives in docs/. It contains ONLY:
 *   - chapters/02.md (Sanskrit + project's own engineering-layer prose)
 *   - chapters/02-index.md, chapters/02-by-tag.md
 *   - chapters/00-how-to-read.md
 *   - tags pulled from data/verses/*.json (just the strings, not the source pack excerpts)
 *
 * It does NOT include source-pack JSONs (data/sources/*.json) or any verbatim
 * Prabhupada / Mukundananda / Shankara / Ramanuja translations.
 *
 * No frameworks. No build step beyond `node scripts/build-site.cjs`. Pure HTML+CSS+JS.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHAPTERS = path.join(ROOT, 'chapters');
const VERSES = path.join(ROOT, 'data', 'verses');
const OUT = path.join(ROOT, 'docs');

// ---------------------------------------------------------------------------
// Tiny markdown renderer — handles the subset our chapter files actually use:
//   H1-H4, paragraphs, blockquotes, fenced code blocks, unordered/ordered lists,
//   bold (**x**), italic (*x*), links [t](u), inline code `x`, tables (pipe).
// The chapter markdown is well-formed by construction (we own the writers).
// ---------------------------------------------------------------------------

function slugifyForId(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// inline pass: applied to a single paragraph/line *after* HTML escaping.
function renderInline(s) {
  // Inline code first (so its contents aren't bold/italic-parsed).
  s = s.replace(/`([^`]+)`/g, (_, m) => `<code>${m}</code>`);
  // Links [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => {
    const url = u.trim();
    return `<a href="${url}">${t}</a>`;
  });
  // Bold **x** — non-greedy, no nested
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic *x* — must not start with a space, must not match ** (handled above)
  s = s.replace(/(^|[^*])\*([^*\n][^*\n]*?)\*(?!\*)/g, '$1<em>$2</em>');
  // em-dash double hyphen safety: (no transform — we expect real em-dashes already)
  return s;
}

function renderMarkdown(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;

  function flushParagraph(buf) {
    if (!buf.length) return;
    const text = buf.join(' ').trim();
    if (text) out.push(`<p>${renderInline(escapeHtml(text))}</p>`);
  }

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block ```
    if (/^```/.test(line)) {
      i++;
      const code = [];
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    // Heading — auto-id by slug of first inline-code token if present
    // (used by `## `tag-name` (N verses)` headings in 02-by-tag.md), else by full text.
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const raw = h[2];
      // Prefer the first inline-code span as the id (e.g. `operator-system-coupling`).
      const codeMatch = raw.match(/`([^`]+)`/);
      const idText = codeMatch ? codeMatch[1] : raw;
      const idAttr = ` id="${slugifyForId(idText)}"`;
      out.push(`<h${level}${idAttr}>${renderInline(escapeHtml(raw))}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote (one or more consecutive '> ...' lines)
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote><p>${renderInline(escapeHtml(buf.join(' ')))}</p></blockquote>`);
      continue;
    }

    // Pipe-table (header line followed by separator |---|---|)
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|[\s|:-]+\|\s*$/.test(lines[i + 1])) {
      const header = splitTableRow(line);
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      out.push(renderTable(header, rows));
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s+/, ''));
        i++;
      }
      const lis = items.map(it => `<li>${renderInline(escapeHtml(it))}</li>`).join('');
      out.push(`<ul>${lis}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      const lis = items.map(it => `<li>${renderInline(escapeHtml(it))}</li>`).join('');
      out.push(`<ol>${lis}</ol>`);
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph: gather contiguous non-blank, non-special lines
    const buf = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^[-*+]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    flushParagraph(buf);
  }

  return out.join('\n');
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(s => s.trim());
}

function renderTable(header, rows) {
  const th = header.map(h => `<th>${renderInline(escapeHtml(h))}</th>`).join('');
  const trs = rows
    .map(r => '<tr>' + r.map(c => `<td>${renderInline(escapeHtml(c))}</td>`).join('') + '</tr>')
    .join('');
  return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

// ---------------------------------------------------------------------------
// Chapter parsing — structural walk over chapters/02.md.
//
// Strategy: split into top-level sections by '## ' headings (the four major
// blocks + 'Chapter close'), and within each section split by '### BG 2.x — gloss'
// headings. For each verse, capture everything up to the next ### or ##.
// We render the per-verse body with renderMarkdown, then post-process the first
// ``` Sanskrit code block specifically (so we can style it as a Sanskrit anchor).
// ---------------------------------------------------------------------------

function loadTagsByVerseId() {
  const map = {};
  const files = fs.readdirSync(VERSES).filter(f => /^bg-2-\d+\.json$/.test(f));
  for (const f of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(VERSES, f), 'utf8'));
      const id = raw.id; // 'BG 2.47'
      const tags = (raw.engineering && raw.engineering.tags) || [];
      const confidence = (raw.engineering && raw.engineering.confidence) || null;
      const stretched = !!(raw.engineering && raw.engineering.stretched);
      map[id] = { tags, confidence, stretched };
    } catch (e) {
      // skip malformed
    }
  }
  return map;
}

function parseChapter02(md) {
  // Strip the chapter intro (everything before first '## ')
  const firstH2 = md.indexOf('\n## ');
  const intro = md.slice(0, firstH2).trim();
  const body = md.slice(firstH2);

  // Split into top-level sections at '## '
  const sectionRegex = /\n## (.+?)\n([\s\S]*?)(?=\n## |$)/g;
  const sections = [];
  let m;
  while ((m = sectionRegex.exec(body)) !== null) {
    sections.push({ title: m[1].trim(), body: m[2] });
  }

  // For each section split at '### BG 2.x' headings; everything before the first
  // ### is the section preface.
  for (const sec of sections) {
    const verseRegex = /\n### (BG 2\.\d+) — (.+?)\n([\s\S]*?)(?=\n### |$)/g;
    const firstVerseIdx = sec.body.search(/\n### BG 2\./);
    sec.preface = firstVerseIdx >= 0 ? sec.body.slice(0, firstVerseIdx).trim() : sec.body.trim();
    sec.verses = [];
    if (firstVerseIdx >= 0) {
      let vm;
      while ((vm = verseRegex.exec(sec.body)) !== null) {
        sec.verses.push({
          id: vm[1].trim(),
          gloss: vm[2].trim(),
          body: vm[3].trim(),
        });
      }
    }
  }

  return { intro, sections };
}

// Render a single verse body — special-case the first ```...``` block (Sanskrit).
function renderVerseBody(md) {
  // Pull out the first fenced block as the "sanskrit anchor"
  const fenceRe = /```([\s\S]*?)```/;
  const match = md.match(fenceRe);
  let sanskrit = null;
  let rest = md;
  if (match) {
    sanskrit = match[1].trim();
    rest = md.replace(fenceRe, '').trim();
  }

  const parts = [];
  if (sanskrit) {
    parts.push(`<div class="sanskrit"><pre>${escapeHtml(sanskrit)}</pre></div>`);
  }

  // The body has callout '> ...' lines that we want styled as quotables —
  // standard blockquote rendering is fine; we'll style via CSS.
  parts.push(renderMarkdown(rest));
  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// HTML page templating
// ---------------------------------------------------------------------------

const SITE_TITLE = 'The Shipping Gita';
const REPO_URL = 'https://github.com/ShipItAndPray/shipping-gita';

function pageShell({ title, description, body, activeNav, extraHead = '', extraScripts = '' }) {
  const navItem = (href, label, key) =>
    `<a href="${href}" class="nav-link${activeNav === key ? ' nav-active' : ''}">${label}</a>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="stylesheet" href="style.css">
${extraHead}
</head>
<body>
<header class="site-header">
  <a href="index.html" class="brand">${SITE_TITLE}</a>
  <nav class="site-nav">
    ${navItem('index.html', 'Home', 'home')}
    ${navItem('chapter-2.html', 'Chapter 2', 'chapter')}
    ${navItem('index-by-tag.html', 'By tag', 'tag')}
    ${navItem('how-to-read.html', 'How to read', 'how')}
    <a class="nav-link nav-external" href="${REPO_URL}">GitHub</a>
  </nav>
</header>
<main class="site-main">
${body}
</main>
<footer class="site-footer">
  <p>An engineering adaptation of the Bhagavad Gītā. Sanskrit is public domain. Engineering-layer prose is original to this project. Traditional commentaries are not reproduced here — they live, attributed and fair-use, in the project's private source packs.</p>
  <p class="muted"><a href="${REPO_URL}">${REPO_URL}</a></p>
</footer>
${extraScripts}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Page builders
// ---------------------------------------------------------------------------

function buildIndexPage(howToReadMd) {
  // Pull "What this book is" + "What this book is *not*" sections to use
  // a ~100 word excerpt on the home page.
  const whatThisBookIs = (howToReadMd.match(/## What this book is\n\n([\s\S]*?)\n\n##/) || [])[1] || '';
  // Trim to first paragraph
  const firstPara = whatThisBookIs.split('\n\n')[0].trim();

  const chapter2Card = `
    <a class="ch-card ch-live" href="chapter-2.html">
      <div class="ch-num">02</div>
      <div class="ch-title">Sāṅkhya Yoga / The First Principles for the Engineer</div>
      <div class="ch-meta">72 verses · complete</div>
      <div class="ch-blurb">The collapse and the first correction. The substrate that survives change. The discipline of action. The seasoned operator.</div>
    </a>`;

  const placeholderCards = [];
  for (let n = 3; n <= 18; n++) {
    placeholderCards.push(`
      <div class="ch-card ch-pending">
        <div class="ch-num">${String(n).padStart(2, '0')}</div>
        <div class="ch-title">Chapter ${n}</div>
        <div class="ch-meta">coming soon</div>
      </div>`);
  }

  const body = `
<section class="hero">
  <h1 class="hero-title">${SITE_TITLE}</h1>
  <p class="hero-subtitle">A verse-by-verse engineering adaptation of the Bhagavad Gītā.</p>
  <div class="hero-blurb">
    <p>${escapeHtml(firstPara)}</p>
    <p class="hero-cta"><a href="chapter-2.html" class="btn-primary">Read Chapter 2</a> <a href="how-to-read.html" class="btn-secondary">How to read</a></p>
  </div>
</section>

<section class="chapters">
  <h2>Chapters</h2>
  <div class="ch-grid">
    ${chapter2Card}
    ${placeholderCards.join('')}
  </div>
</section>

<section class="about">
  <h2>About</h2>
  <p>For each verse this site presents the Sanskrit (Devanāgarī + IAST), a short literal rendering, and an <em>engineering translation</em> — a longer prose reading in the register of someone who builds and operates software systems. The engineering reading is additive. It does not replace the Sanskrit, the literal meaning, or the traditional commentaries.</p>
  <p>This is not a claim that the Gītā is "really" a tech manual. It is not. It is a 2,500-year-old layered text that the world's traditions have read in many ways. The engineering reading is one register among many — the register where the project's author has found the operational doctrines transfer cleanly. That is the thesis the book makes, no more.</p>
</section>

<section class="ip-note">
  <h2>IP and fair use</h2>
  <ul>
    <li><strong>Sanskrit</strong> — public domain. Reproduced in full.</li>
    <li><strong>Literal renderings</strong> — short, attributed, fair-use.</li>
    <li><strong>Traditional commentaries</strong> (Śaṅkara, Rāmānuja, Prabhupāda, Mukundananda, etc.) — short fair-use excerpts live in the project's source packs (private repo). They are <em>not</em> reproduced on this site. The readable chapter on this site contains only Sanskrit and the project's own engineering-layer prose.</li>
    <li><strong>Engineering layer prose</strong> — original to this project, MIT-licensed.</li>
  </ul>
  <p>The project repository is at <a href="${REPO_URL}">${REPO_URL}</a>. The repo is currently private; access can be requested.</p>
</section>
`;

  return pageShell({
    title: SITE_TITLE,
    description: 'A verse-by-verse engineering adaptation of the Bhagavad Gita. Chapter 2 is complete.',
    body,
    activeNav: 'home',
  });
}

function buildHowToReadPage(md) {
  const html = renderMarkdown(md);
  const body = `<article class="prose">${html}</article>`;
  return pageShell({
    title: `How to read · ${SITE_TITLE}`,
    description: 'How to read The Shipping Gita: structure of a verse, the 84 quality gates, IP discipline, recommended order.',
    body,
    activeNav: 'how',
  });
}

function buildByTagPage(md) {
  // Rewrite "BG 2.X" verse references into anchor links to chapter-2.html#bg-2-X
  const linked = md.replace(/\*\*BG 2\.(\d+)\*\*/g, (_, n) => `**[BG 2.${n}](chapter-2.html#bg-2-${n})**`);
  const html = renderMarkdown(linked);
  const body = `<article class="prose tag-index">${html}</article>`;
  return pageShell({
    title: `By tag · ${SITE_TITLE}`,
    description: 'Chapter 2 verses grouped by engineering tag.',
    body,
    activeNav: 'tag',
  });
}

function buildChapter2Page(chapterMd, indexMd, tagMap) {
  const { intro, sections } = parseChapter02(chapterMd);

  // Build the TOC: for each section, list its verses by gloss.
  const tocSections = [];
  for (const sec of sections) {
    if (sec.title === 'Chapter close') {
      tocSections.push(`<li class="toc-section toc-close"><a href="#chapter-close">Chapter close</a></li>`);
      continue;
    }
    const items = sec.verses
      .map(v => {
        const slug = verseSlug(v.id);
        return `<li><a href="#${slug}"><span class="toc-num">${v.id.replace('BG ', '')}</span><span class="toc-gloss">${escapeHtml(v.gloss)}</span></a></li>`;
      })
      .join('');
    tocSections.push(`
      <li class="toc-section">
        <button class="toc-section-btn" aria-expanded="true">${escapeHtml(sec.title)}</button>
        <ol class="toc-verses">${items}</ol>
      </li>`);
  }

  // Render chapter intro
  const introHtml = renderMarkdown(intro);

  // Render each section
  const sectionHtml = sections.map(sec => {
    if (sec.title === 'Chapter close') {
      return `<section id="chapter-close" class="chapter-close">
        <h2>${escapeHtml(sec.title)}</h2>
        ${renderMarkdown(sec.preface)}
      </section>`;
    }
    const sectionId = 'sec-' + slugify(sec.title);
    const prefaceHtml = sec.preface ? renderMarkdown(sec.preface) : '';
    const versesHtml = sec.verses
      .map(v => {
        const slug = verseSlug(v.id);
        const tagInfo = tagMap[v.id] || { tags: [], confidence: null, stretched: false };
        const tagChips = tagInfo.tags
          .map(t => `<a href="index-by-tag.html#${slugify(t)}" class="tag-chip">${escapeHtml(t)}</a>`)
          .join('');
        const confChip = tagInfo.confidence
          ? `<span class="conf-chip conf-${tagInfo.confidence.toLowerCase()}">${escapeHtml(tagInfo.confidence)}</span>`
          : '';
        const stretchedChip = tagInfo.stretched ? `<span class="conf-chip conf-stretched">STRETCHED</span>` : '';
        return `
          <article id="${slug}" class="verse">
            <header class="verse-head">
              <h3 class="verse-h3"><a href="#${slug}" class="verse-anchor">§</a> <span class="verse-id">${escapeHtml(v.id)}</span> <span class="verse-em">—</span> <span class="verse-gloss">${escapeHtml(v.gloss)}</span></h3>
              <div class="verse-chips">${confChip}${stretchedChip}${tagChips}</div>
            </header>
            <div class="verse-body">
              ${renderVerseBody(v.body)}
            </div>
          </article>`;
      })
      .join('\n');

    return `<section id="${sectionId}" class="chapter-block">
      <h2>${escapeHtml(sec.title)}</h2>
      ${prefaceHtml}
      ${versesHtml}
    </section>`;
  }).join('\n');

  const body = `
<div class="chapter-layout">
  <aside class="toc">
    <button class="toc-toggle" aria-expanded="true" aria-controls="toc-list">Contents</button>
    <ol id="toc-list" class="toc-list">
      ${tocSections.join('')}
    </ol>
  </aside>
  <article class="chapter-prose">
    <header class="chapter-head">
      <h1>Chapter 2 — <em>Sāṅkhya Yoga</em></h1>
      <p class="chapter-sub">The First Principles for the Engineer · 72 verses</p>
    </header>
    ${introHtml}
    ${sectionHtml}
  </article>
</div>`;

  const tocScript = `
<script>
(function () {
  // Section collapse buttons
  document.querySelectorAll('.toc-section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.parentElement;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      li.classList.toggle('toc-collapsed', expanded);
    });
  });
  // Mobile-only TOC toggle
  const toggle = document.querySelector('.toc-toggle');
  const list = document.getElementById('toc-list');
  if (toggle && list) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      list.classList.toggle('toc-list-collapsed', expanded);
    });
  }
  // Highlight active verse on scroll
  const verses = document.querySelectorAll('article.verse');
  const linksById = new Map();
  document.querySelectorAll('.toc-verses a').forEach(a => {
    const id = a.getAttribute('href').slice(1);
    linksById.set(id, a);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const link = linksById.get(e.target.id);
        if (!link) return;
        if (e.isIntersecting) {
          document.querySelectorAll('.toc-verses a.toc-active').forEach(a => a.classList.remove('toc-active'));
          link.classList.add('toc-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    verses.forEach(v => observer.observe(v));
  }
})();
</script>`;

  return pageShell({
    title: `Chapter 2 · ${SITE_TITLE}`,
    description: 'Chapter 2 of The Shipping Gita: Sāṅkhya Yoga, rendered verse-by-verse with Sanskrit, literal meaning, engineering translation, scenario, quotable line, and implication.',
    body,
    activeNav: 'chapter',
    extraScripts: tocScript,
  });
}

function verseSlug(id) {
  // 'BG 2.47' -> 'bg-2-47'
  return id.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-');
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

const CSS = `/* The Shipping Gita — single CSS file */

:root {
  --serif: 'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, 'Times New Roman', Times, serif;
  --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, 'Helvetica Neue', Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;

  --bg: #fbfaf6;
  --surface: #ffffff;
  --ink: #1f1d18;
  --ink-soft: #4a463e;
  --ink-mute: #7a7468;
  --rule: #e6e1d4;
  --accent: #7a3a1e;
  --accent-soft: #efe5d8;
  --quote-bg: #fdf6e9;
  --sanskrit-bg: #f4ecde;
  --tag-bg: #ebe5d6;
  --tag-ink: #4a3b1c;

  --measure: 70ch;
  --line: 1.65;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14130f;
    --surface: #1c1b16;
    --ink: #ece8dd;
    --ink-soft: #cdc6b4;
    --ink-mute: #8e8674;
    --rule: #2e2c25;
    --accent: #d99a6c;
    --accent-soft: #2a221a;
    --quote-bg: #1f1c14;
    --sanskrit-bg: #221d14;
    --tag-bg: #2a241a;
    --tag-ink: #d9cca8;
  }
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--serif);
  font-size: 18px;
  line-height: var(--line);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

a {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}
a:hover { text-decoration-thickness: 2px; }

/* Header / nav */
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--rule);
  background: var(--surface);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: saturate(140%) blur(6px);
}

.brand {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.01em;
  color: var(--ink);
  text-decoration: none;
}

.site-nav {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  flex-wrap: wrap;
  font-family: var(--sans);
  font-size: 0.9rem;
}
.nav-link {
  color: var(--ink-soft);
  text-decoration: none;
  padding: 0.25rem 0;
  border-bottom: 1px solid transparent;
}
.nav-link:hover { color: var(--ink); border-bottom-color: var(--ink-soft); }
.nav-active { color: var(--ink); border-bottom-color: var(--accent); }

/* Main */
.site-main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

/* Hero (home) */
.hero {
  padding: 2.5rem 0 2rem;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 2rem;
}
.hero-title {
  font-family: var(--serif);
  font-weight: 600;
  font-size: clamp(2rem, 5vw, 3.4rem);
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
}
.hero-subtitle {
  font-family: var(--sans);
  color: var(--ink-soft);
  font-size: 1.15rem;
  margin: 0 0 1.5rem;
}
.hero-blurb {
  max-width: var(--measure);
}
.hero-blurb p { margin: 0 0 1rem; }
.hero-cta { margin-top: 1.5rem; }
.btn-primary, .btn-secondary {
  font-family: var(--sans);
  font-size: 0.95rem;
  display: inline-block;
  padding: 0.6rem 1rem;
  margin-right: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
}
.btn-primary {
  background: var(--accent);
  color: #fff;
  border: 1px solid var(--accent);
}
.btn-primary:hover { filter: brightness(1.05); }
.btn-secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--rule);
}
.btn-secondary:hover { border-color: var(--ink-soft); }

/* Chapter cards */
.chapters h2, .about h2, .ip-note h2 {
  font-family: var(--serif);
  font-size: 1.5rem;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.4rem;
  margin: 2rem 0 1rem;
}
.ch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}
.ch-card {
  display: block;
  padding: 1rem 1.1rem;
  border: 1px solid var(--rule);
  border-radius: 6px;
  background: var(--surface);
  text-decoration: none;
  color: inherit;
}
.ch-live:hover { border-color: var(--accent); transform: translateY(-1px); }
.ch-pending {
  opacity: 0.55;
  background: transparent;
}
.ch-num {
  font-family: var(--sans);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--ink-mute);
  text-transform: uppercase;
}
.ch-title { font-weight: 600; margin: 0.25rem 0 0.4rem; line-height: 1.3; }
.ch-meta { font-family: var(--sans); font-size: 0.78rem; color: var(--ink-mute); }
.ch-blurb { font-size: 0.92rem; color: var(--ink-soft); margin-top: 0.5rem; line-height: 1.45; }

.about p, .ip-note p { max-width: var(--measure); }
.ip-note ul { max-width: var(--measure); padding-left: 1.25rem; }
.ip-note li { margin-bottom: 0.4rem; }

/* Prose pages (how-to-read, by-tag) */
.prose {
  max-width: var(--measure);
  margin: 0 auto;
}
.prose h1 { font-size: 2rem; margin-top: 0; line-height: 1.2; }
.prose h2 {
  font-size: 1.4rem;
  margin: 2rem 0 0.75rem;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.3rem;
}
.prose h3 { font-size: 1.15rem; margin: 1.6rem 0 0.6rem; }
.prose p { margin: 0 0 1rem; }
.prose ul, .prose ol { margin: 0 0 1rem; padding-left: 1.4rem; }
.prose li { margin-bottom: 0.35rem; }
.prose blockquote {
  margin: 1rem 0;
  padding: 0.75rem 1.1rem;
  border-left: 3px solid var(--accent);
  background: var(--quote-bg);
  border-radius: 0 4px 4px 0;
  font-style: italic;
  color: var(--ink-soft);
}
.prose code {
  font-family: var(--mono);
  font-size: 0.92em;
  background: var(--accent-soft);
  padding: 0.05em 0.35em;
  border-radius: 3px;
}
.prose pre {
  background: var(--sanskrit-bg);
  padding: 0.9rem 1.1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: var(--mono);
  font-size: 0.92em;
}
.prose table {
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.92em;
  width: 100%;
}
.prose th, .prose td {
  border: 1px solid var(--rule);
  padding: 0.4rem 0.6rem;
  text-align: left;
  vertical-align: top;
}
.prose th { background: var(--accent-soft); font-family: var(--sans); }

/* Tag index */
.tag-index h2 {
  font-family: var(--mono);
  font-size: 1.05rem;
  background: var(--tag-bg);
  color: var(--tag-ink);
  padding: 0.5rem 0.75rem;
  border-bottom: none;
  border-radius: 4px;
  margin-top: 2.5rem;
}
.tag-index ul { list-style: none; padding-left: 0; }
.tag-index li { padding: 0.3rem 0; border-bottom: 1px solid var(--rule); }
.tag-index li strong { font-family: var(--serif); }
.tag-index li strong a { text-decoration: none; }

/* Chapter layout */
.chapter-layout {
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
}
.toc {
  position: sticky;
  top: 5rem;
  align-self: start;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  padding-right: 0.5rem;
  border-right: 1px solid var(--rule);
  font-family: var(--sans);
  font-size: 0.86rem;
}
.toc-toggle {
  display: none;
  font: inherit;
  background: transparent;
  border: 1px solid var(--rule);
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  color: var(--ink);
}
.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-section { margin-bottom: 0.85rem; }
.toc-section-btn {
  font: inherit;
  font-weight: 600;
  background: transparent;
  border: none;
  padding: 0.3rem 0;
  cursor: pointer;
  color: var(--ink);
  text-align: left;
  width: 100%;
}
.toc-section-btn::before {
  content: '▾ ';
  color: var(--ink-mute);
  display: inline-block;
  width: 1em;
}
.toc-collapsed .toc-section-btn::before { content: '▸ '; }
.toc-collapsed .toc-verses { display: none; }
.toc-verses { list-style: none; padding-left: 0.6rem; margin: 0.3rem 0 0; }
.toc-verses li { padding: 0.15rem 0; }
.toc-verses a {
  display: grid;
  grid-template-columns: 3.2em 1fr;
  gap: 0.4rem;
  text-decoration: none;
  color: var(--ink-soft);
  border-left: 2px solid transparent;
  padding-left: 0.5rem;
  line-height: 1.35;
}
.toc-verses a:hover { color: var(--ink); border-left-color: var(--rule); }
.toc-verses a.toc-active { color: var(--accent); border-left-color: var(--accent); font-weight: 500; }
.toc-num { font-family: var(--mono); font-size: 0.78rem; color: var(--ink-mute); }
.toc-active .toc-num { color: var(--accent); }
.toc-gloss { display: block; }
.toc-close a { color: var(--ink-soft); text-decoration: none; font-style: italic; }

/* Chapter prose */
.chapter-prose { max-width: 78ch; }
.chapter-head h1 { font-size: 2.2rem; margin: 0 0 0.25rem; line-height: 1.15; }
.chapter-head .chapter-sub {
  font-family: var(--sans);
  color: var(--ink-mute);
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
}
.chapter-prose h2 {
  font-family: var(--serif);
  font-size: 1.45rem;
  margin: 3rem 0 1rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--rule);
}
.chapter-prose p { margin: 0 0 1rem; }
.chapter-prose blockquote {
  margin: 1.25rem 0;
  padding: 0.85rem 1.2rem;
  background: var(--quote-bg);
  border-left: 4px solid var(--accent);
  border-radius: 0 4px 4px 0;
  font-style: italic;
  color: var(--ink-soft);
  font-size: 1.05em;
}
.chapter-prose blockquote p { margin: 0; }

/* Verse */
.verse {
  margin: 2.5rem 0 3rem;
  padding-top: 1rem;
  scroll-margin-top: 5.5rem;
}
.verse-head { margin-bottom: 0.8rem; }
.verse-h3 {
  font-family: var(--serif);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.4rem;
  line-height: 1.35;
}
.verse-id { color: var(--ink); }
.verse-em { color: var(--ink-mute); margin: 0 0.15em; }
.verse-gloss { color: var(--ink-soft); font-weight: 500; }
.verse-anchor {
  color: var(--ink-mute);
  text-decoration: none;
  font-weight: normal;
  margin-right: 0.25em;
}
.verse-anchor:hover { color: var(--accent); }

.verse-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-family: var(--sans);
  font-size: 0.74rem;
  margin-top: 0.4rem;
}
.tag-chip {
  background: var(--tag-bg);
  color: var(--tag-ink);
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  text-decoration: none;
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.01em;
}
.tag-chip:hover { filter: brightness(1.05); }
.conf-chip {
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  font-family: var(--sans);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.66rem;
}
.conf-high { background: #d8e8d4; color: #2c4a23; }
.conf-medium { background: #f1e3c1; color: #6a521e; }
.conf-low { background: #f0d4cf; color: #6e2c1e; }
.conf-stretched { background: #e3d8ec; color: #4d2e6a; }

@media (prefers-color-scheme: dark) {
  .conf-high { background: #243a1f; color: #b6d8a8; }
  .conf-medium { background: #3b3018; color: #e6cf8d; }
  .conf-low { background: #3a201b; color: #e8b4a8; }
  .conf-stretched { background: #2c2336; color: #c5b1d9; }
}

/* Sanskrit block */
.sanskrit {
  margin: 0.9rem 0 1.1rem;
}
.sanskrit pre {
  background: var(--sanskrit-bg);
  padding: 1rem 1.2rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Sanskrit 2003', 'Noto Sans Devanagari', 'Adobe Devanagari', Sahadeva, var(--mono);
  font-size: 1.02em;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  border-left: 3px solid var(--rule);
}

/* Verse body bold + italic markers */
.verse-body p { margin: 0 0 0.85rem; }
.verse-body blockquote {
  margin: 1rem 0;
  padding: 0.7rem 1rem;
  background: var(--accent-soft);
  border-left: 4px solid var(--accent);
  border-radius: 0 4px 4px 0;
  font-style: italic;
  color: var(--ink);
  font-size: 1.04em;
}
.verse-body blockquote p { margin: 0; }
.verse-body em { color: var(--ink-soft); }
.verse-body strong { color: var(--ink); }
.verse-body code {
  font-family: var(--mono);
  font-size: 0.92em;
  background: var(--accent-soft);
  padding: 0.05em 0.35em;
  border-radius: 3px;
}

/* Footer */
.site-footer {
  border-top: 1px solid var(--rule);
  padding: 2rem 1.5rem 3rem;
  font-family: var(--sans);
  font-size: 0.85rem;
  color: var(--ink-soft);
  max-width: 1180px;
  margin: 4rem auto 0;
}
.site-footer p { margin: 0 0 0.5rem; max-width: var(--measure); }
.muted { color: var(--ink-mute); }
.muted a { color: var(--ink-mute); }

/* Responsive */
@media (max-width: 900px) {
  .chapter-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .toc {
    position: static;
    max-height: none;
    overflow: visible;
    border-right: none;
    border-bottom: 1px solid var(--rule);
    padding: 0 0 1rem;
    margin-bottom: 1rem;
  }
  .toc-toggle { display: inline-block; }
  .toc-list-collapsed { display: none; }
}

@media (max-width: 600px) {
  body { font-size: 17px; }
  .site-main { padding: 1.2rem 1rem 3rem; }
  .site-header { padding: 0.8rem 1rem; gap: 0.4rem; }
  .site-nav { gap: 0.85rem; font-size: 0.85rem; }
  .hero-title { font-size: 2rem; }
  .ch-grid { grid-template-columns: 1fr 1fr; }
  .verse-h3 { font-size: 1.1rem; }
  .sanskrit pre { font-size: 0.95em; padding: 0.7rem 0.8rem; }
}
`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const chapter02Md = fs.readFileSync(path.join(CHAPTERS, '02.md'), 'utf8');
  const howToReadMd = fs.readFileSync(path.join(CHAPTERS, '00-how-to-read.md'), 'utf8');
  const byTagMd = fs.readFileSync(path.join(CHAPTERS, '02-by-tag.md'), 'utf8');
  // 02-index.md is already covered by the chapter TOC, but we surface it on home if useful

  const tagMap = loadTagsByVerseId();

  fs.mkdirSync(OUT, { recursive: true });

  const indexHtml = buildIndexPage(howToReadMd);
  const howToReadHtml = buildHowToReadPage(howToReadMd);
  const byTagHtml = buildByTagPage(byTagMd);
  const chapter2Html = buildChapter2Page(chapter02Md, null, tagMap);

  fs.writeFileSync(path.join(OUT, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(OUT, 'chapter-2.html'), chapter2Html);
  fs.writeFileSync(path.join(OUT, 'index-by-tag.html'), byTagHtml);
  fs.writeFileSync(path.join(OUT, 'how-to-read.html'), howToReadHtml);
  fs.writeFileSync(path.join(OUT, 'style.css'), CSS);
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

  // Print sizes
  const sizes = ['index.html', 'chapter-2.html', 'index-by-tag.html', 'how-to-read.html', 'style.css', '.nojekyll'].map(f => {
    const stat = fs.statSync(path.join(OUT, f));
    return `  ${f.padEnd(22)} ${String(stat.size).padStart(8)} bytes`;
  });
  console.log('Built docs/:');
  console.log(sizes.join('\n'));
  console.log(`\nTagged ${Object.keys(tagMap).length} verses from data/verses/.`);
}

main();
