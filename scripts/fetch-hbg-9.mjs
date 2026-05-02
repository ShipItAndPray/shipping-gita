import { JSDOM } from "jsdom";

const [, , chapter, verse] = process.argv;
const url = `https://www.holy-bhagavad-gita.org/chapter/${chapter}/verse/${verse}`;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";
const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
if (!res.ok) { console.error("fetch failed " + res.status); process.exit(1); }
const html = await res.text();
const dom = new JSDOM(html);
const doc = dom.window.document;
const clean = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : null;
const shloka = doc.querySelector(".bg-shlocks") || doc.querySelector(".shloka") || doc.querySelector(".v-shloka");
const transliteration = doc.querySelector(".bg-transliteration") || doc.querySelector(".transliteration");
const words = doc.querySelector(".bg-verse-words") || doc.querySelector(".verse-words");
const translation = doc.querySelector(".bg-verse-translation") || doc.querySelector(".verse-translation");
const commentary = doc.querySelector(".bg-verse-commentary") || doc.querySelector(".commentary");
const wordPairs = [];
if (words) {
  const pairs = words.innerHTML.split(/[;]/);
  for (const p of pairs) {
    const m = p.match(/<a[^>]*>([^<]+)<\/a>[—\-]<span class="meaning">([^<]+)<\/span>/);
    if (m) wordPairs.push({ iast: m[1].trim(), meaning: m[2].trim() });
  }
}
const out = {
  source: "holy-bhagavad-gita.org",
  url, fetched_at: new Date().toISOString(),
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
