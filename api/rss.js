export default function handler(req, res) {
  const dateKey = getBerlinDateKey();
  const { quotes, idx } = pickQuoteByDate(dateKey);
  const quote = quotes[idx];

  const title = "Achtsamkeit – täglicher Impuls";
  const itemTitle = `Täglicher Achtsamkeitsspruch (${dateKey})`;
  const link = "https://example.com/achtsamkeit"; // optional: eigene Seite
  const pubDate = new Date().toUTCString();
  const guid = `urn:achtsamkeit:${dateKey}`;

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const base = `${proto}://${host}`;
  const imgUrl = `${base}/api/card?d=${encodeURIComponent(dateKey)}`;

  const esc = (s) => String(s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&apos;");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(title)}</title>
    <link>${esc(link)}</link>
    <description>Tägliche, kurze Impulse für mehr Präsenz.</description>
    <language>de-de</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${esc(imgUrl)}</url>
      <title>${esc(title)}</title>
      <link>${esc(link)}</link>
    </image>
    <item>
      <title>${esc(itemTitle)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">${esc(guid)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[
        <p>${quote.replace(/</g,"&lt;")}</p>
        <p><img src="${imgUrl}" alt="Achtsamkeits-Impuls ${dateKey}" loading="lazy"/></p>
      ]]></description>
      <enclosure url="${esc(imgUrl)}" type="image/svg+xml"/>
      <media:content url="${esc(imgUrl)}" medium="image" type="image/svg+xml"/>
    </item>
  </channel>
</rss>`;

  // 👉 Variante 2: Browser + RSS-Reader freundlich
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).send(rss);
}

function getBerlinDateKey() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(now);
  const y = parts.find(p => p.type === "year").value;
  const m = parts.find(p => p.type === "month").value;
  const d = parts.find(p => p.type === "day").value;
  return `${y}-${m}-${d}`;
}

function pickQuoteByDate(dateKey) {
  const quotes = [
    "Atme ein. Atme aus. Alles, was du brauchst, ist schon da.",
    "Sei dort, wo deine Füße sind.",
    "Ein ruhiger Geist hört deutlicher.",
    "Heute nur: freundlich mit dir sein.",
    "Zwischen Reiz und Reaktion liegt Raum.",
    "Kleine Pausen, große Wirkung.",
    "Gedanken sind Wolken – du bist der Himmel.",
    "Gelassenheit wächst im Jetzt.",
    "Nichts erledigen, nur bemerken.",
    "Du musst nichts werden. Du bist schon."
  ];
  let hash = 0; 
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  const idx = hash % quotes.length;
  return { quotes, idx };
}
