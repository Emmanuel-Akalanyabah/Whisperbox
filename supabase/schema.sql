-- ================================================================
-- WhisperBox — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'dark',
  allow_anonymous BOOLEAN DEFAULT true,
  message_count INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX profiles_username_idx ON profiles(username);

-- MESSAGES
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_reported BOOLEAN DEFAULT false,
  is_spam BOOLEAN DEFAULT false,
  reply TEXT,
  reactions JSONB DEFAULT '{}',
  sender_ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX messages_recipient_idx ON messages(recipient_id);
CREATE INDEX messages_created_idx ON messages(created_at DESC);

-- REPORTS
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX notifications_user_idx ON notifications(user_id, is_read);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipients view own messages" ON messages FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Anyone can send messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Recipients update own messages" ON messages FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Recipients delete own messages" ON messages FOR DELETE USING (auth.uid() = recipient_id);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can report" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view reports" ON reports FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins update reports" ON reports FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifs" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifs" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ================================================================
-- FUNCTIONS & TRIGGERS
-- ================================================================

-- Auto-increment message count
CREATE OR REPLACE FUNCTION increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET message_count = message_count + 1 WHERE id = NEW.recipient_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_message_insert AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION increment_message_count();

-- Increment profile views via RPC
CREATE OR REPLACE FUNCTION increment_profile_views(username TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET profile_views = profile_views + 1 WHERE profiles.username = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Send notification on new message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, body, metadata)
  VALUES (NEW.recipient_id, 'new_message', 'New anonymous message!', 'Someone sent you a whisper.', jsonb_build_object('message_id', NEW.id));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_new_message_notify AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION notify_new_message();
