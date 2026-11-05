import glob
import re

target_files = [
    'index.html',
    'about/index.html',
    'events/index.html',
    'events/details.html',
    'leaders/index.html',
    'gallery/index.html'
]

for file_path in target_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    def add_lazy(match):
        tag = match.group(0)
        if 'loading=' in tag:
            return tag
        if 'club logo' in tag.lower() or 'logo' in tag.lower():
            return tag
        # Insert loading="lazy" right after <img
        return tag[:4] + ' loading="lazy"' + tag[4:]

    new_content = re.sub(r'<img[^>]+>', add_lazy, content)
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Updated lazy loading in:', file_path)

print('Lazy loading update completed.')
