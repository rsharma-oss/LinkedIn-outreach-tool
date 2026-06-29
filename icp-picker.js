/* ICP customization picker — Titles + Companies multi-select (prototype only).
   Loaded after the main icp-finder script; uses its globals (classifyTier, ICP_KW,
   _connRows, reclassify, etc.) and overrides openICPEditor to default to the picker.
   Storage keys come from window.ICP_K (the host page sets them: live → ga_icp_kw / ga_icp_exact,
   prototype → the _proto variants). Falls back to the _proto keys if the page didn't set them. */
window.ICP_K = window.ICP_K || { kw:'ga_icp_kw_proto', exact:'ga_icp_exact_proto', profile:'ga_icp_profile' };
(function(){
  function esc(x){ return String(x).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function tierOf(t){ try { return classifyTier(t, ''); } catch(e){ return null; } }
  function titleIndex(){
    var m={}; (typeof _connRows!=='undefined'?_connRows:[]).forEach(function(r){
      var t=(r['Position']||'').trim(); if(!t) return; var k=t.toLowerCase();
      if(!m[k]) m[k]={name:t,count:0}; m[k].count++;
    });
    return Object.keys(m).map(function(k){ return m[k]; }).sort(function(a,b){ return b.count-a.count; });
  }
  function companyIndex(){
    var m={}; (typeof _connRows!=='undefined'?_connRows:[]).forEach(function(r){
      var t=(r['Company']||'').trim(); if(!t || t==='.') return; var k=t.toLowerCase();
      if(!m[k]) m[k]={name:t,count:0}; m[k].count++;
    });
    return Object.keys(m).map(function(k){ return m[k]; }).sort(function(a,b){ return b.count-a.count; });
  }
  function companyIsEco(co){ try { return T2_KEYWORDS.test((co||'').toLowerCase()); } catch(e){ return false; } }

  var mode='titles', filter='unmatched', sel={};
  var HELP={
    titles:'Click <b>T1 · T2 · T3</b> on any row to put that title in a tier — or <b>✕</b> to exclude it. Counts are from your network; start with <b>Unmatched</b> to grab who the default ICP missed. Changes apply instantly.',
    companies:'Click <b>T2</b> to add a company to your ecosystem tier — or <b>✕</b> to exclude it. Best for industry ICPs (e.g. add the carriers for telecom). Changes apply instantly.'
  };

  function $(id){ return document.getElementById(id); }

  window.setPickMode=function(m){
    mode=m; sel={}; filter=(m==='titles')?'unmatched':'all';
    $('icpmode-titles').classList.toggle('active', m==='titles');
    $('icpmode-companies').classList.toggle('active', m==='companies');
    $('icp-pick-search').placeholder=(m==='titles')?'Search your titles…':'Search your companies…';
    $('icp-pick-help').innerHTML=HELP[m];
    renderChips(); window.renderTitlePicker();
  };
  function renderChips(){
    var chips=(mode==='titles')
      ? [['unmatched','Unmatched'],['all','All'],['t1','T1'],['t2','T2'],['t3','T3']]
      : [['all','All'],['notin','Not in T2'],['in','In T2']];
    $('icp-pick-chips').innerHTML=chips.map(function(c){
      return '<button type="button" class="icp-pchip'+(c[0]===filter?' active':'')+'" data-f="'+c[0]+'" onclick="setPickFilter(\''+c[0]+'\',this)">'+c[1]+'</button>';
    }).join('');
  }
  window.setPickFilter=function(f,btn){
    filter=f;
    [].forEach.call(document.querySelectorAll('.icp-pchip'), function(b){ b.classList.toggle('active', b===btn); });
    window.renderTitlePicker();
  };
  window.setEditorView=function(v){
    var p=$('icp-view-pick'); if(p) p.style.display='block';   // picker always visible (no tabs); lists live in Advanced
    if(v!=='lists') window.renderTitlePicker();
  };
  function companyInT2(co){ try{ return ICP_EXACT.t2.companies.has(normCo(co)) || companyIsEco(co); }catch(e){ return companyIsEco(co); } }
  function isExcl(name){ try{ return mode==='companies' ? ICP_EXACT.excl.companies.has(normCo(name)) : ICP_EXACT.excl.titles.has(normTitle(name)); }catch(e){ return false; } }
  function rowBtns(curTier, excl){  // per-row tier buttons; the current tier (or exclude) is highlighted "on"
    var tiers = (mode==='companies') ? [['t2','T2']] : [['t1','T1'],['t2','T2'],['t3','T3']];
    var b = tiers.map(function(p){ var on=(!excl && curTier && curTier.toLowerCase()===p[0])?' on':''; return '<button type="button" class="icp-asg icp-asg-'+p[0]+on+'" data-tier="'+p[0]+'">'+p[1]+'</button>'; }).join('');
    b += '<button type="button" class="icp-asg icp-asg-x'+(excl?' on':'')+'" data-tier="exclude" title="Exclude from ICP" aria-label="Exclude">✕</button>';
    return '<span class="icp-row-asg">'+b+'</span>';
  }
  window.renderTitlePicker=function(){
    var q=($('icp-pick-search').value||'').toLowerCase(); var H;
    if(mode==='titles'){
      var rows=titleIndex().filter(function(x){
        if(q && x.name.toLowerCase().indexOf(q)<0) return false;
        var t=tierOf(x.name);
        if(filter==='all') return true;
        if(filter==='unmatched') return !t && !isExcl(x.name);
        return t===filter.toUpperCase();
      });
      H=rows.slice(0,600).map(function(x){ var ex=isExcl(x.name); var t=ex?null:tierOf(x.name);
        return '<div class="icp-pick-row" data-t="'+esc(x.name)+'"><span class="icp-pick-name">'+esc(x.name)+'</span><span class="icp-pick-count">'+x.count+'</span>'+rowBtns(t,ex)+'</div>'; }).join('');
    } else {
      var rows2=companyIndex().filter(function(x){
        if(q && x.name.toLowerCase().indexOf(q)<0) return false;
        var eco=companyInT2(x.name);
        if(filter==='all') return true;
        if(filter==='notin') return !eco;
        return eco;
      });
      H=rows2.slice(0,600).map(function(x){ var ex=isExcl(x.name); var eco=!ex && companyInT2(x.name);
        return '<div class="icp-pick-row" data-t="'+esc(x.name)+'"><span class="icp-pick-name">'+esc(x.name)+'</span><span class="icp-pick-count">'+x.count+'</span>'+rowBtns(eco?'T2':null,ex)+'</div>'; }).join('');
    }
    $('icp-pick-rows').innerHTML=H || '<div style="padding:16px;color:var(--tx3);font-size:0.8rem;">Nothing here — load your data (Try with sample data) first, or change the filter.</div>';
  };
  window.onRowAssign=function(e){
    var btn=e.target.closest && e.target.closest('.icp-asg'); if(!btn) return;
    var row=btn.closest('.icp-pick-row'); if(!row) return;
    assignOne(row.getAttribute('data-t'), btn.getAttribute('data-tier'));
  };
  function assignOne(name, tier){  // one click moves an item to a tier (or excludes); clicking its current tier toggles off
    var isCo=(mode==='companies'); var key=isCo?normCo(name):normTitle(name);
    function coll(t){ return isCo ? ICP_EXACT[t].companies : ICP_EXACT[t].titles; }
    var target=(tier==='exclude')?'excl':(isCo?'t2':tier);
    var wasThere=coll(target).has(key);
    ['t1','t2','t3','excl'].forEach(function(t){ coll(t).delete(key); });
    if(!wasThere) coll(target).add(key);
    if(typeof saveICPExact==='function') saveICPExact();
    reclassify(); if(typeof syncCustomBadge==='function') syncCustomBadge();
    window.renderTitlePicker();
    var verb=wasThere?'Removed':(tier==='exclude'?'Excluded':'Moved to '+(isCo?'T2':tier.toUpperCase()));
    var m=$('icpEditMsg'); if(m) m.textContent='✓ '+verb+' "'+name+'" — re-tiered ('+ICP.length.toLocaleString()+' in ICP)';
  }
  function actions(){
    var html;
    if(mode==='titles'){
      html='<button type="button" class="icp-asg icp-asg-t1" onclick="pickAssign(\'t1\')">T1</button><button type="button" class="icp-asg icp-asg-t2" onclick="pickAssign(\'t2\')">T2</button><button type="button" class="icp-asg icp-asg-t3" onclick="pickAssign(\'t3\')">T3</button>';
    } else {
      html='<button type="button" class="icp-asg icp-asg-t2" onclick="pickAssign(\'t2\')">Add to T2</button>';
    }
    html+='<button type="button" class="icp-asg icp-asg-x" onclick="pickAssign(\'exclude\')">Exclude</button><span style="flex:1"></span><button type="button" class="icp-edit-btn" onclick="pickClearSel()">Clear</button>';
    var a=$('icp-pick-actions'); if(a) a.innerHTML=html;
  }
  function bulk(){  // assign bar is always visible; just refresh the count + buttons
    var nEl=$('icp-pick-n'); if(nEl) nEl.textContent=Object.keys(sel).length; actions();
  }
  window.pickClearSel=function(){ sel={}; window.renderTitlePicker(); };
  window.icpPendingPicks=function(){ return Object.keys(sel).length; }; // ticked-but-not-yet-assigned
  window.pickAssign=function(tier){
    var items=Object.keys(sel); if(!items.length) return;
    var label;
    // R8: picks are EXACT whole-field matches. Companies → T2; titles → chosen tier; Exclude → noise filter.
    if(tier==='exclude'){
      window.__icpMeta = window.__icpMeta || {}; if(!window.__icpMeta.exclude) window.__icpMeta.exclude=[];
      items.forEach(function(t){ if(window.__icpMeta.exclude.indexOf(t)<0) window.__icpMeta.exclude.push(t); });
      try{ EXCL_KEYWORDS = (window.__icpMeta.exclude.length) ? compileKw(window.__icpMeta.exclude) : /a^/; }catch(e){}
      label='exclude';
    } else if(mode==='companies'){
      items.forEach(function(t){ ICP_EXACT.t2.companies.add(normCo(t)); }); tier='t2'; label='T2';
    } else {
      items.forEach(function(t){ ICP_EXACT[tier].titles.add(normTitle(t)); }); label=tier.toUpperCase();
    }
    if(typeof saveICPExact==='function') saveICPExact();
    reclassify();
    if(typeof syncCustomBadge==='function') syncCustomBadge();
    if(typeof updateEditorCounts==='function') updateEditorCounts();
    sel={}; window.renderTitlePicker();
    var noun=(mode==='companies') ? (items.length>1?'companies':'company') : (items.length>1?'titles':'title');
    var m=$('icpEditMsg'); if(m) m.textContent = (label==='exclude' ? '✓ Excluded '+items.length+' '+noun : '✓ Added '+items.length+' '+noun+' to '+label) + ' — re-tiered ('+ICP.length.toLocaleString()+' in ICP)';
  };

  if(typeof window.openICPEditor==='function'){
    var orig=window.openICPEditor;
    window.openICPEditor=function(){
      orig(); sel={}; mode='titles'; filter='unmatched';
      var sb=$('icp-pick-search'); if(sb) sb.value='';
      $('icpmode-titles').classList.add('active'); $('icpmode-companies').classList.remove('active');
      $('icp-pick-help').innerHTML=HELP.titles;
      renderChips(); window.setEditorView('pick');
    };
  }
})();

/* ---- ICP Profiles + config file (v1): preset apply, spec-compliant export/import ---- */
(function(){
  var FORMAT='linkvault-icp', VERSION=1;
  var MATCH={ t1:'title', t2:'title+company', t3:'title' };
  window.__icpMeta = window.__icpMeta || {
    name:'Custom ICP',
    t1:{label:'Decision Maker', description:'Founders, CEOs, CMOs, VPs'},
    t2:{label:'Ecosystem',      description:'Agencies, vendors, partners'},
    t3:{label:'Adjacent',       description:'Marketing, growth roles'},
    exclude:[]
  };
  function $(id){ return document.getElementById(id); }
  function arr(x){ return Array.isArray(x) ? x.map(function(s){ return String(s).trim().toLowerCase(); }).filter(Boolean) : []; }
  // R8 exact-list helpers — populate ICP_EXACT (whole-field titles/companies) from a profile or config
  function clearExact(){ if(typeof ICP_EXACT==='undefined') return; ['t1','t2','t3'].forEach(function(t){ ICP_EXACT[t].titles.clear(); ICP_EXACT[t].companies.clear(); }); }
  function fillExact(src){ if(typeof ICP_EXACT==='undefined') return; clearExact();
    ['t1','t2','t3'].forEach(function(t){ var tt=src[t]||{};
      (tt.titles||[]).forEach(function(x){ ICP_EXACT[t].titles.add(normTitle(x)); });
      (tt.companies||[]).forEach(function(x){ ICP_EXACT[t].companies.add(normCo(x)); }); });
    if(typeof saveICPExact==='function') saveICPExact();
  }
  function exTitles(t){ return (typeof ICP_EXACT!=='undefined') ? Array.from(ICP_EXACT[t].titles) : []; }
  function exCompanies(t){ return (typeof ICP_EXACT!=='undefined') ? Array.from(ICP_EXACT[t].companies) : []; }
  function profileKeys(){ return (typeof ICP_PROFILES!=='undefined') ? Object.keys(ICP_PROFILES) : []; }
  function fillProfilePills(){
    var box=$('icp-vert-pills'); if(!box || typeof ICP_PROFILES==='undefined') return;
    var active=''; try{ active=localStorage.getItem(window.ICP_K.profile)||''; }catch(e){}
    box.innerHTML=profileKeys().map(function(k){ return '<button type="button" class="icp-vpill'+(k===active?' active':'')+'" onclick="applyICPProfile(\''+k+'\')">'+ICP_PROFILES[k].name+'</button>'; }).join('');
  }
  function applyMeta(){ try{ EXCL_KEYWORDS=(window.__icpMeta.exclude && window.__icpMeta.exclude.length) ? compileKw(window.__icpMeta.exclude) : /a^/; }catch(e){} }
  function relabel(){
    var meta=window.__icpMeta;
    [['t1',meta.t1],['t2',meta.t2],['t3',meta.t3]].forEach(function(pair){
      var sc=$('s-'+pair[0]); if(sc){ var card=sc.closest('.stat-card'); var sub=card&&card.querySelector('.stat-sub'); if(sub) sub.textContent=pair[1].description||''; }
    });
    var cards=document.querySelectorAll('.tier-explain > div');
    [meta.t1,meta.t2,meta.t3].forEach(function(t,i){ if(cards[i]){ var ti=cards[i].querySelector('.tier-card-title'); var su=cards[i].querySelector('.tier-card-sub'); if(ti) ti.textContent=t.description||''; if(su) su.textContent=(t.label||'')+' tier · '+(meta.name||'ICP')+'.'; } });
  }
  function syncBoxes(){ ['t1','t2','t3'].forEach(function(t){ var el=$('icpkw-'+t); if(el) el.value=(ICP_KW[t]||[]).join('\n'); }); if(typeof updateEditorCounts==='function') updateEditorCounts(); if(typeof renderTitlePicker==='function') renderTitlePicker(); }

  window.applyICPProfile=function(key){
    if(!key || typeof ICP_PROFILES==='undefined' || !ICP_PROFILES[key]) return;
    var p=ICP_PROFILES[key];
    ICP_KW={ t1:(p.t1.keywords||[]).slice(), t2:(p.t2.keywords||[]).slice(), t3:(p.t3.keywords||[]).slice() };
    fillExact(p); // exact carriers/companies + named titles from the profile
    try{ ICP_DOMAIN=compileKw(p.domain||[]); }catch(e){} // rank × domain function words
    window.__icpMeta={ name:p.name, domain:(p.domain||[]).slice(),
      t1:{label:p.t1.label, description:p.t1.desc},
      t2:{label:p.t2.label, description:p.t2.desc},
      t3:{label:p.t3.label, description:p.t3.desc},
      exclude:(p.exclude||[]).slice() };
    applyMeta();
    try{ localStorage.setItem(window.ICP_K.kw, JSON.stringify(ICP_KW)); localStorage.setItem(window.ICP_K.profile, key); }catch(e){}
    reclassify(); if(typeof syncCustomBadge==='function') syncCustomBadge(); relabel(); syncBoxes(); fillProfilePills();
    var m=$('icpEditMsg'); if(m) m.textContent='✓ Applied "'+p.name+'" — re-tiered ('+ICP.length.toLocaleString()+' in ICP)';
  };

  window.exportICP=function(){
    var meta=window.__icpMeta;
    var cfg={ format:FORMAT, version:VERSION, name:meta.name||'Custom ICP', author:'Growth Automated',
      domain:(meta.domain||[]),
      tiers:{
        t1:{ label:meta.t1.label, description:meta.t1.description, titles:exTitles('t1'), keywords:ICP_KW.t1||[] },
        t2:{ label:meta.t2.label, description:meta.t2.description, companies:exCompanies('t2'), titles:exTitles('t2'), keywords:ICP_KW.t2||[] },
        t3:{ label:meta.t3.label, description:meta.t3.description, titles:exTitles('t3'), keywords:ICP_KW.t3||[] }
      },
      exclude:(meta.exclude||[]) };
    var blob=new Blob([JSON.stringify(cfg,null,2)], {type:'application/json'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download='icp-config-'+String(cfg.name).toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.json'; a.click();
  };

  window.importICP=function(file){
    if(!file) return; var rd=new FileReader();
    rd.onload=function(e){
      var cfg; try{ cfg=JSON.parse(e.target.result); }catch(err){ alert('Could not read that file: '+err.message); return; }
      var t1, t2, t3, meta, isNew=false;
      if(cfg && cfg.tiers && cfg.tiers.t1 && cfg.tiers.t2 && cfg.tiers.t3){
        if(cfg.format && cfg.format!==FORMAT){ alert('Not a LinkVault ICP config (format: '+cfg.format+').'); return; }
        if(cfg.version && cfg.version>VERSION){ alert('This config is version '+cfg.version+'; update LinkVault to load it.'); return; }
        isNew=true;
        t1=arr(cfg.tiers.t1.keywords); t2=arr(cfg.tiers.t2.keywords); t3=arr(cfg.tiers.t3.keywords);
        meta={ name:cfg.name||'Loaded ICP', domain:arr(cfg.domain),
          t1:{label:cfg.tiers.t1.label||'Decision Maker', description:cfg.tiers.t1.description||''},
          t2:{label:cfg.tiers.t2.label||'Ecosystem',      description:cfg.tiers.t2.description||''},
          t3:{label:cfg.tiers.t3.label||'Adjacent',       description:cfg.tiers.t3.description||''},
          exclude:arr(cfg.exclude) };
      } else if(cfg && cfg.t1 && cfg.t2 && cfg.t3){
        t1=arr(cfg.t1); t2=arr(cfg.t2); t3=arr(cfg.t3);
        meta={ name:cfg.name||'Loaded ICP', domain:[], t1:{label:'Decision Maker',description:''}, t2:{label:'Ecosystem',description:''}, t3:{label:'Adjacent',description:''}, exclude:[] };
      } else { alert('That JSON is not a valid ICP config (needs tiers.t1/t2/t3 with keywords).'); return; }
      var exCount=0;
      if(isNew){ ['t1','t2','t3'].forEach(function(t){ var tt=cfg.tiers[t]||{}; exCount+=(tt.titles||[]).length+(tt.companies||[]).length; }); }
      if(!t1.length && !t2.length && !t3.length && !exCount){ alert('That config has no keywords or picks.'); return; }
      ICP_KW={ t1:t1, t2:t2, t3:t3 }; window.__icpMeta=meta; applyMeta();
      try{ ICP_DOMAIN=compileKw(meta.domain||[]); }catch(_){}
      if(isNew) fillExact(cfg.tiers); else clearExact();
      try{ localStorage.setItem(window.ICP_K.kw, JSON.stringify(ICP_KW)); localStorage.removeItem(window.ICP_K.profile); }catch(_){}
      reclassify(); if(typeof syncCustomBadge==='function') syncCustomBadge(); relabel(); syncBoxes();
      var m=$('icpEditMsg'); if(m) m.textContent='✓ Loaded "'+meta.name+'" — re-tiered ('+ICP.length.toLocaleString()+' in ICP)';
    };
    rd.readAsText(file);
  };

  if(typeof window.openICPEditor==='function'){
    var prev=window.openICPEditor;
    window.openICPEditor=function(){ prev(); fillProfilePills(); };
  }
})();
