/* Heklahamster – 3D-visning av hamsteren i steg 2.
   Modellene (assets/3d/*.glb) er laget med Meshy fra konseptbildene. Visningen bruker
   <model-viewer> og lastes først når kunden kommer til steg 2. Uten WebGL vises bare bildet. */
'use strict';
(function () {
  var cfg = HH.config;
  var libPromise = null;
  var userMode = null;        // 'foto' | '3d' når kunden selv har valgt
  var current = null;         // { root, product, viewer, spot, timer }
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function webgl() {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch (e) { return false; }
  }
  function loadLib() {
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      if (window.customElements && customElements.get('model-viewer')) return resolve();
      var s = document.createElement('script');
      s.src = cfg.modelViewerSrc;
      s.onload = function () { resolve(); };
      s.onerror = function () { libPromise = null; reject(new Error('3D-visningen kunne ikke lastes')); };
      document.head.appendChild(s);
    });
    return libPromise;
  }

  function setMode(mode) {
    if (!current) return;
    var show3d = mode === '3d' && current.ready;
    current.root.querySelector('.hamster').hidden = show3d;
    current.box.hidden = !show3d;
    current.root.querySelectorAll('[data-pv]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.pv === (show3d ? '3d' : 'foto')));
    });
    sway(show3d);
  }

  // Hamsteren vugger sakte fra side til side til kunden tar tak i den.
  function sway(on) {
    if (!current) return;
    clearInterval(current.timer); current.timer = null;
    if (!on || reduced || !current.viewer) return;
    var dir = 1, v = current.viewer;
    var tick = function () {
      if (current && current.viewer === v && Date.now() > (current.holdUntil || 0)) {
        v.cameraOrbit = (dir * 22) + 'deg 78deg 105%'; dir = -dir;
      }
    };
    tick(); current.timer = setInterval(tick, 2600);
  }

  function setText(text) {
    if (!current || !current.spot) return;
    current.spot.textContent = text || '';
    current.spot.style.setProperty('--fs', HH.stitchSize(current.product, text));
    current.spot.style.setProperty('--w', current.product.belly.w);
    current.spot.style.visibility = text ? '' : 'hidden';
  }

  /* Legges inn i forhåndsvisningen etter at bildet er tegnet. */
  function mount(root, product, text) {
    if (current) { clearInterval(current.timer); }
    current = null;
    if (!product.model || !webgl()) return;

    var fig = root.querySelector('.hamster');
    var box = document.createElement('div');
    box.className = 'pv3d tint-' + product.tint;
    box.hidden = true;
    fig.insertAdjacentElement('afterend', box);

    var toggle = document.createElement('div');
    toggle.className = 'pv-toggle';
    toggle.setAttribute('role', 'group');
    toggle.setAttribute('aria-label', 'Visning');
    toggle.innerHTML =
      '<button type="button" data-pv="foto" aria-pressed="true">Bilde</button>' +
      '<button type="button" data-pv="3d" aria-pressed="false">Snurr i 3D</button>';
    root.appendChild(toggle);

    var me = current = { root: root, product: product, box: box, ready: false, viewer: null, spot: null, timer: null };
    toggle.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pv]'); if (!b) return;
      userMode = b.dataset.pv;
      if (userMode === '3d' && !me.ready) { b.textContent = 'Laster 3D …'; return; }
      setMode(userMode);
    });

    loadLib().then(function () {
      if (current !== me) return;
      var v = document.createElement('model-viewer');
      v.setAttribute('src', cfg.model(product.id));
      v.setAttribute('alt', product.name + ' i 3D. Dra for å snu den.');
      v.setAttribute('camera-controls', '');
      v.setAttribute('disable-zoom', '');
      v.setAttribute('disable-pan', '');
      v.setAttribute('touch-action', 'pan-y');
      v.setAttribute('interaction-prompt', 'none');
      v.setAttribute('camera-orbit', '0deg 78deg 105%');
      v.setAttribute('min-camera-orbit', 'auto 60deg auto');
      v.setAttribute('max-camera-orbit', 'auto 95deg auto');
      v.setAttribute('interpolation-decay', '260');
      v.setAttribute('shadow-intensity', '0.9');
      v.setAttribute('shadow-softness', '0.9');
      v.setAttribute('exposure', '1.05');
      v.setAttribute('loading', 'eager');
      var spot = document.createElement('div');
      spot.className = 'stitch3d';
      spot.slot = 'hotspot-mage';
      spot.dataset.position = product.model.pos;
      spot.dataset.normal = product.model.normal;
      spot.dataset.visibilityAttribute = 'visible';   // biblioteket setter da data-visible når magen vender mot oss
      v.appendChild(spot);
      me.viewer = v; me.spot = spot;
      setText(text);
      v.addEventListener('camera-change', function (e) {
        if (e.detail && e.detail.source === 'user-interaction') me.holdUntil = Date.now() + 8000;
      });
      v.addEventListener('load', function () {
        if (current !== me) return;
        me.ready = true;
        var b3 = toggle.querySelector('[data-pv="3d"]'); b3.textContent = 'Snurr i 3D';
        setMode(userMode || '3d');
      });
      v.addEventListener('error', function () { toggle.hidden = true; });
      box.appendChild(v);
    }).catch(function () { toggle.hidden = true; });
  }

  HH.view3d = { mount: mount, setText: setText };
})();
