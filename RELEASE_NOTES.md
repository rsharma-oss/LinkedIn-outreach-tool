# GrowthAutomated.ai — LinkedIn Toolkit Release Notes

---

## Sprint Wrap — June 18, 2026 (Navigation Consistency)

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
- **Default:** dark (unchanged brand look). Scope: `dashboard.html` + `icp-finder.html` only.

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
