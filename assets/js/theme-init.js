/* Runs in <head> before the page paints, so there is no flash of the wrong theme.
   A saved choice ("light"/"dark") wins; otherwise the device setting is used. */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('wa-theme'); } catch (e) {}
  var root = document.documentElement;
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  var dark = saved ? saved === 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.setAttribute('data-theme-resolved', dark ? 'dark' : 'light');
})();
