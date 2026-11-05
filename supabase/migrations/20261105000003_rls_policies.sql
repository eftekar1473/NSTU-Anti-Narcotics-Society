-- ==============================================================================
-- NSTUANS Row Level Security (RLS) Policies & Storage Security
-- Migration ID: 20261105000003_rls_policies.sql
-- Database: PostgreSQL 14+ (Supabase)
-- Purpose: Complete security hardening, role verification functions, and granular RLS
-- ==============================================================================

-- ==============================================================================
-- 1. Helper Security Functions (Running in Security Definer Context)
-- ==============================================================================

-- Check if current authenticated user is an active admin (either role)
CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current authenticated user is a Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
          AND role = 'super_admin'
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current authenticated user is a Content Admin or higher
CREATE OR REPLACE FUNCTION public.is_content_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'content_admin')
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 2. Enable RLS on ALL 17 Tables
-- ==============================================================================

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. Granular Policies for Each Table
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 3.1 admin_profiles
-- ------------------------------------------------------------------------------
-- Super Admins have full access to view and manage admin profiles
CREATE POLICY "Super admin can manage admin profiles"
    ON public.admin_profiles
    FOR ALL
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- Individual admins can view their own profile
CREATE POLICY "Admins can view their own profile"
    ON public.admin_profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- ------------------------------------------------------------------------------
-- 3.2 site_settings
-- ------------------------------------------------------------------------------
-- Public can read site settings
CREATE POLICY "Public can view site settings"
    ON public.site_settings
    FOR SELECT
    TO anon, authenticated
    USING (TRUE);

-- Super Admins can update site settings
CREATE POLICY "Super admins can update site settings"
    ON public.site_settings
    FOR UPDATE
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 3.3 pages
-- ------------------------------------------------------------------------------
-- Public can view published pages only
CREATE POLICY "Public can view published pages"
    ON public.pages
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_active_admin());

-- Content Admins and Super Admins can manage pages
CREATE POLICY "Admins can manage pages"
    ON public.pages
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

-- ------------------------------------------------------------------------------
-- 3.4 goals
-- ------------------------------------------------------------------------------
-- Public can view active goals
CREATE POLICY "Public can view active goals"
    ON public.goals
    FOR SELECT
    TO anon, authenticated
    USING (is_active = TRUE OR public.is_active_admin());

-- Admins can manage goals
CREATE POLICY "Admins can manage goals"
    ON public.goals
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

-- ------------------------------------------------------------------------------
-- 3.5 history_entries
-- ------------------------------------------------------------------------------
-- Public can view published and verified history milestones
CREATE POLICY "Public can view verified history"
    ON public.history_entries
    FOR SELECT
    TO anon, authenticated
    USING ((status = 'published' AND is_verified = TRUE) OR public.is_active_admin());

-- Admins can manage history entries
CREATE POLICY "Admins can manage history entries"
    ON public.history_entries
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

-- ------------------------------------------------------------------------------
-- 3.6 events & 3.7 event_images
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published events"
    ON public.events
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_active_admin());

CREATE POLICY "Admins can manage events"
    ON public.events
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

CREATE POLICY "Public can view event images for published events"
    ON public.event_images
    FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_images.event_id
              AND (events.status = 'published' OR public.is_active_admin())
        )
    );

CREATE POLICY "Admins can manage event images"
    ON public.event_images
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

-- ------------------------------------------------------------------------------
-- 3.8 committee_terms & 3.9 committee_positions & 3.10 committee_members
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view committee terms"
    ON public.committee_terms
    FOR SELECT
    TO anon, authenticated
    USING (TRUE);

CREATE POLICY "Admins can manage committee terms"
    ON public.committee_terms
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

CREATE POLICY "Public can view committee positions"
    ON public.committee_positions
    FOR SELECT
    TO anon, authenticated
    USING (TRUE);

CREATE POLICY "Admins can manage committee positions"
    ON public.committee_positions
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

CREATE POLICY "Public can view active verified committee members"
    ON public.committee_members
    FOR SELECT
    TO anon, authenticated
    USING ((is_active = TRUE AND is_verified = TRUE) OR public.is_active_admin());

CREATE POLICY "Admins can manage committee members"
    ON public.committee_members
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

-- ------------------------------------------------------------------------------
-- 3.11 gallery_albums & 3.12 gallery_images
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published gallery albums"
    ON public.gallery_albums
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_active_admin());

CREATE POLICY "Admins can manage gallery albums"
    ON public.gallery_albums
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

CREATE POLICY "Public can view gallery images for published albums"
    ON public.gallery_images
    FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.gallery_albums
            WHERE gallery_albums.id = gallery_images.album_id
              AND (gallery_albums.status = 'published' OR public.is_active_admin())
        )
    );

CREATE POLICY "Admins can manage gallery images"
    ON public.gallery_images
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

-- ------------------------------------------------------------------------------
-- 3.13 achievements & 3.14 publications
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view published verified achievements"
    ON public.achievements
    FOR SELECT
    TO anon, authenticated
    USING ((status = 'published' AND is_verified = TRUE) OR public.is_active_admin());

CREATE POLICY "Admins can manage achievements"
    ON public.achievements
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

CREATE POLICY "Public can view published publications"
    ON public.publications
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_active_admin());

CREATE POLICY "Admins can manage publications"
    ON public.publications
    FOR ALL
    TO authenticated
    USING (public.is_content_admin())
    WITH CHECK (public.is_content_admin());

-- ------------------------------------------------------------------------------
-- 3.15 contact_messages
-- ------------------------------------------------------------------------------
-- Public can submit messages (INSERT only)
CREATE POLICY "Public can submit contact messages"
    ON public.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(trim(full_name)) > 0
        AND length(trim(email)) > 3
        AND length(trim(message)) >= 5
    );

-- Only authenticated admins can read, update, or archive messages
CREATE POLICY "Admins can read contact messages"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (public.is_active_admin());

CREATE POLICY "Admins can update contact messages"
    ON public.contact_messages
    FOR UPDATE
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

CREATE POLICY "Admins can delete contact messages"
    ON public.contact_messages
    FOR DELETE
    TO authenticated
    USING (public.is_active_admin());

-- ------------------------------------------------------------------------------
-- 3.16 membership_applications
-- ------------------------------------------------------------------------------
-- Public can submit applications (INSERT only). Strict data protection: Public CANNOT read applications!
CREATE POLICY "Public can submit membership applications"
    ON public.membership_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(trim(full_name)) > 0
        AND length(trim(student_id)) > 0
        AND length(trim(department)) > 0
        AND length(trim(email)) > 3
    );

-- Only authorized admins can read or review membership applications
CREATE POLICY "Admins can read membership applications"
    ON public.membership_applications
    FOR SELECT
    TO authenticated
    USING (public.is_active_admin());

CREATE POLICY "Admins can review membership applications"
    ON public.membership_applications
    FOR UPDATE
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- ------------------------------------------------------------------------------
-- 3.17 audit_logs
-- ------------------------------------------------------------------------------
-- Admins can append audit logs
CREATE POLICY "Admins can insert audit logs"
    ON public.audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_active_admin());

-- Only Super Admins can inspect audit logs
CREATE POLICY "Super admins can view audit logs"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (public.is_super_admin());

-- ==============================================================================
-- 4. Supabase Storage Policies
-- ==============================================================================

-- Public can read assets from public buckets
CREATE POLICY "Public can read assets from public buckets"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id IN ('site-assets', 'event-images', 'leader-profiles', 'gallery-images', 'publications'));

-- Only active admins can upload assets
CREATE POLICY "Admins can upload assets to buckets"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id IN ('site-assets', 'event-images', 'leader-profiles', 'gallery-images', 'publications')
        AND public.is_active_admin()
    );

-- Only active admins can update or delete storage assets
CREATE POLICY "Admins can modify storage assets"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

CREATE POLICY "Admins can delete storage assets"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (public.is_active_admin());
