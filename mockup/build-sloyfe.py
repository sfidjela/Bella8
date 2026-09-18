# -*- coding: utf-8 -*-
"""Marius-sløyfa: hun ber om noe sammensatt, han svarer med et tall på SMS."""
import pathlib
from importlib.machinery import SourceFileLoader

b = SourceFileLoader("b", "build-flyter.py").load_module()
I, SHELL = b.I, b.SHELL

# ---------- eget skall for SMS: bevisst nøytralt, dette er ikke produktet vårt ----------
SMS_SHELL = '''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
    body {{ margin: 0; }}
    * {{ box-sizing: border-box; }}
    a {{ color: #2F6FB5; }} a:hover {{ color: #24578F; }}
  </style>
</helmet>
<div style="width: 390px; min-height: 844px; background: #F1F1F4; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C1C1E; display: flex; flex-direction: column;">

  <div style="height: 52px; flex-shrink: 0;"></div>

  <div style="display: flex; align-items: center; gap: 4px; padding: 0 16px 12px 8px; border-bottom: 1px solid #D9D9DE; flex-shrink: 0; background: #F7F7F9;">
    <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3C6EA8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"></path></svg>
    </div>
    <div style="flex-grow: 1;">
      <div style="font-size: 16px; font-weight: 600; letter-spacing: -0.01em;">Jajumi</div>
      <div style="font-size: 12px; color: #77777E; margin-top: 1px;">+47 59 44 20 11</div>
    </div>
  </div>

  <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; padding: 18px 14px 8px 14px;">
{rows}
  </div>

  <div style="display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-top: 1px solid #D9D9DE; background: #F7F7F9; flex-shrink: 0;">
    <div style="flex-grow: 1; height: 42px; border-radius: 21px; background: #FFFFFF; border: 1px solid #D2D2D8; display: flex; align-items: center; padding: 0 16px; font-size: 15px; color: #9A9AA2;">Tekstmelding</div>
    <div style="width: 42px; height: 42px; border-radius: 21px; background: #4C5A67; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"></path><path d="m5.5 11.5 6.5-6.5 6.5 6.5"></path></svg>
    </div>
  </div>

  <div style="height: 34px; background: #F7F7F9; flex-shrink: 0;"></div>

</div>
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{}}
</script>
</body>
</html>
'''

def sms_day(t):
    return (f'{I}<div style="display: flex; align-items: center; justify-content: center; padding: 4px 0;">\n'
            f'{I}  <span style="font-size: 11.5px; color: #8E8E96; font-weight: 500;">{t}</span>\n'
            f'{I}</div>')

def sms_in(lines):
    body = "\n".join(
        f'{I}    <div style="height: 7px;"></div>' if l == "" else f'{I}    <div>{l}</div>'
        for l in lines)
    return (f'{I}<div style="display: flex; justify-content: flex-start;">\n'
            f'{I}  <div style="max-width: 292px; background: #FFFFFF; border-radius: 18px 18px 18px 5px; padding: 11px 14px; '
            f'font-size: 15px; line-height: 1.42; box-shadow: 0 1px 1px rgba(28,28,30,.07);">\n{body}\n'
            f'{I}  </div>\n'
            f'{I}</div>')

def sms_out(t):
    return (f'{I}<div style="display: flex; justify-content: flex-end;">\n'
            f'{I}  <div style="background: #4C5A67; color: #FFFFFF; border-radius: 18px 18px 5px 18px; padding: 10px 17px; '
            f'font-size: 15.5px; font-weight: 500;">{t}</div>\n'
            f'{I}</div>')

def status(t):
    return (f'{I}<div style="display: flex; justify-content: flex-end; padding-right: 8px;">\n'
            f'{I}  <span style="font-size: 11.5px; color: #8E8E96;">{t}</span>\n'
            f'{I}</div>')

# ---------- tilstandsrad for hennes side: venter / svart ----------
def pending(label, value, done=False):
    dot = ("#44574B" if done else "#C8B79E")
    ring = ("#44574B" if done else "#DCCFB9")
    mark = ('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F7F4EE" stroke-width="3" '
            'stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"></path></svg>') if done else ""
    return (f'{I}<div style="display: flex; align-items: center; gap: 12px; background: #FFFDF9; border: 1px solid #E5DACB; '
            f'border-radius: 16px; padding: 14px 16px;">\n'
            f'{I}  <div style="width: 22px; height: 22px; border-radius: 11px; background: {dot}; border: 1px solid {ring}; '
            f'display: flex; align-items: center; justify-content: center; flex-shrink: 0;">{mark}</div>\n'
            f'{I}  <div>\n'
            f'{I}    <div style="font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: #8A8075; font-weight: 600;">{label}</div>\n'
            f'{I}    <div style="font-family: Newsreader, Georgia, serif; font-size: 16px; line-height: 1.35; margin-top: 3px;">{value}</div>\n'
            f'{I}  </div>\n'
            f'{I}</div>')

OPTIONS = [
    "Svar med ett tall:",
    "1 &mdash; Forstått",
    "2 &mdash; Forstått, legg den i kalenderen min",
    "3 &mdash; Passer ikke, foreslå noe annet",
    "4 &mdash; Noe annet (skriv fritt)",
]

BRIEF = [
    "Fra Kristin, via Jajumi.",
    "",
    "Emma: høsttur til Sognsvann.",
    "Torsdag 24.9, oppmøte i barnehagen 08.15.",
    "Matpakke, drikkeflaske, regntøy, skift.",
    "",
    "Kristin spør om du kan levere.",
    "",
] + OPTIONS

# ================= hennes side =================
SCREENS = {}

SCREENS["Be.dc.html"] = [
    b.day("I dag · 11.52"),
    b.me("se bildet — legg det i kalenderen, og spør Marius om han kan levere. "
         "jeg vil vite at han faktisk har fått det med seg, ikke bare at meldingen er sendt"),
    b.them("Den tar jeg. Jeg sender ham det han trenger, og sier ifra når han har svart — ikke før."),
]

SCREENS["Sendt.dc.html"] = [
    b.day("I dag · 11.58"),
    b.them("Lagt i kalenderen. Marius har fått en SMS."),
    "\n\n".join([
        pending("Din kalender", "Høsttur — torsdag 24.9", done=True),
        pending("Marius", "Sendt 11.58 — venter på svar"),
    ]),
    b.aside("Han trenger ingen app. Han svarer med et tall. Har han ikke svart innen i kveld, spør jeg en gang til."),
]

SCREENS["Bekreftet.dc.html"] = [
    b.day("I dag · 12.04"),
    b.them("Marius svarte. Han tar leveringen."),
    "\n\n".join([
        pending("Din kalender", "Høsttur — torsdag 24.9", done=True),
        pending("Marius", "Svarte 2 kl. 12.04 — lagt i kalenderen hans", done=True),
    ]),
    b.them("Du trenger ikke følge opp den. Jeg minner ham på det onsdag kveld."),
]

SCREENS["Delt.dc.html"] = [
    b.day("I dag · 12.31"),
    b.them("Marius kunne ikke levere. Han foreslo å hente i stedet, og det går opp."),
    "\n\n".join([
        pending("Du", "Leverer torsdag 08.15", done=True),
        pending("Marius", "Henter 14.00 — svarte 1 kl. 12.31", done=True),
    ]),
    b.aside("Han hadde et møte 08.00. Det visste jeg ikke — han sa det selv i svaret, og jeg regnet om."),
]

# ================= hans side =================
SMS_SCREENS = {}

SMS_SCREENS["Sms.dc.html"] = [
    sms_day("I dag 11.58"),
    sms_in(BRIEF),
    sms_out("2"),
    sms_in(["Takk. Lagt i kalenderen din torsdag 24.9, 08.00–08.30.",
            "Kristin vet at du tar den. Jeg minner deg på onsdag kveld."]),
    status("Levert"),
]

SMS_SCREENS["SmsNyTid.dc.html"] = [
    sms_day("I dag 11.58"),
    sms_in(["Fra Kristin, via Jajumi.", "",
            "Emma: høsttur til Sognsvann.",
            "Torsdag 24.9, oppmøte 08.15, tilbake 14.00.", "",
            "Kristin spør om du kan levere.", ""] + OPTIONS),
    sms_out("3 — har møte 08.00"),
    sms_in(["Da foreslår jeg at du henter 14.00 i stedet, så leverer Kristin.",
            "Turen er tilbake i barnehagen 14.00, og du er ferdig 13.30 på torsdager.", "",
            "Svar 1 hvis det går."]),
    sms_out("1"),
    status("Levert 12.31"),
]

for name, rows in SCREENS.items():
    pathlib.Path(name).write_text(SHELL.format(rows="\n\n".join(rows)), encoding="utf-8")
    print("skrev", name)

for name, rows in SMS_SCREENS.items():
    pathlib.Path(name).write_text(SMS_SHELL.format(rows="\n\n".join(rows)), encoding="utf-8")
    print("skrev", name)
