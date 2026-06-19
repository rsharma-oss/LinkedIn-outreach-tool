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
| `outreach-playbook-demo.html` | Demo playbook page (own CSS-var scheme — see Theming) |
| `demo.html` | Book-demo page (also a themed nav page) |

Plus standalone sample snapshots `icp-demo.html` / `dashboard-demo.html` (nav present, dark-only). **Editing nav / theme / Report button touches all 7 pages.**

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

**L1 nav — CANONICAL (June 18 2026).** One shared nav across ALL 7 pages (dashboard, icp-finder, how-to, outreach-playbook-demo, demo, icp-demo, dashboard-demo). Markup is identical everywhere except the `.active` link; only the brand sub-label and `.hdr-r` controls vary per page.

Order: `📘 How It Works · 📊 Dashboard · 🎯 ICP Finder · 📋 Playbook · [Book Demo]` (Book Demo = `.cta`, never `.active`).

CSS uses **literal colors** on the 5 non-themed pages (how-to, demo, playbook, icp-demo, dashboard-demo) so they render identically regardless of each file's variable scheme. The 2 themed apps (dashboard, icp-finder) use theme vars (`--nav-idle`, `--nav-idle-hover`, `--hover-strong`) whose **dark defaults equal these literals** — so dark rendering is identical everywhere, and the nav adapts in light mode. Reference (dark values):
```css
.nav-link        { color: rgba(240,244,255,0.3); border:1px solid transparent; }
.nav-link:hover  { color: rgba(240,244,255,0.8); background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.06); }
.nav-link.active { color: #f0f4ff; background: rgba(0,160,220,0.26); border-color: rgba(0,160,220,0.44); font-weight:700; }
.nav-link.cta    { background: #0077B5; color:#fff; font-weight:600; }
.nav-link.cta:hover { background: #00a0dc; }
```
Container is `<header class="hdr">` (playbook's outer wrapper is still `.header` — visually identical). If you touch the nav, change it in all 7 files. The old `.hn-link` class is retired.

**Header layout = balanced 3-column flex (keep it centered).** `.hdr-l{flex:1 1 0}` · `.hdr-nav{flex:0 0 auto}` · `.hdr-r{flex:1 1 0;justify-content:flex-end}`. The equal `flex:1` side zones force the nav to true page-center on every page regardless of brand/control widths. Do NOT use `margin:0 auto` on `.hdr-nav` (that centers in *leftover* space → nav shifts per page). Every header has all 3 zones — how-to & playbook carry an empty `<div class="hdr-r"></div>` purely to balance the layout.

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

⚠️ **Header casing is NOT consistent across LinkedIn export files.** Verify against a real export, never assume.

| File | Real header format | Example headers |
|------|--------------------|-----------------|
| `messages.csv` | **UPPERCASE + spaces** | `FROM`, `TO`, `DATE`, `CONVERSATION TITLE`, `CONTENT` |
| `Connections.csv` | Title Case + spaces | `First Name`, `Connected On`, `Company`, `Position` |
| `Reactions/Comments/Shares.csv` | Title Case | `Date`, `Type`, `Link` |
| `Invitations.csv` | Title Case + spaces | `From`, `To`, `Sent At`, `Direction` |
| `Profile.csv` | Title Case + spaces | `First Name`, `Headline` |

**Filename trap:** some exports suffix activity files with a member-id — `Reactions_5175237.csv`, `Comments_5175237.csv`, `Shares_5175237.csv`, `Member_Follows_5175237.csv` (Connections/messages/Profile/Positions/Invitations stay plain). Both apps run every intake filename through `canonicalName()` (strips a trailing `_<digits>` before the extension) so they match the `wanted` list. Without it, the dashboard's Reactions/Comments/Shares/Follows silently load empty. (Verified June 19 against a real export: 11,811 reactions / 3,727 comments / 672 shares / 1,626 follows that were all 0 before the fix.)

**The trap:** `messages.csv` is the only UPPERCASE/spaced file. dashboard.html's code reads TitleCase keys (`From`, `Date`, `ConversationTitle`) — so in `processFiles` it **normalizes message headers** (`tcKey`: lowercase → strip spaces → TitleCase each word) right after parsing, guarded by `!('Date' in D.messages[0])` so the TitleCase demo data is left alone. icp-finder.html instead reads with fallbacks: `r['FROM'] || r['From']`. Either pattern is fine — but if you add new message-field reads, **don't assume `From`/`Date` exist on raw rows.** (June 18: dashboard Messages tab was broken because it read only `From`/`Date`/`ConversationTitle` with no normalization → empty dates, 0 sent, no top contacts on real exports.)

---

## What's Been Tried and Rolled Back

| Feature | Status | Notes |
|---------|--------|-------|
| Light/Dark Mode | ✅ Shipped (v2, Jun 18) | See "Theming" below. ALL 5 nav pages: dashboard, icp-finder, playbook, how-to, demo. v1 revert reasons all fixed. (Only icp-demo.html + dashboard-demo.html — the standalone sample snapshots, not nav destinations — remain dark-only.) |
| Dropdown filter component | ❌ Reverted | User preferred pills. Custom `dd-wrap/dd-trigger/dd-menu` CSS still in icp-finder.html as dead CSS |

## Theming (Light/Dark) — all 5 nav pages (dashboard, icp-finder, playbook, how-to, demo)

- `:root` = dark defaults; `[data-theme="light"]` on `<html>` overrides them. **Dark values are unchanged** from pre-theme — don't "tidy" them.
- ⚠️ **Playbook uses a SEPARATE variable scheme** (`--bg-primary`, `--text-primary`, `--accent`, `--bg-card`…), so its `[data-theme="light"]` block overrides *those* names, not the apps' `--bg`/`--tx`/`--li`. Its toggle is `.theme-toggle` (not `.btn-icon`). Keep the two schemes in sync conceptually but edit each file's own vars.
- Previously-hardcoded colors are now vars: `--hdr-grad`, `--hover`, `--hover-strong`, `--track`, `--hairline`, `--scroll`, `--nav-idle`, `--nav-idle-hover`, `--tab-idle`, `--tab-hover`, `--pm-use` (dashboard also `--chart-grid/-tick/-label`). Add new colored UI via these vars, not literals, or it won't theme.
- FOUC script is the first thing in `<head>`. Persistence: `localStorage['ga_theme']`. Toggle button: `#theme-btn` in `.hdr-r`.
- **Chart.js (dashboard only):** `applyChartTheme()` syncs `GC` from CSS vars and updates every chart in the `charts[]` registry. Call it after any theme change AND after rendering new charts in light mode. icp-finder has no Chart.js.

---

## UAT Report Button & External Links (June 19)

- **🐞 Report** button in every page's `.hdr-r` → `reportIssue()` opens a pre-filled `mailto:rahul@growthautomated.ai` with privacy-safe diagnostics (tool, page, browser, screen, theme, load-state counts, recent console errors via `window.__gaErrs`). **No LinkedIn data.** Apps use `.report-btn` with scheme-A vars (`--tx2`/`--border2`/`--hover-strong`); playbook uses its own (`--text-secondary`/`--border`). An early `addEventListener('error')` buffer in `<head>` feeds the error list.
- **LinkedIn data-download link** → `https://www.linkedin.com/mypreferences/d/download-my-data`, placed everywhere export is explained (both load screens, how-to, dashboard-demo, shopify-embed, README).
- **Repo doc links** point at GitHub's rendered blob (`/blob/main/<file>.md`): `ICP-CUSTOMIZATION.md` (ICP customize CTA) and `RELEASE_NOTES.md` (footer link). Both `.md` files are in the push list so they resolve on `main`.
- **how-to tool frames** (01/02/03) each have a primary launch CTA (`.btn btn-primary`) → the respective tool.

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

Top open items (June 19):
1. 🔴 Locale-Tolerant CSV Parsing — non-English exports parse empty (the "works for anyone" gap)
2. 🔴 Harden GitHub token + PR automation (PAT needs `Pull requests: write` — also unblocks `create_pr.py`)
3. 🟡 Customize Your ICP Filter (localStorage keyword editor; interim "edit keywords" link already shipped)
4. 🟡 Hosted UAT feedback form (upgrade the `mailto` Report button to aggregated triage)

Shipped this sprint (June 18–19): unified + centered nav, Light/Dark on all 5 nav pages, messages + member-id-suffix real-export fixes, 🐞 Report button, ICP explainer + FAQs, LinkedIn download links, per-tool CTAs.
