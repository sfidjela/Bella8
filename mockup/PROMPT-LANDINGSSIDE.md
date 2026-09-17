# Prompt: gjør landingssiden intuitiv

Lim inn som én melding. Den er skrevet for å stå alene.

---

```
Du skal bygge om landingssiden til Jajumi slik at en fremmed skjønner
hva produktet er innen tre sekunder, uten å lese en eneste setning.

## Hva produktet er

Jajumi holder orden på familielogistikken for en mor i småbarnsfasen.
Hun slipper inn rot — skjermbilder fra barnehagen, en mail hun ikke rakk å
lese, en invitasjon på SMS — og får tilbake en ferdig avtale med dato,
oppmøte, hva som må pakkes og når fristen går ut.

Det som skiller det fra alt annet: **den får de andre til å bekrefte.**
Hun sier «si fra til Marius», han får en vanlig SMS, svarer med ett tall,
og hun får beskjed når han har svart. Han trenger ingen app og ingen konto.

Pris: 299 kr/mnd. Målgruppe: mødre 30–45 i norske byer.

## Problemet med siden i dag

Den forteller. Den viser ikke.

Åpner du den uten å vite hva Jajumi er, vet du ikke om det er en kalender,
en huskeliste, en barnevakttjeneste eller en chatbot. Overskriften «Noen andre
husker det nå» er god copy, men den forklarer ingenting til en som aldri har
hørt om produktet.

Førsteinntrykket må være **produktet i bevegelse**, ikke en påstand om det.

## Bygg dette

### 1. Hero: telefonen som gjør noe, med en gang

Erstatt dagens tekst-hero med en telefon som spiller av ÉN ting automatisk:
et skjermbilde slippes inn, og det kommer tilbake som en avtale. Åtte sekunder.
Uten lyd, uten at hun trykker på noe.

Overskriften blir mindre og står UNDER eller ved siden av, ikke over.
Den skal bekrefte det øyet allerede har sett, ikke introdusere det.

### 2. Situasjonsvelger — ikke åtte separate animasjoner

Under heroen: en rad med knapper der hun velger sin egen situasjon.
Samme telefon, nytt innhold. Hun trykker, telefonen spiller av den saken.

Seks situasjoner, valgt fordi de er de vanligste og fordi de viser ulike evner:

1. **Bursdagsinvitasjonen** — SMS fra en annen mamma blir til avtale,
   med svarfrist og påminnelse om gave
2. **Beskjeden fra barnehagen** — skjermbilde blir til hendelse med pakkeliste
3. **«Si fra til Marius»** — sløyfa. En andre telefon glir inn, han svarer «2»,
   og statusen hos henne slår om til grønt. **Dette er den viktigste.**
4. **Morgenmeldingen** — tre ting, og linja «ellers er det ingenting du må huske i dag»
5. **«Hva skal vi ha til middag»** — ett svar, ikke en meny, og det ene hun mangler
6. **Fristen i april** — sommer-SFO varsles i februar. Viser at den følger med
   på ting som er måneder unna.

Én av dem må spille av automatisk når siden lastes. Resten venter på trykk.

La HENNE velge hvilken som er hennes problem. Det er mer overbevisende enn
en reel hun ser passivt på.

### 3. Sandkassen: la henne prøve det på noe ekte

Nederst, før prisen: et felt der hun kan teste.

Gi tre–fire ferdige situasjoner hun kan trykke på («Prøv med en
barnehagebeskjed», «Prøv med en bursdagsinvitasjon»), OG muligheten til å laste
opp sitt eget skjermbilde.

**Det egne skjermbildet er hele poenget.** Det er der hun går fra å tro
at det virker til å vite det.

Hardt krav: **aldri lat som et ferdig svar er levende.** Er svaret forhåndslaget,
skal det stå «eksempel» på det. Produktet selger tillit, og en løgn i demoen
koster mer enn den gir.

Sett en grense på ekte kall — rate limit per IP, og en vennlig melding når den
er brukt opp. Det koster småpenger per besøkende, men det skal ikke kunne løpe løpsk.

## Regler som ikke kan brytes

**Ordforråd.** Ordene AI, bot, assistent, automatisering, effektivisere og
revolusjonere skal ikke finnes noe sted på siden. Ikke i alt-tekster heller.

**Ingen oppdiktede tall.** Ingen kundesitater, ingen «500 familier bruker det»,
ingen stjerner, ingen «sparer deg 5 timer i uka». Ingenting som ikke er sant ennå.
Trenger du sosialt bevis, la det stå tomt til det finnes.

**Design.** Behold paletten og typografien fra dagens side: varm sand, skogsgrønn,
leire som varselfarge, Newsreader til overskrifter og produktets stemme,
Karla til grensesnitt. Mobil først — de fleste kommer fra Instagram på telefon.

**Han trenger ingen app.** Dette er salgsargumentet. Hver gang SMS-en vises,
skal den se ut som vanlig SMS i systemfont og grått — visuelt helt ulik produktet.
Kontrasten er budskapet.

**Én knapp.** «Start i dag» overalt, gjentatt nedover siden. Aldri to
konkurrerende handlinger på samme skjermhøyde.

## Ikke bygg dette

- Ingen karusell som roterer av seg selv
- Ingen video som krever avspillingsknapp
- Ingen modal eller popup
- Ingen funksjonsliste med ikoner i tre kolonner
- Ingen «slik virker det»-seksjon med nummererte steg over folden —
  animasjonen ER forklaringen

## Ferdig når

En som aldri har hørt om produktet kan, etter tre sekunder på telefon,
si høyt hva det gjør. Test det på noen. Klarer de det ikke, er heroen feil —
ikke teksten under.
```
