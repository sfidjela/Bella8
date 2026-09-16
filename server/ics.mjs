// Kalenderfeed. Hun abonnerer én gang, så kommer alt nytt av seg selv.
// Ingen OAuth, ingen godkjenning, virker på iPhone, Android og Outlook.
const pad = (n) => String(n).padStart(2, "0");

function stempel(iso) {
  const d = new Date(iso);
  return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" +
         pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z";
}
function esc(s) {
  return String(s ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
// ICS krever linjer under 75 oktetter
function brett(linje) {
  const b = Buffer.from(linje, "utf8");
  if (b.length <= 73) return linje;
  const deler = []; let i = 0;
  while (i < b.length) { deler.push(b.subarray(i, i + 72).toString("utf8")); i += 72; }
  return deler.join("\r\n ");
}

export function feed(familie, hendelser) {
  const l = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Jajumi//NO", "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH", brett("X-WR-CALNAME:" + esc("Jajumi — " + familie.navn)),
    "X-PUBLISHED-TTL:PT30M", "REFRESH-INTERVAL;VALUE=DURATION:PT30M",
  ];
  for (const h of hendelser) {
    const slutt = h.slutt ?? new Date(new Date(h.start).getTime() + 3600000).toISOString();
    l.push("BEGIN:VEVENT", "UID:" + h.id + "@jajumi", "DTSTAMP:" + stempel(h.tid),
      "DTSTART:" + stempel(h.start), "DTEND:" + stempel(slutt), brett("SUMMARY:" + esc(h.tittel)));
    if (h.sted) l.push(brett("LOCATION:" + esc(h.sted)));
    if (h.notat) l.push(brett("DESCRIPTION:" + esc(h.notat)));
    l.push("END:VEVENT");
  }
  l.push("END:VCALENDAR");
  return l.join("\r\n") + "\r\n";
}
