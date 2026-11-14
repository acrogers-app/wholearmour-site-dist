/* Archive: filter the server-rendered list by text and series. Without JS, every lesson is listed. */
(function () {
  'use strict';
  var form = document.querySelector('[data-archive-form]');
  var list = document.querySelector('[data-archive-list]');
  if (!form || !list) return;
  var items = Array.prototype.slice.call(list.querySelectorAll('.lesson-item'));
  var q = form.querySelector('#q'), s = form.querySelector('#series');
  var count = document.querySelector('[data-archive-count]');
  var empty = document.querySelector('[data-archive-empty]');
  var params = new URLSearchParams(location.search);
  if (params.get('q')) q.value = params.get('q');
  if (params.get('series')) s.value = params.get('series');
  function apply() {
    var words = q.value.toLowerCase().split(/\s+/).filter(Boolean), ser = s.value, shown = 0;
    items.forEach(function (li) {
      var text = li.getAttribute('data-text');
      var ok = (!ser || li.getAttribute('data-series') === ser) && words.every(function (w) { return text.indexOf(w) !== -1; });
      li.hidden = !ok; if (ok) shown++;
    });
    if (count) count.textContent = (q.value || ser) ? shown + ' of ' + items.length + ' lessons shown' : '';
    if (empty) empty.hidden = shown !== 0;
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  q.addEventListener('input', apply); s.addEventListener('change', apply);
  apply();
})();
