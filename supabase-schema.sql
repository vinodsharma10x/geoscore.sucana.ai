-- Run this in your Supabase SQL Editor to create the runs table

create table if not exists runs (
  id text primary key,
  url text not null,
  page_title text,
  industry text,
  overall_score numeric not null,
  rating text not null,
  result_json jsonb not null,
  created_at timestamptz default now()
);

-- Index for listing recent runs
create index if not exists idx_runs_created_at on runs (created_at desc);

-- Index for looking up runs by URL
create index if not exists idx_runs_url on runs (url, created_at desc);

-- Enable Row Level Security (allow public read/insert, no updates/deletes)
alter table runs enable row level security;

create policy "Allow public read" on runs
  for select using (true);

create policy "Allow public insert" on runs
  for insert with check (true);
