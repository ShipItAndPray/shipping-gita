# How to read *The Shipping Gita*

## What this book is

*The Shipping Gita* is an engineering adaptation of the Bhagavad Gita. For each of the Gita's 700 verses, it places one additional reading alongside the Sanskrit and the traditional translations: a reading in the register of someone who builds and operates software systems. Where the Gita teaches the discipline of action without grasping at outcomes, this book asks: what does that discipline look like inside an on-call rotation? Where the Gita names the substrate that is invariant under change, this book asks: what does that look like across a four-year platform migration?

The engineering reading is *additive*. It does not replace the Sanskrit. It does not replace the literal meaning. It does not replace the traditional commentaries. All of those sit on the page first, and the engineering reading sits beside them, clearly labelled.

## What this book is *not*

This book does **not** claim that the Gita is "really" a tech manual. It is not. The Gita is a layered, deeply contested 2,500-year-old text that the world's traditions have read in many ways. Advaita, Vishishtadvaita, Dvaita, modern devotional, and academic readings all coexist. None of them is the engineering reading. The engineering reading is one register among many — it is the register the author works in, and it is the register where the author has found the Gita's operational doctrines transfer cleanly. That is the thesis the book makes, no more.

This book is also **not** a replacement for studying the Gita itself. It is built on top of the tradition, not in place of it. Readers serious about the Gita should read the original — preferably with a translator and tradition they trust.

## How to read a verse

Every verse in this book has the same structure:

1. **Sanskrit anchor.** The Devanāgarī and IAST text. Public domain. The original.
2. **Literal meaning.** A short, plain English rendering of what the Sanskrit says, drawn from established translations.
3. **Engineering translation.** A longer prose rendering in the engineering register. This is the book's own writing.
4. **The scenario.** A concrete example — an actual situation an engineer or operator would recognize — that the verse maps to.
5. **Quotable line.** A one-sentence callout intended to be portable.
6. **Implication.** The operational doctrine the verse implies for the working engineer.

If you only have time for one of these, read the Sanskrit and the literal meaning. The rest is commentary.

## Quality system (the 84 gates, in plain language)

Every verse is scored against a fixed checklist of 84 quality gates before it ships. Roughly: source-pack completeness (Sanskrit triangulated across multiple authoritative sites; multiple translators captured; copyright treated correctly); engineering layer integrity (translation faithful to literal meaning; concrete scenario actually concrete; falsifiability and counter-example present; quotable line ≤ 30 words); chapter-level voice consistency; doctrine consistency across same-tag verses; honest tagging of STRETCHED and LOW-confidence verses. Verses below 70 do not ship without explicit human rescue. The chapter as a whole must hit a median ≥ 78 with ≤ 30% STRETCHED and ≤ 20% LOW. The system is documented in `eval/gates.json`.

## IP and fair use

- **Sanskrit text** — public domain. Reproduced in full in source packs and in the chapter.
- **Translations** — short attributed quotes, fair-use, with translator and publisher named. Verbatim translations are not reproduced in the readable chapter; they live only in the source packs.
- **Commentaries (Shankara, Ramanuja, Prabhupada, Mukundananda, etc.)** — short attributed excerpts, fair-use, with commentator, tradition, and publisher named. Verbatim excerpts are *not reproduced in the readable chapters* — they live only in the source packs as research scaffolding. The readable chapter contains only Sanskrit and the project's own engineering-layer prose.
- **Engineering layer prose** — original to this project. Released under the project's license.

## Honest scope

As of this writing: **Chapter 2 is complete** (72 verses). The other 17 chapters are not. The book is being shipped chapter by chapter, in public, with the eval scores on the table. If a chapter does not pass its quality gates, it does not ship.

## Repository

Source, eval system, source packs, and verse records are at the [project repository](https://github.com/) — see the project's `README.md` for the canonical link.

## Recommended reading order

1. Read this file (you're here).
2. Read [`02-thesis.md`](./02-thesis.md) — the chapter's voice spec and structural argument.
3. Read [`02.md`](./02.md) — the chapter itself, end to end.
4. Use [`02-index.md`](./02-index.md) to scan, and [`02-by-tag.md`](./02-by-tag.md) to find verses on a topic.
