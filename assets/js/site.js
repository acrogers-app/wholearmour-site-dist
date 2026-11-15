/* Shared enhancements: theme toggle, back-to-top, sync status. Every page works without this file. */
(function () {
  'use strict';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  /* ── Theme ── */
  function resolved() { var t = root.getAttribute('data-theme'); return t || (mq && mq.matches ? 'dark' : 'light'); }
  function paint() {
    var r = resolved();
    root.setAttribute('data-theme-resolved', r);
    var tc = document.querySelector('meta[name="theme-color"][data-dark]');
    if (tc) tc.setAttribute('content', r === 'dark' ? tc.getAttribute('data-dark') : '#fffdf8');
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      var next = r === 'dark' ? 'light' : 'dark';
      b.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      b.setAttribute('title', 'Switch to ' + next + ' mode');
    });
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = resolved() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('wa-theme', next); } catch (e) {}
      paint();
    });
  });
  document.querySelectorAll('[data-theme-reset]').forEach(function (b) {
    b.addEventListener('click', function () {
      root.removeAttribute('data-theme');
      try { localStorage.removeItem('wa-theme'); } catch (e) {}
      paint();
    });
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', paint);
  paint();

  /* ── Phone nav: fade hint while more links are hidden; keep the current page's link in view ── */
  document.querySelectorAll('nav[aria-label="Primary"]').forEach(function (nav) {
    function update() { nav.classList.toggle('has-more', nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 2); }
    var cur = nav.querySelector('[aria-current="page"]');
    if (cur && nav.scrollWidth > nav.clientWidth) {
      var over = cur.getBoundingClientRect().right - nav.getBoundingClientRect().right + 64;  /* +64: let the next link peek in under the fade */
      if (over > 0) nav.scrollLeft += over;            /* scrolls only the nav row, never the page */
    }
    nav.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ── Back to top ── */
  var top = document.querySelector('.to-top');
  if (top) {
    var onScroll = function () { top.classList.toggle('is-visible', window.scrollY > 600); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ── Sync status: "Last synced" comes from /sync.json, written by the server's sync job. ── */
  var box = document.querySelector('[data-sync]');
  if (box) {
    var syncedEl = box.querySelector('[data-sync-synced] span');
    var warn = document.querySelector('[data-sync-warn]');
    var STALE_MS = 2 * 60 * 60 * 1000;   /* job runs every 15 min; warn after 2 hours of silence */
    fetch('/sync.json', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (s) {
        var t = new Date(s.lastSynced);
        if (isNaN(t)) throw new Error('bad date');
        syncedEl.textContent = t.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
        if (Date.now() - t.getTime() > STALE_MS && warn) warn.hidden = false;
      })
      .catch(function () {
        syncedEl.textContent = 'unavailable';
        if (warn) { warn.textContent = 'Sync status unavailable — this page may be out of date.'; warn.hidden = false; }
      });
  }
})();
