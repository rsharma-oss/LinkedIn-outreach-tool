# Tailoring the ICP Classification to Your Business

The ICP Finder classifies your LinkedIn connections into three tiers based on four keyword lists in `icp-finder.html`. Editing those four lines is all you need to adapt the tool to any industry or audience.

---

## How the Classification Works

Every connection is run through this logic in order:

1. **Excluded?** → Not classified at all (filtered out of results)
2. **T1 match on job title?** → Tier 1 (Decision Maker)
3. **T2 match on title OR company name?** → Tier 2 (Ecosystem)
4. **T3 match on job title?** → Tier 3 (Adjacent)
5. **No match** → Not included

The matching is case-insensitive and uses partial-word logic (e.g., `\bfounder\b` matches "Founder" but not "Co-Founder" unless that's listed separately).

---

## Where to Edit

Open `icp-finder.html` in any text editor (VS Code, TextEdit, Notepad, etc.) and jump to **lines 1744–1747**. You'll see four constants:

```javascript
const T1_KEYWORDS = /.../i;
const T2_KEYWORDS = /.../i;
const T3_KEYWORDS = /.../i;
const EXCL_KEYWORDS = /.../i;
```

Each one is a list of terms separated by `|` (the pipe character). To add a term, append `|newterm` anywhere inside the slashes. To remove a term, delete it and the adjacent `|`.

---

## What Each Tier Means (Default: Ecomm Agency)

| Tier | Purpose | Default Keywords Target |
|------|---------|------------------------|
| **T1** | Direct buyers — people who can say yes | Founders, CEOs, CMOs, VP Marketing, Head of DTC |
| **T2** | Ecosystem — in your world, may refer you | Shopify/Klaviyo stack roles, Fractional CMOs, DTC specialists |
| **T3** | Adjacent — worth nurturing, not prioritizing | Marketing Managers, SEO, Content, Social Media |
| **EXCL** | Noise — skip entirely | Recruiters, Engineers, Lawyers, Students, CFOs |

---

## Step-by-Step: Customizing for Your ICP

### 1. Define your three tiers

Before editing any code, answer these questions:

- **T1 — Who can write the check?** (titles of your ideal buyers)
- **T2 — Who lives in your ecosystem?** (tools they use, niche role names, industry-specific titles)
- **T3 — Who's worth a slow nurture?** (adjacent roles that might refer or eventually buy)

### 2. Edit the keyword arrays

Replace the terms inside each regex with yours. Format:

```javascript
const T1_KEYWORDS = /term1|term2|term3 phrase|another term/i;
```

**Rules:**
- Separate terms with `|`
- Multi-word phrases work as-is: `head of revenue`
- Use `\b` around short words to avoid partial matches: `\bvp\b` won't accidentally match "MVP"
- The `/i` at the end makes everything case-insensitive — leave it there
- Tool/platform names in T2 match against company name too — useful for people who work *at* those companies

### 3. Save the file and re-upload

Once you've saved your edits, re-run the upload script in Terminal:

```bash
python3 upload_to_github.py
```

GitHub Pages will serve the updated file within a minute or two.

---

## Example: B2B SaaS Sales Consultant

```javascript
const T1_KEYWORDS = /\bfounder\b|co-founder|ceo\b|chief revenue|\bvp\b.{0,20}sales|head of sales|vp revenue|director of sales|chief sales|head of revenue|revenue leader/i;

const T2_KEYWORDS = /salesforce|hubspot|outreach|salesloft|gong|chorus|clari|zoominfo|apollo|sales engineer|account executive|sales manager|sales director|revenue operations|sales ops|bizdev|business development/i;

const T3_KEYWORDS = /account manager|customer success|sales enablement|partnerships|channel sales|inside sales|sdr manager|bdr manager|sales coordinator|sales analyst/i;

const EXCL_KEYWORDS = /\bretired\b|chief financial|\bcfo\b|chief technology|\bcto\b|board member|real estate|talent acquisition|\brecruiter\b|software engineer|program manager|project manager|\baccountant\b|\blawyer\b|\battorney\b|\bstudent\b|\bintern\b|data scientist|ml engineer|devops|solutions architect|chief operating|\bcoo\b/i;
```

---

## Example: HR Tech / People Ops Platform

```javascript
const T1_KEYWORDS = /\bchro\b|chief people|chief hr|head of people|vp people|head of hr|\bvp\b.{0,20}hr|people director|director of people|director of hr|head of talent|vp talent/i;

const T2_KEYWORDS = /workday|bamboohr|rippling|lattice|culture amp|leapsome|greenhouse|lever|ashby|hris|people ops|hr business partner|hrbp|talent acquisition lead|people partner|hr director|people analytics/i;

const T3_KEYWORDS = /hr manager|people manager|talent manager|recruiter|recruiting manager|learning and development|l&d manager|compensation|total rewards|employee experience|hr generalist/i;

const EXCL_KEYWORDS = /\bretired\b|chief financial|\bcfo\b|chief technology|\bcto\b|board member|real estate|software engineer|data scientist|ml engineer|devops|solutions architect|\bstudent\b|\bintern\b|chief operating|\bcoo\b/i;
```

---

## Also Update These (Optional but Recommended)

After changing your keywords, these three places in the codebase reference the original ecomm framing:

| File | What to Update | Search For |
|------|---------------|------------|
| `icp-finder.html` | Tier description cards in the UI | `"T1 — Decision Makers"` |
| `dashboard.html` | Scorecard benchmark commentary | `"Shopify growth agency"` |
| `dashboard.html` | Demo persona name and company | `"Alex Chen"` and `"ShopBoost Agency"` |

These are display text only — they don't affect the classification logic.

---

## Tips

- **Start broad, then tighten.** Run the classifier, check your T1 results, and remove any titles that don't belong. Add `|` entries to `EXCL_KEYWORDS` for noisy job titles you want to exclude.
- **T2 is your secret weapon.** If you know the specific tools your buyers use, adding them here surfaces people in your ecosystem even when their title isn't obvious (e.g., a "Senior Consultant" at Klaviyo is still ecosystem).
- **Test incrementally.** After each edit, upload and run a small CSV through the tool to verify the classifications look right before doing a full export.
- **Regex tip:** Use [regex101.com](https://regex101.com) to test your patterns before pasting them in. Select "JavaScript" mode and paste one of the constant values to verify matches.
