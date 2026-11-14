# icss-website: verify Search Console in Chrome, submit sitemap

Written: 2026-11-14
Workstream: life
Queue: manual
Priority: normal
Project: icss-website
Weight: light

Retry of 2026-11-10T1318-icss-gsc-verify-retry (PARTIAL: PR #4 merged and live; steps below not done because that headless session had no Claude in Chrome tools). Queue: manual on purpose, so the unattended runner does not dispatch it a fourth time to a session without Chrome. Run it with /review from a Claude Code session that lists mcp__claude-in-chrome__* tools. Thomas answered on 19 Oct "Let Claude do it in my Chrome"; never enter a password, park only on a password or 2FA prompt.

## Do
1. Search Console, URL-prefix property https://ic-space-society.vercel.app/, HTML tag method. Put the token in GOOGLE_SITE_VERIFICATION in tools/seo.py, run `python3 tools/seo.py`, push to main, wait for the deploy, click Verify.
2. Submit sitemap.xml. Add space.society@imperial.ac.uk or Ollie as owner if accepted.
3. Rich Results Test on autumn-hackathon.html (the hackathon is 14-15 Nov, so its value drops after 15 Nov; steps 1-2 stay worth doing).
Check the orchestra file 2026-11-05T1601-search-console-three-sites (archived .dead-human.md) is not being done twice.

## Checks
curl -s https://ic-space-society.vercel.app/ | grep -q 'google-site-verification'
curl -s https://ic-space-society.vercel.app/sitemap.xml | grep -q autumn-hackathon

## Scope
This task looks like one instance of a class: 10 recent tasks share its subject.
- icss-website: retry or close 1 stopped items (icss-website: merge PR 4, verify Search ) (shares: icss, search, verify, website)
- icss-website: retry or close 1 stopped items (icss-website: merge PR 4, verify Search ) (shares: icss, search, verify, website)
- icss-website: retry or close 1 stopped items (ICSS website found on Google: Search Con) (shares: icss, search, website)
- icss-website: Run this task from a Claude Code session that has the Claude in Chrome extension connected (this headless… (shares: chrome, icss, website)
- CEC to the top of Google: Search Console, sitemap, and the ranking basics, now that Thomas has Cloudflare access (shares: console, search, sitemap)
Solve the class, not the instance: read those, fold the fix into the one shared mechanism they point at, and say in the report which cases that mechanism now covers. If this really is separate, write one line under ODD saying why.

## New because
2026-11-10T1318-icss-gsc-verify-retry.task.md

## Already decided
These were decided before this task was written. Build on them; do not re-ask them or offer alternatives to them.
- Handoff-2026-11-11.md:475: - icss-website: merge PR 4, verify Search Console in Chrome, submit sitemap -- Run this task from a Claude Code session that has the Claude in Chrome extension connected (this headless session has no mcp__claude-in-chrome__* tools); the si
- Handoff-2026-11-12.md:353: - `05:19` ✓ finished: PARTIAL orchestra: icss-website: Run this task from a Claude Code session that has the Claude in Chrome exten -- HUMAN: Merge Project-Stratus/icss-website PR 5 (adds the Search Console verification file), then click Verify and submit sitemap.xml in Search Console. I would pick: m
- Handoff-2026-11-12.md:479: - icss-website: merge PR 4, verify Search Console in Chrome, submit sitemap -- Run this task from a Claude Code session that has the Claude in Chrome extension connected (this headless session has no mcp__claude-in-chrome__* tools); the si
- Handoff-2026-11-13.md:278: - icss-website: merge PR 4, verify Search Console in Chrome, submit sitemap -- Run this task from a Claude Code session that has the Claude in Chrome extension connected (this headless session has no mcp__claude-in-chrome__* tools); the si
- bank answer should-a-session-verify-your-club-website-with-google-search: [answered 2026-10-19] Should a session verify your club website with Google Search Console in your Chrome, or will you add the one line to the domain settings yourself? -> Let Claude do it in my Chrome
- Handoff-2026-11-11.md:171: - stuck: Verify Search Console for thomasvp.com, the CEC site and the ICSS site and submit sitemaps  (owner: life; 2026-11-05T1601-search-console-three-sites.md)
- Handoff-2026-11-13.md:97: - stuck: Verify Search Console for thomasvp.com, the CEC site and the ICSS site and submit sitemaps  (owner: life; 2026-11-05T1601-search-console-three-sites.md)
- Handoff-2026-11-14.md:82: - stuck: Verify Search Console for thomasvp.com, the CEC site and the ICSS site and submit sitemaps  (owner: life; 2026-11-05T1601-search-console-three-sites.md)

## Standing grants relied on
Consents Thomas gave that this task relies on, quoted from the ledger (config/standing-grants.json). Cite the id in any action summary that uses one. Nothing here widens what the permission classifier allows.
- grant-2026-10-16-signed-in-chrome (2026-10-16T15:32, main-chat; his words; scope browser:signed-in-chrome; expires standing): "I have these sessions open in my Chrome already fully signed in, and when you need sign in I can literally do that for you."

## One system
Atrium is one system with one self-model and one presence ([Thomas] 3 Nov 16:45 to 16:51). What this task makes feeds it:
- It records what it does and every open loop it leaves in the one self-model (atrium_loops.py, `atrium-loops summary`; rows in ~/.atrium/events.tsv). No private store, log or copy of state that already has a home (parts and homes: docs/atrium-parts-map.md).
- It reads and writes the shared memory (the vault, through atrium-vault and atrium-capture) and speaks through the shared voice and presence. No persona, name or memory of its own.
- Gate (direction): the report carries a `## One system` section naming the loop kinds or event rows it wrote, or `none: <why>`. A task that leaves a draft, a plate, a send, a reminder or a booking with nobody tracking it is PARTIAL.
