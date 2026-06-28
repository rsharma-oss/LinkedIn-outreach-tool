# GrowthAutomated.ai — LinkedIn Toolkit Backlog

_Last updated: June 22, 2026_

---

## 🛠 Change Requests (CRs)

### CR-1 — "Try with Sample Data" button: background colour + placement
- **Status:** Logged — needs specifics before implementing
- **Where:** the load-screen demo button (`onclick="loadDemoData()"`) on `dashboard.html`, `icp-finder.html`, `dashboard-demo.html`
- **Current:** outline style — transparent background, purple border (`rgba(139,92,246,0.5)`) + purple text (`#a78bfa`); placed **last**, below the primary "📂 Select Folder" button and an "or" divider.
- **Ask:** change the **background colour** and the **placement**.
- **Specifics needed to build:** (1) target background colour — e.g. brand blue `#334FB4`, growth green `#2D9C56`, or a solid fill of the current purple; (2) new placement — e.g. above the primary button / top of the card / elsewhere.

---

## 🔴 High Priority

### Language Scope — English LinkedIn exports (positioning + graceful non-English message)
- **Positioning (decided June 22):** the toolkit **officially supports English-language LinkedIn exports** — any LinkedIn account set to English, in any country. Stated plainly: **"Works for everyone, in English."** This is a deliberate scope decision, **not a defect** to chase.
- **Why English-only:** LinkedIn translates export *column headers* by account language (`Date`→`Datum`/`Fecha`, `First Name`→`Vorname`…). The parser reads English headers, so a non-English export loads but renders empty. Full coverage means a per-language header alias map — large and perpetually maintained for marginal reach. We scope to English and say so up front instead.
- **Open to-do (the only real work — graceful failure, not full i18n):** detect a non-English export (expected English headers absent after parse) and show **one clear line** instead of silent blank charts/tiers — e.g. _"This tool works with English-language LinkedIn exports. Switch your LinkedIn language to English, re-download your data, and try again."_ Scope: `dashboard.html`, `icp-finder.html`, `dashboard-demo.html`.
- **Positioning copy:** add a short "Works with English-language LinkedIn exports" line to the load screens + `how-to.html` so it's set up front.
- **Deferred (only if real demand appears):** a per-locale header alias map for full non-English support. Bigger than a one-liner; maintained per language.

_(Light / Dark Mode shipped v2 across all 5 nav pages June 18–19 — moved to Recently Completed.)_

---

### Harden GitHub Token in Push Scripts
- **Status:** ✅ **Resolved June 22, 2026**
- **What shipped:** All scripts (`push_to_dev.py`, `create_pr.py`, `resync_dev.py`) read the token from `os.environ["GH_TOKEN"]` and exit with a clear message if unset. The real token was **removed from every file on disk** — including the 3 legacy scripts (`push_all_updates.py`, `push_session_cache_fix.py`, `upload_icp_doc.py`). Token **regenerated** on GitHub (the previously-exposed value is now dead) and stored as `export GH_TOKEN=…` in `~/.zshrc` (outside the project folder, so it never travels with the toolkit). Env-var setup documented in `CLAUDE.md`.
- **Optional later:** macOS Keychain instead of `~/.zshrc` for at-rest encryption.

---

### PR Automation — Enable `create_pr.py` to open PRs
- **Status:** ✅ **Resolved June 22, 2026** — the regenerated PAT now has `Pull requests: Read & write`, so `create_pr.py` opens the PR automatically (verified: PR #22). The manual compare-URL step is gone. The 403 fallback is still in the code for safety.
- **Bonus shipped same day:** `push_to_dev.py` now auto-resyncs `dev` to `main` before pushing, so each PR diff shows only that push's changes (no historical drift).
- **Nice-to-have (still open):** a single `ship.py` that runs `build_offline_bundle.py` → `push_to_dev.py --with-offline` → `create_pr.py` end to end.

---

### Sync `dev` Branch from `main` (branch drift)
- **Status:** ✅ **Resolved June 22, 2026** — force-synced `dev` to `main` via `resync_dev.py` (force-updates the dev ref to main's HEAD; no delete/recreate, no empty commits). Verified `identical` (0 behind / 0 ahead). Re-run `python3 resync_dev.py` after future merges if drift creeps back.
- **Scope:** GitHub branches / `push_to_dev.py` workflow
- **Was:** `dev` was cut from an older `main` and had fallen **19 commits behind** (flagged by `create_pr.py`). Pushes still worked (every `push_to_dev.py` overwrites each file with the local source-of-truth copy), but the `main...dev` compare diff showed unrelated historical drift, making PRs noisier to review.
- **Note:** Each PR merge adds a merge commit to `main` that `dev` lacks, so `dev` will drift ~1 behind per merge — re-run `resync_dev.py` periodically (it's idempotent and a no-op when already in sync).

---

## 🟡 Medium Priority

### "Willis" — Humorous, Approachable Help Wiki
- **Status:** ✅ **Launched June 20** — floating widget on all 5 nav pages (`willis.js` + `willis-articles.js` 14 seed articles + `willis/*.png`). Search, article view, lean states, theme-aware, deep-link API. **Final v2 art live** (Gemini-look striped polo). **Packaged as a reusable kit** (`~/Desktop/Willis/willis-kit/` + `.zip`) for other apps.
- **Follow-ups:** (1) ✅ final art swapped in; (2) **inline Willis into offline bundles** (currently stripped — `build_offline_bundle.py`); (3) ✅ **expanded 14 → 40 articles across 10 categories + added ranked search** (June 22); (4) wire deep-links (mobile notice + 🐞 Report → `Willis.article(...)`); (5) `window.WILLIS_CONFIG` for zero-edit reuse (name/tagline/placeholder/art-path).
- **Concept:** A client-side **customer-support wiki / knowledge base** with a friendly, funny personality. The entire goal is to make asking for help feel **easy and non-threatening** — you just type your question to a character who's happy to help.
- **Layout homage (NOT a butler):** Modeled on the **original Ask Jeeves homepage** UX — a **character icon to the LEFT of the "ask" box**, inviting a plain-English question. We're borrowing the *approachable layout & framing only*. **No butler, no Jeeves — none of that.**
- **Name & voice:** Called **"Willis."** Tagline plays on the *Diff'rent Strokes* line — **"Whatchu talkin' 'bout, Willis?"** Tone: warm, witty, plain-English, a little cheeky.
- **Character (graphic, original):** **Willis** = a warm, cheeky **man with dark skin & dark black curly hair** — an original character inspired by the *Diff'rent Strokes* vibe (⚠️ not a literal likeness of the real actor — IP risk; see brief). Sits to the **left** of the ask box; the ask-box **placeholder reads "Whatchu talkin' 'bout, Willis?" in grey**. Needs expressions: idle/welcoming, thinking, got-it, nothing-found. **Full spec → `WILLIS-CHARACTER-BRIEF.md`** (hand to image AI / illustrator; use design skills when building).
- **Format:** "Ask Willis…" question box + browsable articles, **client-side search over bundled content only** (no server — privacy promise stays intact).
- **Seed content (consolidate what's scattered today):**
  - how-to FAQs (data safety, two zip files, why-not-mobile, why-not-Safari)
  - ICP scoring explainer (T1/T2/T3 logic) + how to customize it
  - "Get your LinkedIn data" 3-step flow + each tool's how-to
  - glossary (Tier 1/2/3, Recency, Engagement, …)
- **Surface — DECIDED: Willis floats.** A fixed bottom-right **avatar bubble on every page** → opens an "Ask Willis…" panel with client-side search over bundled articles (one shared include, like the nav; theme-aware; no server). The 🐞 Report button + mobile "Built for desktop" notice deep-link into relevant articles.
- **Content:** ~40-article wiki inventory mapped out (many "seed" from existing FAQ / icp-note / how-to copy). Full UX + article list → **`WILLIS-WIKI-PLAN.md`**.
- **IP note:** original character + our own copy only — echo the *approachable-help layout*, nothing trademarked.

### Willis Rendering Polish
- **Status:** 🟢 In progress — **avatar framing fixed June 28** (the bubble was a tight circle that cropped the square portrait to a face = "Curious George"; now a rounded-square with `object-fit:contain` so the full character/polo shows, on both the bubble + panel header). `willis.js`.
- **Remaining rendering review:** check **all 5 poses** (`willis-main / thumbsup / shrug / cheeky / avatar`) in every state — bubble, panel header, **welcome card, search-result "got it", no-match "shrug"** — for the same crop/face-only issue, odd white-box backgrounds (some art ships on white — flood-fill transparent like `linkvault-mark` if needed), consistent sizing, and centering.
- **Both themes + mobile:** confirm poses read well on the light *and* dark stage background and in the mobile near-fullscreen sheet (`@media max-width:480px`).
- **Optional:** slightly larger bubble / pick the most flattering default pose; the art reads a touch cartoonish at small sizes — consider a tighter head-and-shoulders crop of the source art for the bubble specifically.

### 🎯 ICP — Positioning & Customization (the core ICP issue)
- **Status:** 🟢 **Fix A shipped June 22. Fix B (in-app editor) BUILT but HELD** — gated out of the release pending a **co-work session** to align on customization direction (vertical **presets** vs **extensible** editor vs **hybrid**). See `ICP-COWORK-BRIEF.md`.
- **Fix A — shipped:** load-screen + `.icp-note` state the ICP is **tuned for Shopify DTC** (customize, or we'll build yours); the headline stat now shows **real coverage + an "unmatched" count** (fixed a bug where `s-total-sub` always read ~100%).
- **Fix B — built, held:** the classifier is now a **tunable engine** (editable T1/T2/T3 arrays → `compileKw` → `classifyAll`/`reclassify`; live re-tier + `localStorage['ga_icp_kw']` + Playbook via `ga_icp_data`). Verified working (live re-tier, persistence, reset, match counts). The **UI is gated** for this release — engine + editor JS/CSS ship dormant, the modal + "Customize keywords" button are removed. Full demo preserved at `icp-finder-with-editor.held.html`. **Re-enable = restore the modal + `.icp-note` button.**
- **Next (post co-work):** decide presets/extensible/hybrid + which verticals for **R1**; a preset is just a `{t1,t2,t3}` object fed into the same `ICP_KW` → `reclassify()` path → un-gate.
- **UX direction (for co-work):** the held editor is free-text textareas — you **can't easily *select* multiple titles**. Proposed model: a **title/company picker from your actual network** (each title shown with its count, multi-select + bulk "assign to tier", **unmatched-first**) instead of blind typing. Full assessment + R1–R10 requirements + draft Willis copy → **`ICP-CUSTOMIZATION-UX.md`**. Open decision: browser-select vs typing as primary; exact-title vs substring matching (R8).
- **Prototype (`icp-finder-prototype.html` + `icp-picker.js` + `icp-profiles.js`, unlisted) — multi-select picker built:** Titles tab (pick titles → T1/T2/T3) + **Companies tab** (pick companies → T2 ecosystem). Isolated storage (`ga_icp_kw_proto`), so it can't touch the live app's `ga_icp_kw`.
- **Multi-tenant / configurable (prototyped):** **vertical preset library** (DTC · B2B SaaS · Telecom · FinServ, in `icp-profiles.js`) + **Save / Load config** (export/import). Design + value-prop ("agency builds & ships the config; custom config = the paid offer") → `ICP-MULTI-TENANT.md`.
- **ICP config file format — SPECIFIED → `ICP-CONFIG-FORMAT.md` (`format:"linkvault-icp"`, v1).** Carries the full profile (tier label + description + match-mode + keywords, plus per-config **exclude**). Save/Load implement it (verified round-trip June 28: a loaded config relabels the cards + applies its own exclusions, so e.g. a FinServ config keeps CFOs the DTC default would drop). Per-profile `exclude` required `EXCL_KEYWORDS` to be reassignable (the default exclude is itself DTC-specific). **R8 (exact vs substring) reserved in the format; decide before live.**
- **Findings from the real-data DTC→Telecom retarget test (June 28):**
  1. ✅ **Companies tab is essential, now built.** Company-based ICPs (telecom = everyone at Rogers/TELUS/Bell) can't be done from a *title* picker; the **Companies tab** (assign companies → T2) makes it work. On real data, retargeting DTC→Telecom took T2 from 16 → 386 and Rogers in-ICP from 42 → 313.
  2. ⚠️ **R8 confirmed live:** substring matching put **"Lucky Orange"** into T2 via the keyword `orange` (the carrier). Need **exact vs substring** before going live.
  3. ⚠️ **Tier *labels* are hardcoded DTC copy** — the stat cards / tier cards still read "Founders, CEOs… / Agency & Ecosystem Partners / Marketing & Growth" even after retargeting. Make tier descriptions **generic or editable**.
- **Default Shopify-DTC copy audit (NEW):** beyond the tier labels, there is **hardcoded DTC-flavoured copy in several places** that doesn't reflect a custom ICP — the tier-card descriptions, the `.icp-note` body ("tuned for Shopify DTC growth agencies"), tooltips, and possibly demo/marketing copy. **Audit + make generic or ICP-aware** so a non-DTC user (e.g. telecom) doesn't see DTC framing throughout. Scope: `icp-finder.html` (+ how-to / demo where it appears).
- **The issue:** the T1/T2/T3 classifier is **hardcoded to ONE ideal customer profile** — Shopify DTC growth agencies (founder/CMO-type titles + the Shopify tool ecosystem). Any user whose targets fall outside that keyword set sees most connections **match nothing — and "no match = excluded from the ICP entirely"** (rule #4 below) — so the list comes back short or empty and the tool looks broken. It's a single-profile engine currently framed as a generic "ICP Finder." (Same shape as the English-only parsing limit: powerful for the niche, opaque for everyone else.)
- **Fix A — Positioning (cheap, ship first):** say what it is, up front — _"The default ICP is tuned for **Shopify DTC growth agencies**. Not your market? Customize the keywords (2 min), or we'll build yours."_ Place on the ICP Finder load screen + the inline `.icp-note` + how-to. And **stop silently excluding** unmatched contacts — show an **"Other / unmatched" count** so a non-niche user sees their network isn't empty, just unscored under the default ICP.
- **Fix B — Customization (the real fix)** · Scope: `icp-finder.html`
  - **Requirements:**
  - UI panel (modal or sidebar) letting users add/remove keywords per tier
  - Editable keyword lists for T1, T2, T3 — add new keywords, delete existing ones
  - Changes persist to `localStorage` so customizations survive page reload
  - "Reset to defaults" button per tier
  - Live re-classification on save — existing contacts re-tiered immediately with new ruleset
  - Show match count per tier after re-run so user can validate their changes
  - Export custom config as JSON (nice-to-have)
- **Note:** Currently all classification is hardcoded — see FAQ item below for exact defaults. **Interim shipped June 19:** the ICP Finder now links to `ICP-CUSTOMIZATION.md` ("edit the keywords yourself") + a "book time — we'll build your ICP" CTA.

---

### ICP Scoring FAQ — Document the Coded Defaults
- **Status:** 🟢 **Partially shipped (June 19)** — an inline "How these tiers are scored" explainer (`.icp-note` block) now appears on the ICP Finder with the T1/T2/T3 logic + customize CTAs. Optional remaining: a dedicated expandable keyword-list accordion and/or a `how-to.html` section.
- **Scope:** `icp-finder.html` (inline FAQ section or tooltip) + `how-to.html`
- **Purpose:** Users don't know why a contact was placed in T1 vs T2 vs T3. Transparency builds trust and helps them understand what to customize.
- **Current hardcoded defaults to document:**

  **T1 — Decision Maker** _(matched against job title only)_
  > founder, co-founder, ceo, chief executive, cmo, chief marketing officer, president, owner, managing director, vp [marketing / growth], director of marketing, head of marketing, head of ecommerce / e-commerce, chief revenue officer, gm, general manager, vp ecommerce, director of growth, head of dtc, ecommerce director, director of ecommerce

  **T2 — Ecosystem** _(matched against title + company name combined)_
  > shopify, klaviyo, gorgias, yotpo, rebuy, recharge, postscript, triple whale, okendo, northbeam, attentive, sendlane, skio, loop returns, richreturns, aftership, shipbob, shipmonk, fractional cmo, fractional head, email marketing manager, growth manager, ecommerce manager, dtc marketing, retention specialist, lifecycle marketing, performance marketing manager, senior brand manager, sms marketing, crm manager, ecommerce strategist

  **T3 — Adjacent** _(matched against job title only)_
  > marketing manager, digital marketing, content marketing, social media manager, seo manager, brand manager, marketing coordinator, growth hacker, revenue operations, partnerships manager, marketing director, senior marketing, creative director, copy director, brand director, vp brand, marketing lead

  **Scoring rules:**
  1. T1 check runs first (title only) — if matched, stops here
  2. T2 check runs second (title + company) — catches ecosystem tools/vendors
  3. T3 check runs third (title only)
  4. No match → contact excluded from ICP entirely

- **Deliverable options:**
  - Inline FAQ accordion on the ICP tab ("How are contacts scored?")
  - Tooltip on the Tier column header
  - Dedicated section in `how-to.html`

---

### UAT Feedback Aggregation (triage view for 🐞 Report)
- **Status:** 🟢 **Partially done — webmail failure RESOLVED June 22.**
- **Resolved (June 22):** the universal report dialog (`gaReport` in `willis.js`) now offers **Copy / Gmail compose / Mail app**, so webmail-only testers are no longer silently dropped (the original `mailto`-only failure). It overrides the per-page 🐞 Report site-wide (via `window.reportIssue`) and is wired into Willis's no-match state. Diagnostics stay privacy-safe (env/counts only — **no LinkedIn data**).
- **Remaining = aggregation only:** reports still arrive as individual emails to rahul@growthautomated.ai — there's no single triage view. Two paths (pick one):
  - **A) Automate from Gmail** — label incoming reports + auto-parse their structured body into a Google Sheet / recurring digest. **No app change**; leverages emails already arriving. (Gmail integration + a scheduled digest.)
  - **B) Replace with a Google Form** — point the report flow at a pre-filled Google Form (diagnostics passed via URL params); responses auto-collect in a linked Sheet. Requires editing `gaReport`; cleanest native aggregation, lowest ongoing maintenance.
- **Constraint:** user-initiated only; no always-on server; no LinkedIn data in reports.

### Deploy / version `shopify-embed.html`
- **Status:** Decision needed — it's NOT in `push_to_dev.py` FILES (the paste-into-Shopify snippet, not Pages-served). Local copy has the latest edits (download link). Add to the push list if you want it versioned in the repo.

### Dropdown Components for Filters
- **Status:** Built (custom `dd-wrap` / `dd-trigger` / `dd-menu`), reverted at user request
- **Scope:** `icp-finder.html` template filter section
- **Requirements:**
  - Replace or supplement `.tpl-filter` pill buttons with a styled `<select>` or custom dropdown
  - Show currently selected filter label in trigger
  - Animate open/close (chevron rotation, fade-in panel)
  - Close on outside click
  - Match dark theme — `var(--bg3)` bg, `var(--border2)` border
  - Consider adding dropdowns to the contact filter bar as well (`f-tier`, `f-recency`, `f-engagement`)
- **Note:** Custom component code is preserved in conversation history if needed

### Offline Bundle
- **Status:** ✅ Built and deployed (lzstring now inlined — previous build was broken)
- **Rebuilt June 18–19 ✅** — regenerated repeatedly with the unified nav, theme toggle, Report button, suffix fix, and download links. Always rebuild after editing source HTML before a `--with-offline` push.
- **Done:** how-to offline-download links verified (`dashboard-offline.html` / `icp-finder-offline.html`).

### How-To Page
- **Status:** ✅ Substantially updated June 18–19 — unified + centered nav, light/dark, per-tool launch CTAs on the 3 tool frames, "why-not-mobile / Safari" FAQs, LinkedIn data-download link, footer Release-notes link. Offline-download links verified.
- **Remaining:** none pressing — general copy polish only.

---

## 🟢 Low Priority / Future

### Outreach Playbook Page
- **Status:** Nav link present (`outreach-playbook-demo.html`), not reviewed
- **Requirements:** Validate content, ensure session restore works correctly

### Export / Download Data
- Allow users to export filtered ICP contacts as CSV directly from the table

### Pagination Improvements
- ICP table and outreach table currently use simple page prev/next; consider showing total page count

### Message Thread View
- From the messages tab, allow clicking a conversation to expand full thread inline

### Tier Scoring Transparency
- Show users *why* a contact was scored T1/T2/T3 (tooltip or expandable detail)

---

## ✅ Recently Completed (see RELEASE_NOTES.md)

**June 22, 2026**
- **Cross-page cache fix** — Engagement/Content no longer load empty after loading data on the ICP Finder first (Dashboard refuses an activity-less cache unless it wrote it; ICP folder loader caches the full activity set; Playbook routes to ICP Finder instead of demo). Verified across all flows.
- **Searchable company filter** — Dashboard Connections table (+ dashboard-demo): native `<select>` → scrollable searchable combobox (`cdd-*`).
- **Universal 🐞 Report dialog** — `gaReport` (Copy / Gmail / Mail app) fixes the `mailto`-only failure for webmail testers; overrides every page's Report site-wide; wired into Willis's no-match state. (Webmail half of the old "Hosted UAT form" item.)
- **`dashboard-demo` parser parity** — `canonicalName` member-id suffix strip added to its loaders.
- **Dev workflow** — resolved 19-commit `dev`/`main` drift; `push_to_dev.py` auto-resyncs before each push (open-PR guard); `resync_dev.py` added. ⟶ _Resolved: "Sync dev Branch from main"._
- **GitHub token hardening + PR automation** — PAT → `GH_TOKEN` env var (regenerated, removed from all files); re-scoped so `create_pr.py` opens PRs automatically. ⟶ _Resolved: both 🔴 token items._
- **UAT pipeline** — `UAT-REPORTS.md` triage doc + weekly Saturday "UAT Reports — weekly catch-up" routine parsing report emails from Gmail.

**June 19, 2026**
- Real-export hardening: `canonicalName()` for member-id filename suffixes — verified against a live 06-19 export (reactions/comments/shares/follows were all 0 → now full)
- Messages tab fix: UPPERCASE-header normalization (`tcKey`) — real exports populate dates / sent-received / top-contacts
- Light/Dark extended to playbook + how-to + demo (now all 5 nav pages); nav placement fixed (3-column flex, centered)
- UAT "🐞 Report" button (pre-filled mailto + privacy-safe diagnostics) on every nav page
- ICP scoring explainer + "edit keywords / book time" CTAs; "why-not-mobile / why-not-Safari" FAQs
- LinkedIn data-download link wherever export is explained; `README.md` + `ICP-CUSTOMIZATION.md` deployed
- Per-tool launch CTAs on how-to's 3 tool frames; footer "Release notes" link
- Mobile: header overflow fixed (wrapping layout, all 5 nav pages); icp-finder tier cards stack; "Built for desktop" notice on dashboard + icp-finder (top of page, links to auto-expanding how-to FAQ)

**June 18, 2026**
- Messages tab: 4 field name bugs fixed (`DATE`→`Date`, `FROM`→`From`, `TO`→`ConversationTitle`) — sent/received chart, top contacts, and message dates all broken
- Git workflow: `dev` branch, `push_to_dev.py`, `create_pr.py`
- `CLAUDE.md` session brain file created
- `HANDOFF.md` reverse-engineered PRD created
- Offline bundle rebuilt with lzstring

**June 11–17, 2026**
- LZ-string compression for sessionStorage (Safari fix)
- Split-key cache strategy (`ga_csv_cache` + `ga_msg_cache`)
- Mobile responsive layout (3 UAT defects fixed)
- Navigation contrast upgrade — L1, L2 tabs, L2 pill filters
- Chrome folder mount Step 2 null data bug fixed
