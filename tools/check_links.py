"""Check every link and image on the site.

    python3 tools/check_links.py            # local files only (fast)
    python3 tools/check_links.py --external # also ping every outside link (slow)

Exits non-zero if anything is broken.
"""
import glob, os, re, sys, urllib.request
from html.parser import HTMLParser
from urllib.parse import urldefrag, urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for k in ("href", "src", "poster", "data-src"):
            if a.get(k):
                self.urls.append(a[k])


pages = {}
for f in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
    if f"{os.sep}partials{os.sep}" in f:
        continue
    p = Links()
    p.feed(open(f, encoding="utf-8").read())
    pages[os.path.abspath(f)] = p

broken, external = [], set()
for page, p in pages.items():
    for url in p.urls:
        if url.startswith(("mailto:", "tel:", "javascript:", "data:")) or url == "#":
            continue
        if urlparse(url).scheme in ("http", "https"):
            external.add(url)
            continue
        path, frag = urldefrag(url)
        target = page if not path else os.path.abspath(os.path.join(os.path.dirname(page), path))
        if not os.path.exists(target):
            broken.append((page, url, "missing file"))
        elif frag and target.endswith(".html") and frag not in pages.get(target, Links()).ids:
            broken.append((page, url, "missing #anchor"))

if "--external" in sys.argv:
    for url in sorted(external):
        try:
            req = urllib.request.Request(url, method="GET", headers={"User-Agent": "Mozilla/5.0"})
            code = urllib.request.urlopen(req, timeout=30).status
        except Exception as e:
            code = getattr(e, "code", str(e)[:60])
        if code != 200:
            broken.append(("(external)", url, code))

for page, url, why in broken:
    print(f"BROKEN  {os.path.relpath(page, ROOT) if page != '(external)' else page}  ->  {url}  ({why})")
print(f"{len(pages)} pages checked, {len(external)} external links, {len(broken)} broken")
sys.exit(1 if broken else 0)
