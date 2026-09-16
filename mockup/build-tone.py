# -*- coding: utf-8 -*-
"""Tonen: den spør én gang, og den speiler måten hun faktisk skriver på."""
import pathlib
from importlib.machinery import SourceFileLoader

b = SourceFileLoader("b", "build-flyter.py").load_module()
sv = SourceFileLoader("sv", "build-selvbetjent.py").load_module()
I = b.I

SCREENS = {}

SCREENS["Tone.dc.html"] = [
    b.day("I dag · 09.40"),
    b.them("Ett spørsmål, så slipper du flere."),
    sv.ask("Hvordan vil du at jeg skriver til deg?",
           "Du kan endre det når som helst ved å si ifra."),
    sv.chips(["Kort og rett på", "Litt varmere", "Bare det nødvendige"]),
    b.aside("Til Thomas, barnehagen og mormor holder jeg meg saklig uansett hva du velger. "
            "Tonen du velger er din, ikke deres."),
]

SCREENS["Speil.dc.html"] = [
    b.day("Etter to uker"),
    b.them("Jeg har lagt merke til noe i måten du skriver på."),
    b.card("Slik skriver du", "Basert på 34 meldinger her",
           "\n".join([
               b.fact("Lengde", "Korte setninger. Sjelden store bokstaver."),
               b.fact("Ord du bruker", "«ok», «fint», «rekker ikke» — aldri «flott»"),
               b.fact("Når", "Mest mellom 21 og 23", last=True),
           ])),
    b.them("Jeg har lagt meg nærmere det. Vil du heller at jeg skriver som før?"),
    sv.chips(["Fortsett sånn", "Skriv som før"]),
    b.aside("Jeg leser bare det du sender meg her. Skal jeg også se på e-posten din, "
            "må du si ifra selv — jeg spør ikke om det."),
]

for name, rows in SCREENS.items():
    pathlib.Path(name).write_text(b.SHELL.format(rows="\n\n".join(rows)), encoding="utf-8")
print("skrev", ", ".join(SCREENS))
