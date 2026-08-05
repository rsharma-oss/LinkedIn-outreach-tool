# GrowthAutomated.ai — LinkedIn Toolkit Backlog

_Last updated: August 3, 2026_

---

## 🛠 Change Requests (CRs)

### CR-1 — "Try with Sample Data" button: background colour + placement
- **Status:** ✅ **Resolved June 28** — replaced the off-brand purple outline with an on-brand **soft-green filled `.btn-sample`** (more visible/inviting) across `icp-finder.html`, `dashboard.html`, `dashboard-demo.html`. Placement kept (grouped after the "or try the demo" divider, which already reads well). Verified in preview.
- **Where:** the load-screen demo button (`onclick="loadDemoData()"`) on `dashboard.html`, `icp-finder.html`, `dashboard-demo.html`
- **Current:** outline style — transparent background, purple border (`rgba(139,92,246,0.5)`) + purple text (`#a78bfa`); placed **last**, below the primary "📂 Select Folder" button and an "or" divider.
- **Ask:** change the **background colour** and the **placement**.
- **Specifics needed to build:** (1) target background colour — e.g. brand blue `#334FB4`, growth green `#2D9C56`, or a solid fill of the current purple; (2) new placement — e.g. above the primary button / top of the card / elsewhere.

---

### CR-2 — Elevate the "Get your LinkedIn data" CTA (above the fold + higher contrast) — desktop + mobile
- **Status:** ✅ **Resolved June 29, 2026** — added a prominent **`.btn-getdata`** CTA (numbered "1" badge · "Get your LinkedIn data" · "Opens LinkedIn → Request archive" · ↗) placed **above the fold** near the top of the load card on `icp-finder.html` + `dashboard.html` (above the privacy manifest), and in the "First: Get your LinkedIn data" card on `how-to.html`. Solid **`--li` #0077B5 background + white text = 4.88:1 contrast (passes WCAG AA in both themes)** — replacing the old low-contrast inline `--li2` (#00a0dc, ~2.9:1) links, which are now removed from Step 1 on all three pages. Full-width on mobile. Verified in preview: renders on all 3 pages, above the fold, dark + light + mobile, zero console errors.
- **Problem:** Getting the LinkedIn data export is **the single most important action** — nothing in the toolkit works without it — yet today it's a **low-emphasis inline text link** buried inside "Step 1" of the load instructions (`<a … style="color:var(--li2)">Get a copy of your data ↗</a>`). It sits **below the fold** on both desktop and mobile (under the folder/CSV picker buttons + the numbered steps), and in **dark mode** `--li2` renders as a **dark, low-contrast blue** that's easy to miss.
- **Where:** the load screen on `icp-finder.html` (~line 394) and `dashboard.html` (~396), plus `how-to.html` step 1 (~478). All three use an inline `--li2` link inside a `.load-step` / step paragraph.
- **Ask:** make **"Get your LinkedIn data ↗"** a **primary, above-the-fold CTA** with strong contrast in both themes, on desktop and mobile.
- **Requirements / candidate approach:**
  - Promote it to a **prominent button** (brand-blue filled, `.btn-primary`-weight), not an inline text link — keep the ↗ / "opens LinkedIn in a new tab" affordance.
  - **Above the fold:** place it at/near the top of the load card so a first-time visitor sees "① Get your data" before scrolling. The folder/CSV picker (for users who already have their export) can sit just below.
  - **Contrast:** ensure ≥ WCAG AA in **dark mode** (don't rely on `--li2`) against the dark card background; verify light mode too.
  - Keep the "Request archive → wait for LinkedIn's email" context nearby so users know it isn't instant.
  - **Mobile:** full-width button, not a thin inline link.
- **Verify:** first-view screenshot desktop + mobile, dark + light — the data CTA is visible without scrolling and passes contrast.

---

## 🔴 High Priority

### 🏆 v1.1-gold — SHIPPED Aug 3, 2026 (`18ebba41`)

_Tagged gold by Rahul. `v1.1-rc` = `7eee36be` was the candidate; gold adds the browser-scope decision (Firefox out) and the README rewrite._


**Closed since the gap list was raised:**
- ✅ **Message-count gap — no bug.** `messages.csv` holds 7,109 CSV *records*; the "20,734" was a naive line count (2,096 messages contain newlines inside CONTENT). The app was correct all along. A fixture with an embedded newline now guards this in the smoke test.
- ✅ **Automated tests** — `smoke-test.html`: 17 end-to-end checks against the real pages using synthetic fixtures. Snapshots and restores the user's saved ICP config so a run never disturbs real settings.
- ✅ **Browser matrix — complete.** Supported set is **Chrome/Edge + Safari** (Firefox is explicitly not supported). Safari 26 ✓ and Chrome 150 ✓, both 17/17. Edge is Chromium, covered by the Chrome run.
- ✅ **Accessibility** — `lv-a11y.js`: 10 keyboard-unreachable controls → 0; customizer got dialog semantics (role, aria-modal, ESC, focus in/return); skip link, main landmark, visible focus.
- 🟡 **Scale** — quota failures now explain themselves instead of degrading silently. 12k connections + 40k messages parse correctly.

**Open and tracked post-release** (none blocking; revisit as real usage comes in):
- 🔴 **Varied-network validation** — every ICP/tier decision still rests on one senior-skewed 2.9k network. Needs 2–3 external testers with different networks. **The long pole.**
- 🔴 **Screen-reader pass** — semantics are verified programmatically; the actual experience is not. Cannot be done programmatically.
- 🟡 **Parse progress** — 12k connections takes ~11.6s with no feedback; reads as frozen.
- 🟡 **Safari storage cliff** — Chrome verified to 10MB; Safari's ~5MB limit unverified on a large real export.
- 🟡 Manual `?v=N` cache-busting · UAT #4 (onboarding friction).

### 🔴 Open — release-readiness gaps (raised Aug 3, 2026)
- **Unexplained message-count gap.** UAT#2 diagnostics showed `7,109 messages` loaded from a `messages.csv` containing **20,734 rows**. Never root-caused — may be conversations-vs-rows, may be silent truncation at Safari's storage quota. **Needs a real answer before any "gold" claim.**
- **No automated tests.** Every release is hand-QA'd in one browser. A smoke harness (load fixtures → assert counts/tiers/charts) would catch regressions the manual pass misses.
- **Browser matrix is thin.** Chromium continuously; Safari validated once by the owner. _(Closed Aug 3: supported set is Chrome/Edge + Safari, both verified; Firefox is out of scope.)_
- **Single-network validation.** All ICP/tier tuning rests on one senior-skewed 2.9k network. The parked tier-distribution question can't be settled without varied networks.
- **Accessibility unaudited.** WCAG contrast was fixed reactively; no keyboard-nav or screen-reader pass. The new warmth popover has no focus trap/ARIA.
- **Scale ceiling untested.** Unknown behaviour at 10k+ connections; Safari's ~5MB quota is a known cliff with no graceful degradation message.
- **Manual cache-busting.** `?v=N` bumps are by hand and have already caused two stale-JS incidents.
- **UAT #4 (onboarding friction)** still unaddressed.


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
- ✅ **`ship.py` shipped June 28** — one command runs `build_offline_bundle.py` → `push_to_dev.py --with-offline` → `create_pr.py`, stopping on the first failure. `python3 ship.py --msg "…" [--title "…"] [--no-offline]`. Local dev tool (not deployed).

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
- **Follow-ups:** (1) ✅ final art swapped in; (2) ✅ **Willis inlined into offline bundles (June 28)** — `build_offline_bundle.py` now inlines `willis-articles.js` + `willis.js` and base64-embeds the 5 art images (resized via `sips` to keep it lean: dashboard-offline 738KB, icp-finder-offline 422KB). Help search + articles + the Report dialog now work fully offline; verified (40 articles, panel opens, art as data URIs, zero `willis/` paths); (3) ✅ **expanded 14 → 40 articles across 10 categories + added ranked search** (June 22); (4) wire deep-links (mobile notice + 🐞 Report → `Willis.article(...)`); (5) ✅ **`window.WILLIS_CONFIG` shipped July 4, 2026** — engine reads `{name, tagline, placeholder, reportEmail, actions[]}` with neutral defaults; LinkVault's config lives at the top of `willis-articles.js`. The panel's Book-a-demo/Report buttons and the report email are config-driven; the engine carries zero site data → kit is drop-in reusable.
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
- **Status:** ✅ **UN-GATED June 28 — the customizer is LIVE on `icp-finder.html`.** Two-list + rank×domain engine ported into the live page (live storage keys `ga_icp_kw`/`ga_icp_exact` via `window.ICP_K`); ✏️ Customize button + full modal (Pick-from-network + Edit-lists tabs, vertical presets, Save/Load config) + Willis help published. Verified end-to-end in preview (presets apply + relabel, live storage, zero console errors). Packaging: customizer **free**, paid = the done-for-you **service** (muted CTA, no in-app prices). ✅ **Offline customizer done June 28** — `build_offline_bundle.py` now inlines `icp-profiles.js` + `icp-picker.js` (via `inline_icp()`, mirroring the Willis inlining), so the offline ICP Finder has the full customizer (icp-finder-offline.html 469KB; verified offline: 4 presets, picker, live storage, zero 404s/errors).
- **Fix A — shipped:** load-screen + `.icp-note` state the ICP is **tuned for Shopify DTC** (customize, or we'll build yours); the headline stat now shows **real coverage + an "unmatched" count** (fixed a bug where `s-total-sub` always read ~100%).
- **Fix B — built, held:** the classifier is now a **tunable engine** (editable T1/T2/T3 arrays → `compileKw` → `classifyAll`/`reclassify`; live re-tier + `localStorage['ga_icp_kw']` + Playbook via `ga_icp_data`). Verified working (live re-tier, persistence, reset, match counts). The **UI is gated** for this release — engine + editor JS/CSS ship dormant, the modal + "Customize keywords" button are removed. Full demo preserved at `icp-finder-with-editor.held.html`. **Re-enable = restore the modal + `.icp-note` button.**
- **Next (post co-work):** decide presets/extensible/hybrid + which verticals for **R1**; a preset is just a `{t1,t2,t3}` object fed into the same `ICP_KW` → `reclassify()` path → un-gate.
- **UX direction (for co-work):** the held editor is free-text textareas — you **can't easily *select* multiple titles**. Proposed model: a **title/company picker from your actual network** (each title shown with its count, multi-select + bulk "assign to tier", **unmatched-first**) instead of blind typing. Full assessment + R1–R10 requirements + draft Willis copy → **`ICP-CUSTOMIZATION-UX.md`**. Open decision: browser-select vs typing as primary; exact-title vs substring matching (R8).
- **Prototype (`icp-finder-prototype.html` + `icp-picker.js` + `icp-profiles.js`, unlisted) — multi-select picker built:** Titles tab (pick titles → T1/T2/T3) + **Companies tab** (pick companies → T2 ecosystem). Isolated storage (`ga_icp_kw_proto`), so it can't touch the live app's `ga_icp_kw`.
- **Multi-tenant / configurable (prototyped):** **vertical preset library** (DTC · B2B SaaS · Telecom · FinServ, in `icp-profiles.js`) + **Save / Load config** (export/import). Design + value-prop ("agency builds & ships the config; custom config = the paid offer") → `ICP-MULTI-TENANT.md`.
- **ICP config file format — SPECIFIED → `ICP-CONFIG-FORMAT.md` (`format:"linkvault-icp"`, v1).** Carries the full profile (tier label + description + match-mode + keywords, plus per-config **exclude**). Save/Load implement it (verified round-trip June 28: a loaded config relabels the cards + applies its own exclusions, so e.g. a FinServ config keeps CFOs the DTC default would drop). Per-profile `exclude` required `EXCL_KEYWORDS` to be reassignable (the default exclude is itself DTC-specific).
- **✅ R8 RESOLVED (June 28) — two-list matching.** Each tier now has **exact** lists (`companies`, `titles`) + a **substring** list (`keywords`). Engine: `ICP_EXACT` parallel to `ICP_KW`; `classifyTier` hits exact OR substring per tier. Companies use **whole-field + leading-word** normalized match (strip legal suffixes) → `bell` catches "Bell Canada"/"Rogers Communications"/"Orange Business Services" but **not** "Taco Bell"/"Lucky Orange"/"Campbell". Picker writes picks to the exact lists; textarea → substring. Profiles split carrier/bank/vendor names into exact `companies`. Verified end-to-end (engine + profiles + export/import + picker). Prototype-only; live `icp-finder.html` engine untouched (still held).
- **✅ Vertical hierarchies — RESOLVED (June 28 co-work).** Three-axis tier model: **T1 = seniority** (C-suite `t1.keywords` + **rank × domain**: senior rank + a vertical `domain` word → "Senior Director, Network"), **T2 = named accounts** (exact `companies`, global CA/US/EU), **T3 = broad sector** (Sr Manager/Manager × domain + adjacent roles + concept words). Floor: Director-up → T1, Sr Manager/Manager → T3. New engine bits: `RANK_T1_RE`/`RANK_T3_RE` + per-profile `ICP_DOMAIN` (carried in the config as top-level `domain`). 4 profiles rewritten (DTC/SaaS/Telecom/FinServ). Verified: rank×domain elevates senior function people, company anchors the rest, "Director, Catering" excluded, R8 collisions hold, domain survives export/import. **Remaining before live: un-gate into `icp-finder.html` + publish Willis.** _Real-export QA done June 28 — R8 verified on ~2.9k real connections (Lucky Orange / Chris Bell Consulting / Sharon Bell Marketing correctly blocked; Bell Canada/Mobility/Media + Shaw Communications correctly T2; 32/38 carriers → T2)._
- **📊 Tier-distribution sensitivity analysis (backlog — NOT an un-gate blocker, June 28).** Real-data QA showed T1 dominates and barely shifts between verticals (Telecom 747 / FinServ 752 / DTC 927 of ~2,918 in-ICP) because C-suite titles tier to T1 regardless of domain. **Likely an artifact of a senior-skewed test network** (experience × tenure → an exec-heavy connection list), not necessarily a model flaw — so deferred rather than tuned off one biased sample. **Revisit with varied network profiles** (junior↔senior, IC↔exec, multiple industries) to see whether the tier split generalizes. Candidate levers if it doesn't: domain-gate C-suite for vertical configs, a per-config "strict vertical" flag, or surface T1-in-domain vs T1-overall. Safety valve meanwhile: the ICP is fully customizable + the agency tunes each client config. **Reconfirmed June 29** on the same real export across all 4 presets (T1 = 925 DTC / 991 SaaS / 741 Telecom / 744 FinServ of ~2,906) — T1 stays broad and barely vertical-sensitive while **T2 named-accounts differentiate sharply** (Telecom 385 Rogers/TELUS · FinServ 90 RBC/TD · DTC 12 Shopify/Klaviyo · SaaS 8 Salesforce/ServiceNow). Consistent with the senior-skewed-network hypothesis; still deferred pending a more varied test network.
- **Findings from the real-data DTC→Telecom retarget test (June 28):**
  1. ✅ **Companies tab is essential, now built.** Company-based ICPs (telecom = everyone at Rogers/TELUS/Bell) can't be done from a *title* picker; the **Companies tab** (assign companies → T2) makes it work. On real data, retargeting DTC→Telecom took T2 from 16 → 386 and Rogers in-ICP from 42 → 313.
  2. ✅ **R8 confirmed live → now FIXED:** substring matching had put **"Lucky Orange"** (a DTC tool) into Telecom T2 via the keyword `orange` (the carrier). Resolved by the two-list engine above — `orange` is now an exact `companies` pick, so it matches the carrier Orange but not Lucky Orange.
  3. ⚠️ **Tier *labels* are hardcoded DTC copy** — the stat cards / tier cards still read "Founders, CEOs… / Agency & Ecosystem Partners / Marketing & Growth" even after retargeting. Make tier descriptions **generic or editable**.
- **✅ Vertical-neutral copy scrub (June 28).** Audited all deployed pages + Willis; rewrote **16 positioning-copy items** (icp-finder load-sub + `.icp-note`, dashboard/-demo strategy-sub + theme label, icp-demo stat-sub, 5 Willis articles, playbook "ecommerce heads") from Shopify/DTC framing → "B2B outreach" / generic tier language. Left intact: ICP keyword arrays + the regex-backed `value="Shopify/Ecom"` (relabeled display only). **Decisions (June 28):** (a) **demo/sample data** — *leave as-is* (DTC sample is fine as an illustrative example); (b) **`shopify-embed.html`** — *keep bespoke* (deliberate Shopify-merchant/DTC/agency channel; doesn't conflict — neutral main app + segment-specific embed); (c) **content-theme classifier** (dashboard) — *parked → option-3:* wire the "Industry/Product" detector to the active ICP's `domain` words so it auto-adapts per vertical (telecom→network/wireless/fiber). Functional build, off critical path.
- **✅ Value-prop / positioning (June 28 co-work):** vertical-neutral; hero locked to **"Your next customers are already in your network."** (how-to.html). Paid offer = **muted service** (no prices in-app; assisted setup + custom-built ICP, $99–$499 sold on a call), with 3 premium features (multi-ICP library · named-accounts bulk import · tiered-list export). Free = tool + DTC default + self-serve editing. Full model in `ICP-MULTI-TENANT.md`.
- **~~Default Shopify-DTC copy audit~~ (superseded by the scrub above):** beyond the tier labels, there was **hardcoded DTC-flavoured copy in several places** that doesn't reflect a custom ICP — the tier-card descriptions, the `.icp-note` body ("tuned for Shopify DTC growth agencies"), tooltips, and possibly demo/marketing copy. **Audit + make generic or ICP-aware** so a non-DTC user (e.g. telecom) doesn't see DTC framing throughout. Scope: `icp-finder.html` (+ how-to / demo where it appears).
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
- **Status:** ✅ **Done June 28** — the inline "How these tiers are scored" explainer (`.icp-note`) now includes a collapsible **`<details>` accordion ("See the exact default keyword lists")** showing the full T1/T2/T3 default keywords (native, no JS, theme-aware). Also scrubbed the 3 **tier-card** descriptions that were still DTC/agency-flavoured ("for agency services", "Agency & Ecosystem Partners", "Marketing & Growth Professionals" → neutral). Optional remaining: a `how-to.html` mirror.
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
- **✅ DECISION (June 29, 2026): go with A (automate from Gmail); B deferred.** Rationale: the report flow already works (Copy/Gmail/Mail), reports already arrive at rahul@growthautomated.ai, and a weekly Gmail "UAT Reports" routine + `UAT-REPORTS.md` already exist — so A is a pure extension of what's there (**no app change, no new dependency**). B (Google Form) would mean editing a working flow + adding a third-party endpoint that slightly muddies the "no server / nothing leaves your browser" positioning, for **low current volume**. **B is the escalation path** — revisit only when email/Gmail triage becomes painful at higher volume.
- **Remaining = aggregation only (per decision A):** reports arrive as individual emails to rahul@growthautomated.ai — no single triage view yet. **Next step:** extend the weekly Gmail routine to **label incoming reports + parse their structured body into a table** (in `UAT-REPORTS.md` or a linked Google Sheet). ⚠️ Caveat: the Gmail connector is currently read-only (labeling needs a reconnect) and headless/scheduled runs may not inherit Gmail access — so the parse/digest may need to run from an interactive session until that's sorted.
  - **A) Automate from Gmail (CHOSEN)** — label incoming reports + auto-parse their structured body into a Google Sheet / recurring digest. **No app change**; leverages emails already arriving. (Gmail integration + a scheduled digest.)
  - **B) Replace with a Google Form (DEFERRED — escalation if volume grows)** — point the report flow at a pre-filled Google Form (diagnostics passed via URL params); responses auto-collect in a linked Sheet. Requires editing `gaReport`; cleanest native aggregation, lowest ongoing maintenance.
- **Constraint:** user-initiated only; no always-on server; no LinkedIn data in reports.

### Deploy / version `shopify-embed.html`
- **Status:** Decision needed — it's NOT in `push_to_dev.py` FILES (the paste-into-Shopify snippet, not Pages-served). Local copy has the latest edits (download link). Add to the push list if you want it versioned in the repo.

### Dropdown Components for Filters
- **Status:** ✅ **Shipped June 28 (mockup-approved redesign)** — unified ICP-List filter bar in `icp-filters.js`: custom attribute **dropdowns** (Tier · Recency · Engagement — themed, chevron-rotate, outside-click + Esc + ↑/↓ keyboard, ARIA listbox) replacing the native selects, **plus a "Quick filters" segment pill nav** below (All · T1 first message · Follow-up · Re-engage) wired through `window.icpFilterMatch`. Verified: filters compose, segments correct (T1-first 105 / Follow-up 42 / Re-engage 208 on demo), zero errors. Inlined into the offline bundle. Segment defs are tunable in `icp-filters.js` (`segPass`).
- **Status (old):** Built (custom `dd-wrap` / `dd-trigger` / `dd-menu`), reverted at user request
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

**August 3, 2026 — v1.1 relationships**
- **Relationship warmth layer** (`lv-warmth.js`) — endorsements, recommendations, company follows → per-person warmth, "why you know them", grounded openers. 34% of a real 2,963-connection network carries a signal.
- **Suggest-and-approve ICP suggestions** — followed companies → T2 (17 → 340 contacts on the reference network); search-history terms → T1/T3 (T1 988 → 1,349).
- **Dashboard Relationships panel** — warmth distribution, top endorsed skills, endorsement timeline.
- **UAT#2 Safari loader fix** — resilient reads, merge-not-replace, case-insensitive zip, mount report; ICP Finder zip support.
- **Privacy ignore-list** on both load screens. **Root + `/linkvault` entry URLs.** **Header overlap fix** (<1000px).

**July 4, 2026**
- **Code-review hardening sprint** — an 8-angle adversarial review (3 correctness + reuse/simplification/efficiency/altitude/conventions, all candidates independently verified) of the June 29–July 4 sprints found **10 confirmed issues**; all fixed same-day in 3 tranches: (1) default-light contrast family (monitor badge · error banners · pm-links · hero badge · playbook modal) + how-to mobile-nav `:not(.cta)` bug + `window.`-prefixed monitor guards + ☀️ initial icon; (2) **`WILLIS_CONFIG`** (site-neutral engine) + Willis on the demo snapshots + guarded footer Report links; (3) offline click-time link guard + LinkedIn-URL allowlist + dead-CSS/spacer cleanup + CTA copy alignment + gaReport listener-leak fix + prototype nav alignment + `?v=2` cache-busting for willis/privacy-monitor. See RELEASE_NOTES July 4.

**June 29, 2026**
- **CR-2 — "Get your LinkedIn data" CTA elevated** — new prominent `.btn-getdata` button (solid `--li` #0077B5 + white, AA 4.88:1 in both themes) above the fold on `icp-finder.html`, `dashboard.html`, `how-to.html`; removed the old low-contrast inline `--li2` links. Verified desktop + mobile, dark + light, zero errors.
- **UAT aggregation — A/B decided:** chose **A (automate from Gmail; no app change)**; **B (Google Form) deferred** as the escalation path if volume grows.
- **ICP customizer UX overhaul** — guided 3-step "Customize your ICP" modal (industry pills · network picker · Advanced keyword lists) + **one-click per-row T1/T2/T3/✕ tiering** (current tier highlighted, click-to-toggle-off, persistent exact-exclude `ICP_EXACT.excl`). Eliminated the tick-then-Save "nothing happened" confusion (PRs #49–#51). **Validated on a real 2,906-connection export across all 4 presets** — assign/toggle/exclude work on real titles; zero errors; light + dark + offline.

**June 28, 2026**
- **ICP customizer un-gated to live** (`icp-finder.html`) — two-list + rank×domain engine, 4 vertical presets, Save/Load config, network picker; fixes the "Lucky Orange → `orange`" collision.
- **Unified ICP filter bar** (`icp-filters.js`) — Tier / Recency / Engagement dropdowns + segment pill nav (All · T1-first · Follow-up · Re-engage).
- **Vertical-neutral positioning** + on-brand polish; **offline customizer + Willis** inlined into the bundle; **`ship.py`** one-command build → push → PR.

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
