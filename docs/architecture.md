# Architecture Overview

This system follows a clean, modular architecture with clear separation of concerns:

- Presentation Layer (Frontend)
- API Layer (Routes + Controllers)
- Application Layer (Services)
- Data Layer (Repositories + Database)

## Flow

1. UI triggers an API call.
2. Route validates input and authentication.
3. Controller delegates business logic to a service.
4. Service enforces rules and calls repositories.
5. Repository performs parameterized SQL queries.

## Security

- Passwords hashed with bcrypt.
- JWT-based authentication.
- Role-based access control for admin operations.
- Input validation via Zod.
- Centralized error handling.

## Scalability

- Stateless API service.
- Layered code to keep business logic independent of frameworks.
- PostgreSQL indexing on product fields.

