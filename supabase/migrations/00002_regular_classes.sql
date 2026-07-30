-- Regular classes table (recurring, not workshops)
CREATE TABLE regular_classes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  style TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  duration TEXT DEFAULT '60 min',
  price INTEGER NOT NULL,
  level TEXT DEFAULT 'all',
  description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE regular_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view classes"
  ON regular_classes FOR SELECT
  USING (true);

-- Seed some sample regular classes
INSERT INTO regular_classes (title, instructor, style, day, time, duration, price, level, description) VALUES
  ('Hip Hop Foundations', 'Gayatri Mane', 'hip', 'Monday', '07:00 PM – 08:00 PM', '60 min', 499, 'beginner', 'Learn the fundamentals of hip hop – grooves, isolations, and basic combos.'),
  ('Contemporary Flow', 'Sarang Lokhande', 'con', 'Tuesday', '06:00 PM – 07:30 PM', '90 min', 699, 'intermediate', 'Expressive movement focusing on floor work, release technique, and emotional storytelling.'),
  ('Bollywood Beats', 'Gayatri Mane', 'bol', 'Wednesday', '07:00 PM – 08:00 PM', '60 min', 499, 'all', 'High-energy Bollywood choreography set to the latest tracks.'),
  ('Heels & Confidence', 'Sarang Lokhande', 'hee', 'Thursday', '07:00 PM – 08:30 PM', '90 min', 799, 'intermediate', 'Build stage presence and confidence in heels. Technique + choreography.'),
  ('Kids Dance (Ages 7–12)', 'Gayatri Mane', 'kid', 'Saturday', '10:00 AM – 11:00 AM', '60 min', 399, 'beginner', 'Fun introduction to dance for kids – hip hop, Bollywood, and creative movement.'),
  ('Open Floor Practice', 'Staff', 'fre', 'Sunday', '04:00 PM – 06:00 PM', '120 min', 299, 'all', 'Unsupervised practice session with sound system. Bring your own routine.');
