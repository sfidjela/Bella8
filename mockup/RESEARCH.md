# Hva forskningen faktisk sier

Alt her er hentet fra publiserte kilder, ikke fra magefølelse. Lenker nederst.

## Stressrangeringen — den viktigste enkeltfunnet

«Barnefamilienes hverdagsliv i Norge 2021» (OsloMet/AFI for Barne- og familiedepartementet,
survey N=1035 + kvalitative intervjuer) rangerer hvor i døgnet stresset sitter:

1. Jobb
2. **Morgenrutinen**
3. **Matlaging**
4. **Leggetiden**

Stresset øker med flere barn, yngre barn og lang pendlervei. Mødre rapporterer mer stress enn fedre.

**Konsekvens for produktet:** morgenmeldingen treffer nr. 2. Middagen er nr. 3 — den ba jeg deg kutte,
og det var feil. Leggetiden er nr. 4 og er ikke dekket av noe produkt i markedet.

## Det tredje skiftet

«The Division of Domestic Labor and the Invisible Work of the Third Shift Among Parents in Norway»
(NIFU/OsloMet, 2025, survey N=602 + to runder intervjuer med 35 familier).

Første skift er lønnsarbeid, andre skift er husarbeid — der har norske mødre og fedre nærmet seg
hverandre. Tredje skift er den usynlige administrasjonen, og den er fortsatt skjevt fordelt
**selv i par som deler likt på de synlige oppgavene**.

Allison Daminger deler det kognitive arbeidet i fire: forutse behov, finne alternativer, bestemme,
og følge med på at det faktisk skjer. Kvinner oppgir at de står for ca. 73 % av planleggingen mot
ca. 64 % av utførelsen. Gapet mellom de to tallene er produktet.

**Konsekvens:** den fjerde delen — å følge med — er den tyngste og den mest usynlige, fordi den
først merkes når den svikter. Et produkt som bare fanger hendelser tar «bestemme». Verdien som varer
ligger i å holde øye med frister som er måneder unna.

## Navngitte oppgaver i forskningen

Bursdager og gaver. Spond-varsler. Turdager. Foreldremøter. Klær som passer. Legetimer.
Barnehagestart. Sommerferie. Dette er ikke eksempler jeg fant på — det er oppgavene forskningen selv
trekker fram.

## Avlastning finnes nesten ikke

Over halvparten av norske barnefamilier får ingen hjelp i hverdagen. 37 % får hjelp av besteforeldre,
13 % av annen familie, 5 % av venner eller naboer — og **7 % kjøper tjenester**.

**Konsekvens:** prisen på 1 490 kr/mnd konkurrerer mot en handling 93 % av familiene ikke gjør.
Det er CAC-problemet i ett tall. Samtidig: besteforeldre er den klart største avlastningskanalen,
og ingen produkter gjør noe for å koble dem inn. Det er derfor mormor-sløyfa finnes.

## Middagen

Nær halvparten av nordmenn synes det er vanskelig å finne ut hva de skal ha til middag (MENY/NTB).
Kombinert med at matlaging er nr. 3 på stresslista: problemet er å **bestemme**, ikke å finne oppskrifter.
Derfor gir middagsskjermen ett svar og én reserveløsning, ikke en meny.

## Fristene

SFO-påmelding for sommeren har frist 1. april. Planleggingsdager og stengte uker (typisk uke 28 og 29)
varsles måneder i forveien. Vigilo, som erstatter Transponder, IST og deler av Visma Flyt, ligger bak
sikker innlogging — det finnes ikke noe API for tredjeparter.

**Konsekvens:** skjermbilde-innslipp er ikke en midlertidig løsning i påvente av integrasjoner.
Det er den eneste veien inn.

## Kanaler — hva som er lov

| Kanal | Går det? | Hvorfor |
|---|---|---|
| **SMS** | Ja | En tjenestemelding mottakeren er bedt om er ikke markedsføring, så mfl. § 15 sperrer ikke. Krever GDPR-grunnlag og at første melding sier hvem som sender, på oppdrag fra hvem, og hvordan man sier nei (art. 14). |
| **E-post** | Ja | Samme resonnement. Billigere, men tregere og lettere å overse. |
| **WhatsApp** | Nei, ikke kaldt | Meta krever eksplisitt opt-in fra **mottakeren**, med avsendernavn, meldingstype og reservasjonsrett. At hun oppgir nummeret hans teller ikke. Han må selv sende første melding, eller gi opt-in i en kanal du eier. |
| **Messenger / Instagram** | Nei | Alle samtaler må initieres av personen som mottar. Kald utsending finnes ikke som mulighet. |

Fra 1. oktober 2026 er WhatsApp utility-maler også betalbare innenfor 24-timersvinduet.

**Konklusjon:** bygg på SMS, med e-post som reserve. WhatsApp kan bli en oppgradering *etter* at
mottakeren har svart første gang på SMS — da kan du be om opt-in i den samme tråden.

## Kilder

- [OsloMet: Barnefamilienes hverdag — mødrene gjør mest og er mest stresset](https://www.oslomet.no/forskning/forskningsnyheter/barnefamilienes-hverdag)
- [The Division of Domestic Labor and the Invisible Work of the Third Shift Among Parents in Norway (NIFU)](https://www.nifu.no/en/publikasjoner/the-division-of-domestic-labor-and-the-invisible-work-of-the-third-shift-among-parents-in-norway-a-mixed-methods-study/)
- [Det tredje skiftet — hva er det?](https://www.dettredjeskiftet.no/artikler/hva-er-det-tredje-skiftet)
- [OsloMet: Mors usynlige ekstravakt](https://www.oslomet.no/forskning/forskningsnyheter/mors-usynlige-ekstravakt)
- [videnskab.dk om mental load og Daminger](https://videnskab.dk/kultur-samfund/mental-load-moedre-taenker-mere-over-husholdningsopgaver-i-al-fald-hvis-du-spoerger-dem-selv/)
- [MENY/NTB: 1 av 2 strever med å finne ut hva de skal ha til middag](https://kommunikasjon.ntb.no/pressemelding/1-av-2-strever-med-a-finne-ut-av-hva-de-skal-ha-til-middag?publisherId=15783210&releaseId=16221404)
- [SSB: Kvinners og menns tidsbruk i ulike livsfaser og familietyper](https://www.ssb.no/kultur-og-fritid/artikler-og-publikasjoner/kvinners-og-menns-tidsbruk-i-ulike-livsfaser-og-familietyper)
- [Forbrukertilsynets veiledning om markedsføring via e-post, SMS o.l.](https://www.forbrukertilsynet.no/lov-og-rett/veiledninger-og-retningslinjer/forbrukertilsynets-veiledning-markedsforing-via-e-post-sms-o-l)
- [Markedsføringsloven § 15 (Lovdata)](https://lovdata.no/lov/2009-01-09-2)
- [Datatilsynet: Nyhetsbrev, e-postlister og SMS](https://www.datatilsynet.no/personvern-pa-ulike-omrader/kundehandtering-handel-og-medlemskap/nyhetsbrev-epostlister-og-sms/)
- [Infobip: WhatsApp opt-in og samtykke](https://www.infobip.com/docs/whatsapp/compliance/user-opt-ins)
- [Meta: Messenger Platform policy](https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy)
- [Bergen kommune om Vigilo](https://www.bergen.kommune.no/innbyggerhjelpen/barnehage-og-skole/grunnskole/personvern-og-digitalisering/vigilo-for-kommunikasjon-mellom-hjem-barnehage-sfo-og-skole)
