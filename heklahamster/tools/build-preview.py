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
overrides = "HH.config.singleFile=true;HH.config.greetingBaseUrl='https://heklahamster.no/hilsen.html';"

scripts = [assets_js, read('js/vendor/qrcode.js'), read('js/config.js'), overrides,
           read('js/store.js'), read('js/greeting.js'), read('js/app.js')]

out = ('<title>Heklahamster.no</title>\n'
       '<meta name="claude:viewport-fit-sides" content="cover">\n'
       '<link rel="stylesheet" href="%s">\n<style>\n%s\n</style>\n%s\n' % (fonts, read('css/style.css'), body)
       + ''.join('<script>\n%s\n</script>\n' % s.replace('</script', '<\\/script') for s in scripts))
pathlib.Path(sys.argv[1]).write_text(out, encoding='utf-8')
print('Skrev %s (%.0f kB)' % (sys.argv[1], len(out.encode()) / 1024))
