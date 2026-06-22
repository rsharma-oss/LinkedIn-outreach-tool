# GrowthAutomated.ai — LinkedIn Toolkit Backlog

_Last updated: June 22, 2026_

---

## 🔴 High Priority

### Locale-Tolerant CSV Parsing (non-English exports)
- **Status:** Not started
- **Scope:** `dashboard.html`, `icp-finder.html`
- **Problem:** All parsing reads literal **English** column headers (`r['Date']`, `r['First Name']`, `r['Connected On']`, etc.). LinkedIn localizes export headers by account language (e.g. `Date`→`Datum`/`Fecha`), so a German/Spanish/French export loads the files but parses **empty** — every chart and tier comes back blank. Only English exports have been validated.
- **Context:** The June 19 `canonicalName()` fix solved *filename* matching for the `_<member-id>` suffix, but it's filename-only — it does not address translated *column headers* inside the files. This is the remaining gap before "any export from anyone" works.
- **Requirements:**
  - Map columns by known-alias lists (per field, across LinkedIn's supported languages) or by position, instead of exact English strings.
  - Apply to every field read: messages (`From`/`Date`/`ConversationTitle`…), connections (`First Name`/`Company`/`Position`/`Connected On`), reactions/comments/shares (`Date`), invitations (`From`/`Sent At`).
  - Fall back gracefully + surface a clear "couldn't read this export's columns" message instead of silently rendering empty.
  - Add a couple of non-English sample exports to the test set.
- **Note:** Bigger than a one-liner — needs an alias map maintained per locale.

_(Light / Dark Mode shipped v2 across all 5 nav pages June 18–19 — moved to Recently Completed.)_

---

### Harden GitHub Token in Push Scripts
- **Status:** Not started
- **Scope:** `push_to_dev.py`, `create_pr.py` (and older `push_all_updates.py`, `push_session_cache_fix.py`, `upload_icp_doc.py` if they also embed it)
- **Problem:** GitHub fine-grained PAT is hardcoded in plaintext (`push_to_dev.py:18`, `create_pr.py:15`). Token sits unencrypted on disk; would leak if the Desktop folder is ever zipped, shared, or synced. (Not currently leaked to the repo — `.py` files are not in the push list.)
- **Requirements:**
  - Read token from `os.environ["GH_TOKEN"]` (fail with a clear message if unset)
  - Rotate the currently-exposed token at github.com → Settings → Developer settings → Fine-grained tokens
  - Document the env-var setup in `CLAUDE.md` (replace the inline token references)
  - Optional: load from a git-ignored `.env` / keychain instead of shell env

---

### PR Automation — Enable `create_pr.py` to open PRs
- **Status:** Not started — currently blocked
- **Problem:** `create_pr.py` fails with `403` because the GitHub PAT has `Contents` permission only, not `Pull requests: write`. PRs must be opened manually at the compare URL after every `push_to_dev.py`.
- **Fix:** Grant the fine-grained PAT **`Pull requests: Read & write`** (GitHub → Settings → Developer settings → Fine-grained tokens → edit token), then update `TOKEN` in `create_pr.py` (and `push_to_dev.py`).
- **Do this together with [Harden GitHub Token]** above — both require editing the same token, so rotate + re-scope in one pass.
- **Nice-to-have:** a single `ship.py` that runs `build_offline_bundle.py` → `push_to_dev.py --with-offline` → `create_pr.py` end to end.

---

### Sync `dev` Branch from `main` (branch drift)
- **Status:** Not started
- **Scope:** GitHub branches / `push_to_dev.py` workflow
- **Problem:** `dev` was cut from an older `main` and has fallen **17 commits behind `main`** (flagged by `create_pr.py` on June 22). Pushes still work because every `push_to_dev.py` overwrites each toolkit file with the local source-of-truth copy — so the **files** on `dev` are current — but the `main...dev` compare diff shows unrelated historical drift, making each PR noisier to review than the actual sprint's changes.
- **Fix:** Re-sync the branches so they share history again — merge `main` into `dev`, or simplest: delete `dev` and let the next `push_to_dev.py` recreate it fresh from `main` (`ensure_dev_branch()` already does this). After that, each PR diff shows only that sprint's real changes.
- **Risk:** Low — file blobs are already current; this is **diff hygiene**, not a content bug. Best done right after a merge, when `dev` and `main` are content-equal.

---

## 🟡 Medium Priority

### "Willis" — Humorous, Approachable Help Wiki
- **Status:** ✅ **Launched June 20** — floating widget on all 5 nav pages (`willis.js` + `willis-articles.js` 14 seed articles + `willis/*.png`). Search, article view, lean states, theme-aware, deep-link API. **Final v2 art live** (Gemini-look striped polo). **Packaged as a reusable kit** (`~/Desktop/Willis/willis-kit/` + `.zip`) for other apps.
- **Follow-ups:** (1) ✅ final art swapped in; (2) **inline Willis into offline bundles** (currently stripped — `build_offline_bundle.py`); (3) expand articles beyond the seed ~14; (4) wire deep-links (mobile notice + 🐞 Report → `Willis.article(...)`); (5) `window.WILLIS_CONFIG` for zero-edit reuse (name/tagline/placeholder/art-path).
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

### Customize Your ICP Filter
- **Status:** Not started
- **Scope:** `icp-finder.html`
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

### Hosted UAT Feedback Form (upgrade the 🐞 Report button)
- **Status:** Not started — currently ships via pre-filled `mailto` (June 19)
- **Problem:** `mailto:` scatters reports as individual emails and silently fails for testers with no desktop mail client (webmail-only users). No aggregate triage view.
- **Fix:** point the Report button at a pre-filled hosted form (Tally / Google Forms) so responses land in one dashboard/sheet; keep `mailto` as a fallback. Carry the same diagnostics via URL params. User-initiated only (no-server promise preserved).

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
