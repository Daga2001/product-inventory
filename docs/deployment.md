# Deployment Instructions

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

## Database Setup

1. Create a database named `inventory`.
2. Run schema SQL:

```sql
\i backend/src/db/schema.sql
```

3. (Optional) Seed demo data:

```sql
\i backend/src/db/seed.sql
```

## Backend

1. Create `backend/.env` from `backend/.env.example`.
2. Install dependencies and run:

```bash
cd backend
npm install
npm run dev
```

## Frontend

1. Configure API base URL if needed:

```
VITE_API_URL=http://localhost:4000/api
```

2. Install and run:

```bash
cd frontend
npm install
npm run dev
```

## Production Notes

- Use a process manager (systemd, PM2, Docker) for the backend.
- Set `JWT_SECRET` to a strong value.
- Configure CORS to the production frontend domain.
- Use HTTPS at the reverse proxy level.
