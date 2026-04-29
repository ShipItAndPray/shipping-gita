/**
 * scrape-bgus-commentary.mjs <chapter> <verse>
 *
 * Fetches a Bhagavad Gita verse page from bhagavad-gita.us and extracts
 * commentary blocks (Shankara, Ramanuja, Madhva, Abhinavagupta, Sridhara,
 * Keshava Kashmiri, Kesava Kashmiri, etc.). The page contains all
 * commentaries in static HTML; the JS only swaps which one is visible.
 *
 * Output: JSON to stdout with a map of commentator -> verbatim full text.
 * Caller is responsible for trimming to fair-use length (≤300 chars) and
 * citing source.
 */

import { JSDOM } from "jsdom";

const [, , chapter, verse] = process.argv;
if (!chapter || !verse) {
  console.error("usage: scrape-bgus-commentary.mjs <chapter> <verse>");
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

// Strategy: find <span class="headingz">Commentary by ... :</span>
// inside a <p>; the next <p> has the commentary text.
const commentaries = {};
const headings = doc.querySelectorAll("span.headingz");
for (const h of headings) {
  const label = h.textContent.replace(/\s+/g, " ").trim();
  // The heading span is inside a <p>; get the parent <p>'s nextElementSibling
  let parentP = h.closest("p");
  if (!parentP) continue;
  let next = parentP.nextElementSibling;
  // Skip non-<p> elements
  while (next && next.tagName !== "P") next = next.nextElementSibling;
  if (!next) continue;
  // If the next <p> itself starts with another headingz, skip (no body)
  if (next.querySelector("span.headingz")) continue;
  const body = next.textContent.replace(/\s+/g, " ").trim();
  commentaries[label] = body;
}

const out = {
  source: "bhagavad-gita.us",
  url,
  fetched_at: new Date().toISOString(),
  commentaries,
};

console.log(JSON.stringify(out, null, 2));
