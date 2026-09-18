# Hva som skal til for SMS og kalender

## Først: dette er øyeblikket du trenger en server

Artefakten kan ikke gjøre noen av delene. Den har ingen nettverkstilgang ut —
CSP-en blokkerer alt utenom skrifttyper. Ingen SMS-gateway, ingen kalender-API, uansett hvor
god koden er.

Så svaret på begge spørsmålene er: **en liten backend.** Det er den første ekte
infrastrukturen prosjektet trenger, og den er mindre enn du frykter.

---

## SMS

### Fella du må kjenne til

Du kan sende med **alfanumerisk avsender** — altså at det står «Jajumi» i stedet for et nummer.
Det ser proft ut.

**Men da kan ingen svare.** Det finnes ikke noe nummer å svare til.
Alfanumeriske avsendere er enveis, overalt.

Hele produktet vårt hviler på at Marius svarer «2». Altså:
**du må ha et langt nummer eller et kortnummer.** Ikke et navn.

Det koster deg litt merkevare i innboksen hans, og det er verdt det —
første linje i meldingen sier uansett hvem den er fra.

### Det du trenger

| | |
|---|---|
| **Gateway** | Sveve, Link Mobility, Vianett eller Puzzel i Norge. Twilio eller MessageBird internasjonalt. |
| **Nummer** | Dedikert langt nummer med toveis. Månedsleie. |
| **Webhook** | Et endepunkt som tar imot innkommende SMS |
| **Tilstandsmaskin** | Som kobler «2» til riktig person, riktig forespørsel, riktig familie |
| **Bedriftskonto** | Org.nr. Gatewayene selger ikke til privatpersoner. |
| **Databehandleravtale** | Med gatewayen |
| **STOPP** | Reservasjon må virke, og må nevnes i første melding |

**Kost:** grovt 0,20–0,50 kr per melding pluss månedsleie på nummeret.
Ved 30 meldinger i måneden per familie er det 6–15 kr — godt innenfor.

### Kan vi sende fra hennes egen telefon i stedet?

Spørsmålet kommer alltid, og det er et godt spørsmål. Det ville spart
gatewayen, månedsleia, org.nr.-kravet og hele art. 14-teksten, fordi en melding
fra henne til mannen hennes er en privat melding, ikke en tjeneste som sender.

**Og den har ett ekte fortrinn:** Marius svarer kona si. Han svarer ikke like
lett på et ukjent langt nummer. Svarprosenten er sannsynligvis høyere.

Men det går ikke. Fire grunner, i rekkefølge etter hvor tungt de veier.

**1. iPhone kan det ikke i det hele tatt.**
iOS har ingen måte å lese innkommende SMS på. Ingen. Og ingen måte å sende uten
at hun trykker send selv i Meldinger. Du kan fylle ut en melding på forhånd,
men svaret hans er utilgjengelig for appen for alltid. Halve sløyfa finnes ikke
på iPhone, og iPhone står sterkt blant norske mødre. Det alene avgjør saken.

**2. Android tillater det, men Google Play gjør det ikke.**
Teknisk kan en Android-app både sende og lese SMS. Men Google begrenser de
tillatelsene til en kort liste apptyper — standard meldingsapp, standard
telefonapp, sikkerhetskopiering, noen få til. Familielogistikk står ikke på
lista, og søknaden behandles manuelt. Du kan bygge det og bli avvist i
gjennomgangen. Sideloading er ikke et produkt.

**3. Det river ned løftet hele produktet hviler på.**
Vi skriver «den leser bare det du sender den». Det er sant i dag, og det er
grunnen til at skjermbilde-dropp er ærlig og ikke en nødløsning. Leser vi
SMS-innboksen hennes, leser vi alt: legen, banken, eksmannen, venninnen som
skriver noe hun aldri ville delt. Vi går fra å lese det hun rekker oss, til
å lese alt hun får. Det er ikke en teknisk forskjell, det er en annen avtale
med henne — og den avtalen er det eneste vi har.

**4. Verdien forsvinner uansett.**
Poenget er ikke at meldingen ble sendt. Poenget er at hun slipper å følge med
på om han svarte. Kommer svaret inn i hennes egen SMS-innboks, piper telefonen
hennes, og hun er tilbake til å holde styr på det selv. Vi ville løst
utsendingen og mistet hele grunnen til å betale.

### Den varianten som er verdt å beholde

Ikke automatisk sending, men **ferdig utfylt melding i hennes egen meldingsapp**.
Jajumi skriver teksten, åpner Meldinger med mottaker og innhold på plass, og hun
trykker send. Det virker på både iPhone og Android, krever ingen tillatelser,
koster ingenting, og er juridisk sett hennes egen private melding.

Svaret må hun da sende inn selv — som skjermbilde, akkurat som alt annet.
Sløyfa lukkes ikke av seg selv, men den lukkes.

Det er verdt å bygge som **reserveløsning**, av tre grunner: det virker den dagen
gatewayen er nede, det virker før org.nr. og gateway-avtalen er på plass, og det
er den eneste veien til noen som har svart STOPP. Men det er ikke hovedveien.
Hovedveien er et langt nummer.

### Én ting som faktisk er ulovlig

Å sette opp egne SIM-kort som en sendesentral — altså at du kjøper abonnementer
og sender alle kunders meldinger derfra. Forbrukerabonnementene hos Telenor og
Telia har vilkår mot masseutsending og kommersiell videreformidling. Det er
noe annet enn at hun sender sin egen melding fra sitt eget abonnement.

### Det vanskeligste er ikke teknikken

Det er tilstanden. Når «2» kommer inn fra +47 xxx, må systemet vite:
hvilken forespørsel gjaldt det, er den fortsatt aktuell, har hun allerede løst det selv,
og hva om han svarer to dager for sent? Det er der feilene kommer til å ligge.

---

## Kalender

Tre veier, og den billigste er mye bedre enn den ser ut.

### 1. ICS-abonnement — dette er v1

Du publiserer en kalenderfeed per familie på en hemmelig URL. Hun abonnerer **én gang**,
og alt du legger inn dukker opp automatisk etterpå.

- Ingen OAuth, ingen verifisering, ingen godkjenning
- Virker på iPhone, Android, Outlook og Google — alt sammen
- Kan bygges på en ettermiddag

**Begrensningen:** det er enveis. Du kan skrive inn, men ikke lese hva som allerede står der.
Altså ingen kollisjonsvarsling før du kommer videre.

For alt vi har tegnet — hendelseskortet, «Legg i kalenderen», morgenmeldingen —
er dette nok. Kollisjonsskjermen må vente.

### 2. Google Calendar API — toveis, men med en port

- Kalender-scopes er klassifisert som **sensitive**. Produksjonsbruk krever Googles verifisering.
- Kravene: eid domene, personvernerklæring, riktig samtykkeskjerm, skriftlig begrunnelse,
  og **en videodemo av flyten**.
- **Rundt ti dager** etter komplett innsending, mer med runder fram og tilbake.
- Be om minste mulige scope. Ber du om Gmail-scopes samtidig, havner du i en tyngre
  sikkerhetsvurdering — ikke gjør begge på én gang.

### 3. Apple-kalenderen — og her er den ubehagelige nyheten

**Det finnes ikke noe offentlig sky-API for Apple Calendar.**

De to veiene inn er CalDAV med app-spesifikt passord — som er en umulig brukeropplevelse
for målgruppen din — eller **EventKit i en native app.**

Målgruppen din i Oslo, Asker og Bærum er overveiende iPhone.
**Ekte skriving til hennes egen Apple-kalender krever altså en native app.**

Det endrer web-vurderingen vår: webappen holder til alt annet,
men Apple-kalenderen er den ene funksjonen som til slutt tvinger fram en app i App Store.

---

## Rekkefølgen jeg ville tatt

| Steg | Hva | Tid |
|---|---|---|
| 1 | **Org.nr og bedriftskonto** hos gateway | Løper i bakgrunnen, start nå |
| 2 | **Liten server**: webhook, tilstand, ICS-feed | En helg |
| 3 | **ICS-abonnement** — kalender ferdig for v1 | Med i steg 2 |
| 4 | **Toveis SMS** med langt nummer og tilstandsmaskin | En uke |
| 5 | **Personvernerklæring og databehandleravtaler** | Parallelt, men før første ekte kunde |
| 6 | Google OAuth — bare hvis noen faktisk ber om toveis | Senere |
| 7 | Native app — når Apple-kalenderen blir det som stopper deg | Senere |

**Steg 2 til 4 er hele greia.** En helg pluss en uke, og du har sløyfa som virker av seg selv
og kalenderen som fylles automatisk. Resten av listen er ting du gjør fordi noen ba om det.

## Én ting til

Når SMS først virker, slutter piloten å være manuell. Da kan du kjøre ti familier uten å sitte
og sende meldinger selv — og det er da du finner ut om dette faktisk er et produkt.
