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
  name TEXT NOT NULL UNIQUE,
  position_x INT NOT NULL,
  position_y INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 0),
  expiration_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_products_batch_number ON products (batch_number);
CREATE INDEX IF NOT EXISTS idx_products_expiration_date ON products (expiration_date);
CREATE INDEX IF NOT EXISTS idx_products_zone_id ON products (zone_id);
