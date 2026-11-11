# icss-website: merge PR 4, verify Search Console in Chrome, submit sitemap

Written: 2026-11-10
Workstream: life
Queue: auto
Priority: normal
Project: icss-website
Weight: light
Kind: implement

Retry of 2026-10-11T1947-icss-found-on-google (3 PARTIALs in a row, each parked on the Search Console sign-in). Thomas answered on 19 Oct: "Let Claude do it in my Chrome", so the sign-in is already his decision; use Claude in Chrome with his existing Google session and never enter a password. Stop and park only if Google asks for a password or 2FA.

## Do
1. Merge PR #4 (Project-Stratus/icss-website, event pages and Event JSON-LD; open, unmerged on 10 Nov). It is independent of PRs #1-#3. Confirm the hackathon date (14-15 Nov) is still right on the page before merging; the event is days away.
2. In Search Console (Chrome, signed in) add a URL-prefix property for https://ic-space-society.vercel.app/ with the HTML tag method. Put the token in GOOGLE_SITE_VERIFICATION in tools/seo.py, run `python3 tools/seo.py`, push to main, wait for the deploy, click Verify.
3. Submit sitemap.xml. Add space.society@imperial.ac.uk or Ollie as owner if Search Console accepts it.
4. Run Google's Rich Results Test on the autumn-hackathon page.
Note: orchestra queue file 2026-11-05T1601-search-... (v-5a3b5) also covers verifying the ICSS site; check it first and do not do the work twice.

## Checks
curl -s https://ic-space-society.vercel.app/ | grep -q 'google-site-verification'
curl -s https://ic-space-society.vercel.app/autumn-hackathon.html | grep -q '"@type": *"Event"'
curl -s https://ic-space-society.vercel.app/sitemap.xml | grep -q autumn-hackathon

## Scope
This task looks like one instance of a class: 4 recent tasks share its subject.
- ICSS website found on Google: Search Console, sitemap, ranking (shares: console, icss, search, sitemap, website)
- icss-website: retry or close 1 stopped items (ICSS website found on Google: Search Con) (shares: icss, search, website)
- icss-website: retry or close 1 stopped items (ICSS website found on Google: Search Con) (shares: icss, search, website)
- CEC to the top of Google: Search Console, sitemap, and the ranking basics, now that Thomas has Cloudflare access (shares: console, search, sitemap)
Solve the class, not the instance: read those, fold the fix into the one shared mechanism they point at, and say in the report which cases that mechanism now covers. If this really is separate, write one line under ODD saying why.

## New because
2026-10-11T1947-icss-found-on-google.task.md

## Already decided
These were decided before this task was written. Build on them; do not re-ask them or offer alternatives to them.
- Handoff-2026-11-08.md:82: - stuck: Verify Search Console for thomasvp.com, the CEC site and the ICSS site and submit sitemaps  (owner: life; 2026-11-05T1601-search-console-three-sites.md)
- Handoff-2026-11-09.md:141: - stuck: Verify Search Console for thomasvp.com, the CEC site and the ICSS site and submit sitemaps  (owner: life; 2026-11-05T1601-search-console-three-sites.md)
- Handoff-2026-11-10.md:143: - stuck: Verify Search Console for thomasvp.com, the CEC site and the ICSS site and submit sitemaps  (owner: life; 2026-11-05T1601-search-console-three-sites.md)
- Handoff-current.md:73: - stuck: Verify Search Console for thomasvp.com, the CEC site and the ICSS site and submit sitemaps  (owner: life; 2026-11-05T1601-search-console-three-sites.md)
- Handoff-2026-11-10.md:95: - icss-website: (no title) (-1 min, lock + live pid)
- bank answer should-a-session-verify-your-club-website-with-google-search: [answered 2026-10-19] Should a session verify your club website with Google Search Console in your Chrome, or will you add the one line to the domain settings yourself? -> Let Claude do it in my Chrome
- bank answer hpr-publish-the-team-plan-page-to-the-icss-notion-now-so-oll: [answered 2026-10-14] HPR: publish the team plan page to the ICSS Notion now so Ollie and the team can edit it? -> Publish (recommended)
- Settled.md:1261: - [stated] [Thomas] **19 Oct 2026: Should a session verify your club website with Google Search Console in your Chrome, or will you add the one line to the domain settings yourself? Let Claude do it in my Chrome.** Answered through atrium-ask (should-a-session-verify-your-club-website-with-google-search); source .review/archive/2026-10-19T0032-poke

## Standing grants relied on
Consents Thomas gave that this task relies on, quoted from the ledger (config/standing-grants.json). Cite the id in any action summary that uses one. Nothing here widens what the permission classifier allows.
- grant-2026-10-16-signed-in-chrome (2026-10-16T15:32, main-chat; his words; scope browser:signed-in-chrome; expires standing): "I have these sessions open in my Chrome already fully signed in, and when you need sign in I can literally do that for you."
- grant-2026-10-18-outputs-in-atrium (2026-10-18T09:55, main-chat; his words; scope docs:own-deliverables-go-to-atrium; expires standing): "i cant have a doc for everything, should all be made in atrium."

## One system
Atrium is one system with one self-model and one presence ([Thomas] 3 Nov 16:45 to 16:51). What this task makes feeds it:
- It records what it does and every open loop it leaves in the one self-model (atrium_loops.py, `atrium-loops summary`; rows in ~/.atrium/events.tsv). No private store, log or copy of state that already has a home (parts and homes: docs/atrium-parts-map.md).
- It reads and writes the shared memory (the vault, through atrium-vault and atrium-capture) and speaks through the shared voice and presence. No persona, name or memory of its own.
- Gate (direction): the report carries a `## One system` section naming the loop kinds or event rows it wrote, or `none: <why>`. A task that leaves a draft, a plate, a send, a reminder or a booking with nobody tracking it is PARTIAL.
