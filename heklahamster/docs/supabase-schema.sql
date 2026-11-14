-- Heklahamster – forslag til Supabase-tabeller. IKKE kjørt noe sted ennå.
-- Prinsipp: nettleseren får aldri lese tabellene direkte. Alt går via serverfunksjoner.

create table orders (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  order_no        text unique not null,     -- kort nummer som står på QR-lappen og pakkseddelen
  status          text not null default 'venter_betaling'
                  check (status in ('venter_betaling','betalt','venter_adresse','brodert','sendt','levert','kansellert')),
  product_id      text not null check (product_id in ('lang','skjev','bust','feit')),
  embroidery      text not null default '' check (char_length(embroidery) <= 20),   -- tom = uten brodering
  price_base_nok  integer not null,
  price_embroidery_nok integer not null default 0,
  price_shipping_nok   integer not null default 0,
  price_nok       integer not null,          -- regnes ut på serveren, aldri hentet fra nettleseren
  buyer_email     text not null,
  recipient_name  text not null,
  recipient_phone text,                      -- bare når mottakeren selv skal oppgi adressen
  address_token   text unique,               -- nøkkel til adresse.html#<token>, 128 bit
  recipient_addr  text,
  recipient_zip   text check (recipient_zip ~ '^\d{4}$'),
  recipient_city  text,
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

-- Mottakeren oppgir adressen sin selv. Siden får bare fornavnet tilbake.
create function get_address_request(p_token text)
returns table (first_name text, done boolean)
language sql security definer set search_path = public as $$
  select split_part(recipient_name, ' ', 1), recipient_addr is not null
  from orders where address_token = p_token and status in ('betalt','venter_adresse');
$$;

create function save_address(p_token text, p_addr text, p_zip text, p_city text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update orders set recipient_addr = p_addr, recipient_zip = p_zip, recipient_city = p_city, status = 'betalt'
  where address_token = p_token and status = 'venter_adresse' and p_zip ~ '^\d{4}$' and char_length(p_addr) between 1 and 120;
  return found;
end $$;

-- Ordreoversikten (admin.html) leser «orders» direkte, men bare for innloggede ansatte:
-- create policy admin_all on orders for all to authenticated using (true) with check (true);
