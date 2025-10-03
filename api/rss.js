export default function handler(req, res) {
  const dateKey = getBerlinDateKey();
  const { quotes, idx } = pickQuoteByDate(dateKey);
  const quote = quotes[idx];

  // Basis-URL
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const base = `${proto}://${host}`;

  // EIN Hintergrundbild
  const imageUrl = `${base}/backgrounds/sky.png`;

  const title = "Achtsamkeit – täglicher Impuls";
  const itemTitle = `Täglicher Achtsamkeitsspruch (${dateKey})`;
  const link = "https://example.com/achtsamkeit"; // optional
  const pubDate = new Date().toUTCString();
  const guid = `urn:achtsamkeit:${dateKey}`;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(title)}</title>
    <link>${esc(link)}</link>
    <description>Tägliche, kurze Impulse für mehr Präsenz.</description>
    <language>de-de</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <ttl>60</ttl>

    <image>
      <url>${esc(imageUrl)}</url>
      <title>${esc(title)}</title>
      <link>${esc(link)}</link>
    </image>

    <item>
      <title>${esc(itemTitle)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">${esc(guid)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(quote)}</description>
      <enclosure url="${esc(imageUrl)}" type="image/png"/>
    </item>
  </channel>
</rss>`;

  // Browser- & Reader-freundlich
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).send(rss);
}

function getBerlinDateKey() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
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

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
