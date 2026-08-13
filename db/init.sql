CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO todos (title, done) VALUES
  ('Học Docker', true),
  ('Deploy backend lên server B', false),
  ('Kết nối PostgreSQL', false);
