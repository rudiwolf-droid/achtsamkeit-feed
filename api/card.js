export default function handler(req, res) {
  const d = (req.query && req.query.d) || getBerlinDateKey();
  const { quotes, idx } = pickQuoteByDate(d);
  const quote = quotes[idx];

  // Absolute URL zum Hintergrundbild
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const base = `${proto}://${host}`;
  const bgUrl = `${base}/backgrounds/sky.png`;

  const svg = renderSVGCard(quote, d, bgUrl);
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.status(200).send(svg);
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
  let hash = 0; for (let i = 0; i < dateKey.length; i++) hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  const idx = hash % quotes.length;
  return { quotes, idx };
}

function renderSVGCard(quote, dateKey, bgUrl) {
  const width = 1200, height = 630;
  const safeQuote = String(quote).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const subtitle = `Impuls · ${dateKey}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Hintergrundfoto -->
  <image href="${bgUrl}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" />
  <!-- Overlay für Lesbarkeit -->
  <rect width="${width}" height="${height}" fill="rgba(0,0,0,0.35)"/>
  <!-- Text -->
  <g transform="translate(80,80)">
    <text x="0" y="0" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="36" fill="rgba(255,255,255,0.9)">${subtitle}</text>
    <foreignObject x="0" y="50" width="${width-160}" height="${height-160}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto; font-size:54px; line-height:1.25; color:#fff; white-space:pre-wrap; text-shadow:0 2px 6px rgba(0,0,0,0.5);">
        ${safeQuote}
      </div>
    </foreignObject>
  </g>
</svg>`;
}
