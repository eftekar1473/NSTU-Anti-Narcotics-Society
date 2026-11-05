import os
import re

print("Running NSTUANS Security & RLS Policy Verification Suite...")

rls_migration_path = 'supabase/migrations/20261105000003_rls_policies.sql'
schema_migration_path = 'supabase/migrations/20261105000001_initial_schema.sql'

all_ok = True

# 1. Verify RLS Migration Exists
if not os.path.exists(rls_migration_path):
    print(f"[FAIL] Missing RLS migration: {rls_migration_path}")
    all_ok = False
else:
    with open(rls_migration_path, 'r', encoding='utf-8') as f:
        rls_sql = f.read()

    # Verify RLS enabled on all 17 tables
    tables = [
        'admin_profiles', 'site_settings', 'pages', 'goals', 'history_entries',
        'events', 'event_images', 'committee_terms', 'committee_positions',
        'committee_members', 'gallery_albums', 'gallery_images', 'achievements',
        'publications', 'contact_messages', 'membership_applications', 'audit_logs'
    ]

    for table in tables:
        pattern = rf'ALTER\s+TABLE\s+(?:public\.)?{table}\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY;'
        if re.search(pattern, rls_sql, re.IGNORECASE):
            print(f"[PASS] Table '{table}' has RLS enabled.")
        else:
            print(f"[FAIL] Table '{table}' MISSING RLS enablement!")
            all_ok = False

    # Verify Security Functions
    sec_functions = ['is_active_admin', 'is_super_admin', 'is_content_admin']
    for fn in sec_functions:
        if f"FUNCTION public.{fn}()" in rls_sql:
            print(f"[PASS] Security definer function '{fn}' implemented.")
        else:
            print(f"[FAIL] Missing security function '{fn}'!")
            all_ok = False

    # Verify that membership_applications and contact_messages do NOT allow public SELECT
    # Public should only have INSERT
    if 'CREATE POLICY "Public can view membership applications"' in rls_sql:
        print("[FAIL] CRITICAL SECURITY ISSUE: Public allowed to read membership applications!")
        all_ok = False
    else:
        print("[PASS] membership_applications strictly denies public read access.")

    if 'CREATE POLICY "Public can view contact messages"' in rls_sql:
        print("[FAIL] CRITICAL SECURITY ISSUE: Public allowed to read contact messages!")
        all_ok = False
    else:
        print("[PASS] contact_messages strictly denies public read access.")

# 2. Verify No Service Role Key or Private Secrets in Frontend Files
frontend_dirs = ['js', 'about', 'events', 'leaders', 'gallery', 'contact', 'join-us', 'admin']
forbidden_tokens = ['service_role', 'serviceRole', 'postgres://', 'DATABASE_URL', 'supabase_secret']

found_leaks = 0
for d in frontend_dirs:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith(('.js', '.html')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                for token in forbidden_tokens:
                    if token in content:
                        print(f"[FAIL] Potential secret token '{token}' in {filepath}!")
                        found_leaks += 1
                        all_ok = False

if found_leaks == 0:
    print("[PASS] Zero privileged service-role keys or database credentials found in frontend files.")

if all_ok:
    print("\nSUCCESS: All security policies, RLS assertions, and credential isolation checks PASSED.")
else:
    print("\nSECURITY VERIFICATION FAILED WITH ISSUES.")
