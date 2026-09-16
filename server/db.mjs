// Lagring. SQLite er innebygd i Node 22 — ingen pakker, én fil på disk.
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";

const db = new DatabaseSync(process.env.DB_FIL ?? "./jajumi.db");
db.exec("PRAGMA journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS familier (
  id TEXT PRIMARY KEY, navn TEXT NOT NULL, telefon TEXT,
  kal_token TEXT NOT NULL UNIQUE, opprettet TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS turer (
  id INTEGER PRIMARY KEY AUTOINCREMENT, familie TEXT NOT NULL,
  rolle TEXT NOT NULL, innhold TEXT NOT NULL, tid TEXT NOT NULL
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
CREATE INDEX IF NOT EXISTS i_fore ON foresporsler(telefon, status);
CREATE TABLE IF NOT EXISTS sperre (telefon TEXT PRIMARY KEY, tid TEXT NOT NULL);
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

export function leggTur(familie, rolle, innhold) {
  q("INSERT INTO turer (familie,rolle,innhold,tid) VALUES (?,?,?,?)").run(familie, rolle, innhold, na());
}
export function siste(familie, maksTegn = 40000) {
  const rader = q("SELECT rolle,innhold FROM turer WHERE familie=? ORDER BY id DESC LIMIT 80").all(familie);
  const ut = []; let n = 0;
  for (const r of rader) {                       // nyeste først, så vi kan stoppe når budsjettet er brukt
    n += r.innhold.length;
    if (n > maksTegn && ut.length) break;
    ut.unshift({ role: r.rolle, content: r.innhold });
  }
  return ut;
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

export const sperret = (telefon) => !!q("SELECT 1 FROM sperre WHERE telefon=?").get(telefon);
export const sperr = (telefon) =>
  q("INSERT OR IGNORE INTO sperre (telefon,tid) VALUES (?,?)").run(telefon, na());

export default db;
