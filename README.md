# Imperial College Space Society website

Hand-written HTML + CSS + a sprinkle of JS. No framework, no build step: open `index.html` in a browser and you're looking at the site.

## Editing

| I want to... | Do this |
| --- | --- |
| Change page text | Edit the `.html` file for that page. |
| Change the taskbar or footer | Edit `partials/taskbar.html` or `partials/footer.html`, then run `python3 tools/stamp.py` to copy it into every page. |
| Add a blog post | Add a row to the blog Google Sheet (see the comment at the top of `blog.html`). No code needed. |
| Add project photos | Drop a resized JPG (≤ 1000px wide) into `assets/img/projects/` and add a `<figure>` to the project page's `polaroids` block. |
| Add Instagram / LinkedIn updates | Paste the post's embed code into the `updates.exe` window on the project page. |
| Change the video on the events telly | Change `data-yt="..."` on the iframe in `events.html` to another YouTube video id. |

## Layout

```
index.html            home
blog.html             new posts (Google Sheet) + archive list
archive/              posts recovered from the old union.ic.ac.uk site via the Wayback Machine
events.html  wiki.html  join.html  projects.html
tycho.html  svarog.html  stratus.html  iprl.html  rocketry.html  rover.html
css/style.css         all the styles
js/main.js            clock, hover videos, draggable doodles, YouTube telly, sheet feed
partials/             shared taskbar + footer
assets/               images, video loops, poster graphics
```

## Running locally

```
python3 -m http.server 8000
```

then open http://localhost:8000.

## Deploying

Pushes to `main` deploy automatically on Vercel (static site, no build command, output directory = repo root).
