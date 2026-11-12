/* ============================================================
   LinkVault chrome — shared behaviour (v1.2)

   - FOUC-safe theme attribute (sets data-theme="dark" | "light"
     before first paint if this file is loaded in <head>; defer
     loaders should NOT rely on this for FOUC — the inline FOUC
     snippet in each page's <head> does that).
   - Step-pill active/complete/locked state from the current URL
     and the cache keys set by the apps.
   - Thin bindings for the right-cluster buttons so the new chrome
     calls each page's existing handlers (toggleTheme, Willis, etc.)
     without having to rewrite them.
   ============================================================ */
(function(){
  'use strict';

  var doc = document;
  var STEPS = [
    { key:'dashboard', href:'/dashboard.html',  match:/\/dashboard(?:\.html)?$|\/dashboard-demo/,  cache:['ga_csv_cache'] },
    { key:'icp',       href:'/icp-finder.html', match:/\/icp-finder(?:\.html)?$|\/icp-demo|\/icp-finder-prototype|\/icp-finder-offline/, cache:['ga_icp_data'] },
    { key:'playbook',  href:'/playbook',        match:/\/playbook(?:\.html)?$|\/outreach-playbook-demo/, cache:['ga_icp_data'] }
  ];

  function hasCache(keys){
    try {
      for (var i=0;i<keys.length;i++){
        var k = keys[i];
        if (localStorage.getItem(k) || sessionStorage.getItem(k)) return true;
      }
    } catch(e){}
    return false;
  }

  function setStepStates(){
    var path = location.pathname || '/';
    var anyLoaded = hasCache(['ga_csv_cache']);
    STEPS.forEach(function(step, i){
      var el = doc.querySelector('.lv-step[data-step="'+step.key+'"]');
      if (!el) return;
      el.classList.remove('is-active','is-complete','is-locked');
      var isCurrent = step.match.test(path);
      if (isCurrent) el.classList.add('is-active');
      else if (hasCache(step.cache)) el.classList.add('is-complete');
      else if (!anyLoaded && i > 0) el.classList.add('is-locked'); // lock later steps until data exists
    });
  }

  function setDataChip(){
    var chip = doc.getElementById('lv-data-chip');
    if (!chip) return;
    var hasAny = hasCache(['ga_csv_cache']);
    var text = chip.querySelector('.lv-data-chip-text');
    chip.classList.remove('is-empty','is-live','is-partial','is-failed');
    if (hasAny){
      chip.classList.add('is-live');
      if (text) text.textContent = 'Data loaded';
    } else {
      chip.classList.add('is-empty');
      if (text) text.textContent = 'No data';
    }
  }

  function updateThemeLabel(){
    var label = doc.querySelector('.lv-theme-label');
    var icon  = doc.querySelector('.lv-theme-icon');
    var dark = doc.documentElement.getAttribute('data-theme') === 'dark';
    if (label) label.textContent = dark ? 'Theme: Dark' : 'Theme: Light';
    if (icon)  icon.textContent  = dark ? '🌙' : '☀️';
  }

  function bindRightCluster(){
    // Theme toggle — reuses any pre-existing toggleTheme(), else flips the attribute + ga_theme itself.
    var themeBtn = doc.getElementById('lv-theme-btn');
    if (themeBtn){
      themeBtn.addEventListener('click', function(){
        if (typeof window.toggleTheme === 'function') {
          window.toggleTheme();
        } else {
          var now = doc.documentElement.getAttribute('data-theme');
          var next = now === 'dark' ? 'light' : 'dark';
          doc.documentElement.setAttribute('data-theme', next);
          try { localStorage.setItem('ga_theme', next); } catch(e){}
        }
        updateThemeLabel();
        if (typeof window.applyChartTheme === 'function') window.applyChartTheme();
      });
    }

    // Willis — opens the floating help widget if loaded.
    var willisBtn = doc.getElementById('lv-willis-btn');
    if (willisBtn){
      willisBtn.addEventListener('click', function(){
        if (window.Willis && typeof window.Willis.open === 'function') window.Willis.open();
      });
    }

    // Add files — defer to per-page handlers (addFiles / openFolderPicker / openZipPicker). Hide if none exist.
    var addBtn = doc.getElementById('lv-add-files-btn');
    if (addBtn){
      var handler = window.addFiles || window.openFolderPicker || window.handleAddFiles || null;
      if (handler){
        addBtn.addEventListener('click', handler);
      } else {
        addBtn.hidden = true;
      }
    }

    // Data chip — click opens the live upload monitor if the privacy-monitor script exposed one.
    var chip = doc.getElementById('lv-data-chip');
    if (chip){
      chip.addEventListener('click', function(){
        if (window.openUploadMonitor) window.openUploadMonitor();
        else if (window.lvpmOpen) window.lvpmOpen();
      });
    }
  }

  function init(){
    setStepStates();
    setDataChip();
    updateThemeLabel();
    bindRightCluster();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();

  // Expose for debugging / app-side refresh after a load.
  window.LVChrome = { refresh: init, setStepStates: setStepStates, setDataChip: setDataChip };
})();
