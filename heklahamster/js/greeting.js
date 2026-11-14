/* Heklahamster – hilsenen slik mottakeren ser den.
   Brukes av hilsen.html (QR-lenken) og av «se som mottaker» i bestillingsflyten. */
'use strict';
(function () {
  var esc = HH.esc;

  function notFound(root, opts) {
    root.innerHTML =
      '<div class="gr gr-missing">' +
        '<p class="eyebrow">Heklahamster.no</p>' +
        '<h1 class="gr-title">HER VAR DET INGEN HILSEN.</h1>' +
        '<p>Lenken er feil, eller hilsenen er slettet. Skann QR-koden på hamsteren en gang til.</p>' +
        (HH.config.demo ? '<p class="note">Demo: hilsener lagres foreløpig bare i nettleseren de ble laget i, så de kan ikke åpnes fra en annen enhet ennå.</p>' : '') +
        '<a class="btn" href="' + (opts.homeHref || 'index.html') + '" data-gr-home>Til heklahamster.no</a>' +
      '</div>';
  }

  /* opts: { homeHref, onHome } */
  HH.renderGreeting = function (root, data, opts) {
    opts = opts || {};
    if (!data || !data.greeting) { notFound(root, opts); bindHome(root, opts); return; }

    var g = data.greeting;
    var product = HH.product(g.productId) || HH.config.products[0];
    var mediaUrl = data.media ? URL.createObjectURL(data.media) : '';

    var body;
    if (g.type === 'lyd') {
      body = mediaUrl
        ? '<p class="gr-kind">Lydhilsen</p><audio id="grAudio" controls preload="metadata" src="' + mediaUrl + '"></audio>'
        : '<p class="gr-text">Lydhilsenen ble dessverre borte på veien.</p>';
    } else if (g.type === 'video') {
      body = mediaUrl
        ? '<p class="gr-kind">Videohilsen</p><video id="grVideo" controls playsinline preload="metadata" src="' + mediaUrl + '"></video>'
        : '<p class="gr-text">Videohilsenen ble dessverre borte på veien.</p>';
    } else {
      body = '<p class="gr-text">' + esc(g.text || 'Noen syntes du trengte en hamster. Mer vet vi ikke.').replace(/\n/g, '<br>') + '</p>';
    }

    var who = g.revealSender && g.senderName
      ? '<p class="gr-who-label">Skyldig:</p><p class="gr-who-name">' + esc(g.senderName) + '</p>'
      : '<p class="gr-who-label">Avsenderen vil være hemmelig.</p><p class="gr-who-name">Mistenk alle.</p>';

    root.innerHTML =
      '<div class="gr">' +
        '<p class="eyebrow gr-brand">Heklahamster.no</p>' +
        '<section class="gr-closed" id="grClosed">' +
          '<h1 class="gr-title">NOEN HAR SENDT DEG EN HAMSTER.</h1>' +
          '<p class="gr-lead">Det var med vilje. Det følger en hilsen med.</p>' +
          '<button class="btn btn-blaa btn-big" type="button" id="grOpen">Åpne hilsenen</button>' +
        '</section>' +
        '<section class="gr-open" id="grOpened" hidden>' +
          HH.hamsterFigure(product, g.embroidery, { cls: 'gr-hamster' }) +
          '<div class="gr-card">' + body + '</div>' +
          '<button class="btn btn-big" type="button" id="grWhoBtn">Hvem sendte den?</button>' +
          '<div class="gr-who" id="grWho" hidden aria-live="polite">' + who + '</div>' +
          '<a class="btn btn-ink" href="' + (opts.homeHref || 'index.html') + '" data-gr-home>Ta hevn. Send en tilbake.</a>' +
          '<details class="gr-report">' +
            '<summary>Meld fra om denne hilsenen</summary>' +
            '<p>Er hilsenen ubehagelig, eller vil du ha den slettet? Meld fra, så ser et menneske på saken.</p>' +
            '<button class="btn btn-small" type="button" id="grReport">Meld fra</button>' +
            '<p id="grReportStatus" role="status"></p>' +
          '</details>' +
        '</section>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    $('grOpen').addEventListener('click', function () {
      $('grClosed').hidden = true;
      $('grOpened').hidden = false;
      var media = $('grAudio') || $('grVideo');
      if (media) { var p = media.play(); if (p && p.catch) p.catch(function () {}); }
      root.scrollTop = 0;
    });
    $('grWhoBtn').addEventListener('click', function () {
      $('grWhoBtn').hidden = true;
      $('grWho').hidden = false;
    });
    $('grReport').addEventListener('click', function () {
      HH.store.reportGreeting(g.token);
      $('grReport').hidden = true;
      $('grReportStatus').textContent = HH.config.demo
        ? 'Registrert i demoen. Når butikken er live går meldingen til ' + HH.config.contactEmail + '.'
        : 'Takk. Vi ser på saken.';
    });
    bindHome(root, opts);
  };

  function bindHome(root, opts) {
    if (!opts.onHome) return;
    root.querySelectorAll('[data-gr-home]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); opts.onHome(); });
    });
  }
})();
