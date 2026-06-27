/* Willis — floating help widget. Drop <script src="willis-articles.js"></script>
   then <script src="willis.js"></script> on any page. Self-contained + namespaced (wz-). */
(function(){
  if (window.__willisLoaded) return; window.__willisLoaded = true;

  var BASE = 'willis/';
  var ART = { welcoming:BASE+'willis-main.png', got:BASE+'willis-thumbsup.png',
              shrug:BASE+'willis-shrug.png', cheeky:BASE+'willis-cheeky.png', avatar:BASE+'willis-avatar.png' };
  var ARTICLES = window.WILLIS_ARTICLES || [];

  /* ---------- styles (self-contained; theme via html[data-theme="light"]) ---------- */
  var css = `
  .wz-root{ --wp-panel:#1b2436; --wp-input:#121a2b; --wp-card:#252f47; --wp-border:rgba(255,255,255,.12);
    --wp-stage:#eef2f8; --wp-stage-tx:#1f2733; --wp-stage-tx2:#566072;
    --wp-tx:#f0f4ff; --wp-tx2:rgba(240,244,255,.62); --wp-tx3:rgba(240,244,255,.4);
    --wp-li:#0077B5; --wp-li2:#00a0dc;
    font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; }
  html[data-theme="light"] .wz-root{ --wp-panel:#fff; --wp-input:#f1f4f9; --wp-card:#eef2f8; --wp-border:rgba(15,23,42,.12);
    --wp-stage:#e8f0fb; --wp-stage-tx:#0f172a; --wp-stage-tx2:#475569;
    --wp-tx:#0f172a; --wp-tx2:rgba(15,23,42,.68); --wp-tx3:rgba(15,23,42,.5); }

  .wz-bubble{position:fixed;right:22px;bottom:22px;width:66px;height:66px;border-radius:18px;
    background:var(--wp-stage);border:2px solid var(--wp-li);box-shadow:0 8px 28px rgba(0,0,0,.45);
    cursor:pointer;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;padding:0;
    transition:transform .18s ease, box-shadow .18s ease;}
  .wz-bubble img{width:100%;height:100%;object-fit:contain;object-position:center bottom;}
  .wz-bubble:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 12px 34px rgba(0,119,181,.5);}
  .wz-online{position:absolute;right:-3px;bottom:-3px;width:13px;height:13px;border-radius:50%;background:#10b981;border:2px solid var(--wp-panel);}
  .wz-tip{position:fixed;right:96px;bottom:40px;background:var(--wp-panel);border:1px solid var(--wp-border);color:var(--wp-tx);
    padding:7px 12px;border-radius:10px;font-size:.8rem;font-weight:600;white-space:nowrap;z-index:2147483000;
    box-shadow:0 6px 20px rgba(0,0,0,.4);opacity:0;transform:translateX(6px);pointer-events:none;transition:all .18s;}
  .wz-bubble:hover + .wz-tip{opacity:1;transform:translateX(0);}

  .wz-panel{position:fixed;right:22px;bottom:22px;width:380px;max-width:calc(100vw - 32px);max-height:min(640px,calc(100vh - 44px));
    background:var(--wp-panel);border:1px solid var(--wp-border);border-radius:16px;box-shadow:0 22px 64px rgba(0,0,0,.55);
    z-index:2147483001;display:none;flex-direction:column;overflow:hidden;}
  .wz-panel.wz-open{display:flex;animation:wzpop .2s ease;}
  @keyframes wzpop{from{opacity:0;transform:translateY(12px) scale(.97);}to{opacity:1;transform:none;}}
  .wz-head{display:flex;align-items:center;gap:12px;padding:15px 15px 12px;border-bottom:1px solid var(--wp-border);}
  .wz-head img{width:46px;height:46px;flex-shrink:0;border-radius:12px;background:var(--wp-stage);object-fit:contain;object-position:center bottom;}
  .wz-head .wz-t{flex:1;min-width:0;}
  .wz-name{font-weight:800;font-size:1rem;color:var(--wp-tx);display:flex;align-items:center;gap:7px;}
  .wz-name .wz-dot{width:8px;height:8px;border-radius:50%;background:#10b981;}
  .wz-status{color:var(--wp-tx2);font-size:.77rem;margin-top:1px;}
  .wz-x{background:transparent;border:none;color:var(--wp-tx2);font-size:1.4rem;cursor:pointer;line-height:1;padding:2px 6px;border-radius:6px;}
  .wz-x:hover{background:var(--wp-border);color:var(--wp-tx);}
  .wz-asklabel{font-size:.7rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--wp-tx3);padding:13px 16px 6px;}
  .wz-ask{display:flex;gap:8px;padding:0 16px 14px;}
  .wz-ask input{flex:1;background:var(--wp-input);border:1px solid var(--wp-border);border-radius:10px;color:var(--wp-tx);
    padding:11px 13px;font-size:.9rem;font-family:inherit;outline:none;min-width:0;}
  .wz-ask input::placeholder{color:var(--wp-tx3);}
  .wz-ask input:focus{border-color:var(--wp-li);}
  .wz-ask button{background:var(--wp-li);color:#fff;border:none;border-radius:10px;padding:0 16px;font-weight:700;cursor:pointer;font-family:inherit;}
  .wz-ask button:hover{background:var(--wp-li2);}
  .wz-body{padding:2px 16px 16px;overflow-y:auto;}
  .wz-state{display:flex;gap:12px;align-items:center;background:var(--wp-stage);border:1px solid var(--wp-border);border-radius:12px;padding:12px 14px;margin-bottom:12px;}
  .wz-state img{width:54px;height:54px;flex-shrink:0;}
  .wz-state .wz-msg{font-size:.86rem;color:var(--wp-stage-tx);}
  .wz-state .wz-msg b{display:block;margin-bottom:2px;}
  .wz-state .wz-msg span{color:var(--wp-stage-tx2);}
  .wz-sect{font-size:.7rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--wp-tx3);margin:4px 2px 8px;}
  .wz-art{display:block;width:100%;text-align:left;background:var(--wp-card);border:1px solid var(--wp-border);border-radius:10px;
    padding:11px 13px;margin-bottom:8px;cursor:pointer;color:var(--wp-tx);font-family:inherit;transition:all .15s;}
  .wz-art:hover{border-color:var(--wp-li);transform:translateX(2px);}
  .wz-art .wz-at{font-weight:600;font-size:.88rem;}
  .wz-art .wz-ac{color:var(--wp-tx3);font-size:.72rem;margin-top:1px;}
  .wz-back{background:transparent;border:none;color:var(--wp-li2);font-weight:600;font-size:.82rem;cursor:pointer;padding:6px 0 10px;font-family:inherit;}
  .wz-article h3{font-size:1.02rem;color:var(--wp-tx);margin:2px 0 10px;}
  .wz-article{color:var(--wp-tx2);font-size:.88rem;line-height:1.6;}
  .wz-article p{margin:0 0 10px;} .wz-article ol,.wz-article ul{margin:0 0 10px 18px;display:flex;flex-direction:column;gap:5px;}
  .wz-article b,.wz-article strong{color:var(--wp-tx);} .wz-article a{color:var(--wp-li2);text-decoration:underline;}
  .wz-article code{background:var(--wp-card);padding:1px 5px;border-radius:5px;font-size:.85em;}
  .wz-link{color:var(--wp-li2);text-decoration:underline;cursor:pointer;font-weight:600;background:none;border:none;font-family:inherit;font-size:inherit;padding:0;}

  @media(max-width:480px){
    .wz-panel{right:8px;left:8px;bottom:8px;width:auto;max-height:calc(100vh - 16px);}
    .wz-bubble{right:14px;bottom:14px;width:58px;height:58px;}
    .wz-tip{display:none;}
  }
  .gar-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:16px;}
  .gar-card{position:relative;background:#1b2436;color:#f0f4ff;border:1px solid rgba(255,255,255,.12);border-radius:14px;max-width:460px;width:100%;padding:18px;box-shadow:0 24px 70px rgba(0,0,0,.6);}
  html[data-theme="light"] .gar-card{background:#fff;color:#0f172a;border-color:rgba(15,23,42,.12);}
  .gar-card h3{font-size:1.02rem;margin:0 0 4px;}
  .gar-sub{font-size:.8rem;opacity:.7;margin:0 0 12px;}
  .gar-ta{width:100%;height:150px;resize:vertical;background:rgba(127,127,127,.12);border:1px solid rgba(127,127,127,.28);border-radius:9px;color:inherit;font:0.78rem/1.5 ui-monospace,Menlo,monospace;padding:10px;box-sizing:border-box;outline:none;}
  .gar-to{font-size:.76rem;opacity:.7;margin:9px 0 12px;}
  .gar-btns{display:flex;flex-wrap:wrap;gap:8px;}
  .gar-b{flex:1;min-width:118px;border:1px solid rgba(127,127,127,.32);background:transparent;color:inherit;border-radius:9px;padding:9px 12px;font-weight:600;font-size:.82rem;font-family:inherit;cursor:pointer;}
  .gar-b:hover{background:rgba(127,127,127,.14);}
  .gar-b.gar-primary{background:#0077B5;color:#fff;border-color:transparent;}
  .gar-b.gar-primary:hover{background:#00a0dc;}`;
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  /* ---------- DOM ---------- */
  var root = document.createElement('div'); root.className = 'wz-root';
  root.innerHTML =
    '<button class="wz-bubble" id="wzBubble" title="Ask Willis" aria-label="Ask Willis for help">'+
      '<img src="'+ART.avatar+'" alt="Willis" id="wzBubbleImg"><span class="wz-online"></span></button>'+
    '<div class="wz-tip">Need a hand? Ask Willis</div>'+
    '<div class="wz-panel" id="wzPanel" role="dialog" aria-label="Ask Willis">'+
      '<div class="wz-head"><img src="'+ART.avatar+'" alt="Willis">'+
        '<div class="wz-t"><div class="wz-name"><span class="wz-dot"></span> Willis</div>'+
        '<div class="wz-status">Your guide to the toolkit · online</div></div>'+
        '<button class="wz-x" id="wzClose" aria-label="Close Willis">×</button></div>'+
      '<div class="wz-asklabel">Ask Willis</div>'+
      '<div class="wz-ask"><input id="wzInput" type="text" placeholder="Whatchu talkin&#39; &#39;bout, Willis?" autocomplete="off" aria-label="Ask Willis a question">'+
        '<button id="wzAsk">Ask</button></div>'+
      '<div class="wz-body" id="wzBody"></div></div>';
  document.body.appendChild(root);

  var bubble=document.getElementById('wzBubble'), bubbleImg=document.getElementById('wzBubbleImg'),
      panel=document.getElementById('wzPanel'), input=document.getElementById('wzInput'), body=document.getElementById('wzBody');

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function stateCard(img,b,sp){return '<div class="wz-state"><img src="'+img+'" alt=""><div class="wz-msg"><b>'+b+'</b><span>'+sp+'</span></div></div>';}
  function artRow(a){return '<button class="wz-art" data-id="'+a.id+'"><div class="wz-at">'+esc(a.title)+'</div><div class="wz-ac">'+esc(a.cat)+'</div></button>';}

  function renderIdle(){
    body.innerHTML =
      stateCard(ART.welcoming,'Welcome! Ask me anything.','Type a question above — exporting your data, how ICP tiers work, why it won\'t load…')+
      '<div class="wz-sect">Popular topics</div>'+
      ARTICLES.slice(0,5).map(artRow).join('');
    wireRows();
  }
  function runSearch(q){
    q=(q||'').trim().toLowerCase(); if(!q){renderIdle();return;}
    var words=q.split(/\s+/).filter(function(w){return w.length>1;});
    // Score every article, then rank best-first. (The old version was a plain filter that
    // returned any-word matches in array order, so with 40 articles the top hit was just
    // the earliest-listed match — e.g. "message templates" hit "messages" in another doc.)
    var hits=ARTICLES.map(function(a){
      var title=(a.title||'').toLowerCase(), keys=(a.k||'').toLowerCase(), cat=(a.cat||'').toLowerCase();
      var hay=title+' '+keys+' '+cat, s=0;
      if(title.indexOf(q)>-1) s+=100; else if(keys.indexOf(q)>-1) s+=50; else if(hay.indexOf(q)>-1) s+=25;
      words.forEach(function(w){
        if(title.indexOf(w)>-1) s+=10;
        try{ if(new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b').test(title)) s+=6; }catch(e){}
        if(keys.indexOf(w)>-1) s+=4;
        if(cat.indexOf(w)>-1) s+=2;
      });
      return {a:a,s:s};
    }).filter(function(x){return x.s>0;}).sort(function(x,y){return y.s-x.s;}).map(function(x){return x.a;});
    if(hits.length){
      body.innerHTML=stateCard(ART.got,'Here\'s what I got:',hits.length+' article'+(hits.length>1?'s':'')+' for "'+esc(q)+'".')+
        hits.map(artRow).join('');
    }else{
      body.innerHTML=stateCard(ART.shrug,'Hmm, I got nothin\' on that one.','Try different words, <button class="wz-link" id="wzReset">start over</button>, or <button class="wz-link" id="wzReport">📧 tell us what you needed</button>.');
      var r=document.getElementById('wzReset'); if(r)r.onclick=function(){input.value='';renderIdle();input.focus();};
      var rp=document.getElementById('wzReport'); if(rp)rp.onclick=function(){ gaReport({question:input.value.trim()}); };
    }
    wireRows();
  }
  function openArticle(id){
    var a=ARTICLES.filter(function(x){return x.id===id;})[0]; if(!a){renderIdle();return;}
    body.innerHTML='<button class="wz-back" id="wzBack">← Back</button>'+
      '<div class="wz-article"><h3>'+esc(a.title)+'</h3>'+a.body+'</div>';
    var bk=document.getElementById('wzBack');
    if(bk)bk.onclick=function(){ if(input.value.trim())runSearch(input.value); else renderIdle(); };
    body.scrollTop=0;
  }
  function wireRows(){ Array.prototype.forEach.call(body.querySelectorAll('.wz-art'),function(el){
    el.onclick=function(){openArticle(el.getAttribute('data-id'));}; }); }

  function open(){ panel.classList.add('wz-open'); bubble.style.display='none';
    if(!body.innerHTML)renderIdle(); setTimeout(function(){input.focus();},60); }
  function close(){ panel.classList.remove('wz-open'); bubble.style.display='flex'; }

  bubble.onclick=open;
  document.getElementById('wzClose').onclick=close;
  document.getElementById('wzAsk').onclick=function(){runSearch(input.value);};
  input.addEventListener('input',function(){runSearch(input.value);});
  input.addEventListener('keydown',function(e){if(e.key==='Enter')runSearch(input.value);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&panel.classList.contains('wz-open'))close();});
  bubble.addEventListener('mouseenter',function(){bubbleImg.src=ART.cheeky;});
  bubble.addEventListener('mouseleave',function(){bubbleImg.src=ART.avatar;});

  /* deep-link API: Willis.open(), Willis.ask('mobile'), Willis.article('why-mobile') */
  window.Willis = {
    open:open, close:close,
    ask:function(q){open();input.value=q||'';runSearch(input.value);},
    article:function(id){open();openArticle(id);}
  };

  /* ---------- universal report (used by 🐞 Report button + Willis no-match) ---------- */
  function parseUA(){
    var ua=navigator.userAgent, b='', os='Unknown OS', dev='Desktop', mt=function(re){var m=ua.match(re);return m?m[1]:'';};
    if(/Edg\//.test(ua)) b='Edge '+mt(/Edg\/(\d+)/);
    else if(/OPR\//.test(ua)) b='Opera '+mt(/OPR\/(\d+)/);
    else if(/Firefox\//.test(ua)) b='Firefox '+mt(/Firefox\/(\d+)/);
    else if(/Chrome\//.test(ua)) b='Chrome '+mt(/Chrome\/(\d+)/);
    else if(/Version\//.test(ua)&&/Safari\//.test(ua)) b='Safari '+mt(/Version\/(\d+)/);
    if(/Windows NT/.test(ua)) os='Windows';
    else if(/Mac OS X/.test(ua)) os='macOS';
    else if(/Android/.test(ua)){os='Android';dev='Mobile';}
    else if(/iPhone|iPod/.test(ua)){os='iOS';dev='Mobile';}
    else if(/iPad/.test(ua)){os='iPadOS';dev='Tablet';}
    else if(/Linux/.test(ua)) os='Linux';
    if(/Mobi/.test(ua)) dev='Mobile';
    return (b||'Unknown browser')+' · '+os+' · '+dev;
  }
  function gaDiag(o){
    o=o||{}; var L=[];
    if(o.feature){ L.push('Feature request: '+o.feature, '', '- Which language do you need? ', '- Anything else we should know? ', ''); }
    else if(o.question){ L.push('I couldn\'t find an answer in Willis for:', '  "'+o.question+'"', '', 'What were you trying to do?', ''); }
    else { L.push('Describe the issue:', '', '- What happened: ', '- What you expected: ', ''); }
    L.push('--- Diagnostics (auto-filled · no LinkedIn data) ---');
    L.push('Tool: '+document.title);
    L.push('Page: '+location.pathname+(o.question?' · via Willis':''));
    L.push('Browser: '+parseUA());
    L.push('Screen '+screen.width+'x'+screen.height+' · Window '+window.innerWidth+'x'+window.innerHeight);
    L.push('Theme: '+(document.documentElement.getAttribute('data-theme')||'dark'));
    try{ if(typeof D!=='undefined'&&D&&D.connections){ L.push('Loaded: '+D.connections.length+' connections · '+D.messages.length+' messages · '+D.reactions.length+' reactions · '+D.comments.length+' comments · '+D.shares.length+' shares · '+D.follows.length+' follows'); } }catch(_){}
    try{ if(typeof ICP!=='undefined'&&ICP){ L.push('ICP classified: '+ICP.length+' contacts'); } }catch(_){}
    try{ L.push('Console errors: '+((window.__gaErrs&&window.__gaErrs.length)?window.__gaErrs.slice(0,5).join(' | '):'none')); }catch(_){}
    L.push('UA (raw): '+navigator.userAgent);
    return L.join('\n');
  }
  function gaReport(o){
    o=o||{}; var EMAIL='rahul@growthautomated.ai';
    var subject='['+(o.feature?'LinkedIn Toolkit — feature request':(o.question?'Willis — unanswered':'LinkedIn Toolkit — issue'))+'] '+document.title;
    var ov=document.createElement('div'); ov.className='gar-ov';
    var card=document.createElement('div'); card.className='gar-card'; card.setAttribute('role','dialog'); card.setAttribute('aria-label','Send a report');
    card.innerHTML='<h3>📨 Send us a report</h3><p class="gar-sub">Edit if you like, then copy it or open your email. No LinkedIn data is included.</p>'+
      '<textarea class="gar-ta" id="garTa"></textarea>'+
      '<p class="gar-to">Goes to <b>'+EMAIL+'</b></p>'+
      '<div class="gar-btns"><button class="gar-b gar-primary" id="garCopy">📋 Copy report</button>'+
      '<button class="gar-b" id="garGmail">Open in Gmail</button>'+
      '<button class="gar-b" id="garMail">Open mail app</button></div>'+
      '<div class="gar-btns" style="margin-top:8px"><button class="gar-b" id="garClose">Close</button></div>';
    ov.appendChild(card); document.body.appendChild(ov);
    var ta=card.querySelector('#garTa'); ta.value=gaDiag(o);
    function done(){ if(ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.addEventListener('click',function(e){ if(e.target===ov)done(); });
    document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){done();document.removeEventListener('keydown',esc);} });
    card.querySelector('#garClose').onclick=done;
    card.querySelector('#garCopy').onclick=function(){ var btn=this;
      function ok(){ btn.textContent='✓ Copied — now email it'; }
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(ta.value).then(ok,function(){ta.select();try{document.execCommand('copy');}catch(_){}ok();}); }
      else { ta.select(); try{document.execCommand('copy');}catch(_){} ok(); } };
    card.querySelector('#garGmail').onclick=function(){ window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(EMAIL)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(ta.value),'_blank','noopener'); };
    card.querySelector('#garMail').onclick=function(){ window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(ta.value); };
    setTimeout(function(){ta.focus();ta.setSelectionRange(0,0);},40);
  }
  window.gaReport = gaReport;
  window.reportIssue = function(){ gaReport(); };   /* upgrade the existing 🐞 Report buttons site-wide */
})();
