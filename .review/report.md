# ICSS website: HPR page fixed now, then every subpage brought up to date and redesigned (main page design kept)

RESULT: PARTIAL
GATE: unmeasurable
SESSION: 874eed1b-2718-428c-9af7-c41db2fa0c4b
HUMAN: The Vercel previews sit behind a login on Amy's account (amylis-projects), so Ollie can't open them. Options: ask Amy to transfer the Vercel project to Thomas/ICSS (recommended), ask her to switch off preview protection, or just send Ollie the screenshots.
PREMISE: held

There is no gate for this repo, so nothing automated checked this work. Verification was manual: `tools/check_links.py`, Playwright screenshots at 390 px and 1440 px with a horizontal-scroll check, Lighthouse mobile, and a copy scan for AI-style phrasing.

## Why PARTIAL
Everything the task asked for is built, pushed and verified locally. Two things are not done:
1. **Previews.** Addendum 2 asks for "a preview link Thomas can send to Ollie". Vercel builds a preview for each PR (all checks pass), but every preview URL returns a 302 to `vercel.com/sso-api`. The project belongs to Amy's Vercel team, and changing that is an account decision (parked, see HUMAN).
2. **Hackathon Sheet.** The form posts to a Google Apps Script endpoint, which doesn't exist yet. It has to be deployed under Thomas's Google login: README section "Hackathon sign-ups", about 5 minutes. Until then the page says "Sign-ups aren't open yet" and the button is disabled, so it's safe to merge.

## PRs (none merged; all need Thomas's yes)
| PR | Branch | What |
|---|---|---|
| [#1](https://github.com/Project-Stratus/icss-website/pull/1) | `hpr-page-fix` | HPR page: co-leads Thomas van Pul and Curtis; removes "equipment, supplies and funding ready"; adds the 2023 flight (G-class, 721 m, custom flight computer, links the GitHub repo); how to join (weekly 18:00-20:00, day TBC; Welcome Talk 6 Oct RSM 131). Removes the unsourced NRC "pedigree" line. |
| [#2](https://github.com/Project-Stratus/icss-website/pull/2) | `hackathon-signup` | `hackathon.html` sign-up form (noindex, not linked anywhere) plus `js/hackathon-form.js` and `tools/hackathon-form.gs` (Apps Script that appends to a Sheet). Fields: name, Imperial email, optional CID (marked for Ollie), year, department, team of 4 or match me, dietary, allergies, accessibility, consent. No guest speaker mentioned. |
| [#3](https://github.com/Project-Stratus/icss-website/pull/3) | `subpages-redesign` (stacked on #1) | Redesign of every subpage plus the audit fixes, plus site-wide speed and accessibility work. Main page visual design unchanged. |

Preview URLs (behind a login for now): `https://ic-space-society-git-<branch>-amylis-projects.vercel.app/`

## The redesign (PR #3)
Design research (9 sites fetched: DARE, Stanford SSI, CUSF, USCRPL, ICLR, MIT Rocket Team, FS Team Delft, KTH FS, Chalmers FS; notes in `design-research.md`, iCloud folder below). What I took from it:
- **A facts box at the top of every project page:** meets / where / leads / experience / status. Partial versions are at uscrpl.com/join, kthformulastudent.se/join-us, chalmersformulastudent.se/recruitment and fsteamdelft.nl/join-us; none had all five.
- **A join button on every project page, not only on Join** (DARE, Stanford, MIT, Chalmers).
- **Status plus a date** (CUSF, USCRPL, ICLR) and a **project index as cards** (CUSF, ICLR, USCRPL).
- **Freshness:** an "on this page" link row, a "Last checked 2 October 2026, spotted something out of date? Tell us" line on each page (my idea; no fetched site does this), and an events list that greys out past events by date, so last week's fair can't show as upcoming.

Home page (UX only): a "New here? See what's on this term" link under the hero buttons, nav tap targets about 44 px on phones, a skip link, a `<main>` landmark, and Roboto loaded without blocking the first paint (it was an `@import` inside the CSS).

## Numbers
Lighthouse 13.4.1, mobile preset, both sides served from local `python3 -m http.server` (before = `git archive origin/main`, after = the PR #3 branch). Full results are in `summary.txt`.

| page | perf before → after | a11y before → after | FCP ms before → after | LCP ms before → after |
|---|---|---|---|---|
| index | 96 → 98 | 96 → 100 | 1604 → 914 | 2557 → 2489 |
| projects | 99 → 99 | 98 → 100 | 1594 → ~910 | 1744 → ~2000 (now a photo; was text) |
| tycho | 81 → 99 | 97 → 100 | 2814 → 905 | 3884 → 2180 |
| rocketry | 96 → 100 | 97 → 100 | 1821 → 905 | 2113 → 1805 |
| events | 84 → 98 | 98 → 100 | 2823 → 905 | 3636 → 2330 |
| join | 89 → 100 | 98 → 100 | 2910 → 903 | 3060 → 959 |

On the live site (vercel.app, before only), performance was 89-92 across index, tycho, rocketry, events and join. Best-practices scores of 96 on a few local "after" runs come from local-server socket errors and the YouTube cookie notice, not from the pages.

Other checks: `check_links.py` reports 48 pages, about 226 external links, 0 broken. No horizontal scroll on any of the 12 pages at 390 or 1440 px. Copy scan for em dashes and stock AI phrasing over the diffs of #2 and #3: 0 hits.

## Outdated-content table
The full table has 57 rows (41 website, 16 Space Brain): 4 wrong, 12 dated, 19 missing, 22 uncertain. It is searchable in the vault at **`Efforts/ICSS-Events/ICSS-Outdated-Audit.md`** with a status column (31 still open, 16 waiting on Ollie) and how to refresh it. These are the rows that matter most:

| id | page | stale | truth | source | status |
|---|---|---|---|---|---|
| W1 | rocketry | "equipment, supplies and funding ready to go" | No budget yet (the £1,000 comes once a full plan is prepared); one G reload, the rest H/I/J | HPR-Hub.md | fixed #1 |
| W2 | rocketry | no leads named | Thomas van Pul and Curtis | HPR-Hub.md | fixed #1 |
| W4 | rocketry | nothing on the 2023 flight | 721 m on a G motor, custom flight computer | HPR-2023-Paper.md | fixed #1 |
| W15 | svarog | "2024/25: BEXUS-34 and BEXUS-36" | BEXUS-34 in 2024, BEXUS-36 in Oct 2025 | ICSS-Primer.md l.74 | fixed #3 |
| W16 | svarog | "subsystems demonstrated on BEXUS-36" | The BEXUS-36 flight was non-nominal and the sail experiment didn't run | Svarog-Interview-Brief.md | fixed #3 (claim removed, failure not advertised) |
| W13 | svarog | "Mission lead: Matthew Acevski" | believed graduated; vault has Sahil as project lead | ICSS.md l.46 | name removed; ask Ollie |
| W20 | iprl | "this year the goals are... top 10" | that ERC has already happened | ICSS.md l.151 | fixed #3; 16th still unconfirmed |
| W23 | events | Welcome Fair shown as upcoming | already past; ran 29-30 Sep | Welcome-Fair-and-Talk.md | fixed #3 (self-ageing list) |
| W7 | footer | Twitter @ICSpaceSoc | 404 on twitter.com and x.com | curl | link removed; ask Ollie for a new handle |
| W17/W19 | svarog, stratus | rooms CAGB 650 and 749 | vault booking says CAGB 750-751 | ICSS-Primer.md l.289-293 | ask Ollie |
| W37 | blog | newest post May 2023 | lots has happened since | sheet CSV | open (needs posts from leads) |

## Screenshots
`~/Library/Mobile Documents/com~apple~CloudDocs/Atrium/ICSS/Website-2026-10-02/`: `before/` and `after/` hold all 12 pages at phone (390) and desktop (1440) size, full page. `hackathon-form/` holds mobile and desktop, empty-submit errors, filled, success and failure states. The same folder has `audit.md`, `design-research.md` and `summary.txt` (Lighthouse).

## Hackathon form test (PR #2)
Tested with Playwright against a local stub endpoint:
- Empty submit shows 7 errors, focus moves to the first one.
- A gmail address and a 3-digit CID are rejected.
- A valid fill sends the URL-encoded body and shows the success state.
- An unreachable endpoint shows the failure state with the society email, and the typed answers are kept.

The `.gs` script has not run against a real Sheet.

## Odd / decisions taken (correct any of these)
- **Uncertain facts:** where the vault and the site disagree (rooms, Tycho technical leads, committee names, the year of Tycho's hot-fire), I kept the site's text and added `<!-- CHECK WITH OLLIE -->` in the HTML. Where a name is likely wrong (Matthew Acevski, Svarog), I removed it. "World Space Week panel" is gone from events: Ollie's plan marks it as not ICSS's event.
- **"(new!)" badge:** it stays on the home cards for HPR and Mini Rover, but the redesigned HPR page header doesn't show it ("restarting" is in the status instead).
- **IPRL meeting time:** "Rover team: Wednesdays 14:00" comes from Thomas's 25 Sep call with Samuel. It's shown publicly, with Samuel by first name only.
- **Commits:** PR #3 has three commits. Site-wide changes to the archive pages are their own commit, but the top-level pages carry both the site-wide and the redesign changes in one commit, because the edits overlap on the same files.
- **Welcome Talk deck:** the HPR slide still says "funding ready" (vault ICSS-Events-Hub l.164). That's outside this repo and not fixed.
- **Main branch:** local `main` is 1 commit ahead of origin (the 30 Sep automatic snapshot of this task). The PRs branch from origin/main, so the snapshot isn't in them. Nothing was pushed to main.
- **Space Brain:** the Notion connector can't reach the ICSS workspace, so those 16 rows come from the vault copies (read 30 Sep).

## Still open
- Thomas: merge #1 (and #3 if he likes it) before Tue 6 Oct; deploy the Apps Script and paste its URL into `js/hackathon-form.js` when sign-ups should open (announcement planned for 24 Oct).
- Ollie: 16 rows marked "open: ask Ollie" in the vault note; whether the hackathon form needs CID.
- Project leads: blog posts since 2023, and filling the gaps listed under "What each page is missing" in the vault note.
