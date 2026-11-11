# icss-website: merge PR 4, verify Search Console in Chrome, submit sitemap

RESULT: PARTIAL
GATE: none (no gate for this repo; the task Checks were run by hand: 2 of 3 pass)
SESSION: e7831b9b-19a9-4f59-a3b7-f5abc3c8ce99
HUMAN: Run this task from a Claude Code session that has the Claude in Chrome extension connected (this headless session has no mcp__claude-in-chrome__* tools); the sign-in itself is already approved (grant-2026-10-16-signed-in-chrome).
PREMISE: held for step 1 (hackathon date 14-15 November confirmed on the PR page); steps 2-4 assumed Chrome access that this session does not have.
SHOW: https://ic-space-society.vercel.app/autumn-hackathon.html

Pool: main

## Done
PR #4 (event pages + Event JSON-LD) squash-merged to main. Hackathon date on the page reads 14-15 November 2026, still right. After about 45 s the live site serves autumn-hackathon.html with the Event markup, and sitemap.xml lists autumn-hackathon.

## Not done
Steps 2-4 (add the Search Console property with the HTML tag method, set GOOGLE_SITE_VERIFICATION in tools/seo.py, push, Verify, submit sitemap, add owner, Rich Results Test) need Claude in Chrome. ToolSearch found no claude-in-chrome tools; only the Playwright MCP is present and it has no Google session. I did not try to sign in with it, since that means entering a credential. GOOGLE_SITE_VERIFICATION is still empty, so check 1 (google-site-verification on the home page) fails.

## Checks
1. google-site-verification on home: FAIL (0 matches)
2. Event JSON-LD on autumn-hackathon.html: pass
3. sitemap lists autumn-hackathon: pass

## Neighbours checked
none touched. The orchestra file 2026-11-05T1601-search-console-three-sites is already archived as .dead-human.md, so the work was not duplicated.

## Scope / class
Every attempt on this class (4 tasks) has stopped on the same missing piece, a Chrome-capable session. The shared mechanism is dispatching Search Console tasks only to a session with Claude in Chrome; I did not change dispatch.

## One system
none: no loop rows written; the open loop is this report's HUMAN line.
