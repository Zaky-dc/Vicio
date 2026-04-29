-- Schema base para o app de controle de vícios.
-- Rode isso no SQL Editor do seu projeto Supabase.

create extension if not exists pgcrypto;

-- Tabela de vícios por usuário
create table if not exists public.vices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  start_date date not null default current_date
);

create unique index if not exists vices_user_id_name_idx
  on public.vices(user_id, name);

-- Registro de recaídas: cada linha é um "dia do cometimento"
-- status: 'success' (cumpriu) ou 'relapse' (recaiu)
create table if not exists public.vicio_commits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vicio_id uuid not null references public.vices(id) on delete cascade,
  commit_date date not null,
  status text not null default 'relapse',
  created_at timestamptz not null default now(),
  constraint vicio_commits_unique unique (vicio_id, commit_date)
);

-- Contatos para o botão de pânico
create table if not exists public.panic_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  whatsapp_phone text,
  created_at timestamptz not null default now(),
  constraint panic_contacts_user_contact_name unique (user_id, name)
);

-- RLS
alter table public.vices enable row level security;
alter table public.vicio_commits enable row level security;
alter table public.panic_contacts enable row level security;

-- Policies: vices
create policy "vices_select_own" on public.vices
  for select using (user_id = auth.uid());
create policy "vices_insert_own" on public.vices
  for insert with check (user_id = auth.uid());
create policy "vices_update_own" on public.vices
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "vices_delete_own" on public.vices
  for delete using (user_id = auth.uid());

-- Policies: vicio_commits
create policy "vicio_commits_select_own" on public.vicio_commits
  for select using (user_id = auth.uid());
create policy "vicio_commits_insert_own" on public.vicio_commits
  for insert with check (user_id = auth.uid());
create policy "vicio_commits_update_own" on public.vicio_commits
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "vicio_commits_delete_own" on public.vicio_commits
  for delete using (user_id = auth.uid());

-- Policies: panic_contacts
create policy "panic_contacts_select_own" on public.panic_contacts
  for select using (user_id = auth.uid());
create policy "panic_contacts_insert_own" on public.panic_contacts
  for insert with check (user_id = auth.uid());

-- Observação: o app atual não atualiza/exclui contatos.

