# GrowthAutomated.ai — LinkedIn Toolkit
## Product Requirements Document & Engineering Handoff

_Version: 1.6 · Updated June 22, 2026_

---

## 0. What's New (June 22, 2026)

- **Cross-page cache contract** — fixed Engagement/Content loading empty when data was loaded on the ICP Finder first. Any page writing `ga_csv_cache` must include the activity files; the Dashboard now refuses an activity-less cache unless it authored it (`src==='dashboard'`), the ICP Finder folder loader caches the full activity set, and the Playbook routes to the ICP Finder (auto-restore) instead of showing demo. See §3.
- **Universal 🐞 Report dialog** — `gaReport` in `willis.js` (Copy / Gmail / Mail app) overrides every page's Report site-wide via `window.reportIssue`, fixing the `mailto`-only failure for webmail testers. Parses UA to a readable line; no LinkedIn data. Wired into Willis's no-match state.
- **Searchable company filter** (Dashboard Connections + dashboard-demo) — native `<select>` (capped ~300 options) → scrollable searchable combobox (`cdd-*`). See §4.6.
- **Parser parity** — `canonicalName()` added to `dashboard-demo.html` loaders.
- **Dev workflow** — `push_to_dev.py` auto-resyncs `dev`→`main` before each push (clean PR diffs) with an open-PR guard; `create_pr.py` opens PRs automatically; `resync_dev.py` added. See §12.
- **Security** — GitHub PAT moved to the `GH_TOKEN` env var (regenerated, removed from all files on disk). See §12.
- **UAT pipeline** — `UAT-REPORTS.md` triage doc + weekly Saturday "UAT Reports — weekly catch-up" routine aggregating report emails from Gmail.

---

## 0b. What's New (June 18–19, 2026)

- **Unified, centered nav** across all 7 pages (`📘 How It Works · 📊 Dashboard · 🎯 ICP Finder · 📋 Playbook · [Book Demo]`) — balanced 3-column flex header keeps it at true page-center everywhere.
- **Light / Dark mode** on all 5 nav pages (dashboard, icp-finder, playbook, how-to, demo): `[data-theme="light"]` overrides + FOUC script + `localStorage['ga_theme']`; dashboard re-themes Chart.js via `applyChartTheme()`. (icp-demo / dashboard-demo snapshots remain dark-only.)
- **Real-export hardening:** `canonicalName()` strips member-id filename suffixes (e.g. `Reactions_5175237.csv`); `messages.csv` UPPERCASE headers normalized via `tcKey`. Verified end-to-end against a live 06-19-2026 export (2,957 connections · 11,811 reactions · 954 ICP).
- **UAT "🐞 Report" button** in the header of every nav page → pre-filled `mailto:rahul@growthautomated.ai` with privacy-safe diagnostics (environment + counts + recent console errors, **no LinkedIn data**).
- **Content / links:** ICP scoring explainer + 2-fold "edit keywords / book time" CTA; "why-not-mobile" & "why-not-Safari" FAQs; LinkedIn data-download link wherever export is explained; per-tool launch CTAs on how-to; footer "Release notes" link. `README.md` + `ICP-CUSTOMIZATION.md` now deployed.
- **Mobile:** headers now wrap (never overlap) on phones; icp-finder tier cards stack; dashboard + icp-finder show a top-of-page "Built for desktop" notice (mobile-only) linking to the how-to FAQ. ⚠️ Mobile browsers cache HTML hard — pull-to-refresh after deploys.
- **"Willis" help widget (June 20):** a floating "Ask Willis" wiki on all 5 nav pages — bubble → searchable panel over bundled articles (client-side, no server). `willis.js` (engine) + `willis-articles.js` (14 seed articles) + `willis/*.png` (v2 striped-polo character). Deep-link API `Willis.open/ask/article`. Also packaged as a **reusable kit** for other apps (`~/Desktop/Willis/willis-kit/`).
- **Deploy:** use `push_to_dev.py` → `create_pr.py`. The old `push_all_updates.py` is retired.

---

## 1. Product Overview

**What it is:** A fully client-side LinkedIn analytics and outreach tool. Users drop their LinkedIn data export directly into the browser — the tool parses, classifies, and visualises their network with zero server involvement.

**Core promise:** Everything runs in the browser. Nothing leaves your device.

**Target user:** Shopify growth agency founders and operators who want to activate their LinkedIn network for outbound prospecting and relationship-based sales.

**Hosting:** GitHub Pages — `rsharma-oss.github.io/LinkedIn-outreach-tool`

**Pages:**
| File | Purpose |
|------|---------|
| `how-to.html` | Landing / instructions / offline download |
| `dashboard.html` | Full analytics dashboard |
| `icp-finder.html` | ICP classification + outreach planner |
| `outreach-playbook-demo.html` | Demo/preview page |
| `demo.html` | Book demo CTA |

---

## 2. Data Inputs

The tool accepts a LinkedIn data export — either a `.zip` file or an unzipped folder. It looks for the following files:

| File | Data |
|------|------|
| `Connections.csv` | Name, company, title, connected date |
| `messages.csv` | Full message threads (ConversationID, From, Date, Content) |
| `Reactions.csv` | Date, reaction type, post URL |
| `Comments.csv` | Date, post URL, comment text |
| `Shares.csv` | Date, post URL, text, visibility |
| `Invitations.csv` | From, To, Direction, sent date |
| `Member_Follows.csv` | Accounts/people followed |
| `Profile.csv` | Name, headline, summary |
| `Positions.csv` | Work history |

**Three upload methods:**
1. Drag-and-drop zip file
2. File picker (zip or folder)
3. Folder mount via Chrome File System Access API (persists across page reloads without re-upload)

**Demo mode:** A full synthetic dataset is bundled inline. Users can preview the tool without uploading any data.

---

## 3. Session Persistence

The tool uses `sessionStorage` to cache parsed data so users can navigate between Dashboard and ICP Finder without re-uploading.

**Cache strategy:**
- `ga_csv_cache` — all files except `messages.csv`, compressed with LZ-string. Payload is JSON `{data:{<file>:<csv>}, src:'dashboard'|'icp'}` (tagged with the writer).
- `ga_msg_cache` — `messages.csv` only, compressed separately (avoids single-key quota spikes)
- `ga_icp_data` (localStorage, not session) — ICP-scored contacts, written by **icp-finder only**; the Playbook reads it.
- Compression library: `lz-string` ~3× ratio on LinkedIn CSV data
- Fallback: if storage is full, messages cache is skipped silently (yellow banner shown)
- Quota limits: Chrome ~10MB, Safari ~5MB per origin

**⚠️ Cross-page cache completeness contract (June 22).** Tools share loaded data via `ga_csv_cache` so navigating between them never forces a re-mount. **Any page that writes `ga_csv_cache` must include the activity files** (`Reactions/Comments/Shares.csv`) or the Dashboard's Engagement & Content tabs render empty. The ICP Finder only *parses* Connections+messages, but its folder loader now *reads & caches* the full activity set too. The Dashboard's auto-restore **skips a cache with no activity unless `src==='dashboard'`** (else it would show empty Engagement/Content — a real reported bug; it falls through to the load screen instead). The Playbook needs `ga_icp_data`; if it's absent but a session cache exists, it routes the user to the ICP Finder (one click, auto-restores) rather than showing demo. The session cache is **per-tab** (privacy: clears with the tab) — it carries across same-tab nav links, not across separate tabs.

**Quota support matrix (post-compression):**

| Connections | Activity | Compressed | Safari | Chrome |
|-------------|----------|------------|--------|--------|
| Low (500) | Low | ~0.27MB | ✅ | ✅ |
| Medium (2K) | Medium | ~2.1MB | ✅ | ✅ |
| High (10K) | High | ~8.5MB | ❌ | ✅ |
| High (10K) | Very High (80K msgs) | ~12.7MB | ❌ | ❌ (fallback) |

---

## 4. Dashboard — Features

### 4.1 Overview Tab
- **6 stat cards:** Total connections, new this month, messages sent, reactions given, posts this year, invitations sent
- **3 charts:**
  - Network Growth (cumulative line, all time)
  - Activity Breakdown (bar: reactions / comments / posts)
  - Monthly Engagement — last 18 months (stacked bar)
- **Dynamic subtitle** shows user's first name and member-since date

### 4.2 Network Tab
- **5 charts:**
  - Cumulative Network Growth (line)
  - New Connections Per Month (bar, last 24 months)
  - Connected On — Day of Week (bar)
  - Top 20 Companies in Network (horizontal bar)
  - Top 20 Job Titles in Network (horizontal bar)

### 4.3 Engagement Tab
- **5 charts:**
  - Monthly Engagement Volume (line, all time)
  - Engagement by Month This Year (bar)
  - Activity Day of Week (bar)
  - Reaction Types breakdown (doughnut)
  - People You Follow (horizontal bar list)

### 4.4 Content Tab
- **Content Strategy Scorecard** — 4-metric scored card:
  - Publishing Cadence (target ≥ 10 posts/month)
  - Week Consistency (target ≥ 75% of weeks with ≥1 post)
  - Content Length Quality (target ≥ 60% of posts at optimal length)
  - Topic Variety (target ≥ 3 themes/month)
  - Overall score 0–100 with green/yellow/red RAG status
- **Content Theme Classification** — posts auto-tagged into categories:
  - Thought Leadership, Case Study / Results, Storytelling, Education / How-To, Social Proof, Other
- **6 charts:** Posts Per Month, Weekly Cadence heatmap, Content Theme Breakdown, Publishing Day of Week, Post Length Distribution, Monthly Posts (last 24 months)

### 4.5 Messages Tab
- **3 charts:** Messages Per Month (line), Sent vs Received last 12 months (bar), Messaging Day of Week
- **Top Contacts** table: most-messaged contacts with message count

### 4.6 Connections Table Tab
- Search by name, company, or title
- Filter by company (populated from data)
- Filter by connection year (populated from data)
- Sortable columns: Name, Company, Title, Connected date
- Paginated (50 per page)
- Count badge shows filtered result total

---

## 5. ICP Finder — Features

### 5.1 Contact Classification

All connections are run through a 3-tier keyword classifier on load:

**Tier logic (runs in order, first match wins):**

```
T1 — Decision Maker  →  matched against job title only
T2 — Ecosystem       →  matched against title + company combined
T3 — Adjacent        →  matched against job title only
No match             →  excluded from ICP entirely
```

**T1 keywords (title):**
founder, co-founder, ceo, chief executive, cmo, chief marketing, president, owner, managing director, vp [marketing/growth], director of marketing, head of marketing, head of ecommerce/e-commerce, chief revenue, gm, general manager, vp ecommerce, director of growth, head of dtc, ecommerce director, director of ecommerce

**T2 keywords (title + company):**
shopify, klaviyo, gorgias, yotpo, rebuy, recharge, postscript, triple whale, okendo, northbeam, attentive, sendlane, skio, loop returns, richreturns, aftership, shipbob, shipmonk, fractional cmo, fractional head, email marketing manager, growth manager, ecommerce manager, dtc marketing, retention specialist, lifecycle marketing, performance marketing manager, senior brand manager, sms marketing, crm manager, ecommerce strategist

**T3 keywords (title):**
marketing manager, digital marketing, content marketing, social media manager, seo manager, brand manager, marketing coordinator, growth hacker, revenue operations, partnerships manager, marketing director, senior marketing, creative director, copy director, brand director, vp brand, marketing lead

### 5.2 Recency Scoring
Based on days since connection date:
| Label | Range |
|-------|-------|
| 🟢 New | < 30 days |
| 🟡 Fresh | 30–90 days |
| ⚪ Warm | 90–365 days |
| ⬇ Cold | > 1 year |

### 5.3 Engagement Scoring
Based on last message date (requires `messages.csv`):
| Label | Range |
|-------|-------|
| Active | Messaged < 90 days ago |
| Warm | Messaged < 1 year ago |
| Cold | Messaged > 1 year ago |
| Never | No message history |

### 5.4 ICP Contact Table
- Filter by Tier, Recency, Engagement
- Sortable columns: Name, Title, Company, Tier, Connected date, Recency, Engagement
- Paginated (50 per page)
- Contact count badge

### 5.5 Outreach Priority View
Contacts surfaced in 4 prioritised sections:
1. 🔥 Hot — T1 connected in last 30 days (cap 20) → message now
2. 🌤 Warm — T1 connected 30–90 days ago (cap 15) → this week
3. ❄️ Cool — T1 connected 3+ months (cap 30) → re-engage
4. 🔗 T2 Ecosystem — all T2 contacts (cap 20)

### 5.6 Message Template Library
7 templates across 4 categories:

| ID | Category | Label |
|----|----------|-------|
| `t1` | T1 First Message | Warm opener — short, no pitch |
| `t1b` | T1 First Message | Insight opener — data/observation hook |
| `t2` | T2 Ecosystem | Partner/ecosystem intro — peer positioning |
| `followup1` | Follow-Up | Follow-Up #1 — no reply after 5–7 days |
| `followup2` | Follow-Up | Follow-Up #2 — break-up message |
| `re1` | Re-engage | Cold connection (1yr+) |
| `re2` | Re-engage | Lapsed conversation |

All templates have: title, category tag, usage note, template text with `[placeholders]`, and a one-click copy button.

---

## 6. Privacy & Security Model

- **Zero-server architecture** — all processing in the browser via JavaScript
- **Privacy manifest** shown on load screen — lists every file read and confirms it stays in-browser
- **No network calls** — no analytics, no logging, no data transmission
- **sessionStorage only** — data cleared when tab closes
- Files accepted: LinkedIn export `.zip` or direct folder mount
- Browser support: Chrome (full), Safari (medium connections only), Firefox (limited — no File System Access API)

---

## 7. Technical Stack

| Layer | Technology |
|-------|------------|
| UI | Vanilla HTML/CSS/JS — no framework |
| Charts | Chart.js 4.4.1 |
| CSV parsing | PapaParse 5.4.1 |
| Zip extraction | JSZip 3.10.1 |
| Compression | lz-string 1.5.0 |
| Fonts | Inter + Assistant (Google Fonts) |
| Hosting | GitHub Pages (static) |
| Deploy | `push_to_dev.py` → `create_pr.py` (GitHub Contents API + PAT) |
| Offline build | `build_offline_bundle.py` (inlines all CDN libs) |

---

## 8. Navigation Structure

**L1 Header — canonical across ALL 7 pages** (balanced 3-column flex, centered):
- Logo → `how-to.html`
- 📘 How It Works → `how-to.html`
- 📊 Dashboard → `dashboard.html`
- 🎯 ICP Finder → `icp-finder.html`
- 📋 Playbook → `outreach-playbook-demo.html`
- Book Demo (CTA) → `demo.html`
- Right zone (`.hdr-r`): **🐞 Report** button + **🌙/☀️ theme toggle** + page-specific controls (status, reload, export)

**L2 Dashboard tabs:**
Overview · Network · Engagement · Content · Messages · Connections Table

**L2 ICP Finder views:**
ICP Contacts · Outreach Plan · Message Templates

---

## 9. Deployment

**Push to `dev`, then open the PR (merge deploys to Pages):**
```bash
python3 /Users/rahulsharma/Desktop/Complete_LinkedInDataExport_05-02-2026.zip/push_to_dev.py --with-offline
python3 /Users/rahulsharma/Desktop/Complete_LinkedInDataExport_05-02-2026.zip/create_pr.py
```
_(`push_all_updates.py` is retired — do not use.)_

**Build offline bundle (run first if offline files needed):**
```bash
python3 /Users/rahulsharma/Desktop/Complete_LinkedInDataExport_05-02-2026.zip/build_offline_bundle.py
```

**Repo:** `rsharma-oss/LinkedIn-outreach-tool`

---

## 10. Known Limitations

| Limitation | Detail |
|------------|--------|
| Safari storage | H-activity users (>10K connections, >30K messages) exceed 5MB — yellow banner fallback |
| No cross-session persistence | Data clears on tab close — no login, no database |
| ICP keywords are hardcoded | Tuned for Shopify DTC ecosystem — not general-purpose |
| Content strategy targets are hardcoded | Benchmarks built for a Shopify growth agency founder (10/mo cadence, 75% consistency) |
| Message engagement requires `messages.csv` | Without it, all contacts show engagement as "Never" |
| Chrome File System Access API only | Folder mount (persistent session) requires Chrome |
| Desktop-first | Upload (folder/file picker) doesn't work in mobile browsers; phones get a "Built for desktop" notice. Pages render but data must be loaded on desktop. |
| Mobile HTML caching | Phones cache the static pages aggressively — pull-to-refresh / clear-site-data to see a fresh deploy. |
| English exports only | Localized (non-English) exports translate column headers and parse empty (see BACKLOG: locale-tolerant parsing). |

---

## 11. CSV Field Name Reference (Critical)

⚠️ **Header casing is NOT consistent across files — verify against a real export, never assume.** `messages.csv` is the ODD ONE OUT (UPPERCASE + spaces).

| File | Real header format | Example headers |
|------|--------------------|-----------------|
| `messages.csv` | **UPPERCASE + spaces** | `FROM`, `TO`, `DATE`, `CONVERSATION TITLE`, `CONTENT` |
| `Connections.csv` | Title Case + spaces (+ a `Notes:` preamble — use `skip:'First Name'`) | `First Name`, `Connected On`, `Company`, `Position` |
| `Reactions/Comments/Shares.csv` | Title Case | `Date`, `Type`, `Link` |
| `Invitations.csv` | Title Case + spaces | `From`, `To`, `Sent At`, `Direction` |
| `Profile.csv` | Title Case + spaces | `First Name`, `Headline` |

- **dashboard.html** normalizes message headers via `tcKey` (lowercase → strip spaces → TitleCase) right after parse, guarded by `!('Date' in D.messages[0])`. **icp-finder.html** reads with fallbacks (`r['FROM'] || r['From']`).
- **Filename suffix:** some exports append a member-id (`Reactions_5175237.csv`). Both apps run intake names through `canonicalName()` (strips a trailing `_<digits>`) so they match the `wanted` list.
- ⚠️ Still English-only — localized exports translate headers and parse empty (see BACKLOG: locale-tolerant parsing).

---

## 12. Git Workflow

```
main  →  production (GitHub Pages)
dev   →  all work lands here first
```

**Scripts:**
- `push_to_dev.py` — **auto-resyncs `dev`→`main`** (clean PR diffs; skips resync if a PR is open so it won't auto-close it), then pushes the full file set to dev (supports `--msg`, `--with-offline`)
- `create_pr.py` — **opens the PR from dev → main automatically** (PAT now has `Pull requests: write`; falls back to the compare URL on 403)
- `resync_dev.py` — manual idempotent `dev`→`main` sync (drift creeps ~1 commit behind per merge)

**🔐 Token (June 22):** the GitHub PAT is read from the **`GH_TOKEN` env var** (`~/.zshrc`) — **no longer hardcoded in any script** (was a plaintext leak risk). Token regenerated; scopes `Contents` + `Pull requests` read/write. See `CLAUDE.md` → "GitHub Token (PAT)".

---

## 13. Open Items — See BACKLOG.md

- **Language scope** — toolkit supports **English-language LinkedIn exports** ("works for everyone, in English"); only open work is a graceful "switch LinkedIn to English" message for non-English exports (full localization deferred)
- **Customize Your ICP Filter** — per-user keyword editing (interim: "edit keywords" link to `ICP-CUSTOMIZATION.md`)
- **UAT aggregation endgame** — webmail drop + report dialog ✅ done; weekly Gmail-parse routine ✅ done; Google Form → Sheet is the hands-off endgame if volume grows
- Dropdown filter components (built, reverted)
- _Shipped June 22: cross-page cache contract, universal Report dialog, searchable company filter, dev auto-resync, **GitHub token hardening + PR automation** — see RELEASE_NOTES_
- _Shipped since v1.1: Light/Dark mode (all 5 nav pages), ICP scoring explainer + FAQ, real-export hardening, UAT Report button — see RELEASE_NOTES_
