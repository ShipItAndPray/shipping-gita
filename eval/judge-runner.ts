/**
 * judge-runner.ts
 *
 * Loads each persona prompt from eval/prompts/, builds the input payload from
 * a verse + source pack, and (optionally) calls a configured LLM endpoint.
 *
 * Modes:
 *   - "stub":   write the rendered prompts to disk for manual review; do not call any API.
 *   - "claude": call the Anthropic Messages API using ANTHROPIC_API_KEY.
 *   - "codex":  call the OpenAI Responses API using OPENAI_API_KEY.
 *
 * The judge runner is intentionally pluggable: every gate produces the same
 * { verdict: "PASS"|"FAIL", ...details } shape regardless of which model decides.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename } from "node:path";

interface JudgeResult {
  judge: string;
  gate_id: string;
  verdict: "PASS" | "FAIL" | "ERROR" | "PENDING";
  raw: any;
  ts: string;
}

const REPO = resolve(import.meta.dirname || ".", "..");

// Map persona prompt files to gate IDs
const JUDGE_GATE_MAP: Record<string, string[]> = {
  "sanskrit-scholar.md":      ["7.1"],
  "hostile-engineer.md":      ["7.2"],
  "skeptical-pm.md":          ["7.3", "3.11"],
  "indian-philosopher.md":    ["7.4", "6.8"],
  "cynical-writer.md":        ["7.5"],
  "force-fit-detector.md":    ["7.6", "3.5"],
  "inversion-test.md":        ["7.8", "3.7"],
  "distortion-test.md":       ["3.6", "7.10"],
  "voice-consistency.md":     ["5.7"],
  "trivialization-check.md":  ["8.1"],
  "tech-manual-framing.md":   ["8.5"],
  // additional persona files to be authored:
  // "removed-verse-test.md":    ["7.7"],
  // "actionable-predicate.md":  ["3.11"],  (overlaps skeptical-pm)
  // "reproducibility-check.md": ["3.12"],
  // "disagreement-explanation.md": ["2.5"],
  // "chapter-thesis-support.md": ["10.3"],
};

const verseId = process.argv[2];
const mode = (process.argv[3] || process.env.JUDGE_MODE || "stub") as "stub" | "claude" | "codex";
if (!verseId) {
  console.error("usage: judge-runner.ts <verse-slug> [stub|claude|codex]");
  process.exit(2);
}

const sourcePath = resolve(REPO, "data/sources", `${verseId}.json`);
const versePath  = resolve(REPO, "data/verses",  `${verseId}.json`);
const renderedDir = resolve(REPO, "data/judge-runs", verseId);

const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const verse  = JSON.parse(readFileSync(versePath, "utf8"));
mkdirSync(renderedDir, { recursive: true });

function buildPayload(): string {
  return JSON.stringify({
    verse_id:               source.id,
    sanskrit_devanagari:    source.sanskrit_devanagari,
    sanskrit_iast:          source.sanskrit_iast,
    anvaya:                 source.anvaya,
    translations:           source.translations,
    commentaries:           source.commentaries,
    disagreements:          source.disagreements_among_translators,
    literal_meaning:        source.literal_meaning,
    traditional_meaning:    source.traditional_meaning_consensus,
    engineering:            verse.engineering,
  }, null, 2);
}

const promptsDir = resolve(REPO, "eval/prompts");
const promptFiles = readdirSync(promptsDir).filter((f) => f.endsWith(".md"));

const results: JudgeResult[] = [];

for (const file of promptFiles) {
  const persona = basename(file, ".md");
  const gateIds = JUDGE_GATE_MAP[file] || [];
  const promptBody = readFileSync(resolve(promptsDir, file), "utf8");
  const payload = buildPayload();

  const fullPrompt =
    promptBody +
    "\n\n## Input\n\n```json\n" +
    payload +
    "\n```\n\n## Respond now with the strict JSON only.";

  const renderedPath = resolve(renderedDir, `${persona}.prompt.txt`);
  writeFileSync(renderedPath, fullPrompt);

  if (mode === "stub") {
    for (const gid of gateIds) {
      results.push({
        judge: persona,
        gate_id: gid,
        verdict: "PENDING",
        raw: { rendered_prompt_path: renderedPath },
        ts: new Date().toISOString(),
      });
    }
    continue;
  }

  // mode === "claude" or "codex" — actual LLM call deferred to integration.
  // Emits a deterministic ERROR until wired so the eval suite never silently
  // fakes a pass.
  for (const gid of gateIds) {
    results.push({
      judge: persona,
      gate_id: gid,
      verdict: "ERROR",
      raw: { reason: `LLM endpoint not configured for mode "${mode}"`, prompt: renderedPath },
      ts: new Date().toISOString(),
    });
  }
}

const reportPath = resolve(REPO, "data/verses", `${verseId}.judge-report.json`);
writeFileSync(reportPath, JSON.stringify({
  verse_id: source.id,
  mode,
  generated_at: new Date().toISOString(),
  judges_run: results.length,
  pending: results.filter((r) => r.verdict === "PENDING").length,
  passed:  results.filter((r) => r.verdict === "PASS").length,
  failed:  results.filter((r) => r.verdict === "FAIL").length,
  errored: results.filter((r) => r.verdict === "ERROR").length,
  results,
}, null, 2));

console.log(JSON.stringify({
  verse_id: source.id,
  mode,
  judges_run: results.length,
  pending: results.filter((r) => r.verdict === "PENDING").length,
  rendered_prompts_dir: renderedDir,
  report: reportPath,
}, null, 2));
