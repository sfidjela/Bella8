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
  const browser = await chromium.launch();
  const ctx = await browser.newContext(contextOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_/.test(m.text())) errors.push(m.text()); });
  const shot = async name => { if (shots) await page.screenshot({ path: path.join(shots, label + '-' + name + '.png'), fullPage: name === 'forside' }); };

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
  check(await page.locator('.fstep[data-step="2"]').isVisible(), 'ett trykk på hamster → steg 2');

  // Steg 2: brodering maks 20 tegn, vises i forhåndsvisningen
  await page.locator('#flowNext').click();
  check(await page.locator('#embErr').isVisible(), 'tom brodering gir forklarende feilmelding');
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
  await page.locator('#toAddress').fill('Storgata 1');
  await page.locator('#toZip').pressSequentially('01x55');
  check((await page.locator('#toZip').inputValue()) === '0155', 'postnummer tar bare sifre');
  await page.locator('#toCity').fill('Oslo');
  await page.locator('#email').fill('kari@example.com');
  const sum = await page.locator('#summary').innerText();
  check(/Skjevehamsteren/.test(sum) && /Din lille idiot/.test(sum) && /Tante Bjørg/.test(sum) && /244 kr/.test(sum), 'oppsummeringen viser valgene');
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
  await page.locator('#emb').fill('Hvorfor?');
  await page.locator('#flowNext').click();
  check((await page.locator('#toName').inputValue()) === '', 'forrige mottaker er ikke lagret videre');
  await page.locator('#toName').fill('Per'); await page.locator('#toAddress').fill('Veien 2');
  await page.locator('#toZip').fill('5003'); await page.locator('#toCity').fill('Bergen'); await page.locator('#email').fill('a@b.no');
  await page.locator('#flowNext').click();
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
