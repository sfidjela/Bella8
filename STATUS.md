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

## Hullet mellom dem

**Appen må peke på serveren i stedet for på Claude.** Det er én dags arbeid.
Da får du SMS, kalender og rutiner inn i den samme flaten hun allerede bruker.

Det er den neste tingen å bygge. Ikke før du har sett at hun faktisk bruker appen.

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

**Hun trenger en Claude-konto.** Første melding spør om lov til å bruke den.
Det er prisen for at dette virker i dag uten server.

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
