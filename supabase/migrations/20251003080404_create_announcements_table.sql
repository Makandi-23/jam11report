/*
  # Create announcements table

  1. New Tables
    - `announcements`
      - `id` (uuid, primary key)
      - `title_en` (text) - English title
      - `title_sw` (text) - Swahili title
      - `message_en` (text) - English message content
      - `message_sw` (text) - Swahili message content
      - `category` (text) - Category type (info, warning, urgent, event)
      - `ward_target` (text) - Target ward or 'all'
      - `is_pinned` (boolean) - Pin to top
      - `expires_at` (timestamptz, nullable) - Expiration date
      - `status` (text) - active, expired, archived
      - `created_by` (uuid) - Admin who created
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. New Tables
    - `announcement_reads`
      - `id` (uuid, primary key)
      - `announcement_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `read_at` (timestamptz)

  3. Security
    - Enable RLS on both tables
    - Admins can manage announcements
    - Residents can read active announcements for their ward
    - Residents can track their own read status
*/

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_sw text NOT NULL,
  message_en text NOT NULL,
  message_sw text NOT NULL,
  category text NOT NULL CHECK (category IN ('info', 'warning', 'urgent', 'event')),
  ward_target text NOT NULL DEFAULT 'all',
  is_pinned boolean DEFAULT false,
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'archived')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS announcement_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at timestamptz DEFAULT now(),
  UNIQUE(announcement_id, user_id)
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Residents can view active announcements for their ward"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    status = 'active'
    AND (expires_at IS NULL OR expires_at > now())
    AND (
      ward_target = 'all'
      OR ward_target = (
        SELECT raw_user_meta_data->>'ward'
        FROM auth.users
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view their own read status"
  ON announcement_reads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can mark announcements as read"
  ON announcement_reads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_ward ON announcements(ward_target);
CREATE INDEX idx_announcements_expires ON announcements(expires_at);
CREATE INDEX idx_announcement_reads_user ON announcement_reads(user_id);
CREATE INDEX idx_announcement_reads_announcement ON announcement_reads(announcement_id);