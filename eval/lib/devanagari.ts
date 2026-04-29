/**
 * Devanagari + IAST helpers for Tier 1 fidelity gates.
 * Conservative mappings that catch common errors; not a full transliteration engine.
 */

export function normalizeNFC(s: string): string {
  return s.normalize("NFC");
}

export function isPureDevanagari(s: string): boolean {
  // Devanagari Unicode block: U+0900..U+097F. Plus whitespace, common punctuation.
  return /^[ऀ-ॿ\s।॥0-9\.‌‍]+$/.test(s);
}

export function isValidIAST(s: string): boolean {
  // Permissive IAST — covers diacritics for vowels, retroflex, sibilants, dental n,
  // plus standard punctuation, hyphens, apostrophes used for elision.
  return /^[a-zA-Zāīūṛṝḷḹṅñṭḍṇśṣḥṃṁ'\-\s\|\.0-9āīūṅñṭḍṇḷśṣḥṃṁṛ]+$/iu.test(s);
}

export function devanagariCharCount(s: string): number {
  return [...s].filter((c) => /[ऀ-ॿ]/.test(c)).length;
}

export function approximateSyllableCount(devanagari: string): number {
  // Each consonant carries an inherent 'a' (1 syllable) unless followed by virama.
  // Independent vowels count as syllables. Vowel signs (matras) do not add new
  // syllables — they replace the inherent 'a' on the preceding consonant, which
  // is already counted. Anusvara / visarga / chandrabindu do not add syllables.
  let count = 0;
  for (const c of devanagari) {
    // Independent vowels: U+0904..U+0914
    if (/[ऄ-औ]/.test(c)) count++;
    // Consonants: U+0915..U+0939, plus U+0958..U+095F (Persian-script)
    else if (/[क-हक़-य़]/.test(c)) count++;
    // Virama (halant): U+094D — suppresses inherent 'a' on preceding consonant
    else if (/[्]/.test(c)) count--;
    // Vowel signs, anusvara, visarga, chandrabindu, nukta, danda: no syllable change
  }
  return count;
}
