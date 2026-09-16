# Hva produktet er, og hva det kan være verdt

## Hva produktet er nå

**Et minne for familielogistikk som svarer i én tråd, og som får svar ut av folk som ikke er kunder.**

Tre deler, i stigende rekkefølge etter hvor vanskelige de er å kopiere:

### 1. Det tar imot søppel

Skjermbilder, videresendte mailer, uskarpe bilder av ukeplaner. Dette er ikke en midlertidig løsning
i påvente av integrasjoner — Vigilo, Visma Flyt og Spond ligger bak sikker innlogging, og det finnes
ikke API for tredjeparter. Innslippet **er** inngangen.

*Vanskelighetsgrad: lav. Enhver med modelltilgang kan gjøre dette.*

### 2. Det husker

Allergier, hentetider, skostørrelser, hvem som jobber sent hvilke dager, hvilke uker barna er hvor.
Minnet er grunnen til at melding nummer 100 er bedre enn melding nummer 1. Det bygges gjennom bruk,
ikke gjennom et skjema — systemet spør når det mangler noe, én ting av gangen, og merker sine egne
gjetninger.

*Vanskelighetsgrad: middels. Krever design og disiplin, men ingen infrastruktur.*

### 3. Det lukker sløyfer med folk som ikke er brukere

Den andre forelderen, mormor, barnepasseren. De får en vanlig SMS og svarer med ett tall.
Svaret går tilbake i systemet, og hun slipper å sjekke om han har lest det.

*Vanskelighetsgrad: høy — og dette er det eneste som faktisk er en vollgrav.*

Del 3 krever SMS-gateway med toveis trafikk, identitetshåndtering for personer som ikke har konto,
GDPR art. 14-håndtering av tredjeparter, tolkning av frittekstsvar, og en tilstandsmaskin som holder
styr på hvem som har svart hva på hvilken forespørsel. Det er ukers arbeid og en juridisk vurdering,
ikke en helg. Del 1 og 2 kan en konkurrent bygge på en uke.

**Setningen som beskriver det utad:** *Slipp inn kaoset. Få ut avtaler — og få de andre til å bekrefte
at de har fått det med seg.*

## Hva produktet ikke er

- Ikke en kalender. Den skriver til kalenderen du allerede har.
- Ikke en app med faner. Én tråd, ett minne, fire verktøy, to rutiner.
- Ikke en oppskriftstjeneste. Den svarer på hva det blir til middag, med ett svar.
- Ikke en samarbeidsplattform for eksepar. Ingen av dem logger inn sammen noe sted.

---

# Verdipotensialet i Skandinavia

Alle tall i NOK. Regneenhet: **299 kr/mnd ≈ 3 600 kr per abonnement per år.**
Tilsvarende nivå er ca. 349 SEK og 249 DKK — ikke direkte valutaomregning, men samme opplevde pris.

## Markedets størrelse

### Kjernefamiliemarkedet (alle barnefamilier)

| | Familier med barn under 18 | Kilde |
|---|---|---|
| Norge | 628 500 | SSB, per 1.1.2025 |
| Sverige | ~1 190 000 | Min skalering fra norsk rate mot folketall |
| Danmark | ~670 000 | Samme skalering |
| **Sum** | **~2 490 000** | |

**TAM: ~9 mrd kr/år.** Tallet er sant og ubrukelig. Ingen selger til alle barnefamilier.

### Segmentet med skilte foreldre (der produktet er skarpest)

| | Barn med foreldre som ikke bor sammen | Kilde |
|---|---|---|
| Norge | ~250 000 | 23 % av barn 0–17 bodde med én forelder (SSB 2022), anvendt på 1,09 mill. barn |
| Sverige | ~550 000–630 000 | Avledet: 220 000 barn bor växelvis, og det er 35–40 % av gruppen (SCB) |
| Danmark | ~300 000 | Danmarks Statistik / DR |
| **Sum** | **~1 100 000 barn** | ≈ **610 000 familieenheter** ved 1,8 barn per familie |

**SAM: ~2,2 mrd kr/år.**

### Det tetteste treffet (delt bosted / växelvis / deleordning)

Der begge foreldre har barna omtrent like mye, og koordineringsbehovet er høyest.

| | Barn i delt bosted | Kilde |
|---|---|---|
| Norge | ~60 000 | 25 % av gruppen (SSB 2012 — tallet er gammelt og trolig for lavt i dag) |
| Sverige | 220 000 | SCB, barn 0–19 |
| Danmark | ~123 000 | 41 % av 300 000 (2021, opp fra 15 % i 2009) |
| **Sum** | **~400 000 barn** | ≈ **220 000 familieenheter** |

**Tettest SAM: ~800 mill. kr/år.**

**Merk retningen:** andelen i delt bosted er doblet eller mer i alle tre land på et tiår.
Sverige gikk fra 1–2 % på 80-tallet til 35–40 % i dag. Danmark fra 15 % i 2009 til 41 % i 2021.
Markedet vokser av seg selv, uten at noen gjør noe.

## Hva som realistisk kan hentes

Forbrukerabonnement i en veldefinert nisje: 2–5 % penetrasjon er en reell suksess, ikke et gulv.

| Scenario | Abonnenter | ARR |
|---|---|---|
| 3 % av delt-bosted-segmentet | 6 600 | **24 mill. kr** |
| 3 % av hele skilte-segmentet | 18 300 | **66 mill. kr** |
| 1 % av alle skandinaviske barnefamilier | 24 900 | **90 mill. kr** |
| 5 % av hele skilte-segmentet | 30 500 | **110 mill. kr** |

### En treårsbane som ikke er løgn

| | Marked | Abonnenter | ARR |
|---|---|---|---|
| **År 1** | Norge, skilte foreldre | 1 500–3 000 | 5–11 mill. kr |
| **År 2** | + Sverige | 8 000–15 000 | 29–54 mill. kr |
| **År 3** | + Danmark, bredere segment | 25 000–40 000 | 90–144 mill. kr |

Ved 5× ARR i en SaaS-verdsettelse for forbruker: **450–700 mill. kr i selskapsverdi etter tre år**,
hvis banen holder. Det er et godt selskap. Det er ikke en enhjørning på Skandinavia alene.

## De tre tallene som avgjør om banen holder

### 1. Churn — den viktigste

| Månedlig churn | Levetid | LTV ved 299 kr |
|---|---|---|
| 3 % | 33 mnd | 9 900 kr |
| 5 % | 20 mnd | 6 000 kr |
| 8 % | 12,5 mnd | 3 750 kr |

Forskjellen mellom 3 % og 8 % er hele selskapet. Det er derfor morgenmeldingen og søndagskartet
finnes: de er ikke funksjoner, de er retensjonsmekanikk.

**Det skilte segmentet har en fordel her:** behovet forsvinner ikke når høstferien er over.
Ukeskiftet kommer hver eneste uke i ti år.

### 2. Bruttomargin

Per bruker per måned: modellkost 25–50 kr ved normal bruk, SMS 5–15 kr (30 meldinger à ~0,25 kr).
Det gir **70–85 % bruttomargin**. Modellkosten er den som kan løpe løpsk hos en prateglad bruker —
det trengs en grense, ikke fordi det er dyrt i snitt, men fordi halen er lang.

### 3. CAC

Ved 5 % churn og 80 % margin er bidraget ~4 800 kr. Et tak på 3:1 gir **CAC opp til ~1 600 kr**.
Det er romslig for Meta-annonsering mot et så skarpt definert segment.
På 1 490 kr/mnd var prisen selve innvendingen; på 299 er den ikke det.

## Min vurdering

**Skandinavia er ikke premien. Det er beviset.**

Tre land, tre språk som ligner nok, tre markeder med samme struktur og samme retning på delt bosted.
Klarer du 25 000 abonnenter her, har du vist at mekanikken virker — og da er den samme mekanikken
gyldig i Nederland, Tyskland og Storbritannia, der delt bosted også øker, og der markedene er
5–15 ganger større.

**Den største risikoen er ikke markedet.** Den er at del 1 og 2 er lette å kopiere, og at du bruker
det første året på dem i stedet for på del 3. Sløyfa til folk uten konto er det eneste ingen andre
har bygget, og det eneste som tar tid å ta igjen.

## Tjener naboene penger?

### Vigilo: ja, men knapt

| | |
|---|---|
| Omsetning (2023) | 26,9 mill. kr |
| Driftsresultat | +1,0 mill. kr |
| Egenkapital | 42,1 mill. kr |
| Rekkevidde | 64 kommuner, ~40 % av alle barn i norske barnehager og skoler |
| Kunder | 8 av Norges 10 største kommuner, inkl. Utdanningsetaten i Oslo |
| Eier | Kjøpt av danske EG i juli 2024 |

**Inntekt per barn: rundt 60 kr i året**, betalt av kommunen. De har relasjonen til 40 % av norske
barnefamilier og henter under en hundrelapp i året for den.

### Spond: nei

| | |
|---|---|
| Omsetning 2024 | 117,5 mill. kr (opp fra 64 mill.) |
| Driftsresultat 2024 | −17,6 mill. kr |
| Underskudd 2024 | −11,8 mill. kr |
| Underskudd 2023 | −68,8 mill. kr |
| Underskudd 2022 | −53,4 mill. kr |
| Brukere | 2 mill.+ |
| Modell | Gratis app. Tar kutt av betalinger, pluss annonser og dugnadskampanjer. |
| Eier | Verdane ~35 % |

**Inntekt per bruker: rundt 60 kr i året.** Samme tall som Vigilo, helt annen vei dit.

## Hva dette betyr

**1. Distribusjon er ikke svaret.** Spond har over to millioner brukere og går fortsatt i minus.
Hadde rekkevidde løst dette, hadde Spond vunnet for lenge siden.

**2. Ingen tar betalt av foreldre for avlastning.** Vigilo selger til kommunen. Spond tar
transaksjonskutt. Begge lander på ~60 kr per bruker i året. Du foreslår 3 600 kr.
Det er ikke samme marked — det er en annen inntektsklasse, 60 ganger opp.

**3. Det er utestet, ikke motbevist.** Ingen av dem *kan* teste det.
Spond sitt DNA er gratis-for-klubber; en 299-plan ville brutt modellen og
Verdane-eierskapet presser mot brukervekst, ikke ARPU. Vigilo selger til kommuner, og en kommune
kan ikke fakturere foreldre for en app.

**4. Risikoen er at Spond snur.** De har distribusjonen til norske foreldre og kunne bygget sløyfa.
Tapshistorikken sier at de jakter volum, men det er ingen garanti.

**5. Vigilo-salget avgjør API-spørsmålet.** EG er et dansk konsern som konsoliderer nordisk
offentlig programvare. Data ut av Vigilo er nå en corp-dev-samtale, ikke en teknisk integrasjon —
og de har ingen grunn til å si ja mens de eier relasjonen selv.
**Skjermbilde-innslippet er permanent, ikke en midlertidig løsning.**

**6. Begge er mer sannsynlige som kjøpere enn som konkurrenter.** EG kjøper nordisk programvare.
Verdane kjøper vekstselskaper. Hvis du beviser at foreldre betaler 3 600 kr i året,
er du interessant for begge — nettopp fordi ingen av dem klarer det selv.

## Kilder

- [SSB: Familier og husholdninger (628 500 barnefamilier, 1 092 900 barn)](https://www.ssb.no/befolkning/barn-familier-og-husholdninger/statistikk/familier-og-husholdninger)
- [SSB: Delt bosted for barn etter samlivsbrudd](https://www.ssb.no/befolkning/barn-familier-og-husholdninger/artikler/delt-bosted-for-barn-etter-samlivsbrudd.nye-utviklingstrekk-og-kjennetegn/)
- [SCB: Växelvis boende vanlig lösning för barn med särlevande föräldrar](https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning-och-levnadsforhallanden/levnadsforhallanden/barn-och-familjestatistik/pong/statistiknyhet/barn--och-familjestatistik-barns-boende-och-forsorjning-nar-foraldrarna-inte-bor-ihop/)
- [SCB: Så ser Sveriges barnfamiljer ut](https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning-och-levnadsforhallanden/levnadsforhallanden/barn-och-familjestatistik/pong/statistiknyhet/barn--och-familjestatistik-20242/)
- [DR: Langt flere skilsmissebørn bor lige meget hos begge forældre](https://www.dr.dk/nyheder/indland/langt-flere-skilsmisseboern-bor-lige-meget-hos-begge-foraeldre)
- [Rockwool Fonden om deleordninger](https://via.ritzau.dk/pressemeddelelse/14211230/ingen-forskel-pa-skilsmisseborns-trivsel-uanset-hvilken-deleordning)

- [Shifter: Spond — ny milepæl og sjef, men underskuddet vokser](https://www.shifter.no/nyheter/spond-ny-milepael-og-sjef-men-underskuddet-vokser/338500)
- [Purehelp: Spond AS regnskap](https://www.purehelp.no/m/company/account/spondas/998209218)
- [Proff: Vigilo AS regnskap](https://www.proff.no/regnskap/vigilo-as/karmsund/it-konsulenter-og-r%C3%A5dgivning/IGGMPYR03DC)
- [EG kjøper opp norske Vigilo](https://egsoftware.com/no/ressource/eg-kjoeper-opp-norske-vigilo)
- [Finansavisen: Verdaneselskap fortsetter å blø](https://www.finansavisen.no/teknologi/2025/07/09/8276533/verdaneselskap-fortsetter-a-blo)

**Om tallene:** familietall for Sverige og Danmark er min skalering fra norsk rate mot folketall —
ikke offisiell statistikk. Barnetall og andeler for delt bosted er hentet fra kildene over.
De norske delt-bosted-andelene bygger på SSBs undersøkelse fra 2012 og er sannsynligvis for lave i dag.
