-- Sample seed data
-- Replace password_hash with a bcrypt hash before use.

INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin User', 'admin@example.com', 'REPLACE_WITH_BCRYPT_HASH', 'admin'),
  ('Warehouse User', 'user@example.com', 'REPLACE_WITH_BCRYPT_HASH', 'user');

INSERT INTO zones (name, position_x, position_y)
VALUES
  ('Top A', 1, 1),
  ('Top B', 2, 1),
  ('Top C', 3, 1),
  ('Top D', 4, 1),
  ('Row2-1', 1, 2),
  ('Row2-2', 2, 2),
  ('Row2-3', 3, 2),
  ('Row2-4', 4, 2),
  ('Row3-1', 1, 3),
  ('Row3-2', 2, 3),
  ('Row3-3', 3, 3),
  ('Row3-4', 4, 3);

INSERT INTO products (name, batch_number, quantity, expiration_date, zone_id)
VALUES
  ('Basmati Rice 5kg', 'BR-2025-01', 12, '2026-01-20', (SELECT id FROM zones WHERE name = 'Top A')),
  ('Tomato Sauce 750ml', 'TS-2025-11', 24, '2025-10-01', (SELECT id FROM zones WHERE name = 'Row2-1')),
  ('Olive Oil 1L', 'OO-2026-02', 8, '2026-08-15', (SELECT id FROM zones WHERE name = 'Top B')),
  ('Canned Beans', 'CB-2025-04', 40, '2027-02-11', (SELECT id FROM zones WHERE name = 'Row3-2'));
