/* Røyktest av hele nettsiden i mobil- og desktopstørrelse.
   Kjør:  python3 -m http.server 4173   (i heklahamster-mappen)
          node tests/smoke.js [skjermbildemappe]
   Krever Playwright (npm i -D playwright). */
'use strict';
const { chromium, devices } = require('playwright');
const path = require('path');

const BASE = process.env.HH_URL || 'http://localhost:4173/';
const shots = process.argv[2] || null;
let failed = 0;
const check = (ok, name, extra) => {
  if (!ok) failed++;
  console.log((ok ? '  ok   ' : '  FEIL ') + name + (extra ? '  → ' + extra : ''));
};

async function run(label, contextOpts) {
  console.log('\n== ' + label + ' ==');
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext(contextOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_/.test(m.text())) errors.push(m.text()); });
  const shot = async name => { if (shots) await page.screenshot({ path: path.join(shots, label + '-' + name + '.png'), fullPage: name === 'forside' }); };

  // Adresseregisteret simuleres, så testen ikke er avhengig av nettet.
  await ctx.route('https://ws.geonorge.no/**', route => {
    const u = new URL(route.request().url());
    const zip = u.searchParams.get('postnummer');
    const adresser = zip
      ? (zip === '5003' ? [{ adressetekst: 'Torget 1', postnummer: '5003', poststed: 'BERGEN' }] : [])
      : [{ adressetekst: 'Storgata 1', postnummer: '0155', poststed: 'OSLO' }, { adressetekst: 'Storgata 10', postnummer: '9008', poststed: 'TROMSØ' }];
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ adresser }) });
  });
  await page.goto(BASE + 'index.html');
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload();
  await page.waitForLoadState('load');

  // Bilder: bla gjennom hele siden slik at også lazy-bilder lastes.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  });
  const imgs = await page.evaluate(() => [...document.querySelectorAll('#site img')].map(i => ({ src: i.currentSrc.split('/').pop(), ok: i.complete && i.naturalWidth > 0 })));
  check(imgs.length >= 6 && imgs.every(i => i.ok), 'alle bilder på forsiden lastes (' + imgs.length + ')', imgs.filter(i => !i.ok).map(i => i.src).join(', '));
  check(await page.locator('#products .product').count() === 4, 'fire hamstere i produktlisten');
  check(/12 cm/.test(await page.locator('#facts').textContent()) && /5 virkedager/.test(await page.locator('#facts').textContent()), 'størrelse og leveringstid vises på forsiden');
  check(/ikke en leke/.test(await page.locator('#facts').textContent()), 'forsiden sier at hamsteren er pynt, ikke leke');
  check(/Tjukkhamsteren/.test((await page.locator('#products').innerText()).replace(/\u00ad/g, '')), 'Tjukkhamsteren har nytt navn');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(overflow <= 0, 'ingen sidelengs rulling på forsiden', overflow + 'px');
  await shot('forside');

  // Hver «Send en hamster»-knapp åpner bestillingen
  const starts = await page.locator('[data-start]').count();
  let startOk = true;
  for (let i = 0; i < starts; i++) {
    const b = page.locator('[data-start]').nth(i);
    if (!(await b.isVisible())) continue;
    await b.click();
    startOk = startOk && await page.locator('#flow').isVisible();
    await page.locator('#flowClose').click();
  }
  check(startOk, 'alle ' + starts + ' handlingsknapper åpner bestillingen');

  // Steg 1: ett trykk velger hamster og går videre
  await page.locator('[data-start]').first().click();
  check(await page.locator('.fstep[data-step="1"]').isVisible(), 'steg 1 vises');
  const pickImgs = await page.evaluate(() => [...document.querySelectorAll('#pick img')].every(i => i.complete && i.naturalWidth > 0));
  check(pickImgs, 'fire hamsterbilder i steg 1');
  await shot('steg1');
  await page.locator('#pick [data-pick="skjev"]').click();
  // 3D-visningen tar over forhåndsvisningen når den er lastet. Lås til bilde mens broderingen testes.
  const has3d = await page.locator('#preview [data-pv="foto"]').count() > 0;
  if (has3d) await page.locator('#preview [data-pv="foto"]').click();
  check(await page.locator('.fstep[data-step="2"]').isVisible(), 'ett trykk på hamster → steg 2');

  // Steg 2: brodering maks 20 tegn, vises i forhåndsvisningen
  check(/79 kr/.test(await page.locator('#embPrice').textContent()), 'broderingstillegget vises ved feltet');
  await page.locator('#emb').fill('');
  await page.locator('#emb').pressSequentially('Dette er altfor lang tekst til en hamster');
  const emb = await page.locator('#emb').inputValue();
  check([...emb].length === 20, 'brodering kuttes på 20 tegn', JSON.stringify(emb));
  check((await page.locator('#preview [data-stitch]').textContent()) === emb, 'broderingen vises på hamsteren');
  check((await page.locator('#embCount').textContent()) === '20/20', 'tegntelleren viser 20/20');
  await page.locator('#emb').fill('🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹');
  check((await page.locator('#embCount').textContent()) === '20/20', 'emoji telles som ett tegn hver');
  await page.locator('#embChips .chip').first().click();
  check((await page.locator('#emb').inputValue()) === 'Din lille idiot', 'forslag fyller inn brodering');
  const stitchBox = await page.locator('#preview [data-stitch]').boundingBox();
  const figBox = await page.locator('#preview .hamster').boundingBox();
  check(stitchBox && stitchBox.x >= figBox.x && stitchBox.x + stitchBox.width <= figBox.x + figBox.width, 'broderingen holder seg innenfor bildet');
  await shot('steg2');

  // 3D-visning
  if (has3d) {
    await page.locator('#preview [data-pv="3d"]').click();
    const loaded = await page.waitForFunction(() => { const v = document.querySelector('#preview model-viewer'); return v && v.loaded; }, null, { timeout: 60000 }).then(() => true, () => false);
    check(loaded, '3D-modellen lastes');
    if (loaded) {
      await page.locator('#preview [data-pv="3d"]').click();
      check(await page.locator('#preview .pv3d').isVisible() && !(await page.locator('#preview .hamster').isVisible()), '«Snurr i 3D» bytter til 3D-visning');
      check((await page.locator('#preview .stitch3d').textContent()) === 'Din lille idiot', 'broderingen følger med over på 3D-modellen');
      await shot('steg2-3d');
    }
    await page.locator('#preview [data-pv="foto"]').click();
  } else { console.log('  (3D ikke testet: WebGL er ikke tilgjengelig i denne nettleseren)'); }

  // Hilsentyper
  await page.locator('#gtLyd').check({ force: true });
  check(await page.locator('#panelLyd').isVisible() && !(await page.locator('#panelTekst').isVisible()), 'lydhilsen viser opplasting');
  await page.locator('#flowNext').click();
  check(await page.locator('#mediaErr').isVisible(), 'lyd uten fil stoppes med feilmelding');
  await page.locator('#audioFile').setInputFiles({ name: 'notat.txt', mimeType: 'text/plain', buffer: Buffer.from('hei') });
  check(/ikke en lydfil/.test(await page.locator('#mediaErr').textContent()), 'feil filtype avvises');
  await page.locator('#audioFile').setInputFiles({ name: 'hilsen.wav', mimeType: 'audio/wav', buffer: wav() });
  check(await page.locator('#audioPreview audio').isVisible(), 'lydfil kan lastes opp og spilles av');
  await page.locator('#gtVideo').check({ force: true });
  check(await page.locator('#panelVideo').isVisible(), 'videohilsen viser opplasting');
  await page.locator('#gtTekst').check({ force: true });
  await page.locator('#greetText').fill('Jeg så denne og tenkte på deg. Beklager.');

  // Avsender
  await page.locator('#revealYes').check({ force: true });
  await page.locator('#flowNext').click();
  check(await page.locator('#senderErr').isVisible(), 'avsløring uten navn stoppes');
  await page.locator('#senderName').fill('Tante Bjørg');
  await page.locator('#flowNext').click();
  check(await page.locator('.fstep[data-step="3"]').isVisible(), 'gyldig steg 2 → steg 3');

  // Steg 3
  await page.locator('#flowNext').click();
  check(await page.locator('#toNameErr').isVisible() && await page.locator('.fstep[data-step="3"]').isVisible(), 'tom adresse stopper betaling');
  await page.locator('#toName').fill('Ola Nordmann');
  await page.locator('#toAddress').pressSequentially('Storg');
  await page.locator('#toAddressSuggest li').first().waitFor();
  check(await page.locator('#toAddressSuggest li').count() === 2, 'adresseforslag vises mens man skriver');
  await page.locator('#toAddressSuggest li').first().click();
  check((await page.locator('#toAddress').inputValue()) === 'Storgata 1' && (await page.locator('#toZip').inputValue()) === '0155' && (await page.locator('#toCity').inputValue()) === 'Oslo',
    'valgt forslag fyller ut adresse, postnummer og sted');
  await page.locator('#toZip').fill('');
  await page.locator('#toZip').pressSequentially('01x55');
  check((await page.locator('#toZip').inputValue()) === '0155', 'postnummer tar bare sifre');
  await page.locator('#email').fill('kari@example.com');
  const sum = (await page.locator('#summary').innerText()).replace(/\u00ad/g, '');
  check(/Skjevehamsteren/.test(sum) && /Din lille idiot/.test(sum) && /Tante Bjørg/.test(sum) && /249 kr/.test(sum), 'oppsummeringen viser valgene');
  check(/Brodering\s*79 kr/.test(sum) && /Frakt i Norge\s*59 kr/.test(sum) && /Å betale\s*387 kr/.test(sum), 'hamster 249 + brodering 79 + frakt 59 = 387 kr');
  await shot('steg3');

  // Tilbake: ingenting forsvinner
  await page.locator('#flowBack').click();
  check((await page.locator('#emb').inputValue()) === 'Din lille idiot' && (await page.locator('#senderName').inputValue()) === 'Tante Bjørg'
    && (await page.locator('#greetText').inputValue()).startsWith('Jeg så'), 'tilbake til steg 2 beholder alt');
  await page.locator('#flowBack').click();
  check((await page.locator('#pick [data-pick="skjev"]').getAttribute('aria-checked')) === 'true', 'tilbake til steg 1 husker valgt hamster');
  await page.locator('#flowNext').click();
  await page.locator('#flowNext').click();
  check((await page.locator('#toAddress').inputValue()) === 'Storgata 1' && (await page.locator('#email').inputValue()) === 'kari@example.com', 'steg 3 beholder adresse og e-post');

  // Lukk + last siden på nytt: kladden overlever
  await page.locator('#flowClose').click();
  await page.reload();
  check(await page.locator('#resume').isVisible(), '«Fortsett»-knapp vises etter ny innlasting');
  await page.locator('#resume').click();
  check((await page.locator('#toName').inputValue()) === 'Ola Nordmann', 'kladden overlever ny innlasting');

  // Betal (demo)
  check(/demo/i.test(await page.locator('#flowNext').textContent()), 'betalingsknappen er merket som demo');
  await page.locator('#flowNext').click();
  await page.locator('.done-title').waitFor();
  check(/Ingen penger er trukket/.test(await page.locator('#done').innerText()), 'bekreftelsen sier tydelig at ingenting er betalt');
  const qrDark = await page.evaluate(() => {
    const c = document.getElementById('qrCanvas'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let dark = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 80) dark++; return dark / (d.length / 4);
  });
  check(qrDark > 0.2 && qrDark < 0.7, 'QR-koden er tegnet', qrDark.toFixed(2));
  const href = await page.locator('#openGreeting').getAttribute('href');
  check(/hilsen\.html#[0-9a-f]{32}$/.test(href), 'hilsenlenken har 128-bits tilfeldig nøkkel');
  await shot('ferdig');

  // Se som mottaker (i butikken)
  await page.locator('#openGreeting').click();
  await page.locator('#grOpen').click();
  check(/Jeg så denne/.test(await page.locator('#grViewBody .gr-text').innerText()), 'mottakervisning viser teksthilsenen');
  await page.locator('#grWhoBtn').click();
  check(/tante bjørg/i.test(await page.locator("#grWho").innerText()), 'avsender avsløres når kunden har valgt det');
  await shot('mottaker-i-butikk');
  await page.locator('#grViewClose').click();

  // Den ekte hilsensiden (QR-lenken)
  const g = await ctx.newPage();
  await g.goto(href);
  await g.locator('#grOpen').click();
  check(await g.locator('.gr-hamster img').evaluate(i => i.complete && i.naturalWidth > 0), 'hilsen.html viser hamsterbildet');
  check((await g.locator('.gr-hamster [data-stitch]').textContent()) === 'Din lille idiot', 'hilsen.html viser broderingen');
  const html = await g.content();
  check(!/Storgata|kari@example\.com|Ola Nordmann/.test(html), 'hilsen.html inneholder ikke adresse eller kjøpers e-post');
  check(await g.locator('meta[name="robots"]').getAttribute('content') === 'noindex,nofollow,noarchive', 'hilsen.html er merket noindex');
  if (shots) await g.screenshot({ path: path.join(shots, label + '-hilsen.png') });
  await g.locator('#grReport').evaluate(b => b.closest('details').open = true);
  await g.locator('#grReport').click();
  check((await g.locator('#grReportStatus').innerText()).length > 0, '«Meld fra» gir tilbakemelding');
  await g.goto(BASE + 'hilsen.html#' + 'a'.repeat(32));
  await g.reload();
  check(/INGEN HILSEN/.test(await g.locator('#greetingRoot').innerText()), 'ukjent nøkkel gir «finnes ikke», ikke innhold');
  await g.close();

  // Ny bestilling: anonym + standardtekst, kladden er tømt
  await page.locator('#oneMore').click();
  check(await page.locator('.fstep[data-step="1"]').isVisible(), '«Send en til» starter på nytt');
  await page.locator('#pick [data-pick="lang"]').click();
  check((await page.locator('#emb').inputValue()) === '' && await page.locator('#revealNo').isChecked(), 'ny bestilling starter blank og anonym');
  await page.locator('#flowNext').click();   // uten brodering
  check((await page.locator('#toName').inputValue()) === '', 'forrige mottaker er ikke lagret videre');
  check(/Naken mage/.test(await page.locator('#summary').innerText()) && /Betal 308 kr/.test(await page.locator('#flowNext').textContent()), 'uten brodering: 249 + frakt 59 = 308 kr');
  await page.locator('#toName').fill('Per Hansen');
  await page.locator('#toZip').pressSequentially('5003');
  await page.waitForFunction(() => document.getElementById('toCity').value === 'Bergen', null, { timeout: 5000 }).catch(() => {});
  check((await page.locator('#toCity').inputValue()) === 'Bergen', 'poststed fylles ut fra postnummer');
  // Avsender har ikke adressen: spør mottakeren
  await page.locator('#addrAsk').check({ force: true });
  check(await page.locator('#toPhone').isVisible() && !(await page.locator('#toAddress').isVisible()), '«Spør mottakeren» bytter adressefelt mot mobilnummer');
  await page.locator('#email').fill('a@b.no');
  await page.locator('#toPhone').fill('123');
  await page.locator('#flowNext').click();
  check(await page.locator('#toPhoneErr').isVisible(), 'ugyldig mobilnummer stoppes');
  await page.locator('#toPhone').fill('+47 912 34 567');
  await page.locator('#flowNext').click();
  await page.locator('#addrLink').waitFor();
  const addrHref = await page.locator('#addrLink').getAttribute('href');
  check(/adresse\.html#[0-9a-f]{32}$/.test(addrHref), 'mottakeren får en egen, tilfeldig adresselenke');
  const a = await ctx.newPage();
  await a.goto(addrHref);
  const askText = await a.locator('#askRoot').innerText();
  check(/PER/.test(askText) && !/Langhamsteren|a@b\.no|hilsen/i.test(askText), 'adressesiden røper verken hamster, hilsen eller avsender');
  await a.locator('#askForm button[type=submit]').click();
  check(await a.locator('#aAddressErr').isVisible(), 'adressesiden krever adresse');
  await a.locator('#aAddress').fill('Veien 2'); await a.locator('#aZip').fill('5003'); await a.locator('#aCity').fill('Bergen');
  await a.locator('#askForm button[type=submit]').click();
  check(/TAKK/.test(await a.locator('#askRoot').innerText()), 'mottakeren kan lagre adressen sin');

  // Ordreoversikten
  await a.goto(BASE + 'admin.html');
  check(await a.locator('.adm-card').count() === 2, 'ordreoversikten viser begge ordrene');
  const first = a.locator('.adm-card').first();
  check(/Veien 2/.test(await first.innerText()) && /Ny/.test(await first.locator('.adm-status').innerText()), 'adressen fra mottakeren er koblet til riktig ordre');
  if (shots) await a.screenshot({ path: path.join(shots, label + '-admin.png'), fullPage: true });
  await first.locator('[data-next]').click();
  check(/Brodert/.test(await a.locator('.adm-card').first().locator('.adm-status').innerText()), 'status kan flyttes til brodert');
  await a.evaluate(() => { window.print = () => {}; });
  await a.locator('.adm-card').first().locator('[data-print]').click();
  check(await a.locator('#printArea .lbl img').count() === 1 && /DEMO-/.test(await a.locator('#printArea .lbl-slip').innerText()), 'QR-lapp med ordrenummer kan skrives ut');
  if (shots) await a.screenshot({ path: path.join(shots, label + '-lapp.png') });
  await a.locator('#printClose').click();
  await a.locator('#admFind').fill(href);
  check(await a.locator('.adm-card').count() === 1 && /Ola Nordmann/.test(await a.locator('.adm-card').innerText()), 'skannet QR-lenke finner riktig ordre');
  await a.close();
  await page.locator('#openGreeting').click();
  await page.locator('#grOpen').click();
  await page.locator('#grWhoBtn').click();
  check(/hemmelig/i.test(await page.locator('#grWho').innerText()), 'anonym avsender forblir hemmelig');
  const stored = await page.evaluate(() => new Promise(res => {
    const r = indexedDB.open('heklahamster'); r.onsuccess = () => {
      const all = r.result.transaction('kv').objectStore('kv').getAll(); all.onsuccess = () => res(JSON.stringify(all.result));
    };
  }));
  check(!/Veien 2|a@b\.no/.test(stored), 'hilsenlageret inneholder ikke adresse eller e-post');
  await page.locator('#grViewClose').click();
  await page.keyboard.press('Escape');
  check(!(await page.locator('#flow').isVisible()), 'Escape lukker bestillingen');

  check(errors.length === 0, 'ingen JavaScript-feil', errors.join(' | '));
  await browser.close();
}

function wav() { // 0,1 s stillhet
  const n = 800, b = Buffer.alloc(44 + n);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22); b.writeUInt32LE(8000, 24); b.writeUInt32LE(8000, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34);
  b.write('data', 36); b.writeUInt32LE(n, 40); b.fill(128, 44);
  return b;
}

(async () => {
  await run('mobil', { ...devices['iPhone 13'] });
  await run('desktop', { viewport: { width: 1280, height: 800 } });
  console.log(failed ? '\n' + failed + ' sjekk(er) feilet.' : '\nAlt i orden.');
  process.exit(failed ? 1 : 0);
})();
