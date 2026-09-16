# -*- coding: utf-8 -*-
"""Hennes flate: delingsmenyen, widgeten og låseskjermen."""
import pathlib
from importlib.machinery import SourceFileLoader
b = SourceFileLoader("b", "build-flyter.py").load_module()

BARE = '''<!doctype html>
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
<div style="width: 390px; min-height: 844px; {bg} font-family: Karla, 'Helvetica Neue', Helvetica, sans-serif; color: #2C2722; display: flex; flex-direction: column; position: relative; overflow: hidden;">
{body}
</div>
</x-dc>
<script data-dc-script data-props='{{"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{}}
</script>
</body>
</html>
'''

MARK = ('<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="1.5" '
        'stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5c4.2 2.6 5.8 6.4 4.7 10.1C15.6 18.3 13 20 12 20s-3.6-1.7-4.7-5.4C6.2 10.9 7.8 7.1 12 4.5Z"></path>'
        '<path d="M12 9.5v8.5"></path></svg>')

# ---------------- 1. Delingsmenyen: to trykk i stedet for fire ----------------
tiles = ""
for label, tone in [("Meldinger", "#7C8A96"), ("E-post", "#8E8276"), ("Notater", "#93856B"), ("Lagre bilde", "#7E8579")]:
    tiles += (f'      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 68px;">\n'
              f'        <div style="width: 60px; height: 60px; border-radius: 16px; background: {tone}; opacity: .35;"></div>\n'
              f'        <div style="font-size: 11px; color: #6F665C; text-align: center; line-height: 1.25;">{label}</div>\n'
              f'      </div>\n')

deling = f'''  <div style="flex-grow: 1; background: #2B2723; padding: 60px 22px 0 22px;">
    <div style="border-radius: 14px; overflow: hidden; border: 1px solid #45403A; background: #fff; opacity: .5;">
      <div style="background: #EFEAE1; padding: 9px 13px; border-bottom: 1px solid #E2D9CB;">
        <div style="font-size: 10px; letter-spacing: .09em; text-transform: uppercase; color: #8A8075; font-weight: 600;">Bekkeblomen barnehage</div>
      </div>
      <div style="padding: 13px; font-family: Newsreader, Georgia, serif; font-size: 13px; line-height: 1.5; color: #3A342D;">
        Torsdag 24. september tar vi høsttur til Sognsvann. Vi går fra barnehagen kl. 08.30, så vær her senest 08.15.
      </div>
    </div>
  </div>

  <div style="background: #FAF6EF; border-radius: 22px 22px 0 0; border-top: 1px solid #E5DACB; padding: 12px 0 34px 0; flex-shrink: 0;">
    <div style="display: flex; justify-content: center; padding-bottom: 14px;">
      <div style="width: 42px; height: 4px; border-radius: 2px; background: #D8CCBA;"></div>
    </div>

    <div style="padding: 0 20px 16px 20px; border-bottom: 1px solid #EDE4D6;">
      <div style="font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase; color: #8A8075; font-weight: 600; padding-bottom: 12px;">Del skjermbilde</div>
      <div style="display: flex; align-items: center; gap: 14px; background: #FFFDF9; border: 1px solid #E5DACB; border-radius: 16px; padding: 14px 16px;">
        <div style="width: 46px; height: 46px; border-radius: 13px; background: #44574B; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          {MARK.format(s=22, c="#EDE6DA")}
        </div>
        <div>
          <div style="font-family: Newsreader, Georgia, serif; font-size: 18px; line-height: 1.2;">Jajumi</div>
          <div style="font-size: 13px; color: #6F665C; margin-top: 2px;">Legg den i tråden</div>
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 14px; padding: 16px 20px 0 20px; overflow: hidden;">
{tiles}    </div>
  </div>
'''

# ---------------- 2. Widgeten: dagens tre ting på hjemskjermen ----------------
def icon_row(tones):
    out = '    <div style="display: flex; gap: 20px; justify-content: center; padding-top: 22px;">\n'
    for t in tones:
        out += f'      <div style="width: 60px; height: 60px; border-radius: 16px; background: {t}; opacity: .3;"></div>\n'
    return out + '    </div>\n'

widget_rows = ""
for n, (title, sub, warn) in enumerate([
    ("Turdag i barnehagen", "Gummistøvler og skift", False),
    ("Jakob fotball 17.00", "Marius kjører", False),
    ("Meld på høstturen", "Fristen går ut mandag", True)], start=1):
    dot = "#A0603F" if warn else "#B3A896"
    col = "#7E4A30" if warn else "#6F665C"
    border = "" if n == 3 else " border-bottom: 1px solid #F1EAE0;"
    widget_rows += (f'      <div style="display: flex; gap: 11px; align-items: flex-start; padding: 9px 0;{border}">\n'
                    f'        <div style="width: 7px; height: 7px; border-radius: 4px; background: {dot}; margin-top: 7px; flex-shrink: 0;"></div>\n'
                    f'        <div style="min-width: 0;">\n'
                    f'          <div style="font-family: Newsreader, Georgia, serif; font-size: 15px; line-height: 1.25;">{title}</div>\n'
                    f'          <div style="font-size: 12px; color: {col}; margin-top: 1px;">{sub}</div>\n'
                    f'        </div>\n'
                    f'      </div>\n')

widget = f'''  <div style="flex-grow: 1; padding: 74px 22px 0 22px;">

    <div style="background: #FFFDF9; border: 1px solid #E5DACB; border-radius: 22px; padding: 16px 18px 14px 18px; box-shadow: 0 8px 24px rgba(44,39,34,.10);">
      <div style="display: flex; align-items: center; gap: 8px; padding-bottom: 8px;">
        <div style="width: 18px; height: 18px; border-radius: 6px; background: #44574B; display: flex; align-items: center; justify-content: center;">
          {MARK.format(s=11, c="#EDE6DA")}
        </div>
        <div style="font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase; color: #8A8075; font-weight: 600;">I dag</div>
        <div style="flex-grow: 1;"></div>
        <div style="font-size: 11.5px; color: #A0968A;">07.02</div>
      </div>
{widget_rows}    </div>

{icon_row(["#8E8276", "#7C8A96", "#93856B", "#7E8579"])}
{icon_row(["#96877E", "#7F8B84", "#8B8374", "#87807A"])}
  </div>

  <div style="padding: 0 22px 40px 22px;">
    <div style="display: flex; gap: 20px; justify-content: center; background: rgba(255,253,249,.55); border-radius: 26px; padding: 12px 18px;">
      <div style="width: 58px; height: 58px; border-radius: 16px; background: #8E8276; opacity: .3;"></div>
      <div style="width: 58px; height: 58px; border-radius: 16px; background: #7C8A96; opacity: .3;"></div>
      <div style="width: 58px; height: 58px; border-radius: 16px; background: #44574B; display: flex; align-items: center; justify-content: center;">
        {MARK.format(s=28, c="#EDE6DA")}
      </div>
      <div style="width: 58px; height: 58px; border-radius: 16px; background: #93856B; opacity: .3;"></div>
    </div>
  </div>
'''

# ---------------- 3. Låseskjermen: bare den neste tingen ----------------
laas = f'''  <div style="flex-grow: 1; display: flex; flex-direction: column; align-items: center; padding: 96px 26px 0 26px;">
    <div style="font-family: Newsreader, Georgia, serif; font-size: 74px; line-height: 1; color: #FBF7F0; letter-spacing: -.02em;">07.02</div>
    <div style="font-size: 14px; color: rgba(251,247,240,.75); margin-top: 8px;">onsdag 16. september</div>

    <div style="width: 100%; margin-top: 30px; background: rgba(251,247,240,.13); border: 1px solid rgba(251,247,240,.18); border-radius: 18px; padding: 14px 16px; backdrop-filter: blur(8px);">
      <div style="display: flex; align-items: center; gap: 9px; padding-bottom: 7px;">
        <div style="width: 17px; height: 17px; border-radius: 5px; background: #6E8375; display: flex; align-items: center; justify-content: center;">
          {MARK.format(s=10, c="#EDE6DA")}
        </div>
        <div style="font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase; color: rgba(251,247,240,.7); font-weight: 600;">Jajumi</div>
        <div style="flex-grow: 1;"></div>
        <div style="font-size: 11.5px; color: rgba(251,247,240,.55);">nå</div>
      </div>
      <div style="font-family: Newsreader, Georgia, serif; font-size: 17px; line-height: 1.35; color: #FBF7F0;">Turdag i dag. Gummistøvler og skift i sekken.</div>
      <div style="font-size: 13px; color: rgba(251,247,240,.65); margin-top: 4px;">To ting til i dag</div>
    </div>

    <div style="width: 100%; margin-top: 10px; background: rgba(251,247,240,.08); border-radius: 16px; padding: 12px 16px;">
      <div style="font-size: 12.5px; color: rgba(251,247,240,.6);">Marius bekreftet høstturen · 12.04 i går</div>
    </div>
  </div>
'''

pathlib.Path("Deling.dc.html").write_text(BARE.format(bg="background: #2B2723;", body=deling), encoding="utf-8")
pathlib.Path("Widget.dc.html").write_text(BARE.format(bg="background: linear-gradient(170deg, #E8DFD0 0%, #DCCFBB 55%, #CFC0A9 100%);", body=widget), encoding="utf-8")
pathlib.Path("Laas.dc.html").write_text(BARE.format(bg="background: linear-gradient(175deg, #33302B 0%, #262320 45%, #1B1916 100%);", body=laas), encoding="utf-8")
print("skrev Deling, Widget, Laas")
