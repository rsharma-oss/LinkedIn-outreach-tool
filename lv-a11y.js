/* LinkVault — accessibility enhancer (shared, all pages).

   The apps grew a lot of `<div onclick>` / `<th onclick>` controls: sortable table
   headers, view tabs, filter chips. They work fine with a mouse and are completely
   unusable with a keyboard — a WCAG 2.1.1 (Keyboard) failure, and the kind of thing
   that's tedious to fix element-by-element and easy to regress.

   So fix the class, not the instances: promote every non-native click target to a
   real keyboard control, and give the dialogs the focus behaviour people expect.
   Runs on load and again whenever the DOM changes (the tables re-render constantly). */
(function () {
  if (window.__lvA11y) return; window.__lvA11y = true;

  var NATIVE = { BUTTON: 1, A: 1, INPUT: 1, SELECT: 1, TEXTAREA: 1, SUMMARY: 1 };

  /* 1 — make click-only controls keyboard-operable ------------------------- */
  function promote(root) {
    var els = (root || document).querySelectorAll('[onclick]:not([data-lva11y])');
    [].forEach.call(els, function (el) {
      if (NATIVE[el.tagName]) { el.setAttribute('data-lva11y', 'native'); return; }
      el.setAttribute('data-lva11y', '1');
      if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
      if (!el.getAttribute('role')) {
        // a sortable column header stays a columnheader; everything else reads as a button
        el.setAttribute('role', el.tagName === 'TH' ? 'columnheader' : 'button');
      }
      if (el.tagName === 'TH' && !el.hasAttribute('aria-sort')) el.setAttribute('aria-sort', 'none');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          el.click();
        }
      });
    });
  }

  /* 2 — visible focus everywhere (several controls had none) --------------- */
  function focusStyles() {
    if (document.getElementById('lv-a11y-css')) return;
    var st = document.createElement('style');
    st.id = 'lv-a11y-css';
    st.textContent =
      ':focus-visible{outline:3px solid #0a66c2 !important;outline-offset:2px !important;border-radius:4px;}' +
      '[data-lva11y="1"]:focus-visible{outline:3px solid #0a66c2 !important;outline-offset:-2px !important;}' +
      '.lv-skip{position:absolute;left:-9999px;top:0;z-index:9999;background:#0a66c2;color:#fff;' +
      'padding:10px 16px;border-radius:0 0 8px 0;font-weight:700;text-decoration:none;}' +
      '.lv-skip:focus{left:0;}';
    document.head.appendChild(st);
  }

  /* 3 — landmarks + skip link --------------------------------------------- */
  function landmarks() {
    var main = document.querySelector('main,[role="main"]');
    if (!main) {
      main = document.querySelector('#app .main') || document.querySelector('#app') ||
             document.querySelector('.section-inner') || document.body;
      if (main && main !== document.body) { main.setAttribute('role', 'main'); main.id = main.id || 'lv-main'; }
    }
    if (main && main !== document.body && !document.querySelector('.lv-skip')) {
      var a = document.createElement('a');
      a.className = 'lv-skip'; a.href = '#' + (main.id || 'lv-main');
      a.textContent = 'Skip to main content';
      document.body.insertBefore(a, document.body.firstChild);
    }
    var hdr = document.querySelector('.hdr, header'); if (hdr && !hdr.getAttribute('role')) hdr.setAttribute('role', 'banner');
  }

  /* 4 — dialogs: role, ESC to close, focus in, focus back ------------------ */
  var lastFocus = null;
  function firstFocusable(box) {
    return box.querySelector('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
  }
  function watchDialog(sel, isOpen, close) {
    var box = document.querySelector(sel); if (!box) return;
    if (!box.getAttribute('role')) box.setAttribute('role', 'dialog');
    if (!box.getAttribute('aria-modal')) box.setAttribute('aria-modal', 'true');
    var was = isOpen(box);
    setInterval(function () {
      var now = isOpen(box);
      if (now === was) return;
      was = now;
      if (now) {                                   // opened → remember + move focus in
        lastFocus = document.activeElement;
        var f = firstFocusable(box); if (f) setTimeout(function () { f.focus(); }, 30);
      } else if (lastFocus && lastFocus.focus) {   // closed → hand focus back
        try { lastFocus.focus(); } catch (e) {}
        lastFocus = null;
      }
    }, 250);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen(box)) { e.stopPropagation(); close(); }
    });
  }

  function init() {
    focusStyles();
    landmarks();
    promote(document);

    // ICP customizer — was mouse-only: no role, no ESC, focus never entered it
    watchDialog('#icpEditOv',
      function (b) { return b.style.display && b.style.display !== 'none'; },
      function () { if (typeof window.closeICPEditor === 'function') window.closeICPEditor(); });

    // relationship popover — ESC should dismiss it like any transient layer
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var p = document.getElementById('wm-pop');
      if (p && p.classList.contains('open')) { p.classList.remove('open'); if (lastFocus) try { lastFocus.focus(); } catch (x) {} }
    });

    // tables/tabs re-render constantly — re-promote whatever appears
    if (window.MutationObserver) {
      var mo = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) if (muts[i].addedNodes.length) { promote(document); return; }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
