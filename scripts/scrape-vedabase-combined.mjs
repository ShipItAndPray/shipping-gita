/**
 * scrape-vedabase-combined.mjs <chapter> <combined-slug>
 *
 * For verses that vedabase serves under a combined URL like /bg/6/11-12/.
 * Outputs the same JSON shape as scrape-vedabase.mjs.
 *
 * Usage: node scripts/scrape-vedabase-combined.mjs 6 11-12 > raw/bg-6-11-12-vedabase.json
 */

import { JSDOM } from "jsdom";

const [, , chapter, combined] = process.argv;
if (!chapter || !combined) {
  console.error("usage: scrape-vedabase-combined.mjs <chapter> <combined-slug>");
  process.exit(2);
}

const url = `https://vedabase.io/en/library/bg/${chapter}/${combined}/`;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";

const res = await fetch(url, {
  headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9", "Accept-Language": "en-US,en;q=0.9" },
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
  clean(doc.querySelector(".av-devanagari")) || null;
const verse_text_iast = clean(doc.querySelector(".av-verse_text"));
const synonyms = clean(doc.querySelector(".av-synonyms"));
const translation = clean(doc.querySelector(".av-translation"));
const purport_full = clean(doc.querySelector(".av-purport"));

let purport_excerpt = null;
if (purport_full) {
  const cap = 320;
  let end = cap;
  if (purport_full.length > cap) {
    const lastDot = purport_full.lastIndexOf(". ", cap);
    end = lastDot > cap * 0.6 ? lastDot + 1 : cap;
  } else end = purport_full.length;
  purport_excerpt = purport_full.slice(0, end).trim();
}

console.log(JSON.stringify({
  source: "vedabase.io",
  url,
  fetched_at: new Date().toISOString(),
  translator: "A.C. Bhaktivedanta Swami Prabhupada",
  tradition: "Gaudiya Vaishnava",
  combined_for: combined,
  sanskrit_devanagari, verse_text_iast, synonyms, translation,
  purport_excerpt,
  purport_full_length: purport_full ? purport_full.length : 0,
}, null, 2));
