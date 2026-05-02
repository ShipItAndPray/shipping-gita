/**
 * parse-hbg.mjs <chapter> <verse>
 * Reads data/sources/raw/bg-<C>-<V>-hbg.html (already downloaded) and
 * extracts the canonical bg-shlocks, bg-transliteration, bg-verse-words,
 * bg-verse-translation, bg-verse-commentary blocks. Output JSON.
 */
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const [, , chapter, verse] = process.argv;
if (!chapter || !verse) {
  console.error("usage: parse-hbg.mjs <chapter> <verse>");
  process.exit(2);
}

const path = resolve(`data/sources/raw/bg-${chapter}-${verse}-hbg.html`);
const html = readFileSync(path, "utf8");
const dom = new JSDOM(html);
const doc = dom.window.document;

const clean = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : null;

const shloka = doc.querySelector(".bg-shlocks");
const transliteration = doc.querySelector(".bg-transliteration");
const words = doc.querySelector(".bg-verse-words");
const translation = doc.querySelector(".bg-verse-translation");
const commentary = doc.querySelector(".bg-verse-commentary");

// Extract word→meaning pairs
const wordPairs = [];
if (words) {
  const pairs = words.innerHTML.split(/[;]/);
  for (const p of pairs) {
    const m = p.match(/<a[^>]*>([^<]+)<\/a>—<span class="meaning">([^<]+)<\/span>/);
    if (m) wordPairs.push({ iast: m[1].trim(), meaning: m[2].trim() });
  }
}

const out = {
  source: "holy-bhagavad-gita.org",
  url: `https://www.holy-bhagavad-gita.org/chapter/${chapter}/verse/${verse}/`,
  fetched_at: new Date().toISOString(),
  translator: "Swami Mukundananda",
  tradition: "Modern devotional",
  sanskrit_devanagari: clean(shloka),
  transliteration: clean(transliteration),
  word_pairs: wordPairs,
  translation: clean(translation),
  commentary_excerpt: clean(commentary)?.slice(0, 600),
  commentary_full_length: clean(commentary)?.length || 0,
};
console.log(JSON.stringify(out, null, 2));
