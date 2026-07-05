# LinkVault — Claude Session Context

> Read this first. It tells you everything you need to work on this project.

---

## What This Is

**The product is named "LinkVault" — _the LinkedIn outreach toolkit by Growth Automated_** (named June 2026). Growth Automated is the agency/maker brand; **LinkVault** is the product. (Repo/URL slug stays `LinkedIn-outreach-tool` for now.)

A fully client-side LinkedIn analytics and outreach tool. Users upload their LinkedIn data export — the tool parses, classifies, and visualises their network. **Nothing leaves the browser.** Hosted on GitHub Pages.

**Live site:** https://rsharma-oss.github.io/LinkedIn-outreach-tool/
**Repo:** `rsharma-oss/LinkedIn-outreach-tool`
**Owner:** Rahul Sharma — rahul@growthautomated.ai
**Target user:** Shopify DTC growth agency founders
**Brand colors (LinkVault):** LinkedIn Blue `#0A66C2` (primary) · Dark Navy `#0F172A` · White · Gray `#808080`. Wordmark font: Assistant. Icon: blue hex "vault" + white chain-link.

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
- **✅ Customizer is LIVE (un-gated June 28).** `icp-finder.html` now has the full customizer: the two-list + rank×domain engine inline, `<script src="icp-profiles.js">` + `<script src="icp-picker.js">`, the ✏️ Customize button in `.icp-note`, and the full editor modal (Pick-from-network + Edit-lists tabs, vertical presets, Save/Load config). **Storage keys** come from `window.ICP_K` — live page sets `{kw:'ga_icp_kw', exact:'ga_icp_exact', profile:'ga_icp_profile'}`; the prototype falls back to the `_proto` keys, so one shared `icp-picker.js` serves both. Engine = identical to the validated prototype. _(Old held demo `icp-finder-with-editor.held.html` is now superseded.)_
- **✅ Customizer UX overhaul (June 29) — guided modal + per-row tiering.** The editor modal is now a **guided 3-step flow**: Step 1 one-click **industry pills** (`fillProfilePills()` → `applyICPProfile()`), Step 2 the network picker, and an **Advanced** `<details>` holding the keyword textareas + Save/Load config. The picker is **per-row**: each row carries its own **T1/T2/T3/✕** buttons (`renderTitlePicker` → `onRowAssign` event-delegation on `#icp-pick-rows` → `assignOne(name,tier)`); the current tier is highlighted (`.icp-asg.on` — **solid** fills, after a light-mode white-on-tint contrast fix), and clicking the lit tier **toggles it off**. No more checkboxes / bottom assign-bar / tick-then-Save (that flow's "I selected rows, hit Save, nothing happened" confusion is gone; an interim `icpSaveApply()` guard via `window.icpPendingPicks()` still catches any stray selection). **Exact-exclude:** added `ICP_EXACT.excl{titles,companies}`, checked **first** in `classifyTier` and saved/loaded with the picks, so a per-row ✕ persists across reloads. **Cache-bust:** the picker is loaded as `icp-picker.js?v=N` (currently **v=4**) — bump `N` on any `icp-picker.js` change or returning users get stale JS against new markup; `build_offline_bundle.py`'s `inline_icp` regex tolerates `?v=N`. **Validated on a real 2,906-connection export** (all 4 presets re-tier sensibly; T2 named-accounts differentiate by vertical, T1 seniority is broad/vertical-neutral by design; assign/toggle/exclude work on real titles, zero errors). Keep picker logic in the external `.js` (an inline IIFE once broke the page).
- **ICP filter bar (June 28, `icp-filters.js`):** the ICP List filter bar is custom dropdowns (Tier · Recency · Engagement, built into `#icp-dd-row`) + a segment **pill nav** (`#icp-seg-nav`: All · T1 first message · Follow-up · Re-engage). Filter state lives in `window._flt`; `getFiltered()` defers to `window.icpFilterMatch(c)`. Replaces the native `<select>`s; loaded on `icp-finder.html` + inlined into the offline bundle. **`ship.py`** = one-command build → push → PR (local dev tool).
- **Prototype + multi-tenant config (June 28):** the **unlisted** `icp-finder-prototype.html` (in push `FILES`, not linked from nav) hosts the full customizer for evaluation — `icp-picker.js` (titles + companies multi-select engine) + `icp-profiles.js` (vertical preset library: DTC/SaaS/Telecom/FinServ). It has a **profile selector + Save/Load config** (export/import). **Config file format is specified in `ICP-CONFIG-FORMAT.md`** (`format:"linkvault-icp"`, v1) — the JSON an agency builds & ships; it carries tier labels/descriptions/keywords + per-config `exclude`. Prototype storage is isolated (`ga_icp_kw_proto`) so it never affects the live app. The picker JS is **external files** (not inline) — earlier an inline IIFE broke the page; keep this logic in `.js` files.
- **R8 two-list matching (June 28, prototype):** the prototype engine adds `ICP_EXACT` (parallel to `ICP_KW`): each tier has **exact** `titles`/`companies` (whole-field; companies also leading-word, legal suffixes stripped — `bell` → "Bell Canada" yes, "Taco Bell" no) plus **substring** `keywords`. `classifyTier` hits exact OR substring per tier. Picker picks → `ICP_EXACT` (persisted in `ga_icp_exact_proto`); textarea → `ICP_KW`. Config format and `icp-profiles.js` carry `companies`/`titles`/`keywords`. This **fixes the "Lucky Orange matched `orange`" bug.** _(June 28: this two-list engine is now **live** in `icp-finder.html` via the un-gate — see the "Customizer is LIVE" note above.)_
- **Three-axis tier model + rank×domain (June 28, prototype):** **T1 = seniority** (`t1.keywords` C-suite + `RANK_T1_RE` × `ICP_DOMAIN`: senior rank + a vertical domain word), **T2 = named accounts** (exact `companies`, global), **T3 = broad sector** (`RANK_T3_RE` Sr Manager/Manager × domain + role/concept `keywords`). Floor: Director-up → T1, Sr Manager → T3. Each profile carries a `domain` word list; the config file carries it as top-level `domain`. `classifyTier` order T1→T2→T3, first match wins; domain is title-only (so "Director, Marketing @ Rogers" → T2 by company, not telecom-T1). Concept words (wireless/banking) live in T3, not T2.

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

Order (as of **July 4 2026**): `📘 How It Works · 📊 Dashboard · 🎯 ICP Finder · 📋 Playbook`. **Book Demo was removed from the nav** — demo booking now lives as a **"📅 Book a demo →"** button in the Willis panel. The `.nav-link.cta` CSS below is retained but **dead** (no `.cta` link remains in any nav; a mobile rule `.hdr-nav .nav-link:not(.cta){display:none}` therefore hides *all* header links on mobile — tool-switching on mobile is via page content + the always-visible Willis bubble).

CSS uses **literal colors** on the 5 non-themed pages (how-to, demo, playbook, icp-demo, dashboard-demo) so they render identically regardless of each file's variable scheme. The 2 themed apps (dashboard, icp-finder) use theme vars (`--nav-idle`, `--nav-idle-hover`, `--hover-strong`) whose **dark defaults equal these literals** — so dark rendering is identical everywhere, and the nav adapts in light mode. Reference (dark values):
```css
.nav-link        { color: rgba(240,244,255,0.3); border:1px solid transparent; }
.nav-link:hover  { color: rgba(240,244,255,0.8); background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.06); }
.nav-link.active { color: #f0f4ff; background: rgba(0,160,220,0.26); border-color: rgba(0,160,220,0.44); font-weight:700; }
.nav-link.cta    { background: #0077B5; color:#fff; font-weight:600; }
.nav-link.cta:hover { background: #00a0dc; }
```
Container is `<header class="hdr">` (playbook's outer wrapper is still `.header` — visually identical). If you touch the nav, change it in all 7 files. The old `.hn-link` class is retired.

**Post-review hardening (July 4 2026, PR follows #58):** the dead `.nav-link.cta` CSS was **deleted from all 7 pages**; how-to's mobile rule `.hdr-nav .nav-link:not(.cta){display:none}` (which, with no .cta left, hid the whole nav) was replaced by `@media(max-width:680px){.hdr-nav{display:none}}` — same behavior as the app pages, so how-to keeps its nav at 681–768px. A guarded **"Report an issue" link now lives in every `.lv-foot-links` footer** (`window.reportIssue&&reportIssue()` — willis.js upgrades it to the gaReport dialog; the per-page mailto fallback catches willis-load failures). The two dark-only snapshots (icp-demo, dashboard-demo) now **load Willis** (articles + engine tags before `</body>`), restoring a booking + report path there.

**Nav declutter (July 4 2026) — what moved:** (1) **Book Demo** removed from nav → "📅 Book a demo →" button in the Willis panel (`renderIdle` home view, `.wz-act-demo`). (2) **🐞 Report** removed from the nav on the 5 themed pages → "🐞 Report a bug" button in the Willis panel (`#wzReportHome` → `gaReport()`). _(The **contextual** error-state `report-btn` injected into the empty/error message on dashboard/icp-finder is intentionally kept.)_ (3) **Theme toggle (`#theme-btn`) moved from `.hdr-r` to the LEFT zone** — inserted as the first child of `.hdr-l` (or `.header-left` on playbook), so it sits far-left of the brand. (4) The **live-upload monitor badge** (`.lvpm-badge`) is now `appendChild`'d to `.hdr-r` by `privacy-monitor.js` (previously anchored before `#theme-btn`) so it stays on the right. The apps' `.hdr-r` still carries Export/Reload; how-to/demo/playbook `.hdr-r` is otherwise empty (just the badge). Applied via `nav_rework.py`-style exact-string edits (theme-btn markup differs: `btn btn-icon` on apps vs `theme-toggle` elsewhere).

**Header layout = balanced 3-column flex (keep it centered).** `.hdr-l{flex:1 1 0}` · `.hdr-nav{flex:0 0 auto}` · `.hdr-r{flex:1 1 0;justify-content:flex-end}`. The equal `flex:1` side zones force the nav to true page-center on every page regardless of brand/control widths. Do NOT use `margin:0 auto` on `.hdr-nav` (that centers in *leftover* space → nav shifts per page). Every header has all 3 zones — how-to & playbook's `<div class="hdr-r"></div>` looks empty in markup but is a **required mount point**: `privacy-monitor.js` appendChild's the live-monitor badge into it (plus it balances the flex centering). **Do not delete it.**

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
- FOUC script is the first thing in `<head>`. **Default theme is LIGHT (July 4 2026)** — FOUC sets `data-theme="light"` unless `localStorage['ga_theme']==='dark'` (`if(t!=='dark')…setAttribute('data-theme','light')`). `toggleTheme()` flips + persists (`'light'`/`'dark'`); `updateThemeBtn()` shows ☀️ in light / 🌙 in dark; the **static markup icon is ☀️** (matches the default). Toggle button `#theme-btn` now lives in the **LEFT** nav zone (`.hdr-l` / `.header-left` on playbook), **not** `.hdr-r`.
- **⚠️ Default-light hardening (July 4 2026, post-review):** flipping the default exposed dark-hardcoded UI. Fixed with explicit light overrides — `[data-theme="light"]` rules for `.error-banner` (#b91c1c) + `.file-pill` (#1d4ed8) on the apps, the privacy-manifest GitHub links (inline style → **`.pm-link`** class), how-to's `.hero-badge` (#075985), and `html[data-theme=light] .lvpm-*` rules inside **privacy-monitor.js** (badge #047857 / alert #b91c1c / white modal — literals on purpose: the playbook defines none of --card/--tx, so var() fallbacks would render dark). **When adding colored UI, add its light-mode story at the same time** — this is the review class that slipped through.
- **Chart.js (dashboard only):** `applyChartTheme()` syncs `GC` from CSS vars and updates every chart in the `charts[]` registry. Call it after any theme change AND after rendering new charts in light mode. icp-finder has no Chart.js.

---

## UAT Report Button & External Links (June 19)

- **🐞 Report — MOVED INTO WILLIS (July 4 2026).** The nav Report button was **removed** from all pages. Reporting is now the **"🐞 Report a bug"** button in the Willis panel home view (`#wzReportHome` → `gaReport()`), plus the **contextual** `report-btn` still injected into dashboard/icp-finder's empty/error message (kept on purpose). The report flow still carries privacy-safe diagnostics (tool, page, browser, screen, theme, load-state counts, recent console errors via `window.__gaErrs`). **No LinkedIn data.** An early `addEventListener('error')` buffer in `<head>` feeds the error list. _(The `.report-btn` CSS + `reportIssue()`/`gaReport()` all remain — only the nav button markup was deleted.)_
- **⚠️ Report delivery — universal dialog (June 22).** The old `reportIssue()` used `mailto:` only, which **silently failed for Gmail/webmail testers** (no desktop mail client). The fix lives in **`willis.js`**: `gaReport(opts)` opens a `.gar-*` dialog offering **Copy / Gmail compose URL / `mailto`**, with an editable body and `parseUA()` → a readable `Chrome 149 · macOS · Desktop` line (raw UA still appended). `willis.js` sets `window.reportIssue = () => gaReport()`, so it **overrides every page's per-page Report button site-wide with zero markup edits** (loaded on all 5 nav pages). Also wired into Willis's no-match state (`#wzReport` → "📧 tell us what you needed"). Reports go to **rahul@growthautomated.ai**; aggregated weekly via the UAT routine (see below). ⚠️ Offline bundles still carry the old inline `mailto` (Willis is stripped there) — a follow-up.
- **UAT triage:** `UAT-REPORTS.md` (local, not deployed) aggregates report emails parsed from Gmail; a scheduled **"UAT Reports — weekly catch-up"** routine refreshes it every Saturday. Gmail connector is currently **read-only** (labeling needs a reconnect); headless/scheduled runs may not inherit Gmail access.
- **Company filter (Dashboard Connections + dashboard-demo):** searchable scrollable combobox (`cdd-*` — `#conn-company` input + `#conn-company-menu`), replacing a native `<select>` that capped ~300 options. Substring match via `filterConnections()`; `cddRenderMenu(q)` builds the list.
- **LinkedIn data-download link** → `https://www.linkedin.com/mypreferences/d/download-my-data`, placed everywhere export is explained (both load screens, how-to, dashboard-demo, shopify-embed, README).
- **Repo doc links** point at GitHub's rendered blob (`/blob/main/<file>.md`): `ICP-CUSTOMIZATION.md` (ICP customize CTA) and `RELEASE_NOTES.md` (footer link). Both `.md` files are in the push list so they resolve on `main`.
- **how-to tool frames** (01/02/03) each have a primary launch CTA (`.btn btn-primary`) → the respective tool.

---

## Mobile / Responsive (June 19)

- **Header wraps on mobile — never overlaps.** Each page's `@media` block uses `.hdr{flex-wrap:wrap}` + `.hdr-l{flex:0 1 auto}` + `.hdr-r{flex:1 1 auto;flex-wrap:wrap;justify-content:flex-end}`, hides `.hdr-sub`/`.status-text`, and shrinks the title. The `.hdr-r` action cluster (reload/export on the apps + the live-monitor badge; theme toggle now lives in the LEFT zone, Report/Book-Demo moved to Willis) wraps to its own row instead of colliding with the brand. **Do NOT** force a fixed single-row header on mobile or set `.hdr-l{min-width:0}` (that shrinks the title and makes it overlap). Playbook uses `.header`/`.header-sub` (its own scheme).
- **"Built for desktop" notice** (`.mobile-notice`, **dashboard + icp-finder only**): mobile-only (`@media max-width:768px`) amber banner placed at the **very top of `<body>`, ABOVE `<header>`** — keep it there so it's "up top" regardless of header height (icp-finder's loaded header wraps tall). Links to `how-to.html#faq5`; how-to auto-expands that FAQ via a `#faqN` hash handler. Dismissible → `localStorage['ga_mobile_notice']`. Theme-safe (`--tx`/`--li2`).
- **⚠️ Cache caveat:** mobile browsers cache the static HTML aggressively — a phone may keep serving the OLD page until pull-to-refresh / clear-site-data. If "X doesn't appear on page Y on mobile" but the source is correct and identical to a working page, **suspect stale cache first** (verify with a `?v=timestamp` cache-bust).
- icp-finder `.tier-explain` stacks to 1 column on mobile; stat grids use `auto-fit minmax(...)` (already responsive).

---

## Willis help widget (June 20)

- **What:** a floating "Ask Willis" help wiki on all 5 nav pages — bubble bottom-right → searchable panel (client-side, no server). Files: `willis.js` (engine, self-contained, namespaced `wz-`), `willis-articles.js` (`window.WILLIS_ARTICLES`, **40 articles across 10 categories** — expanded from the 14-article launch seed June 22), `willis/*.png` (5-pose character — v2 = the orange/blue striped-polo character).
- **`WILLIS_CONFIG` — the engine is now site-neutral (July 4 2026).** `willis.js` reads **`window.WILLIS_CONFIG`** (set BEFORE it loads — LinkVault's lives at the top of `willis-articles.js`): `{name, tagline, placeholder, reportEmail, actions:[{label, href|action:'report', primary}]}`. `renderIdle()` builds the panel's action buttons from `CFG.actions` (LinkVault ships "📅 Book a demo →" → demo.html + "🐞 Report a bug" → gaReport) — these are where the old nav Book Demo + Report went; the engine itself has **no LinkVault data** (neutral defaults: no actions, generic placeholder), so the willis-kit is genuinely drop-in for other apps. `gaReport` uses `CFG.reportEmail`. ⚠️ Keep site data in `WILLIS_CONFIG`/articles, never in `willis.js`.
- **Cache-bust (July 4 2026):** the Willis + privacy-monitor tags are versioned — `willis-articles.js?v=2`, `willis.js?v=2`, `privacy-monitor.js?v=2` on all pages. **Bump `v` whenever these files change** or returning users get a stale copy (we hit exactly this: cached articles without WILLIS_CONFIG + fresh engine = no action buttons). `inline_willis`/`inline_icp` in `build_offline_bundle.py` are query-tolerant.
- **Search ranking (June 22):** `runSearch` in `willis.js` **scores** every article (title-match > keyword-match; more matched words rank higher) and sorts best-first. The original was a plain any-word filter returning matches in array order — fine for 14 articles, noisy at 40 (e.g. "message templates" hit "messages" in another doc). When adding articles, give each a rich `k:` keyword string so it ranks well.
- **Integrate:** two tags before `</body>` — `<script src="willis-articles.js"></script>` then `<script src="willis.js"></script>`. Already on dashboard, icp-finder, how-to, demo, playbook. The widget self-injects.
- **Deep-link API:** `Willis.open()` / `Willis.ask('q')` / `Willis.article('id')` / `Willis.close()`.
- **Theme:** dark by default; reacts to `html[data-theme="light"]`. Own tokens (`--wp-*`) so it keeps separation regardless of the page theme (don't make it depend on app vars).
- **Swap art:** replace `willis/*.png` (same names) → zero code changes. (Kept the Kimi originals + v2 source in `~/Desktop/Willis/`.)
- **Offline:** `build_offline_bundle.py` INLINES Willis (articles + engine + base64 art — since June 28). **Offline link policy (July 4):** `patch_offline_links` now has two layers — the one-shot DOMContentLoaded shading pass **plus a capture-phase document click handler**, so links injected at runtime (Willis panel actions, article bodies) are blocked instead of navigating the file:// page to a nonexistent .html and losing loaded state. **ALLOW-list:** the LinkedIn data-download URL stays live (offline-file users are usually online; it's the step-1 CTA).
- **Reusable kit:** engine + art + README packaged at `~/Desktop/Willis/willis-kit/` (+ `.zip`) for dropping into other apps as a support wiki.

---

## Brand Logo

**Current (product naming, June 2026): BOTH logos.** Header lockup `<span class="lv-brand">` = **`linkvault-mark.png`** icon (blue hex-vault, flood-filled transparent) + "LinkVault" wordmark (`.lv-word`, white/navy by theme) + **the actual Growth Automated logo small underneath** (`.lv-ga`, `logo-white.svg` on dark / `logo-color.svg` on light, ~84×13) — replaced the old "by Growth Automated" text. Header `.lv-mark` is 38px (bumped from 30 to fit the stacked GA logo; header ≈75px). **Footer (`.lv-footer`, all 7 pages):** the Growth Automated logo **large + centered** (`.lv-foot-logo`, ~360×56, white/color by theme) + "LinkVault — the LinkedIn outreach toolkit by Growth Automated" + source/release links. Favicons (`favicon.ico/-16/-32`, `apple-touch-icon.png`) + `<meta name="theme-color" content="#0A66C2">` in every `<head>`. GA logos reuse `logo-white.svg`/`logo-color.svg` (already deployed). Full brand kit attached at project root `LinkVault-brand-assets/` (not deployed).
- ⚠️ **Header tightness:** the centered-nav header gets cramped in the **~768–950px** window (brand vs. nav) — clean ≥1024px and <768px (mobile notice). Pre-existing trait; minor responsive follow-up (wrap the nav earlier).

### Prior: Growth Automated logo (June 22, 2026) — now superseded in the header
The header previously used the **official Growth Automated logo** (`logo-white.svg` / `logo-color.svg`, the `.ga-logo` element). LinkVault replaced it as the header mark; the GA logo CSS/assets remain (dormant) and Growth Automated is now the "by Growth Automated" credit. `logo-white.svg` (white, dark headers) + `logo-color.svg` (color, light headers) are still in the push `FILES` list.

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
