// Lagring. SQLite er innebygd i Node 22 — ingen pakker, én fil på disk.
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";

const db = new DatabaseSync(process.env.DB_FIL ?? "./jajumi.db");
db.exec("PRAGMA journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS familier (
  id TEXT PRIMARY KEY, navn TEXT NOT NULL, telefon TEXT,
  kal_token TEXT NOT NULL UNIQUE, opprettet TEXT NOT NULL,
  speiling INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS medlemmer (
  id TEXT PRIMARY KEY, familie TEXT NOT NULL, navn TEXT NOT NULL,
  telefon TEXT, token TEXT NOT NULL UNIQUE, opprettet TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS turer (
  id INTEGER PRIMARY KEY AUTOINCREMENT, familie TEXT NOT NULL,
  rolle TEXT NOT NULL, innhold TEXT NOT NULL, tid TEXT NOT NULL,
  medlem TEXT, skrevet_av TEXT
);
CREATE TABLE IF NOT EXISTS minne (
  id INTEGER PRIMARY KEY AUTOINCREMENT, familie TEXT NOT NULL,
  faktum TEXT NOT NULL, kilde TEXT, gjetning INTEGER NOT NULL DEFAULT 0, tid TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hendelser (
  id TEXT PRIMARY KEY, familie TEXT NOT NULL, tittel TEXT NOT NULL,
  start TEXT NOT NULL, slutt TEXT, sted TEXT, notat TEXT, tid TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS foresporsler (
  id TEXT PRIMARY KEY, familie TEXT NOT NULL, navn TEXT NOT NULL, telefon TEXT NOT NULL,
  melding TEXT NOT NULL, valg TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'venter',
  svar TEXT, hendelse TEXT, sendt TEXT NOT NULL, besvart TEXT
);
CREATE INDEX IF NOT EXISTS i_turer ON turer(familie, id);
CREATE INDEX IF NOT EXISTS i_medl ON medlemmer(familie);
CREATE INDEX IF NOT EXISTS i_fore ON foresporsler(telefon, status);
CREATE TABLE IF NOT EXISTS sperre (telefon TEXT PRIMARY KEY, tid TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS rutiner (
  familie TEXT NOT NULL, type TEXT NOT NULL,
  aktiv INTEGER NOT NULL DEFAULT 0, klokke TEXT, dager TEXT,
  foreslatt TEXT, endret TEXT, sist_kjort TEXT,
  PRIMARY KEY (familie, type)
);
`);

const na = () => new Date().toISOString();
export const q = (sql) => db.prepare(sql);

export function nyFamilie(navn, telefon) {
  const id = randomUUID(), token = randomUUID().replace(/-/g, "");
  q("INSERT INTO familier (id,navn,telefon,kal_token,opprettet) VALUES (?,?,?,?,?)")
    .run(id, navn, telefon ?? null, token, na());
  return { id, navn, telefon, kal_token: token };
}
export const familie = (id) => q("SELECT * FROM familier WHERE id=?").get(id);
export const familieVedToken = (t) => q("SELECT * FROM familier WHERE kal_token=?").get(t);
export const alleFamilier = () => q("SELECT * FROM familier").all();

export function nyttMedlem(familie, navn, telefon) {
  const id = randomUUID(), token = randomUUID().replace(/-/g, "");
  q("INSERT INTO medlemmer (id,familie,navn,telefon,token,opprettet) VALUES (?,?,?,?,?,?)")
    .run(id, familie, navn, telefon ?? null, token, na());
  return { id, familie, navn, telefon, token };
}
export const medlemVedToken = (t) => q("SELECT * FROM medlemmer WHERE token=?").get(t);
export const medlemmer = (familie) =>
  q("SELECT id,navn,telefon FROM medlemmer WHERE familie=? ORDER BY opprettet").all(familie);
export const settSpeiling = (familie, paa) =>
  q("UPDATE familier SET speiling=? WHERE id=?").run(paa ? 1 : 0, familie);

export function leggTur(familie, rolle, innhold, medlem = null, skrevetAv = null) {
  q("INSERT INTO turer (familie,rolle,innhold,tid,medlem,skrevet_av) VALUES (?,?,?,?,?,?)")
    .run(familie, rolle, innhold, na(), medlem, skrevetAv);
}
// Speiling på: begge ser alt, og hver tur er merket med hvem som skrev den.
// Speiling av: hver sin tråd, men samme minne og samme kalender.
export function siste(familie, { medlem = null, speiling = true, maksTegn = 40000 } = {}) {
  const rader = speiling
    ? q("SELECT rolle,innhold,skrevet_av FROM turer WHERE familie=? ORDER BY id DESC LIMIT 80").all(familie)
    : q("SELECT rolle,innhold,skrevet_av FROM turer WHERE familie=? AND (medlem=? OR medlem IS NULL) ORDER BY id DESC LIMIT 80")
        .all(familie, medlem);
  const ut = []; let n = 0;
  for (const r of rader) {                       // nyeste først, så vi kan stoppe når budsjettet er brukt
    n += r.innhold.length;
    if (n > maksTegn && ut.length) break;
    const merket = r.rolle === "user" && r.skrevet_av ? `${r.skrevet_av}: ${r.innhold}` : r.innhold;
    ut.unshift({ role: r.rolle, content: merket });
  }
  return ut;
}
// Det hun og han ser i appen — med avsender, så tråden er lesbar for begge.
export function tradFor(familie, medlem, speiling) {
  const rader = speiling
    ? q("SELECT rolle,innhold,tid,skrevet_av FROM turer WHERE familie=? ORDER BY id LIMIT 300").all(familie)
    : q("SELECT rolle,innhold,tid,skrevet_av FROM turer WHERE familie=? AND (medlem=? OR medlem IS NULL) ORDER BY id LIMIT 300")
        .all(familie, medlem);
  return rader.filter((r) => !r.innhold.startsWith("[systemnotat]"));
}

export function leggMinne(familie, faktum, kilde, gjetning = false) {
  const finnes = q("SELECT id FROM minne WHERE familie=? AND faktum=?").get(familie, faktum);
  if (finnes) return;
  q("INSERT INTO minne (familie,faktum,kilde,gjetning,tid) VALUES (?,?,?,?,?)")
    .run(familie, faktum, kilde ?? null, gjetning ? 1 : 0, na());
}
export const minne = (familie) =>
  q("SELECT faktum,kilde,gjetning FROM minne WHERE familie=? ORDER BY id").all(familie);

export function leggHendelse(familie, h) {
  const id = randomUUID();
  q("INSERT INTO hendelser (id,familie,tittel,start,slutt,sted,notat,tid) VALUES (?,?,?,?,?,?,?,?)")
    .run(id, familie, h.tittel, h.start, h.slutt ?? null, h.sted ?? null, h.notat ?? null, na());
  return id;
}
export const hendelser = (familie) =>
  q("SELECT * FROM hendelser WHERE familie=? ORDER BY start").all(familie);
export const kommende = (familie, fra, til) =>
  q("SELECT * FROM hendelser WHERE familie=? AND start>=? AND start<? ORDER BY start").all(familie, fra, til);

export function nyForesporsel(familie, navn, telefon, melding, valg) {
  const id = randomUUID();
  q("INSERT INTO foresporsler (id,familie,navn,telefon,melding,valg,sendt) VALUES (?,?,?,?,?,?,?)")
    .run(id, familie, navn, telefon, melding, JSON.stringify(valg), na());
  return id;
}
// Nyeste ubesvarte forespørsel til dette nummeret. Svarer han sent, treffer svaret riktig sak.
export const apenForesporsel = (telefon) =>
  q("SELECT * FROM foresporsler WHERE telefon=? AND status='venter' ORDER BY sendt DESC LIMIT 1").get(telefon);
export function besvar(id, svar) {
  q("UPDATE foresporsler SET status='besvart', svar=?, besvart=? WHERE id=?").run(svar, na(), id);
}
export const foresporsler = (familie) =>
  q("SELECT * FROM foresporsler WHERE familie=? ORDER BY sendt DESC LIMIT 20").all(familie);

// Rutiner er av til hun sier ja. Ingenting går ut av seg selv.
export const rutiner = (familie) =>
  q("SELECT * FROM rutiner WHERE familie=?").all(familie);

export function settRutine(familie, type, { aktiv, klokke, dager }) {
  const f = q("SELECT * FROM rutiner WHERE familie=? AND type=?").get(familie, type);
  if (!f) {
    q("INSERT INTO rutiner (familie,type,aktiv,klokke,dager,endret) VALUES (?,?,?,?,?,?)")
      .run(familie, type, aktiv ? 1 : 0, klokke ?? null, dager ?? null, na());
  } else {
    q("UPDATE rutiner SET aktiv=?, klokke=?, dager=?, endret=? WHERE familie=? AND type=?")
      .run(aktiv ? 1 : 0, klokke ?? f.klokke, dager ?? f.dager, na(), familie, type);
  }
}
export function merkForeslatt(familie, type) {
  q("INSERT INTO rutiner (familie,type,foreslatt) VALUES (?,?,?) ON CONFLICT(familie,type) DO UPDATE SET foreslatt=excluded.foreslatt")
    .run(familie, type, na());
}
export const aktiveRutiner = () =>
  q("SELECT r.*, f.navn FROM rutiner r JOIN familier f ON f.id=r.familie WHERE r.aktiv=1").all();
export function merkKjort(familie, type, dato) {
  q("UPDATE rutiner SET sist_kjort=? WHERE familie=? AND type=?").run(dato, familie, type);
}

export const sperret = (telefon) => !!q("SELECT 1 FROM sperre WHERE telefon=?").get(telefon);
export const sperr = (telefon) =>
  q("INSERT OR IGNORE INTO sperre (telefon,tid) VALUES (?,?)").run(telefon, na());

export default db;
