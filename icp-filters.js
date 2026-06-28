/* ICP filter bar — custom attribute dropdowns + segment pill nav (live icp-finder).
   Builds into #icp-dd-row and #icp-seg-nav; drives getFiltered() via window.icpFilterMatch.
   Keyboard: Tab to a trigger, Enter/Space to open, ↑/↓ to move, Enter to pick, Esc to close. */
(function(){
  var DD=[
    {key:'tier',       def:'All tiers',      opts:[['','All tiers'],['T1','T1 · Decision Maker'],['T2','T2 · Ecosystem'],['T3','T3 · Adjacent']]},
    {key:'recency',    def:'All recency',    opts:[['','All recency'],['new','New (<30d)'],['fresh','Fresh (30–90d)'],['warm','Warm (90–365d)'],['cold','Cold (>1yr)']]},
    {key:'engagement', def:'All engagement', opts:[['','All engagement'],['active','Active (<90d)'],['warm','Warm (<1yr)'],['cold','Cold (>1yr)'],['never','Never messaged']]}
  ];
  var SEG=[['all','All'],['t1new','T1 first message'],['followup','Follow-up'],['reengage','Re-engage']];
  window._flt = window._flt || { tier:'', recency:'', engagement:'', segment:'all' };

  var css=`
.icp-dd{position:relative;}
.icp-dd-trig{display:flex;align-items:center;justify-content:space-between;gap:14px;background:var(--bg3);border:1px solid var(--border2);border-radius:8px;padding:7px 12px;font-size:0.8rem;font-weight:500;color:var(--tx);font-family:inherit;cursor:pointer;min-width:122px;transition:border-color .18s,background .18s;}
.icp-dd-trig:hover{border-color:rgba(0,160,220,0.35);background:var(--bg4);}
.icp-dd.open .icp-dd-trig{border-color:rgba(0,160,220,0.52);box-shadow:0 0 0 3px rgba(0,160,220,0.1);}
.icp-dd-chev{font-style:normal;font-size:0.7rem;color:var(--tx3);transition:transform .18s;}
.icp-dd.open .icp-dd-chev{transform:rotate(180deg);color:var(--li2);}
.icp-dd-menu{position:absolute;top:calc(100% + 5px);left:0;min-width:100%;width:max-content;background:var(--bg4);border:1px solid var(--border2);border-radius:9px;padding:5px;box-shadow:0 12px 30px rgba(0,0,0,0.45);z-index:50;display:none;}
.icp-dd.open .icp-dd-menu{display:block;}
.icp-dd-opt{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:7px 10px;border-radius:6px;font-size:0.8rem;color:var(--tx2);cursor:pointer;white-space:nowrap;}
.icp-dd-opt:hover,.icp-dd-opt.focus{background:var(--hover-strong);color:var(--tx);}
.icp-dd-opt.sel{color:var(--li2);font-weight:600;}
.icp-dd-ck{font-style:normal;font-size:0.75rem;opacity:0;}
.icp-dd-opt.sel .icp-dd-ck{opacity:1;}
.icp-seg-nav{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:-2px 0 14px;}
.icp-seg-lab{font-size:0.64rem;color:var(--tx3);letter-spacing:0.05em;text-transform:uppercase;margin-right:2px;}
.icp-seg-pill{font-family:inherit;cursor:pointer;font-size:0.75rem;font-weight:500;padding:5px 13px;border-radius:999px;color:var(--tx2);background:transparent;border:1px solid var(--border2);transition:all .15s;}
.icp-seg-pill:hover{border-color:rgba(0,160,220,0.4);color:var(--tx);}
.icp-seg-pill.active{font-weight:600;color:#cdeafd;background:rgba(0,160,220,0.26);border-color:rgba(0,160,220,0.5);}`;
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  function buildDD(){
    var row=document.getElementById('icp-dd-row'); if(!row) return false;
    row.innerHTML=DD.map(function(d){
      return '<div class="icp-dd" data-key="'+d.key+'">'+
        '<button type="button" class="icp-dd-trig" aria-haspopup="listbox" aria-expanded="false"><span class="icp-dd-lab">'+esc(d.def)+'</span><i class="icp-dd-chev" aria-hidden="true">▾</i></button>'+
        '<div class="icp-dd-menu" role="listbox">'+d.opts.map(function(o){
          return '<div class="icp-dd-opt'+(o[0]===''?' sel':'')+'" role="option" data-v="'+esc(o[0])+'"><span>'+esc(o[1])+'</span><i class="icp-dd-ck" aria-hidden="true">✓</i></div>';
        }).join('')+'</div></div>';
    }).join('');
    return true;
  }
  function buildSeg(){
    var nav=document.getElementById('icp-seg-nav'); if(!nav) return;
    nav.innerHTML='<span class="icp-seg-lab">Quick filters</span>'+SEG.map(function(s){
      return '<button type="button" class="icp-seg-pill'+(s[0]==='all'?' active':'')+'" data-seg="'+s[0]+'">'+esc(s[1])+'</button>';
    }).join('');
  }
  function closeAll(){ [].forEach.call(document.querySelectorAll('.icp-dd.open'),function(d){ d.classList.remove('open'); var t=d.querySelector('.icp-dd-trig'); if(t)t.setAttribute('aria-expanded','false'); [].forEach.call(d.querySelectorAll('.icp-dd-opt.focus'),function(o){o.classList.remove('focus');}); }); }
  function apply(){ try{ if(typeof _icpPage!=='undefined') _icpPage=0; }catch(e){} if(typeof renderTable==='function') renderTable(); }

  function onClick(e){
    var trig=e.target.closest && e.target.closest('.icp-dd-trig');
    if(trig){ var dd=trig.closest('.icp-dd'); var was=dd.classList.contains('open'); closeAll(); if(!was){ dd.classList.add('open'); trig.setAttribute('aria-expanded','true'); } e.stopPropagation(); return; }
    var opt=e.target.closest && e.target.closest('.icp-dd-opt');
    if(opt){ var d2=opt.closest('.icp-dd'); window._flt[d2.dataset.key]=opt.dataset.v;
      d2.querySelector('.icp-dd-lab').textContent=opt.querySelector('span').textContent;
      [].forEach.call(d2.querySelectorAll('.icp-dd-opt'),function(o){o.classList.toggle('sel',o===opt);});
      closeAll(); apply(); return; }
    var pill=e.target.closest && e.target.closest('.icp-seg-pill');
    if(pill){ window._flt.segment=pill.dataset.seg; [].forEach.call(document.querySelectorAll('.icp-seg-pill'),function(p){p.classList.toggle('active',p===pill);}); apply(); return; }
    closeAll();
  }
  function onKey(e){
    var open=document.querySelector('.icp-dd.open'); if(!open) return;
    var opts=[].slice.call(open.querySelectorAll('.icp-dd-opt')); var cur=open.querySelector('.icp-dd-opt.focus'); var i=opts.indexOf(cur);
    if(e.key==='Escape'){ closeAll(); }
    else if(e.key==='ArrowDown'){ e.preventDefault(); i=Math.min(opts.length-1,i+1); opts.forEach(function(o,j){o.classList.toggle('focus',j===i);}); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); i=Math.max(0,i<0?0:i-1); opts.forEach(function(o,j){o.classList.toggle('focus',j===i);}); }
    else if(e.key==='Enter' && cur){ e.preventDefault(); cur.click(); }
  }

  function segPass(seg,c){
    if(seg==='t1new')    return c.tier==='T1' && (c.msgCount||0)===0;        // decision-makers not yet contacted
    if(seg==='followup') return (c.msgCount||0)>0 && c.engagement!=='active'; // talked, gone quiet
    if(seg==='reengage') return (c.msgCount||0)===0 && c.recency==='cold';   // old connections, never messaged
    return true;
  }
  window.icpFilterMatch=function(c){
    var f=window._flt;
    if(f.tier && c.tier!==f.tier) return false;
    if(f.recency && c.recency!==f.recency) return false;
    if(f.engagement && c.engagement!==f.engagement) return false;
    if(f.segment && f.segment!=='all' && !segPass(f.segment,c)) return false;
    return true;
  };

  function init(){ if(!buildDD()) return; buildSeg(); document.addEventListener('click',onClick); document.addEventListener('keydown',onKey); }
  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
})();
