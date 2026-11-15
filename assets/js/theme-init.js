/* Runs in <head> before the page paints, so there is no flash of the wrong theme.
   A saved choice ("light"/"dark") wins; otherwise the device setting is used. */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('wa-theme'); } catch (e) {}
  var root = document.documentElement;
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  var dark = saved ? saved === 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.setAttribute('data-theme-resolved', dark ? 'dark' : 'light');
  /* Browser bar colour follows the header: the page's own (dark) value in dark, Parchment in light. */
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) { if (!m.hasAttribute('data-dark')) m.setAttribute('data-dark', m.getAttribute('content')); m.setAttribute('content', dark ? m.getAttribute('data-dark') : '#fffdf8'); }
})();
