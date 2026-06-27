# GrowthAutomated.ai — LinkedIn Toolkit Release Notes

---

## Sprint Wrap — June 22, 2026 (Defect fixes · Cross-page cache · Dev workflow · Token security · UAT pipeline · Brand logo · ICP customization)

### 🎯 ICP — honest positioning + in-app customization
- **The issue:** the ICP classifier was hardcoded to one profile (Shopify DTC growth agencies), and unmatched connections were **silently excluded** — so non-niche users got a short/empty list and the tool looked broken. (The coverage stat also had a bug, always showing ~100%.)
- **Fix A — positioning:** the load screen + the inline `.icp-note` now say the default ICP is **tuned for Shopify DTC growth agencies** ("customize it, or we'll build yours"), and the headline stat shows **real coverage + an "unmatched" count** instead of hiding non-matches.
- **Fix B — in-app keyword editor:** a new **"✏️ Customize keywords"** modal lets users edit the T1/T2/T3 keyword lists per tier (one per line, with live counts), **Save & re-tier** the whole network instantly (and the Playbook), **Reset per tier / Reset all**, with a "Custom" badge when overridden. Overrides persist to `localStorage['ga_icp_kw']`. Verified: narrowing T1 dropped its count live, custom set survived reload, reset restored defaults. The classifier is now a tunable engine instead of a fixed list.


### 🎨 Official brand logo (all 7 pages)
- Replaced the old inline rainbow icon + typed "GrowthAutomated**.ai**" with the **official Growth Automated logo** (horizontal wordmark + woven icon, **no ".ai"**). Deployed as `logo-white.svg` / `logo-color.svg`; **white on dark headers, color on light** (auto-swaps with theme). Single `.ga-logo` element + shared CSS on every page; swap the SVGs to rebrand with zero code changes. (Offline bundles still carry the old icon — rebuild to update.)

### 🧭 Willis help wiki — 14 → 40 articles + ranked search
- Expanded the Willis support wiki from the 14-article launch seed to **40 articles across 10 categories** (Start here · Get your data · Loading · Dashboard · ICP Finder · Outreach Playbook · Privacy · Browser & device · Reference · Help & feedback) — every tool, tab, scoring system, and template now has a how-to.
- Upgraded `runSearch` from a plain any-word filter to a **scored ranking** (title-match > keyword-match; more matched words rank higher), so the best article surfaces first at 40 articles (the old order-based filter mis-ranked multi-word queries). Verified: 10/10 sample queries return the correct top result.

### 🐛 Engagement & Content tabs loaded empty from a partial cross-page cache
- **Symptom (reported):** load your export on the ICP Finder, then open the Dashboard → Connections and Messages populate, but **Engagement and Content show 0**.
- **Root cause:** the ICP Finder only ingests `Connections.csv` + `messages.csv` (all its scoring needs) but writes the **shared** `ga_csv_cache`. The Dashboard's auto-restore accepted that partial cache and read the absent `Reactions/Comments/Shares.csv` as empty arrays.
- **Fix (3 parts):** (1) the Dashboard's auto-restore now **refuses a cache with no activity data** unless the Dashboard itself wrote it (`src==='dashboard'`) — it shows the load screen instead of fake-empty tabs; (2) the ICP Finder's folder loader now **also reads & caches the activity files** so the shared cache stays complete from either entry point; (3) the **Playbook** routes the user to the ICP Finder in one click (auto-restores, no re-upload) when a session cache exists but ICP data doesn't, instead of silently showing demo.
- **Verified** in-browser across every flow (Dashboard ↔ ICP Finder ↔ Playbook, plus genuine first-time demo).

### 🔎 Searchable company filter — Dashboard Connections table
- The native `<select>` company filter capped at ~300 options and scrolled badly. Replaced with a **searchable, scrollable combobox** (`cdd-*`): substring matching + browse-by-letter, clears to "All companies". Mirrored to `dashboard-demo.html`.

### ✉️ Universal "🐞 Report" dialog — fixes webmail testers
- **Symptom (reported):** the Report button used `mailto:` only, which **silently did nothing for Gmail/webmail testers** (no desktop mail client).
- **Fix:** new `gaReport` dialog in `willis.js` offers **Copy · Gmail compose · Mail app**, parses the User-Agent into a readable `Chrome 149 · macOS · Desktop` line (raw UA still appended), and **overrides every page's Report button site-wide** via `window.reportIssue` (zero per-page markup changes). Also wired into **Willis's no-match state** ("📧 tell us what you needed"). Still privacy-safe — environment/counts only, no LinkedIn data.

### 🧩 dashboard-demo parser parity
- `dashboard-demo.html` had a working loader that was **missing `canonicalName`** — a real `_<member-id>`-suffixed export would have loaded empty there. Added it on both intake paths to match `dashboard.html`.

### 🔧 Dev workflow hardening (clean PR diffs)
- Resolved a **19-commit `dev`-vs-`main` drift**. `push_to_dev.py` now **auto-resyncs `dev` to `main` before each push** so every PR diff shows only that push's changes — with a **guard that skips the resync when a PR is already open** (so re-pushing to update an in-review PR doesn't auto-close it). Added `resync_dev.py` for manual/idempotent syncs.

### 🔐 GitHub token hardening + PR automation
- The PAT was **hardcoded in plaintext** across 5 scripts. Moved to the **`GH_TOKEN` env var** (`~/.zshrc`, outside the project folder); **token regenerated** (old exposed value is dead); real token removed from every file on disk. PAT **re-scoped with `Pull requests: Read & write`**, so **`create_pr.py` now opens PRs automatically** — the manual compare-URL step is gone.

### 🐞 UAT feedback pipeline
- Webmail-drop fixed (above). Added a local triage doc **`UAT-REPORTS.md`** that aggregates 🐞 Report emails parsed from Gmail, plus a **weekly Saturday routine** ("UAT Reports — weekly catch-up") to keep it current. First-ever real report (the company-scroll bug) was triaged from the inbox — and already fixed this sprint. _Note: the Gmail connector is read-only (labeling needs a reconnect); scheduled/headless runs may not inherit Gmail access — verify via "Run now"._

### 🌐 Language scope — English-language exports (positioning + graceful message)
- **Positioning:** the toolkit officially supports **English-language LinkedIn exports** ("works for everyone, in English"). A "Works with English-language LinkedIn exports" line now appears on the Dashboard / ICP Finder / dashboard-demo load screens and in how-to.
- **Graceful non-English handling:** LinkedIn translates the export's CSV column headers by account language, so a non-English export would otherwise render everything empty. All three apps now **detect a non-English export** (the English `First Name` header is absent in `Connections.csv`) and show: _"At the moment, our apps only support English. Please submit a Report email with a feature request for another language."_ — with a one-click Report action (the universal dialog on Dashboard/ICP Finder, a pre-filled `mailto` on dashboard-demo). `gaReport` gained a `feature` mode that pre-frames the email as a language feature request.

### ✅ Full QA — real export, end to end (June 22)
- Re-validated against the real `Complete_LinkedInDataExport_06-19-2026` export (with `_5175237`-suffixed activity files): **Dashboard** 2,957 connections · 15,538 engagement · 672 content · 6,961 messages, **18/18 charts populated**, company combobox working, no console errors; **ICP Finder** 954 contacts (T1 891 / T2 16 / T3 47); **Playbook** live. Matches the June 19 baseline — no regressions from this sprint.

---

## Sprint Wrap — June 18–19, 2026 (Nav, Theming, Real-Export Hardening, UAT)

### 🤵 "Willis" help widget — launched (June 20)
- A floating **"Ask Willis"** help wiki on all 5 nav pages — a bottom-right avatar bubble that opens a searchable panel. Client-side search over bundled articles (no server; privacy promise intact).
- **States:** welcoming / got-it / shrug, cheeky-on-hover. **Article view** opens content in-panel with a back button. ESC to close, mobile sheet layout, theme-aware, self-contained styling (own tokens — holds on any page's theme).
- **Architecture:** one shared include — `<script src="willis-articles.js"></script><script src="willis.js"></script>` — like the nav. Engine = `willis.js`; content = `willis-articles.js` (14 seed articles ported from the FAQ / ICP explainer / how-to); art = `willis/*.png`.
- **Deep-link API:** `Willis.open()` / `Willis.ask('mobile')` / `Willis.article('why-mobile')` for wiring the notice + Report button (follow-up).
- **Art:** launched June 20 on the Kimi placeholder set; **swapped to the v2 final character** same day (the Gemini-look — orange/blue striped polo, dark skin/curly hair, consistent 5-pose set, downscaled to web sizes). Swap was just replacing the PNGs in `willis/` — zero code changes.
- **Follow-ups:** inline Willis into the offline bundles (stripped for now), expand articles beyond the seed set, wire deep-links, swap final art.

### 📱 Mobile "built for desktop" notice (June 19)
- On phones, the two upload tools (`dashboard.html`, `icp-finder.html`) now show a dismissible amber banner under the header: **"Built for desktop. Loading your LinkedIn export needs a laptop — mobile browsers can't open the folder picker. Why? ↗"**
- The "Why?" link → `how-to.html#faq5`, and how-to now **auto-expands** the linked FAQ ("Why doesn't this work on my phone?") via a small hash handler.
- Mobile-only (`@media max-width:768px`), theme-safe (uses `--tx`/`--li2`), dismissible with `localStorage['ga_mobile_notice']`, hidden on desktop. Not shown on how-to/demo/playbook (they render fine on mobile and the FAQ lives on how-to).
- **Placement:** sits at the **very top of `<body>`, above the header** — so it's "up top" on every page regardless of header height (on icp-finder's data-loaded state the header wraps tall, which previously pushed the banner down). (Reported symptom "shows on dashboard not icp-finder" was a stale mobile-browser cache of the old page; this placement makes it unmistakable once the fresh page loads.)

### 📱 Mobile header & layout fixes (June 19)
- Adding the 🐞 Report button overflowed the phone header — the brand text ran into the buttons. Reworked the mobile header (`@media`) on all 5 nav pages to a **wrapping** layout: brand on row 1; the action cluster (Report · theme · reload/export/playbook) wraps right-aligned below instead of overlapping. Secondary status text + brand sub-label hidden, title shrunk. No horizontal scroll in any state (load screen, loaded, demo banner).
- `icp-finder`: tier-description cards (`.tier-explain`) now stack to 1 column on mobile (were crammed into 3).

### ✨ UAT Feedback — "🐞 Report" button (June 19)
- **What:** a header-nav "Report" button on all 5 nav pages that opens a **pre-filled `mailto:rahul@growthautomated.ai`** with the tester's description prompt + auto-attached **diagnostics**: tool, page, browser/OS, screen+window size, theme, load-state (e.g. `2,957 connections · 0 reactions`), and recent console errors.
- **Privacy:** environment + counts only — **no LinkedIn data**. `mailto` shows the draft in the user's mail client, so they review before sending. Consistent with the no-server promise (nothing auto-sends).
- **Why mailto:** zero backend, ships immediately, no third-party service. (Open follow-up: a hosted form/dashboard if we want aggregated triage — see below.)
- **Errors captured** via an early `window.addEventListener('error')` buffer (`window.__gaErrs`) in `<head>`.

### ✨ Content, links & CTAs (June 19)
- **ICP transparency:** inline "How these tiers are scored" explainer on the ICP Finder + a 2-fold CTA — "edit the keywords yourself" (→ `ICP-CUSTOMIZATION.md`, now deployed) and "book time — we'll build your ICP for you" (→ demo).
- **New FAQs** on how-to: "Why doesn't this work on my phone?" and "Why Chrome/Edge over Safari?"
- **LinkedIn data-download link** (`mypreferences/d/download-my-data`) added everywhere export is explained — both load screens, how-to, dashboard-demo, shopify-embed, README. (`README.md` + `ICP-CUSTOMIZATION.md` added to the deploy list so their links resolve.)
- **Per-tool launch CTAs** on how-to's 3 numbered tool frames (📊 Open Dashboard / 🎯 Open ICP Finder / 📋 Open Playbook).
- **Footer "Release notes" link** (how-to + demo) → GitHub-rendered `RELEASE_NOTES.md`.

### 🐛 Bug Fix — member-id filename suffix broke engagement data (June 19)
- **Symptom:** On a fresh export, the Dashboard's Reactions / Comments / Shares / Follows all loaded empty (Activity Breakdown, Engagement, and Content tabs blank) — while connections, messages, and invitations worked.
- **Root cause:** LinkedIn suffixes some activity files with a member-id — `Reactions_5175237.csv`, `Comments_5175237.csv`, `Shares_5175237.csv`, `Member_Follows_5175237.csv`. All file-intake paths matched filenames **exactly** against the `wanted` list, so the suffixed files were skipped entirely.
- **Fix:** added `canonicalName()` (strips a trailing `_<digits>` before the extension) and applied it at every intake point in both apps (zip, drag-folder, folder picker, file input).
- **Verified** against a real 06-19-2026 export: 2,957 connections · 6,961 messages · **11,811 reactions · 3,727 comments · 672 shares · 1,626 follows** (all four were 0 before the fix). ICP Finder classified 954 contacts (T1 891 / T2 16 / T3 47). Dashboard charts and ICP tiers all render.

### 🐛 Bug Fix — Messages tab broken on real exports (dashboard.html)
- **Symptom:** With a real LinkedIn export, the Messages tab showed empty "Messages Per Month", 0 sent in Sent-vs-Received, and no top contacts. (Worked in the demo, which masked it.)
- **Root cause:** `messages.csv` is the only export file with **UPPERCASE, space-separated headers** (`FROM`, `DATE`, `CONVERSATION TITLE`). The code read TitleCase keys (`r['From']`, `r['Date']`, `r['ConversationTitle']`) → all `undefined` on real data. The demo data uses TitleCase headers, so it never reproduced.
- **Fix:** `processFiles` now normalizes message headers to TitleCase (`tcKey`: lowercase → strip spaces → capitalize each word) right after parsing, guarded by `!('Date' in D.messages[0])` so demo data is untouched. Robust to LinkedIn casing/spacing drift.
- **Verified** by driving the real `processFiles` with a synthetic uppercase-header dataset: dates parse (6/6), sent/received split correct (3/3), Messages-Per-Month + Day-of-Week + top-contacts all populate.
- icp-finder.html was already safe (reads `r['FROM'] || r['From']`); no change needed.

### Summary
**Unified the primary navigation across all 7 pages.** Audit found the nav had drifted into two implementations and several per-page inconsistencies; standardized everything onto one canonical nav.

### Audit findings (before)
- Two separate nav systems: `.nav-link` (dashboard, icp-finder, how-to) vs `.hn-link` (playbook)
- `how-to.html` dropped emoji, had no active-pill state, and used "Request Demo" instead of "Book Demo"
- "How It Works" was unreachable from the nav on every page (logo-link only)
- Demo pages (`icp-demo`, `dashboard-demo`) had no shared nav and used emoji/text logos (`🎯`, `in`) instead of the brand SVG
- Header used `<div class="hdr">` on some pages, `<header>` on others

### Changes
- **Canonical nav** applied to all 7 pages: `📘 How It Works · 📊 Dashboard · 🎯 ICP Finder · 📋 Playbook · [Book Demo]`, identical markup + CSS, correct per-page active pill
- Nav CSS made self-contained (literal colors) so it renders identically regardless of each file's CSS-variable scheme
- Playbook converted `.hn-link` → `.nav-link`
- `how-to.html` aligned to canonical active-pill styling, emoji added, CTA → "Book Demo"
- Demo pages rebranded to the GrowthAutomated.ai SVG logo + given the full nav
- Header elements standardized to semantic `<header class="hdr">` (playbook outer container left as `.header` — visually identical, no user-facing change)
- **Nav placement fix (follow-up):** the nav used `margin:0 auto`, which centered it in the *leftover* space between the brand and the per-page controls — so it jumped 50–150px between pages. Replaced with a balanced 3-column flex header: left zone `flex:1`, nav `flex:0 0 auto`, right zone `flex:1` (empty `.hdr-r` added to how-to & playbook). Nav now sits at true page-center (~640px @1280) on all 7 pages. Flex reserves space, so no overlap with controls.
- **Playbook full consistency (RCA follow-up):** RCA found Playbook was only partially migrated — it still used its bespoke `.header` shell (96px tall vs the apps' 82px, lighter gradient, 1.05rem title) and had **no theme support** at all (no FOUC/toggle/`[data-theme]`). Aligned its header to the canonical look (18px padding, `--hdr-grad`, 1rem title → now 83px) and added full light/dark for its separate variable scheme (`--bg-primary`/`--text-primary`/`--accent`…), incl. FOUC script, `.theme-toggle` button, and `localStorage['ga_theme']` (shared with the apps). Playbook is now a true peer.
- **how-to.html + demo.html — light/dark added:** both share the apps' variable scheme, so the same `[data-theme="light"]` overrides applied. how-to also needed light variants for its bespoke gradients — the hero (`--hero-grad`), the CTA section (`--cta-grad`), and the clipped heading text-gradient (`--head-grad`, dark-navy→blue so it stays readable on light). Added FOUC, `.theme-toggle`, JS, and converted inline table-row borders to `var(--border)`. **All 5 nav pages now themeable.** Only `icp-demo.html` + `dashboard-demo.html` (standalone sample snapshots, not nav destinations) remain dark-only.

### Light / Dark Mode (v2 — shipped) ☀️🌙
Re-implemented after the v1 revert; all three v1 failure modes fixed.
- **Theme system:** `:root` holds dark defaults; a `[data-theme="light"]` block overrides them. ~14 previously-hardcoded colors (header gradient, hover tints, nav, tabs, tracks, scrollbar, privacy manifest, chart colors) were promoted to vars whose dark values are **unchanged** — so dark mode is pixel-identical to before.
- **FOUC prevention:** tiny inline script in `<head>` applies the stored theme before first paint.
- **Persistence:** `localStorage['ga_theme']` ('light'/'dark'), shared across both apps.
- **Toggle:** 🌙/☀️ button in `.hdr-r` (before the status dot).
- **Chart.js fix (the v1 killer):** `applyChartTheme()` re-reads the CSS vars into `GC` and iterates the `charts[]` registry, updating each chart's grid / ticks / legend (and doughnut segment borders) then calling `.update()`. Verified live-toggling re-themes all 18 dashboard charts. icp-finder has no charts.
- **Default:** dark (unchanged brand look). Scope at v2 launch was the 2 apps; **later extended to all 5 nav pages** (playbook, how-to, demo) — see the "light/dark added" change above. Only the standalone `icp-demo` / `dashboard-demo` snapshots remain dark-only.

### Offline bundles
- Rebuilt `dashboard-offline.html` / `icp-finder-offline.html` with `build_offline_bundle.py` so they carry the unified nav **and** the theme toggle. (Reminder: always rebuild after editing source HTML before a `--with-offline` push.)

---

## Sprint Wrap — Week of June 11–17, 2026

### Summary
**8 bug fixes · 4 features shipped · 2 items reverted to backlog**

---

## 🐛 Bug Fixes

| # | File | Defect | Resolution |
|---|------|--------|------------|
| 1 | `dashboard.html` | `sessionStorage` `QuotaExceededError` on Safari — entire export crashing on upload | Split-key cache strategy + LZ-string compression |
| 2 | `dashboard.html` | Chrome folder mount Step 2 filling with `null` data — only 1 of 2 steps rendered | RCA completed; logic patched to ensure both steps populate correctly |
| 3 | `dashboard.html` | Mobile: Privacy manifest `.pm-row` badges overflowing narrow screens | CSS `flex-wrap` + `order` restack — badge stays row 1, description wraps to row 2 |
| 4 | `dashboard.html` | Mobile: Load card padding too large, content crushed below 600px | `@media(max-width:600px)` padding reductions added |
| 5 | `dashboard.html` | Mobile: Hardcoded inline `width` on load buttons breaking at narrow viewport | `!important` override in media query (`width:100%`, `max-width:none`) |
| 6 | `icp-finder.html` | Same Safari sessionStorage overflow | Same LZ-string + split-key fix applied |
| 7 | `icp-finder.html` | Same mobile layout defects | Same media query block applied |
| 8 | Both files | JSON serialization overhead causing storage ceiling to be hit earlier than expected for high-activity users | Confirmed 21% overhead on `messages.csv` (free-text fields); LZ-string compression brings M/M scenario from 6.4MB → ~2.1MB |

---

## ✨ Features Added

### 1. LZ-String Compression — sessionStorage
- Added `lz-string` CDN to both pages and `build_offline_bundle.py`
- Cache WRITE compresses both `ga_csv_cache` and `ga_msg_cache` before storing
- Cache RESTORE decompresses with backward-compat fallback (`LZString.decompress(raw) ?? raw`)
- ~3× compression ratio on LinkedIn CSV data — fixes Safari 5MB quota for all Medium-activity profiles

### 2. Split-Key Cache Strategy
- Separated `messages.csv` into its own key (`ga_msg_cache`) to avoid single-key spikes
- Quota table produced: L/M/H connections × L/M/H activity — M/M now safely within Chrome and Safari limits

### 3. Mobile Responsive Layout
- Full `@media(max-width:600px)` block added to both files
- Privacy manifest 2-row restack (file + badge on row 1, description on row 2)
- Single-column chart grid on mobile
- 2-column stat grid (was 4)
- Load buttons full-width

### 4. Navigation Contrast Upgrade
All three nav levels now have a clear 3-state visual hierarchy (inactive → hover → active):

| Level | Component | Inactive | Hover | Active |
|-------|-----------|----------|-------|--------|
| L1 | Header nav links | 30% opacity | 80% opacity + subtle bg | Full white + blue fill pill + border |
| L2 | Dashboard tab bar | 38% opacity | 78% + bg tint | Full white + LinkedIn blue underline + bg tint |
| L2 | ICP Finder view tabs | 32% opacity | 72% + bg tint | Full white + LinkedIn blue underline + bg tint |
| L2 | Pill filters | 38% opacity | 78% | Full white + blue fill + border |

Filter `<select>` dropdowns also upgraded — full `var(--tx)` text, hover/focus blue border glow.

---

## 🔄 Reverted to Backlog

| Item | Reason |
|------|--------|
| **Light / Dark Mode** | Hardcoded rgba tints and Chart.js dynamic color update not fully resolved; reverted cleanly, detailed requirements added to `BACKLOG.md` |
| **Dropdown filter component** | Built and functional, user preferred keeping pill buttons for now; component code preserved |

---

## 📐 Storage Analysis (Reference)

| Connections | Activity | Raw | Compressed | Safari (5MB) | Chrome (10MB) |
|-------------|----------|-----|------------|-------------|---------------|
| L (500) | L | ~0.8MB | ~0.27MB | ✅ | ✅ |
| M (2K) | M | ~6.4MB | ~2.1MB | ✅ | ✅ |
| H (10K) | H | ~25MB | ~8.5MB | ❌ | ✅ |
| H (10K) | H (80K msgs) | ~38MB | ~12.7MB | ❌ | ❌ (yellow banner fallback) |

---

## 🗂 Files Changed This Sprint

| File | Changes |
|------|---------|
| `linkedin-toolkit/dashboard.html` | LZ-string, split-key cache, mobile CSS, nav contrast |
| `linkedin-toolkit/icp-finder.html` | LZ-string, split-key cache, mobile CSS, nav contrast |
| `build_offline_bundle.py` | Added `lzstring` to LIBS and CDN_TAGS, updated both bundle() calls |

---

## Sprint Wrap — Week of June 18, 2026

### Summary
**4 bug fixes · 3 features shipped**

---

## 🐛 Bug Fixes

| # | File | Defect | Resolution |
|---|------|--------|------------|
| 1 | `dashboard.html` | Messages tab: all message dates parsing as null — `r['DATE']` doesn't exist in LinkedIn's CSV | Fixed to `r['Date']` (title case) |
| 2 | `dashboard.html` | Sent/Received chart always showed 0 sent — `r['FROM']` doesn't exist in LinkedIn's CSV | Fixed to `r['From']` (title case) |
| 3 | `dashboard.html` | Top Contacts list always empty — `r['TO']` field doesn't exist in LinkedIn's CSV | Fixed to `r['ConversationTitle']` (LinkedIn's actual field for contact name) |
| 4 | `dashboard.html` | Overview stat card "sent by you" always 0 — same `r['FROM']` bug in a second location | Fixed to `r['From']` |

**Root cause:** LinkedIn exports use title-case field names (`Date`, `From`) not uppercase (`DATE`, `FROM`). The `TO` field doesn't exist at all — `ConversationTitle` is LinkedIn's actual sender-identification field.

**Validated:** After fixes — 442/442 message dates parsed, 152 sent / 110 received correctly split, 5 top contacts populated.

---

## ✨ Features Added

### 1. Git Version Control Workflow
- Created `dev` branch on GitHub — all work now goes to `dev`, not directly to `main`
- `push_to_dev.py` — replaces `push_all_updates.py` for day-to-day pushes (branch-aware, configurable commit message)
- `create_pr.py` — creates PR from `dev → main` with commit list and deploy checklist; auto-opens browser on 403

### 2. CLAUDE.md — Session Brain File
- Created `linkedin-toolkit/CLAUDE.md` — comprehensive session-start context for any future Claude session (Cowork or Claude Code)
- Covers: repo structure, branch strategy, push commands, architecture, CSS conventions, known rollbacks, commit format, key constants
- Claude Code picks this up automatically; Cowork sessions just need "read CLAUDE.md first"

### 3. HANDOFF.md — Reverse-Engineered PRD
- Full product requirements document generated from codebase
- Covers: product overview, all 9 CSV inputs, session storage architecture, all dashboard tabs + charts, complete ICP scoring with full keyword lists, outreach templates, privacy model, tech stack, deployment, known limitations

---

## 🔄 Offline Bundle
- Rebuilt to include `lzstring` (was missing from previous build — caused `LZString is not defined` error for offline users)
- Both `dashboard-offline.html` and `icp-finder-offline.html` rebuilt and pushed

---

## 🗂 Files Changed This Sprint

| File | Changes |
|------|---------|
| `linkedin-toolkit/dashboard.html` | 4 message field name bug fixes |
| `linkedin-toolkit/dashboard-offline.html` | Rebuilt with lzstring inlined |
| `linkedin-toolkit/icp-finder-offline.html` | Rebuilt with lzstring inlined |
| `linkedin-toolkit/CLAUDE.md` | New — session brain file |
| `HANDOFF.md` | New — reverse-engineered PRD |
| `push_to_dev.py` | New — branch-aware push script |
| `create_pr.py` | New — PR creation + graceful 403 fallback |

---

_Next: see `BACKLOG.md` for upcoming work._
