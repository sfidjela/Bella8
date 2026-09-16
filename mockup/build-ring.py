# -*- coding: utf-8 -*-
"""Samme sløyfe, men til besteforeldre og barnepasser — der minnet faktisk betaler seg."""
import pathlib
from importlib.machinery import SourceFileLoader

b = SourceFileLoader("b", "build-flyter.py").load_module()
s = SourceFileLoader("s", "build-sloyfe.py").load_module()
I = b.I

OPTS = [
    "Svar med ett tall:",
    "1 &mdash; Ja, jeg kan",
    "2 &mdash; Ja, og legg det i kalenderen min",
    "3 &mdash; Kan ikke, foreslå noe annet",
    "4 &mdash; Noe annet (skriv fritt)",
]

her = [
    b.day("Fredag 18. september · 14.06"),
    b.me("kan du spørre mamma om hun kan hente Emma på fredag?"),
    b.them("Sendt. Hun fikk allergien og hentefristen med seg, så du slipper å gjenta det."),
    "\n\n".join([
        s.pending("Mormor", "Svarte 1 kl. 14.12 — hun henter", done=True),
        s.pending("Barnehagen", "Beskjed om at mormor henter — sendt", done=True),
    ]),
    b.aside("Hun har fått den allergibeskjeden tre ganger før. Nå følger den med hver gang, "
            "så ingen av dere må huske å si det."),
]

hans = [
    s.sms_day("Fredag 18. september 14.06"),
    s.sms_in([
        "Fra Kristin, via Jajumi.", "",
        "Kristin spør om du kan hente Emma fredag 25.9 kl. 16.00.", "",
        "Det du trenger:",
        "Bekkeblomen barnehage, avd. Maurtua.",
        "Emma tåler ikke melkeprotein &mdash; ikke melk, ost eller fløte.",
        "Hun må hentes senest 16.45.", "",
    ] + OPTS),
    s.sms_out("1"),
    s.sms_in(["Takk. Kristin vet at du henter, og barnehagen får beskjed.",
              "Jeg sender deg en påminnelse fredag formiddag."]),
    s.status("Levert 14.12"),
]

pathlib.Path("Mormor.dc.html").write_text(b.SHELL.format(rows="\n\n".join(her)), encoding="utf-8")
pathlib.Path("SmsMormor.dc.html").write_text(s.SMS_SHELL.format(rows="\n\n".join(hans)), encoding="utf-8")
print("skrev Mormor.dc.html og SmsMormor.dc.html")
