/* Heklahamster – ordreoversikt for den som hekler, broderer og sender.
   I demoen leses ordrene fra nettleserens lager. I produksjon skal siden ligge bak innlogging
   og lese fra tabellen «orders» (se docs/supabase-schema.sql). */
'use strict';
(function () {
  var esc = HH.esc, $ = function (id) { return document.getElementById(id); };
  var STATUS = [
    ['venter_adresse', 'Venter på adresse'],
    ['ny', 'Ny'],
    ['brodert', 'Brodert'],
    ['sendt', 'Sendt']
  ];
  var NEXT = { ny: ['brodert', 'Merk som brodert'], brodert: ['sendt', 'Merk som sendt'] };
  var label = function (s) { var f = STATUS.filter(function (x) { return x[0] === s; })[0]; return f ? f[1] : s; };
  var filter = 'alle', query = '';

  function qrDataUrl(text) {
    var qr = qrcode(0, 'M'); qr.addData(text); qr.make();
    var n = qr.getModuleCount(), quiet = 3, scale = 8, size = (n + quiet * 2) * scale;
    var c = document.createElement('canvas'); c.width = c.height = size;
    var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size); ctx.fillStyle = '#000';
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (qr.isDark(r, k)) ctx.fillRect((k + quiet) * scale, (r + quiet) * scale, scale, scale);
    return c.toDataURL('image/png');
  }

  function date(iso) {
    var d = new Date(iso);
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '. kl. ' + ('0' + d.getHours()).slice(-2) + '.' + ('0' + d.getMinutes()).slice(-2);
  }

  function render() {
    var all = HH.store.listOrders();
    var counts = { alle: all.length };
    STATUS.forEach(function (s) { counts[s[0]] = all.filter(function (o) { return o.status === s[0]; }).length; });
    $('admFilter').innerHTML = [['alle', 'Alle']].concat(STATUS).map(function (s) {
      return '<button type="button" data-filter="' + s[0] + '" aria-pressed="' + (filter === s[0]) + '">' + s[1] + ' <b>' + (counts[s[0]] || 0) + '</b></button>';
    }).join('');

    var hit = query ? HH.store.findOrder(query) : null;
    var rows = all.filter(function (o) {
      if (query) return hit ? o.id === hit.id : (o.id + ' ' + o.recipient.name + ' ' + o.embroidery).toLowerCase().indexOf(query.toLowerCase()) > -1;
      return filter === 'alle' || o.status === filter;
    });
    $('admCount').textContent = all.length ? rows.length + ' av ' + all.length + ' ordre' : '';
    $('admPrintAll').disabled = !counts.ny;

    if (!all.length) {
      $('admList').innerHTML = '<div class="adm-empty"><p><b>Ingen ordre ennå.</b> Bestillinger dukker opp her med status, brodering, adresse og QR-lapp.</p>' +
        '<a class="btn btn-blaa" href="index.html">Lag en prøvebestilling</a></div>';
      return;
    }
    $('admList').innerHTML = rows.map(function (o) {
      var p = HH.product(o.productId) || { name: o.productId };
      var r = o.recipient, next = NEXT[o.status];
      return '<article class="adm-card" data-id="' + esc(o.id) + '">' +
        '<header><span class="adm-id">' + esc(o.id) + '</span><span class="adm-status s-' + esc(o.status) + '">' + esc(label(o.status)) + '</span>' +
          '<span class="adm-paid">' + (o.paid ? 'Betalt' : 'Ikke betalt (demo)') + '</span><time>' + date(o.createdAt) + '</time></header>' +
        '<div class="adm-body">' +
          '<div><h3>' + esc(p.name) + '</h3>' +
            '<p class="adm-emb">' + (o.embroidery ? 'Brodér: <b class="pen">' + esc(o.embroidery) + '</b>' : 'Ingen brodering') + '</p>' +
            '<p>Hilsen: ' + esc(o.greetingType || 'tekst') + ' · ' + esc(o.priceNok) + ' kr</p></div>' +
          '<div><h3>Sendes til</h3><p>' + esc(r.name) + '<br>' +
            (r.address ? esc(r.address) + '<br>' + esc(r.zip + ' ' + r.city) : 'Venter på adresse fra mottakeren (' + esc(r.phone || '') + ')') + '</p>' +
            '<p class="adm-mail">Kjøper: ' + esc(o.buyerEmail) + '</p></div>' +
        '</div>' +
        '<footer>' +
          '<button class="btn btn-small" type="button" data-print="' + esc(o.id) + '">Skriv ut QR-lapp</button>' +
          (next ? '<button class="btn btn-small btn-blaa" type="button" data-next="' + next[0] + '">' + next[1] + '</button>' : '') +
        '</footer></article>';
    }).join('') || '<p class="adm-empty">Ingen ordre passer.</p>';
  }

  /* Én utskrift per ordre: lappen som henges på hamsteren, og en pakkseddel med samme ordrenummer. */
  function labelHtml(o) {
    var p = HH.product(o.productId) || { name: o.productId }, r = o.recipient;
    return '<section class="lbl">' +
      '<div class="lbl-tag"><img src="' + qrDataUrl(HH.store.greetingUrl(o.greetingToken)) + '" alt="">' +
        '<p class="lbl-say">Skann meg.<br>Jeg kan forklare.</p><p class="lbl-id">' + esc(o.id) + '</p></div>' +
      '<div class="lbl-slip"><p class="lbl-id">' + esc(o.id) + '</p>' +
        '<p><b>' + esc(p.name) + '</b></p>' +
        '<p>Brodering: <b>' + (o.embroidery ? '«' + esc(o.embroidery) + '»' : 'ingen') + '</b></p>' +
        '<p class="lbl-to">' + esc(r.name) + '<br>' + esc(r.address || 'ADRESSE MANGLER') + '<br>' + esc((r.zip || '') + ' ' + (r.city || '')) + '</p>' +
        '<p class="lbl-fine">Klipp langs streken. Lappen til venstre henges på hamsteren.</p></div>' +
    '</section>';
  }
  function print(orders) {
    if (!orders.length) return;
    $('printArea').innerHTML = '<p class="print-bar"><button class="btn btn-small" type="button" id="printClose">Lukk</button> ' + orders.length + ' lapp' + (orders.length > 1 ? 'er' : '') + '. Bruk nettleserens utskrift hvis dialogen ikke åpnet seg.</p>' + orders.map(labelHtml).join('');
    document.body.classList.add('is-printing');
    window.print();   // i forhåndsvisninger der utskrift er sperret, vises lappene på skjermen i stedet
  }
  window.addEventListener('afterprint', function () { document.body.classList.remove('is-printing'); });

  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-filter]');
    if (f) { filter = f.dataset.filter; query = ''; $('admFind').value = ''; render(); return; }
    var card = e.target.closest('.adm-card'); var id = card && card.dataset.id;
    var n = e.target.closest('[data-next]');
    if (n && id) { HH.store.updateOrder(id, { status: n.dataset.next }); render(); return; }
    var pr = e.target.closest('[data-print]');
    if (pr) { print(HH.store.listOrders().filter(function (o) { return o.id === pr.dataset.print; })); return; }
    if (e.target.closest('#printClose')) { document.body.classList.remove('is-printing'); }
  });
  $('admPrintAll').addEventListener('click', function () {
    print(HH.store.listOrders().filter(function (o) { return o.status === 'ny'; }));
  });
  $('admFind').addEventListener('input', function (e) { query = e.target.value.trim(); render(); });

  render();
})();
