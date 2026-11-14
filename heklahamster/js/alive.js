/* Heklahamster – litt liv i hamsterne. Hører sammen med css/alive.css.
   Ren pynt: skriptet hekter seg på via hendelser på document og en MutationObserver,
   og rører ikke tilstanden i app.js. Uten dette skriptet virker alt som før.
   Ingenting her går i løkke når ingenting skjer på skjermen. */
'use strict';
(function () {
  if (!window.HH || !HH.config || !document.querySelector) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function still() { return mq.matches; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------- Skjevehamsterens øyne ----------
     Piksler i originalbildet (800 × 1000). x, y, r = den påsydde pupillen; cx, cy = midten av
     øyehviten; reach = hvor langt pupillen kan flytte seg fra midten; sx, sy, pr = hvor vi henter
     hvitt garn til å dekke den gamle pupillen; lift = hvor mye lappen lysnes (garnet er hentet
     fra skyggesiden); lag = hvor fort øyet henger med. Øynene er med vilje ikke i takt. */
  var EYES = [
    { x: 247, y: 299, r: 18, cx: 276, cy: 300, reach: 27, sx: 292, sy: 304, pr: 25, lift: 0.06, lag: '.16s' },
    { x: 511, y: 188, r: 24, cx: 481, cy: 201, reach: 33, sx: 454, sy: 214, pr: 34, lift: 0.24, lag: '.42s' }
  ];
  var skjevSrc = HH.config.img('skjev');
  var skjevFigs = [];          // { fig, pupils: [el, el] }
  var patchStyleDone = false;

  function addEyes(fig, body) {
    if (!patchStyleDone) {
      // Én felles regel, så bildet (som kan være en lang data-URI) ikke kopieres per figur.
      var st = document.createElement('style');
      st.textContent = '.al-patch{background-image:linear-gradient(rgba(255,255,255,var(--lys,0)),rgba(255,255,255,var(--lys,0))),url("' + skjevSrc + '")}';
      document.head.appendChild(st);
      patchStyleDone = true;
    }
    var pupils = EYES.map(function (e) {
      var patch = document.createElement('span');
      patch.className = 'al-patch';
      patch.setAttribute('aria-hidden', 'true');
      patch.style.cssText = '--x:' + e.x + ';--y:' + e.y + ';--r:' + e.pr + ';--sx:' + e.sx + ';--sy:' + e.sy + ';--lys:' + e.lift;
      var pupil = document.createElement('span');
      pupil.className = 'al-pupil';
      pupil.setAttribute('aria-hidden', 'true');
      pupil.style.cssText = '--x:' + e.x + ';--y:' + e.y + ';--r:' + e.r + ';--pt:' + e.lag;
      body.appendChild(patch);
      body.appendChild(pupil);
      return pupil;
    });
    skjevFigs.push({ fig: fig, pupils: pupils });
  }

  /* Flytter én pupill mot et punkt (i bildepiksler). Langt unna = helt ut i kanten av øyet. */
  function aim(pupil, e, tx, ty) {
    var dx = tx - e.cx, dy = ty - e.cy;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    var m = e.reach * Math.min(1, d / 220);
    pupil.style.setProperty('--px', (e.cx + dx / d * m - e.x).toFixed(1));
    pupil.style.setProperty('--py', (e.cy + dy / d * m - e.y).toFixed(1));
  }
  function visibleSkjev() {
    skjevFigs = skjevFigs.filter(function (s) { return s.fig.isConnected; });
    return skjevFigs.filter(function (s) { return s.fig.classList.contains('al-on'); });
  }

  var ptr = null, ptrQueued = false, lastPtr = 0;
  function onPointer(ev) {
    ptr = { x: ev.clientX, y: ev.clientY };
    lastPtr = Date.now();
    if (ptrQueued || still()) return;
    ptrQueued = true;
    requestAnimationFrame(function () {
      ptrQueued = false;
      visibleSkjev().forEach(function (s) {
        var b = s.fig.getBoundingClientRect();
        if (!b.width) return;
        var k = 800 / b.width;
        s.pupils.forEach(function (p, i) { aim(p, EYES[i], (ptr.x - b.left) * k, (ptr.y - b.top) * k); });
      });
    });
  }
  document.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('pointerdown', onPointer, { passive: true });

  /* ---------- Pakk inn figurene ---------- */
  var io = window.IntersectionObserver ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { en.target.classList.toggle('al-on', en.isIntersecting); });
    schedule();
  }) : null;

  function enhance(fig) {
    fig.setAttribute('data-al', '');
    var img = fig.querySelector('img');
    if (!img || still()) return;
    var body = document.createElement('span');
    body.className = 'al-body';
    while (fig.firstChild) body.appendChild(fig.firstChild);   // bilde + brodering flyttes samlet
    fig.appendChild(body);
    fig.style.setProperty('--al-dur', rnd(7, 10.5).toFixed(1) + 's');
    fig.style.setProperty('--al-delay', (-rnd(0, 9)).toFixed(1) + 's');
    if (img.getAttribute('src') === skjevSrc) addEyes(fig, body);
    if (io) io.observe(fig); else fig.classList.add('al-on');
  }

  /* Spiller en engangseffekt (boing, squish, hop) på en figur. */
  function fx(fig, name) {
    if (!fig || still()) return;
    ['boing', 'squish', 'hop', 'twitch-a', 'twitch-b'].forEach(function (n) { fig.classList.remove('al-fx-' + n); });
    void fig.offsetWidth;        // start på nytt selv om samme effekt nettopp gikk
    fig.classList.add('al-fx-' + name);
  }
  document.addEventListener('animationend', function (e) {
    var n = e.animationName;
    if (n === 'al-stamp') { e.target.remove(); return; }
    if (n === 'al-boing' || n === 'al-squish' || n === 'al-hop') {
      var fig = e.target.closest && e.target.closest('.hamster');
      if (fig) fig.classList.remove('al-fx-boing', 'al-fx-squish', 'al-fx-hop');
    }
  });

  /* Trykk på en hamster: den klemmes sammen. */
  document.addEventListener('pointerdown', function (e) {
    var fig = e.target.closest && e.target.closest('.hamster');
    if (fig) fx(fig, 'squish');
  }, { passive: true });

  /* ---------- Av seg selv: et hopp og et sideblikk i ny og ne ----------
     Én tidtaker som bare går mens minst én hamster er synlig og fanen er framme. */
  var timer = 0;
  function schedule() {
    var any = !still() && !document.hidden && document.querySelector('.hamster.al-on');
    if (!any) { clearTimeout(timer); timer = 0; return; }
    if (!timer) timer = setTimeout(tick, rnd(2600, 5200));
  }
  function tick() {
    timer = 0;
    var on = document.querySelectorAll('.hamster.al-on');
    if (on.length && Math.random() < 0.6) fx(on[Math.floor(Math.random() * on.length)], 'hop');
    // Øynene vandrer hver for seg når pekeren har ligget i ro (alltid på mobil).
    if (Date.now() - lastPtr > 2500) {
      visibleSkjev().forEach(function (s) {
        s.pupils.forEach(function (p, i) {
          if (Math.random() < 0.3) return;
          var e = EYES[i];
          if (Math.random() < 0.3) aim(p, e, e.x + (e.x - e.cx) * 9, e.y + (e.y - e.cy) * 9);   // tilbake til skjeling
          else aim(p, e, e.cx + rnd(-300, 300), e.cy + rnd(-300, 300));
        });
      });
    }
    schedule();
  }
  document.addEventListener('visibilitychange', schedule);

  /* ---------- Brodering: rykk per tastetrykk, og nye bokstaver sys på ---------- */
  var prevEmb = null, flip = false;
  function sew() {
    var stitch = document.querySelector('#preview [data-stitch]');
    if (!stitch) return;
    var text = stitch.textContent, old = prevEmb == null ? text : prevEmb;
    prevEmb = text;
    if (still() || text === old) return;
    flip = !flip;
    fx(stitch.closest('.hamster'), flip ? 'twitch-a' : 'twitch-b');
    var chars = HH.chars(text), oldChars = HH.chars(old), from = 0;
    while (from < chars.length && from < oldChars.length && chars[from] === oldChars[from]) from++;
    if (from >= chars.length) return;                 // bare sletting: ingenting nytt å sy
    // Vanlige (inline) span-er endrer ikke linjebrytingen, og textContent er uendret.
    stitch.textContent = chars.slice(0, from).join('');
    chars.slice(from).forEach(function (c, i) {
      var s = document.createElement('span');
      s.className = 'al-sy';
      s.style.setProperty('--i', i);
      s.textContent = c;
      stitch.appendChild(s);
    });
  }
  document.addEventListener('focusin', function (e) {
    if (e.target.id === 'emb') prevEmb = e.target.value;
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'emb') sew(); });

  /* ---------- Klikk: valg av hamster, forslag, åpne hilsen ---------- */
  var STAMPS = ['Modig valg.', 'Notert. Dessverre.', 'Den, ja.', 'Godkjent. Motvillig.', 'Ditt ansvar.'];
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    if (t.closest('[data-chip]')) { sew(); return; }
    if (t.closest('#grOpen')) { yarn(9); return; }
    if (t.closest('[data-pick]')) {
      prevEmb = null;
      // app.js har allerede byttet til steg 2 (lytteren dens er registrert først). Stempelet
      // legges oppå forhåndsvisningen og forsinker ingenting.
      requestAnimationFrame(function () {
        var fig = document.querySelector('#preview .hamster');
        if (!fig || still() || !fig.offsetWidth) return;
        fx(fig, 'boing');
        var old = fig.querySelector('.al-stamp'); if (old) old.remove();
        var s = document.createElement('span');
        s.className = 'al-stamp pen';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = STAMPS[Math.floor(Math.random() * STAMPS.length)];
        fig.appendChild(s);
      });
    }
  });

  /* ---------- Garnnøster (lerret) ----------
     Nøster i merkefargene kastes opp fra bunnen med en trådstump etter seg, og faller ned igjen.
     Løkka stopper og lerretet fjernes når det siste nøstet er ute av bildet. */
  var COLORS = ['#f7e83d', '#ff8db7', '#314ee8', '#ffffff'];
  var yarnOn = false;
  function yarn(count) {
    if (still() || yarnOn) return;
    var c = document.createElement('canvas');
    var ctx = c.getContext && c.getContext('2d');
    if (!ctx) return;
    yarnOn = true;
    var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.className = 'al-canvas';
    c.setAttribute('aria-hidden', 'true');
    c.width = W * dpr; c.height = H * dpr;
    document.body.appendChild(c);
    ctx.scale(dpr, dpr);
    var G = 1700, balls = [];
    for (var i = 0; i < count; i++) {
      var r = rnd(11, 21), top = rnd(0.35, 0.9) * H;
      balls.push({ x: rnd(0.08, 0.92) * W, y: H + r + 4, r: r, vx: rnd(-110, 110), vy: -Math.sqrt(2 * G * top),
                   a: rnd(0, 6), va: rnd(-5, 5), wait: rnd(0, 0.35), col: COLORS[i % COLORS.length], trail: [] });
    }
    var last = 0, age = 0;
    function frame(now) {
      var dt = last ? Math.min(0.033, (now - last) / 1000) : 0.016;
      last = now; age += dt;
      ctx.clearRect(0, 0, W, H);
      var alive = false;
      balls.forEach(function (b) {
        if (age < b.wait) { alive = true; return; }
        b.vy += G * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
        b.trail.push(b.x, b.y);
        if (b.trail.length > 28) b.trail.splice(0, 2);
        if (b.y < H + b.r + 60 || b.vy < 0) alive = true;
        // Tråden
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        for (var k = 0; k < b.trail.length; k += 2) {
          var wob = Math.sin(k * 0.9 + b.a) * 3;
          if (k) ctx.lineTo(b.trail[k] + wob, b.trail[k + 1]); else ctx.moveTo(b.trail[k] + wob, b.trail[k + 1]);
        }
        ctx.strokeStyle = '#171717'; ctx.lineWidth = 4.5; ctx.stroke();
        ctx.strokeStyle = b.col; ctx.lineWidth = 2.5; ctx.stroke();
        // Hard skygge, nøste og garnviklinger
        ctx.fillStyle = '#171717';
        ctx.beginPath(); ctx.arc(b.x + 3, b.y + 3, b.r, 0, 6.2832); ctx.fill();
        ctx.fillStyle = b.col; ctx.strokeStyle = '#171717'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.2832); ctx.fill(); ctx.stroke();
        ctx.save();
        ctx.translate(b.x, b.y); ctx.rotate(b.a);
        ctx.beginPath(); ctx.arc(0, 0, b.r - 1, 0, 6.2832); ctx.clip();
        ctx.lineWidth = 1.5;
        for (var j = -1; j <= 1; j++) {
          ctx.beginPath(); ctx.ellipse(j * b.r * 0.42, 0, b.r * 0.9, b.r * 1.5, 0.5, 0, 6.2832); ctx.stroke();
        }
        ctx.restore();
      });
      if (alive && age < 5 && !still()) requestAnimationFrame(frame);
      else { c.remove(); yarnOn = false; }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Følg med på nye figurer og på bekreftelsen ---------- */
  var scanQueued = false;
  function scan() {
    scanQueued = false;
    var figs = document.querySelectorAll('figure.hamster:not([data-al])');
    for (var i = 0; i < figs.length; i++) enhance(figs[i]);
    var tag = document.querySelector('#done .tag:not([data-al])');
    if (tag) {
      tag.setAttribute('data-al', '');
      var step = tag.closest('.fstep');
      if (step && !step.hidden) yarn(window.innerWidth < 700 ? 13 : 20);
    }
    schedule();
  }
  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    Promise.resolve().then(scan);
  }
  if (window.MutationObserver) new MutationObserver(queueScan).observe(document.body, { childList: true, subtree: true });
  scan();
})();
