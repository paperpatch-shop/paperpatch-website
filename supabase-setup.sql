-- Paperpatch Database Setup for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  item JSONB NOT NULL,
  shipping JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bkash')),
  bkash_transaction_id TEXT,
  shipping_cost INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we're using anon key)
-- In production, you should implement proper authentication
CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for poster images
-- Note: This needs to be done via Supabase Dashboard
-- 1. Go to Storage
-- 2. Create new bucket: 'poster-images'
-- 3. Make it public
-- 4. Set allowed MIME types: image/jpeg, image/png

-- Optional: Create a function to get order statistics
CREATE OR REPLACE FUNCTION get_order_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_orders', COUNT(*),
    'pending_orders', COUNT(*) FILTER (WHERE status = 'pending'),
    'approved_orders', COUNT(*) FILTER (WHERE status = 'approved'),
    'rejected_orders', COUNT(*) FILTER (WHERE status = 'rejected'),
    'completed_orders', COUNT(*) FILTER (WHERE status = 'completed'),
    'total_revenue', COALESCE(SUM(total_amount) FILTER (WHERE status IN ('approved', 'completed')), 0)
  ) INTO result
  FROM orders;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a function to clean up old rejected orders (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_rejected_orders()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM orders
  WHERE status = 'rejected'
    AND created_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a view for admin dashboard (optional)
CREATE OR REPLACE VIEW admin_order_summary AS
SELECT 
  id,
  order_number,
  (item->>'width')::INTEGER as width,
  (item->>'height')::INTEGER as height,
  (item->>'withBoard')::BOOLEAN as with_board,
  (item->>'price')::INTEGER as poster_price,
  (shipping->>'name') as customer_name,
  (shipping->>'phone') as customer_phone,
  (shipping->>'city') as city,
  payment_method,
  total_amount,
  status,
  created_at,
  approved_at
FROM orders
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON admin_order_summary TO anon, authenticated;
