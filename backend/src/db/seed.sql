-- Sample seed data
-- Replace password_hash with a bcrypt hash before use.

INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin User', 'admin@example.com', 'REPLACE_WITH_BCRYPT_HASH', 'admin'),
  ('Warehouse User', 'user@example.com', 'REPLACE_WITH_BCRYPT_HASH', 'user');

WITH admin_user AS (
  SELECT id AS user_id FROM users WHERE email = 'admin@example.com'
)
INSERT INTO zones (user_id, name, position_x, position_y)
SELECT admin_user.user_id, 'Top A', 1, 1 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Top B', 2, 1 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Top C', 3, 1 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Top D', 4, 1 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row2-1', 1, 2 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row2-2', 2, 2 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row2-3', 3, 2 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row2-4', 4, 2 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row2-5', 5, 2 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row3-1', 1, 3 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row3-2', 2, 3 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row3-3', 3, 3 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row3-4', 4, 3 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row3-5', 5, 3 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row4-1', 1, 4 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row4-2', 2, 4 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row4-3', 3, 4 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row4-4', 4, 4 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row4-5', 5, 4 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row5-1', 1, 5 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row5-2', 2, 5 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row5-3', 3, 5 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row5-4', 4, 5 FROM admin_user
UNION ALL SELECT admin_user.user_id, 'Row5-5', 5, 5 FROM admin_user;

WITH admin_user AS (
  SELECT id AS user_id FROM users WHERE email = 'admin@example.com'
)
INSERT INTO products (user_id, name, batch_number, quantity, expiration_date, zone_id)
SELECT
  admin_user.user_id,
  'Basmati Rice 5kg',
  'BR-2025-01',
  12,
  '2026-01-20',
  (SELECT id FROM zones WHERE name = 'Top A' AND user_id = admin_user.user_id)
FROM admin_user
UNION ALL
SELECT
  admin_user.user_id,
  'Tomato Sauce 750ml',
  'TS-2025-11',
  24,
  '2025-10-01',
  (SELECT id FROM zones WHERE name = 'Row2-1' AND user_id = admin_user.user_id)
FROM admin_user
UNION ALL
SELECT
  admin_user.user_id,
  'Olive Oil 1L',
  'OO-2026-02',
  8,
  '2026-08-15',
  (SELECT id FROM zones WHERE name = 'Top B' AND user_id = admin_user.user_id)
FROM admin_user
UNION ALL
SELECT
  admin_user.user_id,
  'Canned Beans',
  'CB-2025-04',
  40,
  '2027-02-11',
  (SELECT id FROM zones WHERE name = 'Row3-2' AND user_id = admin_user.user_id)
FROM admin_user;
