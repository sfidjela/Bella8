-- Heklahamster – forslag til Supabase-tabeller. IKKE kjørt noe sted ennå.
-- Prinsipp: nettleseren får aldri lese tabellene direkte. Alt går via serverfunksjoner.

create table orders (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  status          text not null default 'kladd'
                  check (status in ('kladd','venter_betaling','betalt','brodert','sendt','levert','kansellert')),
  product_id      text not null check (product_id in ('lang','skjev','bust','feit')),
  embroidery      text not null check (char_length(embroidery) between 1 and 20),
  price_nok       integer not null,
  buyer_email     text not null,
  recipient_name  text not null,
  recipient_addr  text not null,
  recipient_zip   text not null check (recipient_zip ~ '^\d{4}$'),
  recipient_city  text not null,
  payment_ref     text,            -- settes kun av webhook fra Vipps/Stripe
  tracking_ref    text             -- settes når fraktetikett er laget
);

-- Hilsenen ligger i egen tabell uten adresse eller e-post.
create table greetings (
  token           text primary key,          -- 128 bit tilfeldig, lages på server
  order_id        uuid not null references orders(id) on delete cascade,
  kind            text not null check (kind in ('tekst','lyd','video')),
  body            text check (char_length(body) <= 500),
  media_path      text,                      -- fil i privat Storage-bøtte, hentes med signert lenke
  reveal_sender   boolean not null default false,
  sender_name     text,                      -- null når avsender er hemmelig
  reported_at     timestamptz,               -- «Meld fra» på hilsensiden
  deleted_at      timestamptz
);

alter table orders    enable row level security;   -- ingen policyer = ingen tilgang fra nettleser
alter table greetings enable row level security;

-- Eneste vei inn for mottakeren: oppslag på eksakt nøkkel. Kan ikke liste hilsener.
create function get_greeting(p_token text)
returns table (product_id text, embroidery text, kind text, body text, media_path text, sender_name text)
language sql security definer set search_path = public as $$
  select o.product_id, o.embroidery, g.kind, g.body, g.media_path,
         case when g.reveal_sender then g.sender_name end
  from greetings g join orders o on o.id = g.order_id
  where g.token = p_token and g.deleted_at is null and o.status in ('betalt','brodert','sendt','levert');
$$;
