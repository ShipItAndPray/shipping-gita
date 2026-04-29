/**
 * Verse record schema for The Shipping Gita.
 *
 * Every one of the 700 verses produces exactly one VerseRecord, validated
 * against the 84-gate eval suite before it is considered final.
 */

export type Confidence = "HIGH" | "MEDIUM" | "LOW";
export type StretchedReason =
  | "metaphysical-not-translatable"
  | "ritual-not-translatable"
  | "devotional-not-translatable"
  | "narrative-only"
  | "list-of-divine-manifestations"
  | "tradition-specific";

export interface SourceCitation {
  /** Source name, e.g. "vedabase.io", "gitasupersite.iitk.ac.in" */
  source: string;
  /** Specific URL fetched */
  url: string;
  /** Translator/commentator if applicable */
  translator?: string;
  /** Tradition: "Advaita" | "Vishishtadvaita" | "Dvaita" | "Devotional" | "Modern" | "Academic" */
  tradition?: string;
  /** ISO timestamp the page was fetched */
  fetched_at: string;
  /** Verbatim quoted content from the source */
  quote: string;
}

export interface Disagreement {
  /** Which Sanskrit word(s) the translators disagree on */
  word: string;
  /** Each translator's rendering, quoted */
  positions: Array<{ source: string; rendering: string }>;
  /** One-line explanation of why they differ */
  explanation: string;
}

export interface AnvayaItem {
  sanskrit: string;
  iast: string;
  meaning: string;
}

export interface EngineeringLayer {
  /**
   * The verse rewritten as engineering doctrine. NOT a replacement for the
   * traditional meaning — an additive layer.
   */
  translation: string;

  /**
   * Concrete software-engineering scenario in which this verse applies.
   * Must reference a specific named tool, role, situation, or moment.
   */
  concrete_scenario: string;

  /**
   * What would prove this analog wrong in practice. Required.
   * If you cannot write one, the analog is too vague.
   */
  falsifiability: string;

  /**
   * A counter-example: a situation where this verse's stance does NOT apply.
   * Universal-applicability claims are wrong.
   */
  counter_example: string;

  /**
   * What the engineer should change after reading this verse.
   * 1-2 sentences. Inert verses are not finished verses.
   */
  implication: string;

  /**
   * One sentence that survives copy-paste to a tweet — the quotable line.
   */
  quotable_line: string;

  /**
   * Tags from the controlled vocabulary in `data/tag-vocabulary.json`.
   */
  tags: string[];

  /** Engineering analog quality */
  confidence: Confidence;

  /** True if the analog had to stretch the verse's frame */
  stretched: boolean;

  /** True if the verse genuinely does not translate; engineering layer is a stub */
  out_of_scope: boolean;

  /** If out_of_scope, the reason class */
  out_of_scope_reason?: StretchedReason;

  /** If out_of_scope, a paragraph explaining why */
  out_of_scope_explanation?: string;
}

export interface GateResult {
  gate_id: string;
  gate_name: string;
  tier: number;
  passed: boolean;
  detail?: string;
}

export interface IterationLogEntry {
  iteration: number;
  ts: string;
  mutation: string;
  failing_gates_before: string[];
  failing_gates_after: string[];
  prompt_version: string;
}

export interface VerseRecord {
  /** "BG 2.47" */
  id: string;
  chapter: number;
  verse: number;

  /** Devanagari, byte-exact from canonical source */
  sanskrit_devanagari: string;
  /** IAST transliteration */
  sanskrit_iast: string;

  /** Word-by-word breakdown */
  anvaya: AnvayaItem[];

  /** Each translation cited, with its tradition and verbatim quote */
  translations: SourceCitation[];

  /** Each commentary cited */
  commentaries: SourceCitation[];

  /** Where translators disagree, document it */
  disagreements: Disagreement[];

  /** Plain-English consensus literal meaning. Must reflect ≥2 translations. */
  literal_meaning: string;

  /** One-paragraph traditional meaning — what the verse teaches. */
  traditional_meaning: string;

  /** The engineering adaptation layer */
  engineering: EngineeringLayer;

  /** Schema/eval suite version this record was generated against */
  schema_version: string;
  eval_suite_version: string;

  /** Iteration history */
  iterations: IterationLogEntry[];

  /** Final gate scores */
  gate_results: GateResult[];
  total_score: number;
  max_score: number;
  needs_human_rescue: boolean;
}
