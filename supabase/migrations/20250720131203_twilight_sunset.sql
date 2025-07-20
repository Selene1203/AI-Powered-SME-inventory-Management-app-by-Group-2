/*
  # Initial Schema for AI-Powered SME Inventory Management

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `code` (text, unique user identifier)
      - `name` (text)
      - `email` (text, unique)
      - `business_name` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `user_code` (text, foreign key to users.code)
      - `name` (text)
      - `sku` (text)
      - `price` (numeric)
      - `current_stock` (integer)
      - `category` (text)
      - `image` (text, nullable)
      - `reorder_level` (integer)
      - `last_sold` (timestamp, nullable)
      - `created_at` (timestamp)
    
    - `sales`
      - `id` (uuid, primary key)
      - `user_code` (text, foreign key to users.code)
      - `product_id` (uuid, foreign key to products.id)
      - `quantity` (integer)
      - `total_amount` (numeric)
      - `timestamp` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  business_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code text NOT NULL REFERENCES users(code),
  name text NOT NULL,
  sku text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  current_stock integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'General',
  image text,
  reorder_level integer NOT NULL DEFAULT 10,
  last_sold timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code text NOT NULL REFERENCES users(code),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  total_amount numeric NOT NULL DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for products table
CREATE POLICY "Users can read own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (user_code IN (SELECT code FROM users WHERE id::text = auth.uid()::text));

CREATE POLICY "Users can insert own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (user_code IN (SELECT code FROM users WHERE id::text = auth.uid()::text));

CREATE POLICY "Users can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (user_code IN (SELECT code FROM users WHERE id::text = auth.uid()::text));

-- Create policies for sales table
CREATE POLICY "Users can read own sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (user_code IN (SELECT code FROM users WHERE id::text = auth.uid()::text));

CREATE POLICY "Users can insert own sales"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (user_code IN (SELECT code FROM users WHERE id::text = auth.uid()::text));

-- Insert sample data
INSERT INTO users (code, name, email, business_name) VALUES
  ('user_001', 'Maria Santos', 'maria@yaronapharmacy.com', 'Yarona Pharmacy'),
  ('user_002', 'John Dela Cruz', 'john@healthplus.com', 'HealthPlus Clinic')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (user_code, name, sku, price, current_stock, category, reorder_level, last_sold) VALUES
  ('user_001', 'Paracetamol 500mg', 'MED-1234', 24.00, 8, 'Prescription', 20, '2024-01-15'),
  ('user_001', 'Amoxicillin 250mg', 'MED-5678', 35.50, 15, 'Prescription', 25, '2024-01-14'),
  ('user_001', 'Vitamin C 1000mg', 'VIT-9012', 18.75, 5, 'OTC', 30, '2024-01-13'),
  ('user_001', 'Ibuprofen 400mg', 'MED-3456', 28.50, 12, 'OTC', 20, '2024-01-12'),
  ('user_001', 'Insulin Novomix', 'INS-7890', 450.00, 3, 'Prescription', 10, '2024-01-11'),
  ('user_001', 'Ventolin Inhaler', 'INH-2345', 285.00, 0, 'Prescription', 15, '2024-01-10'),
  ('user_002', 'Aspirin 325mg', 'MED-ASP1', 15.00, 45, 'OTC', 25, '2024-01-15')
ON CONFLICT DO NOTHING;

-- Insert sample sales
INSERT INTO sales (user_code, product_id, quantity, total_amount, timestamp) VALUES
  ('user_001', (SELECT id FROM products WHERE sku = 'MED-1234' LIMIT 1), 2, 48.00, '2024-01-15T10:30:00'),
  ('user_001', (SELECT id FROM products WHERE sku = 'MED-5678' LIMIT 1), 1, 35.50, '2024-01-15T11:15:00'),
  ('user_002', (SELECT id FROM products WHERE sku = 'MED-ASP1' LIMIT 1), 3, 45.00, '2024-01-15T09:45:00')
ON CONFLICT DO NOTHING;