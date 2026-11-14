#!/bin/sh
# Lager mappen dist/ med bare det som skal ut på nett (ingen tester, verktøy eller notater).
set -e
cd "$(dirname "$0")/.."
rm -rf dist && mkdir -p dist
cp index.html hilsen.html adresse.html admin.html products.json dist/
cp -R css js assets dist/
# Demoen skal ikke indekseres av søkemotorer.
printf '/*\n  X-Robots-Tag: noindex, nofollow\n  Referrer-Policy: no-referrer\n' > dist/_headers
echo "dist/ er klar: $(du -sh dist | cut -f1)"
