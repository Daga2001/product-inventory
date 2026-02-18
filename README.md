# Cupboard Inventory Management System

This repo provides a clean-architecture inventory system with a visual cupboard layout, product tracking, batch management, and JWT authentication.

## Deliverables

- Database schema: `docs/schema.sql`
- ER Diagram: `docs/er-diagram.mmd`
- API routes: `docs/api.md`
- Frontend structure: `docs/frontend-structure.md`
- Authentication implementation: `backend/src/services/authService.ts`
- Seed data: `docs/seed.sql`
- Deployment instructions: `docs/deployment.md`

## Local Setup

**Requirements**

- Node.js 18+
- PostgreSQL 14+
- npm (or pnpm/yarn)

**1. Database**

Create a local database and apply the schema.

```bash
createdb inventory
psql inventory -f backend/src/db/schema.sql
```

Optional seed data:

```bash
psql inventory -f backend/src/db/seed.sql
```

**2. Backend**

Create `backend/.env` using `backend/.env.example` and set values:

```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory
JWT_SECRET=replace_with_strong_secret
CORS_ORIGIN=http://localhost:5173
```

Install dependencies and run:

```bash
cd backend
npm install
npm run dev
```

The API will be available at `http://localhost:4000/api` and health check at `http://localhost:4000/health`.

**3. Frontend**

Create `frontend/.env` using `frontend/.env.example`:

```
VITE_API_URL=http://localhost:4000/api
```

Install dependencies and run:

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`.

## Notes

- The frontend includes a demo-data fallback when the API is not reachable.
- Use `VITE_API_URL` to point the UI at the backend.
- `docs/seed.sql` contains placeholder bcrypt hashes. Replace `REPLACE_WITH_BCRYPT_HASH` before seeding users.
