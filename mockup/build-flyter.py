# -*- coding: utf-8 -*-
"""Genererer de seks nye flytskjermene fra ett felles skall."""
import pathlib

SHELL = '''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Karla:wght@400;500;600&display=swap">
  <style>
    body {{ margin: 0; }}
    * {{ box-sizing: border-box; }}
    a {{ color: #A0603F; }} a:hover {{ color: #7E4A30; }}
  </style>
</helmet>
<div style="width: 390px; min-height: 844px; background: #F4EEE5; font-family: Karla, 'Helvetica Neue', Helvetica, sans-serif; color: #2C2722; display: flex; flex-direction: column;">

  <div style="height: 52px; flex-shrink: 0;"></div>

  <div style="display: flex; align-items: center; gap: 12px; padding: 0 12px 14px 16px; border-bottom: 1px solid #E5DACB; flex-shrink: 0;">
    <div style="width: 36px; height: 36px; border-radius: 18px; background: #44574B; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#EDE6DA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5c4.2 2.6 5.8 6.4 4.7 10.1C15.6 18.3 13 20 12 20s-3.6-1.7-4.7-5.4C6.2 10.9 7.8 7.1 12 4.5Z"></path><path d="M12 9.5v8.5"></path></svg>
    </div>
    <div style="flex-grow: 1; font-family: Newsreader, Georgia, serif; font-size: 19px; font-weight: 500; letter-spacing: 0.01em;">Jajumi</div>
    <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A8075" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 11.2v4.6"></path><path d="M12 8.3v.2"></path></svg>
    </div>
  </div>

  <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 10px; padding: 18px 16px 8px 16px;">
{rows}
  </div>

  <div style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-top: 1px solid #E5DACB; background: #FAF6EF; flex-shrink: 0;">
    <div style="width: 44px; height: 44px; border-radius: 22px; border: 1px solid #DDD1BF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6F665C" stroke-width="1.5" stroke-linecap="round"><path d="M12 6v12"></path><path d="M6 12h12"></path></svg>
    </div>
    <div style="flex-grow: 1; height: 44px; border-radius: 22px; background: #FFFDF9; border: 1px solid #DDD1BF; display: flex; align-items: center; padding: 0 18px; font-size: 15px; color: #A0968A;">Melding</div>
  </div>

  <div style="height: 34px; background: #FAF6EF; flex-shrink: 0;"></div>

</div>
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{}}
</script>
</body>
</html>
'''

I = "    "

def day(t):
    return (f'{I}<div style="display: flex; align-items: center; justify-content: center; padding: 4px 0;">\n'
            f'{I}  <span style="font-size: 11.5px; letter-spacing: 0.09em; text-transform: uppercase; color: #9A9086; font-weight: 600;">{t}</span>\n'
            f'{I}</div>')

def them(t):
    return (f'{I}<div style="display: flex; justify-content: flex-start;">\n'
            f'{I}  <div style="max-width: 296px; background: #FFFDF9; border: 1px solid #E5DACB; border-radius: 20px 20px 20px 6px; padding: 12px 16px; font-family: Newsreader, Georgia, serif; font-size: 17.5px; line-height: 1.5;">{t}</div>\n'
            f'{I}</div>')

def me(t):
    return (f'{I}<div style="display: flex; justify-content: flex-end;">\n'
            f'{I}  <div style="max-width: 268px; background: #44574B; color: #F7F4EE; border-radius: 20px 20px 6px 20px; padding: 11px 16px; font-size: 15.5px; line-height: 1.45;">{t}</div>\n'
            f'{I}</div>')

def aside(t):
    return (f'{I}<div style="padding: 2px 6px 0 6px;">\n'
            f'{I}  <span style="font-family: Newsreader, Georgia, serif; font-style: italic; font-size: 14px; line-height: 1.5; color: #8A8075;">{t}</span>\n'
            f'{I}</div>')

def shot(kicker, sub, lines, fade=True):
    body = "\n".join(f'{I}      <div>{l}</div>' for l in lines)
    f = (f'{I}      <div style="position: absolute; left: 0; right: 0; bottom: 0; height: 40px; '
         f'background: linear-gradient(to bottom, rgba(255,255,255,0), #FFFFFF);"></div>') if fade else ""
    return (f'{I}<div style="display: flex; justify-content: flex-end;">\n'
            f'{I}  <div style="width: 268px; border-radius: 18px; overflow: hidden; border: 1px solid #DCD0BF; background: #FFFFFF;">\n'
            f'{I}    <div style="background: #EFEAE1; padding: 10px 14px; border-bottom: 1px solid #E2D9CB;">\n'
            f'{I}      <div style="font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: #8A8075; font-weight: 600;">{kicker}</div>\n'
            f'{I}      <div style="font-size: 12.5px; color: #6F665C; margin-top: 3px;">{sub}</div>\n'
            f'{I}    </div>\n'
            f'{I}    <div style="position: relative; padding: 14px; font-family: Newsreader, Georgia, serif; font-size: 13.5px; line-height: 1.55; color: #3A342D; display: flex; flex-direction: column; gap: 8px;">\n'
            f'{body}\n{f}\n'
            f'{I}    </div>\n'
            f'{I}  </div>\n'
            f'{I}</div>')

def fact(label, value, last=False):
    border = "" if last else " border-bottom: 1px solid #F1EAE0;"
    return (f'{I}    <div style="padding: 8px 0;{border}">\n'
            f'{I}      <div style="font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: #8A8075; font-weight: 600;">{label}</div>\n'
            f'{I}      <div style="font-family: Newsreader, Georgia, serif; font-size: 16px; line-height: 1.35; margin-top: 3px;">{value}</div>\n'
            f'{I}    </div>')

def alert(label, value):
    return (f'{I}    <div style="background: #F6E6DA; border-radius: 12px; padding: 12px 14px; margin-top: 8px;">\n'
            f'{I}      <div style="font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: #A0603F; font-weight: 600;">{label}</div>\n'
            f'{I}      <div style="font-family: Newsreader, Georgia, serif; font-size: 16px; line-height: 1.35; margin-top: 3px; color: #7E4A30;">{value}</div>\n'
            f'{I}    </div>')

def buttons(primary, ghost=None):
    g = (f'\n{I}    <div style="height: 48px; padding: 0 20px; border-radius: 24px; border: 1px solid #CFC2AF; '
         f'color: #44574B; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600;">{ghost}</div>') if ghost else ""
    return (f'{I}  <div style="display: flex; gap: 10px; padding: 0 18px 18px 18px;">\n'
            f'{I}    <div style="flex-grow: 1; height: 48px; border-radius: 24px; background: #44574B; color: #F7F4EE; '
            f'display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600;">{primary}</div>{g}\n'
            f'{I}  </div>')

def card(title, sub, inner, btns=None):
    b = "\n" + btns if btns else ""
    return (f'{I}<div style="background: #FFFDF9; border: 1px solid #E5DACB; border-radius: 18px; overflow: hidden;">\n'
            f'{I}  <div style="padding: 18px 18px 14px 18px; border-bottom: 1px solid #EFE6D9;">\n'
            f'{I}    <div style="font-family: Newsreader, Georgia, serif; font-size: 22px; line-height: 1.2;">{title}</div>\n'
            f'{I}    <div style="font-size: 13.5px; color: #6F665C; margin-top: 5px;">{sub}</div>\n'
            f'{I}  </div>\n'
            f'{I}  <div style="padding: 6px 18px 14px 18px;">\n{inner}\n{I}  </div>{b}\n'
            f'{I}</div>')

def task(n, title, sub, warn=False, last=False):
    border = "" if last else " border-bottom: 1px solid #F1EAE0;"
    numstyle = ("background: #F6E6DA; border: 1px solid #E3C6B0; color: #A0603F;" if warn
                else "border: 1px solid #C5B9A6; color: #6F665C;")
    substyle = "color: #A0603F;" if warn else "color: #6F665C;"
    return (f'{I}  <div style="display: flex; gap: 14px; align-items: flex-start; padding: 13px 0;{border}">\n'
            f'{I}    <div style="width: 26px; height: 26px; border-radius: 13px; {numstyle} display: flex; align-items: center; '
            f'justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0;">{n}</div>\n'
            f'{I}    <div>\n'
            f'{I}      <div style="font-family: Newsreader, Georgia, serif; font-size: 17px; line-height: 1.3;">{title}</div>\n'
            f'{I}      <div style="font-size: 13.5px; {substyle} margin-top: 3px;">{sub}</div>\n'
            f'{I}    </div>\n'
            f'{I}  </div>')

def tasklist(items):
    return (f'{I}<div style="background: #FFFDF9; border: 1px solid #E5DACB; border-radius: 18px; padding: 8px 18px;">\n'
            + "\n".join(items) + f'\n{I}</div>')

def weekrow(d, text, warn=False, last=False):
    border = "" if last else " border-bottom: 1px solid #F1EAE0;"
    col = "color: #7E4A30;" if warn else "color: #2C2722;"
    dcol = "color: #A0603F;" if warn else "color: #8A8075;"
    return (f'{I}  <div style="display: flex; gap: 12px; align-items: baseline; padding: 10px 0;{border}">\n'
            f'{I}    <div style="width: 30px; flex-shrink: 0; font-size: 10.5px; letter-spacing: 0.08em; '
            f'text-transform: uppercase; font-weight: 600; {dcol}">{d}</div>\n'
            f'{I}    <div style="font-family: Newsreader, Georgia, serif; font-size: 15.5px; line-height: 1.35; {col}">{text}</div>\n'
            f'{I}  </div>')

SCREENS = {}

# ---- 1. Bursdagsinvitasjonen: navngitt tredjeskift-oppgave (bursdager og gaver)
SCREENS["Bursdag.dc.html"] = [
    day("I dag"),
    shot("Melding fra Hanne", "Sofias mamma · 13.42",
         ["Hei! Sofia fyller 5 år og vi feirer i Sagene bad lørdag 3. oktober kl. 13–15.30.",
          "Si ifra innen onsdag om Emma kommer, så booker jeg antall."]),
    me("er ikke Emma på svømming da?"),
    card("Sofias bursdag", "Emma · lørdag 3. oktober",
         "\n".join([
             fact("Når", "Lørdag 3. oktober, 13.00–15.30"),
             fact("Hvor", "Sagene bad"),
             fact("Kolliderer ikke", "Svømmingen til Emma er torsdager", last=True),
             alert("Svarfrist", "Onsdag, til Hanne"),
         ]),
         buttons("Svar ja", "Endre")),
    aside("Gaven sier jeg ifra om torsdag, så du rekker butikken. Emma har badedrakt som passer."),
]

# ---- 2. Middagen: nr. 3 på stresslista, og det er en beslutning, ikke en oppskrift
SCREENS["Middag.dc.html"] = [
    day("I dag · 16.40"),
    me("hva skal vi ha til middag"),
    them("Fiskegrateng. Du har alt hjemme bortsett fra rømme."),
    card("Fiskegrateng", "25 minutter · uten melkeprotein",
         "\n".join([
             fact("Emma", "Hun har spist den før og likt den"),
             fact("Mangler", "Rømme — den laktosefrie", last=True),
         ]),
         buttons("Legg i handlelista", "Noe annet")),
    aside("Rekker du ikke butikken: pasta med laks og erter. Da har du alt."),
]

# ---- 3. Fristen tre måneder fram: overvåkingen, den delen som er usynlig til den ryker
SCREENS["Frist.dc.html"] = [
    day("Torsdag 12. februar · 09.15"),
    them("En ting som ikke haster ennå, men som blir vond hvis den ryker."),
    card("Sommer-SFO", "Jakob · påmelding i Visma",
         "\n".join([
             fact("Stengt", "Uke 28 og 29"),
             fact("Ferien deres", "Uke 29 og 30 — uke 28 står åpen", last=True),
             alert("Frist", "1. april, og den forlenges ikke"),
         ]),
         buttons("Minn meg 20. mars", "Ordne nå")),
    aside("Jeg tar den opp igjen i midten av mars. Du trenger ikke tenke på den før det."),
]

# ---- 4. Kollisjonen: den slutningen en kalender ikke trekker
SCREENS["Kollisjon.dc.html"] = [
    day("I dag · 11.20"),
    them("Torsdag går ikke opp."),
    card("Torsdag 24. september", "To steder, én voksen",
         "\n".join([
             fact("14.00", "Emma tilbake fra høsttur — hentes i barnehagen"),
             fact("17.00", "Jakob fotball på Grefsen — 20 minutter unna"),
             fact("Marius", "Jobber sent torsdager", last=True),
             alert("Står igjen", "Ingen henter Jakob etter trening"),
         ]),
         buttons("Spør Marius", "Jeg ordner")),
]

# ---- 5. Kvelden: nr. 4 på stresslista, og den mater morgenen
SCREENS["Kveld.dc.html"] = [
    day("I dag · 21.10"),
    them("To ting før du legger deg."),
    tasklist([
        task(1, "Gymtøy i sekken", "Jakob har kroppsøving i morgen"),
        task(2, "Signer skjemaet fra skolen", "Fristen er i morgen tidlig", warn=True, last=True),
    ]),
    them("Det var alt. Jeg vekker deg ikke med noe nytt før klokka 07."),
]

# ---- 6. Søndagskartet: det lanseringsteksten allerede lover, men som ikke fantes noe sted
SCREENS["Uke.dc.html"] = [
    day("Søndag 20. september · 18.00"),
    them("Uka som kommer. Tre ting krever noe av deg."),
    (f'{I}<div style="background: #FFFDF9; border: 1px solid #E5DACB; border-radius: 18px; padding: 8px 18px 10px 18px;">\n'
     f'{I}  <div style="font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A8075; '
     f'font-weight: 600; padding: 10px 0 4px 0;">Uke 39</div>\n'
     + "\n".join([
         weekrow("Man", "Frist: meld på høstturen", warn=True),
         weekrow("Tir", "Jakob fotball 17.00 — Marius kjører"),
         weekrow("Ons", "Turdag — gummistøvler og skift"),
         weekrow("Tor", "Høsttur, oppmøte 08.15 — matpakke og regntøy", warn=True),
         weekrow("Fre", "Svømming — Jakob"),
         weekrow("Helg", "Ingenting planlagt", last=True),
     ]) + f'\n{I}</div>'),
    aside("Vil du sende kartet videre til Marius?"),
]

for name, rows in SCREENS.items():
    pathlib.Path(name).write_text(SHELL.format(rows="\n\n".join(rows)), encoding="utf-8")
    print("skrev", name)
