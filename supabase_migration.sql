-- Create the movies table
CREATE TABLE IF NOT EXISTS movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  poster_url TEXT DEFAULT '',
  trailer_url TEXT DEFAULT '',
  telegram_link TEXT DEFAULT '',
  genre TEXT[] DEFAULT '{}',
  release_year INTEGER DEFAULT 2024,
  rating NUMERIC(3,1) DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('movie', 'series')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on type for filtering
CREATE INDEX IF NOT EXISTS idx_movies_type ON movies(type);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_movies_created_at ON movies(created_at DESC);

-- Enable Row Level Security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read movies" ON movies
  FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert movies" ON movies
  FOR INSERT TO authenticated WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update movies" ON movies
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete movies" ON movies
  FOR DELETE TO authenticated USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for posters (run in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('posters', 'posters', true);
