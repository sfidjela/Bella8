#!/usr/bin/env python3
"""Bygger hele butikken til én selvstendig HTML-fil (bilder, stil og skript innebygd).
Brukes til delbare forhåndsvisninger.  Bruk:  python3 tools/build-preview.py ut.html"""
import base64, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
read = lambda p: (root / p).read_text(encoding='utf-8')

html = read('index.html')
body = html.split('<!-- BODY -->')[1].split('<!-- /BODY -->')[0]
fonts = re.search(r'<link rel="stylesheet" href="(https://fonts\.googleapis\.com[^"]+)">', html).group(1)

assets = {p.stem: 'data:image/webp;base64,' + base64.b64encode(p.read_bytes()).decode()
          for p in sorted((root / 'assets').glob('*.webp')) if p.stem in ('lang', 'skjev', 'bust', 'feit', 'hero', 'qr')}
assets_js = 'window.HH=window.HH||{};HH.assets={' + ','.join('"%s":"%s"' % kv for kv in assets.items()) + '};'
# 3D-modellene (assets/3d/*.glb) publiseres som egne filer ved siden av forhåndsvisningen.
overrides = ("HH.config.singleFile=true;HH.config.greetingBaseUrl='https://heklahamster.no/hilsen.html';"
             "HH.config.modelViewerSrc='https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer-umd.min.js';")

scripts = [assets_js, read('js/vendor/qrcode.js'), read('js/config.js'), overrides,
           read('js/store.js'), read('js/greeting.js'), read('js/view3d.js'), read('js/app.js'), read('js/alive.js')]

out = ('<title>Heklahamster.no</title>\n'
       '<meta name="claude:viewport-fit-sides" content="cover">\n'
       '<link rel="stylesheet" href="%s">\n<style>\n%s\n</style>\n%s\n' % (fonts, read('css/style.css') + '\n' + read('css/alive.css'), body)
       + ''.join('<script>\n%s\n</script>\n' % s.replace('</script', '<\\/script') for s in scripts))
pathlib.Path(sys.argv[1]).write_text(out, encoding='utf-8')
print('Skrev %s (%.0f kB)' % (sys.argv[1], len(out.encode()) / 1024))
