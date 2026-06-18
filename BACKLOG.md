# GrowthAutomated.ai — LinkedIn Toolkit Backlog

_Last updated: June 17, 2026_

---

## 🔴 High Priority

### Light / Dark Mode
- **Status:** Attempted, reverted (buggy)
- **Scope:** Both `dashboard.html` and `icp-finder.html`
- **Requirements:**
  - CSS variable swap via `[data-theme="light"]` on `<html>`
  - `localStorage` persistence across page navigations
  - FOUC-prevention script in `<head>` (apply theme before first paint)
  - Chart.js update on toggle — grid lines, axis ticks, legend labels, doughnut border
  - All hardcoded `rgba(255,255,255,...)` hover tints need light-mode overrides
  - Header gradient (`linear-gradient(135deg,#0a0f1e,#0d1525)`) needs override
  - Toggle button (🌙 / ☀️) in `hdr-r` before status dot
- **Known issues from v1:**
  - Chart.js colors not fully updating on toggle
  - Hardcoded rgba white tints visible on light backgrounds
  - Privacy manifest colors not adapting

---

## 🟡 Medium Priority

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
- **Note:** Currently all classification is hardcoded — see FAQ item below for exact defaults

---

### ICP Scoring FAQ — Document the Coded Defaults
- **Status:** Not started
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
- **Status:** Script ready (`build_offline_bundle.py`), not yet run / not deployed
- **Scope:** Generates `dashboard-offline.html` and `icp-finder-offline.html`
- **Action needed:** Run on Mac with internet access, then push with `--with-offline` flag
- **Blocker:** Download buttons on `how-to.html` will 404 until files exist

### How-To Page
- **Status:** Linked from nav but not reviewed this sprint
- **Requirements:** Audit for accuracy, confirm offline download links point to correct filenames

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

- LZ-string compression for sessionStorage (Safari fix)
- Split-key cache strategy (`ga_csv_cache` + `ga_msg_cache`)
- Mobile responsive layout (3 UAT defects fixed)
- Navigation contrast upgrade — L1, L2 tabs, L2 pill filters
- Chrome folder mount Step 2 null data bug fixed
