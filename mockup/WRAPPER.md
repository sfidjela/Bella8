# «Bare en wrapper på grok bot»

## Hva Grok Bot faktisk er

Lansert 11. august 2026, tidlig beta. Persistente navngitte agenter du melder til fra Grok Bot-appen,
som får en jobb og verktøy, jobber videre på en skymaskin mens din egen maskin er av,
og har rutiner for arbeid som starter uten at noen spør. Delte gruppechatter, kort og widgets.

**Du har rett: mønsteret er bygget.** Agent, minne, verktøy, rutiner — alt det slipper du å finne opp.

## Men «wrapper» betyr to helt forskjellige ting

| | Wrappe **appen** | Bygge **mønsteret** på xAI-API-et |
|---|---|---|
| Hva du er avhengig av | Et annet selskaps forbrukerbeta | Et modell-API |
| Kontroll på oppetid, vilkår, pris | Nei | Ja |
| Hvor familiens data bor | Hos xAI, i deres produkt | Hos deg |
| Kan du ta 299 kr? | **Knapt** | Ja |

Det siste er det harde: **hvis hun kan skaffe Grok Bot selv, er wrapperen verdt forskjellen mellom
konfigurert og ukonfigurert.** Det er en ekte verdi, men tynn — og den forsvinner den dagen
Grok Bot forbedrer sin egen onboarding. Du bygger da på at noen andre forblir dårlige på noe.

Samme felle som Airbnb og Muse-appen. **Bygg på API-er, ikke på forbrukerprodukter.**

## De tre tingene ingen bot-plattform gir deg

Dette er hele forskjellen mellom et produkt og en preset:

### 1. SMS inn og ut til folk uten konto
Utgående melding, svaralternativer, tolkning av svaret, og en tilstand som vet hvem som har
svart hva på hvilken forespørsel. Grok Bot har gruppechat — men alle må være i Grok Bot.
Marius er ikke det, og kommer aldri til å bli det.

**Dette er differensieringen. Den kan ikke leies.**

### 2. Planlagt push til hennes flate
Grok Bot har rutiner, men de kjører i *deres* app. Morgenmeldingen din skal komme til
hennes telefon, i din flate, klokka 07.

### 3. Betaling, identitet og isolasjon per familie
Abonnement, én bot per familie, og ingen lekkasje mellom dem. Det er SaaS-skallet.

Pluss pakketeringen og onboardingen du selv nevnte — som er der verdien faktisk ligger.

## Det minste som faktisk virker

Mindre enn du tror, og du eier alt:

| Del | Innsats |
|---|---|
| Modellkall med systemprompt og et minne per familie | Noen dager |
| SMS via norsk gateway (Sveve, Link Mobility, Twilio) | Noen dager |
| Planlegger for morgen og søndag | Timer |
| Stripe og en enkel webpåmelding | Noen dager |
| **Tråden hennes** | **Se under** |

**Og her er snarveien:** i piloten er hennes flate også bare SMS.
Ingen app, ingen widget, ingen delingsmeny. Hun sender skjermbilder på MMS eller WhatsApp til ett
nummer, og får svar der.

Da er hele produktet: ett telefonnummer, ett modell-API, ett minne per familie, én planlegger.
Appen, widgeten og delingsmenyen kommer når det er bevist at noen betaler.

## Botten for én brukertype og ett tema

Det er riktig instinkt, og det er billig. Det du faktisk konfigurerer:

- **Systemprompt** med stemmen fra skjermene — norsk, kort, aldri ordet assistent
- **Minnestrukturen**: personer, gjentakende hendelser, institusjoner, frister
  (generisk, per MOTOR.md — ordbok, ikke omskriving)
- **Verktøyene**: les det som slippes inn, skriv kalender, send SMS, sett påminnelse
- **Rutinene**: morgen 07.00, søndag 18.00
- **Regelen** om når den spør, og at den merker sine egne gjetninger

Det er en dags arbeid å skrive, og en måneds arbeid å få riktig. Det er den delen som er
produktet, ikke koden rundt.

## Konklusjon

**Ja til å skjære ned. Nei til wrapper på appen.**

Bygg mønsteret på et modell-API, lag de tre tingene ingen bot-plattform gir deg,
og gjør piloten på SMS begge veier. Da har du noe du eier, som kan ta 299 kroner,
og som ikke ryker den dagen xAI endrer vilkårene sine.
