-- ==============================================================================
-- NSTUANS Website Database Schema Migration
-- Migration ID: 20261105000001_initial_schema.sql
-- Database: PostgreSQL 14+ (Supabase)
-- Purpose: Complete Relational Schema for NSTUANS Official Website (17 Tables)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. Helper Functions & Triggers
-- ==============================================================================

-- Trigger function to automatically update `updated_at` timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. Core Tables
-- ==============================================================================

-- 1. admin_profiles: Authorized admin user roles and identity
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. site_settings: Global website branding, contact info, and configuration
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'NSTU Anti-Narcotics Society',
    site_short_name TEXT NOT NULL DEFAULT 'NSTUANS',
    motto TEXT NOT NULL DEFAULT 'Say No to Drugs, Say Yes to Life.',
    logo_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    office_address TEXT NOT NULL DEFAULT 'Noakhali Science and Technology University, Sonapur, Noakhali-3814',
    facebook_url TEXT,
    linkedin_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. pages: Dynamic editable static pages (About, Mission, Vision, etc.)
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    meta_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. goals: 7 Organizational Goals and 7 Research Goals
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_type TEXT NOT NULL CHECK (goal_type IN ('organizational', 'research')),
    goal_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_goal_type_number UNIQUE (goal_type, goal_number)
);

-- 5. history_entries: Historical milestones and foundation journey
CREATE TABLE IF NOT EXISTS history_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_order INT NOT NULL DEFAULT 0,
    title TEXT NOT NULL,
    date_or_year TEXT NOT NULL,
    description TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. events: Awareness rallies, keynote seminars, exhibitions
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    location TEXT NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- 7. event_images: Supplementary image gallery for specific events
CREATE TABLE IF NOT EXISTS event_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. committee_terms: Annual or biennial terms (e.g. 2025-2026)
CREATE TABLE IF NOT EXISTS committee_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term_name TEXT NOT NULL UNIQUE,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. committee_positions: Configurable leadership titles and ranks
CREATE TABLE IF NOT EXISTS committee_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('advisory', 'executive', 'general')),
    rank_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. committee_members: Advisors, mentors, and executive officers
CREATE TABLE IF NOT EXISTS committee_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_term_id UUID NOT NULL REFERENCES committee_terms(id) ON DELETE CASCADE,
    position_id UUID REFERENCES committee_positions(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    session TEXT,
    student_id TEXT, -- Private field, restricted to admins
    profile_image TEXT,
    biography TEXT,
    email TEXT,      -- Private field, restricted to admins
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. gallery_albums: Photo collections with cover, title, event date
CREATE TABLE IF NOT EXISTS gallery_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image TEXT NOT NULL,
    event_date DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. gallery_images: Individual photos inside albums
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. achievements: Awards, social accolades, and verified campus milestones
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    achievement_date DATE,
    image_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. publications: Research whitepapers, surveys, annual reports
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    abstract TEXT NOT NULL,
    authors TEXT NOT NULL,
    file_url TEXT NOT NULL,
    publication_date DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. contact_messages: Public visitor contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. membership_applications: Student Join Us form submissions
CREATE TABLE IF NOT EXISTS membership_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    department TEXT NOT NULL,
    session TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    motivation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. audit_logs: Administrative action history for security & accountability
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. Automatic Timestamp Triggers
-- ==============================================================================

CREATE TRIGGER trigger_update_admin_profiles_timestamp
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_site_settings_timestamp
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_pages_timestamp
    BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_goals_timestamp
    BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_history_entries_timestamp
    BEFORE UPDATE ON history_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_events_timestamp
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_committee_terms_timestamp
    BEFORE UPDATE ON committee_terms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_committee_positions_timestamp
    BEFORE UPDATE ON committee_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_committee_members_timestamp
    BEFORE UPDATE ON committee_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_gallery_albums_timestamp
    BEFORE UPDATE ON gallery_albums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_achievements_timestamp
    BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_publications_timestamp
    BEFORE UPDATE ON publications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 4. Performance Indexes for Common Queries
-- ==============================================================================

-- Slug lookup indexes (public routes)
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages (slug);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON gallery_albums (slug);
CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications (slug);

-- Public filter & status indexes
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages (status);
CREATE INDEX IF NOT EXISTS idx_events_status_datetime ON events (status, start_datetime);
CREATE INDEX IF NOT EXISTS idx_goals_type_order ON goals (goal_type, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_status ON gallery_albums (status, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_committee_members_term ON committee_members (committee_term_id, display_order);
CREATE INDEX IF NOT EXISTS idx_event_images_event_id ON event_images (event_id, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_album_id ON gallery_images (album_id, display_order);

-- Admin workflow & filter indexes
CREATE INDEX IF NOT EXISTS idx_membership_applications_status ON membership_applications (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages (is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id);
