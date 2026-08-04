/* Maryam Fardinfard — gallery interactions */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hover zoom: transform-origin follows cursor so moving across a piece pans
     through its detail; stays zoomed until the cursor leaves. */
  document.querySelectorAll('[data-zoom]').forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img || reduced) return;
    fig.addEventListener('mousemove', function (e) {
      var r = fig.getBoundingClientRect();
      img.style.transformOrigin =
        ((e.clientX - r.left) / r.width) * 100 + '% ' +
        ((e.clientY - r.top) / r.height) * 100 + '%';
    });
    fig.addEventListener('mouseleave', function () {
      setTimeout(function () { img.style.transformOrigin = '50% 50%'; }, 600);
    });
  });

  /* Category filters */
  var btns = document.querySelectorAll('.filters button');
  var items = document.querySelectorAll('.art');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (o) { o.classList.remove('on'); });
      b.classList.add('on');
      var f = b.getAttribute('data-f'), shown = 0;
      items.forEach(function (it) {
        var show = f === 'all' || it.getAttribute('data-cat') === f;
        it.classList.toggle('hide', !show);
        if (show) shown++;
      });
      var c = document.querySelector('.count');
      if (c) c.textContent = shown + ' works';
    });
  });

  /* Lightbox with museum label */
  var lb = document.getElementById('lb');
  if (lb) {
    var img = lb.querySelector('.lb-fig img'),
        code = lb.querySelector('.lb-code'),
        title = lb.querySelector('.lb-title'),
        meta = lb.querySelector('.lb-meta'),
        desc = lb.querySelector('.lb-desc'),
        inq = lb.querySelector('.inq');

    document.querySelectorAll('.art').forEach(function (it) {
      it.querySelector('figure').addEventListener('click', function () {
        var d = it.dataset;
        img.src = 'images/art/' + d.code + '.webp';
        img.alt = d.title;
        code.textContent = d.code + '  ·  ' + d.catLabel;
        title.textContent = d.title;
        var m = [d.year, d.size, d.medium].filter(Boolean).join('  ·  ');
        meta.textContent = m; meta.style.display = m ? '' : 'none';
        desc.textContent = d.desc; desc.style.display = d.desc ? '' : 'none';
        inq.href = 'inquire.html?code=' + d.code;
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
      for (var i = 0; i < sel.options.length; i++)
        if (sel.options[i].value === v) { sel.value = v; break; }
    }
  }

  /* web3forms AJAX submit — domain-independent; redirects to thanks on success */
  var f = document.getElementById('inquiry-form');
  if (f) {
    var btn = f.querySelector('button[type=submit]');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.botcheck && f.botcheck.checked) return;
      btn.disabled = true; var t = btn.textContent; btn.textContent = 'Sending…';
      fetch(f.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(f) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) location.href = 'thanks.html';
          else { btn.disabled = false; btn.textContent = t; alert('Something went wrong — please email hello@maryvision.art directly.'); }
        })
        .catch(function () { btn.disabled = false; btn.textContent = t; alert('Network error — please email hello@maryvision.art directly.'); });
    });
  }
})();
