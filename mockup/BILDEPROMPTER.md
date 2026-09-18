# Bildepromter

Åtte bilder. Ikke flere. Et nettsted med åtte bilder som hører sammen slår
et med tjue som ikke gjør det.

Promtene er på engelsk fordi bildemodellene er trent på engelsk og blir
merkbart dårligere på norsk. Lim inn **stilblokka + selve promten + negativ**
som én tekst.

---

## Stilblokken — skal med i alle åtte

```
Documentary photograph, shot on 35mm film, natural available light only.
Nordic domestic interior, worn and real, not styled and not a catalogue.
Muted warm palette: sand, oatmeal, soft clay, desaturated forest green,
pale grey daylight. Light oak surfaces with visible wear. Shallow depth of
field, fine film grain, slightly imperfect framing.
```

## Negativen — skal også med i alle åtte

```
No text, no lettering, no logos, no watermarks, no user interface,
no visible screen content. No faces, no eye contact. No stock-photo smiling.
No glossy surfaces, no cool blue tones, no teal-and-orange grade,
no perfect styling, no plants arranged for the camera.
```

**Hvorfor ingen ansikt:** hun skal kjenne seg igjen, ikke se på en annen kvinne
og vurdere om hun ligner. Hender, rom og ting bærer historien bedre.

**Hvorfor ingen skjerm:** en generert skjerm ser alltid falsk ut, og den
konkurrerer med telefonen vi selv tegner på siden.

---

## 1. FØR — gangen 07.10 · 16:9 · full bredde, høyt på siden

Dette er problemet. Siden har ikke bilde av det ennå, bare av lettelsen.

```
An empty Norwegian entryway hall at seven in the morning, no people at all.
A child's small rain boot tipped on its side, a single adult shoe out of
place, an open backpack with a lunchbox and a crumpled paper note half out
of it, a knitted hat dropped on the floor, too many jackets crowded on low
hooks. Pale grey morning light through a frosted glass door falls in a long
stripe across worn oak floorboards.
```

## 2. ETTER — telefonen legges fra seg · 16:9 · full bredde, nederst

**Dette har du alt.** Filnavn: `telefonen-legges-fra-seg.jpg`. Slippes inn
i plassholderen som står der nå. Ingen ny generering.

Trenger du den på nytt:

```
Two hands placing a phone face down on a worn oak kitchen table beside a
half-full mug of coffee. Knitted sweater sleeves, forearms only, no face in
frame. Warm low side light from a window out of frame. The gesture is calm
and deliberate, the moment of setting something down.
```

## 3. Delingsbildet · 1200×630 · Facebook, Messenger, iMessage

Dette er bildet folk faktisk ser når lenken deles. Det er verdt mer enn du tror,
og det er nesten alltid det siste noen lager.

Enkleste vei: beskjær **bilde 2** til 1200×630 med hendene til venstre og
luft til høyre, så teksten Facebook legger oppå ikke dekker noe.

Vil du ha et eget:

```
A worn oak kitchen table seen from above at a slight angle, wide horizontal
composition. On the left: a phone lying face down, a mug, a folded child's
drawing. The right two thirds of the frame is empty table surface and soft
morning light. Calm, quiet, unhurried.
```

## 4. Kjøkkenbenken 21.40 · 3:2 · ved pris eller spørsmål

Restene av en dag som er over. Brukes lavt på siden, der hun har bestemt seg
og bare trenger å kjenne at noen har sett dagen hennes.

```
A kitchen counter late in the evening, no people. An emptied lunchbox left
open to dry, a child's drawing held to a cupboard with tape, one clean glass,
a dish towel folded over the oven handle. A single warm lamp from the left,
the rest of the room falling into soft shadow. Quiet, ordinary, finished.
```

## 5. Annonse A — garderoben · 4:5 · Meta feed

```
A daycare cloakroom from the height of a standing adult, no people in frame.
Rows of small pegs with tiny jackets and name-tagged boots, a bench, a
radiator. One adult hand resting on the bench edge, out of focus in the
foreground. Grey daylight from a high window.
```

## 6. Annonse B — bilen · 4:5 · Meta feed

Det sterkeste motivet i settet. To minutter i en parkert bil før hun går inn
er et bilde tusenvis av mødre kjenner igjen uten at noen har sagt det høyt.

```
Interior of a parked car seen from the passenger side, no people. The
driver's seat empty, a child's car seat behind it with a mitten on it, a
half-drunk water bottle in the cup holder, keys still in the ignition.
Late afternoon light, a blurred apartment building through the windscreen.
Stillness.
```

## 7. Story · 9:16 · Instagram og Facebook stories

```
A narrow vertical view of a kitchen doorway seen from the hall. In the
foreground, out of focus, a backpack hanging on a hook. Through the doorway,
sharp: a table with two small plates, morning light across it. Nobody in the
room yet.
```

## 8. Åpningsbildet i annonsefilmen · 16:9 · første ramme

Samme verden, men laget for å ha tekst oppå seg. Derfor er halve bildet tomt.

```
A wide, quiet kitchen corner in early morning light. The left half of the
frame is an empty wall in soft warm shadow. The right half shows a corner of
a table with a lunchbox and a folded note. Composition deliberately
unbalanced with empty space on the left.
```

---

## Hva du skal kaste

Bildemodellene tar tre feil hver gang, og de er lette å overse i gleden
over at det kom noe pent ut.

**For rent.** Kommer det tilbake som en Ikea-katalog, er det feil. Hele
poenget er at det ser ut som noen faktisk bor der. Legg til
`cluttered, lived-in, slightly untidy` og kjør igjen.

**Tekst som ikke er tekst.** Modellene elsker å skrive noe på lappene og
boksene. Ser du bokstaver, kast bildet — det ser falskt ut i full bredde,
og det er alltid stavet feil.

**Kaldt lys.** Blir det blågrått og skarpt, har du fått kontorbelysning.
Legg til `warm morning light, soft` og gjenta.

**For mye motiv.** Er det tre historier i ett bilde, funker ingen av dem.
Ett objekt skal bære det. Boten i bilde 1. Hendene i bilde 2. Votten i bilde 6.

## Rekkefølgen jeg ville laget dem i

1 og 3 først. Bilde 1 fordi siden mangler problemet, og bilde 3 fordi det er
det eneste bildet som følger med lenken ut i verden. 6 når du skal begynne
med annonser. Resten når de andre sitter.

---

## Status — hva som finnes nå

| Motiv | Fil | Brukt |
|---|---|---|
| 1 · Gangen 07.10 | `bilder/gangen-syv-om-morgenen.jpg` | Øverste bånd på landingssiden |
| 2 · Telefonen legges fra seg | `bilder/telefonen-legges-fra-seg.jpg` | Nederste bånd |
| 3 · Delingsbildet 1200×630 | `bilder/deling-1200x630.jpg` | `og:image` — må få absolutt URL ved lansering |
| — Stue mot kjøkken, varm | `bilder/stue-mot-kjokken-varm.jpg` | Ubrukt. Materiale. |
| — Stue mot kjøkken, kjølig | `bilder/stue-mot-kjokken-kjolig.jpg` | Ubrukt. Har en plakat med lesbar tekst — beskjær den bort før bruk. |

Originalene er beskåret til 2,2:1 fordi båndet på siden er bredt og lavt.
Beskjær aldri i etterkant på nytt fra JPEG-ene her — gå tilbake til originalen.

### Mangler fortsatt
- **Motiv 5, garderoben.** Generert, men ikke lastet opp som fil.
- **Motiv 6, bilen.** Ikke laget. Det sterkeste annonsemotivet.
- **Motiv 7 og 8**, story og filmåpning. Ikke laget.
