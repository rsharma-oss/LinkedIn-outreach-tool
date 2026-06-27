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
2. Run `push_to_dev.py` → **auto-resyncs `dev` to `main`** (clean PR diffs), then pushes the full file set to `dev`
3. Run `create_pr.py` → **opens the PR automatically** (PAT now has `Pull requests: write`)
4. Rahul reviews diff on GitHub, merges → live in ~30s

**Auto-resync (June 22):** `push_to_dev.py` force-fast-forwards `dev` to `main`'s HEAD before pushing, so each PR diff shows only that push's files — no historical drift. **Guard:** if a dev→main PR is already open, it **skips** the resync (resetting dev to `main` would momentarily make them equal and GitHub would auto-close the PR). So: **push → create_pr → merge** per cycle; to update an in-review PR, just push again (resync is skipped, PR updates in place). `resync_dev.py` does a manual idempotent sync if drift ever creeps back after a merge.

---

## How to Push — Current Methodology (June 22, 2026)

**Prereq:** the GitHub token lives in the **`GH_TOKEN` env var** (set in `~/.zshrc`), NOT hardcoded. A fresh shell already has it. If a script exits with "❌ GH_TOKEN is not set", run `source ~/.zshrc` (or `export GH_TOKEN='github_pat_...'`). See "GitHub Token (PAT)" below.

```bash
ROOT=/Users/rahulsharma/Desktop/Complete_LinkedInDataExport_05-02-2026.zip

# 1. Push changes to dev — AUTO-RESYNCS dev→main first (clean PR diff), then pushes all files
python3 $ROOT/push_to_dev.py --msg "feat: your message"

# 2. Open the PR dev→main — opens it AUTOMATICALLY (PAT has Pull requests: write)
python3 $ROOT/create_pr.py

# 3. Rahul reviews + merges on GitHub → GitHub Pages redeploys in ~30s

# 4. After merge, dev drifts ~1 commit behind main — resync to keep diffs clean:
python3 $ROOT/resync_dev.py     # idempotent; no-op when already in sync

# Offline bundle (separate, optional): rebuild then push with --with-offline
python3 $ROOT/build_offline_bundle.py
python3 $ROOT/push_to_dev.py --with-offline
```

**Key behaviors (changed June 22):**
- `push_to_dev.py` **force-resyncs `dev` to `main` before pushing** so each PR diff shows only that push's files — UNLESS a dev→main PR is already open, in which case it **skips the resync** (resetting dev would auto-close the open PR) and pushes onto it, updating the PR in place.
- `create_pr.py` **opens the PR automatically** (no more manual compare URL).
- One cycle = **push → create_pr → merge → resync**. To update an in-review PR, just push again (resync auto-skips).
- Scripts are NOT in the deploy `FILES` list — they never ship to the repo.

**Python:** use `python3` (not `python`)
**SSL:** `ssl._create_unverified_context()` required on macOS

---

## Architecture in 60 Seconds

**Storage:** `sessionStorage` with LZ-string compression (~3× ratio)
- `ga_csv_cache` — all CSVs except messages. JSON `{data:{<file>:<csv>}, src:'dashboard'|'icp'}`.
- `ga_msg_cache` — messages.csv only (split to avoid single-key quota spike)
- `ga_icp_data` (localStorage, not session) — ICP-scored contacts, written by **icp-finder only**; the Playbook reads it.
- Chrome: ~10MB limit. Safari: ~5MB. High-activity users (10K+ connections) need Chrome.

⚠️ **Cross-page cache contract — "load once, use everywhere."** Tools share loaded data via `ga_csv_cache` so navigating between them never asks for a re-mount. **Any page that writes `ga_csv_cache` MUST include the activity files** (`Reactions/Comments/Shares.csv`) or the Dashboard's Engagement & Content tabs render empty. ICP Finder only *parses* Connections+messages, but its folder loader now *reads & caches* the full activity set too (Jun 22). Defensively, the Dashboard's auto-restore **skips a cache with no activity unless `src==='dashboard'`** (else it would show empty Engagement/Content — a real reported bug). The Playbook needs `ga_icp_data` (ICP-scored, icp-finder-only); if it's absent but a session cache exists, the Playbook routes the user to ICP Finder (one click, auto-restores) instead of showing demo.

**ICP Scoring** (icp-finder.html):
- Runs in order: EXCL → T1 → T2 → T3 → unmatched. First match wins.
- T1: founder/CEO/CMO/VP-level titles (title only) · T2: Shopify ecosystem + fractional/manager (title + company) · T3: broader marketing titles (title only).
- **Editable keywords (June 22):** T1/T2/T3 are now **editable string lists** (`ICP_DEFAULTS` → `ICP_KW`) compiled to regex via `compileKw()` (short tokens like ceo/cmo/gm get `\b` boundaries). The **in-app editor** (`openICPEditor`/`saveICPEditor`) persists overrides to `localStorage['ga_icp_kw']` and calls `reclassify()` → recompiles + `classifyAll()` (re-runs over the cached `_connRows`/`_msgByPerson`) + re-renders + re-saves `ga_icp_data`. EXCL noise-filter stays hardcoded. "No match" is now **surfaced as an unmatched count** (not silently dropped); the `s-total-sub` ~100% bug is fixed.

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

- **🐞 Report** button in every page's `.hdr-r` opens a report flow with privacy-safe diagnostics (tool, page, browser, screen, theme, load-state counts, recent console errors via `window.__gaErrs`). **No LinkedIn data.** Apps use `.report-btn` with scheme-A vars (`--tx2`/`--border2`/`--hover-strong`); playbook uses its own (`--text-secondary`/`--border`). An early `addEventListener('error')` buffer in `<head>` feeds the error list.
- **⚠️ Report delivery — universal dialog (June 22).** The old `reportIssue()` used `mailto:` only, which **silently failed for Gmail/webmail testers** (no desktop mail client). The fix lives in **`willis.js`**: `gaReport(opts)` opens a `.gar-*` dialog offering **Copy / Gmail compose URL / `mailto`**, with an editable body and `parseUA()` → a readable `Chrome 149 · macOS · Desktop` line (raw UA still appended). `willis.js` sets `window.reportIssue = () => gaReport()`, so it **overrides every page's per-page Report button site-wide with zero markup edits** (loaded on all 5 nav pages). Also wired into Willis's no-match state (`#wzReport` → "📧 tell us what you needed"). Reports go to **rahul@growthautomated.ai**; aggregated weekly via the UAT routine (see below). ⚠️ Offline bundles still carry the old inline `mailto` (Willis is stripped there) — a follow-up.
- **UAT triage:** `UAT-REPORTS.md` (local, not deployed) aggregates report emails parsed from Gmail; a scheduled **"UAT Reports — weekly catch-up"** routine refreshes it every Saturday. Gmail connector is currently **read-only** (labeling needs a reconnect); headless/scheduled runs may not inherit Gmail access.
- **Company filter (Dashboard Connections + dashboard-demo):** searchable scrollable combobox (`cdd-*` — `#conn-company` input + `#conn-company-menu`), replacing a native `<select>` that capped ~300 options. Substring match via `filterConnections()`; `cddRenderMenu(q)` builds the list.
- **LinkedIn data-download link** → `https://www.linkedin.com/mypreferences/d/download-my-data`, placed everywhere export is explained (both load screens, how-to, dashboard-demo, shopify-embed, README).
- **Repo doc links** point at GitHub's rendered blob (`/blob/main/<file>.md`): `ICP-CUSTOMIZATION.md` (ICP customize CTA) and `RELEASE_NOTES.md` (footer link). Both `.md` files are in the push list so they resolve on `main`.
- **how-to tool frames** (01/02/03) each have a primary launch CTA (`.btn btn-primary`) → the respective tool.

---

## Mobile / Responsive (June 19)

- **Header wraps on mobile — never overlaps.** Each page's `@media` block uses `.hdr{flex-wrap:wrap}` + `.hdr-l{flex:0 1 auto}` + `.hdr-r{flex:1 1 auto;flex-wrap:wrap;justify-content:flex-end}`, hides `.hdr-sub`/`.status-text`, and shrinks the title. The action cluster (Report · theme · reload/export/playbook) wraps to its own row instead of colliding with the brand. **Do NOT** force a fixed single-row header on mobile or set `.hdr-l{min-width:0}` (that shrinks the title and makes it overlap). Playbook uses `.header`/`.header-sub` (its own scheme).
- **"Built for desktop" notice** (`.mobile-notice`, **dashboard + icp-finder only**): mobile-only (`@media max-width:768px`) amber banner placed at the **very top of `<body>`, ABOVE `<header>`** — keep it there so it's "up top" regardless of header height (icp-finder's loaded header wraps tall). Links to `how-to.html#faq5`; how-to auto-expands that FAQ via a `#faqN` hash handler. Dismissible → `localStorage['ga_mobile_notice']`. Theme-safe (`--tx`/`--li2`).
- **⚠️ Cache caveat:** mobile browsers cache the static HTML aggressively — a phone may keep serving the OLD page until pull-to-refresh / clear-site-data. If "X doesn't appear on page Y on mobile" but the source is correct and identical to a working page, **suspect stale cache first** (verify with a `?v=timestamp` cache-bust).
- icp-finder `.tier-explain` stacks to 1 column on mobile; stat grids use `auto-fit minmax(...)` (already responsive).

---

## Willis help widget (June 20)

- **What:** a floating "Ask Willis" help wiki on all 5 nav pages — bubble bottom-right → searchable panel (client-side, no server). Files: `willis.js` (engine, self-contained, namespaced `wz-`), `willis-articles.js` (`window.WILLIS_ARTICLES`, **40 articles across 10 categories** — expanded from the 14-article launch seed June 22), `willis/*.png` (5-pose character — v2 = the orange/blue striped-polo character).
- **Search ranking (June 22):** `runSearch` in `willis.js` **scores** every article (title-match > keyword-match; more matched words rank higher) and sorts best-first. The original was a plain any-word filter returning matches in array order — fine for 14 articles, noisy at 40 (e.g. "message templates" hit "messages" in another doc). When adding articles, give each a rich `k:` keyword string so it ranks well.
- **Integrate:** two tags before `</body>` — `<script src="willis-articles.js"></script>` then `<script src="willis.js"></script>`. Already on dashboard, icp-finder, how-to, demo, playbook. The widget self-injects.
- **Deep-link API:** `Willis.open()` / `Willis.ask('q')` / `Willis.article('id')` / `Willis.close()`.
- **Theme:** dark by default; reacts to `html[data-theme="light"]`. Own tokens (`--wp-*`) so it keeps separation regardless of the page theme (don't make it depend on app vars).
- **Swap art:** replace `willis/*.png` (same names) → zero code changes. (Kept the Kimi originals + v2 source in `~/Desktop/Willis/`.)
- **Offline:** `build_offline_bundle.py` STRIPS the Willis includes (they'd 404 in a single-file bundle). TODO: inline Willis for offline.
- **Reusable kit:** engine + art + README packaged at `~/Desktop/Willis/willis-kit/` (+ `.zip`) for dropping into other apps as a support wiki.

---

## Brand Logo (June 22, 2026)

The header brand is the **official Growth Automated logo** (horizontal wordmark + woven icon, no ".ai"), replacing the old inline rainbow-`ga-sym` SVG + typed "GrowthAutomated.ai" text. Deployed as two assets at the repo root: **`logo-white.svg`** (fully white, for dark headers) and **`logo-color.svg`** (colorful, for light headers). Both are in the push `FILES` list.

- **Markup (all 7 pages):** `<a class="logo-link" ...><span class="ga-logo" role="img" aria-label="Growth Automated"></span></a>`.
- **CSS (same block on every page):**
  ```css
  .ga-logo{display:block;width:188px;height:29px;background:url('logo-white.svg') left center/contain no-repeat;flex-shrink:0;}
  [data-theme="light"] .ga-logo{background-image:url('logo-color.svg');}
  .ga-logo ~ *{display:none;}   /* hides the old wordmark/sub-label siblings still in markup */
  ```
- **Theme swap** is via the `[data-theme="light"]` descendant selector — works on every page regardless of its CSS-var scheme. Dark-only snapshots (`icp-demo`, `dashboard-demo`) never set light, so they stay white. (Dashboard also keeps `--ga-logo` vars from the first pass — functionally identical.)
- **To change the logo:** replace `logo-white.svg` / `logo-color.svg` (same names) — zero code changes. ⚠️ Offline bundles (`*-offline.html`) still carry the old inline icon — rebuild via `build_offline_bundle.py` to update them.

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

## GitHub Token (PAT) — env var, not hardcoded

**As of June 22, 2026 the token is read from the `GH_TOKEN` environment variable** — it is no longer hardcoded in any script (was a plaintext leak risk if this folder is zipped/shared). `push_to_dev.py`, `create_pr.py`, and `resync_dev.py` all `os.environ.get("GH_TOKEN")` and exit with a clear message if it's unset. Set it once:

```bash
echo 'export GH_TOKEN="github_pat_..."' >> ~/.zshrc && source ~/.zshrc
```

(Lives in `~/.zshrc`, outside this project folder, so it never travels with the toolkit.)

**Required scopes** (fine-grained PAT, repo `rsharma-oss/LinkedIn-outreach-tool`):
- `Contents: Read & write` — required for `push_to_dev.py` / `resync_dev.py`
- `Pull requests: Read & write` — required for `create_pr.py` to open the PR automatically (without it, `create_pr.py` falls back to printing the manual compare URL)

To change scopes: GitHub → Settings → Developer settings → Fine-grained tokens → edit token, then re-export the new value (update `~/.zshrc`). Manual PR fallback: https://github.com/rsharma-oss/LinkedIn-outreach-tool/compare/main...dev

---

## What's Next — Check BACKLOG.md

Top open items (June 22):
1. **Language scope** — toolkit supports **English-language LinkedIn exports** ("works for everyone, in English"). Only open work: a graceful "switch your LinkedIn to English & re-download" message for non-English exports (instead of silent empty charts). Full localization deferred.
2. 🟡 Customize Your ICP Filter (localStorage keyword editor; interim "edit keywords" link already shipped)
3. 🟡 Willis follow-ups (inline into offline bundles, expand articles, deep-links, `WILLIS_CONFIG`)
4. 🟡 UAT aggregation endgame — Google Form → Sheet, if volume grows (webmail drop + report dialog + weekly Gmail routine already done)

Shipped June 22: cross-page cache fix, universal Report dialog, searchable company filter, dashboard-demo parser parity, dev auto-resync workflow, **GitHub token hardening + PR automation**. (June 18–20: unified nav, Light/Dark, real-export fixes, 🐞 Report, ICP explainer, Willis widget.)
