# LinkedIn Toolkit — Claude Session Context

> Read this first. It tells you everything you need to work on this project.

---

## What This Is

A fully client-side LinkedIn analytics and outreach tool. Users upload their LinkedIn data export — the tool parses, classifies, and visualises their network. **Nothing leaves the browser.** Hosted on GitHub Pages.

**Live site:** https://rsharma-oss.github.io/LinkedIn-outreach-tool/
**Repo:** `rsharma-oss/LinkedIn-outreach-tool`
**Owner:** Rahul Sharma — rahul@growthautomated.ai
**Target user:** Shopify DTC growth agency founders

---

## Files You'll Edit

| File | What It Is |
|------|-----------|
| `dashboard.html` | Full analytics dashboard — 6 tabs, Chart.js, sessionStorage cache |
| `icp-finder.html` | ICP classifier + outreach planner + message templates |
| `how-to.html` | Landing / instructions page |
| `outreach-playbook-demo.html` | Demo playbook page |

Supporting docs (keep these updated):
- `HANDOFF.md` — full reverse-engineered PRD (architecture, features, scoring logic)
- `BACKLOG.md` — prioritised backlog with requirements for each item
- `RELEASE_NOTES.md` — sprint-by-sprint changelog

---

## Branch Strategy

```
main   →  production (GitHub Pages auto-deploys from here)
dev    →  all work happens here — push here by default
```

**Workflow:**
1. Make changes to HTML/JS files
2. Run `push_to_dev.py` → pushes to `dev` branch
3. Run `create_pr.py` → opens a PR from dev → main
4. Rahul reviews diff on GitHub, merges → live in ~30s

---

## How to Push

```bash
# Push current changes to dev branch
python3 /Users/rahulsharma/Desktop/Complete_LinkedInDataExport_05-02-2026.zip/push_to_dev.py

# Push dev → main PR (do this when ready to go live)
python3 /Users/rahulsharma/Desktop/Complete_LinkedInDataExport_05-02-2026.zip/create_pr.py

# Build offline bundle (needs internet — run before pushing offline files)
python3 /Users/rahulsharma/Desktop/Complete_LinkedInDataExport_05-02-2026.zip/build_offline_bundle.py

# Push with offline files included
python3 /Users/rahulsharma/Desktop/Complete_LinkedInDataExport_05-02-2026.zip/push_to_dev.py --with-offline
```

**Python:** use `python3` (not `python`)
**SSL:** `ssl._create_unverified_context()` required on macOS

---

## Architecture in 60 Seconds

**Storage:** `sessionStorage` with LZ-string compression (~3× ratio)
- `ga_csv_cache` — all CSVs except messages
- `ga_msg_cache` — messages.csv only (split to avoid single-key quota spike)
- Chrome: ~10MB limit. Safari: ~5MB. High-activity users (10K+ connections) need Chrome.

**ICP Scoring** (icp-finder.html, lines ~1888–1899):
- Runs in order: EXCL → T1 → T2 → T3 → excluded
- T1: founder/CEO/CMO/VP-level titles (title only)
- T2: Shopify ecosystem tools + fractional/manager titles (title + company)
- T3: broader marketing titles (title only)
- First match wins. No match = contact excluded from ICP entirely.

**Charts:** Chart.js 4.4.1. Color config: `const GC` object (~line 1039 in dashboard.html)
- `GC.color` — text color
- `GC.grid` — grid line color  
- `GC.tick` — axis tick color

**Nav CSS variables:**
- `--tx` full white, `--tx2` subdued, `--li` LinkedIn blue (#0a66c2 range)
- `--bg`, `--bg2`, `--bg3`, `--bg4` — background layers
- `--border`, `--border2` — border colors

---

## CSS Conventions (current state)

**L1 nav links** — 3 states:
```css
.nav-link          { color: rgba(240,244,255,0.3); }
.nav-link:hover    { color: rgba(240,244,255,0.8); background: rgba(255,255,255,0.08); }
.nav-link.active   { color: var(--tx); background: rgba(0,160,220,0.26); border-color: rgba(0,160,220,0.44); }
```

**L2 dashboard tabs:**
```css
.tab               { color: rgba(240,244,255,0.38); }
.tab:hover         { color: rgba(240,244,255,0.78); }
.tab.on            { color: var(--tx); border-bottom: 3px solid var(--li); background: rgba(0,160,220,0.16); }
```

**L2 ICP view tabs:**
```css
.view-tab          { color: rgba(240,244,255,0.32); }
.view-tab:hover    { color: rgba(240,244,255,0.72); }
.view-tab.active   { color: var(--tx); border-bottom-color: var(--li); background: rgba(0,160,220,0.1); }
```

---

## CSV Field Names — Critical

LinkedIn exports use **title case**. These exact names must be used in code:

| File | Field | Correct | ❌ Wrong (past bugs) |
|------|-------|---------|-----|
| `messages.csv` | Date | `Date` | `DATE` |
| `messages.csv` | Sender | `From` | `FROM` |
| `messages.csv` | Contact name (sent) | `ConversationTitle` | `TO` (doesn't exist) |
| `Connections.csv` | Date connected | `Connected On` | — |

---

## What's Been Tried and Rolled Back

| Feature | Status | Notes |
|---------|--------|-------|
| Light/Dark Mode | ❌ Reverted | Chart.js rgba tints + GC object not fully dynamic. Requirements in BACKLOG.md |
| Dropdown filter component | ❌ Reverted | User preferred pills. Custom `dd-wrap/dd-trigger/dd-menu` CSS still in icp-finder.html as dead CSS |

---

## Commit Message Format

```
feat: short description
fix: short description
revert: what and why
docs: what changed
refactor: what and why
```

Examples:
```
feat: nav contrast upgrade — L1/L2/pills
fix: lzstring missing from offline bundle
revert: dark mode — Chart.js colors not fully updating
docs: add HANDOFF.md reverse-engineered PRD
```

---

## Key Numbers

- `TARGET_MO = 10` — posts/month target (Content scorecard)
- `TARGET_CONSISTENCY = 75` — % weeks with ≥1 post
- `TARGET_VARIETY = 3` — themes/month
- Outreach caps: Hot 20, Warm 15, Cool 30, T2 20
- 7 outreach templates: t1, t1b, t2, followup1, followup2, re1, re2

---

## PAT Permissions Note

Current GitHub PAT has **Contents** permission only. To enable `create_pr.py` to open PRs automatically, add `Pull requests: read & write` in:
GitHub → Settings → Developer settings → Fine-grained personal access tokens → edit token

Until then, create PRs manually at: https://github.com/rsharma-oss/LinkedIn-outreach-tool/compare/main...dev

---

## What's Next — Check BACKLOG.md

Top items:
1. 🔴 Light/Dark Mode (full requirements documented in BACKLOG.md)
2. 🔴 Customize Your ICP Filter (localStorage-persisted keyword editor)
3. 🔴 ICP Scoring FAQ (inline transparency)
4. 🟡 How-To page audit — verify offline download links are correct
