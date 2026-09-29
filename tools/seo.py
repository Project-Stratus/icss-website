"""Search-engine bits: page titles, link-preview tags, sitemap.xml and robots.txt.

    python3 tools/seo.py

Run it after adding a page or changing the domain. Everything it writes into a page sits
between <!-- BEGIN seo --> and <!-- END seo --> in the <head>, so don't edit inside those.
"""
import datetime, glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://ic-space-society.vercel.app"   # change this if the society gets its own domain
NAME = "Imperial College Space Society"

# page -> (title, share image)
PAGES = {
    "index.html":    (f"{NAME} (ICSS)",                         "assets/img/projects/tycho-poster.jpg"),
    "projects.html": (f"Projects | {NAME}",                      "assets/img/projects/svarog-poster.jpg"),
    "tycho.html":    (f"Project Tycho: liquid rocket engine | {NAME}", "assets/img/projects/tycho-poster.jpg"),
    "svarog.html":   (f"Project Svarog: solar sail CubeSat | {NAME}",  "assets/img/projects/svarog-sail.jpg"),
    "stratus.html":  (f"Project Stratus: high altitude balloons | {NAME}", "assets/img/projects/stratus-space1.jpg"),
    "iprl.html":     (f"Imperial Planetary Robotics Lab (IPRL) | {NAME}", "assets/img/projects/iprl-erc.jpg"),
    "rocketry.html": (f"High Powered Rocketry | {NAME}",         "assets/img/projects/hpr-onboard.jpg"),
    "rover.html":    (f"Mini Rover | {NAME}",                    "assets/img/projects/rover-mini.jpg"),
    "events.html":   (f"Events | {NAME}",                        "assets/img/events/hack-team.jpg"),
    "blog.html":     (f"Blog | {NAME}",                          "assets/img/projects/stratus-launch.jpg"),
    "join.html":     (f"Join | {NAME}",                          "assets/img/projects/tycho-testteam.jpg"),
    "wiki.html":     (f"Wiki | {NAME}",                          "assets/img/projects/tycho-injector.jpg"),
}

ORG = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": NAME,
    "alternateName": ["ICSS", "Imperial Space Society", "IC Space Society", "ICSEDS"],
    "url": SITE + "/",
    "logo": SITE + "/assets/img/logo-ic.png",
    "email": "space.society@imperial.ac.uk",
    "description": "A student-led society for the development of space bound infrastructure and research.",
    "parentOrganization": {"@type": "CollegeOrUniversity", "name": "Imperial College London"},
    "sameAs": [
        "https://www.instagram.com/ic_space_society",
        "https://www.twitter.com/ICSpaceSoc",
        "https://www.imperialcollegeunion.org/activities/a-to-z/space-society",
        "https://github.com/Project-Stratus",
    ],
}


def head_block(path, title, desc, image):
    url = SITE + "/" + ("" if path == "index.html" else path)
    t, d = html.escape(title), html.escape(desc)
    lines = [
        f'<link rel="canonical" href="{url}">',
        f'<meta property="og:type" content="website">',
        f'<meta property="og:site_name" content="{NAME}">',
        f'<meta property="og:title" content="{t}">',
        f'<meta property="og:description" content="{d}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{SITE}/{image}">',
        f'<meta name="twitter:card" content="summary_large_image">',
        f'<link rel="apple-touch-icon" href="{"../" * path.count("/")}apple-touch-icon.png">',
    ]
    if path == "index.html":
        lines.append('<script type="application/ld+json">' + json.dumps(ORG) + "</script>")
    return "\n  ".join(lines)


def process(path, title=None, image=None):
    full = os.path.join(ROOT, path)
    s = open(full).read()
    if title:
        s = re.sub(r"<title>.*?</title>", f"<title>{html.escape(title)}</title>", s, count=1)
    title = html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1))
    m = re.search(r'<meta name="description" content="([^"]*)"', s)
    desc = html.unescape(m.group(1)) if m else ORG["description"]
    if not image:
        im = re.search(r'<img[^>]+src="(img/[^"]+)"', s)   # archive posts: use their first photo
        image = f"archive/{im.group(1)}" if im else "assets/img/projects/stratus-space1.jpg"
    s = re.sub(r"\s*<!-- BEGIN seo -->.*?<!-- END seo -->", "", s, flags=re.S)
    # old one-off og tags on the home page are replaced by the block
    s = re.sub(r'\s*<meta property="og:(title|description)" content="[^"]*">', "", s)
    block = "<!-- BEGIN seo -->\n  " + head_block(path, title, desc, image) + "\n  <!-- END seo -->"
    s = s.replace("</head>", "  " + block + "\n</head>", 1)
    open(full, "w").write(s)


today = datetime.date.today().isoformat()
urls = []
for path, (title, image) in PAGES.items():
    process(path, title, image)
    urls.append((SITE + "/" + ("" if path == "index.html" else path), "1.0" if path == "index.html" else "0.8"))
for path in sorted(glob.glob(os.path.join(ROOT, "archive", "*.html"))):
    rel = os.path.relpath(path, ROOT)
    s = open(path).read()
    t = re.search(r"<title>(.*?)</title>", s, re.S).group(1)
    t = re.sub(r"\s*(&middot;|·|\|)\s*ICSS archive$", "", t)
    process(rel, f"{html.unescape(t)} | {NAME} archive")
    urls.append((SITE + "/" + rel, "0.4"))

with open(os.path.join(ROOT, "sitemap.xml"), "w") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u, pr in urls:
        f.write(f"  <url><loc>{html.escape(u)}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>\n")
    f.write("</urlset>\n")
with open(os.path.join(ROOT, "robots.txt"), "w") as f:
    f.write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
print(len(urls), "pages in sitemap")
