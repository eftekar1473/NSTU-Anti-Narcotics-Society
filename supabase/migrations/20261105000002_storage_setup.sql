-- ==============================================================================
-- NSTUANS Storage Buckets Setup
-- Migration ID: 20261105000002_storage_setup.sql
-- Buckets: site-assets, event-images, leader-profiles, gallery-images, publications
-- ==============================================================================

-- Insert storage buckets if not already existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('site-assets', 'site-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('event-images', 'event-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('leader-profiles', 'leader-profiles', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('gallery-images', 'gallery-images', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('publications', 'publications', true, 26214400, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
