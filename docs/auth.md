# Authentication Implementation

- Passwords are hashed with bcrypt before storage.
- JWT tokens are issued on login and registration.
- Token payload contains `sub` (user id) and `role`.
- Auth middleware checks `Authorization: Bearer <token>`.
- Admin-only routes require `role = admin`.

Core files:

- `backend/src/services/authService.ts`
- `backend/src/middleware/auth.ts`
- `backend/src/routes/authRoutes.ts`
