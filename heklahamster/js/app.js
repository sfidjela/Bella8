/* Heklahamster – forside og bestillingsflyt. */
'use strict';
(function () {
  var cfg = HH.config, esc = HH.esc;
  var $ = function (id) { return document.getElementById(id); };
  var price = cfg.priceNok + ' kr';

  // Bilder i den statiske HTML-en
  document.querySelectorAll('img[data-img]').forEach(function (img) { img.src = cfg.img(img.dataset.img); });
  if (!cfg.demo) document.querySelectorAll('[data-demo-note]').forEach(function (el) { el.hidden = true; });

  // ---------- Tilstand ----------
  var blank = function () {
    return { step: 1, reached: 1, product: null, embroidery: '', greetType: 'tekst', greetText: '',
             reveal: false, senderName: '', toName: '', toAddress: '', toZip: '', toCity: '', email: '' };
  };
  var saved = HH.store.loadDraft();
  var state = Object.assign(blank(), saved || {});
  if (!HH.product(state.product)) { state.product = null; state.step = 1; state.reached = 1; }
  var media = { lyd: null, video: null };   // valgte filer (i minnet + IndexedDB for aktiv type)
  var mediaUrls = { lyd: '', video: '' };
  var lastOrder = null;
  var flowOpen = false;

  function save() { HH.store.saveDraft(state); updateResume(); }

  HH.store.loadDraftMedia().then(function (file) {
    if (file && (state.greetType === 'lyd' || state.greetType === 'video')) {
      media[state.greetType] = file;
      renderMedia(state.greetType);
    }
  });

  // ---------- Forside: produktene ----------
  $('products').innerHTML = cfg.products.map(function (p, i) {
    return '<button class="product" type="button" data-pick="' + p.id + '" aria-label="Velg ' + esc(p.name) + '">' +
      HH.hamsterFigure(p, '', { lazy: true }) +
      '<span class="product-info">' +
        '<span class="product-name">' + p.nameHtml + '</span>' +
        '<span class="product-line">' + esc(p.line) + '</span>' +
        '<span class="product-remark pen">' + esc(p.remark) + '</span>' +
        '<span class="product-foot"><span class="product-price">' + price + '</span><span class="product-go">Velg denne →</span></span>' +
      '</span>' +
      '<span class="grade" aria-hidden="true">' + p.grade + '</span>' +
    '</button>';
  }).join('');

  $('pick').innerHTML = cfg.products.map(function (p) {
    return '<button class="pick-card" type="button" role="radio" aria-checked="false" data-pick="' + p.id + '">' +
      HH.hamsterFigure(p, '') +
      '<span class="pick-name">' + p.nameHtml + '</span>' +
      '<span class="pick-line">' + esc(p.line) + '</span>' +
    '</button>';
  }).join('');

  $('embChips').innerHTML = cfg.embroiderySuggestions.map(function (s) {
    return '<button type="button" class="chip" data-chip="' + esc(s) + '">' + esc(s) + '</button>';
  }).join('');

  document.addEventListener('click', function (e) {
    var pick = e.target.closest('[data-pick]');
    if (pick) { choose(pick.dataset.pick); return; }
    if (e.target.closest('[data-start]')) { openFlow(state.product ? Math.min(state.step, 3) : 1); }
  });

  function choose(id) {
    if (state.product !== id) { state.product = id; }
    state.reached = Math.max(state.reached, 2);
    openFlow(2);
  }

  // ---------- «Fortsett bestillingen» ----------
  function updateResume() {
    var p = HH.product(state.product);
    var btn = $('resume');
    btn.hidden = !p || flowOpen;
    if (p) btn.textContent = 'Fortsett med ' + p.name + ' →';
  }
  $('resume').addEventListener('click', function () { openFlow(Math.min(state.step, 3)); });

  // ---------- Åpne / lukke / navigere ----------
  var lastFocus = null;
  function openFlow(step) {
    if (!flowOpen) { lastFocus = document.activeElement; }
    flowOpen = true;
    $('flow').hidden = false;
    $('site').setAttribute('inert', '');
    document.documentElement.classList.add('locked');
    go(step, { push: true });
  }
  function closeFlow() {
    flowOpen = false;
    $('flow').hidden = true;
    $('site').removeAttribute('inert');
    document.documentElement.classList.remove('locked');
    updateResume();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('flowClose').addEventListener('click', function () {
    if (state.step === 4) resetAfterOrder();
    closeFlow();
  });

  function go(step, opts) {
    opts = opts || {};
    if (step > 1 && !state.product) step = 1;
    if (step === 4 && !lastOrder) step = 3;
    state.step = step;
    if (step < 4) state.reached = Math.max(state.reached, step);
    if (step < 4) save();

    document.querySelectorAll('.fstep').forEach(function (s) { s.hidden = Number(s.dataset.step) !== step; });
    $('flowSteps').classList.toggle('is-finished', step === 4);
    if (step !== 2) stopRec();
    document.querySelectorAll('#flowSteps button').forEach(function (b) {
      var n = Number(b.dataset.goto);
      b.disabled = step === 4 || n > state.reached || (n > 1 && !state.product);
      b.classList.toggle('is-current', n === step);
      b.classList.toggle('is-done', n < step || step === 4);
      if (n === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });

    if (step === 1) renderPick();
    if (step === 2) renderStep2();
    if (step === 3) renderStep3();
    renderBar();

    $('flowBody').scrollTop = 0;
    var title = document.querySelector('.fstep[data-step="' + step + '"] .fstep-title');
    if (title && !opts.keepFocus) title.focus({ preventScroll: true });

    if (opts.push) { try { history.pushState({ hhStep: step }, ''); } catch (e) { /* sandkasse */ } }
  }

  window.addEventListener('popstate', function (e) {
    if (!flowOpen) return;
    if ($('grView').hidden === false) { closeGreetingView(); return; }
    var s = e.state && e.state.hhStep;
    if (s && state.step !== 4) go(Math.min(s, state.reached)); else { if (state.step === 4) resetAfterOrder(); closeFlow(); }
  });

  $('flowSteps').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-goto]');
    if (b && !b.disabled) go(Number(b.dataset.goto), { push: true });
  });

  $('flowBack').addEventListener('click', function () { go(state.step - 1, { push: true }); });
  $('flowNext').addEventListener('click', next);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !flowOpen) return;
    if (!$('grView').hidden) closeGreetingView(); else { if (state.step === 4) resetAfterOrder(); closeFlow(); }
  });

  function renderBar() {
    var bar = $('flowBar'), nextBtn = $('flowNext'), back = $('flowBack');
    var p = HH.product(state.product);
    bar.hidden = state.step === 4 || (state.step === 1 && !p);
    back.hidden = state.step === 1;
    nextBtn.disabled = false;
    if (state.step === 1 && p) nextBtn.textContent = 'Videre med ' + p.name + ' →';
    if (state.step === 2) nextBtn.textContent = 'Videre →';
    if (state.step === 3) nextBtn.textContent = cfg.paymentEnabled ? 'Betal ' + price : 'Betal ' + price + ' (demo)';
  }

  function next() {
    if (state.step === 1) return go(2, { push: true });
    if (state.step === 2) { if (validate2()) go(3, { push: true }); return; }
    if (state.step === 3) { if (validate3()) pay(); }
  }

  // ---------- Steg 1 ----------
  function renderPick() {
    document.querySelectorAll('.pick-card').forEach(function (c) {
      c.setAttribute('aria-checked', String(c.dataset.pick === state.product));
    });
  }

  // ---------- Steg 2 ----------
  function renderPreview() {
    var p = HH.product(state.product);
    $('preview').innerHTML =
      HH.hamsterFigure(p, state.embroidery) +
      '<p class="preview-cap"><b>' + p.nameHtml + '</b><button type="button" class="link" data-goto-pick>Bytt hamster</button></p>';
  }
  $('preview').addEventListener('click', function (e) {
    if (e.target.closest('[data-goto-pick]')) go(1, { push: true });
  });

  function renderStep2() {
    renderPreview();
    $('emb').value = state.embroidery;
    $('greetText').value = state.greetText;
    $('senderName').value = state.senderName;
    $('gtTekst').checked = state.greetType === 'tekst';
    $('gtLyd').checked = state.greetType === 'lyd';
    $('gtVideo').checked = state.greetType === 'video';
    $('revealYes').checked = state.reveal;
    $('revealNo').checked = !state.reveal;
    syncStep2();
    renderMedia('lyd'); renderMedia('video');
  }

  function syncStep2() {
    var n = HH.chars(state.embroidery).length;
    $('embCount').textContent = n + '/' + cfg.embroideryMax;
    $('embCount').classList.toggle('is-full', n >= cfg.embroideryMax);
    $('greetCount').textContent = HH.chars(state.greetText).length + '/' + cfg.greetingTextMax;
    $('panelTekst').hidden = state.greetType !== 'tekst';
    $('panelLyd').hidden = state.greetType !== 'lyd';
    $('panelVideo').hidden = state.greetType !== 'video';
    $('panelSender').hidden = !state.reveal;
    $('revealHelp').firstElementChild.textContent = state.reveal
      ? 'Navnet vises først når mottakeren trykker «Hvem sendte den?».'
      : 'Mottakeren får bare vite at noen står bak. Vi lagrer ikke navnet ditt på hilsenen.';
    document.querySelectorAll('#embChips .chip').forEach(function (c) {
      c.classList.toggle('is-on', c.dataset.chip === state.embroidery);
    });
  }

  function setEmbroidery(value, fromInput) {
    var clamped = HH.clampChars(value, cfg.embroideryMax);
    state.embroidery = clamped;
    if (!fromInput || clamped !== value) $('emb').value = clamped;
    var stitch = $('preview').querySelector('[data-stitch]');
    if (stitch) {
      stitch.textContent = clamped;
      stitch.hidden = !clamped;
      stitch.style.setProperty('--fs', HH.stitchSize(HH.product(state.product), clamped));
    }
    clearErr('emb');
    syncStep2(); save();
  }
  $('emb').addEventListener('input', function (e) { setEmbroidery(e.target.value, true); });
  $('embChips').addEventListener('click', function (e) {
    var c = e.target.closest('[data-chip]');
    if (c) setEmbroidery(c.dataset.chip, false);
  });

  $('greetText').addEventListener('input', function (e) {
    var v = e.target.value, c = HH.chars(v);
    if (c.length > cfg.greetingTextMax) { v = c.slice(0, cfg.greetingTextMax).join(''); e.target.value = v; }
    state.greetText = v; syncStep2(); save();
  });
  $('greetSeg').addEventListener('change', function (e) {
    state.greetType = e.target.value;
    clearErr('media', 'mediaErr');
    HH.store.saveDraftMedia(media[state.greetType] || null);
    syncStep2(); save();
  });
  $('revealYes').addEventListener('change', function () { state.reveal = true; syncStep2(); save(); $('senderName').focus(); });
  $('revealNo').addEventListener('change', function () { state.reveal = false; clearErr('senderName', 'senderErr'); syncStep2(); save(); });
  $('senderName').addEventListener('input', function (e) { state.senderName = e.target.value; clearErr('senderName', 'senderErr'); save(); });

  // Lyd / video
  function onFile(kind, input) {
    var file = input.files && input.files[0];
    input.value = '';
    if (!file) return;
    var max = kind === 'lyd' ? cfg.audioMaxBytes : cfg.videoMaxBytes;
    var okType = file.type.indexOf(kind === 'lyd' ? 'audio/' : 'video/') === 0;
    if (!okType) return showErr(null, 'mediaErr', kind === 'lyd' ? 'Det der er ikke en lydfil. Prøv en annen.' : 'Det der er ikke en video. Prøv en annen.');
    if (file.size > max) return showErr(null, 'mediaErr', 'Filen er for stor (' + mb(file.size) + '). Maks er ' + mb(max) + '.');
    clearErr(null, 'mediaErr');
    media[kind] = file;
    HH.store.saveDraftMedia(file);
    renderMedia(kind);
  }
  function mb(bytes) {
    if (bytes < 104858) return Math.max(1, Math.round(bytes / 1024)) + ' kB';
    return (bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0).replace('.', ',') + ' MB';
  }

  function renderMedia(kind) {
    var box = $(kind === 'lyd' ? 'audioPreview' : 'videoPreview');
    var file = media[kind];
    if (mediaUrls[kind]) { URL.revokeObjectURL(mediaUrls[kind]); mediaUrls[kind] = ''; }
    box.hidden = !file;
    if (!file) { box.innerHTML = ''; return; }
    mediaUrls[kind] = URL.createObjectURL(file);
    var player = kind === 'lyd'
      ? '<audio controls preload="metadata" src="' + mediaUrls[kind] + '"></audio>'
      : '<video controls playsinline preload="metadata" src="' + mediaUrls[kind] + '"></video>';
    box.innerHTML = player +
      '<p class="media-meta"><span>' + esc(file.name || 'Opptak') + ' · ' + mb(file.size) + '</span>' +
      '<button type="button" class="link" data-remove-media="' + kind + '">Fjern</button></p>';
  }
  $('audioFile').addEventListener('change', function (e) { onFile('lyd', e.target); });

  // Opptak direkte i nettleseren (lyd). Virker ikke overalt; da brukes filvalget.
  var rec = null, recTimer = null, recStarted = 0;
  function recLabel() {
    var left = Math.max(0, cfg.audioMaxSeconds - Math.floor((Date.now() - recStarted) / 1000));
    $('recBtn').textContent = 'Stopp opptak (' + left + ' s igjen)';
    if (left <= 0) stopRec();
  }
  function stopRec() {
    clearInterval(recTimer); recTimer = null;
    if (rec && rec.state !== 'inactive') rec.stop();
  }
  $('recBtn').addEventListener('click', function () {
    if (rec && rec.state === 'recording') { stopRec(); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      return showErr(null, 'mediaErr', 'Opptak støttes ikke her. Velg en lydfil i stedet.');
    }
    clearErr(null, 'mediaErr');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var chunks = [];
      rec = new MediaRecorder(stream);
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        $('recBtn').textContent = 'Ta opp på nytt';
        $('recBtn').classList.remove('is-rec');
        if (!chunks.length) return;
        var type = rec.mimeType || 'audio/webm';
        var file = new File(chunks, 'opptak.' + (type.indexOf('mp4') > -1 ? 'm4a' : 'webm'), { type: type });
        media.lyd = file; HH.store.saveDraftMedia(file); renderMedia('lyd');
      };
      rec.start();
      recStarted = Date.now();
      $('recBtn').classList.add('is-rec');
      recLabel(); recTimer = setInterval(recLabel, 500);
    }).catch(function () {
      showErr(null, 'mediaErr', 'Fikk ikke tilgang til mikrofonen. Gi tillatelse, eller velg en lydfil i stedet.');
    });
  });
  $('videoFile').addEventListener('change', function (e) { onFile('video', e.target); });
  $('form2').addEventListener('click', function (e) {
    var r = e.target.closest('[data-remove-media]');
    if (!r) return;
    media[r.dataset.removeMedia] = null;
    HH.store.saveDraftMedia(null);
    renderMedia(r.dataset.removeMedia);
  });
  $('form2').addEventListener('submit', function (e) { e.preventDefault(); next(); });
  $('form3').addEventListener('submit', function (e) { e.preventDefault(); next(); });

  // ---------- Validering ----------
  function showErr(inputId, errId, msg) {
    var err = $(errId); err.textContent = msg; err.hidden = false;
    if (inputId) $(inputId).setAttribute('aria-invalid', 'true');
    return false;
  }
  function clearErr(inputId, errId) {
    var err = $(errId || inputId + 'Err'); if (err) { err.hidden = true; err.textContent = ''; }
    if (inputId && $(inputId)) $(inputId).removeAttribute('aria-invalid');
  }
  function focusFirstInvalid(form) {
    var el = form.querySelector('[aria-invalid="true"]') || form.querySelector('.err:not([hidden])');
    if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); if (el.focus) el.focus({ preventScroll: true }); }
  }

  function validate2() {
    var ok = true;
    state.embroidery = state.embroidery.trim();
    state.senderName = state.senderName.trim();
    if (!state.embroidery) ok = showErr('emb', 'embErr', 'Magen er tom. Skriv noe, eller velg et forslag.');
    if (state.greetType !== 'tekst' && !media[state.greetType]) {
      ok = showErr(null, 'mediaErr', state.greetType === 'lyd'
        ? 'Lydhilsen uten lyd. Ta opp noe, eller bytt til tekst.'
        : 'Videohilsen uten video. Legg ved en, eller bytt til tekst.');
    }
    if (state.reveal && !state.senderName) ok = showErr('senderName', 'senderErr', 'Skriv navnet mottakeren skal få se, eller velg å være hemmelig.');
    save();
    if (!ok) focusFirstInvalid($('form2'));
    return ok;
  }

  var fields3 = [
    ['toName', function (v) { return v ? '' : 'Hvem skal få hamsteren? Skriv navnet.'; }],
    ['toAddress', function (v) { return v ? '' : 'Vi trenger en gateadresse å sende den til.'; }],
    ['toZip', function (v) { return /^\d{4}$/.test(v) ? '' : 'Fire sifre.'; }],
    ['toCity', function (v) { return v ? '' : 'Skriv poststedet.'; }],
    ['email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Skriv e-postadressen din, så du får kvittering.'; }]
  ];
  fields3.forEach(function (f) {
    $(f[0]).addEventListener('input', function (e) {
      var v = e.target.value;
      if (f[0] === 'toZip') { v = v.replace(/\D/g, '').slice(0, 4); e.target.value = v; }
      state[f[0]] = v; clearErr(f[0]); save();
    });
  });
  function validate3() {
    var ok = true;
    fields3.forEach(function (f) {
      state[f[0]] = String(state[f[0]] || '').trim();
      var msg = f[1](state[f[0]]);
      if (msg) ok = showErr(f[0], f[0] + 'Err', msg); else clearErr(f[0]);
    });
    save();
    if (!ok) focusFirstInvalid($('form3'));
    return ok;
  }

  // ---------- Steg 3 ----------
  function greetLabel() {
    if (state.greetType === 'lyd') return 'Lydhilsen';
    if (state.greetType === 'video') return 'Videohilsen';
    return state.greetText.trim() ? 'Teksthilsen' : 'Teksthilsen (vi skriver noe vagt)';
  }
  function renderStep3() {
    var p = HH.product(state.product);
    fields3.forEach(function (f) { $(f[0]).value = state[f[0]]; });
    $('summary').innerHTML =
      '<h3 class="summary-title">Bestillingen din</h3>' +
      '<div class="summary-top">' + HH.hamsterFigure(p, state.embroidery, { cls: 'summary-fig' }) +
        '<div><p class="summary-name">' + p.nameHtml + '</p><p class="summary-line">' + esc(p.line) + '</p></div></div>' +
      '<dl class="summary-list">' +
        row('Brodering', '«' + esc(state.embroidery) + '»', 2) +
        row('QR-hilsen', esc(greetLabel()), 2) +
        row('Avsender', state.reveal ? 'Avsløres: ' + esc(state.senderName) : 'Hemmelig', 2) +
      '</dl>' +
      '<dl class="summary-list summary-sum">' +
        '<div><dt>Hamster, brodering og hilsen</dt><dd>' + price + '</dd></div>' +
        '<div><dt>Frakt i Norge</dt><dd>Ikke fastsatt</dd></div>' +
        '<div class="summary-total"><dt>Å betale</dt><dd>' + price + '</dd></div>' +
      '</dl>' +
      (cfg.priceIsPlaceholder ? '<p class="fineprint">Konseptpris. Endelig pris og frakt settes før butikken åpner.</p>' : '');
    $('payNote').textContent = cfg.paymentEnabled ? '' :
      'Demo: Knappen trekker ingen penger og sender ingen hamster. Du får se bekreftelsen og hilsenen.';
    $('payNote').hidden = cfg.paymentEnabled;
  }
  function row(label, value, goto) {
    return '<div><dt>' + label + '</dt><dd>' + value + ' <button type="button" class="link" data-edit="' + goto + '">Endre</button></dd></div>';
  }
  $('summary').addEventListener('click', function (e) {
    var b = e.target.closest('[data-edit]');
    if (b) go(Number(b.dataset.edit), { push: true });
  });

  // ---------- Betaling (demo) ----------
  function pay() {
    var btn = $('flowNext');
    btn.disabled = true;
    if (cfg.paymentEnabled) {
      // Her kobles Vipps/Stripe på: opprett ordrekladd på server, send kunden til betaling,
      // og vis bekreftelsen først når betalingen er bekreftet av betalingsleverandøren.
      btn.disabled = false;
      $('payNote').hidden = false;
      $('payNote').textContent = 'Betalingsløsningen er ikke konfigurert.';
      return;
    }
    btn.textContent = 'Lager bestillingen …';
    HH.store.createOrder(state, media[state.greetType] || null).then(function (res) {
      lastOrder = res;
      renderDone();
      go(4, { keepFocus: true });
      HH.store.clearDraft();
      var t = document.querySelector('.done-title'); if (t) t.focus({ preventScroll: true });
    }).catch(function () {
      btn.disabled = false; renderBar();
      $('payNote').hidden = false;
      $('payNote').textContent = 'Noe gikk galt da bestillingen skulle lagres. Det du har fylt ut er trygt. Prøv en gang til.';
    });
  }

  function drawQr(canvas, text) {
    var qr = qrcode(0, 'M'); qr.addData(text); qr.make();
    var n = qr.getModuleCount(), quiet = 3, scale = Math.max(4, Math.floor(480 / (n + quiet * 2)));
    var size = (n + quiet * 2) * scale;
    canvas.width = canvas.height = size;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#171717';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      if (qr.isDark(r, c)) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
    }
  }

  function renderDone() {
    var o = lastOrder.order, g = lastOrder.greeting, p = HH.product(o.productId);
    var url = HH.store.greetingUrl(g.token);
    $('done').innerHTML =
      '<p class="eyebrow">' + (cfg.demo ? 'Demo-bestilling ' : 'Bestilling ') + esc(o.id) + '</p>' +
      '<h2 class="done-title" tabindex="-1">' + (cfg.demo ? 'SLIK BLIR DET.' : 'DEN ER PÅ VEI.') + '</h2>' +
      '<p class="done-lead">' + (cfg.demo
        ? 'Ingen penger er trukket, og ingen hamster er sendt. Når butikken åpner, går ' + esc(p.name) + ' til ' + esc(o.recipient.name) + ' med denne QR-koden rundt halsen.'
        : esc(p.name) + ' sendes til ' + esc(o.recipient.name) + '. Kvittering kommer på e-post.') + '</p>' +
      '<div class="done-grid">' +
        '<div class="tag">' +
          '<span class="tag-hole" aria-hidden="true"></span>' +
          '<canvas id="qrCanvas" role="img" aria-label="QR-kode til den private hilsenen"></canvas>' +
          '<p class="tag-text">Skann meg.<br>Jeg kan forklare.</p>' +
        '</div>' +
        '<div class="done-side">' +
          HH.hamsterFigure(p, o.embroidery, { cls: 'done-fig' }) +
          '<a class="btn btn-blaa btn-big" id="openGreeting" href="' + esc(url) + '" target="_blank" rel="noopener">Se hilsenen som mottakeren</a>' +
          '<button class="btn" type="button" id="shareBtn">Vis noen hva du har gjort</button>' +
          '<p class="fineprint" id="shareStatus" role="status" hidden></p>' +
          '<button class="btn btn-ghost" type="button" id="oneMore">Send en hamster til</button>' +
        '</div>' +
      '</div>' +
      '<p class="fineprint">Lenken bak QR-koden er tilfeldig og kan ikke gjettes. Bare den som har hamsteren i hånda kommer inn.' +
        (cfg.demo ? ' I demoen ligger hilsenen kun i denne nettleseren.' : '') + '</p>';
    drawQr($('qrCanvas'), url);
    $('openGreeting').addEventListener('click', function (e) {
      // Vis i et mobilstort vindu oppå butikken. Den ekte QR-lenken går til hilsen.html.
      e.preventDefault();
      openGreetingView(g.token);
    });
    $('oneMore').addEventListener('click', function () { resetAfterOrder(); go(1, { push: true }); });
    $('shareBtn').addEventListener('click', function () {
      // Deler butikken, aldri den private hilsenlenken.
      var shopUrl = cfg.shopUrl, status = $('shareStatus');
      var copied = function () { status.hidden = false; status.textContent = 'Lenken er kopiert: ' + shopUrl; };
      var manual = function () { status.hidden = false; status.textContent = 'Del denne: ' + shopUrl; };
      if (navigator.share) {
        navigator.share({ title: 'Ingen ba om dette.', text: 'Jeg har sendt noen en stygg, heklet hamster.', url: shopUrl }).catch(function (err) {
          if (err && err.name === 'AbortError') return;
          if (navigator.clipboard) navigator.clipboard.writeText(shopUrl).then(copied, manual); else manual();
        });
      } else if (navigator.clipboard) { navigator.clipboard.writeText(shopUrl).then(copied, manual); } else { manual(); }
    });
  }

  function resetAfterOrder() {
    lastOrder = null;
    state = blank();
    media = { lyd: null, video: null };
    ['lyd', 'video'].forEach(renderMedia);
    HH.store.clearDraft();
    updateResume();
  }

  // ---------- «Se som mottaker» ----------
  function openGreetingView(token) {
    HH.store.getGreeting(token).then(function (data) {
      $('grView').hidden = false;
      $('flow').setAttribute('inert', '');
      HH.renderGreeting($('grViewBody'), data, { onHome: closeGreetingView });
      $('grViewClose').focus();
    });
  }
  function closeGreetingView() {
    $('grView').hidden = true;
    $('grViewBody').innerHTML = '';
    $('flow').removeAttribute('inert');
    var b = $('openGreeting'); if (b) b.focus();
  }
  $('grViewClose').addEventListener('click', closeGreetingView);

  updateResume();
})();
