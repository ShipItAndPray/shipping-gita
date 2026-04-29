/**
 * scrape-vedabase.mjs <chapter> <verse>
 *
 * Fetches a single Bhagavad Gita verse from vedabase.io with a browser User-Agent
 * and extracts the four canonical sections (verse_text, synonyms, translation,
 * purport) from the rendered HTML using jsdom.
 *
 * Output is JSON to stdout. We capture the verbatim text for storage in the
 * source pack — but the calling pipeline is responsible for using only short
 * fair-use excerpts in any user-facing surface (per copyright policy).
 */

import { JSDOM } from "jsdom";

const [, , chapter, verse] = process.argv;
if (!chapter || !verse) {
  console.error("usage: scrape-vedabase.mjs <chapter> <verse>");
  process.exit(2);
}

const url = `https://vedabase.io/en/library/bg/${chapter}/${verse}/`;
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
  console.error(`vedabase fetch failed: ${res.status}`);
  process.exit(1);
}
const html = await res.text();
const dom = new JSDOM(html);
const doc = dom.window.document;

function clean(el) {
  if (!el) return null;
  const text = el.textContent.replace(/\s+/g, " ").trim();
  return text
    .replace(/^Devanagari\s*/i, "")
    .replace(/^Verse\s*text\s*/i, "")
    .replace(/^Synonyms\s*/i, "")
    .replace(/^Translation\s*/i, "")
    .replace(/^Purport\s*/i, "");
}

const sanskrit_devanagari =
  clean(doc.querySelector(".av-verse_text-devanagari")) ||
  clean(doc.querySelector(".av-devanagari")) ||
  null;
const verse_text_iast = clean(doc.querySelector(".av-verse_text"));
const synonyms = clean(doc.querySelector(".av-synonyms"));
const translation = clean(doc.querySelector(".av-translation"));
const purport_full = clean(doc.querySelector(".av-purport"));

// Take a short fair-use excerpt of the purport (first ~280 chars at sentence boundary)
let purport_excerpt = null;
if (purport_full) {
  const cap = 320;
  let end = cap;
  if (purport_full.length > cap) {
    const lastDot = purport_full.lastIndexOf(". ", cap);
    end = lastDot > cap * 0.6 ? lastDot + 1 : cap;
  } else {
    end = purport_full.length;
  }
  purport_excerpt = purport_full.slice(0, end).trim();
}

const out = {
  source: "vedabase.io",
  url,
  fetched_at: new Date().toISOString(),
  translator: "A.C. Bhaktivedanta Swami Prabhupada",
  tradition: "Gaudiya Vaishnava",
  sanskrit_devanagari,
  verse_text_iast,
  synonyms,
  translation,
  purport_excerpt,
  purport_full_length: purport_full ? purport_full.length : 0,
};

console.log(JSON.stringify(out, null, 2));
