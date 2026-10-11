-- ==============================================================================
-- SOLSTICE / HEATWAVE BUDDY (लू साथी) - SUPABASE DATABASE SCHEMA
-- ==============================================================================
--
-- COMPLIANCE MANIFESTO (Rules 12, 13 & 19):
-- 1. Every database table has Row Level Security (RLS) enabled with strict policies.
-- 2. ZERO-HEALTH-STORAGE GUARANTEE:
--    Personal medical and biometric attributes (Age, Health History flags,
--    Custom Health Notes, and precise GPS coordinates) are NEVER stored in this database.
--    All health inputs remain strictly local in the user's browser runtime.
-- 3. Only non-sensitive user preferences (language, saved cities) are persisted here.
-- ==============================================================================

-- 1. Create User Preferences Table
create table if not exists public.user_preferences (
  id uuid primary key references auth.users(id) on delete cascade,
  preferred_language text check (preferred_language in ('en', 'hi')) default 'en',
  favorite_cities text[] default array['Delhi'],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.user_preferences enable row level security;

-- 3. Create RLS Policies (Users can only access their own row)
create policy "Users can view own preferences"
  on public.user_preferences
  for select
  using (auth.uid() = id);

create policy "Users can insert own preferences"
  on public.user_preferences
  for insert
  with check (auth.uid() = id);

create policy "Users can update own preferences"
  on public.user_preferences
  for update
  using (auth.uid() = id);

create policy "Users can delete own preferences"
  on public.user_preferences
  for delete
  using (auth.uid() = id);

-- 4. Auto-update timestamp function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create or replace trigger set_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.set_updated_at();

-- 5. Trigger: Automatically provision user_preferences row on Google OAuth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_preferences (id, preferred_language, favorite_cities)
  values (new.id, 'en', array['Delhi'])
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
