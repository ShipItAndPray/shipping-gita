import { JSDOM } from "jsdom";

const url = `https://www.bhagavad-gita.us/bhagavad-gita-5-27-28/`;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";

const res = await fetch(url, {
  headers: {
    "User-Agent": UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
    "Accept-Language": "en-US,en;q=0.9",
  },
});
if (!res.ok) {
  console.error(`fetch failed: ${res.status}`);
  process.exit(1);
}
const html = await res.text();
const dom = new JSDOM(html);
const doc = dom.window.document;

const commentaries = {};
const headings = doc.querySelectorAll("span.headingz");
for (const h of headings) {
  const label = h.textContent.replace(/\s+/g, " ").trim();
  let parentP = h.closest("p");
  if (!parentP) continue;
  let next = parentP.nextElementSibling;
  while (next && next.tagName !== "P") next = next.nextElementSibling;
  if (!next) continue;
  if (next.querySelector("span.headingz")) continue;
  const body = next.textContent.replace(/\s+/g, " ").trim();
  commentaries[label] = body;
}

const out = {
  source: "bhagavad-gita.us",
  url,
  fetched_at: new Date().toISOString(),
  combined: "5.27-28",
  commentaries,
};
console.log(JSON.stringify(out, null, 2));
