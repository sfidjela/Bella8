/* Heklahamster – datalag.
   Hele nettsiden snakker kun med HH.store. I dag lagres alt lokalt i nettleseren (demo).
   Når Supabase kobles til, byttes innmaten i disse funksjonene ut – resten av koden står urørt.
   Se docs/supabase-schema.sql for tabellene funksjonene er tenkt å gå mot. */
'use strict';
(function () {
  var DRAFT_KEY = 'hh_draft_v1';
  var ORDERS_KEY = 'hh_orders_v1';
  var mem = {};          // reserve når nettleseren blokkerer lagring
  var dbPromise = null;

  function lsGet(key) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : (mem[key] || null); }
    catch (e) { return mem[key] || null; }
  }
  function lsSet(key, value) {
    mem[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* privat modus e.l. */ }
  }
  function lsDel(key) {
    delete mem[key];
    try { localStorage.removeItem(key); } catch (e) { /* ignorer */ }
  }

  // IndexedDB brukes til hilsener og lyd-/videofiler (for store for localStorage).
  function db() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve) {
      try {
        var req = indexedDB.open('heklahamster', 1);
        req.onupgradeneeded = function () { req.result.createObjectStore('kv'); };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { resolve(null); };
        req.onblocked = function () { resolve(null); };
      } catch (e) { resolve(null); }
    });
    return dbPromise;
  }
  function kv(mode, fn) {
    return db().then(function (d) {
      if (!d) return undefined;
      return new Promise(function (resolve) {
        try {
          var tx = d.transaction('kv', mode);
          var req = fn(tx.objectStore('kv'));
          tx.oncomplete = function () { resolve(req && req.result); };
          tx.onerror = tx.onabort = function () { resolve(undefined); };
        } catch (e) { resolve(undefined); }
      });
    });
  }
  function kvPut(key, value) { mem['kv:' + key] = value; return kv('readwrite', function (s) { return s.put(value, key); }); }
  function kvGet(key) {
    return kv('readonly', function (s) { return s.get(key); }).then(function (v) {
      return v === undefined ? (mem['kv:' + key] || null) : v;
    });
  }
  function kvDel(key) { delete mem['kv:' + key]; return kv('readwrite', function (s) { return s.delete(key); }); }

  /* Uforutsigbar nøkkel: 128 bit fra nettleserens kryptografiske generator.
     I produksjon skal nøkkelen lages på serveren. */
  function randomToken() {
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }

  HH.store = {
    // ----- Kladd (det kunden holder på å fylle ut) -----
    loadDraft: function () { return lsGet(DRAFT_KEY); },
    saveDraft: function (draft) { lsSet(DRAFT_KEY, draft); },
    clearDraft: function () { lsDel(DRAFT_KEY); return kvDel('draft-media'); },
    saveDraftMedia: function (file) { return file ? kvPut('draft-media', file) : kvDel('draft-media'); },
    loadDraftMedia: function () { return kvGet('draft-media'); },

    /* ----- Opprett ordre -----
       Senere: POST til server → ordrekladd → betalingslenke → webhook markerer betalt.
       Leveringsadresse og hilsen lagres hver for seg: hilsensiden får aldri adressen. */
    createOrder: function (draft, mediaFile) {
      var token = randomToken();
      var orderId = 'DEMO-' + token.slice(0, 6).toUpperCase();
      var now = new Date().toISOString();

      var greeting = {
        token: token,
        productId: draft.product,
        embroidery: draft.embroidery,
        type: draft.greetType,                       // 'tekst' | 'lyd' | 'video'
        text: draft.greetType === 'tekst' ? draft.greetText : '',
        revealSender: !!draft.reveal,
        senderName: draft.reveal ? draft.senderName : '',  // lagres ikke når avsender er hemmelig
        createdAt: now
      };
      var order = {
        id: orderId, status: 'demo_ikke_betalt', createdAt: now,
        productId: draft.product, embroidery: draft.embroidery, priceNok: HH.config.priceNok,
        greetingToken: token,
        recipient: { name: draft.toName, address: draft.toAddress, zip: draft.toZip, city: draft.toCity },
        buyerEmail: draft.email
      };

      var orders = lsGet(ORDERS_KEY) || [];
      orders.push(order);
      lsSet(ORDERS_KEY, orders);

      var saves = [kvPut('greeting-' + token, greeting)];
      if (mediaFile && greeting.type !== 'tekst') saves.push(kvPut('media-' + token, mediaFile));
      return Promise.all(saves).then(function () { return { order: order, greeting: greeting }; });
    },

    /* ----- Hent hilsen for mottaker -----
       Senere: kall til serverfunksjon som slår opp på token. Tabellen skal ikke kunne listes. */
    getGreeting: function (token) {
      if (!/^[0-9a-f]{32}$/.test(token || '')) return Promise.resolve(null);
      return kvGet('greeting-' + token).then(function (g) {
        if (!g) return null;
        if (g.type === 'tekst') return { greeting: g, media: null };
        return kvGet('media-' + token).then(function (m) { return { greeting: g, media: m || null }; });
      });
    },

    /* ----- Meld fra om hilsen (misbruk / sletting) – lagres lokalt i demo ----- */
    reportGreeting: function (token) { return kvPut('report-' + token, { at: new Date().toISOString() }); },

    greetingUrl: function (token) {
      var base = HH.config.greetingBaseUrl;
      if (!base) {
        try { base = new URL('hilsen.html', location.href).href.split('#')[0]; }
        catch (e) { base = 'hilsen.html'; }
      }
      return base + '#' + token;
    }
  };
})();
