# Plan for betaling

Status i dag: betaling er slått av (`paymentEnabled: false`). Knappen «Betal» lager en demo-ordre og trekker ingen penger.

## Anbefaling: Vipps MobilePay Checkout

For en norsk gavebutikk med kunder på mobil er Vipps det folk forventer. Checkout-produktet tar både Vipps og kort
i samme vindu, så én avtale og én integrasjon holder. Stripe er et godt alternativ hvis du vil selge utenfor Norden
eller ha Apple Pay og Google Pay, men Stripe tilbyr ikke Vipps.

| | Vipps MobilePay Checkout | Stripe Checkout |
|---|---|---|
| Vipps | Ja | Nei |
| Kort | Ja | Ja |
| Apple Pay / Google Pay | Nei | Ja |
| Krever | Norsk org.nr. og bedriftsavtale | Org.nr. eller enkeltpersonforetak |
| Passer når | Kundene er i Norge | Du vil selge internasjonalt |

Priser og vilkår endres. Sjekk gjeldende satser hos leverandøren før du velger.

## Dette trengs fra deg

1. Organisasjonsnummer og bedriftskonto.
2. Avtale med Vipps MobilePay (bestilles i Vipps-portalen, «Betaling på nett»). Godkjenning tar normalt noen dager.
3. Endelig pris på hamster, brodering og frakt.
4. Kjøpsvilkår. Viktig: personaliserte varer (brodering) er unntatt angreretten, men det må stå tydelig før kunden betaler.

## Slik skal flyten være

```
Kunde trykker «Betal»
  → nettsiden sender bestillingen til serveren (Supabase Edge Function «create-order»)
  → serveren regner ut prisen på nytt, lagrer ordren som «venter_betaling» og oppretter betaling hos Vipps
  → kunden sendes til Vipps og godkjenner
  → Vipps kaller serveren («webhook») når pengene er reservert
  → serveren setter ordren til «betalt», sender kvittering og eventuell SMS til mottakeren
  → kunden kommer tilbake til bekreftelsessiden
```

Tre regler som ikke skal brytes:

- **Prisen bestemmes på serveren.** Nettsiden viser prisen, men serveren regner den ut selv (hamster + brodering + frakt).
  Ellers kan hvem som helst endre beløpet i nettleseren.
- **En ordre er betalt først når Vipps sier det.** Aldri fordi kunden kom tilbake til nettsiden.
- **Reserver ved kjøp, trekk ved sending.** Vipps lar deg reservere beløpet og trekke det når hamsteren faktisk sendes.
  Da er refusjon enkelt hvis noe går galt i produksjonen.

## Rekkefølge

| Steg | Hva | Avhenger av |
|---|---|---|
| 1 | Supabase-prosjekt, tabeller fra `docs/supabase-schema.sql`, innlogging for ordreoversikten | Ingenting |
| 2 | `create-order`: validerer, regner pris, lagrer ordre og hilsen | Steg 1 |
| 3 | Vipps testmiljø: opprett betaling, ta imot webhook, sett «betalt» | Vipps-avtale, steg 2 |
| 4 | Kvittering på e-post og SMS til mottaker ved «spør mottakeren» | SMS-leverandør |
| 5 | Prøvekjøp med ekte penger og refusjon, så `paymentEnabled: true` | Steg 3–4 |

Koblingspunktet i koden er `pay()` i `js/app.js` og `createOrder` i `js/store.js`.

## Nøkler som trengs

Ingen av disse finnes i koden, og de skal aldri ligge i nettsiden. De lagres som hemmeligheter på serveren.

- Supabase: prosjekt-URL, offentlig nøkkel (kan ligge i nettsiden), tjenestenøkkel (kun server)
- Vipps: client_id, client_secret, subscription key, merchant serial number, webhook-hemmelighet
- SMS-leverandør: API-nøkkel
