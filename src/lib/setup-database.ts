
// This file contains instructions on how to set up the Supabase database schema
// Run these SQL commands in the Supabase SQL Editor to create and initialize your database

/*
-- Create rallies table
create table public.rallies (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  location text not null,
  date text not null,
  status text not null check (status in ('upcoming', 'in-progress', 'completed')),
  organizer text not null,
  website text,
  image_url text,
  description text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  short_code text not null,
  slug text not null unique
);

-- Create stages table
create table public.stages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  distance numeric not null,
  status text not null check (status in ('upcoming', 'in-progress', 'completed', 'cancelled')),
  start_time text not null,
  date text not null,
  time text not null,
  rally_id uuid references public.rallies(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null
);

-- Create teams table
create table public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  country text not null,
  logo_url text,
  slug text not null unique,
  created_at timestamp with time zone default now() not null
);

-- Create drivers table
create table public.drivers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  birthdate text,
  nationality text not null,
  photo_url text,
  bio text,
  championships integer default 0 not null,
  podiums integer default 0 not null,
  slug text not null unique,
  created_at timestamp with time zone default now() not null,
  team_id uuid references public.teams(id) on delete set null
);

-- Create cars table
create table public.cars (
  id uuid default uuid_generate_v4() primary key,
  make text not null,
  model text not null,
  engine_capacity numeric,
  year integer,
  category text not null,
  image_url text,
  team_id uuid references public.teams(id) on delete set null,
  created_at timestamp with time zone default now() not null
);

-- Create entries table
create table public.entries (
  id uuid default uuid_generate_v4() primary key,
  number integer not null,
  driver_id uuid references public.drivers(id) on delete cascade not null,
  co_driver_id uuid references public.drivers(id) on delete set null,
  car_id uuid references public.cars(id) on delete cascade not null,
  team_id uuid references public.teams(id) on delete cascade not null,
  category text not null,
  rally_id uuid references public.rallies(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null
);

-- Create stage_results table
create table public.stage_results (
  id uuid default uuid_generate_v4() primary key,
  stage_id uuid references public.stages(id) on delete cascade not null,
  rally_id uuid references public.rallies(id) on delete cascade not null,
  driver_id uuid references public.drivers(id) on delete cascade not null,
  co_driver_id uuid references public.drivers(id) on delete set null,
  time text not null,
  position integer not null,
  gap text,
  car_number integer not null,
  status text not null,
  created_at timestamp with time zone default now() not null
);

-- Create users table
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  created_at timestamp with time zone default now() not null
);

-- Set up Row Level Security
alter table public.rallies enable row level security;
alter table public.stages enable row level security;
alter table public.teams enable row level security;
alter table public.drivers enable row level security;
alter table public.cars enable row level security;
alter table public.entries enable row level security;
alter table public.stage_results enable row level security;
alter table public.users enable row level security;

-- Create policies for authenticated users
create policy "Allow authenticated users to view rallies"
  on public.rallies for select
  to authenticated
  using (true);

create policy "Allow authenticated users to view stages"
  on public.stages for select
  to authenticated
  using (true);

create policy "Allow authenticated users to view teams"
  on public.teams for select
  to authenticated
  using (true);

create policy "Allow authenticated users to view drivers"
  on public.drivers for select
  to authenticated
  using (true);

create policy "Allow authenticated users to view cars"
  on public.cars for select
  to authenticated
  using (true);

create policy "Allow authenticated users to view entries"
  on public.entries for select
  to authenticated
  using (true);

create policy "Allow authenticated users to view stage_results"
  on public.stage_results for select
  to authenticated
  using (true);

create policy "Allow authenticated users to view users"
  on public.users for select
  to authenticated
  using (true);

-- Create policies for public reading
create policy "Allow public to view rallies"
  on public.rallies for select
  to anon
  using (true);

create policy "Allow public to view stages"
  on public.stages for select
  to anon
  using (true);

create policy "Allow public to view teams"
  on public.teams for select
  to anon
  using (true);

create policy "Allow public to view drivers"
  on public.drivers for select
  to anon
  using (true);

create policy "Allow public to view cars"
  on public.cars for select
  to anon
  using (true);

create policy "Allow public to view entries"
  on public.entries for select
  to anon
  using (true);

create policy "Allow public to view stage_results"
  on public.stage_results for select
  to anon
  using (true);

-- Create policies for admin to modify data
create policy "Allow authenticated users with admin role to insert, update, delete rallies"
  on public.rallies for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users with admin role to insert, update, delete stages"
  on public.stages for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users with admin role to insert, update, delete teams"
  on public.teams for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users with admin role to insert, update, delete drivers"
  on public.drivers for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users with admin role to insert, update, delete cars"
  on public.cars for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users with admin role to insert, update, delete entries"
  on public.entries for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users with admin role to insert, update, delete stage_results"
  on public.stage_results for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users with admin role to insert, update, delete users"
  on public.users for all
  to authenticated
  using (true)
  with check (true);
*/

export const setupInstructions = `
To set up your Supabase database:

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the SQL code from the setup-database.ts file (excluding the JavaScript comments)
3. Paste and run the SQL code to create all required tables
4. Set up authentication in Supabase:
   - Go to Authentication > Settings > Email
   - Configure email settings as needed
   - Enable "Confirm email" if desired
5. Create an admin user:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter email and password for your admin user
6. Manually add this user to the users table with 'admin' role:
   INSERT INTO public.users (id, email, role)
   VALUES ([user_id_from_auth], '[admin_email]', 'admin');

After setup, you can use the admin panel to manage all rally data.
`;
