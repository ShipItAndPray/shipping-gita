/**
 * scrape-bgus-all.mjs <chapter> <verse>
 *
 * Improved variant of scrape-bgus-commentary.mjs that captures every
 * commentary present on bhagavad-gita.us/bhagavad-gita-<c>-<v>/, regardless
 * of whether the commentary block sits inside or outside the inline-defined
 * "currentlyShowing" hidden div used by the page's tab-switching JS.
 *
 * Output: JSON to stdout — { commentaries: { "<exact heading text>": "<full body>" } }.
 * Caller is responsible for fair-use trimming.
 */

import { JSDOM } from "jsdom";

const [, , chapter, verse] = process.argv;
if (!chapter || !verse) {
  console.error("usage: scrape-bgus-all.mjs <chapter> <verse>");
  process.exit(2);
}

const url = `https://www.bhagavad-gita.us/bhagavad-gita-${chapter}-${verse}/`;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";

const res = await fetch(url, {
  headers: {
    "User-Agent": UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
    "Accept-Language": "en-US,en;q=0.9",
  },
});
if (!res.ok) {
  console.error(`fetch failed: ${res.status}`);
  process.exit(1);
}
const html = await res.text();
const dom = new JSDOM(html);
const doc = dom.window.document;

// Strategy: walk the whole entry-content area, treat every <span class="headingz">
// as a section break, accumulate text from following nodes until the next
// span.headingz is found.
const main =
  doc.querySelector(".entry-content") ||
  doc.querySelector(".et_pb_post_content") ||
  doc.querySelector("article") ||
  doc.body;

// Build a flat list of significant nodes (headings + content paragraphs).
const headings = [...main.querySelectorAll("span.headingz")];
const out = {};
for (let i = 0; i < headings.length; i++) {
  const h = headings[i];
  const label = h.textContent.replace(/\s+/g, " ").trim();
  const next = headings[i + 1];

  // Walk forward from h, collecting text, until we reach next (or end).
  let body = "";
  // Use a TreeWalker over text nodes between this heading and the next.
  const range = doc.createRange();
  range.setStartAfter(h);
  if (next) {
    range.setEndBefore(next);
  } else {
    range.setEndAfter(main);
  }
  const frag = range.cloneContents();
  body = (frag.textContent || "").replace(/\s+/g, " ").trim();
  out[label] = body;
}

console.log(
  JSON.stringify(
    {
      source: "bhagavad-gita.us",
      url,
      fetched_at: new Date().toISOString(),
      commentaries: out,
    },
    null,
    2,
  ),
);
