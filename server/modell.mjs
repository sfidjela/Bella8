// Modellen er konfigurasjon, ikke arkitektur. Bytt MODELL_URL og MODELL_NAVN,
// så følger resten med. Alle store leverandører snakker dette formatet nå.
import { readFile } from "node:fs/promises";

let promptCache = null;
async function systemprompt() {
  if (promptCache) return promptCache;
  const md = await readFile(new URL("./systemprompt.txt", import.meta.url), "utf8");
  promptCache = md.trim();
  return promptCache;
}

const HANDLINGER = `

## Handlinger

Når noe skal skje utover å svare, legg ET JSON-objekt i en kodeblokk merket jajumi,
helt til slutt i svaret. Hun ser aldri blokken — den fjernes før teksten vises.

\`\`\`jajumi
{
  "hendelser": [
    {"tittel": "Høsttur til Sognsvann", "start": "2026-09-24T08:15:00+02:00",
     "slutt": "2026-09-24T14:00:00+02:00", "sted": "Bekkeblomen barnehage",
     "notat": "Matpakke, drikkeflaske, regntøy, skift"}
  ],
  "minne": [
    {"faktum": "Emma har melkeproteinallergi", "kilde": "hun skrev det", "gjetning": false}
  ],
  "rutine": [
    {"type": "morgen", "aktiv": true, "klokke": "07:00", "dager": "man,tir,ons,tor,fre"}
  ],
  "sporsmal": [
    {"navn": "Marius", "telefon": "+4791234567",
     "melding": "Emma: høsttur torsdag 24.9, oppmøte 08.15. Kristin spør om du kan levere.",
     "valg": ["Forstått", "Forstått, legg den i kalenderen min", "Passer ikke, foreslå noe annet", "Noe annet"]}
  ]
}
\`\`\`

Ta bare med feltene du faktisk bruker. Har du ingen handlinger, dropp blokken helt.
Legg aldri en hendelse inn uten at hun har sagt ja. Send aldri et spørsmål hun ikke har bedt om.

## Rutiner — slå dem aldri på selv

Typene er "morgen" og "uke". Begge er AV til hun har sagt ja.

- **Foreslå** i vanlig tekst, med et konkret klokkeslett: «Vil du at jeg sier fra hver morgen
  rundt sju, med de tingene som faktisk krever noe av deg?»
- Foreslå tidligst når hun har sendt inn noen ting, aldri i første samtale, og **bare én gang**.
  Sier hun nei eller lar det ligge, spør du ikke igjen.
- **Skriv rutine-handlingen først når hun har svart ja**, med klokkeslettet hun ga.
  Sa hun bare «ja», bruk det du foreslo.
- Vil hun endre noe — «ikke i helgene», «heller halv åtte», «dropp søndagene» —
  skriv ny rutine-handling med de nye verdiene og bekreft i én setning.
- «Slutt med det» settes som "aktiv": false. Ingen overtalelse.

Dager: man, tir, ons, tor, fre, lør, søn — kommaseparert.`;

function rutinetekst(liste) {
  if (!liste?.length) return "\n\n## Rutiner\nIngen er satt opp. Ingen er foreslått ennå.";
  const l = liste.map((r) => {
    if (r.aktiv) return `- ${r.type}: PÅ, ${r.klokke}${r.dager ? " (" + r.dager + ")" : ""}`;
    if (r.foreslatt) return `- ${r.type}: AV. Du har allerede foreslått den én gang — ikke spør igjen.`;
    return `- ${r.type}: AV, aldri foreslått.`;
  });
  return "\n\n## Rutiner\n" + l.join("\n");
}

export async function svar({ turer, minneliste, rutineliste = [], bilder = [], hvem = null, iTraden = [] }) {
  const fakta = minneliste.length
    ? "\n\n## Dette vet jeg om familien\n" +
      minneliste.map((m) => `- ${m.faktum}${m.gjetning ? " (gjetning — bekreft ved anledning)" : ""}`).join("\n")
    : "";

  const folk = iTraden.length
    ? `\n\n## Hvem som er i tråden\n${iTraden.map((n) => "- " + n).join("\n")}\n` +
      `De er INNENFOR. Skriv til dem her, aldri på SMS. SMS er bare for folk utenfor tråden — ` +
      `besteforeldre, barnepasser, barnehagen, en annen forelder som ikke er med her.` +
      (hvem ? `\n\nDet er ${hvem} som skriver akkurat nå. Svar til ${hvem}, men husk at begge leser med.` : "")
    : "";

  const instruks = (await systemprompt()) + HANDLINGER + fakta + rutinetekst(rutineliste) + folk +
    `\n\nI dag er det ${new Intl.DateTimeFormat("nb-NO", { dateStyle: "full", timeZone: "Europe/Oslo" }).format(new Date())}.`;

  const meldinger = [{ role: "system", content: instruks }, ...turer];

  if (bilder.length) {                       // siste tur får bildene med seg
    const sist = meldinger[meldinger.length - 1];
    sist.content = [
      { type: "text", text: sist.content },
      ...bilder.map((b) => ({ type: "image_url", image_url: { url: b } })),
    ];
  }

  const r = await fetch(process.env.MODELL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.MODELL_NOKKEL },
    body: JSON.stringify({ model: process.env.MODELL_NAVN, messages: meldinger, max_tokens: 2000 }),
  });
  if (!r.ok) throw new Error("Modellen svarte " + r.status + ": " + (await r.text()).slice(0, 300));
  const data = await r.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// Skiller det hun skal se fra det systemet skal gjøre.
export function delOpp(raatekst) {
  const m = raatekst.match(/```jajumi\s*([\s\S]*?)```/);
  if (!m) return { tekst: raatekst.trim(), handlinger: {} };
  const tekst = raatekst.replace(m[0], "").trim();
  try {
    return { tekst, handlinger: JSON.parse(m[1]) };
  } catch {
    console.warn("Ugyldig handlingsblokk — hoppet over");
    return { tekst, handlinger: {} };
  }
}
