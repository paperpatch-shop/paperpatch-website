-- Create prices table
CREATE TABLE IF NOT EXISTS prices (
  id TEXT PRIMARY KEY DEFAULT 'default',
  sizes JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read prices
CREATE POLICY "Anyone can read prices" ON prices
  FOR SELECT TO public
  USING (true);

-- Allow anyone to insert/update prices (you can restrict this later)
CREATE POLICY "Anyone can update prices" ON prices
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);

-- Insert default prices
INSERT INTO prices (id, sizes) VALUES (
  'default',
  '[
    {"label": "12\" × 8\"", "width": 12, "height": 8, "priceWithoutBoard": 350, "priceWithBoard": 450},
    {"label": "18\" × 12\"", "width": 18, "height": 12, "priceWithoutBoard": 550, "priceWithBoard": 700},
    {"label": "24\" × 16\"", "width": 24, "height": 16, "priceWithoutBoard": 850, "priceWithBoard": 1050},
    {"label": "35\" × 24\"", "width": 35, "height": 24, "priceWithoutBoard": 1500}
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
