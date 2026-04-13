create extension if not exists "pgcrypto";

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references admins(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_admin_id on sessions(admin_id);
create index if not exists idx_sessions_expires_at on sessions(expires_at);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content_markdown text not null,
  cover_image text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_status on posts(status);
create index if not exists idx_posts_published_at on posts(published_at desc);

create table if not exists medium_articles (
  id uuid primary key default gen_random_uuid(),
  medium_link text not null unique,
  title text not null,
  excerpt text not null,
  cover_image text,
  tags text[] not null default '{}',
  published_at timestamptz,
  source text not null default 'rss' check (source in ('rss', 'manual')),
  is_hidden boolean not null default false,
  is_featured boolean not null default false,
  manual_override_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_medium_hidden on medium_articles(is_hidden);
create index if not exists idx_medium_featured on medium_articles(is_featured);
create index if not exists idx_medium_published_at on medium_articles(published_at desc);

create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_posts_updated_at on posts;
create trigger trg_posts_updated_at
before update on posts
for each row execute function set_updated_at();

drop trigger if exists trg_medium_updated_at on medium_articles;
create trigger trg_medium_updated_at
before update on medium_articles
for each row execute function set_updated_at();
