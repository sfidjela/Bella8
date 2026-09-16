# Modellen i bakgrunnen

## Ja — og Muse er faktisk tilgjengelig som infrastruktur

Meta lanserte en modell-API i juli 2026 som gir utviklertilgang til **Muse Spark 1.1**:
multimodal, bygget for agentiske oppgaver, OpenAI-kompatibel, selvbetjent, betal-per-bruk,
og tilgjengelig via OpenRouter og AWS. Sterk på computer use og verktøykall.

Så instinktet er ikke bare riktig i prinsippet — det er kjøpbart i dag.

**Men det er to helt forskjellige ting som begge heter Muse:**

| | Kan du bygge på den? |
|---|---|
| **Muse Spark 1.1** — modellen, via Metas modell-API | **Ja.** Vanlig infrastruktur. |
| **Muse** — forbrukerappen med Secure VM som bestiller og betaler | **Nei.** Det er et produkt, ikke en plattform. Å automatisere den er Airbnb-fella om igjen. |

## Modellen er en råvare. Minnet og sløyfa er produktet.

Det er den riktige måten å tenke på dette. Bygg **ett tynt modell-adapterlag** der modellen er
konfigurasjon, ikke arkitektur. Da er hver forbedring i frontmodellene gratis oppside,
og ingen leverandør kan presse deg.

Rut per oppgave i stedet for å bruke én modell til alt:

| Oppgave | Behov |
|---|---|
| Klassifisering og ruting | Billigste raske modell |
| Uttrekk fra uskarpe norske skjermbilder | Sterk multimodal — dette er den vanskeligste jobben du har |
| Norsk tekst i produktets stemme | Sterk modell, lav effort |
| Frist- og konfliktresonnering | Sterk modell |

Og **cache familiens minne aggressivt**. Det er den samme prefiksen i hvert eneste kall,
og cache-lesninger koster en brøkdel av vanlige inn-tokens. Det er den største kostnadsspaken du har.

## Kostnaden er ikke det du må bekymre deg for

Regnestykke for en normal familie i måneden — ca. 30 skjermbilder, 30 morgenmeldinger, 60 samtaleturer.
Det blir grovt 315 000 inn-tokens og 36 000 ut-tokens.

| Modellklasse | Inn $/M | Ut $/M | Per bruker per måned |
|---|---|---|---|
| Lettvekt | 1 / 5 | | ~5 kr |
| Mellomklasse | 2 / 10 | | **~11 kr** |
| Toppklasse | 5 / 25 | | **~27 kr** |

Med caching på minne-prefiksen faller inn-siden kraftig, og en blandet rutingstrategi lander
realistisk på **10–20 kr per bruker per måned**.

**Korreksjon til det jeg skrev i MARKED.md:** jeg anslo 25–50 kr og 70–85 % bruttomargin.
Med riktig ruting og caching er det nærmere **10–20 kr og rundt 90 % margin**.
Modellkostnaden er ikke begrensningen på 299 kr. SMS er en mindre linje enn det igjen.

Det som fortsatt kan løpe løpsk er halen: én prateglad bruker. Sett en grense — ikke fordi
snittet er dyrt, men fordi halen er lang.

## Fella: du kan ikke leie den ene tingen som ikke er til leie

Fire ting skiller oss fra Muse. Tre av dem kan du bygge på hvilken som helst modell.
**Den fjerde er tillit, og den er spesifikt tillit mot Meta.**

Sender du en norsk mors barnedata — allergier, barnehage, hentetider, hvem de er hos når —
gjennom Metas API, kan du ikke samtidig selge deg som det trygge alternativet til Meta.
Det er ikke et juridisk problem. Det er et fortellingsproblem, og fortellingen er salget.

Samme test gjelder alle: **kan du si leverandørens navn høyt til en norsk mor
uten at hun trekker på skuldrene?**

Krav til enhver leverandør du velger:

- Databehandleravtale
- Data behandlet i EU/EØS
- Ingen trening på dine data
- Et navn du tåler å skrive i personvernerklæringen

Det er ikke bare etterlevelse. Det er selve posisjoneringen, og den er det eneste
konkurrentene ikke kan kopiere med penger.

## Oppsummert

1. **Ja** — modellen jobber i bakgrunnen, og den skal være utbyttbar fra dag én.
2. **Nei** — ikke bygg på forbrukeragenter. Bygg på modell-API-er.
3. **Rut per oppgave**, cache minnet, sett en grense for halen.
4. **Velg leverandør etter om du tåler å nevne den**, ikke bare etter pris og kvalitet.
5. Kostnaden er lavere enn jeg først sa. **Marginen er ikke problemet — churn er det fortsatt.**
