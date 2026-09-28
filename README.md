# Imperial College Space Society website

Plain HTML + CSS + a bit of JS. No framework, no build step, just open `index.html` in a browser.

## Editing

| I want to... | Do this |
| --- | --- |
| Change page text | Edit the `.html` file for that page. |
| Change the nav bar or footer | Edit `partials/taskbar.html` or `partials/footer.html`, then run `python3 tools/stamp.py` to copy it into every page. |
| Add a blog post | Add a row to the blog Google Sheet (see the comment at the top of `blog.html`). No code needed. |
| Add project photos | Put a resized JPG (max ~1000px wide) in `assets/img/projects/` and add a `<figure>` inside the `photos` div on the project page. |
| Add Instagram / LinkedIn posts | Paste the embed code into the project page (there's a comment marking the spot on Tycho). |
| Change the video on the events telly | Change `data-yt="..."` on the iframe in `events.html` to another YouTube video id. |

## Layout

```
index.html            home
blog.html             new posts (Google Sheet) + archive list
archive/              posts recovered from the old union.ic.ac.uk site via the Wayback Machine
events.html  wiki.html  join.html  projects.html
tycho.html  svarog.html  stratus.html  iprl.html  rocketry.html  rover.html
css/style.css         all the styles
js/main.js            hover videos, draggable drawings, YouTube tv, blog sheet feed
partials/             shared nav bar + footer
assets/               images, video loops, poster graphics
```

## Running locally

```
python3 -m http.server 8000
```

then open http://localhost:8000.

## Deploying

Pushes to `main` deploy automatically on Vercel (static site, no build command, output directory = repo root).

Before pushing, `python3 tools/check_links.py` checks for broken links and missing images.
