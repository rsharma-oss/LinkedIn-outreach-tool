/* LinkVault — live upload monitor + privacy explainer (shared, all pages).
   Instruments every outbound data channel (fetch / XHR / sendBeacon / WebSocket) and counts the
   bytes this page sends as a REQUEST BODY (i.e. uploads). Library/font GETs have no body, so it
   stays at 0 unless the app ever tried to send your data — in which case it turns red instantly.
   Also injects a nav badge + a first-visit popup that explains Chrome's folder-permission prompt. */
(function(){
  if (window.__lvPrivacy) return; window.__lvPrivacy = true;
  var sent = 0;

  var BROWSER = (function(){
    try{ var br=navigator.userAgentData&&navigator.userAgentData.brands;
      if(br){ var n=br.map(function(x){return x.brand;}).join(' ');
        if(/Edge/i.test(n)) return 'Edge'; if(/OPR|Opera/i.test(n)) return 'Opera';
        if(/Brave/i.test(n)) return 'Brave'; if(/Google Chrome/i.test(n)) return 'Chrome'; } }catch(e){}
    var ua=navigator.userAgent||'';
    if(/Edg\//.test(ua)) return 'Edge'; if(/OPR\//.test(ua)) return 'Opera';
    if(/Chrome\//.test(ua)) return 'Chrome'; if(/Firefox\//.test(ua)) return 'Firefox';
    if(/Safari\//.test(ua)) return 'Safari'; return 'your browser';
  })();
  var HAS_FS = (typeof window!=='undefined' && 'showDirectoryPicker' in window); // folder picker (Chromium only)

  function fmt(n){ if(n<1024) return n+' B'; if(n<1048576) return (n/1024).toFixed(1)+' KB'; return (n/1048576).toFixed(1)+' MB'; }
  function sizeOf(b){ try{
    if(b==null) return 0;
    if(typeof b==='string') return new Blob([b]).size;
    if(b instanceof Blob) return b.size;
    if(b instanceof ArrayBuffer) return b.byteLength;
    if(b.byteLength!=null) return b.byteLength;
    if(typeof FormData!=='undefined' && b instanceof FormData){ var s=0; b.forEach(function(v){ s += (v&&v.size!=null)?v.size:String(v).length; }); return s; }
    if(typeof URLSearchParams!=='undefined' && b instanceof URLSearchParams) return new Blob([b.toString()]).size;
    return new Blob([String(b)]).size;
  }catch(e){ return 0; } }
  function add(n){ if(n>0){ sent += n; render(); } }
  window.__uploadBytes = function(){ return sent; };

  var _fetch = window.fetch;
  if(_fetch) window.fetch = function(input, init){ try{ var b=(init&&init.body); if(!b && input && typeof input==='object') b=input.body; if(b) add(sizeOf(b)); }catch(e){} return _fetch.apply(this, arguments); };
  try{ var _send = XMLHttpRequest.prototype.send; XMLHttpRequest.prototype.send = function(body){ try{ if(body) add(sizeOf(body)); }catch(e){} return _send.apply(this, arguments); }; }catch(e){}
  if(navigator.sendBeacon){ var _b = navigator.sendBeacon.bind(navigator); navigator.sendBeacon = function(url, data){ try{ if(data) add(sizeOf(data)); }catch(e){} return _b(url, data); }; }
  try{ if(window.WebSocket && WebSocket.prototype){ var _ws = WebSocket.prototype.send; WebSocket.prototype.send = function(d){ try{ if(d) add(sizeOf(d)); }catch(e){} return _ws.apply(this, arguments); }; } }catch(e){}

  var css =
  ".lvpm-badge{display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:700;padding:5px 11px;border-radius:999px;cursor:pointer;border:1px solid rgba(16,185,129,0.45);background:rgba(16,185,129,0.14);color:#34d399;font-family:inherit;white-space:nowrap;transition:all .15s;}"+
  ".lvpm-badge:hover{background:rgba(16,185,129,0.24);}"+
  ".lvpm-badge.alert{border-color:rgba(239,68,68,0.6);background:rgba(239,68,68,0.16);color:#f87171;}"+
  ".lvpm-dot{width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 0 0 rgba(16,185,129,0.5);animation:lvpm-pulse 2s infinite;}"+
  ".lvpm-badge.alert .lvpm-dot{background:#ef4444;animation:none;}"+
  "@keyframes lvpm-pulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,0.5);}70%{box-shadow:0 0 0 6px rgba(16,185,129,0);}100%{box-shadow:0 0 0 0 rgba(16,185,129,0);}}"+
  ".lvpm-ov{position:fixed;inset:0;background:rgba(2,6,16,0.66);display:none;align-items:center;justify-content:center;z-index:9000;padding:20px;}"+
  ".lvpm-ov.open{display:flex;}"+
  ".lvpm-modal{background:var(--card,#111827);border:1px solid var(--border2,rgba(255,255,255,0.13));border-radius:16px;max-width:460px;width:100%;padding:26px 26px 22px;color:var(--tx,#f0f4ff);box-shadow:0 24px 70px rgba(0,0,0,0.5);}"+
  ".lvpm-modal h3{font-size:1.15rem;font-weight:800;margin:0 0 6px;display:flex;align-items:center;gap:9px;}"+
  ".lvpm-modal p{font-size:0.84rem;line-height:1.6;color:var(--tx2,rgba(240,244,255,0.65));margin:0 0 12px;}"+
  ".lvpm-modal b{color:var(--tx,#f0f4ff);}"+
  ".lvpm-live{display:flex;align-items:center;gap:10px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:12px 14px;margin:4px 0 14px;}"+
  ".lvpm-live .lvpm-big{font-size:1.05rem;font-weight:800;color:#34d399;}"+
  ".lvpm-live.alert{background:rgba(239,68,68,0.12);border-color:rgba(239,68,68,0.4);}"+
  ".lvpm-live.alert .lvpm-big{color:#f87171;}"+
  ".lvpm-x{background:var(--li,#0A66C2);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit;width:100%;}";

  function el(html){ var d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstChild; }

  function buildModal(){
    if(document.getElementById('lvpm-ov')) return;
    var p1 = HAS_FS
      ? 'When you pick your export folder, <b>'+BROWSER+' asks permission to read it</b> — that’s its standard prompt for any site that opens a local folder. The files are read <b>only into this page’s memory</b>. LinkVault has no server and uploads nothing.'
      : 'Your export is read <b>only into this page’s memory</b> — '+BROWSER+' never sends it anywhere. LinkVault has no server and uploads nothing.';
    var p3 = HAS_FS
      ? 'Prefer not to grant folder access? Use <b>📁 Choose CSV Files</b> instead — same data, no folder prompt.'
      : 'Load your data with <b>📁 Choose CSV Files</b> — it never leaves your device.';
    var ov = el('<div class="lvpm-ov" id="lvpm-ov" role="dialog" aria-modal="true" aria-label="How LinkVault protects your data">'+
      '<div class="lvpm-modal">'+
        '<h3>🛡 Your data never leaves this page</h3>'+
        '<p>'+p1+'</p>'+
        '<p>Don’t take our word for it — watch the <b>live upload monitor</b> in the corner. It counts every byte this page tries to send to any server:</p>'+
        '<div class="lvpm-live" id="lvpm-live"><span class="lvpm-dot"></span><span class="lvpm-big" id="lvpm-live-n">0 B</span><span style="font-size:0.78rem;color:var(--tx2,rgba(240,244,255,0.65));">uploaded · stays at 0; turns red the instant anything is sent</span></div>'+
        '<p style="font-size:0.78rem;">'+p3+'</p>'+
        '<button class="lvpm-x" id="lvpm-x">Got it</button>'+
      '</div></div>');
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){ if(e.target===ov || e.target.id==='lvpm-x') close(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
  }
  function open(){ buildModal(); render(); document.getElementById('lvpm-ov').classList.add('open'); }
  function close(){ var o=document.getElementById('lvpm-ov'); if(o) o.classList.remove('open'); try{ localStorage.setItem('lv_privacy_ack','1'); }catch(e){} }
  window.openPrivacyMonitor = open;

  function injectBadge(){
    if(document.getElementById('lvpm-badge')) return;
    var badge = el('<button type="button" class="lvpm-badge" id="lvpm-badge" title="Live upload monitor — bytes this page has sent to any server. Click to learn more." aria-label="Live upload monitor: 0 bytes uploaded. Click to learn more."><span class="lvpm-dot"></span><span>🛡 <span class="lvpm-n">0 B</span> uploaded</span></button>');
    badge.addEventListener('click', open);
    var anchor = document.getElementById('theme-btn') || document.querySelector('.theme-toggle, [onclick*="toggleTheme"]');
    if(anchor && anchor.parentNode){ anchor.parentNode.insertBefore(badge, anchor); }
    else { badge.style.position='fixed'; badge.style.top='14px'; badge.style.right='16px'; badge.style.zIndex='8000'; document.body.appendChild(badge); }
  }
  function render(){
    var b=document.getElementById('lvpm-badge'); var alert = sent>0; var txt=fmt(sent);
    if(b){ b.classList.toggle('alert', alert); var n=b.querySelector('.lvpm-n'); if(n) n.textContent=txt; }
    var lv=document.getElementById('lvpm-live'); if(lv){ lv.classList.toggle('alert', alert); var ln=document.getElementById('lvpm-live-n'); if(ln) ln.textContent=txt; }
  }
  window.__renderUploadMonitor = render;

  function init(){
    var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
    injectBadge(); render();
    [].forEach.call(document.querySelectorAll('.lvpm-browser'), function(s){ s.textContent=BROWSER; });
    if(!HAS_FS) [].forEach.call(document.querySelectorAll('.lvpm-fs-note'), function(n){ n.style.display='none'; });
    var ack; try{ ack=localStorage.getItem('lv_privacy_ack'); }catch(e){}
    if(!ack) setTimeout(open, 900);
  }
  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
