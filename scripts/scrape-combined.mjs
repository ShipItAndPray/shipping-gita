import { JSDOM } from "jsdom";
const [, , slug] = process.argv;
const url = `https://vedabase.io/en/library/bg/5/${slug}/`;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";
const r = await fetch(url, { headers: { "User-Agent": UA } });
const html = await r.text();
const doc = new JSDOM(html).window.document;
const clean = (el) => el ? el.textContent.replace(/\s+/g, " ").trim().replace(/^Devanagari\s*/i, "").replace(/^Verse\s*text\s*/i, "").replace(/^Synonyms\s*/i, "").replace(/^Translation\s*/i, "").replace(/^Purport\s*/i, "") : null;
const out = {
  source: "vedabase.io", url, fetched_at: new Date().toISOString(),
  sanskrit_devanagari: clean(doc.querySelector(".av-verse_text-devanagari")) || clean(doc.querySelector(".av-devanagari")),
  verse_text_iast: clean(doc.querySelector(".av-verse_text")),
  synonyms: clean(doc.querySelector(".av-synonyms")),
  translation: clean(doc.querySelector(".av-translation")),
  purport_full: clean(doc.querySelector(".av-purport")),
};
console.log(JSON.stringify(out, null, 2));
