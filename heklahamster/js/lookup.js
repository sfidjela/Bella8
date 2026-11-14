/* Heklahamster – adresseoppslag.
   Bruker Kartverkets åpne adresseregister (ws.geonorge.no, gratis, ingen nøkkel).
   Feiler oppslaget, skjer ingenting: kunden kan alltid skrive adressen selv. */
'use strict';
(function () {
  var cfg = HH.config, esc = HH.esc;

  function search(params) {
    if (!cfg.addressApi || !window.fetch) return Promise.resolve([]);
    var qs = Object.keys(params).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    return fetch(cfg.addressApi + '?' + qs, { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : { adresser: [] }; })
      .then(function (d) { return (d && d.adresser) || []; })
      .catch(function () { return []; });
  }

  function title(s) {   // «OSLO» → «Oslo», «NORDRE FOLLO» → «Nordre Follo»
    return String(s || '').toLowerCase().replace(/(^|[\s-])([a-zæøå])/g, function (m, a, b) { return a + b.toUpperCase(); });
  }

  /* Poststed fra postnummer. */
  HH.postalLookup = function (zip) {
    if (!/^\d{4}$/.test(zip)) return Promise.resolve('');
    return search({ postnummer: zip, treffPerSide: 1, side: 0 }).then(function (a) { return a[0] ? title(a[0].poststed) : ''; });
  };

  /* Forslag mens kunden skriver. onPick får { address, zip, city }. */
  HH.addressLookup = function (input, onPick) {
    var list = document.createElement('ul');
    list.className = 'suggest'; list.id = input.id + 'Suggest'; list.setAttribute('role', 'listbox'); list.hidden = true;
    input.insertAdjacentElement('afterend', list);
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'false');
    var items = [], active = -1, timer = null, seq = 0;

    function close() { list.hidden = true; list.innerHTML = ''; items = []; active = -1; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
    function render() {
      list.innerHTML = items.map(function (a, i) {
        return '<li role="option" id="' + list.id + i + '" data-i="' + i + '" aria-selected="' + (i === active) + '">' +
          '<b>' + esc(a.address) + '</b> <span>' + esc(a.zip + ' ' + a.city) + '</span></li>';
      }).join('');
      list.hidden = !items.length;
      input.setAttribute('aria-expanded', String(!!items.length));
      if (active >= 0) input.setAttribute('aria-activedescendant', list.id + active); else input.removeAttribute('aria-activedescendant');
    }
    function pick(i) { var a = items[i]; if (!a) return; close(); onPick(a); }

    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length < 3) return close();
      timer = setTimeout(function () {
        var mine = ++seq;
        search({ sok: q + '*', fuzzy: 'true', treffPerSide: 6, side: 0, asciiKompatibel: 'false' }).then(function (res) {
          if (mine !== seq) return;   // et nyere søk er på vei
          var seen = {};
          items = res.map(function (r) { return { address: r.adressetekst, zip: r.postnummer, city: title(r.poststed) }; })
            .filter(function (a) { var k = a.address + a.zip; if (!a.address || seen[k]) return false; seen[k] = 1; return true; });
          active = -1; render();
        });
      }, 220);
    });
    input.addEventListener('keydown', function (e) {
      if (list.hidden) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % items.length; render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + items.length) % items.length; render(); }
      else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); pick(active); }
      else if (e.key === 'Escape') { e.stopPropagation(); close(); }
    });
    list.addEventListener('mousedown', function (e) { e.preventDefault(); });   // behold fokus i feltet
    list.addEventListener('click', function (e) { var li = e.target.closest('[data-i]'); if (li) pick(Number(li.dataset.i)); });
    input.addEventListener('blur', function () { setTimeout(close, 150); });
  };

  /* Norsk mobilnummer: åtte sifre, eventuelt med +47 foran. Returnerer åtte sifre eller ''. */
  HH.cleanPhone = function (v) {
    var d = String(v || '').replace(/[\s().-]/g, '').replace(/^(\+47|0047)/, '');
    return /^[49]\d{7}$/.test(d) ? d : '';
  };
})();
