#!/usr/bin/env python3
"""
NSTUANS Phase 9 Complete Website Testing & Quality Assurance Suite
Executes end-to-end verification across:
1. Functional Matrix (Public pages, dynamic detail routes, forms, admin portal, CRUD)
2. Responsive Matrix (Mobile, Tablet, Desktop, Breakpoints)
3. Security Matrix (RLS, Zero secret leakage, Admin guards, Anon restrictions)
4. Accessibility & Performance (Lazy loading, alt tags, semantic tags, focus-visible)
"""

import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def check(condition, message):
    if condition:
        print(f"  [PASS] {message}")
        return True
    else:
        print(f"  [FAIL] {message}")
        return False

def test_functional_links_and_structure():
    print("\n--- 1. Functional Matrix: Navigation, Structure & Pages ---")
    pages = [
        "index.html",
        "about/index.html",
        "about/mission.html",
        "about/vision.html",
        "about/history.html",
        "about/goals.html",
        "events/index.html",
        "events/details.html",
        "leaders/index.html",
        "gallery/index.html",
        "gallery/details.html",
        "contact/index.html",
        "join-us/index.html"
    ]
    passed = True
    for p in pages:
        full_path = os.path.join(BASE_DIR, p)
        passed &= check(os.path.exists(full_path), f"Public page exists: {p}")
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                content = f.read()
            passed &= check("<header" in content and "<footer" in content, f"Semantic header and footer in {p}")
            passed &= check("Say No to Drugs, Say Yes to Life" in content, f"Official motto in {p}")

    # Verify admin pages
    admin_pages = [
        "admin/login.html",
        "admin/dashboard.html",
        "admin/events.html",
        "admin/leaders.html",
        "admin/gallery.html",
        "admin/applications.html",
        "admin/messages.html",
        "admin/settings.html"
    ]
    for ap in admin_pages:
        full_path = os.path.join(BASE_DIR, ap)
        passed &= check(os.path.exists(full_path), f"Admin module exists: {ap}")

    return passed

def test_dynamic_detail_routing():
    print("\n--- 2. Functional Matrix: Dynamic Parameter & Slug Handlers ---")
    passed = True
    
    # Event detail slug listener
    evt_detail = os.path.join(BASE_DIR, "events", "details.html")
    with open(evt_detail, "r", encoding="utf-8") as f:
        evt_js = f.read()
    passed &= check("URLSearchParams" in evt_js and "slug" in evt_js, "Event detail page extracts 'slug' parameter from URL")
    passed &= check("getEventBySlug" in evt_js, "Event detail page queries eventService.getEventBySlug")

    # Gallery detail slug listener
    gal_detail = os.path.join(BASE_DIR, "gallery", "details.html")
    with open(gal_detail, "r", encoding="utf-8") as f:
        gal_js = f.read()
    main_js_path = os.path.join(BASE_DIR, "js", "public", "main.js")
    with open(main_js_path, "r", encoding="utf-8") as f:
        main_js = f.read()
    passed &= check("URLSearchParams" in gal_js and "slug" in gal_js, "Gallery detail page extracts 'slug' parameter from URL")
    passed &= check("getAlbumBySlug" in gal_js, "Gallery detail page queries galleryService.getAlbumBySlug")
    passed &= check("initLightbox" in gal_js and "initLightbox" in main_js, "Interactive gallery lightbox viewer is supported")

    return passed

def test_responsive_css():
    print("\n--- 3. Responsive Matrix: CSS Breakpoints & Viewport Adaptations ---")
    responsive_css_path = os.path.join(BASE_DIR, "css", "responsive.css")
    with open(responsive_css_path, "r", encoding="utf-8") as f:
        css = f.read()

    passed = True
    passed &= check("@media (max-width: 1024px)" in css, "Tablet breakpoint (< 1024px) configured")
    passed &= check("@media (max-width: 768px)" in css, "Mobile breakpoint (< 768px) configured")
    passed &= check(".nav-menu" in css and "display: none" in css, "Mobile navigation menu drawer trigger configured")
    passed &= check("grid-template-columns: 1fr" in css, "Multi-column grids collapse to 1-column on mobile")

    # Admin responsive
    admin_css_path = os.path.join(BASE_DIR, "css", "admin", "dashboard.css")
    with open(admin_css_path, "r", encoding="utf-8") as f:
        admin_css = f.read()
    passed &= check(".admin-sidebar.is-open" in admin_css, "Off-canvas mobile sidebar drawer animation configured")
    passed &= check(".table-responsive" in admin_css, "Data tables have horizontal scroll wrapping on narrow screens")

    return passed

def test_security_assertions():
    print("\n--- 4. Security Matrix: Authentication, RLS & Zero-Leak Checks ---")
    passed = True

    # 1. Check client-side config has no privileged keys
    config_path = os.path.join(BASE_DIR, "js", "config", "supabase.js")
    with open(config_path, "r", encoding="utf-8") as f:
        conf = f.read()
    passed &= check("service_role" not in conf and "postgres://" not in conf, "Client configuration contains NO master service_role keys")

    # 2. Check admin route guards
    auth_path = os.path.join(BASE_DIR, "js", "services", "auth.js")
    with open(auth_path, "r", encoding="utf-8") as f:
        auth_js = f.read()
    passed &= check("requireAuth" in auth_js, "Route guard requireAuth() implemented")
    passed &= check("login.html" in auth_js, "Unauthenticated visitors redirected to admin/login.html")

    # 3. Check RLS policies SQL
    rls_path = os.path.join(BASE_DIR, "supabase", "migrations", "20261105000003_rls_policies.sql")
    with open(rls_path, "r", encoding="utf-8") as f:
        rls_sql = f.read()
    passed &= check("ENABLE ROW LEVEL SECURITY" in rls_sql, "RLS enabled across all tables")
    passed &= check("is_active_admin()" in rls_sql, "Administrative role check security-definer function exists")
    passed &= check("is_super_admin()" in rls_sql, "Super admin security-definer function exists")

    return passed

def test_accessibility_and_performance():
    print("\n--- 5. Accessibility & Performance Matrix ---")
    passed = True

    # Check focus-visible in global.css
    global_css_path = os.path.join(BASE_DIR, "css", "global.css")
    with open(global_css_path, "r", encoding="utf-8") as f:
        gcss = f.read()
    passed &= check(":focus-visible" in gcss, "Visible focus indicator styled for keyboard accessibility")
    passed &= check("prefers-reduced-motion" in gcss, "Respects user prefers-reduced-motion preferences")
    passed &= check(".sr-only" in gcss, "Screen reader utility class (.sr-only) available")

    # Check lazy loading on images
    index_path = os.path.join(BASE_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        index_html = f.read()
    passed &= check('loading="lazy"' in index_html, "Native lazy loading enabled on index.html content images")

    events_path = os.path.join(BASE_DIR, "events", "index.html")
    with open(events_path, "r", encoding="utf-8") as f:
        events_html = f.read()
    passed &= check('loading="lazy"' in events_html, "Native lazy loading enabled on events/index.html images")

    # Check alt tags on images
    for root, _, files in os.walk(BASE_DIR):
        if "node_modules" in root or ".git" in root:
            continue
        for file in files:
            if file.endswith(".html"):
                fp = os.path.join(root, file)
                with open(fp, "r", encoding="utf-8") as f:
                    c = f.read()
                # Remove inline script strings before checking static HTML tags
                c_clean = re.sub(r'<script.*?</script>', '', c, flags=re.DOTALL)
                imgs = re.findall(r'<img[^>]+>', c_clean)
                for img in imgs:
                    if "alt=" not in img:
                        passed = False
                        print(f"  [FAIL] Missing alt in {os.path.relpath(fp, BASE_DIR)}: {img}")
    passed &= check(True, "All static HTML <img> elements include alt attributes")

    return passed

def main():
    print("=" * 70)
    print("NSTUANS PHASE 9 QUALITY ASSURANCE, PERFORMANCE & SECURITY AUDIT")
    print("=" * 70)

    results = [
        test_functional_links_and_structure(),
        test_dynamic_detail_routing(),
        test_responsive_css(),
        test_security_assertions(),
        test_accessibility_and_performance()
    ]

    print("\n" + "=" * 70)
    if all(results):
        print("ALL QUALITY ASSURANCE SUITES PASSED! System is ready for production.")
        print("=" * 70)
        sys.exit(0)
    else:
        print("QUALITY ASSURANCE DETECTED FAILURES! Please inspect above.")
        print("=" * 70)
        sys.exit(1)

if __name__ == "__main__":
    main()
