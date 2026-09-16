# Jajumi-serveren

Sløyfa og kalenderen, ferdig kodet. **Null pakker å installere** — alt er innebygd i Node 22.

```bash
cd server
cp .env.example .env     # fyll inn
node server.mjs
```

Den starter uten at noe er utfylt. Da logger SMS til konsollen i stedet for å gå ut,
og modellkall feiler til du har satt `MODELL_URL` og `MODELL_NOKKEL`.

---

## Det du må skaffe selv

Fire ting. Jeg kan ikke gjøre noen av dem for deg.

### 1. Organisasjonsnummer
SMS-gatewayene selger ikke til privatpersoner. Enkeltpersonforetak holder, og registreres
på Brønnøysund på en ettermiddag.

### 2. SMS-gateway med toveis nummer
Sveve, Link Mobility, Vianett eller Puzzel i Norge. Twilio hvis du vil ha det raskt i gang.

**Be om et langt nummer med toveis, ikke en alfanumerisk avsender.** Det står «Jajumi» pent
i innboksen hans, men da kan han ikke svare — og hele sløyfa er at han svarer.

Sett webhooken deres til `https://ditt-domene/sms/inn`.

### 3. Modelltilgang
Én URL, ett modellnavn, én nøkkel. Grok, Gemini og de fleste andre snakker samme format,
så `MODELL_URL` avgjør hvem du bruker. Ferdige linjer for begge ligger i `.env.example`.

**Og det viktige:** nøkkelen er din, og kallet skjer her på serveren.
**Brukerne trenger ingen konto hos noen.** Verken Claude, Google eller xAI.
De åpner en lenke, og det er alt.

### 4. Et sted å kjøre det
En maskin som er på hele tiden og et domene med HTTPS. Gatewayen må nå webhooken din,
og telefonen hennes må nå kalenderfeeden. En liten VPS holder lenge.

Raskeste vei, omtrent en time:

```bash
# på serveren
git clone <repoet> && cd Bella8/server
cp .env.example .env && nano .env      # MODELL_URL, MODELL_NAVN, MODELL_NOKKEL
node server.mjs                        # sjekk at den svarer

# hold den i live
sudo tee /etc/systemd/system/jajumi.service > /dev/null <<'UNIT'
[Unit]
Description=Jajumi
After=network.target
[Service]
WorkingDirectory=/root/Bella8/server
EnvironmentFile=/root/Bella8/server/.env
ExecStart=/usr/bin/node server.mjs
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl enable --now jajumi
```

HTTPS via Caddy er to linjer:

```
jajumi.example.no {
  reverse_proxy localhost:8080
}
```

Caddy henter sertifikatet selv. **HTTPS er ikke valgfritt** — kalenderabonnement over
`webcal://` krever gyldig sertifikat, og gatewayen nekter som regel å poste til http.

Databasen er én fil ved siden av koden. Ta backup av den.

---

## Hvordan det henger sammen

```
Hun (app)  ──POST /api/melding──►  modellen
                                      │
                             handlingsblokk
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
              hendelser            minne            spørsmål
                    │                                   │
            GET /kal/<token>.ics                   SMS ut (langt nummer)
                    │                                   │
            hennes kalender                        han svarer "2"
                                                        │
                                              POST /sms/inn ──► tilbake i tråden
```

Modellen svarer med tekst pluss en skjult blokk merket `jajumi` som sier hva som skal skje.
Serveren skiller de to: teksten går til henne, blokken blir til kalenderoppføringer,
minne og utgående SMS. **Hun ser aldri blokken.**

Det er gjort slik i stedet for leverandørens verktøykall fordi det virker likt hos alle,
er lett å lese i loggen, og er lett å bytte ut senere.

---

## Sette opp en familie

```bash
# 1. Familien
curl -X POST $BASE/api/familie -H 'Content-Type: application/json' \
  -d '{"navn":"Familien Nyhus"}'

# 2. Ett medlem per person. Hver får sin egen lenke.
curl -X POST $BASE/api/medlem -H 'Content-Type: application/json' \
  -d '{"familie":"<id fra steg 1>","navn":"Kristin"}'
```

Send henne `lenke` fra steg 2. Hun åpner den, tokenet legger seg i nettleseren,
og lenken forsvinner ut av adressefeltet. Deretter: del-knappen → **Legg til på Hjem-skjerm**.

**Hun trenger ingen konto.** Ingen innlogging, ingen e-post, ingen passord.
Lenken *er* tilgangen — behandle den som et passord.

## Rutene

| Rute | Hva den gjør |
|---|---|
| `POST /api/familie` | Oppretter familie, returnerer kalenderlenken |
| `POST /api/melding` | Hennes melding inn, svar ut. Bilder som data-URL-er i `bilder`. |
| `GET /api/tilstand` | Alt om én familie — bruk den til å se hva som bommet |
| `POST /sms/inn` | Webhook fra gatewayen |
| `GET /kal/<token>.ics` | Kalenderfeeden hun abonnerer på |

### Rutinene går ikke av seg selv

De er **av** til hun har sagt ja. Botten foreslår dem i vanlig tekst, tidligst når hun har
sendt inn noen ting, aldri i første samtale, og bare én gang. Sier hun nei, spør den ikke igjen.

Først når hun svarer ja, skriver modellen rutine-handlingen med klokkeslettet hun ga.
Vil hun endre noe senere — «ikke i helgene», «heller halv åtte», «slutt med det» —
er det bare å si det.

Planleggeren ser hvert femte minutt etter rutiner som **er slått på**, treffer klokkeslettet
hennes innenfor ti minutter, gjelder i dag, og ikke er kjørt allerede.
Er ingen slått på, skjer ingenting. Det er hele meningen.

---

## Kalenderen

Send henne `kalender`-lenken fra `POST /api/familie`. Hun trykker den én gang på telefonen,
og alt du legger inn senere kommer av seg selv.

Den er **enveis** — du skriver, du leser ikke. Derfor kan den ikke varsle om kollisjoner ennå.
Til gjengjeld: ingen OAuth, ingen godkjenning fra Google, og den virker på iPhone,
Android og Outlook fra første forsøk.

Tokenet i lenken er hele adgangen. Lekker den, lekker kalenderen.

---

## Før første ekte kunde

- [ ] Personvernerklæring på et domene du eier
- [ ] Databehandleravtale med SMS-gatewayen og modelleverandøren
- [ ] Sjekk at STOPP virker — send det til ditt eget nummer og se at det blir sperret
- [ ] Bytt `DB_FIL` til et sted som blir sikkerhetskopiert

Første SMS sier allerede hvem den er fra og hvordan man reserverer seg. Det er GDPR art. 14,
ikke høflighet — mottakeren er ikke kunde og har aldri sagt ja til noe.
