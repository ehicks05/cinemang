# cinemang

## Overview
Cinemang is a movie-finder app. 

It is powered by a Supabase instance that is populated with data from TMDB via this import script: https://github.com/ehicks05/cinemang-backend. The Supabase instance provides a REST-ish API and acts as the backend service.


## Screenshots
![image](https://github.com/ehicks05/cinemang-frontend/assets/666393/14ce6d0c-3af5-42f0-a10d-267f46efb46c)

![image](https://github.com/ehicks05/cinemang-frontend/assets/666393/b9c6a154-6f5e-4445-ac4e-3bc547a0264c)


## Prereqs
1. node

## Getting Started
1. clone repo
2. run:
   ```
   npm i
   npm run dev
   ```

## DB Requirements

1. Postgres
2. Currently needs at least 400MB disk space
3. Ability to install the `pg_trgm` extension

### DB Provider Free Tiers

1. Supabase - has been great but is now constantly hitting disk IO quotas.
2. Neon - promising so far
3. Aiven - resource limits look great, nyc-digital-ocean-only, no connection pooling, 20 connections
4. Gel - learning curve, not raw postgres, lock-in
5. Xata - no extensions, limited statements (?)

## why is it called cinemang
Take the word 'cinema' and add a very good cat named Mang and you get cinemang.
