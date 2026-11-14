// Kodelås for demoen: hele nettstedet ligger bak én delt kode.
// Koden står ikke her. Den ligger som miljøvariabelen HH_KODE hos Netlify, og mangler den, slipper ingen inn.
const side = (feil) => `<!doctype html><html lang="nb"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Heklahamster – lukket forhåndsvisning</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7e83d;color:#171717;font-family:'Helvetica Neue',Arial,sans-serif;padding:20px;box-sizing:border-box}
form{width:min(100%,380px);display:flex;flex-direction:column;gap:14px}
h1{font-family:Impact,'Arial Black',sans-serif;font-size:3rem;line-height:.95;margin:0;text-transform:uppercase}
p{margin:0;font-weight:600}
input,button{font:inherit;padding:14px;border:2px solid #171717;border-radius:0}
input{background:#fff;font-size:1.1rem}
button{background:#314ee8;color:#fff;font-weight:800;box-shadow:4px 4px 0 #171717;cursor:pointer}
.feil{color:#d92b1c;font-weight:800}
</style></head><body><form method="post" action="/__kode">
<h1>Ikke helt åpent ennå.</h1><p>Heklahamster.no er under arbeid. Har du fått en kode, kan du titte.</p>
${feil ? '<p class="feil" role="alert">Feil kode. Prøv en gang til.</p>' : ''}
<label for="kode"><b>Kode</b></label><input id="kode" name="kode" type="password" autocomplete="off" autofocus required>
<button type="submit">Slipp meg inn</button></form></body></html>`;

const hash = async (tekst) => {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tekst));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
};
const html = (body, status, extra = {}) => new Response(body, {
  status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', ...extra }
});

export default async (request, context) => {
  const kode = Netlify.env.get('HH_KODE');
  if (!kode) return html(side(false), 503);
  const nokkel = await hash('heklahamster:' + kode);
  const url = new URL(request.url);

  if (url.pathname === '/__kode' && request.method === 'POST') {
    const skjema = await request.formData();
    if (String(skjema.get('kode') || '').trim() !== kode) return html(side(true), 401);
    return new Response(null, { status: 303, headers: {
      location: '/', 'set-cookie': `hh_kode=${nokkel}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`
    } });
  }
  const cookie = request.headers.get('cookie') || '';
  if (cookie.split(/;\s*/).includes('hh_kode=' + nokkel)) return context.next();
  return html(side(false), 401);
};

export const config = { path: '/*' };
