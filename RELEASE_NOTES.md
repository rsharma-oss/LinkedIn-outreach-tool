# GrowthAutomated.ai — LinkedIn Toolkit Release Notes

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
