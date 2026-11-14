# Heklahamster.no

Nettbutikk for stygge, heklede hamstere med brodert tekst og hemmelig QR-hilsen.
Ren HTML, CSS og JavaScript. Ingen byggesteg, ingen avhengigheter.

**Status: fungerende demo.** Hele bestillingsflyten virker, men ingenting sendes til en server.
Betaling er slått av. Bildene er AI-genererte konseptbilder, og 244 kr er en plassholderpris.

## Kjør lokalt

```
cd heklahamster
python3 -m http.server 4173
```

Åpne http://localhost:4173. Hilsensiden (`hilsen.html`) må åpnes via samme adresse, ikke som fil.

## Innhold

| Fil | Hva |
|---|---|
| `index.html` | Forside og bestilling i tre steg (velg, tilpass, send) |
| `hilsen.html` | Siden mottakeren ser når QR-koden skannes. `noindex`, nøkkelen ligger etter `#` |
| `css/style.css` | All stil. Farger og skrifter ligger som variabler øverst |
| `js/config.js` | Produkter, pris, grenser og flagg. **Start her for å endre tekst, pris eller hamstere** |
| `js/store.js` | Datalaget. Lagrer lokalt i dag, byttes mot Supabase senere |
| `js/app.js` | Forside og bestillingsflyt |
| `js/greeting.js` | Hilsenvisningen (brukes både av `hilsen.html` og «se som mottaker») |
| `products.json` | Produktfeed for søk og AI-assistenter |
| `docs/supabase-schema.sql` | Forslag til tabeller og tilgangsregler |
| `docs/handoff/` | Opprinnelige overleveringsnotater |
| `tests/smoke.js` | Automatisk test av hele flyten på mobil og desktop |
| `tools/build-preview.py` | Pakker alt til én HTML-fil for deling |

## Test

```
npm i -D playwright
python3 -m http.server 4173 &
node tests/smoke.js
```

Testen sjekker blant annet at alle bilder lastes, at brodering stopper på 20 tegn, at ingenting
forsvinner når kunden går tilbake eller laster siden på nytt, og at hilsensiden aldri inneholder
adresse eller e-post.

## Slik er personvernet tenkt

- Hver hilsen får en tilfeldig nøkkel på 128 bit. Lenken er `hilsen.html#<nøkkel>`.
- Hilsen og leveringsadresse lagres hver for seg. Hilsensiden får aldri adressen eller kjøperens e-post.
- Velger avsender å være hemmelig, lagres ikke navnet på hilsenen i det hele tatt.
- Mottakeren kan melde fra om en hilsen. I demoen registreres det bare lokalt.
- En lenke som ikke kan gjettes er likevel en nøkkel: den som har lenken, kommer inn. Vurder PIN for sensitive hilsener.

## Før butikken kan åpne

Dette mangler, i anbefalt rekkefølge:

1. **Godkjente produktbilder og pris.** Bytt bildene i `assets/` og sett `priceNok` og `priceIsPlaceholder` i `js/config.js`.
2. **Supabase.** Opprett prosjekt, kjør `docs/supabase-schema.sql`, og bytt innmaten i `js/store.js`
   (`createOrder`, `getGreeting`, `reportGreeting`) mot kall til serverfunksjoner. Lyd og video lastes opp
   til en privat bøtte med signerte lenker. Broderingsgrensen på 20 tegn må også håndheves på serveren.
3. **Betaling (Vipps eller Stripe).** Krever avtale og nøkler. Flyten skal være: ordrekladd på server → betaling hos
   leverandør → webhook setter ordren til betalt. Sett først da `paymentEnabled: true`. Koblingspunktet er `pay()` i `js/app.js`.
4. **Frakt.** Fraktpris og sporingsnummer (Bring/Posten). Feltet «Frakt i Norge» i oppsummeringen viser «Ikke fastsatt» til dette er på plass.
5. **Administrasjon.** En enkel side over ordre med status (betalt → brodert → sendt), broderingstekst og utskrift av QR-etikett.
   Tabellen `orders` har allerede statusfeltet.
6. **API for AI-assistenter.** `products.json` er første byggekloss. Neste er et endepunkt som tar imot en ordrekladd
   og svarer med en betalingslenke kunden selv må bekrefte.
7. **Juridisk.** Firmaopplysninger, kjøpsvilkår, angrerett for personaliserte varer, og personvernerklæring.

Nøkler som trengs (ingen finnes i koden): Supabase URL og nøkler, Vipps eller Stripe-nøkler, fraktleverandørens API-nøkkel.

## Publisering

Mappen kan legges rett ut på Netlify, Vercel eller GitHub Pages som statisk nettsted. Ikke publiser på
heklahamster.no før punkt 1–3 over er gjort, eller behold demo-merkingen.
