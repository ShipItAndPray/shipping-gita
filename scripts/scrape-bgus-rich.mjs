/**
 * scrape-bgus-rich.mjs <chapter> <verse>
 *
 * More tolerant version of scrape-bgus-commentary.mjs that handles the case
 * where headingz spans appear nested deep in the page (Shankara, Ramanuja,
 * Sridhara, Abhinavagupta etc. are emitted inline within a chain of <p>
 * elements where siblings span across blocks). Strategy: split the raw HTML
 * on the <span class="headingz"> markers and pair each label with the
 * paragraph block that follows it before the next headingz marker.
 */

const [, , chapter, verse] = process.argv;
if (!chapter || !verse) {
  console.error("usage: scrape-bgus-rich.mjs <chapter> <verse>");
  process.exit(2);
}

const url = `https://www.bhagavad-gita.us/bhagavad-gita-${chapter}-${verse}/`;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36";

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

// Capture all "headingz" labels and the body until the next headingz or end.
// We strip HTML tags from the body block and HTML-decode entities afterwards.
const re = /<span\s+class=["']headingz["']\s*>([^<]+)<\/span>([\s\S]*?)(?=<span\s+class=["']headingz["']|<\/article>|<\/main>|<\/div>\s*<\/body>|$)/gi;

function decode(s) {
  return s
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "…")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const commentaries = {};
let m;
while ((m = re.exec(html))) {
  const label = m[1].replace(/\s+/g, " ").trim();
  const body = decode(stripTags(m[2]));
  if (body && body.length > 0) {
    commentaries[label] = body;
  }
}

const out = {
  source: "bhagavad-gita.us",
  url,
  fetched_at: new Date().toISOString(),
  commentaries,
};

console.log(JSON.stringify(out, null, 2));
