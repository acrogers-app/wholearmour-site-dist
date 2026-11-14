/* What's Happening: recompute the next gathering in the visitor's browser, so the date never goes stale
   between builds. Second Saturday of the month, 5:00 PM; it rolls to next month 2 hours after the start. */
(function () {
  'use strict';
  var el = document.querySelector('[data-next-meeting]');
  if (!el) return;
  function sat2(y, m) { var d = new Date(y, m, 1), n = 0; while (true) { if (d.getDay() === 6 && ++n === 2) break; d.setDate(d.getDate() + 1); } d.setHours(17, 0, 0, 0); return d; }
  var now = new Date(), y = now.getFullYear(), m = now.getMonth(), d = sat2(y, m);
  if (now.getTime() > d.getTime() + 2 * 3600 * 1000) { m++; if (m > 11) { m = 0; y++; } d = sat2(y, m); }
  var today = now.toDateString() === d.toDateString();
  var label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + ' · 5:00 PM';
  el.innerHTML = '';
  var t = document.createElement('time');
  t.setAttribute('datetime', d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + 'T17:00');
  t.textContent = (today ? 'Today — ' : '') + label;
  el.appendChild(t);
})();
