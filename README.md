# The Shipping Gita

A verse-by-verse engineering adaptation of the Bhagavad Gita, generated under an 84-gate quality system.

> **Status:** Calibration spike. One verse (BG 2.47) generated to gold-standard quality. Eval framework live. Judge runtime scaffolded.

This project is an experiment. It is not yet a finished book. It is a framework for producing one carefully.

## What the book is

For each of the 700 verses of the Bhagavad Gita:

- The Sanskrit Devanagari, the IAST transliteration, and the word-by-word *anvaya*, all from canonical sources, byte-exactly verified across multiple independent texts.
- The literal meaning and a consensus traditional meaning drawn from named commentarial traditions (Advaita, Vishishtadvaita, Gaudiya Vaishnava, etc.) with disagreements among them flagged, not flattened.
- An engineering adaptation layer: a translation of the verse into modern software-engineering terms, anchored in a concrete scenario, with explicit falsifiability and counter-example.

The engineering layer is a layer *atop* the verse, not a replacement for it. Original meaning is preserved alongside.

## What the book is not

- Not a claim that the Gita is "really" a tech manual.
- Not a productivity book dressed in Sanskrit.
- Not a flattened pop-spirituality treatment. Tradition disagreements are preserved, not smoothed.
- Not done. We're at one verse out of 700.

## Quality system

Every verse is scored on 84 gates across 12 tiers:

| Tier | Theme | Gates |
|---|---|---|
| 1 | Sanskrit source fidelity | 10 |
| 2 | Translation integrity | 8 |
| 3 | Engineering-analog rigor | 12 |
| 4 | Honest-failure tagging | 5 |
| 5 | Linguistic and structural | 8 |
| 6 | Cross-corpus coherence | 8 |
| 7 | Adversarial / red-team | 10 |
| 8 | Cultural and ethical responsibility | 5 |
| 9 | Process and reproducibility | 6 |
| 10 | Pedagogical coherence | 5 |
| 11 | Reader-pragmatic | 4 |
| 12 | Eval-of-eval / meta | 3 |

A verse ships only when ≥ 80/84 gates pass. A chapter ships only when median verse score ≥ 78 and no verse < 70.

Most gates are deterministic. The remaining gates use LLM-judge personas (Sanskrit scholar, hostile senior engineer, skeptical PM, classical Indian philosopher, cynical writer, force-fit detector, inversion test, distortion test, voice-consistency reviewer, trivialization check, tech-manual framing check) that score from a structured prompt template.

Each verse goes through an autoresearch loop — run gates → identify failure → mutate one cause → re-run → keep wins → repeat. Per-verse iteration log is committed to git.

## Calibration verse

**BG 2.47 — *karmaṇy evādhikāras te...***

After three iterations: **60/60 deterministic gates pass**, 24 LLM-judge gates pending, 0 deterministic failures.

Iteration log:
- v0: 53/84 hard. Generic engineering prose.
- v1: 54/84 hard. Devanagari syllable-counter algorithm fixed (was undercounting consonants).
- v2: 57/84 hard. Engineering layer mutated to name specific tools (Postgres, Datadog, Sentry, GitHub) and lift Flesch-Kincaid grade and lexical diversity.
- v3: 60/60 hard. Verbatim-source scraper added (jsdom-based fetch from vedabase.io); GRETIL critical edition added as fourth Sanskrit confirmation; eval bugs fixed in gates 1.9 and 2.6.

## Repo layout

```
shipping-gita/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   └── schema.ts                      # VerseRecord type, IterationLogEntry, GateResult
├── data/
│   ├── sources/
│   │   ├── bg-2-47.json               # source pack: Sanskrit + translations + commentary
│   │   └── raw/
│   │       └── bg-2-47-vedabase.json  # raw HTML scrape capture
│   ├── verses/
│   │   ├── bg-2-47.json               # the verse record (engineering layer + iter log)
│   │   ├── bg-2-47.eval-report.json   # latest gate scores
│   │   └── bg-2-47.judge-report.json  # latest LLM-judge run report
│   └── judge-runs/
│       └── bg-2-47/                   # rendered judge prompts ready for review or LLM
├── eval/
│   ├── gates.json                     # all 84 gate definitions + thresholds + banned phrases
│   ├── run-verse.ts                   # deterministic + hybrid gate runner
│   ├── judge-runner.ts                # LLM-judge runner (stub | claude | codex modes)
│   ├── prompts/                       # one .md per judge persona
│   │   ├── sanskrit-scholar.md
│   │   ├── hostile-engineer.md
│   │   ├── skeptical-pm.md
│   │   ├── indian-philosopher.md
│   │   ├── cynical-writer.md
│   │   ├── force-fit-detector.md
│   │   ├── inversion-test.md
│   │   ├── distortion-test.md
│   │   ├── voice-consistency.md
│   │   ├── trivialization-check.md
│   │   └── tech-manual-framing.md
│   └── lib/
│       ├── text-metrics.ts            # word counts, FK grade, lexical diversity, ratios
│       └── devanagari.ts              # Devanagari + IAST helpers, syllable counter
├── chapters/
│   └── 02-thesis.md                   # chapter 2 thesis (gate 10.3 reference)
└── scripts/
    └── scrape-vedabase.mjs            # raw HTML scraper (jsdom)
```

## Running it

```bash
npm install
npx tsx eval/run-verse.ts bg-2-47          # 84-gate eval, hard score
npx tsx eval/judge-runner.ts bg-2-47 stub  # render judge prompts to disk
node scripts/scrape-vedabase.mjs 2 47      # raw verbatim source capture
```

To wire up the judge runtime to a real LLM endpoint, edit `eval/judge-runner.ts` and replace the `mode === "claude" | "codex"` branch with an API call. The prompts are designed to return strict JSON; the runner parses and records `verdict: "PASS" | "FAIL"`.

## Working principles

- **Sanskrit fidelity is non-negotiable.** No verse ships without ≥3 independent source confirmations.
- **Verbatim quotes only for translations and commentaries** — short fair-use excerpts; full purport text references the source URL rather than reproducing it.
- **Tradition is named when invoked.** Engineering layers using a tradition-specific reading must label the tradition (Advaita, Vishishtadvaita, Gaudiya Vaishnava, etc.).
- **Honest failure over forced quality.** Verses that don't translate cleanly are tagged `STRETCHED` or `OUT_OF_SCOPE`. Better honest gaps than forced cleverness.
- **One mutation at a time.** Per Karpathy autoresearch — every iteration changes a single cause. Log is committed.
- **The Gita is preserved alongside, not replaced by, the engineering layer.**

## License

Source code: MIT.
Sanskrit text: public domain.
Engineering layer (written content): authored by this project; license TBD before publication.
Quoted translations and commentaries: cited under fair use; original copyright belongs to respective authors and publishers; full text is referenced via URL rather than reproduced where possible.
