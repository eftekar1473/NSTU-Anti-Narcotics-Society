import os
import re

pages = [
    'index.html',
    'about/index.html',
    'about/mission.html',
    'about/vision.html',
    'about/history.html',
    'about/goals.html',
    'events/index.html',
    'events/details.html',
    'leaders/index.html',
    'gallery/index.html',
    'gallery/details.html',
    'contact/index.html',
    'join-us/index.html'
]

print(f"Checking {len(pages)} public pages...")
all_ok = True

for page in pages:
    if not os.path.exists(page):
        print(f"[FAIL] Missing file: {page}")
        all_ok = False
        continue

    with open(page, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check navbar items
    nav_matches = re.findall(r'<li class="nav-item[^"]*">(.*?)</li>', html, re.DOTALL)
    order_labels = []
    for item in nav_matches:
        if 'About' in item:
            order_labels.append('About')
        elif 'Events' in item:
            order_labels.append('Events')
        elif 'Leaders' in item:
            order_labels.append('Leaders')
        elif 'Gallery' in item:
            order_labels.append('Gallery')
        elif 'Contact' in item:
            order_labels.append('Contact')
        elif 'Join Us' in item:
            order_labels.append('Join Us')

    expected_order = ['About', 'Events', 'Leaders', 'Gallery', 'Contact', 'Join Us']
    if order_labels == expected_order:
        print(f"[PASS] {page} navbar order is correct.")
    else:
        print(f"[WARN] {page} navbar order mismatch: {order_labels}")
        all_ok = False

    base_dir = os.path.dirname(page)

    # Strip script contents before checking HTML images
    html_no_scripts = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)

    # Check images referenced in HTML markup
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html_no_scripts)
    for src in img_srcs:
        if src.startswith('http') or not src.strip():
            continue
        resolved = os.path.normpath(os.path.join(base_dir, src))
        if not os.path.exists(resolved):
            print(f"[FAIL] Broken image in {page}: {src} -> {resolved}")
            all_ok = False

    # Also check image paths in JS data objects if present
    js_img_srcs = re.findall(r'src:\s*["\']([^"\']+\.(?:jpeg|jpg|png|svg))["\']', html)
    for src in js_img_srcs:
        if src.startswith('http'):
            continue
        resolved = os.path.normpath(os.path.join(base_dir, src))
        if not os.path.exists(resolved):
            print(f"[FAIL] Broken JS data image in {page}: {src} -> {resolved}")
            all_ok = False

    # Check stylesheets
    css_links = re.findall(r'<link[^>]+href=["\']([^"\']+\.css)["\']', html)
    for css in css_links:
        if css.startswith('http'):
            continue
        resolved = os.path.normpath(os.path.join(base_dir, css))
        if not os.path.exists(resolved):
            print(f"[FAIL] Broken CSS in {page}: {css} -> {resolved}")
            all_ok = False

    # Check scripts
    js_links = re.findall(r'<script[^>]+src=["\']([^"\']+\.js)["\']', html)
    for js in js_links:
        if js.startswith('http'):
            continue
        resolved = os.path.normpath(os.path.join(base_dir, js))
        if not os.path.exists(resolved):
            print(f"[FAIL] Broken script in {page}: {js} -> {resolved}")
            all_ok = False

if all_ok:
    print("\nSUCCESS: All 13 public pages verified! Navbar order, links, images, and scripts are intact.")
else:
    print("\nVERIFICATION COMPLETED WITH ISSUES.")
