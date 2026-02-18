# API Routes Structure

Base URL: `/api`

## Auth

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Create user account (admin or user). |
| POST | `/auth/login` | Public | Login and receive JWT. |
| GET | `/auth/me` | Bearer | Get current user profile. |

## Zones

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/zones` | Bearer | List all zones ordered by position. |
| POST | `/zones` | Bearer (admin) | Create a zone. |
| PUT | `/zones/:id` | Bearer (admin) | Update a zone. |
| DELETE | `/zones/:id` | Bearer (admin) | Delete a zone. |
| GET | `/zones/:id/products` | Bearer | Products assigned to a zone. |

## Products

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/products` | Bearer | List products. Supports filters. |
| GET | `/products/:id` | Bearer | Get product by id. |
| POST | `/products` | Bearer (admin) | Create product and optionally assign zone. |
| PUT | `/products/:id` | Bearer (admin) | Update product or assign zone. |
| DELETE | `/products/:id` | Bearer (admin) | Delete product. |

## Filters

Query parameters for `GET /products`:

- `name`
- `batch_number`
- `expiration_date` (YYYY-MM-DD)
- `zone_id`
