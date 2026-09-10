# Landingstekst — ferdig

Klar til å limes inn i Framer eller Carrd. Én side, én knapp, ingen meny.
Erstatt «Familiens ro» hvis navnet endres. `[VENTER]` = skal stå tomt til det finnes ekte innhold.

---

## Hero

# Noen andre husker det nå

Turnklær på torsdag. Foreldremøtet. At melken er tom.
Du har hele familiens hode i ditt eget.

Familiens ro tar over listen.

**[ Start i dag — kr 1 490/mnd ]**

*Begrenset til 15 familier nå i oppstarten.*

---

## Tre punkter

### Du forteller det én gang
45 minutter med et menneske. Vi kobler kalenderne, hører hvordan uka deres ser ut, og hva som stresser mest.

### Søndag får du uka
Ett kart. Hvem skal hvor, hvem kjører, hva må pakkes. Ingen app å åpne — det kommer til deg.

### Om morgenen får du dagen
Tre ting. Ikke tjue. Det som faktisk må skje før du legger deg.

---

## Mellomseksjon

## Det er ikke tid du mangler

Det er at du er den eneste som holder alt i hodet samtidig.

Den jobben har ingen gitt deg. Den bare ble din.

Familiens ro er ikke enda et sted du må logge inn og fylle ut.
Det er at noen andre har oversikten, og gir deg beskjed.

---

## Slik starter du

1. **Du trykker start.** Betaler første måned.
2. **Vi ringer.** 45 minutter, når det passer deg. Kveld går fint.
3. **Vi setter opp.** Kalendere, rutiner, hva som skal minnes om når.
4. **Første søndag får du uka.** Fra da går det av seg selv.

Du bruker ingenting mer enn det du allerede bruker.

---

## Pris

**kr 1 490 per måned**
Ingen binding. Si opp med en melding.

**kr 3 990 for tre måneder**
Sparer 480 kr. Anbefalt — det tar noen uker før det virkelig sitter.

Inkludert: onboarding med et menneske, ukekart hver søndag, daglig hint, chat når det haster, månedlig justering.

**[ Start i dag ]**

---

## Spørsmål

**Er dette en app?**
Nei. Du får det der du allerede er. Ingenting å laste ned.

**Hvem ser kalenderen vår?**
Vi, for å sette opp og holde det i gang. Ingenting deles videre, ingenting selges. Du kan be om at alt slettes, når som helst.

**Hva om det ikke passer?**
Si ifra i løpet av de første 14 dagene, så får du pengene tilbake. Uten spørsmål.

**Må mannen min være med?**
Nei. De fleste starter alene. Han kan kobles på senere hvis dere vil.

**Hvor mye jobb er det for meg?**
45 minutter én gang. Så noen meldinger i uka.

**Er det et menneske eller en maskin?**
Begge. Et menneske setter det opp og følger deg opp. Systemet gjør det som gjentar seg. Du merker forskjellen ved at det faktisk husker.

---

## Bunn

## Fortsatt den eneste som husker alt?

**[ Start i dag — kr 1 490/mnd ]**

*15 plasser i oppstarten.*

[VENTER: kundesitat — skal stå tomt til en ekte pilotmor har sagt ja til å bli sitert]

---

# Notater til implementering

**Knapp:** samme tekst overalt — «Start i dag». Én knapp per skjermhøyde.

**Stripe:** to produkter, månedlig og 3-måneders. Etter betaling → rett til booking-side (Cal.com). Ikke «takk for kjøpet»-side uten neste steg — der mister du folk.

**Bilder:** ekte norsk hverdag. Ingen stockbilder av smilende familier i hvitt. Vis gjerne selve ukekartet — det er merkevaren.

**Ikke skriv:** «AI», «assistent», «bot», «automatisering», «revolusjonerer», «gamechanger», «effektiviserer», «i en travel hverdag».

**Det du ikke får si før det er sant:** antall brukere, stjerner, «anbefalt av», tidsbesparelse i timer. Ingen fabrikkerte tall.

**Personvern:** kobling til kalender og e-post krever at du faktisk har en personvernerklæring og et databehandlingsgrunnlag før første kunde. Dette er ikke valgfritt — det er GDPR, og det er også et salgsargument mot denne målgruppen. Sett av tid til det i uke 1.
