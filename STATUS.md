# Hva som finnes nå

Det er to separate ting, og **de snakker ikke sammen ennå.** Det er derfor det er uklart.

## 1. Appen — virker i dag

`mockup/jajumi-app.html` · [åpne](https://claude.ai/artifact/PyyJ7TpMDcujiMKBoxxosp)

En ekte chat hun kan bruke nå. Sender skjermbilder, får svar, husker mellom øktene.

| Virker | Virker ikke |
|---|---|
| Tråd med bilder og strømmende svar | SMS til andre |
| Minne mellom øktene | Skriving i kalenderen |
| Systemprompten, hele stemmen | Rutiner |
| | Deling mellom to personer |

Den bruker **hennes egen Claude-konto** og lagrer minnet **på hennes telefon**.
Ingen server involvert. Derfor kan den ikke sende SMS — en artefakt har ingen nettverkstilgang ut.

## 2. Serveren — virker, men ingen bruker den ennå

`server/` · `node server.mjs`, ingen pakker å installere

| Virker | Mangler |
|---|---|
| SMS ut med svaralternativer | Et grensesnitt |
| Svar inn, koblet til riktig sak | Gateway-konto |
| Kalenderfeed hun abonnerer på | Modellnøkkel i `.env` |
| Minne, hendelser, rutiner | Et sted å kjøre |
| To foreldre i samme tråd | |

Den er testet og kjører. Men ingenting er koblet til den —
appen over snakker med Claude direkte, ikke med serveren.

## Hullet er lukket

`server/web/index.html` er den samme flaten, men den snakker med serveren i stedet for med Claude.
Serveren serverer den selv på `/`.

**Ingen konto for brukeren.** Hun får en lenke, åpner den, og tokenet legger seg i nettleseren.
Modellen kjører på din nøkkel — Grok, Gemini, hva du vil.

Det som gjenstår før hun kan bruke den er ikke kode. Det er en maskin, et domene og en modellnøkkel.

---

# Onboarde kona — tre steg, ti minutter

Bruk **appen**, ikke serveren. Serveren venter til du vet om dette treffer.

### 1. Del artefakten med henne
Åpne [appen](https://claude.ai/artifact/PyyJ7TpMDcujiMKBoxxosp), trykk del-menyen, del med henne.

### 2. Hun åpner lenken på telefonen
Så: del-knappen i nettleseren → **Legg til på Hjem-skjerm**.
Da ligger den som et ikon. Hun ser aldri en URL igjen.

### 3. Hun sender det første skjermbildet
Første melding ligger der allerede. Trykk **Bilde**, velg et skjermbilde fra barnehagen,
send. Det er hele onboardingen.

**Hun trenger en Claude-konto.** Appen kjører modellen på hennes egen Claude-tilgang, og
første melding spør om lov. Det kan ikke byttes til Gemini eller noe annet — en artefakt har
ingen nettverkstilgang ut, så den kan ikke ringe Google uansett hvilken nøkkel du har.

**Men det gjelder bare denne prototypen.** Så snart appen peker på serveren, er nøkkelen din,
kallet skjer der, og **ingen bruker trenger konto hos noen** — verken Claude, Google eller xAI.

Hvis Claude-kontoen er friksjon nok til at testen ikke skjer, er det bedre å bruke dagen på å
koble appen til serveren først. Da forsvinner kravet for henne og for alle senere testere.

### Ikke si hva hun skal gjøre

Ikke forklar hva den kan. Ikke gi henne en liste. Send lenken og si:
*«Send den det du ikke rakk å lese.»*

Får hun det ikke til uten hjelp, er det funnet. Skriv det ned i stedet for å redde henne.

### Det du ser etter

| | |
|---|---|
| **Dag 1** | Skjønner hun hva hun skal gjøre uten at du sier det? |
| **Dag 2–3** | Er kortene riktige? Noter hvert eneste som bommer. |
| **Uke 2** | **Sender hun noe uoppfordret?** Dette er det eneste som teller. |

Kopier-knappen øverst i appen gir deg hele samtalen som tekst.
Slik ser du hva som bommet uten å låne telefonen hennes.

---

# Begge foreldre i samme tråd

Bygget inn i serveren nå. **Ikke i appen ennå** — den kommer når appen kobles på.

Slik virker det: familien har medlemmer, hvert medlem får sin egen lenke.

```
POST /api/familie  {"navn": "Familien Nyhus"}
POST /api/medlem   {"familie": "<id>", "navn": "Kristin"}   → lenke
POST /api/medlem   {"familie": "<id>", "navn": "Steffen"}   → lenke
```

**Speiling på** (standard): begge ser hele tråden, begge kan skrive og sende bilder.
Hver melding er merket med hvem som skrev den, så det er lesbart for begge.
Ingen trenger å gå via den andre.

**Speiling av:** hver sin tråd, men **samme minne og samme kalender**.
Hun kan spørre om noe uten at han ser det.

```
POST /api/speiling {"token": "<din lenke>", "paa": false}
```

### Den viktige regelen som følger med

Modellen får vite hvem som er i tråden, og at **de er innenfor**.
SMS-sløyfa gjelder bare folk **utenfor** — besteforeldre, barnepasser, barnehagen,
en annen forelder som ikke er med.

Er Steffen i tråden, får han beskjed der. Ikke på SMS.
Det er faktisk den reneste formuleringen av hele produktet:
**sløyfa er for dem som ikke er i rommet.**

### Og et råd du ikke ba om

For dere to er speiling riktig. For skilte foreldre er den nesten alltid feil —
da blir tråden enda et sted å forhandle. Behold den som en innstilling, ikke en antakelse.
