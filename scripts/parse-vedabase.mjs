import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html = readFileSync('/tmp/vedabase-bg-2-47.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

const sections = ['av-verse_text','av-synonyms','av-translation','av-purport'];
const out = {};
for (const s of sections) {
  const el = doc.querySelector(`.${s}`);
  out[s] = el ? el.textContent.replace(/\s+/g,' ').trim().slice(0, 500) : null;
}
console.log(JSON.stringify(out, null, 2));
