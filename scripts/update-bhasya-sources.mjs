// Update data/sources/bg-2-N.json files for N=1..10 by replacing Shankara/Ramanuja
// commentary entries with verbatim-captured versions sourced from data/sources/raw/.
import fs from "node:fs";
import path from "node:path";

const SOURCES_DIR = "./data/sources";
const RAW_DIR = path.join(SOURCES_DIR, "raw");

function readJSON(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function writeJSON(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n"); }

function commentaryFromRaw(raw, role, oldEntry) {
  // role: "shankara" | "ramanuja"
  const isSh = role === "shankara";
  const out = {
    commentator: isSh ? "Sri Adi Shankaracharya" : "Sri Ramanujacharya",
    tradition: isSh ? "Advaita" : "Vishishtadvaita",
    source: "bhagavad-gita.us",
    url: raw.url,
    fetched_at: raw.fetched_at,
    translator: raw.translator,
  };
  if (raw.verbatim_excerpt_status === "not_available") {
    out.verbatim_excerpt_status = "not_available";
    out.verbatim_excerpt = null;
    out.copyright_holder = raw.copyright_holder;
    out.raw_full_path = `data/sources/raw/bg-2-${raw.url.match(/bhagavad-gita-2-(\d+)/)[1]}-${role}.json`;
    out.notes = raw.notes;
  } else {
    out.verbatim_excerpt_status = "captured (fair-use)";
    out.verbatim_excerpt = raw.verbatim_excerpt;
    out.verbatim_excerpt_length = raw.verbatim_excerpt_length;
    out.verbatim_full_length = raw.verbatim_full_length;
    out.copyright_holder = isSh ? "Advaita Ashrama, Kolkata" : "Sri Ramakrishna Math, Chennai";
    out.raw_full_path = `data/sources/raw/bg-2-${raw.url.match(/bhagavad-gita-2-(\d+)/)[1]}-${role}.json`;
  }
  // Preserve existing summary_paraphrase as fallback if present
  if (oldEntry && oldEntry.summary_paraphrase) {
    out.summary_paraphrase = oldEntry.summary_paraphrase;
  }
  return out;
}

for (let n = 1; n <= 10; n++) {
  const srcPath = path.join(SOURCES_DIR, `bg-2-${n}.json`);
  const src = readJSON(srcPath);
  const shRaw = readJSON(path.join(RAW_DIR, `bg-2-${n}-shankara.json`));
  const raRaw = readJSON(path.join(RAW_DIR, `bg-2-${n}-ramanuja.json`));

  // Find existing Shankara/Ramanuja entries (for paraphrase preservation)
  const oldSh = src.commentaries.find(c => /Shankaracharya/i.test(c.commentator || ""));
  const oldRa = src.commentaries.find(c => /Ramanuja/i.test(c.commentator || ""));

  const newSh = commentaryFromRaw(shRaw, "shankara", oldSh);
  const newRa = commentaryFromRaw(raRaw, "ramanuja", oldRa);

  // Rebuild commentaries: keep non-Shankara/Ramanuja entries, then append Shankara, then Ramanuja.
  // Also drop the "Traditional consensus (narrative frame)" stub if present (replaced by per-acharya entries).
  const kept = src.commentaries.filter(c => {
    const name = c.commentator || "";
    if (/Shankaracharya/i.test(name)) return false;
    if (/Ramanuja/i.test(name)) return false;
    if (/Traditional consensus/i.test(name)) return false;
    return true;
  });
  src.commentaries = [...kept, newSh, newRa];

  // Update source_pack_completeness
  if (src.source_pack_completeness) {
    src.source_pack_completeness.commentaries_count = src.commentaries.length;
    const existingSrcs = src.source_pack_completeness.verbatim_quote_sources || [];
    const additions = [];
    if (newSh.verbatim_excerpt_status === "captured (fair-use)") additions.push("bhagavad-gita.us (Shankara bhasya, Gambhirananda tr.)");
    if (newRa.verbatim_excerpt_status === "captured (fair-use)") additions.push("bhagavad-gita.us (Ramanuja Gita-bhasya, Adidevananda tr.)");
    for (const a of additions) if (!existingSrcs.includes(a)) existingSrcs.push(a);
    src.source_pack_completeness.verbatim_quote_sources = existingSrcs;
    // Update remaining_gaps
    const gaps = (src.source_pack_completeness.remaining_gaps || []).filter(g => !/Shankara|Ramanuja/i.test(g));
    if (newSh.verbatim_excerpt_status === "not_available") gaps.push(`Shankara verbatim — site states he did not comment on 2.${n}; bhasya begins at 2.10.`);
    src.source_pack_completeness.remaining_gaps = gaps;
  }

  writeJSON(srcPath, src);
  console.log(`updated bg-2-${n}.json: shankara=${newSh.verbatim_excerpt_status}  ramanuja=${newRa.verbatim_excerpt_status}`);
}
