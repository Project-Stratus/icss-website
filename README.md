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
hackathon.html        hackathon sign-up form (not linked anywhere yet, see below)
tycho.html  svarog.html  stratus.html  iprl.html  rocketry.html  rover.html
css/style.css         all the styles
js/main.js            hover videos, draggable drawings, YouTube tv, blog sheet feed
js/hackathon-form.js  the hackathon sign-up form
partials/             shared nav bar + footer
assets/               images, video loops, poster graphics
```

## Hackathon sign-ups

`hackathon.html` is the sign-up form for the Autumn Hackathon. It isn't in the nav, the home page or `sitemap.xml`, and it has `noindex` so search engines skip it. Until it's connected to a Google Sheet it just says "Sign-ups aren't open yet" and the button is greyed out.

To switch it on:

1. Make a new Google Sheet (e.g. "ICSS Hackathon sign-ups") in the account that should own the data.
2. In the Sheet, go to **Extensions > Apps Script**. Delete what's there, paste in everything from `tools/hackathon-form.gs`, and save.
3. Click **Deploy > New deployment**, pick type **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**. Google will ask you to authorise it the first time (it needs access to this one spreadsheet).
4. Copy the **Web app URL** (ends in `/exec`). Opening it in a browser should show a short `{"ok":true,...}` message.
5. Paste it into `SHEET_ENDPOINT` at the top of `js/hackathon-form.js`, commit and push.
6. Do a test sign-up and check a row appears in the "Sign-ups" tab (it gets created with a header row on the first sign-up). Delete the test row afterwards.

To give Ollie access, click **Share** on the Sheet and add his email as an **Editor** (or **Viewer** if he only needs to read it). Don't make the Sheet public: it has people's emails and dietary and accessibility info. Delete it after the event, as the form promises.

If you change the script later, redeploy with **Deploy > Manage deployments > edit (pencil) > Version: New version** so the URL stays the same.

To link the page from the site, add it to the nav (`partials/taskbar.html`, then `python3 tools/stamp.py`) or the events page, remove the `noindex` line, and add it to `PAGES` in `tools/seo.py` if it should go in the sitemap.

## Running locally

```
python3 -m http.server 8000
```

then open http://localhost:8000.

## Deploying

Pushes to `main` deploy automatically on Vercel (static site, no build command, output directory = repo root).

Before pushing, `python3 tools/check_links.py` checks for broken links and missing images.
