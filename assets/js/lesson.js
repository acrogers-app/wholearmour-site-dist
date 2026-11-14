/* Lesson page: print, share/copy link, and private notes saved on this device only. */
(function () {
  'use strict';
  document.querySelectorAll('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });

  document.querySelectorAll('[data-share]').forEach(function (b) {
    var msg = b.parentNode.querySelector('[data-share-msg]');
    b.addEventListener('click', function () {
      var url = b.getAttribute('data-url'), title = b.getAttribute('data-title');
      if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () { if (msg) msg.textContent = 'Link copied.'; },
          function () { if (msg) msg.textContent = url; });
      } else if (msg) { msg.textContent = url; }
    });
  });

  document.querySelectorAll('[data-notes]').forEach(function (ta) {
    var key = 'wa-notes-' + ta.getAttribute('data-notes');
    var status = ta.parentNode.querySelector('[data-notes-status]');
    try { ta.value = localStorage.getItem(key) || ''; } catch (e) { if (status) status.textContent = 'Notes can\'t be saved in this browser.'; return; }
    var timer;
    ta.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        try { localStorage.setItem(key, ta.value); if (status) status.textContent = 'Saved on this device.'; }
        catch (e) { if (status) status.textContent = 'Couldn\'t save. Copy your notes somewhere safe.'; }
      }, 400);
    });
  });
})();
