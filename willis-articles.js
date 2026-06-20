/* Willis help wiki — seed article set (launch). Expand over time.
   Each: {id, title, cat, k:keywords, body:HTML}. Plain, scannable, one job each. */
window.WILLIS_ARTICLES = [

/* ---- Start here ---- */
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

/* ---- Get your data ---- */
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

{ id:"load-methods", title:"3 ways to load your data", cat:"Get your data",
  k:"load upload data zip folder csv choose files select",
  body:`<ul>
    <li><b>Drag the zip</b> onto the box — works in any browser.</li>
    <li><b>"Select Export Folder"</b> — one-click folder picker (Chrome/Edge only).</li>
    <li><b>"Choose CSV Files"</b> — pick the CSVs manually (any browser).</li>
  </ul>
  <p>Just exploring? Hit <b>Try Demo</b> to see everything with sample data — no upload needed.</p>` },

/* ---- ICP Finder ---- */
{ id:"icp-scoring", title:"How contacts are scored — T1 / T2 / T3", cat:"ICP Finder",
  k:"icp scoring tier t1 t2 t3 decision maker ecosystem adjacent keyword classify",
  body:`<p>Every connection is auto-classified by matching its <b>job title and company</b> against a built-in keyword list — the default ICP for Shopify DTC growth agencies:</p>
  <ul>
    <li><b>T1 · Decision Maker</b> — founders &amp; marketing leaders (title only).</li>
    <li><b>T2 · Ecosystem</b> — ecommerce tools &amp; partners (title + company).</li>
    <li><b>T3 · Adjacent</b> — broader marketing roles (title only).</li>
  </ul>
  <p><b>First match wins;</b> no match = the contact is left out of the results. It's a fixed starting point — see "Customize your ICP keywords" to make it yours.</p>` },

{ id:"customize-icp", title:"Customize your ICP keywords", cat:"ICP Finder",
  k:"customize edit keywords icp tier change tailor build",
  body:`<p>The tiers are driven by four keyword lists in <code>icp-finder.html</code>. Editing them adapts the tool to any industry.</p>
  <p>👉 <a href="https://github.com/rsharma-oss/LinkedIn-outreach-tool/blob/main/ICP-CUSTOMIZATION.md" target="_blank" rel="noopener">Edit the keywords yourself ↗</a></p>
  <p>Want it done for you? <a href="demo.html">Book time and we'll build your custom ICP →</a></p>` },

{ id:"export-icp-csv", title:"Export your ICP contacts to CSV", cat:"ICP Finder",
  k:"export csv download contacts icp list save",
  body:`<p>Once your data's loaded in the ICP Finder, use <b>⬇ Export CSV</b> in the header to download your filtered contacts — name, title, company, tier, recency, and engagement.</p>` },

/* ---- Privacy ---- */
{ id:"data-safe", title:"Is my data safe?", cat:"Privacy",
  k:"safe privacy security server upload data collect tracking",
  body:`<p><b>Yes — and you don't have to take our word for it.</b> This is a static page on GitHub Pages. <b>There is no server. It physically cannot receive your data.</b> Everything runs in your browser and disappears when you close the tab.</p>
  <p>Verify it yourself: open <b>DevTools → Network</b> and load your data — you'll see fonts and chart libraries, and nothing else. Or <b>View Source</b> — no upload calls, no tracking.</p>` },

{ id:"run-offline", title:"Run it offline (with Wi-Fi off)", cat:"Privacy",
  k:"offline wifi off download standalone bundle no internet",
  body:`<p>Don't believe the "no server" promise? Download the <b>offline versions</b> of the Dashboard and ICP Finder — single HTML files with everything bundled in. Open them, turn off your internet, and load your data. If anything were being sent anywhere, it would fail. It doesn't.</p>` },

/* ---- Browser & device ---- */
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
  body:`<p>Use the <b>🌙 / ☀️</b> button in the header to switch themes. Your choice is remembered across pages and visits. Dark is the default.</p>` }

];
