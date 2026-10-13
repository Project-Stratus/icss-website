RESULT: PARTIAL
GATE: none (no gate is set up for this repo). Checks run by hand: check_links 50 pages, 0 broken. Lighthouse SEO 100 on 4 pages.
SESSION: 5dcd09f7-9fda-4530-b129-5c89fc700d29
HUMAN: Sign in to Google Search Console as vanpulthomas@gmail.com. Add a URL-prefix property for https://ic-space-society.vercel.app/ and choose "HTML tag". Paste the token into a session (or into GOOGLE_SITE_VERIFICATION in tools/seo.py), then merge PR #4 and click Verify. Options: (a) do it now and merge PR #4 straight away (recommended); (b) send Ollie the two screenshots first and merge after he replies; (c) hold.
PREMISE: held. The site still needed event pages, Event structured data and a way to verify Search Console. The sitemap, robots.txt, titles and Organization data were already done on 29 Sep (e2059f3).
SHOW: https://github.com/Project-Stratus/icss-website/pull/4
SHOW: /Users/TvpPro/Developer/icss-website/.review/shots/autumn-hackathon.png
SHOW: /Users/TvpPro/Developer/icss-website/.review/shots/rfa-watchalong.png

# ICSS website found on Google: Search Console, sitemap, ranking

## 1. Who owns the domain and hosting
- **Domain:** there is no custom domain. The site runs on `ic-space-society.vercel.app`, a free Vercel subdomain, so there is no DNS anyone can edit. That rules out a Domain property in Search Console.
- **Hosting:** the Vercel project is on Amy Li's personal account. Amy is from the previous committee. "Ask Amy to transfer the ICSS Vercel project" has been overdue since 3 Oct (vault Master-Task-List.md:99). That is still open, but **Search Console does not need it.**
- **Repo:** Project-Stratus/icss-website. Thomas's `gh` permission is MAINTAIN, and every push to `main` deploys the site.
- **Conclusion:** Thomas can verify Search Console on his own. He adds a URL-prefix property and verifies it with the HTML tag, which reaches the site through the repo. There is no one to ask. Only the sign-in is his to do, because it is his Google account.
- **Committee owner:** the vault ties `space.society@imperial.ac.uk` only to Notion, as its admin. Once the property is verified, add it in Search Console under Settings, Users and permissions, as Owner. If that inbox is not a Google account, Search Console will not accept it. In that case add Ollie (Chair) as a delegated owner instead. Note this was not verified, because the inbox could not be tested from here.

## 2. Sitemap, robots, titles, structured data, event pages
Already live before this session (Amy, 29 Sep, `e2059f3`, `tools/seo.py`): sitemap.xml, robots.txt, per-page titles and descriptions, canonical tags, link previews, and Organization JSON-LD on the home page. The live site scored Lighthouse SEO 100 on `/` and `/events.html` (measured with Lighthouse CLI against the live URL, 11 Oct).

New in PR #4 (branch `found-on-google`, cut from origin/main):
- `17b61b9` fix: running `seo.py` a second time doubled all 36 archive page titles ("... archive | ... archive"). I found this when I re-ran it. It now strips its own suffix. Two runs in a row give a clean diff.
- `099d60b` feat:
  - `autumn-hackathon.html`: 14-15 Nov, room TBC, teams of 4, free. The copy is aligned with Thomas's sign-up page in PR #2.
  - `rfa-watchalong.html`: the date follows the launch window, free for members, with the replay-night fallback.
  - Both pages are linked from events.html and added to the sitemap (50 URLs).
  - `seo.py` gained `EVENTS`, which writes schema.org Event JSON-LD (dates, place, organizer, free offer) for any event page that has a `start`.
  - `seo.py` also gained the `GOOGLE_SITE_VERIFICATION` slot.

| Check | Result | Where |
| --- | --- | --- |
| `python3 tools/check_links.py` | 50 pages, 227 external links, 0 broken | worktree, after the final regen |
| Lighthouse SEO | 100 on autumn-hackathon, rfa-watchalong, events, index | local `http.server` on :8765, Lighthouse CLI |
| Event JSON-LD | Parses as JSON; has the fields Google requires for events (name, startDate, location with address) | autumn-hackathon.html |

Not run: Google's Rich Results Test. It is a web tool that needs a public URL, and the pages only go public when the PR is merged. Run it on the hackathon URL after the merge.

## 3. Weekly ranking line in the morning feed: not done
- The vault agent searched `~/dev` and `~/Developer` (.py/.js/.mjs/.ts/.sh, excluding node_modules) and found no Search Console code anywhere. `~/Developer/applications-tracker/docs/SEARCH_CONSOLE.md` already says the card belongs in `~/dev/orchestra/scripts/morning_feed.py`, and that it is blocked: this machine has no Google credential with the `webmasters.readonly` scope.
- The ranking card can't get data until two things exist: the Search Console property (the HUMAN step above) and that credential. Building a card now would only ever show nothing.
- The CEC task (`~/dev/cec-site-seo/.review/queue/2026-10-09T1335-...`) needs the same card. I posted a board `found` suggesting one shared card that takes a list of sites.
- Queries to track for ICSS: "imperial space society", "icss imperial", "imperial college space society", "icss hackathon", "rfa watch party".

## Deferred
- [ ] FINDING: weekly Search Console ranking card in orchestra morning_feed.py (ICSS + CEC, one card, list of sites) | where: ~/dev/orchestra/scripts/morning_feed.py build() card tuple and record_signal allowlist :192 | class: blocked | blocked on: a webmasters.readonly Google credential and a verified Search Console property
- [ ] FINDING: RFA watch party has no Event structured data until a launch window exists | where: tools/seo.py EVENTS["rfa-watchalong.html"] | class: cheap | add "start" and "venue", re-run seo.py
- [ ] FINDING: Vercel project still on Amy's personal account (overdue since 3 Oct) | where: vault Master-Task-List.md:99 | class: human

## Neighbours checked
The system map links this repo to nothing. I read `~/dev/orchestra/scripts/morning_feed.py` (build() and record_signal) and did not change it.

## ODD
- Most of step 2 was already live: Amy did it on 29 Sep. I built on `tools/seo.py` instead of replacing it.
- PRs #1-#3 are still unmerged, a week after the 6 Oct Welcome Talk. PR #4 is independent of them and branches from origin/main. It is not merged, because merging publishes the committee's site; that matches how PRs #1-#3 were handled.
- The hackathon date is 14-15 Nov in every recent source: Notion, drafts, PR #2, and the public events table. The vault's Master-Task-List still lists the date decision as open. If the date moves, change `EVENTS` and the page.
- The RFA page uses the HPR onboard rocket photo as its share image, because the site has no watch-party photo.
- I kept public-facing claims to what the vault and PR #2 support. I dropped an unsourced "first vertical orbital launch from UK soil" line and a "judged on Sunday" line.
- Local `main` is 5 automatic-snapshot commits ahead of origin. Those commits only touch `.review/`. I did not push them.
