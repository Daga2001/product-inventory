-- PostgreSQL schema for Inventory Management
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position_x INT NOT NULL,
  position_y INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name),
  UNIQUE (user_id, position_x, position_y)
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 0),
  expiration_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL
);

-- Idempotent upgrades for existing databases
ALTER TABLE zones ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE zones DROP CONSTRAINT IF EXISTS zones_name_key;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'zones_user_id_fkey') THEN
    ALTER TABLE zones ADD CONSTRAINT zones_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'zones_user_name_key') THEN
    ALTER TABLE zones ADD CONSTRAINT zones_user_name_key UNIQUE (user_id, name);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'zones_user_position_key') THEN
    ALTER TABLE zones ADD CONSTRAINT zones_user_position_key UNIQUE (user_id, position_x, position_y);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'user_id') THEN
    IF NOT EXISTS (SELECT 1 FROM zones WHERE user_id IS NULL) THEN
      ALTER TABLE zones ALTER COLUMN user_id SET NOT NULL;
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_user_id_fkey') THEN
    ALTER TABLE products ADD CONSTRAINT products_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_zone_id_fkey') THEN
    ALTER TABLE products ADD CONSTRAINT products_zone_id_fkey
      FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'user_id') THEN
    IF NOT EXISTS (SELECT 1 FROM products WHERE user_id IS NULL) THEN
      ALTER TABLE products ALTER COLUMN user_id SET NOT NULL;
    END IF;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_zones_user_id ON zones (user_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_products_batch_number ON products (batch_number);
CREATE INDEX IF NOT EXISTS idx_products_expiration_date ON products (expiration_date);
CREATE INDEX IF NOT EXISTS idx_products_zone_id ON products (zone_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products (user_id);
