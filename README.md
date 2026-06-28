# LinkVault

_The LinkedIn outreach toolkit by Growth Automated._

Browser-based tools for analyzing your LinkedIn network — all processing happens locally in your browser. Your data never leaves your device.

## Tools

### 📊 dashboard.html — LinkedIn Analytics Dashboard
Full analytics across your LinkedIn export: network growth, engagement trends, content analysis, strategy scoring, messaging patterns, and a searchable connections explorer.

**6 tabs · 18 charts · content strategy scorecard**

### 🎯 icp-finder.html — ICP Contact Finder
Automatically classifies your LinkedIn connections into ICP tiers by job title and company, with a unified filter bar (tier · recency · engagement + outreach-segment quick filters). **Customizable** — pick keywords from your own network, start from a vertical preset (DTC · SaaS · Telecom · Financial Services), or load a config built for you. Filter, sort, and export.

**Tiers (default — fully customizable):**
- **T1 · Decision Maker** — founders, C-suite, and senior leaders in your target function
- **T2 · Ecosystem** — people at your named target companies / ecosystem
- **T3 · Adjacent** — broader sector roles

### 🎯 icp-demo.html — ICP Demo (pre-loaded)
Static version of the ICP finder with anonymized sample data already loaded. No file upload needed — use this to evaluate the tool or share with others.

## How to Use

1. **Export your LinkedIn data:** Settings → Data Privacy → [Get a copy of your data ↗](https://www.linkedin.com/mypreferences/d/download-my-data) → Request archive
2. Unzip the download
3. Open `dashboard.html` or `icp-finder.html` in Chrome or Edge
4. Click **Select Export Folder** (Chrome/Edge) or **Choose CSV Files** (any browser)
5. Or click **Try Demo** to explore with sample data immediately

## Files Needed

| File | Used By |
|------|---------|
| `Connections.csv` | Both tools |
| `messages.csv` | Both tools (engagement data) |
| `Shares.csv` | Dashboard only |
| `Reactions.csv` | Dashboard only |
| `Comments.csv` | Dashboard only |
| `Invitations.csv` | Dashboard only |
| `Profile.csv` | Dashboard only |

## Browser Compatibility

| Feature | Chrome/Edge | Firefox/Safari |
|---------|-------------|----------------|
| Folder picker | ✅ | ❌ (use file picker) |
| File picker | ✅ | ✅ |
| Demo mode | ✅ | ✅ |

## Privacy

Everything runs client-side. No data is sent to any server. No accounts required. No tracking.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to Settings → Pages → Source: main branch, root folder
3. Share the URL — anyone can use it with their own LinkedIn export

