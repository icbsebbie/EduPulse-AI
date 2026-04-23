/*
  # Create tasks table

  ## Summary
  Creates the core tasks table for the TaskFlow app. This table stores all
  user-created tasks with support for priorities, due dates, and completion tracking.

  ## New Tables

  ### tasks
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text, not null) - Task title, required
  - `description` (text) - Optional longer description
  - `completed` (boolean) - Whether the task is done, defaults to false
  - `priority` (text) - 'low', 'medium', or 'high', defaults to 'medium'
  - `due_date` (date) - Optional due date
  - `created_at` (timestamptz) - Auto-set on creation
  - `updated_at` (timestamptz) - Auto-updated on modification

  ## Security
  - RLS enabled on tasks table
  - Public read/write access (no auth required for this app)

  ## Notes
  1. A trigger keeps `updated_at` current automatically
  2. Priority is constrained to the three allowed values
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tasks"
  ON tasks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert tasks"
  ON tasks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update tasks"
  ON tasks FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete tasks"
  ON tasks FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks (completed);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks (priority);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks (created_at DESC);
