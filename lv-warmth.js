/* LinkVault — relationship warmth engine (shared by ICP Finder + Dashboard).
   Turns the export's *relationship* files into a per-person warmth signal, so a connection
   stops being a row and becomes "someone you actually know, and here's why".

   Reads (all optional — every signal degrades gracefully):
     Endorsement_Given_Info.csv     — people YOU endorsed, and for which skill
     Endorsement_Received_Info.csv  — people who endorsed YOU
     Recommendations_Given.csv      — you wrote them a recommendation (strongest tie)
     Recommendations_Received.csv   — they wrote you one
     Company Follows.csv            — companies you follow (account-level affinity)

   Join key: normalised LinkedIn public URL (verified 309/311 + 122/122 on a real export),
   falling back to normalised full name so nothing is lost when a URL is absent.
   Everything stays in memory — this module never touches the network. */
window.LVWarmth = (function () {
  var IDX = {};            // key → signals
  var EV = [];             // {date, dir:'given'|'received', skill} — for dashboard aggregates
  var FOLLOWED = new Set();// normalised company names you follow
  var BUILT = false;

  function normUrl(u) {
    u = (u || '').trim().toLowerCase();
    if (!u) return '';
    u = u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
    return u.indexOf('linkedin.com/in/') === 0 ? u : '';
  }
  function normName(n) { return (n || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function normCo(c) {
    return (c || '').trim().toLowerCase()
      .replace(/[.,]/g, '')
      .replace(/\s+(inc|llc|ltd|limited|corp|corporation|co|company|plc|sa|nv|gmbh|group|holdings)$/g, '')
      .trim();
  }
  function keys(url, name) {
    var out = [], u = normUrl(url), n = normName(name);
    if (u) out.push('u:' + u);
    if (n) out.push('n:' + n);
    return out;
  }
  function slot(url, name) {
    var ks = keys(url, name), rec = null;
    for (var i = 0; i < ks.length; i++) if (IDX[ks[i]]) { rec = IDX[ks[i]]; break; }
    if (!rec) rec = { endorsedThem: [], endorsedYou: [], recGiven: false, recReceived: false };
    ks.forEach(function (k) { IDX[k] = rec; });   // alias every key to the same record
    return rec;
  }
  function rows(text) {
    if (!text || typeof Papa === 'undefined') return [];
    try { return (Papa.parse(text.trim(), { header: true, skipEmptyLines: true }).data) || []; }
    catch (e) { return []; }
  }

  function build(filemap) {
    IDX = {}; FOLLOWED = new Set(); EV = []; BUILT = false;
    filemap = filemap || {};

    rows(filemap['Endorsement_Given_Info.csv']).forEach(function (r) {
      if ((r['Endorsement Status'] || 'ACCEPTED').toUpperCase().indexOf('ACCEPT') !== 0) return;
      var s = slot(r['Endorsee Public Url'], (r['Endorsee First Name'] || '') + ' ' + (r['Endorsee Last Name'] || ''));
      var sk = (r['Skill Name'] || '').trim();
      if (sk && s.endorsedThem.indexOf(sk) < 0) s.endorsedThem.push(sk);
      EV.push({ date: r['Endorsement Date'] || '', dir: 'given', skill: sk });
    });
    rows(filemap['Endorsement_Received_Info.csv']).forEach(function (r) {
      if ((r['Endorsement Status'] || 'ACCEPTED').toUpperCase().indexOf('ACCEPT') !== 0) return;
      var s = slot(r['Endorser Public Url'], (r['Endorser First Name'] || '') + ' ' + (r['Endorser Last Name'] || ''));
      var sk = (r['Skill Name'] || '').trim();
      if (sk && s.endorsedYou.indexOf(sk) < 0) s.endorsedYou.push(sk);
      EV.push({ date: r['Endorsement Date'] || '', dir: 'received', skill: sk });
    });
    rows(filemap['Recommendations_Given.csv']).forEach(function (r) {
      slot('', (r['First Name'] || '') + ' ' + (r['Last Name'] || '')).recGiven = true;
    });
    rows(filemap['Recommendations_Received.csv']).forEach(function (r) {
      slot('', (r['First Name'] || '') + ' ' + (r['Last Name'] || '')).recReceived = true;
    });
    rows(filemap['Company Follows.csv']).forEach(function (r) {
      var o = normCo(r['Organization']); if (o) FOLLOWED.add(o);
    });
    BUILT = true;
    return module.stats();
  }

  /* Warmth for one contact. msgCount/lastMsgDays come from the caller's existing message data
     so messaging still counts — endorsements simply add a second, independent axis (and a much
     smaller one, which matters when messages.csv is too big for Safari's storage quota). */
  function get(contact) {
    if (!BUILT) return null;
    var c = contact || {};
    var ks = keys(c.url, c.name), rec = null;
    for (var i = 0; i < ks.length; i++) if (IDX[ks[i]]) { rec = IDX[ks[i]]; break; }
    var followsCo = !!(c.company && FOLLOWED.has(normCo(c.company)));
    rec = rec || { endorsedThem: [], endorsedYou: [], recGiven: false, recReceived: false };

    var score = 0, reasons = [];
    if (rec.recReceived) { score += 45; reasons.push({ icon: '🏆', text: 'They wrote you a recommendation' }); }
    if (rec.recGiven)    { score += 40; reasons.push({ icon: '✍️', text: 'You wrote them a recommendation' }); }
    if (rec.endorsedYou.length) {
      score += 25 + Math.min(10, rec.endorsedYou.length * 2);
      reasons.push({ icon: '⭐', text: 'They endorsed you for ' + rec.endorsedYou.slice(0, 2).join(' & ') +
        (rec.endorsedYou.length > 2 ? ' +' + (rec.endorsedYou.length - 2) : '') });
    }
    if (rec.endorsedThem.length) {
      score += 20 + Math.min(8, rec.endorsedThem.length * 2);
      reasons.push({ icon: '👍', text: 'You endorsed them for ' + rec.endorsedThem.slice(0, 2).join(' & ') +
        (rec.endorsedThem.length > 2 ? ' +' + (rec.endorsedThem.length - 2) : '') });
    }
    if (c.msgCount) {
      score += Math.min(25, 8 + c.msgCount * 2);
      reasons.push({ icon: '💬', text: c.msgCount + ' message' + (c.msgCount === 1 ? '' : 's') +
        (c.lastMsgDays != null ? ' · last ' + (c.lastMsgDays < 60 ? 'recently' : Math.round(c.lastMsgDays / 30) + ' months ago') : '') });
    }
    if (followsCo) { score += 6; reasons.push({ icon: '🏢', text: 'You follow ' + c.company }); }

    var label = score >= 60 ? 'strong' : score >= 25 ? 'warm' : score > 0 ? 'light' : 'cold';
    return {
      score: score, label: label, reasons: reasons,
      mutual: !!(rec.endorsedYou.length && rec.endorsedThem.length) || (rec.recGiven && rec.recReceived),
      followsCompany: followsCo,
      opener: opener(c, rec, followsCo)
    };
  }

  /* A first line you could actually send — grounded in a real shared moment, not a template. */
  function opener(c, rec, followsCo) {
    var first = (c.first || (c.name || '').split(' ')[0] || 'there');
    if (rec.recReceived) return 'Hi ' + first + ' — you wrote me a recommendation a while back, and I still appreciate it. Would love to catch up.';
    if (rec.recGiven)    return 'Hi ' + first + ' — I recommended you back when we worked together. Curious what you’re building now.';
    if (rec.endorsedYou.length) return 'Hi ' + first + ' — thanks again for endorsing me for ' + rec.endorsedYou[0] + '. What are you focused on these days?';
    if (rec.endorsedThem.length) return 'Hi ' + first + ' — I endorsed you for ' + rec.endorsedThem[0] + ' a while ago. How’s that side of the work going?';
    if (c.msgCount)      return 'Hi ' + first + ' — it’s been a while since we spoke. Wanted to reconnect.';
    if (followsCo)       return 'Hi ' + first + ' — I follow what ' + c.company + ' is doing. Would love to compare notes.';
    return '';
  }

  var module = {
    build: build,
    get: get,
    isBuilt: function () { return BUILT; },
    followedCompanies: function () { return Array.from(FOLLOWED); },
    /* Companies you follow AND have connections at — the T2 named-account shortlist. */
    followedWithConnections: function (contacts) {
      var counts = {};
      (contacts || []).forEach(function (c) {
        var co = normCo(c.company); if (!co || !FOLLOWED.has(co)) return;
        if (!counts[c.company]) counts[c.company] = 0;
        counts[c.company]++;
      });
      return Object.keys(counts).map(function (k) { return { company: k, count: counts[k] }; })
        .sort(function (a, b) { return b.count - a.count; });
    },

    /* Skills others endorsed YOU for — what your network thinks you're good at. */
    topSkills: function (n) {
      var c = {};
      EV.forEach(function (e) { if (e.dir === 'received' && e.skill) c[e.skill] = (c[e.skill] || 0) + 1; });
      return Object.keys(c).map(function (k) { return { skill: k, count: c[k] }; })
        .sort(function (a, b) { return b.count - a.count; }).slice(0, n || 8);
    },
    /* Endorsements per year, both directions — when your network was most active. */
    timeline: function () {
      var g = {}, r = {};
      EV.forEach(function (e) {
        var y = (String(e.date).match(/(19|20)\d{2}/) || [])[0];
        if (!y) return;
        if (e.dir === 'given') g[y] = (g[y] || 0) + 1; else r[y] = (r[y] || 0) + 1;
      });
      var years = Object.keys(g).concat(Object.keys(r))
        .filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
      return { years: years,
        given: years.map(function (y) { return g[y] || 0; }),
        received: years.map(function (y) { return r[y] || 0; }) };
    },
    stats: function () {
      var seen = {}, people = 0, eThem = 0, eYou = 0, recs = 0;
      Object.keys(IDX).forEach(function (k) {
        var r = IDX[k]; if (seen[r.__id = r.__id || Math.random()]) return; seen[r.__id] = 1;
        people++;
        if (r.endorsedThem.length) eThem++;
        if (r.endorsedYou.length) eYou++;
        if (r.recGiven || r.recReceived) recs++;
      });
      return { people: people, endorsedThem: eThem, endorsedYou: eYou, recommendations: recs, followed: FOLLOWED.size };
    }
  };
  return module;
})();
