// Build raw shankara/ramanuja JSON files for BG 2.1 - 2.10 from /tmp/bg-2-N-clean.json.
// Each excerpt is taken VERBATIM (literal substring) from the scraped page so the
// excerpt round-trips against the source. Hard ceiling: 300 chars (fair-use).
import fs from "node:fs";
import path from "node:path";

const RAW_DIR = "./data/sources/raw";
const NA_NOTE = "Site bhagavad-gita.us states explicitly that Sri Sankaracharya did not comment on this sloka and that his commentary starts from 2.10. Standard Advaita Ashrama (Gambhirananda) edition agrees - Sankara's bhasya begins at BG 2.10.";

function loadScraped(n) {
  return JSON.parse(fs.readFileSync(`/tmp/bg-2-${n}-clean.json`, "utf8"));
}
function pickCommentary(scraped, who) {
  const entries = Object.entries(scraped.commentaries);
  const re = who === "shankara" ? /Shankaracharya/i : /Ramanuja/i;
  const m = entries.find(([k]) => re.test(k));
  return m ? m[1] : "";
}

// Take an exact prefix of the source up to MAX chars. Prefer the longest
// sentence-end boundary >= 70% of MAX; otherwise hard-cut at MAX (still verbatim).
function prefixSlice(src, max = 300) {
  if (src.length <= max) return src;
  const cut = src.substring(0, max);
  const enders = [".' ", ".’ ", ".\" ", ".” ", ". ", "! ", "? "];
  let best = -1;
  for (const sep of enders) {
    const idx = cut.lastIndexOf(sep);
    if (idx >= 0) {
      const endPos = idx + sep.length - 1;
      if (endPos > best) best = endPos;
    }
  }
  if (best >= Math.floor(max * 0.7)) return src.substring(0, best).trim();
  return cut.trim();
}

const NOW = new Date().toISOString();

// Per-verse range labels (Ramanuja's site clusters)
const RANGE = { 1:"2.1-2.3",2:"2.1-2.3",3:"2.1-2.3",4:"2.4-2.5",5:"2.4-2.5",6:"2.6-2.8",7:"2.6-2.8",8:"2.6-2.8",9:"2.9-2.10",10:"2.9-2.10" };

for (let n = 1; n <= 10; n++) {
  const scraped = loadScraped(n);

  // ---- Shankara
  const shFull = pickCommentary(scraped, "shankara");
  const shHasCommentary = !shFull.includes("did not comment") && shFull.length > 200;
  let shOut;
  if (!shHasCommentary) {
    shOut = {
      source: "bhagavad-gita.us",
      url: scraped.url + "?cm=adi-shankaracharya",
      fetched_at: NOW,
      translator: "Swami Gambhirananda (Advaita Ashrama edition of Sankara-bhasya)",
      tradition: "Advaita",
      verbatim_excerpt: null,
      verbatim_excerpt_length: 0,
      verbatim_excerpt_status: "not_available",
      verbatim_full_length: shFull.length,
      verbatim_full_text_marker: shFull.substring(0, 120),
      copyright_holder: "Advaita Ashrama, Kolkata (publisher of Swami Gambhirananda's English translation of Sankara-bhasya). No verbatim is captured because no commentary exists for this verse.",
      notes: NA_NOTE,
    };
  } else {
    const ex = prefixSlice(shFull, 300);
    if (ex.length > 300) throw new Error(`shankara 2.${n} excerpt too long`);
    if (!shFull.includes(ex)) throw new Error(`shankara 2.${n} excerpt not literal`);
    shOut = {
      source: "bhagavad-gita.us",
      url: scraped.url + "?cm=adi-shankaracharya",
      fetched_at: NOW,
      translator: "Swami Gambhirananda (per Advaita Ashrama edition; bhagavad-gita.us reproduces this English rendering of Sankara-bhasya)",
      tradition: "Advaita",
      verbatim_excerpt: ex,
      verbatim_excerpt_length: ex.length,
      verbatim_excerpt_status: "captured (fair-use)",
      verbatim_full_length: shFull.length,
      copyright_holder: "Advaita Ashrama, Kolkata (publisher of Swami Gambhirananda's English translation of Sankara-bhasya). Site bhagavad-gita.us reproduces the translation; we cite a short fair-use excerpt only.",
      notes: `Full commentary length ${shFull.length} chars; excerpt is the literal opening ${ex.length} chars. This is the start of Sankara's Gita-bhasya proper; he treats 2.1-2.9 as narrative and begins his bhashya here at 2.10 with the methodological framing of sorrow/delusion as the cause of samsara.`,
    };
  }
  fs.writeFileSync(path.join(RAW_DIR, `bg-2-${n}-shankara.json`), JSON.stringify(shOut, null, 2) + "\n");

  // ---- Ramanuja
  const raFull = pickCommentary(scraped, "ramanuja");
  const ex = prefixSlice(raFull, 300);
  if (ex.length > 300) throw new Error(`ramanuja 2.${n} excerpt too long`);
  if (!raFull.includes(ex)) throw new Error(`ramanuja 2.${n} excerpt not literal`);
  const raOut = {
    source: "bhagavad-gita.us",
    url: scraped.url + "?cm=ramanuja",
    fetched_at: NOW,
    translator: "Swami Adidevananda (per Sri Ramakrishna Math edition; bhagavad-gita.us reproduces this English rendering of Ramanuja's Gita-bhasya)",
    tradition: "Vishishtadvaita",
    verbatim_excerpt: ex,
    verbatim_excerpt_length: ex.length,
    verbatim_excerpt_status: "captured (fair-use)",
    verbatim_full_length: raFull.length,
    copyright_holder: "Sri Ramakrishna Math, Chennai (publisher of Swami Adidevananda's English translation of Ramanuja's Gita-bhasya). Site bhagavad-gita.us reproduces the translation; we cite a short fair-use excerpt only.",
    notes: `Full commentary length ${raFull.length} chars. Ramanuja gives a single combined gloss for verses ${RANGE[n]}; the captured excerpt is a literal fair-use prefix of that combined commentary and applies to every verse in the cluster. Source uses non-IAST transliteration (e.g. 'Krsna', 'Bhisma', 'Drona') and curly quotes; preserved verbatim.`,
  };
  fs.writeFileSync(path.join(RAW_DIR, `bg-2-${n}-ramanuja.json`), JSON.stringify(raOut, null, 2) + "\n");

  console.log(`bg-2-${n}: shankara=${shOut.verbatim_excerpt_status} (len=${shOut.verbatim_excerpt_length})  ramanuja=${raOut.verbatim_excerpt_status} (len=${raOut.verbatim_excerpt_length})`);
}
