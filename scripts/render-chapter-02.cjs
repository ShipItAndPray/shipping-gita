#!/usr/bin/env node
// Render Chapter 2 of "The Shipping Gita" into readable book form.
// Reads source packs (data/sources/bg-2-N.json) and verse engineering layers
// (data/verses/bg-2-N.json) and emits chapters/02.md plus support files.
//
// IP: only Sanskrit (public domain) and the project's own engineering-layer
// prose are reproduced in the readable chapter. Verbatim Prabhupada /
// Mukundananda / Shankara / Ramanuja excerpts that live in the source packs
// are NOT reproduced here.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'sources');
const VERSES = path.join(ROOT, 'data', 'verses');
const CHAPTERS = path.join(ROOT, 'chapters');

const N = 72;

// ---------------------------------------------------------------------------
// One-line glosses per verse. These are book-side editorial — the readable
// section heading. Drawn from the engineering translation/quotable for each
// verse. Hand-authored; voice consistent with chapter thesis.
const GLOSSES = {
  1: "The held breath before the teaching",
  2: "Krishna's first sharp word: this is not the moment for collapse",
  3: "Stand up — the operator's role is not optional here",
  4: "The reasonable-sounding objection that hides a refusal",
  5: "When 'I would rather quit' is dressed up as wisdom",
  6: "We do not even know which outcome we want",
  7: "The student finally asks; the teaching can begin",
  8: "Naming the limit of self-help",
  9: "The silence after surrender",
  10: "The smile before the correction",
  11: "Your grief is for what was never the substrate",
  12: "Neither the team nor the system began at the launch",
  13: "Schemas migrate; the spec persists",
  14: "Dashboards spike and recede; you outlast them",
  15: "The operator who is unmoved by both pages and praise",
  16: "What is real does not vanish; what is unreal does not last",
  17: "The substrate of the system cannot be deleted",
  18: "Implementations are mortal; the contract is not",
  19: "Neither the deleter nor the deleted is touched",
  20: "The interface is not born and does not die",
  21: "Knowing this, who would mourn an implementation?",
  22: "Old code is shed like worn clothes; the spec puts on new code",
  23: "No deploy can corrupt it; no rollback can undo it",
  24: "Ancient, unchanging, the substrate persists",
  25: "Unmanifest, unthinkable, immutable — stop grieving for it",
  26: "Even on the materialist reading, grief is unwarranted",
  27: "Birth and death are inevitable; do not lament the unavoidable",
  28: "Origin and end are obscured; only the middle is visible",
  29: "Few see this clearly; most only repeat what they have heard",
  30: "The substrate is indestructible — therefore stop grieving",
  31: "And on duty grounds alone, you should not flinch",
  32: "The rare opportunity has come unsought — do not refuse it",
  33: "Refusing your prescribed action is itself a failure",
  34: "Reputation outlives the moment; dishonor is heavier than death",
  35: "Those who respected you will read your retreat as fear",
  36: "Your peers will speak of you in terms you cannot answer",
  37: "Either way, the path is action — rise and act",
  38: "Treat win and loss as the same; then act",
  39: "From now: the discipline of action itself, by which the bondage of action is broken",
  40: "On this path, no effort is wasted; even a little protects much",
  41: "The decided mind is one; the undecided mind branches infinitely",
  42: "The flowery talkers who promise heaven for ritual works",
  43: "They aim at sense-pleasure and call it the goal",
  44: "Their attached minds cannot settle in the steady operator state",
  45: "Rise above the three modes; rest in the unchanging Self",
  46: "When the well is everywhere, the cistern is incidental",
  47: "Your jurisdiction is action; outcomes are not yours",
  48: "Equipoise is the yoga; act from there",
  49: "Act from buddhi-yoga; the fruit-graspers are the small ones",
  50: "Skill in action is what yoga names",
  51: "Free from fruit, the wise step beyond the bondage of birth",
  52: "When intellect crosses the thicket of delusion, scripture itself becomes secondary",
  53: "Steady in samādhi, untouched by the noise of competing doctrines — that is yoga",
  54: "Arjuna asks: what does the steady-minded one look like?",
  55: "Letting go of constructed desire, content in the Self alone",
  56: "Untroubled by sorrow, unhungry for pleasure, free of fear and rage",
  57: "Neither welcoming nor recoiling — fixed insight",
  58: "Withdrawing the senses as a tortoise withdraws its limbs",
  59: "Objects fade for the abstainer, but taste lingers — taste itself fades when the higher is seen",
  60: "Even the disciplined senses can drag the mind off course",
  61: "Therefore restrain them; the one whose senses are mastered, his insight is steady",
  62: "Dwelling on objects breeds attachment; from attachment, desire; from desire, anger",
  63: "From anger, delusion; from delusion, memory-loss; then intellect collapses; then the operator is gone",
  64: "Moving among objects with senses governed, the disciplined operator finds clarity",
  65: "In that clarity, sorrows end; the steady mind takes its seat",
  66: "Without yoga, no insight; without insight, no peace; without peace, no joy",
  67: "Even one wandering sense drags the mind as wind drags a boat",
  68: "Therefore, whose senses are withdrawn, his insight is steady",
  69: "What is night for the rest is the awake-time of the operator who sees; what they call day is night to the seer",
  70: "Like the ocean receiving rivers without overflowing — the steady operator receives desires without disturbance",
  71: "Free from grasping, free from 'I' and 'mine', the operator attains peace",
  72: "This is the brāhmī state — entered, the operator does not fall back; even at the last hour, this state is mokṣa"
};

// ---------------------------------------------------------------------------
// Section structure
const SECTIONS = [
  {
    key: 'collapse',
    range: [1, 10],
    title: 'The Collapse and the First Correction',
    intro:
      "The chapter opens not with a doctrine but with a scene. Sañjaya is still narrating the failure: " +
      "the operator is collapsed, eyes wet, hands off the keyboard. Krishna's first words are not consolation. " +
      "Verses 2.2 and 2.3 are the senior teacher's sharpest moment in the chapter — direct, almost brusque, refusing to negotiate with " +
      "the framing Arjuna has built for his retreat. Then Arjuna restates the case (2.4–2.8), finally surrenders the role of " +
      "self-help operator (2.7), and asks to be taught. The block ends with the held silence (2.9–2.10) before the actual " +
      "teaching begins.",
    transition:
      "The narrative scaffolding has done its work. The operator has stopped trying to talk himself out of the situation, " +
      "has named himself a student, and has asked to be taught. What follows is not more reframing of the immediate question. " +
      "What follows is first principles — what survives change, what does not, and therefore what was never under threat in " +
      "the first place."
  },
  {
    key: 'sankhya',
    range: [11, 30],
    title: 'What Survives Change',
    intro:
      "These twenty verses are the chapter's sāṅkhya block — the imperishable doctrine. They argue, in four sub-blocks, " +
      "that the substrate of the situation was never under threat: the ātman is not born, does not die, is not the body, " +
      "is not the implementation, is not the dashboard. In the engineering register: the spec, the contract, the architectural " +
      "invariant. The block moves from the metaphysical claim (2.11–2.16) to the imperishable doctrine proper (2.17–2.25), " +
      "to the materialist fallback argument (2.26–2.28), to the mystery acknowledgement and final imperative (2.29–2.30).",
    transition:
      "The substrate has been named. It does not perish. The operator, knowing this, is no longer fighting on the substrate level. " +
      "Knowing that, Krishna can now say what Arjuna has been waiting to hear: how to act. The next block does not abandon the " +
      "metaphysics — it stands on it. Karma-yoga is the discipline of action for the one who has internalized that the imperishable is not " +
      "what is at stake."
  },
  {
    key: 'karma-yoga',
    range: [31, 53],
    title: 'The Discipline of Action',
    intro:
      "The karma-yoga block has three movements. First, the duty argument (2.31–2.38) — Krishna names svadharma, names the " +
      "asymmetry of refusing to act, names the social cost of the wrong kind of withdrawal, and closes with the equanimity formula. " +
      "Second, buddhi-yoga is introduced (2.39–2.46) — the difference between the decided mind and the undecided one, the critique " +
      "of fruit-attached ritualists, and the call to rise above the three guṇas. Third, the great verses on action without grasping " +
      "(2.47–2.53) — the most quoted block of the Gita, and the chapter's operational core.",
    transition:
      "The discipline has been named. Act from equipoise; do not grasp at outcomes; do not refuse the act because of attachment to its " +
      "fruit. Arjuna now asks the natural follow-up: what does someone who has actually internalized this look like? " +
      "What does the operator who has integrated sāṅkhya and karma-yoga look like in production? The final block answers."
  },
  {
    key: 'sthita-prajna',
    range: [54, 72],
    title: 'The Seasoned Operator',
    intro:
      "These nineteen verses describe the sthita-prajña — the one whose insight is steady. They are not aspirational metaphors. " +
      "They are concrete. The block opens with Arjuna's question (2.54), names the inner state (2.55–2.57), names the discipline " +
      "of the senses (2.58–2.61), names the catastrophic cascade that follows when the discipline is dropped (2.62–2.63), names " +
      "the inverted day-night of the seer (2.69), names the ocean simile (2.70), and closes with the brāhmī state at 2.72. " +
      "The chapter ends not with a slogan but with a destination.",
    transition:
      "Chapter 2 closes here. The seasoned operator has been described, not idealized. The chapter is complete."
  }
];

// ---------------------------------------------------------------------------
function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadVerse(n) {
  const src = readJSON(path.join(SRC, `bg-2-${n}.json`));
  const verse = readJSON(path.join(VERSES, `bg-2-${n}.json`));
  return { src, verse };
}

// ---------------------------------------------------------------------------
function renderVerse(n) {
  const { src, verse } = loadVerse(n);
  const e = verse.engineering;
  const gloss = GLOSSES[n];
  const dev = (src.sanskrit_devanagari || '').trim();
  const iast = (src.sanskrit_iast || '').trim();
  const literal = (src.literal_meaning || '').trim();

  const lines = [];
  lines.push(`### BG 2.${n} — ${gloss}`);
  lines.push('');
  // Sanskrit block
  lines.push('```');
  if (dev) lines.push(dev);
  if (iast) {
    if (dev) lines.push('');
    lines.push(iast);
  }
  lines.push('```');
  lines.push('');
  // Literal
  if (literal) {
    lines.push(`*Literal:* ${literal}`);
    lines.push('');
  }
  // Engineering translation
  lines.push(`**Engineering translation.** ${e.translation.trim()}`);
  lines.push('');
  // Concrete scenario
  lines.push(`**The scenario.** ${e.concrete_scenario.trim()}`);
  lines.push('');
  // Quotable
  if (e.quotable_line) {
    lines.push(`> ${e.quotable_line.trim()}`);
    lines.push('');
  }
  // Implication
  if (e.implication) {
    lines.push(`**Implication.** ${e.implication.trim()}`);
    lines.push('');
  }
  // STRETCHED / LOW honesty note
  const isStretched = !!e.stretched;
  const isLow = e.confidence === 'LOW';
  if (isStretched || isLow) {
    let note = '';
    if (isLow && isStretched) {
      note = `*Editor's note: this verse is tagged STRETCHED with LOW confidence. Per the chapter thesis, narrative-scaffolding verses (2.1, 2.9, 2.10) carry no engineering doctrine of their own — the engineering layer above is descriptive, not prescriptive. Read it as scene-setting; do not force-fit it into a maxim.*`;
    } else if (isStretched && e.confidence === 'MEDIUM') {
      // Per-verse note set later via STRETCHED_MEDIUM_NOTES
      note = `*Editor's note: this verse is tagged STRETCHED. The engineering reading offered here is one valid mapping, not a claim that the verse is "really" about engineering.*`;
    } else if (isStretched) {
      note = `*Editor's note: this verse is tagged STRETCHED. The engineering reading offered here is one valid mapping, not a claim that the verse is "really" about engineering.*`;
    } else if (isLow) {
      note = `*Editor's note: this verse is tagged LOW confidence. Treat the engineering reading as provisional.*`;
    }
    if (note) {
      lines.push(note);
      lines.push('');
    }
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
function renderPreface() {
  return `# Chapter 2 — *Sāṅkhya Yoga* / The First Principles for the Engineer

> *"You grieve for those for whom no grief is warranted, and you speak words that sound wise. The wise grieve for neither the living nor the dead." — paraphrase of BG 2.11*

This chapter is where the teaching begins. Chapter 1 was the operator's collapse. The end of Chapter 1 left Arjuna sunk in his chariot, weapons set down, refusing to act. Chapter 2 is Krishna's first sustained answer — and the answer is not what Arjuna asked for.

What Arjuna wants, at the start of Chapter 2, is permission. Permission to walk away. Permission to call his collapse wisdom. Permission to convert "I cannot bear to do this" into "this is not worth doing." Krishna refuses that conversion. Verses 2.2 and 2.3 are the chapter's first sharp word — corrective, almost stern, naming the collapse as collapse rather than insight. Then, having refused the framing, Krishna does something more ambitious than answer the immediate question. He reframes the substrate the question rests on.

The chapter weaves three threads. They are named separately in the tradition and they are named separately here:

1. **Sāṅkhya** — first-principles knowledge. What survives change; what is configuration vs. essence; the imperishable that is the substrate of action. This is verses 2.11 through 2.30. In the engineering register: the architectural invariant, the contract, the spec — what persists when the implementation churns.

2. **Karma-yoga** — the discipline of action. How to act once the substrate is known. This is verses 2.31 through 2.53, and it contains the most quoted verse in the Gita: 2.47, *karmaṇy-evādhikāras te*. In the engineering register: shipping discipline, the on-call doctrine, the deploy ethic — how to act with full effort without grasping at outcomes.

3. **Sthita-prajña** — the seasoned operator's state of mind. What the practitioner who has internalized the first two threads actually looks like. This is verses 2.54 through 2.72. In the engineering register: the senior engineer who is no longer reactive to dashboards, the team that runs a postmortem without blame, the operator whose substrate is not downstream of last quarter's release.

The chapter is structured as a dramatic arc: the collapse and the first correction (2.1–2.10); the imperishable doctrine (2.11–2.30); the discipline of action (2.31–2.53); the seasoned operator's state (2.54–2.72). Each block is a movement. The reader who reads the chapter as a sequence rather than as a verse-list will see the arc do its work — Krishna refuses the tactical question, reframes at first principles, names the discipline, and finally describes the destination.

A note on what this chapter is and is not. The engineering layer offered alongside each verse is *additive* — one valid way to read the verse, in one specific register. It does not displace the traditional readings, which sit alongside it on every page. It does not claim the Gita is "really" a tech manual. It claims only that an engineer reading the Gita seriously will find that several of its operational doctrines transfer cleanly to the discipline of building software systems — and that this transfer is worth writing down. The chapter's voice, per the [chapter thesis](./02-thesis.md), is didactic and slightly stern. Krishna here is teaching, not consoling. We have tried to keep that.

`;
}

function renderClose() {
  return `## Chapter close

Chapter 2 has done four things. It refused the tactical question Arjuna brought (the question was not actually answerable at the tactical level). It named the substrate that was never under threat (the imperishable, the spec, the architectural invariant). It named the discipline of action by which the operator participates in the system without being dragged by the system (karma-yoga, the equipoise of 2.48, the great formulation of 2.47). And it described the destination — the sthita-prajña, the operator whose insight is steady because the cascade of grasping (2.62–2.63) does not start in them.

The chapter is, in a real sense, the entire Gita in compressed form. Almost every doctrine the later chapters will elaborate is named here. Chapter 3, *Karma-Yoga* proper, will spend forty-three verses arguing the case for action — answering the obvious follow-up to 2.49 ("if buddhi-yoga is superior to mere action, why act at all?"). Chapter 4 will introduce the line of teaching and the doctrine of divine descent. Chapter 5 will take up the question of right vs. wrong renunciation and warn against the misreading that "act without attachment" means "do not act." Chapter 6 will name the practice. Chapter 12 will return to the *bhakti* theme. Chapter 18 will close the entire teaching by releasing all dharmas. None of this contradicts Chapter 2. Chapter 2 sets the floor.

What does Chapter 2 teach the engineer-reader? It teaches that there are levels at which a question cannot be answered, and that an honest senior teacher refuses tactical questions whose answer is at the architectural level. It teaches that the substrate of a system — the contract, the spec, what the system is genuinely doing — is more durable than any specific implementation, and therefore that change in the implementation is not loss in the sense the panicked operator experiences it. It teaches that action is not optional — refusing to ship a migration that has to happen is not wisdom, it is failure. And it teaches that there is a real, achievable operator state — not a slogan, not a poster phrase — in which the dashboard's spike does not move the operator's center, and the user's praise does not either, because the operator's center is no longer downstream of either.

The closing verse, 2.72, names a destination further than the engineering register can carry. We have said so honestly. The operational rung that 2.72 implies — entering the steady state and not falling back from it — *is* reachable, and the senior operators we have worked with reach it. The metaphysical rung that 2.72 actually names is something the chapter has earned the right to name and we have not earned the right to flatten. The chapter ends there, and so does this rendering of it.
`;
}

// ---------------------------------------------------------------------------
// Per-verse stretched-medium notes (looked up at render time, not in the
// generic note above).
const STRETCHED_MEDIUM_NOTES = {
  45: `*Editor's note: this verse is tagged STRETCHED. It names the three guṇas and the call to rise beyond them (nistraiguṇya). The engineering analog — the team-state diagnostic of tamas / rajas / sattva — is a useful pedagogical map. The verse's metaphysical scope, including what is past the three modes entirely, exceeds what the engineering register can carry. The mapping is honest about that.*`,
  51: `*Editor's note: this verse is tagged STRETCHED. It names release from the bondage of birth (janma-bandha-vinirmuktāḥ). The engineering layer reads it as the operator's identity ceasing to be downstream of outcomes — which is the chapter's karma-yoga doctrine — but the verse names a metaphysical horizon larger than the engineering register reaches.*`,
  72: `*Editor's note: this verse is tagged STRETCHED. It is the chapter's closing verse and names the brāhmī sthiti — the state of being established in Brahman. The engineering layer names a recognizable operational rung — the seasoned operator who is no longer downstream of the dashboard. The verse names something further. The mapping is honest about the gap.*`
};

// Override the generic stretched-medium note in renderVerse with per-verse text
const GENERIC_STRETCHED_NOTE = `*Editor's note: this verse is tagged STRETCHED. The engineering reading offered here is one valid mapping, not a claim that the verse is "really" about engineering.*`;
function renderVerseFinal(n) {
  let txt = renderVerse(n);
  if (STRETCHED_MEDIUM_NOTES[n]) {
    txt = txt.replace(GENERIC_STRETCHED_NOTE, STRETCHED_MEDIUM_NOTES[n]);
  }
  return txt;
}

// ---------------------------------------------------------------------------
function renderChapter() {
  const out = [];
  out.push(renderPreface());
  for (const sec of SECTIONS) {
    out.push(`## ${sec.title} (BG 2.${sec.range[0]}–2.${sec.range[1]})`);
    out.push('');
    out.push(sec.intro);
    out.push('');
    for (let n = sec.range[0]; n <= sec.range[1]; n++) {
      out.push(renderVerseFinal(n));
      out.push('');
    }
    if (sec.transition) {
      out.push(`*${sec.transition}*`);
      out.push('');
    }
  }
  out.push(renderClose());
  return out.join('\n');
}

// ---------------------------------------------------------------------------
function renderIndex() {
  const lines = [];
  lines.push('# Chapter 2 — Browsable Index');
  lines.push('');
  lines.push('One row per verse: ID · one-line gloss · tags · confidence.');
  lines.push('');
  lines.push('| Verse | Gloss | Tags | Confidence |');
  lines.push('|-------|-------|------|------------|');
  for (let n = 1; n <= N; n++) {
    const { verse } = loadVerse(n);
    const e = verse.engineering;
    const gloss = GLOSSES[n].replace(/\|/g, '\\|');
    const tags = (e.tags || []).join(', ');
    const conf = e.confidence + (e.stretched ? ' · STRETCHED' : '');
    lines.push(`| BG 2.${n} | ${gloss} | ${tags} | ${conf} |`);
  }
  lines.push('');
  lines.push('See [02.md](./02.md) for the readable chapter.');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
function renderByTag() {
  const tagToVerses = new Map();
  for (let n = 1; n <= N; n++) {
    const { verse } = loadVerse(n);
    const tags = (verse.engineering.tags || []);
    for (const t of tags) {
      if (!tagToVerses.has(t)) tagToVerses.set(t, []);
      tagToVerses.get(t).push(n);
    }
  }
  // Order tags by count desc, then alpha
  const sortedTags = Array.from(tagToVerses.entries())
    .sort((a, b) => (b[1].length - a[1].length) || a[0].localeCompare(b[0]));

  const lines = [];
  lines.push('# Chapter 2 — Topic Index (by tag)');
  lines.push('');
  lines.push('Verses grouped by their primary engineering tags. Tag vocabulary is controlled by `eval/gates.json`. Use this index to find verses on a topic.');
  lines.push('');
  for (const [tag, ns] of sortedTags) {
    lines.push(`## \`${tag}\` (${ns.length} verse${ns.length === 1 ? '' : 's'})`);
    lines.push('');
    for (const n of ns) {
      lines.push(`- **BG 2.${n}** — ${GLOSSES[n]}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
function renderHowToRead() {
  return `# How to read *The Shipping Gita*

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

Every verse is scored against a fixed checklist of 84 quality gates before it ships. Roughly: source-pack completeness (Sanskrit triangulated across multiple authoritative sites; multiple translators captured; copyright treated correctly); engineering layer integrity (translation faithful to literal meaning; concrete scenario actually concrete; falsifiability and counter-example present; quotable line ≤ 30 words); chapter-level voice consistency; doctrine consistency across same-tag verses; honest tagging of STRETCHED and LOW-confidence verses. Verses below 70 do not ship without explicit human rescue. The chapter as a whole must hit a median ≥ 78 with ≤ 30% STRETCHED and ≤ 20% LOW. The system is documented in \`eval/gates.json\`.

## IP and fair use

- **Sanskrit text** — public domain. Reproduced in full in source packs and in the chapter.
- **Translations** — short attributed quotes, fair-use, with translator and publisher named. Verbatim translations are not reproduced in the readable chapter; they live only in the source packs.
- **Commentaries (Shankara, Ramanuja, Prabhupada, Mukundananda, etc.)** — short attributed excerpts, fair-use, with commentator, tradition, and publisher named. Verbatim excerpts are *not reproduced in the readable chapters* — they live only in the source packs as research scaffolding. The readable chapter contains only Sanskrit and the project's own engineering-layer prose.
- **Engineering layer prose** — original to this project. Released under the project's license.

## Honest scope

As of this writing: **Chapter 2 is complete** (72 verses). The other 17 chapters are not. The book is being shipped chapter by chapter, in public, with the eval scores on the table. If a chapter does not pass its quality gates, it does not ship.

## Repository

Source, eval system, source packs, and verse records are at the [project repository](https://github.com/) — see the project's \`README.md\` for the canonical link.

## Recommended reading order

1. Read this file (you're here).
2. Read [\`02-thesis.md\`](./02-thesis.md) — the chapter's voice spec and structural argument.
3. Read [\`02.md\`](./02.md) — the chapter itself, end to end.
4. Use [\`02-index.md\`](./02-index.md) to scan, and [\`02-by-tag.md\`](./02-by-tag.md) to find verses on a topic.
`;
}

// ---------------------------------------------------------------------------
fs.writeFileSync(path.join(CHAPTERS, '02.md'), renderChapter());
fs.writeFileSync(path.join(CHAPTERS, '02-index.md'), renderIndex());
fs.writeFileSync(path.join(CHAPTERS, '02-by-tag.md'), renderByTag());
fs.writeFileSync(path.join(CHAPTERS, '00-how-to-read.md'), renderHowToRead());

console.log('Wrote chapters/02.md');
console.log('Wrote chapters/02-index.md');
console.log('Wrote chapters/02-by-tag.md');
console.log('Wrote chapters/00-how-to-read.md');

// Word count for 02.md
const ch = fs.readFileSync(path.join(CHAPTERS, '02.md'), 'utf8');
const wc = ch.split(/\s+/).filter(Boolean).length;
console.log(`02.md word count: ${wc}`);
