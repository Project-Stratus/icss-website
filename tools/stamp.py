"""Copy partials/taskbar.html and partials/footer.html into every page.

Plain HTML site, no build step: each page keeps a full copy of the taskbar and
footer between BEGIN/END comments. Edit the partial, then run
    python3 tools/stamp.py
from the repo root and every page is updated.
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for name in ("taskbar", "footer"):
    part = open(os.path.join(ROOT, "partials", f"{name}.html")).read().strip()
    pat = re.compile(rf"(<!-- BEGIN {name}[^>]*-->\n).*?(\n<!-- END {name} -->)", re.S)
    for page in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
        if os.sep + "partials" + os.sep in page:
            continue
        html = open(page).read()
        # pages in subfolders need ../ in front of local links
        depth = os.path.relpath(page, ROOT).count(os.sep)
        body = part
        if depth:
            prefix = "../" * depth
            body = re.sub(r'(href|src)="(?!https?:|mailto:|#|/)', rf'\1="{prefix}', body)
        new = pat.sub(lambda m: m.group(1) + body + m.group(2), html)
        if new != html:
            open(page, "w").write(new)
            print("stamped", name, os.path.relpath(page, ROOT))
