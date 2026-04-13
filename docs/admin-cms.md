# Admin CMS Setup (Neon + Netlify)

## Required Netlify Environment Variables

- `DATABASE_URL` - Neon Postgres connection string.
- `SESSION_SECRET` - long random secret for JWT/session signing.
- `ADMIN_BOOTSTRAP_PASSWORD` - initial password for admin user bootstrap.
- `ADMIN_USERNAME` (optional, default `admin`).
- `MEDIUM_RSS_URL` (optional, defaults to rss2json Medium endpoint).

## Database Migration

Run this SQL in Neon:

- `db/migrations/001_init.sql`

## Admin Route

- Admin login: `/admin/login`
- Admin dashboard: `/admin`

## Notes

- Sessions are HTTP-only cookies.
- Draft posts do not show on public pages.
- `medium-sync` scheduled function runs every 6 hours.
