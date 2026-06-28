/* ICP customization picker — Titles + Companies multi-select (prototype only).
   Loaded after the main icp-finder script; uses its globals (classifyTier, ICP_KW,
   _connRows, reclassify, etc.) and overrides openICPEditor to default to the picker. */
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
    titles:'Tick the job titles that fit your ideal customer, then assign them to a tier. Counts are from your loaded network. Start with <b>Unmatched</b> to grab who the default ICP missed.',
    companies:'Tick the companies your ideal customers work at, then add them to <b>T2 · Ecosystem</b> (T2 matches the company name). Best for industry / vertical ICPs — e.g. add the carriers for a telecom ICP.'
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
    $('icp-view-pick').style.display=(v==='pick')?'block':'none';
    $('icp-view-lists').style.display=(v==='lists')?'block':'none';
    $('icptab-pick').classList.toggle('active', v==='pick');
    $('icptab-lists').classList.toggle('active', v==='lists');
    if(v==='pick') window.renderTitlePicker();
  };
  window.renderTitlePicker=function(){
    var q=($('icp-pick-search').value||'').toLowerCase(); var H;
    if(mode==='titles'){
      var rows=titleIndex().filter(function(x){
        if(q && x.name.toLowerCase().indexOf(q)<0) return false;
        var t=tierOf(x.name);
        if(filter==='all') return true;
        if(filter==='unmatched') return !t;
        return t===filter.toUpperCase();
      });
      H=rows.slice(0,600).map(function(x){
        var t=tierOf(x.name);
        var badge=t ? ('<span class="icp-pick-tier t'+t[1]+'">'+t+'</span>') : '<span class="icp-pick-tier un">unmatched</span>';
        var ck=sel[x.name.toLowerCase()]?' checked':'';
        return '<label class="icp-pick-row"><input type="checkbox" data-t="'+esc(x.name)+'"'+ck+'><span class="icp-pick-name">'+esc(x.name)+'</span>'+badge+'<span class="icp-pick-count">'+x.count+'</span></label>';
      }).join('');
    } else {
      var rows2=companyIndex().filter(function(x){
        if(q && x.name.toLowerCase().indexOf(q)<0) return false;
        var eco=companyIsEco(x.name);
        if(filter==='all') return true;
        if(filter==='notin') return !eco;
        return eco;
      });
      H=rows2.slice(0,600).map(function(x){
        var eco=companyIsEco(x.name);
        var badge=eco ? '<span class="icp-pick-tier t2">in T2</span>' : '<span class="icp-pick-tier un">—</span>';
        var ck=sel[x.name.toLowerCase()]?' checked':'';
        return '<label class="icp-pick-row"><input type="checkbox" data-t="'+esc(x.name)+'"'+ck+'><span class="icp-pick-name">'+esc(x.name)+'</span>'+badge+'<span class="icp-pick-count">'+x.count+'</span></label>';
      }).join('');
    }
    $('icp-pick-rows').innerHTML=H || '<div style="padding:16px;color:var(--tx3);font-size:0.8rem;">Nothing here — load your data (Try with sample data) first, or change the filter.</div>';
    bulk();
  };
  window.onPickToggle=function(e){
    var cb=e.target;
    if(cb && cb.type==='checkbox'){ var t=cb.getAttribute('data-t').toLowerCase(); if(cb.checked) sel[t]=1; else delete sel[t]; bulk(); }
  };
  function actions(){
    var html;
    if(mode==='titles'){
      html='<button type="button" class="icp-edit-btn" onclick="pickAssign(\'t1\')">T1</button><button type="button" class="icp-edit-btn" onclick="pickAssign(\'t2\')">T2</button><button type="button" class="icp-edit-btn" onclick="pickAssign(\'t3\')">T3</button>';
    } else {
      html='<button type="button" class="icp-edit-btn icp-edit-primary" onclick="pickAssign(\'t2\')">Add to T2 · Ecosystem</button>';
    }
    html+='<button type="button" class="icp-edit-btn" onclick="pickClearSel()">Clear</button>';
    $('icp-pick-actions').innerHTML=html;
  }
  function bulk(){
    var n=Object.keys(sel).length; var b=$('icp-pick-bulk');
    $('icp-pick-n').textContent=n; b.style.display=n?'flex':'none'; if(n) actions();
  }
  window.pickClearSel=function(){ sel={}; window.renderTitlePicker(); };
  window.pickAssign=function(tier){
    var items=Object.keys(sel); if(!items.length) return;
    items.forEach(function(t){ if(ICP_KW[tier].indexOf(t)<0) ICP_KW[tier].push(t); });
    try { localStorage.setItem('ga_icp_kw_proto', JSON.stringify(ICP_KW)); } catch(e){}
    reclassify();
    if(typeof syncCustomBadge==='function') syncCustomBadge();
    ['t1','t2','t3'].forEach(function(t){ var el=$('icpkw-'+t); if(el) el.value=(ICP_KW[t]||[]).join('\n'); });
    if(typeof updateEditorCounts==='function') updateEditorCounts();
    sel={}; window.renderTitlePicker();
    var noun=(mode==='companies') ? (items.length>1?'companies':'company') : (items.length>1?'titles':'title');
    var m=$('icpEditMsg'); if(m) m.textContent='✓ Added '+items.length+' '+noun+' to '+tier.toUpperCase()+' — re-tiered ('+ICP.length.toLocaleString()+' in ICP)';
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

/* ---- ICP Profiles: apply a vertical preset, export/import a config (multi-tenant) ---- */
(function(){
  function $(id){ return document.getElementById(id); }
  function profileKeys(){ return (typeof ICP_PROFILES!=='undefined') ? Object.keys(ICP_PROFILES) : []; }
  function fillProfileSelect(){
    var sel=$('icp-profile-select'); if(!sel || typeof ICP_PROFILES==='undefined') return;
    sel.innerHTML='<option value="">— pick a vertical —</option>'+profileKeys().map(function(k){ return '<option value="'+k+'">'+ICP_PROFILES[k].name+'</option>'; }).join('');
  }
  function relabel(p){
    [['t1',p.t1],['t2',p.t2],['t3',p.t3]].forEach(function(pair){
      var sc=$('s-'+pair[0]); if(sc){ var card=sc.closest('.stat-card'); var sub=card&&card.querySelector('.stat-sub'); if(sub) sub.textContent=pair[1].desc; }
    });
    var cards=document.querySelectorAll('.tier-explain > div');
    [p.t1,p.t2,p.t3].forEach(function(t,i){ if(cards[i]){ var ti=cards[i].querySelector('.tier-card-title'); var su=cards[i].querySelector('.tier-card-sub'); if(ti) ti.textContent=t.desc; if(su) su.textContent=t.label+' tier · '+p.name+' ICP.'; } });
  }
  function syncBoxes(){ ['t1','t2','t3'].forEach(function(t){ var el=$('icpkw-'+t); if(el) el.value=(ICP_KW[t]||[]).join('\n'); }); if(typeof updateEditorCounts==='function') updateEditorCounts(); if(typeof renderTitlePicker==='function') renderTitlePicker(); }
  window.applyICPProfile=function(key){
    if(!key || typeof ICP_PROFILES==='undefined' || !ICP_PROFILES[key]) return;
    var p=ICP_PROFILES[key];
    ICP_KW={ t1:p.t1.keywords.slice(), t2:p.t2.keywords.slice(), t3:p.t3.keywords.slice() };
    try{ EXCL_KEYWORDS=(p.exclude && p.exclude.length) ? compileKw(p.exclude) : /a^/; }catch(e){}
    try{ localStorage.setItem('ga_icp_kw_proto', JSON.stringify(ICP_KW)); localStorage.setItem('ga_icp_profile', key); }catch(e){}
    reclassify(); if(typeof syncCustomBadge==='function') syncCustomBadge();
    relabel(p); syncBoxes();
    var m=$('icpEditMsg'); if(m) m.textContent='✓ Applied "'+p.name+'" — re-tiered ('+ICP.length.toLocaleString()+' in ICP)';
  };
  window.exportICP=function(){
    var key=null; try{ key=localStorage.getItem('ga_icp_profile'); }catch(e){}
    var name=(key && typeof ICP_PROFILES!=='undefined' && ICP_PROFILES[key]) ? ICP_PROFILES[key].name : 'Custom ICP';
    var cfg={ name:name, t1:ICP_KW.t1, t2:ICP_KW.t2, t3:ICP_KW.t3 };
    var blob=new Blob([JSON.stringify(cfg,null,2)],{type:'application/json'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='icp-config-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.json'; a.click();
  };
  window.importICP=function(file){
    if(!file) return; var rd=new FileReader();
    rd.onload=function(e){
      try{
        var cfg=JSON.parse(e.target.result);
        if(cfg.t1 && cfg.t2 && cfg.t3){
          ICP_KW={ t1:cfg.t1, t2:cfg.t2, t3:cfg.t3 };
          try{ localStorage.setItem('ga_icp_kw_proto', JSON.stringify(ICP_KW)); localStorage.removeItem('ga_icp_profile'); }catch(_){}
          reclassify(); if(typeof syncCustomBadge==='function') syncCustomBadge(); syncBoxes();
          var m=$('icpEditMsg'); if(m) m.textContent='✓ Loaded "'+(cfg.name||'config')+'" — re-tiered ('+ICP.length.toLocaleString()+' in ICP)';
        } else { alert('That JSON does not look like an ICP config (needs t1, t2, t3 arrays).'); }
      }catch(err){ alert('Could not read that file: '+err.message); }
    };
    rd.readAsText(file);
  };
  if(typeof window.openICPEditor==='function'){
    var prev=window.openICPEditor;
    window.openICPEditor=function(){ prev(); fillProfileSelect(); var sel=$('icp-profile-select'); if(sel){ try{ sel.value=localStorage.getItem('ga_icp_profile')||''; }catch(e){} } };
  }
})();
