# Jajumi — overlevering

Dette dokumentet er skrevet for å limes inn i en ny samtale med en annen
modell. Det er selvstendig: du trenger ikke noen av filene i repoet for å
forstå hva produktet er, hva som er bestemt, og hva som gjenstår.

Alt som står under **Låste regler** er avgjort av eieren. Ikke foreslå at de
endres uten at han tar det opp selv.

---

## 1. Produktet i én setning

Jajumi tar imot rot fra en travel forelder — skjermbilder, lapper, halve
setninger — gjør det om til konkrete avtaler, og sørger for at de andre
voksne rundt barna faktisk har fått beskjeden med seg.

## 2. Målgruppen

**Mor i tidsklemma.** Ikke «familier». Ikke «travle foreldre». Mor.

Hun er 30–45, har ett til tre barn i barnehage- og barneskolealder, jobber
full stilling, og er den i husstanden som holder oversikten uten at noen har
bedt henne om det. Hun er ikke teknisk interessert. Hun laster ikke ned apper
for gøy. Hun har allerede fem apper fra barnehage, skole, idrettslag og
klassechat, og problemet er ikke at hun mangler informasjon — det er at hun er
den eneste som samler den.

Alt annet er bonus og add-ons: skilte foreldre, pårørende til eldre, fedre som
står utenfor informasjonsflyten. Disse kan bli egne merkevarer på samme motor
senere, men de skal ikke forme første versjon.

## 3. Sløyfa — dette er hele forretningsideen

Tre ledd. Verdien ligger i det tredje.

1. **Inn:** hun slipper inn et skjermbilde og skriver «kan du ta denne?»
2. **Ut:** hun får en konkret avtale tilbake — dato, oppmøte, hva som må med,
   frist — og kan legge den i kalenderen sin.
3. **Sløyfa:** den sender en SMS til den det angår (far, mormor, barnevakt,
   trener) med fire svaralternativer, og hun får **bekreftelse** tilbake på
   at han har fått det med seg.

Ledd 1 og 2 kan hvilken som helst generell modell gjøre. Ledd 3 er det ingen
gjør, og det er der abonnementet forsvares. Formuleringen som holder:

> *Hun slipper å minne ham på det.*

## 4. Låste regler

Disse er bestemt. De er ikke til diskusjon med mindre eieren tar dem opp.

1. **Målgruppen er mor i tidsklemma.** Alt annet er bonus.
2. **Rutiner går aldri av seg selv.** De kan foreslås i vanlig tekst, og
   justeres ved at hun svarer. Ingenting skrus på uten at hun har sagt ja.
   Å skru av skal ta fire ord.
3. **Lite skal skje på SMS.** SMS brukes bare til det som angår tredjepersoner.
   Hennes egen flate er den rike tråden, aldri SMS.
4. **Ingen produktforslag eller kjøp ennå.** Det er en naturlig utvidelse, men
   ikke i første versjon, fordi tillit kommer først. Når det slås på: bare når
   hun spør eller noe faktisk mangler, alltid merket ved affiliate, aldri i
   morgenmeldingen, aldri mer enn ett forslag.
5. **Pris mellom 99 og 399 kr/mnd.** 1490 er uaktuelt. Landingssiden står nå
   på 299.
6. **Ingen menneskelig onboarding.** Hun skal komme i gang alene. En
   støttetelefon kan finnes, men bare som siste utvei etter produktet selv.
7. **Sannhetsregelen.** Ingen kundesitater, ingen brukertall, ingen «X familier
   bruker det» før det faktisk er sant. Gjelder landingsside, annonser, alt.
8. **Forbudte ord, overalt:** AI, assistent, bot, automatisering,
   effektivisere, optimalisere, revolusjonere, gamechanger.
   Produktet omtaler seg selv som: «Jeg holder oversikten for deg.»
9. **Smalt, med vilje.** Den booker ikke reiser, betaler ikke regninger,
   skriver ikke e-poster på hennes vegne, gir ikke medisinske, juridiske eller
   økonomiske råd. Sier nei i én setning, uten å beklage.

## 5. Stemmen

Norsk. Korte setninger. Ett poeng per avsnitt. Aldri emoji, aldri utropstegn,
aldri «gjerne!» eller «så flott!». Klokkeslett med punktum (08.15), datoer
skrevet ut (torsdag 24. september).

Den er rolig, ikke blid. Den trøster ikke. Skriver hun «jeg orker ikke mer»,
er riktig svar å gjøre morgendagen mindre — ikke å spørre hvordan hun har det.
Hun vil ha færre ting å holde, ikke omsorg fra en skjerm.

Er den usikker, sier den det høyt: *«Jeg er ikke sikker på om det står «to
foreldre» eller «to timer» — sjekk den. Resten står trygt.»* Dette er den
viktigste enkeltoppførselen i hele produktet. Et produkt som gjetter på en
uklar lapp og tar feil én gang, får aldri se en lapp igjen.

## 6. Hva som faktisk er bygget

### Appen — virker i dag
En ekte chat. Tar imot skjermbilder, svarer strømmende, husker mellom øktene.
Kjører som en publisert artefakt på **brukerens egen Claude-konto**, med minnet
lagret lokalt på hennes telefon. Ingen server. Derfor kan den **ikke** sende
SMS eller skrive i kalender — en artefakt har ingen nettverkstilgang ut.

Dette er det som skal testes på ekte folk først.

### Serveren — ferdig, men ingen bruker den
Node 22, null pakker. Kjører med `node server.mjs`.

Har: SMS ut med svaralternativer, svar inn koblet til riktig sak, kalenderfeed
hun kan abonnere på (ICS/webcal, ingen OAuth), minne, hendelser, rutiner, og
speiling slik at to foreldre kan være i samme tråd.

Mangler: en maskin å kjøre på, et domene med HTTPS, en modellnøkkel, og en
SMS-gateway-konto. Ingenting av dette er kode.

Modellen er leverandøruavhengig — hvilken som helst OpenAI-kompatibel modell
kan stå under. Det er et bevisst valg: produktet er innpakningen, ikke motoren.

### Landingssiden
Bygget for å **vise**, ikke fortelle. En telefon øverst som spiller av hele
saken automatisk, seks situasjoner å velge mellom, og en sandkasse med fem
ferdige spørsmål og tre skjermbilder man kan slippe inn. Hvert svar er merket
«Eksempel». To tomme bildefelt venter på fotografier.

### Mockups
32 skjermbilder fordelt på seks sider: kjerneflyt, flere flyter,
bekreftelsessløyfa, uten onboarding, delt hverdag, hennes flate.

### Dokumentene i repoet
Research på smertepunkter, markedsvurdering, konkurrentanalyse mot Muse,
plattformvalg, navnealternativer, systemprompt, tone, tekst til landingsside,
30 brukstilfeller skrevet som faktiske vekslinger med «tester / feiler hvis»
under hver, og bildepromter.

**Eksempelfamilien er den samme overalt:** Kristin er moren, Marius er faren og
jobber sent torsdager, Emma er 4 og går i barnehagen, Jakob er 7 og går i
2. klasse. Bruk disse navnene i alt nytt materiale.

## 7. Forretning

**Marginen.** Med ruting til billigere modeller og caching ligger
modellkostnaden på 10–20 kr per bruker per måned. Ved 299 kr gir det rundt
90 % bruttomargin.

**Betalingsmodell.** Fast pris, ikke måling. Begrunnelsen: produktet selger at
hun slipper å holde noe. En teller gir henne noe nytt å holde. Anbefalt løsning
er et mykt tak, eller trinn etter familiestørrelse — ikke tokenbasert fakturering
mot brukeren.

**Konkurransen.** Muse fra Meta er den reelle. Fire ting skiller: smalheten,
sløyfa mot tredjeperson, norsk hverdagskontekst, og tillit. De tre første kan
bygges på hvilken som helst modell. Den fjerde kan ikke leies. Det gir en
spenning hvis Metas API brukes under panseret, og den bør løses bevisst.

Spond og Vigilo er ikke konkurrenter. De er infrastrukturen rundt henne — de
produserer beskjedene hun drukner i.

**Kanaljus.** SMS til tredjepart er lovlig så lenge første melding sier hvem
som sender, på oppdrag fra hvem, og hvordan man reserverer seg (GDPR art. 14 +
STOPP-linje). WhatsApp og Messenger tillater ikke kald utsending i det hele
tatt. «Sendt via Jajumi» er greit; «Prøv Jajumi gratis» gjør meldingen til
markedsføring og ødelegger det rettslige grunnlaget.

## 8. Åpne beslutninger

Eieren har ikke landet disse. Ikke lat som de er avgjort.

| Spørsmål | Alternativer | Anbefaling |
|---|---|---|
| Navnet | Jajumi, Kartet, Oversikten | Jajumi, fordi det ikke betyr noe og derfor kan bety dette |
| Eksakt pris | 99–399 | 299, som står på siden nå |
| Skal den skrive i kalenderen, eller bare foreslå? | | Foreslå og legge inn etter bekreftelse — aldri skrive stille |
| Myk grense eller trinn? | | Trinn etter familiestørrelse |

## 9. Neste steg, i rekkefølge

1. **Test appen på ekte folk.** Den virker nå. Dette er det eneste steget som
   gir informasjon ingen kan gjette seg til.
2. **Start papirarbeidet.** Org.nr. og SMS-gateway-avtale er det eneste med
   ledetid. Alt annet kan gjøres på en kveld; dette kan ikke.
3. **Sett opp serveren.** Maskin, domene, HTTPS, modellnøkkel.
4. **Skaff bildene.** Åtte promter er skrevet. To felt på landingssiden er tomme.
5. **Annonser.** Ikke før 1 har gitt svar.

## 10. Prøvd og forkastet — ikke foreslå disse på nytt

- **1490 kr/mnd.** Avvist. Prisen skal ligge mellom 99 og 399.
- **Menneskelig onboarding.** Avvist. Hun skal komme i gang alene.
- **Rutiner som starter av seg selv.** Avvist. Bryter med «den foreslår, hun
  godkjenner».
- **Mye toveis SMS.** Avvist. SMS er bare utgående, og bare til tredjepersoner.
- **Tokenbasert fakturering mot brukeren.** Frarådet, se punkt 7.
- **Database-funksjonen i artefakten.** Gjør artefakten intern for
  organisasjonen, og da kan den ikke deles med en ektefelle utenfor.
- **La artefakten ringe SMS- eller kalender-API-er.** Umulig. Artefakter har
  ingen nettverkstilgang ut.
- **Kutte middag fra produktet.** Feil. Research setter matlaging som tredje
  største stressfaktor, og det er den eneste saken som kommer hver dag.
  Uten en daglig grunn dør abonnementet i måned tre.
- **Behandle skjermbilde-dropp som en nødløsning.** Det er designet, ikke en
  reserveløsning. Det er også grunnen til at personvernløftet er sant: den
  leser bare det hun sender den.

## 11. Slik vil eieren jobbe

Steffen Fidjeland, norsk, bygger dette selv.

Han vil ha **direkte sparring, ikke oppmuntring.** Kritiser ideen, navngi
risikoen, still skarpe spørsmål, si når han tar feil — og si når du selv tok
feil, kort og uten omsvøp. Ikke oppsummer det han nettopp sa. Ikke ramse opp
alternativer du likevel ikke anbefaler. Gi en anbefaling.

Svar på norsk.

Han merker forskjell på et svar som er tenkt og et som er pent. Det siste
irriterer ham.
