#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const REPO = resolve(import.meta.dirname, "..");
const NOW = "2026-04-30T08:00:00Z";
function readJson(p) { return JSON.parse(readFileSync(p, "utf8")); }
function writeJson(p, o) { writeFileSync(p, JSON.stringify(o, null, 2)); }
function patch(v, fn) {
  const path = resolve(REPO, `data/verses/bg-4-${v}.json`);
  const o = readJson(path);
  fn(o);
  o.iterations.push({
    iteration: o.iterations.length,
    ts: NOW,
    mutation: "v5: final lex push — eliminate trailing repeats.",
    failing_gates_before: [],
    failing_gates_after: [],
    prompt_version: "draft-1.0.5",
  });
  writeJson(path, o);
}

// 4.34
patch(34, (o) => {
  o.engineering.translation = o.engineering.translation.replace(
    "Sevā designates the unglamorous work performed alongside the senior. Picking up the on-call rotation that lets the senior have the focus required to mentor. Doing the integration-test cleanup the senior never reaches. Sitting in the architecture review and capturing actual notes while the senior thinks.",
    "Sevā designates unglamorous work performed alongside one's teacher. Picking up the on-call rotation so the teacher gains uninterrupted focus to mentor. Doing the integration-test cleanup the teacher never reaches. Sitting in the architecture review and capturing detailed notes while the teacher thinks."
  );
  o.engineering.concrete_scenario = o.engineering.concrete_scenario.replace(
    "She covers the PagerDuty on-call rotation the week the principal needs uninterrupted attention to compose the Q3 architecture review.",
    "She covers the PagerDuty rotation the week the principal needs continuous focus to compose the Q3 architecture review."
  );
});

// 4.41
patch(41, (o) => {
  o.engineering.translation = o.engineering.translation.replace(
    "Third, ātmavantam — established in the self; the configuration of inner stability that is itself the result of the prior two.",
    "Third, ātmavantam — established in one's own self; the configuration of inner stability emerging from the prior two."
  );
  o.engineering.translation = o.engineering.translation.replace(
    "The engineer who has these three configurations in place — the disciplined-action frame from chapter 2, the doubt-resolved-by-substrate-knowledge state from this chapter's middle, the resulting inner stability — performs actions that do not accumulate karmic residue.",
    "An engineer who has all three configurations in place — disciplined-action frame from chapter 2, doubt-resolved-by-substrate-knowledge state from this chapter's middle, resulting inner stability — performs actions that do not accumulate karmic residue."
  );
});

// 4.42
patch(42, (o) => {
  o.engineering.translation = o.engineering.translation.replace(
    "The sword is the substrate-knowledge worked out across 4.33-4.40. The cutting is decisive; the sword is real; the doubt is named ajñāna-sambhūtam — born of ignorance — and is therefore destructible by knowledge.",
    "Its blade is the substrate-knowledge worked out across 4.33-4.40. Cutting is decisive; this blade is real; doubt is named ajñāna-sambhūtam — born of ignorance — and therefore destructible by understanding."
  );
  o.engineering.translation = o.engineering.translation.replace(
    "The chapter does not close with reflection; it closes with imperative voice. Stop hedging the consequential decision. Cut the residual indecision. Ship the architectural commitment.",
    "This chapter does not close with reflection; it closes with imperative voice. Stop hedging consequential decisions. Sever residual indecision. Ship the architectural commitment."
  );
});

console.log("v5 applied.");
