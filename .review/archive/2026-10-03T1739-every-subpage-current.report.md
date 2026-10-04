# ICSS website: finish bringing every subpage up to date before the 6 Oct Welcome Talk

RESULT: PARTIAL
GATE: unmeasurable
SESSION: d58af324-49f5-4c44-882d-c282b50f526e
HUMAN: Push the updated `subpages-redesign` branch and merge PR #1 then #3 before Tue 6 Oct? Options: (a) push and merge both (recommended), (b) push only so Ollie can see the screenshots first, (c) hold. Merging publishes the site, so it's your call.
PREMISE: held

This repo has no gate. I checked the task's own three conditions by hand. Two are met and one is partly met (see Gate below).

## What changed
Commit `bbd1f50` is on `subpages-redesign` (PR #3), on top of the 2 Oct work. It is **local only and not pushed**: a push would start a Vercel preview build, and the task said no deploy. Nine files changed. The main page is untouched.

| page | change | source |
|---|---|---|
| svarog | Leads: "Sahil Bhargava (project), Shiki Vaahan (orbital)" (it said "project lead to be confirmed") | `Svarog-Interview-Brief.md` l.14, `Atlas/Voice/Email.md` l.121, `ICSS-Project-Svarog.md` l.202 |
| svarog | Room CAGB 650 changed to CAGB 750-751 | `ICSS-Primer.md` l.289-290 (Mon booking, 751 approved 17 Sep) |
| tycho | "from the 29th onwards" changed to "from Thursday 29 October" (facts box and Join) | Ollie's own commit 80e64ea, 28 Sep. Sessions are on Thursdays and 29 Oct 2026 is a Thursday |
| tycho | Photo caption "hot-fire ... in July" now gives no month. There is no year anywhere, and the vault has no record of the date (W9) | none, so the month is dropped |
| events | Movie night: "LT1, Blackett Laboratory." | `Socials-and-Collabs.md` l.49 |
| events | Hackathon "pizza lunch both days" changed to "free lunch and prizes" | Pizza appears only in the cost estimate (`Hackathon-Nov-2026.md` l.37). The vault says "free lunch and prizes" (`ICSS-Events-Hub.md` l.161) |
| join | New rows for Events Officer (Thomas van Pul) and Project Officer (Tim Barrett), removed from the generic Committee row | `Atlas/Clubs/ICSS.md` l.31, l.35; `ICSS-Primer.md` l.132 |
| 7 project pages | "Last checked 2 October" changed to "3 October" | |

IPRL's "16th at ERC 2025" (W20) is now confirmed by an outside source: the [Imperial EEE blog, 5 Sep 2025](https://blogs.imperial.ac.uk/electrical-engineering/2025/09/05/erc-25/) says "Our final standing for the ERC2025 was 16th place". The page is unchanged.

## Gate
- **Link check 0 dead: met for every link I could reach.** `python3 tools/check_links.py` (local files and anchors): 48 pages, 0 broken. With `--external`: 143 reported. 2 of those are the bare `fonts.googleapis.com` / `fonts.gstatic.com` preconnect hosts, which return 404 at the root by design and are not links. The other **141 are all `web.archive.org`**, and this Mac gets "connection refused" from that host (curl exit 7), while `archive.org` returns 200 and `example.com` returns 200. WebFetch is blocked from web.archive.org too. The archive.org availability API is unreliable: it said Wikipedia's Project_Daedalus has no snapshot. So **those 141 are not verified either way.** 2 are on blog.html (W40/W41) and the rest on the `archive/` pages. They are unchanged since main. The other 83 external links returned OK.
- **Every lead name traced: 16 of 23 names trace to the vault. 7 trace only to the 2026/27 welcome talk deck, via git.** Table below.
- **Screenshots looked at:** all 12 pages at 1440 and 390 px are in iCloud `Atrium/ICSS/website/2026-10-03/` (24 PNG). I looked at svarog-390, join-1440, events-390 and index-1440. No page scrolls horizontally at either width (`scrollWidth` check). The main page matches the 2 Oct design.

## Name trace
| name | where on site | source |
|---|---|---|
| Oliver Edmond | join (Chair) | ICSS.md l.45 |
| Thomas van Pul | join (Events Officer), rocketry | ICSS.md l.31; HPR-Hub.md l.11, l.25 |
| Curtis | rocketry | HPR-Hub.md l.11 |
| Tim Barrett | join (Project Officer), tycho | ICSS.md l.35; ICSS-Primer.md l.132 |
| Sahil Bhargava | join, svarog (project lead) | Email.md l.121; Svarog-Interview-Brief.md l.14 |
| Shiki Vaahan / Shiki Mahesh Devan | svarog / join | ICSS-Project-Svarog.md l.202 / l.197 (both forms are in the vault; likely one person) |
| Lalith Velamakanni | join, tycho (project) | ICSS-Primer.md l.79, l.153 |
| Samuel | iprl (technical) | ICSS.md l.155; ICSS-Primer.md l.414 |
| Etienne Franzi | join (Secretary) | first name only: Primer l.155. Surname and role from the deck (Amy, 830d792) |
| Tomas Bezkorowajnyj | join (Treasurer) | first name only: Primer l.155, ICSS.md (AstroSoc). Surname and role from the deck |
| Mikhail Ischenko | join (Comms), stratus | "Misha", probably PR: Primer l.119, l.150. Surname from the deck |
| Lucas Cheung | join, stratus | "Lucas, Stratus": Primer l.153. Surname from the deck |
| Xuan Loong Hoh | join | **deck only**; may be "Jayden Hoh" (Primer l.159) |
| James Squire | tycho (technical) | **not in the vault**; added by Ollie himself in commit 80e64ea (28 Sep) |
| Charlotte Cao | iprl (research branch) | **deck only** (830d792) |

I kept the deck-only names. Ollie and Amy put them up from the 2026/27 welcome talk, which is a newer and more direct source than the vault's silence. Removing committee members from the society's page is not my call.

## Needs Ollie (all facts only he knows)
1. Surnames and roles for Secretary, Treasurer and Comms; who Xuan Loong Hoh is; Charlotte Cao; James Squire. All are on the site now.
2. Mini Rover lead (rover.html says "To be confirmed").
3. Stratus room: the site says CAGB 749, the vault booking says 750-751 with a weekday fix pending. Kept 749.
4. Svarog room: I changed it to 750-751 per the vault. If the deck's CAGB 650 was right, it should go back. There is an HTML comment at svarog.html l.64.
5. Which form of Shiki's name to print.
6. Tycho: is SKEM 060 right for the intro sessions, and when do they start?
7. A new X/Twitter handle (the link was removed 2 Oct).

## Needs Amy
- The Vercel project is still on her account, so previews need her login. Thomas answered on 2 Oct that asking for a password is hard. The local screenshots replace the previews for Ollie.

## Deferred
`findings.py --touching` found no open findings for icss-website.

## Deliverables
- path: ~/Library/Mobile Documents/com~apple~CloudDocs/Atrium/ICSS/website/2026-10-03/ | what: 24 screenshots (12 pages, 1440 and 390 px) of the updated site | do: send to Ollie, or look before merging | at: 2026-10-05T18:00

## Odd / decisions taken
- **Not pushed.** The task says no deploy, and a push builds a Vercel preview. So PR #3 on GitHub doesn't have bbd1f50 yet. To push: `git -C ~/Developer/icss-website push origin subpages-redesign`.
- **Svarog room vs Stratus room.** I followed the vault for Svarog because 751 was recorded as approved, and "650" looks like a typo of "750". I kept 749 for Stratus because the vault's Friday booking was never confirmed, and the deck may show the fix.
- I updated the vault: `ICSS-Outdated-Audit.md` (status of W10, W13, W14, W17, W20, W26, W34, plus a 3 Oct line) and `hot.md` (ICSS website line).
- The Welcome Talk HPR slide still says "funding ready". That is outside this repo and was flagged 2 Oct.
- Checking out `subpages-redesign` hides `.review/archive`, `done` and `BLOCKER.md`, because local `main` tracks them in its automatic snapshot commits and the PR branches come from origin/main. I put the repo back on `main` at the end, so they are back.
