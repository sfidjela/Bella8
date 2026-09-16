// Jajumi-server. Ingen pakker å installere — alt er innebygd i Node 22.
//   node server.mjs
import { createServer } from "node:http";
import * as db from "./db.mjs";
import * as sms from "./sms.mjs";
import { feed } from "./ics.mjs";
import { svar, delOpp } from "./modell.mjs";

const PORT = Number(process.env.PORT ?? 8080);
const BASE = process.env.BASE_URL ?? `http://localhost:${PORT}`;

const json = (res, kode, data) => {
  res.writeHead(kode, { "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" });
  res.end(JSON.stringify(data));
};
async function lesJson(req) {
  const biter = [];
  for await (const b of req) {
    biter.push(b);
    if (biter.reduce((n, x) => n + x.length, 0) > 12e6) throw new Error("for stor forespørsel");
  }
  return biter.length ? JSON.parse(Buffer.concat(biter).toString("utf8")) : {};
}

// --- utfør det modellen ba om ---------------------------------------------
async function utfor(fam, handlinger) {
  const gjort = { hendelser: [], sporsmal: [] };

  for (const h of handlinger.hendelser ?? []) {
    if (!h?.tittel || !h?.start) continue;
    const id = db.leggHendelse(fam.id, h);
    gjort.hendelser.push({ id, tittel: h.tittel, start: h.start });
  }
  for (const m of handlinger.minne ?? []) {
    if (m?.faktum) db.leggMinne(fam.id, m.faktum, m.kilde, !!m.gjetning);
  }
  for (const r of handlinger.rutine ?? []) {
    if (r?.type !== "morgen" && r?.type !== "uke") continue;
    db.settRutine(fam.id, r.type, { aktiv: !!r.aktiv, klokke: r.klokke, dager: r.dager });
    gjort.rutiner = gjort.rutiner ?? [];
    gjort.rutiner.push({ type: r.type, aktiv: !!r.aktiv, klokke: r.klokke });
  }
  for (const s of handlinger.sporsmal ?? []) {
    if (!s?.telefon || !s?.melding) continue;
    if (db.sperret(s.telefon)) { gjort.sporsmal.push({ navn: s.navn, status: "sperret" }); continue; }
    const valg = Array.isArray(s.valg) && s.valg.length ? s.valg : ["Forstått", "Passer ikke"];
    const id = db.nyForesporsel(fam.id, s.navn ?? "", s.telefon, s.melding, valg);
    const tekst = sms.bygg({ fraNavn: fam.navn, brodtekst: s.melding, valg });
    try {
      await sms.send(s.telefon, tekst);
      gjort.sporsmal.push({ id, navn: s.navn, status: "sendt" });
    } catch (e) {
      console.error("SMS feilet:", e.message);
      gjort.sporsmal.push({ id, navn: s.navn, status: "feilet" });
    }
  }
  return gjort;
}

async function kjorTur(fam, tekst, bilder, medlem = null) {
  const speiling = !!fam.speiling;
  db.leggTur(fam.id, "user", tekst || "(sendte skjermbilde)", medlem?.id ?? null, medlem?.navn ?? null);
  const raa = await svar({
    turer: db.siste(fam.id, { medlem: medlem?.id ?? null, speiling }),
    minneliste: db.minne(fam.id),
    rutineliste: db.rutiner(fam.id),
    hvem: medlem?.navn ?? null,
    iTraden: db.medlemmer(fam.id).map((m) => m.navn),
    bilder,
  });
  const { tekst: synlig, handlinger } = delOpp(raa);
  db.leggTur(fam.id, "assistant", synlig, medlem?.id ?? null, null);
  const gjort = await utfor(fam, handlinger);
  return { tekst: synlig, gjort };
}

// --- ruter ------------------------------------------------------------------
const server = createServer(async (req, res) => {
  const u = new URL(req.url, BASE);
  const p = u.pathname;
  try {
    if (req.method === "OPTIONS") return json(res, 204, {});

    if (req.method === "POST" && p === "/api/familie") {
      const b = await lesJson(req);
      if (!b.navn) return json(res, 400, { feil: "navn mangler" });
      const f = db.nyFamilie(b.navn, b.telefon);
      return json(res, 200, { ...f, kalender: `${BASE}/kal/${f.kal_token}.ics` });
    }

    if (req.method === "POST" && p === "/api/medlem") {
      const b = await lesJson(req);
      const fam = db.familie(b.familie);
      if (!fam) return json(res, 404, { feil: "ukjent familie" });
      if (!b.navn) return json(res, 400, { feil: "navn mangler" });
      const m = db.nyttMedlem(fam.id, b.navn, b.telefon);
      return json(res, 200, { ...m, lenke: `${BASE}/?t=${m.token}` });
    }

    if (req.method === "POST" && p === "/api/speiling") {
      const b = await lesJson(req);
      const m = db.medlemVedToken(b.token);
      if (!m) return json(res, 401, { feil: "ukjent token" });
      db.settSpeiling(m.familie, !!b.paa);
      return json(res, 200, { ok: true, speiling: !!b.paa });
    }

    if (req.method === "POST" && p === "/api/melding") {
      const b = await lesJson(req);
      const medlem = b.token ? db.medlemVedToken(b.token) : null;
      const fam = medlem ? db.familie(medlem.familie) : db.familie(b.familie);
      if (!fam) return json(res, 401, { feil: "ukjent token" });
      const ut = await kjorTur(fam, (b.tekst ?? "").trim(), b.bilder ?? [], medlem);
      return json(res, 200, ut);
    }

    if (req.method === "GET" && p === "/api/tilstand") {
      const tok = u.searchParams.get("t");
      const medlem = tok ? db.medlemVedToken(tok) : null;
      const fam = medlem ? db.familie(medlem.familie) : db.familie(u.searchParams.get("familie"));
      if (!fam) return json(res, 401, { feil: "ukjent token" });
      return json(res, 200, {
        familie: fam.navn,
        meg: medlem?.navn ?? null,
        speiling: !!fam.speiling,
        medlemmer: db.medlemmer(fam.id).map((m) => m.navn),
        trad: db.tradFor(fam.id, medlem?.id ?? null, !!fam.speiling),
        kalender: `${BASE}/kal/${fam.kal_token}.ics`,
        minne: db.minne(fam.id),
        hendelser: db.hendelser(fam.id),
        rutiner: db.rutiner(fam.id),
        foresporsler: db.foresporsler(fam.id),
      });
    }

    // Webhook fra SMS-gatewayen. Felt varierer — vi tar imot de vanligste navnene.
    if (p === "/sms/inn") {
      const b = req.method === "POST" ? await lesJson(req).catch(() => ({})) : {};
      const alle = { ...Object.fromEntries(u.searchParams), ...b };
      const fra = String(alle.from ?? alle.From ?? alle.msisdn ?? alle.sender ?? "").trim();
      const tekst = String(alle.text ?? alle.Body ?? alle.msg ?? alle.message ?? "").trim();
      if (!fra) return json(res, 400, { feil: "avsender mangler" });

      if (/^stopp?$/i.test(tekst)) {
        db.sperr(fra);
        await sms.send(fra, "Du får ingen flere meldinger fra oss. Ha det bra.");
        return json(res, 200, { ok: true, sperret: true });
      }

      const sak = db.apenForesporsel(fra);
      if (!sak) {
        await sms.send(fra, "Takk. Jeg har ingen åpen forespørsel til deg akkurat nå.");
        return json(res, 200, { ok: true, uten_sak: true });
      }
      const valg = JSON.parse(sak.valg);
      const n = Number((tekst.match(/^\s*(\d+)/) ?? [])[1]);
      const valgt = Number.isInteger(n) && n >= 1 && n <= valg.length ? valg[n - 1] : null;
      db.besvar(sak.id, valgt ? `${n} — ${valgt}${tekst.length > String(n).length ? " · " + tekst : ""}` : tekst);

      const fam = db.familie(sak.familie);
      await kjorTur(fam,
        `[systemnotat] ${sak.navn} svarte på SMS: "${tekst}"` +
        (valgt ? ` (altså: ${valgt})` : " (fritekst, ikke et av alternativene)") +
        `. Forespørselen var: "${sak.melding}". Fortell henne kort hva som ble svart, og at hun ikke trenger å følge opp.`,
        []);
      await sms.send(fra, valgt ? "Takk, det er notert." : "Takk. Jeg gir beskjed videre.");
      return json(res, 200, { ok: true, svar: valgt ?? tekst });
    }

    if (req.method === "GET" && p.startsWith("/kal/") && p.endsWith(".ics")) {
      const fam = db.familieVedToken(p.slice(5, -4));
      if (!fam) { res.writeHead(404); return res.end("Ukjent kalender"); }
      res.writeHead(200, { "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "no-cache", "Content-Disposition": 'inline; filename="jajumi.ics"' });
      return res.end(feed(fam, db.hendelser(fam.id)));
    }

    if (p === "/" || p === "/helse") return json(res, 200, { ok: true, tid: new Date().toISOString() });
    json(res, 404, { feil: "ukjent rute" });
  } catch (e) {
    console.error(e);
    json(res, 500, { feil: e.message });
  }
});

// --- rutinene ------------------------------------------------------------
// Ingenting går ut av seg selv. Kun rutiner hun har sagt ja til, på tiden hun ga.
const DAGER = { Mon: "man", Tue: "tir", Wed: "ons", Thu: "tor", Fri: "fre", Sat: "lør", Sun: "søn" };

function oslo() {
  const f = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Oslo", hour: "2-digit", minute: "2-digit", weekday: "short",
    year: "numeric", month: "2-digit", day: "2-digit", hour12: false,
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return {
    minutter: Number(f.hour) * 60 + Number(f.minute),
    dag: DAGER[f.weekday],
    dato: `${f.year}-${f.month}-${f.day}`,
  };
}

async function rutiner() {
  const { minutter, dag, dato } = oslo();
  for (const r of db.aktiveRutiner()) {
    if (r.sist_kjort === dato) continue;
    if (r.dager && !r.dager.split(",").map((d) => d.trim()).includes(dag)) continue;
    const [t, m] = String(r.klokke ?? "07:00").split(":").map(Number);
    const mal = t * 60 + (m || 0);
    if (minutter < mal || minutter > mal + 9) continue;   // ti minutters vindu

    db.merkKjort(r.familie, r.type, dato);                 // merk før kallet, så en feil ikke gir dobbel sending
    const fam = db.familie(r.familie);
    const dager = r.type === "morgen" ? 2 : 8;
    const liste = db.kommende(fam.id, new Date().toISOString(), new Date(Date.now() + dager * 864e5).toISOString())
      .map((h) => `- ${h.tittel} (${h.start})${h.notat ? " — " + h.notat : ""}`).join("\n") || "(ingenting i kalenderen)";
    const be = r.type === "morgen"
      ? `[systemnotat] Rutinen hun har bedt om, kl. ${r.klokke}. Send morgenmeldingen: maks tre ting, bare det som faktisk krever noe av henne i dag. Er det ingenting, si det rett ut. Kommende:\n${liste}`
      : `[systemnotat] Rutinen hun har bedt om, kl. ${r.klokke}. Send ukekartet for uka som kommer, per dag, kort. Kommende:\n${liste}`;
    try { await kjorTur(fam, be, []); }
    catch (e) { console.error(`Rutine ${r.type} feilet for ${fam.navn}:`, e.message); }
  }
}
setInterval(rutiner, 5 * 60 * 1000);

server.listen(PORT, () => {
  console.log(`Jajumi kjører på ${BASE}`);
  console.log(`SMS-leverandør: ${process.env.SMS_LEVERANDOR ?? "logg (skriver til konsollen)"}`);
  if (!process.env.MODELL_URL) console.log("MODELL_URL mangler — /api/melding vil feile. Se .env.example");
});
