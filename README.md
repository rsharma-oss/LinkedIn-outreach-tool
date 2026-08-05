# LinkVault

_The LinkedIn outreach toolkit by Growth Automated._

**Your next customers are already in your network.** LinkVault turns your LinkedIn data export into a prioritized outreach list — who's a decision-maker, who's at a target account, and **who you already have a real relationship with**.

Everything runs in your browser. No server, no account, no upload.

**→ [Open LinkVault](https://rsharma-oss.github.io/LinkedIn-outreach-tool/)**

---

## What it does

### 🎯 ICP Finder
Classifies every connection into tiers by title and company, then ranks them by how well you actually know them.

- **Tiers (defaults, fully customizable):** **T1 · Decision Maker** (founders, C-suite, senior leaders) · **T2 · Ecosystem** (your named target accounts) · **T3 · Adjacent** (broader sector roles)
- **Relationship warmth** — endorsements, recommendations and company follows surface *why* you know someone ("They endorsed you for Strategy", "You wrote them a recommendation") plus a ready opener grounded in that history. On a real 2,963-connection network, **34% of contacts carried a genuine relationship signal** — including people who looked stone-cold by message history.
- **Suggestions from your own data, which you approve one by one:** companies you follow where you already have connections → T2 named accounts; terms you actually search for on LinkedIn → T1/T3 keywords. Nothing is ever applied automatically.
- Vertical presets (DTC · SaaS · Telecom · Financial Services), pick-from-your-network keyword editing, save/load config, CSV export.

### 📊 Dashboard
Full analytics on your export: network growth, engagement, content strategy scoring, messaging patterns, a searchable connections explorer — and a **Relationships** panel (people you actually know, strong ties, what you're known for, endorsement activity by year).

### 📋 Outreach Playbook
A priority queue built from your ICP list, with ready-to-send message templates for first touches, follow-ups and re-engagement.

### Also included
- **How It Works** — the landing / instructions page
- **Demo pages** (`icp-demo.html`, `dashboard-demo.html`) — pre-loaded with sample data; nothing to upload
- **Offline builds** (`dashboard-offline.html`, `icp-finder-offline.html`) — single self-contained files, every library inlined, zero network required
- **`smoke-test.html`** — 17 end-to-end checks using synthetic fixtures. Open it in any browser to verify that browser. It snapshots and restores your saved ICP settings, so running it never disturbs your setup.

---

## How to use

1. **Get your data:** LinkedIn → Settings → Data Privacy → [Get a copy of your data ↗](https://www.linkedin.com/mypreferences/d/download-my-data) → Request archive. The email arrives in ~10 minutes to 24 hours.
2. Open the [Dashboard](https://rsharma-oss.github.io/LinkedIn-outreach-tool/dashboard.html) or [ICP Finder](https://rsharma-oss.github.io/LinkedIn-outreach-tool/icp-finder.html).
3. **Drop the `.zip` straight in — no unzipping needed.** Or pick individual CSVs, or select the unzipped folder (Chrome/Edge).
4. Missed a file? Click **➕ Add files** — new files merge into what's already loaded, they don't replace it.

Prefer to look before you load? Click **✨ Try with sample data**.

---

## Files it reads

| File | Used for |
|------|----------|
| `Connections.csv` | **Required** — names, companies, roles, connection dates |
| `messages.csv` | Engagement recency per contact |
| `Reactions.csv` · `Comments.csv` · `Shares.csv` | Dashboard engagement + content analytics |
| `Invitations.csv` · `Profile.csv` · `Positions.csv` · `Member_Follows.csv` | Dashboard context |
| `Endorsement_Given_Info.csv` · `Endorsement_Received_Info.csv` | Relationship warmth |
| `Recommendations_Given.csv` · `Recommendations_Received.csv` | Strongest relationship signal |
| `Company Follows.csv` | Account affinity → T2 suggestions |
| `SearchQueries.csv` | ICP keyword suggestions (read in memory, never cached) |

Every file is optional except `Connections.csv` — each signal degrades gracefully. After loading, a banner tells you exactly which files mounted and which are missing.

Works with **English-language** LinkedIn exports (LinkedIn translates CSV column headers by account language).

---

## Privacy

**No server. No upload. No account. No tracking.** Every page carries a live monitor counting the bytes it sends — it reads `0 B uploaded` and never moves. Don't take our word for it; watch it, or [read the source](https://github.com/rsharma-oss/LinkedIn-outreach-tool).

**And what it never opens.** Your export also contains ad clicks (the single largest file in it), your ad-targeting profile, login IPs and security history, billing receipts, phone numbers and email addresses. LinkVault doesn't read any of it — those files have nothing to do with outreach.

---

## Browser support

| | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| Drop a `.zip` · pick CSVs | ✅ | ✅ | ✅ |
| Folder picker | ✅ | ❌ use the file picker | ❌ use the file picker |
| Sharing loaded data between tools | ✅ ~10 MB | ⚠️ ~5 MB — very large exports may need re-loading per tool (you'll be told) | ⚠️ |

Verified end-to-end on **Safari 26** and **Chrome 150** (17/17 smoke checks). Desktop-first: loading an export needs a real browser, so phones get a heads-up notice.

Accessibility: keyboard-operable controls, dialog focus management, skip link, visible focus, and WCAG AA text contrast in both light and dark themes.

---

## Deploy your own

1. Push this folder to a GitHub repository
2. Settings → Pages → Source: `main`, root folder
3. **Add an empty `.nojekyll` file at the repo root** — without it Jekyll fails on the inlined libraries in the offline builds and the deploy silently fails
4. Share the URL — anyone can use it with their own export

---

_Built by [Growth Automated](https://growthautomated.ai). Not affiliated with LinkedIn._
