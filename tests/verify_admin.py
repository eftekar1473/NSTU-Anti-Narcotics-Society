import os
import re

admin_pages = [
    'admin/login.html',
    'admin/dashboard.html',
    'admin/events.html',
    'admin/leaders.html',
    'admin/gallery.html',
    'admin/applications.html',
    'admin/messages.html',
    'admin/settings.html'
]

print(f"Checking {len(admin_pages)} Admin Dashboard pages...")
all_ok = True

for page in admin_pages:
    if not os.path.exists(page):
        print(f"[FAIL] Missing page: {page}")
        all_ok = False
        continue

    with open(page, 'r', encoding='utf-8') as f:
        html = f.read()

    base_dir = os.path.dirname(page)

    # Check stylesheets
    css_links = re.findall(r'<link[^>]+href=["\']([^"\']+\.css)["\']', html)
    for css in css_links:
        if css.startswith('http'): continue
        resolved = os.path.normpath(os.path.join(base_dir, css))
        if not os.path.exists(resolved):
            print(f"[FAIL] Broken CSS in {page}: {css} -> {resolved}")
            all_ok = False

    # Check script files
    js_links = re.findall(r'<script[^>]+src=["\']([^"\']+\.js)["\']', html)
    for js in js_links:
        if js.startswith('http'): continue
        resolved = os.path.normpath(os.path.join(base_dir, js))
        if not os.path.exists(resolved):
            print(f"[FAIL] Broken script in {page}: {js} -> {resolved}")
            all_ok = False

    # Check images
    html_no_scripts = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html_no_scripts)
    for src in img_srcs:
        if src.startswith('http') or not src.strip(): continue
        resolved = os.path.normpath(os.path.join(base_dir, src))
        if not os.path.exists(resolved):
            print(f"[FAIL] Broken image in {page}: {src} -> {resolved}")
            all_ok = False

    print(f"[PASS] {page} verified.")

if all_ok:
    print("\nSUCCESS: All Admin Dashboard pages and assets verified successfully!")
else:
    print("\nADMIN VERIFICATION FAILED WITH ISSUES.")
