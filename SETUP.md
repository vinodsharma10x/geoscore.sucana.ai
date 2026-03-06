# GEOScore — Quick Setup Guide

## 1. Clone & Install

```bash
git clone https://github.com/vinodsharma10x/geoscore.sucana.ai.git
cd geoscore.sucana.ai
pnpm install
```

## 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://glejzxrodiutxnbfgavq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
WEBSHARE_PASSWORD=<your-webshare-password>
```

## 3. Database (one-time)

Go to [Supabase Dashboard](https://supabase.com/dashboard) > SQL Editor and run:

```sql
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

create index if not exists idx_runs_created_at on runs (created_at desc);
create index if not exists idx_runs_url on runs (url, created_at desc);

alter table runs enable row level security;

create policy "Allow public read" on runs
  for select using (true);

create policy "Allow public insert" on runs
  for insert with check (true);
```

Skip this step if you already created the table.

## 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Deploy to Vercel

```bash
vercel
```

Add the same env vars in Vercel Dashboard > Settings > Environment Variables.

## Optional: MCP Server

```bash
cd mcp
npm install
npm run build
claude mcp add geoscore node $(pwd)/dist/index.js
```

## Optional: Claude Code Skill

```bash
cp -r skills/claude-code ~/.claude/skills/geo-audit
# Use: /geo-audit https://example.com
```
