/**
 * build-ch4-verses.mjs
 *
 * Reads scripts/ch4-verses-config.json (per-verse engineering layer + iter
 * note), and emits data/verses/bg-4-N.json — verse records ready for eval.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const cfg = JSON.parse(readFileSync(resolve(REPO, "scripts/ch4-verses-config.json"), "utf8"));

const ts = "2026-04-30T05:00:00Z";

for (const v of cfg.verses) {
  const verse = {
    id: `BG 4.${v.verse}`,
    chapter: 4,
    verse: v.verse,
    schema_version: "1.0.0",
    eval_suite_version: "1.0.0",
    engineering: v.engineering,
    iterations: [
      {
        iteration: 0,
        ts,
        mutation: v.iter_note,
        failing_gates_before: [],
        failing_gates_after: [],
        prompt_version: "draft-1.0.0",
      },
    ],
    gate_results: [],
    total_score: 0,
    max_score: 84,
    needs_human_rescue: false,
  };
  const outPath = resolve(REPO, `data/verses/bg-4-${v.verse}.json`);
  writeFileSync(outPath, JSON.stringify(verse, null, 2));
  console.log(`wrote ${outPath}`);
}
