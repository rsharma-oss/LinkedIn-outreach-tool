# LinkVault — UI / UX Redesign Brief

_For handoff to Kimi (design). Owner: Rahul Sharma, rahul@growthautomated.ai. Drafted November 2026, post v1.1-gold._

> **Companion docs** (read in this order, then this file):
> - `README.md` — plain-English product pitch
> - `HANDOFF.md` — full reverse-engineered PRD (what the product does, how it computes things)
> - `BACKLOG.md` — open UX problems the redesign should solve
> - `RELEASE_NOTES.md` — the UX decisions that stuck, and why
> - `CLAUDE.md` — engineering constraints that bind the redesign

This brief is the design-side companion to HANDOFF.md. It says **what Kimi is designing, what must be preserved, what must be improved, and what the finished design handoff must contain.**

---

## 1. Project in one paragraph

LinkVault is a **fully client-side LinkedIn analytics and outreach toolkit** — the user drops their LinkedIn data export (a .zip or folder) into the browser, and the app parses, scores, visualises and scripts outreach to their network, with **nothing ever leaving their device**. It is hosted as **static files on GitHub Pages**. The product shipped v1.1-gold in August 2026 (relationship warmth, smoke-tested, WCAG-AA, Safari-hardened). The look & feel has grown pragmatically through 6 months of UAT patches — it is readable and functional but **has never been designed as a system.** Kimi is being brought in to redesign it as one.

Target user: **Shopify DTC growth-agency founders** and adjacent B2B operators. Positioning now reads vertical-neutral ("Your next customers are already in your network"); DTC is the default ICP, not the only one.

---

## 2. Scope & non-negotiables

### 2.1 In scope — redesign everything the user sees

Every surface listed in §4 (pages) and §5 (components). This is a **full visual + interaction system** — colour, type, spacing, iconography, layout, states, motion, responsiveness — not a palette tweak.

### 2.2 Non-negotiables (constraints the design must respect)

| Constraint | Why |
|---|---|
| **Vanilla HTML / CSS / JS. No framework, no build step beyond the existing offline-bundle inliner.** | GitHub Pages static hosting; the offline bundle must stay buildable by `build_offline_bundle.py`. |
| **Design tokens as CSS custom properties** on `:root` + `[data-theme="light"]` override block. | FOUC script flips `data-theme`; Chart.js reads tokens via `applyChartTheme()`. |
| **Light is the default theme; dark must still work.** Both themes WCAG AA minimum (4.5:1 body text, 3:1 ≥ 24 px). | Shipped July 4 2026; auditing in both themes is a release gate. |
| **Chart.js 4.4.1 is the chart engine.** No swap to D3, Recharts, ECharts, etc. | 20+ existing charts; Chart.js reads tokens; offline-bundle has it inlined. |
| **Google Fonts only.** Current stack is **Inter** (body/UI) + **Assistant** (LinkVault wordmark). Kimi may propose a different pairing but it must be Google-Fonts-hostable. | Single font CDN, simple fallback story, offline-bundle friendly. |
| **All seven pages share one chrome.** If the header/footer/Willis change on one page, they change on all of them. | Shipped June 18 as "unified nav" — this is load-bearing; nav fragmentation is the pre-redesign sin to avoid. |
| **Mobile: upload doesn't work on phones.** Design must gracefully say so; it must not pretend to be a mobile app. | LinkedIn data export + Chrome File System Access API are desktop-only. Phones get a "Built for desktop" notice linking into Willis. |
| **No data leaves the browser.** No analytics, no CDN pings beyond fonts + libs on first load, no tracking pixels, no third-party components that phone home. | The product's entire promise. Say it loudly in the design. |
| **WCAG AA, keyboard-complete, visible focus, dialog focus-trap, skip-link.** | `lv-a11y.js` enforces this today; the redesign must not regress it. |

### 2.3 Preserve as-is (don't redesign these)

- **Engine logic**: ICP tier classifier (T1/T2/T3 keywords + exact-match + rank×domain), warmth scoring, recency / engagement scoring, content-theme classifier. The *presentation* of their output is in scope — the computation is not.
- **Data model & file schema**: CSV field names, `canonicalName()` stripping, cache keys (`ga_csv_cache`, `ga_msg_cache`, `ga_icp_data`, `ga_icp_kw`, `ga_icp_exact`, `ga_icp_profile`, `ga_theme`, `ga_mobile_notice`). Design around them.
- **Deploy workflow**: `push_to_dev.py` → `create_pr.py` → `.nojekyll` on main. Static files only.
- **Reusable `willis-kit`**: Willis is a drop-in widget packaged for other apps (see §5.3). Its *engine* must stay product-neutral — all LinkVault strings go in `WILLIS_CONFIG` or articles, not into `willis.js`.
- **Config file format**: `linkvault-icp` v1 (see `ICP-CONFIG-FORMAT.md`). Save/Load must still round-trip existing configs.

---

## 3. Brand kit (locked — Kimi may refine, not replace)

**Product name:** **LinkVault** — _the LinkedIn outreach toolkit by Growth Automated_.
**Maker:** Growth Automated (agency). LinkVault is the product.

### 3.1 Colour (current)

| Token | Hex | Role |
|---|---|---|
| LinkedIn Blue | `#0A66C2` | Primary brand (logo, primary CTA) |
| LinkedIn Blue (accessible light-mode link) | `#0369a1` | Link / accent in light mode — meets AA |
| Dark Navy | `#0F172A` | Dark-mode base |
| White | `#FFFFFF` | Light-mode base |
| Mid Grey | `#808080` | Secondary text / borders |
| Growth Green | brand green from `logo-color.svg` | "Custom" / success / sample-data button |
| WCAG-safe status (dark) | mint / amber / lavender family | Tier badges, engagement dots |
| WCAG-safe status (light) | dark-shade equivalents | Same, re-tuned for white background |

Kimi may **extend** the palette (e.g. introduce neutrals, add a third accent, define a semantic status set) but **must preserve LinkedIn Blue as the primary brand colour** — LinkVault's identity is literally the LinkedIn/vault pun.

### 3.2 Logo & icon

- Header lockup `<span class="lv-brand">`: **`linkvault-mark.png`** (blue hex vault + white chain-link) + **"LinkVault"** wordmark (Assistant font) + the actual Growth Automated logo stacked small underneath (`logo-white.svg` dark / `logo-color.svg` light, ~84×13).
- Footer: Growth Automated logo **large and centred**, + "LinkVault — the LinkedIn outreach toolkit by Growth Automated".
- Favicons: `favicon.ico` / `favicon-16x16.png` / `favicon-32x32.png` / `apple-touch-icon.png`.
- `<meta name="theme-color" content="#0A66C2">` on every page.
- Full brand kit: `LinkVault-brand-assets/` at project root (not deployed).

Kimi is free to redraw the icon or evolve the wordmark but must deliver both light-mode and dark-mode versions, SVG + PNG, and keep the vault/link metaphor.

### 3.3 Typography (current)

- **Inter** — UI, body, numerals (Google Fonts).
- **Assistant** — the "LinkVault" wordmark only (Google Fonts).
- Dense data tables use tabular numerals.

Kimi may propose a different pairing (Google Fonts only). Assistant is not sacred; LinkedIn Blue is.

### 3.4 Voice

Warm, plain-English, a little cheeky — the Willis voice. No corporate hedging, no AI-mush, no "unlock". Short. Confident. Honest about limits (Safari quota, English-only, no mobile upload).

---

## 4. Pages — surfaces to design

Seven pages share one chrome (header + footer + Willis + mobile notice + live upload-monitor badge). All of them need visual + layout redesign; the two **apps** (Dashboard, ICP Finder) are the heavy lift.

### 4.1 `how-to.html` — "How It Works" (the landing page / homepage)

**Purpose:** first impression + onboarding. Default `index.html` redirects here.

**Current structure (what the redesign must still accommodate):**
1. **Hero** (compact, single-screen) — one-line value prop, **"① Get your LinkedIn data"** primary CTA, "Watch the Flow" secondary, **"🔒 100% local · No server" badge-as-button** (clicking it opens the live upload-monitor modal).
2. **Three tool frames** — _How to use the ICP Finder_, _How to use the Dashboard_, _How to use the Playbook_ — each with: a short description, 2–4 bullets, and a **"Launch the tool →"** `.btn-primary` CTA.
3. **"First: Get your LinkedIn data"** card — restates the primary CTA (step-1 is important enough to be on this page twice), includes "email arrives ~10 min–24 h" context.
4. **Offline downloads** — `.html` files the user can save and run offline (dashboard-offline.html, icp-finder-offline.html).
5. **FAQs** — collapsible `<details>` blocks, each with its own `#faqN` anchor (the mobile-notice deep-links to `#faq5`). Topics: data safety, two zip files, why-not-mobile, why-not-Safari, how-ICP-scoring-works + **full default keyword lists in a `<details>` accordion**.
6. **Footer** — Growth Automated logo, "Report an issue" fallback link, Release notes link.

**Redesign goals for this page:**
- Make the **first-visitor path** unmissable: value prop → **Get LinkedIn data** → **try with sample data** → launch a tool.
- Treat the three tool frames as a **trio of entry points**, visually equal. Today they're vertical and chatty.
- Keep "Watch the Flow" and the privacy-badge button discoverable without them competing with the primary CTA.
- Mobile: upload doesn't work here, but the FAQs + "Built for desktop" message need to feel designed, not apologetic.

### 4.2 `dashboard.html` — the analytics dashboard

**Purpose:** show the user their LinkedIn network at a glance; let them explore it.

**Structure:**
- **Load screen** (pre-data state) — primary CTA "📂 Select Folder", secondary CTAs "➕ Add files", "Choose zip", **"Try with sample data"** (`.btn-sample`, soft-green filled — CR-1 resolved), **`.btn-getdata`** "① Get your LinkedIn data" above the fold. Below: **privacy manifest** (what we read + what we never read), numbered 3-step instructions.
- **Loaded state** — L2 tabs: **Overview · Network · Engagement · Content · Messages · Connections · Relationships**.
- Each tab contains stat cards + Chart.js charts (full chart inventory in §6).
- Right-header controls: **🛡 live upload-monitor badge** (anchored by `privacy-monitor.js`), **Reload data** button, **Export** button.
- **Mobile notice banner** at top of `<body>` (above header) — mobile-only, amber, dismissible.

**Redesign goals:**
- **Perceived performance.** 12k connections parse takes ~11.6 s with no feedback today — the tab reads as frozen. The redesign must specify a **loading / parsing experience** (progress indicator, skeleton states, per-file mount report animation) that makes a long parse feel deliberate instead of broken. See `BACKLOG.md` → "Parse progress".
- **Information hierarchy.** Today every chart gets equal weight. Design should group them: at-a-glance up top, deep-dive below. Possibly reduce the number of visible charts per tab; let users expand "more" rather than scroll a long list.
- **The 6-stat-card row** on Overview is the single most-viewed element — design it as a hero, not a subtitle.
- **Connections table** on tab 6 — current combobox + table + pagination works but reads like a spreadsheet. Treat it as a first-class view.
- **Relationships panel** (new in v1.1) is the differentiator — give it visual weight.

### 4.3 `icp-finder.html` — the ICP classifier + outreach planner

**Purpose:** classify every connection into Tier 1/2/3, give the user a prioritised outreach list + copyable message templates.

**Structure:**
- **Load screen** — same shape as Dashboard's (primary + sample + Get-data CTAs + privacy manifest).
- **Loaded state** — L2 pill tabs: **ICP Contacts · Outreach Plan · Message Templates**.
- **ICP Contacts view:**
  - Stat cards: Total in ICP, T1 count, T2 count, T3 count, Unmatched count.
  - **Tier cards** — three cards (T1/T2/T3), each with label + description + match count. Labels relabel per active ICP (e.g. Telecom preset relabels "Decision Maker" → telecom-appropriate).
  - **`.icp-note`** explainer — "How these tiers are scored" with **✏️ Customize** button (opens the 3-step modal, see §5.6) and a `<details>` accordion of the default keyword lists.
  - **Unified filter bar** (`icp-filters.js`):
    - 3 custom attribute dropdowns: **Tier · Recency · Engagement** (chevron-rotate, outside-click + Esc + keyboard).
    - **Quick-filter segment pill nav**: _All · T1 first message · Follow-up · Re-engage_.
    - Dropdowns + pills compose.
  - **Contact table** — sortable (Name, Title, Company, Tier, Connected, Recency, Engagement, **Relationship**), paginated (50/page), with **warmth badges** in the Relationship column that open a **popover** showing _why you know them_ + a copyable grounded opener.
- **Outreach Plan view** — four prioritised sections (🔥 Hot / 🌤 Warm / ❄️ Cool / 🔗 T2 Ecosystem) with caps.
- **Message Templates view** — 7 templates in 4 categories (t1, t1b, t2, followup1, followup2, re1, re2) — each a card with title, category tag, usage note, template text with `[placeholders]`, one-click copy.

**Redesign goals:**
- **Tier cards** should feel like the product's "verdict" on the network, not just counters. They currently are three small cards competing with stat cards above and a filter bar below.
- **The warmth popover** (v1.1 flagship) deserves a proper design — today it's a modest tooltip. It should feel like the moment the product earns its keep.
- **The ICP customizer modal** (§5.6) is a three-step flow that today reads as one busy screen with an Advanced disclosure. Redesign should preserve the 3-step logic but make each step *feel* separate and lightweight.
- **Pagination** today is prev/next only — users don't know how many pages exist (backlog item).
- **Table density** vs card-view — a 2900-connection table is a lot of rows; consider a dual-mode (dense table / scannable card) or a deliberate information density pass.

### 4.4 `outreach-playbook-demo.html` — Playbook

**Purpose:** demonstrate the outreach workflow with ICP-scored contacts.

**Notes for Kimi:**
- Uses a **separate CSS-variable scheme** (`--bg-primary`, `--text-primary`, `--accent`, `--bg-card` …) and its own theme-toggle class (`.theme-toggle`). The redesign should **merge the two token sets** or document the separation and keep them in lockstep. Pragmatic recommendation: unify.
- Reads `ga_icp_data` (ICP-scored contacts written by icp-finder). If absent but a session cache exists, Playbook routes the user to ICP Finder (one click, auto-restores) instead of showing demo.
- Low priority in the backlog — but visually it's one of the 7 pages, so it needs the same chrome and theme treatment.

### 4.5 `demo.html` — Book-a-demo

**Purpose:** book-a-demo CTA page. Reached from Willis's "📅 Book a demo →" and from how-to's bottom CTA.

**Needs:** a focused "pitch + book" layout. Today it's a themed nav page with light-weight content. Kimi can treat it as a mini-landing page.

### 4.6 `index.html` — root redirect

A tiny page that redirects `/` to `/how-to.html` (because the bare GitHub Pages URL used to 404). No visible UI needed, but the redirect page itself should be on-brand (1-second branded "Loading LinkVault…" rather than a blank flash).

### 4.7 `icp-demo.html` + `dashboard-demo.html` — shareable dark-only snapshots

**Purpose:** prospect-facing samples. A reader can see the tool "full" without uploading anything. They **load Willis** (so Book-a-demo + Report still work there) but are **dark-only** — they are deliberately a different experience from the apps.

**Decision for Kimi:** should these stay dark-only (today) or become themed too? If they stay dark-only, give them a distinct visual treatment — they are **marketing surfaces**, not app surfaces. Today they look like the app with light mode missing.

### 4.8 `shopify-embed.html` — Shopify-app embed

**Purpose:** paste-into-Shopify snippet for Shopify merchants / agencies to show LinkVault inline.

**Decision pending** (BACKLOG: "Deploy / version shopify-embed.html"). For the redesign: treat it as a **segment-specific micro-site** that can legitimately look different from the main app — it's a bespoke channel. Needs its own narrow brief if we decide to version it.

### 4.9 `linkvault/index.html` — vanity path

The `/linkvault` vanity URL. A one-page explainer that routes into `how-to.html`. Low priority — can be a thin landing variant.

### 4.10 Offline bundles — `dashboard-offline.html`, `icp-finder-offline.html`

Single-file, no-CDN variants (all JS + CSS + fonts + base64 images inlined). **Built, not hand-authored.** The redesign must stay inline-able by `build_offline_bundle.py` — avoid patterns that depend on external assets at runtime (iframes, remote fonts beyond Google Fonts, etc.).

---

## 5. Component library — build these as a design system

These are the repeated patterns. Design them **once**; they should appear identical across every page they occur on.

### 5.1 Header (chrome)

- **3-column flex, centred.** `.hdr-l { flex: 1 1 0 }` · `.hdr-nav { flex: 0 0 auto }` · `.hdr-r { flex: 1 1 0; justify-content: flex-end }`.
- **Left zone:** ☀️/🌙 theme toggle (far left, before the brand) + the brand lockup (icon + wordmark + "by Growth Automated" small).
- **Centre zone:** nav links — `📘 How It Works · 📊 Dashboard · 🎯 ICP Finder · 📋 Playbook`. Active state: filled background, darker border, bold text. Hover state: subtle elevation.
- **Right zone:** **🛡 live upload-monitor badge** (anchored by `privacy-monitor.js`), then page-specific controls (Reload, Export).
- **Mobile (`≤680 px`): entire nav hidden** (`.hdr-nav{display:none}`). Tool-switching on mobile is via page content + the always-visible Willis bubble.

**Design notes:**
- The 768–950 px band is historically tight (brand vs. nav). Solve it in the redesign — maybe wrap the nav earlier, or shrink the brand lockup, or give the nav a more compact form at that width.
- Status indicators (live monitor badge, theme toggle) are **not decoration** — they are proof-of-privacy and user control. Treat them as first-class.

### 5.2 Footer

- Centred Growth Automated logo (large, ~360×56 — `.lv-foot-logo`), white on dark / colour on light.
- Tagline line: "LinkVault — the LinkedIn outreach toolkit by Growth Automated".
- Footer link row (`.lv-foot-links`) — Source (GitHub), Release notes, **Report an issue** (guarded fallback — `window.reportIssue && reportIssue()`; the per-page mailto fallback catches Willis load failures).

### 5.3 Willis — the floating help widget

**What it is:** a fixed bottom-right **avatar bubble** on every page → opens an "Ask Willis…" panel with client-side search over ~40 bundled articles. Theme-aware, keyboard-navigable, deep-link API.

**Panel contents (home view):**
- Character image (one of 5 poses: idle, thumbs-up, shrug, cheeky, avatar).
- Tagline — "Your guide to LinkVault · online".
- Search input — placeholder: "Whatchu talkin' 'bout, Willis?".
- Action buttons (from `WILLIS_CONFIG.actions`):
  - **📅 Book a demo →** → `demo.html`
  - **🐞 Report a bug** → `gaReport()` dialog (Copy / Gmail compose URL / mailto)
- Articles navigation: categories → articles → article body.
- **No-match state** — Willis in shrug pose + "tell us what you needed" (→ gaReport).

**Report dialog (`gaReport`):**
- Three delivery options (Copy / Gmail compose URL / mailto) — webmail users must have a path.
- Pre-filled with privacy-safe diagnostics (tool, page, browser-parsed UA, screen, theme, load-state counts, recent console errors).
- **No LinkedIn data in the report.**

**Design notes:**
- 5 art poses need **consistent framing** (bubble + panel header + welcome card + "got-it" + "shrug"). Today they have varying crops and some white-box backgrounds that need flood-filling.
- The engine (`willis.js`) is **product-neutral** — all LinkVault data lives in `WILLIS_CONFIG` or `willis-articles.js`. If the redesign changes Willis's look, the kit stays reusable.
- Dark by default inside the panel, with its own `--wp-*` tokens so it stays visually separate from the page theme.

### 5.4 Mobile "Built for desktop" notice

Amber top-of-page banner on the two apps (dashboard, icp-finder) only, mobile-only (`@media max-width:768px`), dismissible (`ga_mobile_notice` in localStorage). Links to `how-to.html#faq5` (which auto-expands via the `#faqN` hash handler). **Placed above `<header>`** so it's visible regardless of header wrap height.

### 5.5 Privacy manifest + live upload monitor

Two parts, repeated across load screens and the header:
- **Privacy manifest** (on both load screens) — a short list of what LinkVault reads and what it **never** reads (ad clicks, ad-targeting profile, login IPs & security history, billing receipts, phone numbers, email addresses). Treat it as a **feature** of the product, not legal fine print.
- **🛡 Live upload-monitor badge** in every header — shows "0 B uploaded" during use, clickable → opens the live monitor modal (a real-time tally of bytes sent anywhere). Dark-green in both themes (4.5:1+). The badge is **proof**, not a claim.

### 5.6 The ICP customizer modal — the hero interaction

The redesign's most complex component. Today it's a 3-step guided flow with an Advanced disclosure.

**Step 1 — Industry preset pills:**
- DTC · B2B SaaS · Telecom · Financial Services (4 pills today; extensible).
- Clicking a pill **relabels** the tier cards for the whole ICP and loads that preset's `ICP_KW` + `ICP_EXACT` + `ICP_DOMAIN`.

**Step 2 — Network picker:**
- Two tabs: **Pick titles** / **Pick companies**.
- Each row: _title (count) → T1 · T2 · T3 · ✕_ buttons. Current tier highlighted (solid), clicking it again toggles off.
- **Unmatched-first** sort — the most important thing a user can do is tier a title the default didn't catch.
- Bulk actions ("add all follow-companies to T2").

**Advanced disclosure:**
- Textarea keyword editors per tier (T1 / T2 / T3).
- Save config / Load config buttons — exports / imports the `linkvault-icp` v1 JSON.

**Dialog semantics:** `role="dialog"`, `aria-modal="true"`, focus trap, ESC closes, focus returns to the ✏️ Customize button (shipped by `lv-a11y.js`).

**Design goals:**
- Make each step **feel like a step**, not a section of one busy screen.
- The network picker is the step most likely to intimidate — give it air, make it keyboard-complete, make the state (what's T1, what's T2, what's excluded) scannable at a glance.
- Suggestions ("companies you follow where you also have connections" → T2) should feel like a *gift the product made to the user*, not a form.

### 5.7 The warmth popover (ICP Finder → Relationship column)

Clicking a warmth badge opens a popover with:
- **Score** + label (strong / warm / light / cold).
- **Reasons** list ("They wrote you a recommendation", "They endorsed you for Strategy & Product Management", "You've exchanged 23 messages", "You follow their company").
- **Grounded opener** — pre-written text referencing the shared moment. One-click copy.

**Design notes:** this is the moment v1.1 "earns its keep" — it transforms a row into a person. Make it feel human. Today it's small and looks like a tooltip.

### 5.8 Stat cards

- A row of 4–6 metric cards (number + label + optional subtitle/trend/sparkline).
- Dashboard Overview uses 6; ICP Finder uses 4; Dashboard Relationships uses 4.
- **Design them as one component with content slots** — a sparkline slot, a trend indicator slot, an icon slot, a "learn more →" link slot.

### 5.9 Chart cards

- Container for a Chart.js chart + title + subtitle + optional legend + optional "export this chart" action.
- Consistent padding, title treatment, grid/axis colours driven by CSS tokens (`--chart-grid`, `--chart-tick`, `--chart-label`), legend placement.
- See §6 for the chart inventory + typing.

### 5.10 Tier cards (ICP Finder)

Three cards in a row: T1 (Decision Maker) / T2 (Ecosystem) / T3 (Adjacent). Each shows label + description + match count. Labels and descriptions **relabel per active ICP**. Design them so they feel like *conclusions the product reached about this user's network*, not static instructional cards.

### 5.11 Filter bar (ICP List)

The unified bar (`icp-filters.js`): 3 attribute dropdowns (Tier / Recency / Engagement) above 4 segment pills (All / T1 first message / Follow-up / Re-engage). Dropdowns + pills compose. **Keep this shape — it's the pattern we landed on after reverting a built-and-reverted dropdown prototype in June.**

### 5.12 Buttons

- `.btn-primary` — LinkedIn Blue filled, white text (meets AA both themes today at `#0077B5`).
- `.btn-getdata` — the **primary CTA** for "① Get your LinkedIn data" (same blue family, with a numbered "1" badge affordance). Full-width on mobile.
- `.btn-sample` — soft-green filled, on-brand, for "Try with sample data" (CR-1 resolved).
- `.btn-icon` — square icon button (theme toggle, reload, export).
- `.btn-report` — contextual, injected into empty/error states on the apps.
- Secondary / tertiary / destructive — Kimi to define.

### 5.13 Tables

- The Connections table (Dashboard, tab 6) and the ICP Contacts table (ICP Finder, view 1) are the two heavy tables.
- Sortable column headers, pagination (today 50/page, prev/next — redesign should show total page count), filter composition with the filter bar above.
- **Searchable company combobox** (`cdd-*`) — scrollable searchable dropdown that replaced a native `<select>` that capped at ~300 options. Design the custom combobox as a first-class component (dashboard + dashboard-demo use it).

### 5.14 Dropdowns

Custom attribute dropdowns (`dd-wrap / dd-trigger / dd-menu`) — chevron-rotate, outside-click + Esc + ↑/↓ keyboard, ARIA listbox. Dark-theme and light-theme variants.

### 5.15 Tabs

- L2 app tabs (`.tab` on Dashboard, `.view-tab` on ICP Finder). Active state: underline + tinted background + text colour.
- Keyboard accessible (↑/↓ or ←/→ to move between tabs, Enter/Space to activate).

### 5.16 Message template cards

7 card variants with one-click copy. Each shows: category tag, title, usage note, template body with `[placeholders]`. Design them to be **scannable** at a glance — a user is picking between them under pressure.

### 5.17 Mount report + load-state feedback

After a load/add, a mount report names **exactly which files loaded and which are missing**, with an inline "add the missing files" button (shipped Aug 3). Today this is a banner — in the redesign it should be a persistent, scannable diagnostic surface (expandable, with per-file status chips).

---

## 6. Data visualizations — Chart.js chart inventory

**20+ charts across Dashboard + ICP Finder + Playbook.** Chart.js 4.4.1 reads `GC = { color, grid, tick }` from CSS tokens. All charts must theme correctly (`applyChartTheme()` syncs the registry on theme change).

### 6.1 Chart inventory

**Dashboard Overview (3 charts):**
- Network Growth — cumulative line, all time
- Activity Breakdown — bar (reactions / comments / posts)
- Monthly Engagement — stacked bar, last 18 months

**Dashboard Network (5 charts):**
- Cumulative Network Growth — line
- New Connections Per Month — bar, 24 months
- Connected On — day-of-week bar
- Top 20 Companies — horizontal bar
- Top 20 Job Titles — horizontal bar

**Dashboard Engagement (5 charts):**
- Monthly Engagement Volume — line, all time
- Engagement by Month This Year — bar
- Activity Day of Week — bar
- Reaction Types — doughnut
- People You Follow — horizontal bar list

**Dashboard Content (6 charts + 1 scorecard):**
- Content Strategy Scorecard — 4-metric RAG card (Publishing Cadence, Week Consistency, Content Length, Topic Variety)
- Posts Per Month — bar
- Weekly Cadence — heatmap
- Content Theme Breakdown — doughnut or bar
- Publishing Day of Week — bar
- Post Length Distribution — histogram
- Monthly Posts, 24 months — bar

**Dashboard Messages (3 charts + 1 table):**
- Messages Per Month — line
- Sent vs Received, 12 months — grouped bar
- Messaging Day of Week — bar
- Top Contacts — table

**Dashboard Relationships (new in v1.1):**
- 4 stat cards (people you actually know · strong ties · what you're known for · companies you follow)
- Warmth doughnut
- Top endorsed skills (horizontal bar)
- Endorsement activity by year — bar (13-year record)

**ICP Finder:** no Chart.js today, but Kimi may propose data visualizations for the ICP summary view.

### 6.2 Design goals for the viz system

- **One visual language across 20+ charts.** Colour (palette or gradient), axes, grid, tick, legend, tooltip — all tokenised. See the `dataviz` skill for guidance.
- **Dark + light parity.** Grids and ticks need distinct tokens per theme (`--chart-grid-dark` vs `--chart-grid-light`) so axes are visible without screaming.
- **Readability over polish.** This is an analytics tool, not a showcase. Prefer honest bars over fancy 3D.
- **Chart density.** Today each tab shows every chart in a vertical scroll. Consider: at-a-glance grid up top, deep-dive below on expand.

---

## 7. States — the matrix every page must handle

Every page's design must specify behaviour in each of these states:

| State | Who sees it | Design must show |
|---|---|---|
| **Pre-data load** | First-time user on dashboard/icp-finder | Load screen (CTAs + privacy manifest + 3-step instructions + sample-data option) |
| **Loading / parsing** | After file drop | Progress indicator (percent, or at least file-by-file), **mount report banner** on completion |
| **Loaded + populated** | Normal use | All charts + tables + stats render |
| **Loaded + empty slice** | E.g. no activity CSVs | Each affected chart/table shows a specific empty state with a "load this file" nudge |
| **Loaded + error** | A file failed to parse | Error banner + `report-btn` + actionable guidance |
| **Demo mode** | Sample-data button | Everything populated with synthetic data, a visible "demo" badge |
| **Quota exceeded (Safari)** | H-activity users | A **graceful explanation message**, not silent truncation. See BACKLOG: "Safari storage cliff" |
| **Non-English export** | Localized LinkedIn users | A **graceful detection + "switch your LinkedIn to English, re-download"** message. Today = silent empty charts. See BACKLOG: "Language scope" |
| **Light theme** | Default | AA contrast everywhere, status colours re-tuned |
| **Dark theme** | User-chosen | AA contrast everywhere, muted text ≥ 0.55 alpha |
| **Mobile** | Phones | "Built for desktop" notice on apps; FAQs + landing readable; upload gracefully refused |
| **Offline (saved HTML)** | User opened a saved offline bundle | Everything works, external links shaded off except the LinkedIn data-download URL (allowlisted) |
| **Session cache restore** | Returning user in same tab | Auto-restore + a subtle "restored from session" affordance |

**Design deliverables must include state variants for each page** — not just the "happy loaded" view.

---

## 8. Open UX problems the redesign should solve

Directly from `BACKLOG.md` + release history. Any design that fixes these earns its keep:

1. **Parse progress feedback.** 12k connections takes ~11.6 s with zero feedback — reads as frozen. Need a loading / parsing experience that is clearly alive.
2. **Safari storage cliff.** The ~5 MB quota is a known cliff with no graceful degradation message today. Design the explanation state.
3. **Non-English LinkedIn exports.** English-only is the policy (LinkedIn translates export column headers). Need a **detection screen** that says "switch your LinkedIn to English, re-download, try again" instead of silent empty charts. Also: add a small "Works with English-language LinkedIn exports" line to load screens + how-to.
4. **Manual cache-busting.** The `?v=N` version bumps on scripts are manual and have caused 2 stale-JS incidents. Design-wise, no fix — but surface clearly in the design handoff that any shared JS component needs a version query string, and the design-tokens file is the same.
5. **UAT #4 (onboarding friction).** Unscoped — the redesign should reduce first-visitor friction *by default*: the shortest path from landing → "I see my network" should be obvious.
6. **Willis pose consistency.** All 5 poses (main / thumbsup / shrug / cheeky / avatar) rendered across bubble, panel header, welcome card, got-it, shrug states. Today some are tight-cropped to face-only ("Curious George" effect — fixed on the bubble, not reviewed on the others), some ship on white backgrounds that need flood-filling.
7. **Pagination affordance.** Tables show prev/next without total page count.
8. **Tier scoring transparency.** Show *why* a contact was scored T1/T2/T3 (tooltip or expandable detail on the row) — today the inline `.icp-note` explains defaults but a specific-row explanation is missing.
9. **CSV export.** Let users export filtered ICP contacts as CSV from the table (Low priority, but it's a visible button in the design).
10. **Message thread view.** From the Messages tab, let the user click a conversation → expand full thread inline.
11. **Header crowding 768–950 px.** Brand lockup + nav collide in that band.
12. **Mobile.** Upload doesn't work on mobile. Today = top-banner notice + hidden nav. A *designed* mobile experience ("view your results on desktop; here's what you can do on phone") would be an improvement.

---

## 9. Responsive breakpoints

Current rough shape — Kimi should propose a clean system:
- **≤ 480 px** — phone, Willis sheet goes near-fullscreen, mobile notice visible on apps.
- **481–680 px** — small tablet / large phone; nav fully hidden; headers compact.
- **681–768 px** — nav appears again (how-to), content stacks.
- **769–1023 px** — the tight band; brand lockup vs nav.
- **1024–1279 px** — the clean default.
- **≥ 1280 px** — spacious; charts can breathe.

Apps (dashboard, icp-finder) are **desktop-first** by policy. Marketing / landing pages (how-to, demo, playbook) should be **pleasant on phones** even though the apps aren't.

---

## 10. Accessibility floor

Enforced today by `lv-a11y.js` and the July 15 WCAG audit:
- WCAG AA text contrast in both themes (4.5:1 body, 3:1 ≥ 24 px).
- Every control keyboard-operable (no mouse-only interactions).
- Visible focus ring on every interactive element.
- Skip-link on every page.
- `<main>` landmark on every page.
- Dialog focus management: `role="dialog"` + `aria-modal="true"` + focus trap + ESC closes + focus returns to opener.
- Semantic headings (`h1 → h2 → h3`, no skips).
- `prefers-reduced-motion` honoured.

**Kimi's design must specify:** focus ring token, focus trap visualisation, skip-link appearance, reduced-motion fallbacks. A screen-reader pass is still open (BACKLOG) — the redesign is not required to do it, but should not make it harder.

---

## 11. Deliverables Kimi must produce

To hand off cleanly to engineering, the design should include:

1. **Design tokens file** — colours, typography, spacing, radii, shadows, motion. As a style-dictionary-style JSON or as named CSS custom properties. Dark + light variants.
2. **Component library** — every item in §5, with all states (default, hover, focus, active, disabled, loading, error) in both themes.
3. **Page compositions** — every page in §4, at desktop (1280 px) + tablet (768 px) + mobile (375 px) breakpoints, in both themes. State variants from §7 where they apply.
4. **Chart visual system** — colour palette (categorical + sequential + diverging), grid / tick / axis / legend / tooltip treatment, light + dark.
5. **Interaction specs** for the complex components: **ICP customizer modal** (3-step flow + Advanced), **warmth popover**, **filter bar** (dropdowns + pills composition), **Willis panel** (home + search + article + no-match), **mount report**, **upload-monitor modal**.
6. **Icon set** — a consistent set covering: nav icons (📘 📊 🎯 📋 — current emoji may stay or be replaced), stat-card icons, reaction types, theme toggle, privacy shield, Willis bug/demo buttons.
7. **Logo lockup variants** — header, footer, favicon, social-share (og:image), both themes.
8. **Motion spec** — chevrons, panel open/close, filter apply, theme flip (if any), hover transitions. Should respect `prefers-reduced-motion`.
9. **Empty / error / loading state illustrations** — if the design introduces any. Keep them Growth Automated / LinkVault in flavour (not stock art).
10. **A short "design notes to engineering"** doc per page — any constraint, intent, or edge case that doesn't survive a static mock.

Format: **Figma** is fine (file link + export permissions). Design-tokens separately as JSON. All assets exportable at 1× and 2×.

---

## 12. Out of scope

- Server infrastructure (there is none).
- Login / accounts (there are none; session is tab-scoped).
- Mobile upload flow (LinkedIn export + File System Access API are desktop-only).
- Analytics / tracking.
- Chart library migration.
- Framework migration (Vue / React / Svelte).
- Localization beyond "English with a graceful non-English detection screen".
- Firefox support (explicitly out of scope — Chrome/Edge + Safari only).

---

## 13. Suggested working rhythm

1. **Design-tokens + chrome first.** Header, footer, Willis, buttons, typography — the system that every page inherits.
2. **Dashboard before ICP Finder.** Dashboard is the wider surface; the viz system settles there.
3. **ICP Finder next, with the customizer and warmth popover as the two hero interactions.**
4. **Landing + marketing pages (how-to, demo, playbook) after the apps.** They should inherit the system, not define it.
5. **State coverage last pass.** For each page, walk the state matrix in §7 and design the ones that haven't been covered.
6. **A11y and viz audits** against the system before handoff.

---

## 14. Questions worth answering before Kimi starts

- Is Assistant (wordmark font) sacred or can it move?
- Does LinkedIn Blue (`#0A66C2`) need to stay the hero colour, or is the LinkedIn metaphor flexible enough to accept a different primary? (Strong vote here: keep it.)
- `icp-demo.html` + `dashboard-demo.html` — stay dark-only (marketing samples) or become themed too?
- `shopify-embed.html` — version it in the repo or keep it bespoke?
- Is a per-page "export this view as PDF / PNG" affordance in scope or future work?

Answer these up front and the brief is complete.

---

_End of brief. For live engineering constraints see `CLAUDE.md`. For the backlog of open UX problems see `BACKLOG.md`. For the product's reasoning and history see `HANDOFF.md` and `RELEASE_NOTES.md`._
