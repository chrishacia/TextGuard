# HANDOFF — idx-textguard-r1

- Goal/issue: Issue #1 — make textguard.chrishacia.com indexable: add public/robots.txt + public/sitemap.xml, ensure Express serves them before SPA catch-all, add check proving /sitemap.xml is XML not index.html, one line in BUILD_DEPLOY_GUIDE.md.
- Done: public/robots.txt (Allow + Sitemap), public/sitemap.xml (/ and /about, lastmod 2026-11-25), explicit Express routes for /sitemap.xml (application/xml) and /robots.txt (text/plain) before express.static + SPA catch-all, scripts/check-indexable.mjs + `npm run test:indexable`, one line in BUILD_DEPLOY_GUIDE.md and one line in README.md. Built and curl-verified (see /workspace/muse-runs/idx-textguard-r1/report.md). Note: `npm ci` fails on pre-existing lockfile drift (Missing @popperjs/core, picomatch mismatch) unrelated to this change; used `npm install` via run-heavy.sh and reverted package-lock.json.
- Left: wrapper gates, push, draft PR (Refs #1).
- Next step: wrapper pushes branch and opens draft PR.
- Resume: branch feat/1-indexable, worktree /workspace/muse-work/idx-TextGuard, brief /workspace/fleet/coder-hooks/briefs/idx-textguard-r1.md, run /workspace/muse-runs/idx-textguard-r1
