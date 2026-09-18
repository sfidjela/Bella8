# -*- coding: utf-8 -*-
"""Uten menneskelig onboarding: den spør når den mangler noe. Og delt hverdag."""
import pathlib
from importlib.machinery import SourceFileLoader

b = SourceFileLoader("b", "build-flyter.py").load_module()
s = SourceFileLoader("s", "build-sloyfe.py").load_module()
I, SHELL = b.I, b.SHELL

PAGE_SHELL = SHELL.replace(
'''    <div style="width: 36px; height: 36px; border-radius: 18px; background: #44574B; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#EDE6DA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5c4.2 2.6 5.8 6.4 4.7 10.1C15.6 18.3 13 20 12 20s-3.6-1.7-4.7-5.4C6.2 10.9 7.8 7.1 12 4.5Z"></path><path d="M12 9.5v8.5"></path></svg>
    </div>
    <div style="flex-grow: 1; font-family: Newsreader, Georgia, serif; font-size: 19px; font-weight: 500; letter-spacing: 0.01em;">Jajumi</div>''',
'''    <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: -8px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#44574B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"></path></svg>
    </div>
    <div style="flex-grow: 1; font-family: Newsreader, Georgia, serif; font-size: 19px; font-weight: 500;">Det jeg vet om dere</div>''')

def chips(items):
    cs = "\n".join(
        f'{I}  <div style="height: 44px; padding: 0 18px; border-radius: 22px; border: 1px solid #CFC2AF; '
        f'background: #FFFDF9; color: #44574B; display: flex; align-items: center; font-size: 14.5px; '
        f'font-weight: 600;">{t}</div>' for t in items)
    return (f'{I}<div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; padding-top: 2px;">\n'
            f'{cs}\n{I}</div>')

def ask(question, note=None):
    n = (f'\n{I}    <div style="font-size: 13.5px; color: #6F665C; margin-top: 8px; line-height: 1.4;">{note}</div>') if note else ""
    return (f'{I}<div style="background: #FFFDF9; border: 1px solid #E5DACB; border-radius: 18px; padding: 18px;">\n'
            f'{I}    <div style="font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: #8A8075; '
            f'font-weight: 600;">Jeg mangler én ting</div>\n'
            f'{I}    <div style="font-family: Newsreader, Georgia, serif; font-size: 20px; line-height: 1.3; '
            f'margin-top: 8px;">{question}</div>{n}\n'
            f'{I}</div>')

def known(text, source, guess=False):
    col = "#7E4A30" if guess else "#3A342D"
    scol = "#A0603F" if guess else "#9A9086"
    return (f'{I}  <div style="padding: 10px 0; border-bottom: 1px solid #F1EAE0;">\n'
            f'{I}    <div style="font-family: Newsreader, Georgia, serif; font-size: 15.5px; line-height: 1.4; color: {col};">{text}</div>\n'
            f'{I}    <div style="font-size: 11.5px; color: {scol}; margin-top: 3px;">{source}</div>\n'
            f'{I}  </div>')

SCREENS = {}

# ================== uten onboarding ==================

SCREENS["Start.dc.html"] = [
    b.day("Første melding"),
    b.them("Hei. Du trenger ikke fylle ut noe, og ingen kommer til å ringe deg."),
    b.them("Send meg det som kommer inn. Skjermbilder, videresendte mailer, "
           "meldinger fra barnehagen. Jeg spør om det jeg trenger underveis."),
    b.aside("Det tar et par uker før jeg kjenner dere. Den første uka gjetter jeg litt — "
            "og jeg sier ifra hver gang jeg gjør det."),
]

SCREENS["Sporsmal.dc.html"] = [
    b.day("I dag · 08.12"),
    b.me("kan du legge inn denne"),
    b.them("Lagt inn. Én ting vet jeg ikke, og den gjør resten mye bedre:"),
    ask("Hvem henter Emma på torsdager?",
        "Jeg spør fordi torsdagene ser ut til å veksle. Svarer du nå, spør jeg aldri igjen."),
    chips(["Jeg", "Thomas", "Det veksler", "Noen andre"]),
]

SCREENS["Vokser.dc.html"] = [
    (f'{I}<div style="font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A8075; '
     f'font-weight: 600; padding-bottom: 6px;">Emma, 4 år</div>\n'
     f'{I}<div style="background: #FFFDF9; border: 1px solid #E5DACB; border-radius: 16px; padding: 4px 18px;">\n'
     + "\n".join([
         known("Melkeproteinallergi — ikke laktose", "Du skrev det 12. september"),
         known("Bekkeblomen barnehage, avd. Maurtua", "Fra invitasjonen 11. september"),
         known("Hentes senest 16.45", "Fra barnehagens ukeplan"),
         known("Sko 27", "Gjetning ut fra alder — stemmer det?", guess=True),
     ]) + f'\n{I}</div>'),
    chips(["Ja, 27", "Nei, større", "Nei, mindre"]),
    b.aside("Tre ting er jeg usikker på. Jeg spør om dem når de blir relevante, ikke nå."),
]

SCREENS["Hjelp.dc.html"] = [
    b.day("I dag · 20.55"),
    b.me("jeg skjønner ikke helt hva jeg skal bruke deg til"),
    b.them("Det vanligste er disse tre. Du trenger ikke gjøre alle."),
    b.tasklist([
        b.task(1, "Slenge inn beskjeder", "Barnehagen, skolen, invitasjoner — jeg gjør dem om til avtaler"),
        b.task(2, "Spørre om dagen", "«Hva skjer i morgen» klokka ti om kvelden"),
        b.task(3, "Sende videre", "Til Thomas, mormor eller barnevakt — de svarer med ett tall", last=True),
    ]),
    b.them("Vil du at jeg viser nummer 1 med noe ekte fra din egen uke?"),
    b.aside("Får du det fortsatt ikke til: ring 22 00 00 00 mellom 09 og 15 på hverdager."),
]

# ================== delt hverdag ==================

SCREENS["Skifte.dc.html"] = [
    b.day("Torsdag 24. september · 16.30"),
    b.them("Emma er hos deg fra i dag. Dette skjedde i uka som var."),
    b.card("Fra Thomas' uke", "17.–24. september",
           "\n".join([
               b.fact("Helse", "Siste dose Apocillin onsdag kveld — kuren er ferdig"),
               b.fact("Søvn", "Sov dårlig tirsdag og onsdag"),
               b.fact("Ligger igjen hos Thomas", "Regntøyet og den blå drikkeflaska", last=True),
           ])),
    b.aside("Thomas får det samme om din uke på torsdag. Ingen av dere trenger å ringe hverandre."),
]

SCREENS["Begge.dc.html"] = [
    b.day("I dag · 13.02"),
    b.them("Barnehagen sendte ut noe. Thomas har fått det samme, samtidig."),
    b.card("Høsttur til Sognsvann", "Torsdag 24. september",
           "\n".join([
               b.fact("Hvem sin uke", "Din — turen faller i uke 39"),
               b.fact("Betyr", "Du leverer 08.15 med matpakke og regntøy"),
               b.fact("Thomas", "Trenger ikke gjøre noe. Han vet det likevel.", last=True),
           ]),
           b.buttons("Legg i kalenderen", "Endre")),
    b.aside("Alt fra barnehagen går til begge. Dere slipper å passe på at den andre har fått det."),
]

SCREENS["Bytte.dc.html"] = [
    b.day("Søndag 21. september · 19.40"),
    b.them("Thomas spør om å bytte helgen 10.–12. oktober mot helgen etter."),
    b.card("Bytteforespørsel", "Fra Thomas · kom 19.38",
           "\n".join([
               b.fact("Betyr for deg", "Emma er hos deg i høstferien i stedet"),
               b.fact("Kollisjoner", "Ingen. Begge helgene er åpne hos deg."),
               b.fact("Hans begrunnelse", "«Har fått jobbhelg 10.–12.»", last=True),
           ]),
           b.buttons("Godta", "Noe annet")),
    b.aside("Du trenger ikke svare ham. Jeg gir beskjed og oppdaterer begge kalenderne."),
]

SMS_SCREENS = {}
SMS_SCREENS["SmsPappa.dc.html"] = [
    s.sms_day("Søndag 21. september 19.52"),
    s.sms_in([
        "Fra Jajumi, på vegne av Kristin.", "",
        "Du ba om å bytte helgen 10.&ndash;12. oktober mot helgen etter.", "",
        "Kristin har sagt ja. Begge kalendere er oppdatert.", "",
        "1 &mdash; Forstått",
        "4 &mdash; Noe er feil",
    ]),
    s.sms_out("1"),
    s.sms_in(["Notert. Jeg minner deg på den 8. oktober."]),
    s.status("Levert 19.53"),
]

for name, rows in SCREENS.items():
    shell = PAGE_SHELL if name == "Vokser.dc.html" else SHELL
    pathlib.Path(name).write_text(shell.format(rows="\n\n".join(rows)), encoding="utf-8")

for name, rows in SMS_SCREENS.items():
    pathlib.Path(name).write_text(s.SMS_SHELL.format(rows="\n\n".join(rows)), encoding="utf-8")

print("skrev", len(SCREENS) + len(SMS_SCREENS), "skjermer")
