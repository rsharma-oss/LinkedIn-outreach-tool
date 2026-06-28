/* Willis help wiki — full article set (40). Expanded from the 14-article launch seed.
   Each: {id, title, cat, k:keywords, body:HTML}. Plain, scannable, one job each.
   Categories (browse order): Start here · Get your data · Loading your data · Dashboard ·
   ICP Finder · Outreach Playbook · Privacy · Browser & device · Reference · Help & feedback. */
window.WILLIS_ARTICLES = [

/* ──────────────── Start here ──────────────── */
{ id:"what-is-toolkit", title:"What is the LinkedIn Toolkit?", cat:"Start here",
  k:"what is toolkit overview about intro three tools summary",
  body:`<p>It's a set of <b>three free, private tools</b> that turn your LinkedIn data export into something useful:</p>
  <ul>
    <li><b>📊 Dashboard</b> — analytics on your whole network.</li>
    <li><b>🎯 ICP Finder</b> — scores every connection so you know who to reach out to.</li>
    <li><b>📋 Playbook</b> — a priority queue + ready-to-send message templates.</li>
  </ul>
  <p>No account, no cost, and <b>nothing leaves your browser</b>. Built for B2B teams who do outreach on LinkedIn, and it works for any network.</p>` },

{ id:"which-tool-first", title:"Which tool should I use first?", cat:"Start here",
  k:"start first which tool order flow dashboard icp playbook begin",
  body:`<p>Three tools, one simple flow:</p>
  <ol>
    <li><b>📊 Dashboard</b> — see your whole network at a glance (growth, engagement, top contacts).</li>
    <li><b>🎯 ICP Finder</b> — score every connection into tiers and find who to reach out to first.</li>
    <li><b>📋 Playbook</b> — get a priority queue + ready-to-send message templates.</li>
  </ol>
  <p>New here? Start with the <b>Dashboard</b> to get the lay of the land, then jump to the <b>ICP Finder</b>.</p>` },

{ id:"do-i-pay", title:"Do I need to pay or make an account?", cat:"Start here",
  k:"pay price cost free account login signup money",
  body:`<p><b>No.</b> All three tools are free, and there's no account or login. Nothing to sign up for — just load your data and go.</p>` },

{ id:"setup-time", title:"How long does setup take?", cat:"Start here",
  k:"how long setup time fast quick minutes",
  body:`<p>About <b>5 minutes</b> once you have your LinkedIn export. The tools load instantly — the only wait is LinkedIn emailing you the export (up to 24h).</p>` },

/* ──────────────── Get your data ──────────────── */
{ id:"export-data", title:"How to export your LinkedIn data", cat:"Get your data",
  k:"export download get data zip archive settings privacy request",
  body:`<ol>
    <li>Go to <b>LinkedIn → Settings → Data Privacy → <a href="https://www.linkedin.com/mypreferences/d/download-my-data" target="_blank" rel="noopener">Get a copy of your data ↗</a></b></li>
    <li>Select <b>all data</b>, then click <b>"Request archive."</b></li>
    <li>Wait for the email (up to 24h) and download the <b>.zip</b>.</li>
    <li>Drag the zip straight onto the upload box — no unzipping needed.</li>
  </ol>` },

{ id:"two-zip-files", title:"LinkedIn sent me two zip files — what's the difference?", cat:"Get your data",
  k:"two zip files basic complete difference 24 72 hours which",
  body:`<p>One request triggers two files, arriving at different times:</p>
  <p><b>Basic export</b> (within 24h) — your <b>Connections</b> and <b>Messages</b>. Enough for the ICP Finder and Playbook. Start here as soon as it lands.</p>
  <p><b>Complete export</b> (within 72h) — adds Reactions, Comments, Posts, Invitations, and profile history. Load this into the <b>Dashboard</b> for full analytics.</p>` },

{ id:"which-files", title:"Which files does each tool need?", cat:"Get your data",
  k:"files csv which need connections messages reactions required minimum",
  body:`<p>You can drop the whole export and each tool grabs what it needs:</p>
  <ul>
    <li><b>🎯 ICP Finder &amp; 📋 Playbook</b> — just <code>Connections.csv</code> + <code>messages.csv</code> (the Basic export).</li>
    <li><b>📊 Dashboard</b> — the above <i>plus</i> <code>Reactions</code>, <code>Comments</code>, <code>Shares</code>, <code>Invitations</code>, <code>Member_Follows</code>, <code>Profile</code> &amp; <code>Positions</code> (the Complete export) for the Engagement &amp; Content tabs.</li>
  </ul>
  <p>Missing the activity files? Connections and Messages still work — only the engagement charts stay empty.</p>` },

/* ──────────────── Loading your data ──────────────── */
{ id:"load-methods", title:"3 ways to load your data", cat:"Loading your data",
  k:"load upload data zip folder csv choose files select",
  body:`<ul>
    <li><b>Drag the zip</b> onto the box — works in any browser.</li>
    <li><b>"Select Export Folder"</b> — one-click folder picker (Chrome/Edge only).</li>
    <li><b>"Choose CSV Files"</b> — pick the CSVs manually (any browser).</li>
  </ul>
  <p>Just exploring? Hit <b>Try with sample data</b> to see everything with a demo network — no upload needed.</p>` },

{ id:"try-demo", title:"Try it first with sample data", cat:"Loading your data",
  k:"demo sample data try test explore example no upload preview",
  body:`<p>Not ready to load your own export? Click <b>✨ Try with sample data</b> on any tool's load screen. It fills the whole tool with a realistic demo network so you can click around — no upload, nothing stored. Load your own data whenever you're ready.</p>` },

{ id:"data-persistence", title:"Does my data stick around between tools?", cat:"Loading your data",
  k:"data stick stay persist session storage close tab reload remember reuse",
  body:`<p>Load once, use everywhere — <b>in the same tab</b>. Your parsed data is kept in the browser's <b>sessionStorage</b>, so moving from the Dashboard to the ICP Finder to the Playbook doesn't ask you to re-upload.</p>
  <p>It <b>clears when you close the tab</b> (that's the privacy promise). Opening a tool in a brand-new tab starts fresh.</p>` },

{ id:"empty-data", title:"My charts or tabs are empty — what's wrong?", cat:"Loading your data",
  k:"empty blank charts zero data not loading missing troubleshoot engagement content problem",
  body:`<p>A few common causes:</p>
  <ul>
    <li><b>Only the Basic export loaded</b> — Engagement &amp; Content need the Complete export (Reactions/Comments/Shares). Connections &amp; Messages will still show.</li>
    <li><b>Loaded on the ICP Finder, then opened the Dashboard</b> — load your full export on the Dashboard itself for the activity charts.</li>
    <li><b>Non-English export</b> — the tools currently read English column headers. Switch your LinkedIn language to English and re-download.</li>
    <li><b>Wrong folder</b> — make sure you picked the unzipped export folder (the one with <code>Connections.csv</code> inside).</li>
  </ul>` },

{ id:"storage-full", title:'"Storage full" on a large network', cat:"Loading your data",
  k:"storage full quota large 10000 connections safari chrome limit error big",
  body:`<p>Browsers cap how much a single tab can hold. <b>Safari is ~5MB; Chrome is ~10MB.</b> Very large networks (10k+ connections with full message history) can hit Safari's limit.</p>
  <p>Fix: use <b>Chrome or Edge</b>, which have more headroom. Everything still runs locally either way.</p>` },

/* ──────────────── Dashboard ──────────────── */
{ id:"dashboard-tour", title:"Dashboard tour — the 6 tabs", cat:"Dashboard",
  k:"dashboard tour tabs overview network engagement content messages connections guide",
  body:`<p>The Dashboard has six tabs:</p>
  <ol>
    <li><b>Overview</b> — headline stats + 3 summary charts.</li>
    <li><b>Network</b> — growth, top companies &amp; titles.</li>
    <li><b>Engagement</b> — reactions, comments, posts over time.</li>
    <li><b>Content</b> — your posting scorecard &amp; themes.</li>
    <li><b>Messages</b> — sent vs received, top contacts.</li>
    <li><b>Connections Table</b> — search, filter &amp; sort everyone.</li>
  </ol>` },

{ id:"network-tab", title:"Network tab — growth, companies, titles", cat:"Dashboard",
  k:"network tab growth companies titles connections per month day of week top 20",
  body:`<p>Five charts that map who's in your network:</p>
  <ul>
    <li><b>Cumulative Network Growth</b> — total connections over time.</li>
    <li><b>New Connections Per Month</b> (last 24 months).</li>
    <li><b>Connected On — Day of Week.</b></li>
    <li><b>Top 20 Companies</b> in your network.</li>
    <li><b>Top 20 Job Titles</b> in your network.</li>
  </ul>` },

{ id:"engagement-tab", title:"Engagement tab — reactions, comments, posts", cat:"Dashboard",
  k:"engagement tab reactions comments posts day of week reaction types follows activity",
  body:`<p>How active you've been:</p>
  <ul>
    <li><b>Monthly Engagement Volume</b> (all time).</li>
    <li><b>Engagement by Month This Year.</b></li>
    <li><b>Activity by Day of Week.</b></li>
    <li><b>Reaction Types</b> breakdown (👍 ❤️ 👏 …).</li>
    <li><b>People You Follow.</b></li>
  </ul>
  <p>Needs the <b>Complete export</b> (Reactions / Comments / Shares). Empty here? See "Which files does each tool need?"</p>` },

{ id:"content-scorecard", title:"The Content Strategy Scorecard", cat:"Dashboard",
  k:"content scorecard cadence consistency length variety score posts target publishing",
  body:`<p>A 0–100 score for your posting habit, built from four targets:</p>
  <ul>
    <li><b>Publishing Cadence</b> — aim for <b>≥ 10 posts/month</b>.</li>
    <li><b>Week Consistency</b> — <b>≥ 75%</b> of weeks with at least one post.</li>
    <li><b>Content Length Quality</b> — <b>≥ 60%</b> of posts in the optimal <b>300–1,200 character</b> range.</li>
    <li><b>Topic Variety</b> — <b>≥ 3 themes/month</b>.</li>
  </ul>
  <p>Each gets a 🟢/🟡/🔴 rating, rolled into one overall score.</p>` },

{ id:"content-themes", title:"How your posts get themed", cat:"Dashboard",
  k:"content themes categories topic breakdown industry product ai classify posts",
  body:`<p>Each post is auto-tagged by keyword into one of seven themes:</p>
  <p><b>Industry/Product · Growth/Marketing · Agency/Business · AI/Automation · Thought Leadership · Personal/Story · Other.</b></p>
  <p>The <b>Content Theme Breakdown</b> chart shows your mix, so you can see whether you're leaning on one topic or spreading across several (variety counts toward the scorecard).</p>` },

{ id:"messages-tab", title:"Messages tab — sent vs received, top contacts", cat:"Dashboard",
  k:"messages tab sent received top contacts conversations day of week reply",
  body:`<p>Your DM activity:</p>
  <ul>
    <li><b>Messages Per Month</b> over time.</li>
    <li><b>Sent vs Received</b> (last 12 months) — see if you're starting or just replying.</li>
    <li><b>Messaging Day of Week.</b></li>
    <li><b>Top Contacts</b> — who you message most, with counts.</li>
  </ul>
  <p>Needs <code>messages.csv</code> from your export.</p>` },

{ id:"connections-table", title:"Connections table — search, filter, sort", cat:"Dashboard",
  k:"connections table search filter sort company year paginate browse find",
  body:`<p>The full, searchable list of everyone you're connected to:</p>
  <ul>
    <li><b>Search</b> by name, company, or title.</li>
    <li><b>Filter by company</b> — type to search the dropdown, or browse by letter.</li>
    <li><b>Filter by connection year.</b></li>
    <li><b>Sort</b> any column (name, company, title, date) and page through 50 at a time.</li>
  </ul>` },

/* ──────────────── ICP Finder ──────────────── */
{ id:"what-is-icp", title:"What is the ICP Finder?", cat:"ICP Finder",
  k:"icp finder what is ideal customer profile classify tiers who reach out prioritize",
  body:`<p>ICP = <b>Ideal Customer Profile</b>. The ICP Finder reads your connections and <b>auto-sorts them into tiers</b> (T1 / T2 / T3) by job title and company, so instead of scrolling 3,000 contacts you get a ranked list of who's actually worth reaching out to.</p>
  <p>It also scores each contact by <b>recency</b> and <b>engagement</b> so you can prioritise fresh, warm relationships.</p>` },

{ id:"icp-scoring", title:"How contacts are scored — T1 / T2 / T3", cat:"ICP Finder",
  k:"icp scoring tier t1 t2 t3 decision maker ecosystem adjacent keyword classify",
  body:`<p>Every connection is auto-classified by matching its <b>job title and company</b> against a built-in keyword list — the default ICP for B2B teams who do outreach on LinkedIn:</p>
  <ul>
    <li><b>T1 · Decision Maker</b> — founders &amp; decision-makers (title only).</li>
    <li><b>T2 · Ecosystem</b> — ecosystem tools &amp; partners (title + company).</li>
    <li><b>T3 · Adjacent</b> — broader adjacent roles (title only).</li>
  </ul>
  <p><b>First match wins;</b> no match = the contact is left out of the results. It's a fixed starting point — see "Customize your ICP keywords" to make it yours.</p>` },

{ id:"recency-scoring", title:"Recency scoring — New / Fresh / Warm / Cold", cat:"ICP Finder",
  k:"recency new fresh warm cold days since connected date scoring how recent",
  body:`<p>How recently you connected, from the connection date:</p>
  <ul>
    <li><b>🟢 New</b> — under 30 days</li>
    <li><b>🟡 Fresh</b> — 30–90 days</li>
    <li><b>⚪ Warm</b> — 90 days to 1 year</li>
    <li><b>⬇ Cold</b> — over a year</li>
  </ul>
  <p>New connections are the easiest to message — they remember why they connected.</p>` },

{ id:"engagement-scoring", title:"Engagement scoring — Active / Warm / Cold / Never", cat:"ICP Finder",
  k:"engagement active warm cold never messaged message history scoring conversation",
  body:`<p>Based on the last time you messaged them (needs <code>messages.csv</code>):</p>
  <ul>
    <li><b>Active</b> — messaged under 90 days ago</li>
    <li><b>Warm</b> — messaged under a year ago</li>
    <li><b>Cold</b> — messaged over a year ago</li>
    <li><b>Never</b> — no message history</li>
  </ul>
  <p>No messages loaded? Everyone shows as "Never" — load the Basic export to fix it.</p>` },

{ id:"filter-sort-icp", title:"Filter & sort your ICP list", cat:"ICP Finder",
  k:"filter sort icp tier recency engagement column table narrow",
  body:`<p>Slice the list to find exactly who you want:</p>
  <ul>
    <li><b>Filter</b> by Tier, Recency, or Engagement.</li>
    <li><b>Sort</b> any column — name, title, company, tier, connected date, recency, engagement.</li>
    <li>Pages through 50 at a time, with a live count of matches.</li>
  </ul>
  <p>Example: Tier = T1 + Recency = New → your hottest leads, top of the list.</p>` },

{ id:"export-icp-csv", title:"Export your ICP contacts to CSV", cat:"ICP Finder",
  k:"export csv download contacts icp list save spreadsheet",
  body:`<p>Once your data's loaded in the ICP Finder, use <b>⬇ Export CSV</b> in the header to download your filtered contacts — name, title, company, tier, recency, and engagement.</p>` },

{ id:"customize-icp", title:"Customize your ICP keywords", cat:"ICP Finder",
  k:"customize edit keywords icp tier change tailor build industry vertical preset picker",
  body:`<p>Open <b>✏️ Customize keywords</b> on the ICP Finder (in the "How these tiers are scored" box). Two ways to tailor it:</p>
  <ul>
    <li><b>Pick from your network</b> — see every job title &amp; company you actually have, tick the ones that fit, and assign them to a tier. Start on <b>Unmatched</b> to grab who the default ICP missed.</li>
    <li><b>Edit keyword lists</b> — type keywords per tier (T1 / T2 / T3) if you prefer.</li>
  </ul>
  <p>Or <b>start from a vertical</b> (B2B SaaS, Telecom, Financial Services…) to load a ready-made ICP, then refine. Everything re-tiers instantly and saves to your browser only.</p>
  <p>Want it built for you? <a href="demo.html">Book time and we'll build your custom ICP →</a></p>` },

{ id:"icp-config", title:"Load an ICP config we built for you", cat:"ICP Finder",
  k:"load save config json file import export icp custom built shared retarget",
  body:`<p>If we've built a custom ICP for your business, you'll get a small <b>.json config file</b>. Open <b>✏️ Customize keywords → ⬆ Load config</b>, pick the file, and your whole tool retargets to that ICP instantly — tiers, labels and all.</p>
  <p>It's just keyword text (no contact data), so it's safe to keep and share. Built your own? <b>⬇ Save config</b> downloads it to reuse or hand off.</p>` },

{ id:"icp-pick-network", title:"Build your ICP from your own network", cat:"ICP Finder",
  k:"pick network titles companies multi select unmatched tier assign customize",
  body:`<p>The customizer lets you <b>pick the job titles and companies you actually have</b> (each with a count) instead of guessing keywords.</p>
  <p>Start on <b>Pick from your network → Unmatched</b> to grab the people the default ICP missed; switch to <b>Companies</b> to add whole organisations to T2 (great for industry ICPs — e.g. add the carriers for a telecom ICP). Tick, assign to a tier, save.</p>` },

/* ──────────────── Outreach Playbook ──────────────── */
{ id:"playbook-overview", title:"What's in the Playbook?", cat:"Outreach Playbook",
  k:"playbook outreach priority queue templates cadence what overview",
  body:`<p>The Playbook turns your ICP data into an <b>action plan</b>:</p>
  <ul>
    <li>A <b>priority queue</b> — who to message, in what order.</li>
    <li><b>7 message templates</b> for each situation.</li>
    <li>A suggested <b>cadence</b> so outreach stays consistent.</li>
  </ul>
  <p>It runs off the data the ICP Finder builds — open the ICP Finder once, then the Playbook goes live.</p>` },

{ id:"priority-tiers", title:"Outreach priority tiers — Hot / Warm / Cool / T2", cat:"Outreach Playbook",
  k:"priority hot warm cool t2 caps queue who message now this week re-engage",
  body:`<p>Contacts are grouped into four prioritised buckets (with sensible caps so you don't burn out):</p>
  <ul>
    <li><b>🔥 Hot</b> — T1 connected in the last 30 days (cap 20) → <b>message now</b>.</li>
    <li><b>🌤 Warm</b> — T1 connected 30–90 days ago (cap 15) → <b>this week</b>.</li>
    <li><b>❄️ Cool</b> — T1 connected 3+ months ago (cap 30) → <b>re-engage</b>.</li>
    <li><b>🔗 T2 Ecosystem</b> — partners &amp; tools (cap 20).</li>
  </ul>` },

{ id:"templates", title:"The 7 message templates", cat:"Outreach Playbook",
  k:"templates messages 7 t1 t1b t2 follow up re-engage copy paste outreach",
  body:`<p>One for each moment, all one-click copy:</p>
  <ul>
    <li><b>T1 — Warm opener</b> — short, no pitch.</li>
    <li><b>T1 — Insight opener</b> — lead with a data/observation hook.</li>
    <li><b>T2 — Partner intro</b> — peer-to-peer positioning.</li>
    <li><b>Follow-Up #1</b> — no reply after 5–7 days.</li>
    <li><b>Follow-Up #2</b> — the polite break-up message.</li>
    <li><b>Re-engage — Cold</b> — a connection 1yr+ silent.</li>
    <li><b>Re-engage — Lapsed</b> — a conversation that went quiet.</li>
  </ul>` },

{ id:"personalize-send", title:"How to personalize & send", cat:"Outreach Playbook",
  k:"personalize send copy template placeholders linkedin outreach edit fill",
  body:`<ol>
    <li>Pick the template that fits the contact's tier &amp; situation.</li>
    <li>Hit <b>📋 Copy</b>.</li>
    <li>Swap the <code>[placeholders]</code> for their name, company, and a specific detail.</li>
    <li>Paste it into LinkedIn and send.</li>
  </ol>
  <p>The tool never messages anyone for you — <b>you</b> send everything, so it stays personal (and within LinkedIn's rules).</p>` },

/* ──────────────── Privacy ──────────────── */
{ id:"data-safe", title:"Is my data safe?", cat:"Privacy",
  k:"safe privacy security server upload data collect tracking",
  body:`<p><b>Yes — and you don't have to take our word for it.</b> This is a static page on GitHub Pages. <b>There is no server. It physically cannot receive your data.</b> Everything runs in your browser and disappears when you close the tab.</p>
  <p>Verify it yourself: open <b>DevTools → Network</b> and load your data — you'll see fonts and chart libraries, and nothing else. Or <b>View Source</b> — no upload calls, no tracking.</p>` },

{ id:"verify-yourself", title:"Verify the privacy promise yourself", cat:"Privacy",
  k:"verify privacy devtools network view source github proof check no server inspect",
  body:`<p>Three ways to prove nothing's being sent:</p>
  <ul>
    <li><b>DevTools → Network</b> — load your data and watch: only fonts &amp; chart libraries load, no upload of your CSVs.</li>
    <li><b>View Source</b> — there's no API endpoint, no analytics, no tracking pixel.</li>
    <li><b>Read the code</b> — it's open on <a href="https://github.com/rsharma-oss/LinkedIn-outreach-tool" target="_blank" rel="noopener">GitHub ↗</a>.</li>
  </ul>
  <p>Still want belt-and-suspenders? See "Run it offline".</p>` },

{ id:"run-offline", title:"Run it offline (with Wi-Fi off)", cat:"Privacy",
  k:"offline wifi off download standalone bundle no internet airplane",
  body:`<p>Don't believe the "no server" promise? Download the <b>offline versions</b> of the Dashboard and ICP Finder — single HTML files with everything bundled in. Open them, turn off your internet, and load your data. If anything were being sent anywhere, it would fail. It doesn't.</p>` },

/* ──────────────── Browser & device ──────────────── */
{ id:"why-mobile", title:"Why doesn't this work on my phone?", cat:"Browser & device",
  k:"phone mobile desktop laptop ipad why folder picker tablet",
  body:`<p>These are <b>desktop tools by design</b> — dense dashboards, big tables, and 18 charts that need real screen width.</p>
  <p>There's also a hard reason: loading your export uses the browser's folder/file picker (the File System Access API), which <b>mobile browsers don't support.</b> Read and explore on a phone, but load your own data on a laptop or desktop.</p>` },

{ id:"why-safari", title:"Why Chrome or Edge over Safari?", cat:"Browser & device",
  k:"safari chrome edge firefox browser storage recommend best",
  body:`<p>It works in Safari and Firefox too — Chrome/Edge just give the smoothest path:</p>
  <ol>
    <li><b>One-click folder upload</b> — the "Select Export Folder" picker is Chrome/Edge-only. In Safari/Firefox you pick the CSV files manually instead.</li>
    <li><b>Storage headroom</b> — Safari caps per-tab storage (~5MB) lower than Chrome (~10MB), so very large networks (10k+ connections) can hit the limit.</li>
  </ol>
  <p>Either way, nothing ever leaves your browser.</p>` },

{ id:"light-dark", title:"Light & dark mode", cat:"Browser & device",
  k:"light dark mode theme toggle color switch",
  body:`<p>Use the <b>🌙 / ☀️</b> button in the header to switch themes. Your choice is remembered across pages and visits. Dark is the default.</p>` },

/* ──────────────── Reference ──────────────── */
{ id:"glossary", title:"Glossary — the terms in plain English", cat:"Reference",
  k:"glossary terms definitions icp tier recency engagement cadence dictionary meaning dtc",
  body:`<ul>
    <li><b>ICP</b> — Ideal Customer Profile; the kind of person you want to reach.</li>
    <li><b>T1 / T2 / T3</b> — tiers: Decision Maker / Ecosystem / Adjacent.</li>
    <li><b>Recency</b> — how long ago you connected (New → Cold).</li>
    <li><b>Engagement</b> — how recently you messaged them (Active → Never).</li>
    <li><b>Cadence</b> — how consistently you post or reach out.</li>
    <li><b>DTC</b> — Direct-to-Consumer; brands that sell straight to shoppers.</li>
    <li><b>Hot / Warm / Cool</b> — outreach priority buckets in the Playbook.</li>
  </ul>` },

/* ──────────────── Help & feedback ──────────────── */
{ id:"report-bug", title:"Report a bug or request a feature", cat:"Help & feedback",
  k:"report bug feedback feature request help issue contact email broken problem",
  body:`<p>Hit the <b>🐞 Report</b> button in the header (on every tool). It opens a pre-filled message you can <b>Copy</b>, open in <b>Gmail</b>, or send from your <b>mail app</b> — whichever you use.</p>
  <p>It auto-attaches harmless diagnostics (browser, screen, theme) but <b>no LinkedIn data</b>. Couldn't find an answer here in Willis? There's a "tell us what you needed" button on the no-results screen too.</p>` },

{ id:"book-demo", title:"Get your ICP built for you / book a demo", cat:"Help & feedback",
  k:"book demo help build icp custom done for you contact call growth automated",
  body:`<p>Don't want to edit keyword lists yourself? <a href="demo.html">Book time with us →</a> and we'll build a <b>custom ICP</b> tuned to your business, plus walk you through the outreach plan.</p>` },

{ id:"whats-new", title:"What's new?", cat:"Help & feedback",
  k:"whats new release notes changelog updates version latest changes history",
  body:`<p>See everything we've shipped — fixes, features, and improvements — in the <a href="https://github.com/rsharma-oss/LinkedIn-outreach-tool/blob/main/RELEASE_NOTES.md" target="_blank" rel="noopener">Release Notes ↗</a>.</p>` }

];
