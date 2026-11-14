/* Heklahamster – konfigurasjon.
   Alt som skal byttes ut før lansering står her: pris, flagg, grenser og produktene. */
'use strict';
window.HH = window.HH || {};

HH.config = {
  // FUNKSJONSFLAGG
  paymentEnabled: false,      // Ikke sett til true før Vipps/Stripe er konfigurert og godkjent.
  demo: true,                 // Viser demo-merking og lagrer alt lokalt i nettleseren.

  // PRIS (plassholder til godkjent pris foreligger)
  priceNok: 244,
  priceIsPlaceholder: true,

  // GRENSER – må også valideres på serveren når backend kobles til.
  embroideryMax: 20,
  greetingTextMax: 500,
  audioMaxSeconds: 60,
  audioMaxBytes: 10 * 1024 * 1024,
  videoMaxBytes: 50 * 1024 * 1024,

  // QR-lenker. Tom streng = samme mappe som nettsiden (hilsen.html#<token>).
  greetingBaseUrl: '',
  // Settes til true av forhåndsvisningsbygget, der alt ligger i én fil.
  singleFile: false,

  shopUrl: 'https://heklahamster.no',   // det kunden deler videre
  contactEmail: 'hei@heklahamster.no', // eksempel – ikke opprettet ennå

  // Bildestier. Forhåndsvisningsbygget bytter disse ut med innebygde bilder.
  img: function (name) {
    return (HH.assets && HH.assets[name]) || 'assets/' + name + '.webp';
  },

  /* belly: hvor broderingen plasseres på bildet (prosent av bildet). */
  products: [
    {
      id: 'lang', name: 'Langhamsteren', nameHtml: 'Lang&shy;hamsteren',
      line: 'Litt for lang. Litt for stolt.',
      grade: '3−', remark: 'Fulgte ikke oppskriften.',
      tint: 'rosa', belly: { x: 50, y: 60, w: 30 }
    },
    {
      id: 'skjev', name: 'Skjevehamsteren', nameHtml: 'Skjeve&shy;hamsteren',
      line: 'Noe gikk galt. Vi vet ikke hva.',
      grade: '2+', remark: 'Ser i to retninger. Finner ingen av dem.',
      tint: 'blaa', belly: { x: 53, y: 68, w: 36 }
    },
    {
      id: 'bust', name: 'Bustehamsteren', nameHtml: 'Buste&shy;hamsteren',
      line: 'Har hatt en vanskelig uke.',
      grade: '2', remark: 'Garnet tok slutt. Tålmodigheten også.',
      tint: 'gul', belly: { x: 50, y: 66, w: 42 }
    },
    {
      id: 'feit', name: 'Fetthamsteren', nameHtml: 'Fett&shy;hamsteren',
      line: 'Liten kropp. Store problemer.',
      grade: '4−', remark: 'Overraskende rund. Mistenkelig fornøyd.',
      tint: 'fersken', belly: { x: 50, y: 69, w: 32 }
    }
  ],

  embroiderySuggestions: ['Din lille idiot', 'Hvorfor?', 'Unnskyld', 'Gratulerer, antar vi', 'Dette er din feil', 'Jeg prøvde']
};

HH.product = function (id) {
  return HH.config.products.find(function (p) { return p.id === id; }) || null;
};

/* Teller synlige tegn (ikke UTF-16-enheter), slik at emoji og æøå telles som ett tegn. */
HH.chars = function (text) {
  if (window.Intl && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter('nb', { granularity: 'grapheme' }).segment(text), function (s) { return s.segment; });
  }
  return Array.from(text);
};
HH.clampChars = function (text, max) {
  var c = HH.chars(text.replace(/[\r\n]+/g, ' '));
  return c.length > max ? c.slice(0, max).join('') : c.join('');
};

HH.esc = function (s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};

/* Skriftstørrelse for broderingen: kort tekst broderes stort, lang tekst smått.
   Enhet: prosent av bildebredden. */
HH.stitchSize = function (product, text) {
  var w = product.belly.w;
  var longest = String(text || '').split(/\s+/).reduce(function (m, word) { return Math.max(m, HH.chars(word).length); }, 3);
  return Math.max(6.5, Math.min(13, (2.3 * w) / longest)).toFixed(2);
};

/* Hamsterbilde med brodert tekst. Brukes i forhåndsvisning, oppsummering og på hilsensiden. */
HH.hamsterFigure = function (product, embroidery, opts) {
  opts = opts || {};
  var b = product.belly;
  var text = embroidery || '';
  return '<figure class="hamster tint-' + product.tint + (opts.cls ? ' ' + opts.cls : '') + '">' +
    '<img src="' + HH.config.img(product.id) + '" alt="' + HH.esc(product.name) + ', en rar heklet hamster" width="800" height="1000"' + (opts.lazy ? ' loading="lazy"' : '') + '>' +
    '<span class="stitch" data-stitch style="left:' + b.x + '%;top:' + b.y + '%;width:' + b.w + '%;--fs:' + HH.stitchSize(product, text) + '"' + (text ? '' : ' hidden') + '>' + HH.esc(text) + '</span>' +
    '</figure>';
};
