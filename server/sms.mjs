// SMS ut. Avsender MÅ være et langt nummer — alfanumerisk avsender kan ikke motta svar,
// og hele sløyfa hviler på at han kan svare med ett tall.
const LEV = (process.env.SMS_LEVERANDOR ?? "logg").toLowerCase();

async function sveve(til, tekst) {
  const url = new URL("https://sveve.no/SMS/SendMessage");
  url.search = new URLSearchParams({
    user: process.env.SVEVE_BRUKER, passwd: process.env.SVEVE_PASSORD,
    to: til, msg: tekst, from: process.env.SMS_AVSENDER, f: "json",
  }).toString();
  const r = await fetch(url, { method: "POST" });
  if (!r.ok) throw new Error("Sveve svarte " + r.status);
  return r.json();
}

async function twilio(til, tekst) {
  const sid = process.env.TWILIO_SID;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(sid + ":" + process.env.TWILIO_TOKEN).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: til, From: process.env.SMS_AVSENDER, Body: tekst }),
  });
  if (!r.ok) throw new Error("Twilio svarte " + r.status + " " + (await r.text()));
  return r.json();
}

export async function send(til, tekst) {
  if (LEV === "sveve") return sveve(til, tekst);
  if (LEV === "twilio") return twilio(til, tekst);
  console.log("\n--- SMS (ikke sendt, ingen leverandør satt) ---\ntil: %s\n%s\n---\n", til, tekst);
  return { simulert: true };
}

// GDPR art. 14: mottakeren er ikke kunde og må få vite hvem som sender og hvordan hun sier nei.
export function bygg({ fraNavn, brodtekst, valg }) {
  const linjer = [`Fra ${fraNavn}, via Jajumi.`, ""];
  linjer.push(brodtekst.trim(), "");
  if (valg?.length) {
    linjer.push("Svar med ett tall:");
    valg.forEach((v, i) => linjer.push(`${i + 1} - ${v}`));
    linjer.push("");
  }
  linjer.push("Svar STOPP om du ikke vil ha flere meldinger.");
  return linjer.join("\n");
}
