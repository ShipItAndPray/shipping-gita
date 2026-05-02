/**
 * scrape-vedabase-merged.mjs <chapter> <combo>
 * e.g. scrape-vedabase-merged.mjs 6 13-14
 *
 * Vedabase pages can be either single (e.g. /bg/6/15/) or merged (/bg/6/13-14/).
 * For merged verses, the same translation/purport applies to all verses in the
 * range. We pull the page, extract Devanagari/IAST/translation/purport, and
 * note that this is the merged-block content.
 */
import { JSDOM } from "jsdom";

const [, , chapter, combo] = process.argv;
if (!chapter || !combo) {
  console.error("usage: scrape-vedabase-merged.mjs <chapter> <combo, e.g. 13-14>");
  process.exit(2);
}
const url = `https://vedabase.io/en/library/bg/${chapter}/${combo}/`;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";

const res = await fetch(url, {
  headers: { "User-Agent": UA, Accept: "text/html" },
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
  combo,
  translator: "A.C. Bhaktivedanta Swami Prabhupada",
  tradition: "Gaudiya Vaishnava",
  sanskrit_devanagari,
  verse_text_iast,
  synonyms,
  translation,
  purport_excerpt,
  purport_full,
  purport_full_length: purport_full ? purport_full.length : 0,
}, null, 2));
