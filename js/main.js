/* Maryam Fardinfard — gallery interactions */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hover zoom: image zooms on enter, transform-origin follows cursor so
     moving across the piece pans through its detail; resets on leave. */
  document.querySelectorAll('[data-zoom]').forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img || reduced) return;
    fig.addEventListener('mousemove', function (e) {
      var r = fig.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      img.style.transformOrigin = x + '% ' + y + '%';
    });
    fig.addEventListener('mouseleave', function () {
      setTimeout(function () { img.style.transformOrigin = '50% 50%'; }, 550);
    });
  });

  /* Category filters */
  var btns = document.querySelectorAll('.filters button');
  var items = document.querySelectorAll('.art');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (o) { o.classList.remove('on'); });
      b.classList.add('on');
      var f = b.getAttribute('data-f');
      var shown = 0;
      items.forEach(function (it) {
        var show = f === 'all' || it.getAttribute('data-cat') === f;
        it.classList.toggle('hide', !show);
        if (show) shown++;
      });
      var c = document.querySelector('.count');
      if (c) c.textContent = String(shown).padStart(2, '0') + ' works';
    });
  });

  /* Lightbox */
  var lb = document.getElementById('lb');
  if (lb) {
    var lbImg = lb.querySelector('img'),
        lbCode = lb.querySelector('.code'),
        lbCat = lb.querySelector('.cat'),
        lbInq = lb.querySelector('.inq');
    items.forEach(function (it) {
      it.querySelector('figure').addEventListener('click', function () {
        var code = it.getAttribute('data-code');
        lbImg.src = 'images/art/' + code + '.jpg';
        lbImg.alt = code;
        lbCode.textContent = code;
        lbCat.textContent = it.getAttribute('data-label');
        lbInq.href = 'inquire.html?code=' + code;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    lb.querySelector('.x').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* Inquiry page: preselect artwork code from ?code= */
  var sel = document.getElementById('artwork-code');
  if (sel) {
    var m = location.search.match(/code=([A-Za-z0-9-]+)/);
    if (m) {
      var v = m[1].toUpperCase();
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === v) { sel.value = v; break; }
      }
    }
  }
})();

/* web3forms AJAX submit — domain-independent, redirects to thanks page on success */
(function () {
  var f = document.getElementById('inquiry-form');
  if (!f) return;
  var btn = f.querySelector('button[type=submit]');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (f.botcheck && f.botcheck.checked) return;
    btn.disabled = true; var t = btn.textContent; btn.textContent = 'Sending…';
    fetch(f.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(f) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.success) { location.href = 'thanks.html'; }
        else { btn.disabled = false; btn.textContent = t; alert('Something went wrong — please email hello@maryvision.art directly.'); }
      })
      .catch(function () { btn.disabled = false; btn.textContent = t; alert('Network error — please email hello@maryvision.art directly.'); });
  });
})();
