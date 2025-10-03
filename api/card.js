export default function handler(req, res) {
  const d = (req.query && req.query.d) || getBerlinDateKey();
  const { quotes, idx } = pickQuoteByDate(d);
  const quote = quotes[idx];
  const svg = renderSVGCard(quote, d);

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

function renderSVGCard(quote, dateKey) {
  const width = 1200, height = 630;
  const safeQuote = String(quote).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const subtitle = `Impuls · ${dateKey}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef3f6"/>
      <stop offset="100%" stop-color="#dfe8ee"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g filter="url(#shadow)">
    <rect x="60" y="60" rx="28" ry="28" width="${width-120}" height="${height-120}" fill="#ffffff"/>
  </g>
  <g transform="translate(110,120)">
    <text x="0" y="0" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="36" fill="#69737d">${subtitle}</text>
    <foreignObject x="0" y="50" width="${width-220}" height="${height-260}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto; font-size:54px; line-height:1.25; color:#0f172a; white-space:pre-wrap;">
        ${safeQuote}
      </div>
    </foreignObject>
  </g>
</svg>`;
}
