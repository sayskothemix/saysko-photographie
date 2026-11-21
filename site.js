/* ============================================================
   SAYSKO PHOTOGRAPHIE — script commun aux pages
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Reveal au scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Header : effet au scroll + lien actif ---------- */
  var header = document.querySelector('header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Accordéons des cours ---------- */
  document.querySelectorAll('.cours-section-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var section = head.closest('.cours-section');
      if (!section) return;
      var open = section.classList.toggle('open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- Galerie : données ---------- */
  var FALLBACK = [
    { title: 'Lumière Dorée', src: 'galerie-AB9A7835.jpg', desc: 'Portrait · Studio' },
    { title: 'Noir & Blanc', src: 'galerie-AB9A7833_2.jpg', desc: 'Portrait · Studio' },
    { title: 'Portrait Studio', src: 'galerie-portrait_nette.jpg', desc: 'Portrait · Strobisme' },
    { title: 'Shooting Couple', src: 'galerie-AB9A7956.jpg', desc: 'Portrait · Studio' },
    { title: 'Denim', src: 'galerie-AB9A7830.jpg', desc: 'Portrait · Studio' },
    { title: 'Avant / Après', src: 'avant-apres.jpg', desc: 'Retouche · Studio' },
    { title: 'Shooting Extérieur', src: 'shooting-exterieur.jpg', desc: 'Lifestyle · Nature' }
  ];
  var photos = FALLBACK.slice();

  function loadData(cb) {
    fetch('/api/state', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var payload = d && d.data ? d.data : d;
        if (payload && Array.isArray(payload.photos) && payload.photos.length) photos = payload.photos;
        cb();
      })
      .catch(function () { cb(); });
  }

  /* ---------- Carrousel 3D ---------- */
  var viewport = document.getElementById('carouselViewport');
  var track = document.getElementById('carouselTrack');
  var dotsBox = document.getElementById('carDots');
  var counter = document.getElementById('carCount');
  var carIndex = 0;
  var autoTimer = null;
  var AUTO_DELAY = 8000;

  function radius() {
    var w = viewport ? viewport.clientWidth : 980;
    return Math.max(Math.round(w * 0.38), 340);
  }

  function updateCarousel() {
    if (!track || !photos.length) return;
    var slides = track.querySelectorAll('.slide');
    var dots = dotsBox ? dotsBox.querySelectorAll('.car-dot') : [];
    var total = photos.length;
    var step = 360 / total;
    var half = Math.floor(total / 2);
    var r = radius();

    slides.forEach(function (s, i) {
      var rel = i - carIndex;
      if (rel > half) rel -= total;
      if (rel < -half) rel += total;
      var angle = rel * step;
      var dist = Math.abs(rel);
      var active = rel === 0;
      var z = Math.round(-Math.abs(angle) / 180 * r * 1.55);
      var scale = Math.max(0.5, 1.04 - dist * 0.11);
      s.style.transform = 'translate(-50%, -50%) rotateY(' + angle.toFixed(1) + 'deg) translateZ(' + z + 'px) scale(' + scale.toFixed(3) + ')';
      s.style.opacity = active ? '1' : (dist > 2 ? '0.04' : '0.22');
      s.style.filter = active ? 'none' : 'blur(' + Math.min(dist * 1.4, 5).toFixed(1) + 'px) brightness(0.42)';
      s.style.zIndex = String(100 - dist);
      s.style.pointerEvents = active ? 'auto' : 'none';
      s.classList.toggle('is-active', active);
    });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === carIndex); });
    if (counter) counter.innerHTML = '<b>' + String(carIndex + 1).padStart(2, '0') + '</b> / ' + String(total).padStart(2, '0');
  }

  function goTo(i) {
    if (!photos.length) return;
    carIndex = (i + photos.length) % photos.length;
    updateCarousel();
    scheduleAuto();
  }

  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (!track || !photos.length) return;
    autoTimer = setTimeout(function () { goTo(carIndex + 1); }, AUTO_DELAY);
  }

  function renderGallery() {
    if (!track) return;
    track.innerHTML = '';
    if (dotsBox) dotsBox.innerHTML = '';
    var grid = document.getElementById('gridView');
    var story = document.getElementById('storyView');
    if (grid) grid.innerHTML = '';
    if (story) story.innerHTML = '';

    photos.forEach(function (p, i) {
      var slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = '<img src="' + p.src + '" alt="' + p.title + '">' +
        '<div class="overlay"><h3>' + p.title + '</h3><p>' + (p.desc || 'Photographie · Studio') + '</p><div class="view">Agrandir ↗</div></div>';
      slide.addEventListener('click', function () { if (slide.classList.contains('is-active')) lightbox(p.src, p.title); });
      track.appendChild(slide);

      if (dotsBox) {
        var dot = document.createElement('button');
        dot.className = 'car-dot';
        dot.setAttribute('aria-label', 'Aller à la photo ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsBox.appendChild(dot);
      }
      if (grid) {
        var g = document.createElement('div');
        g.className = 'grid-card';
        g.innerHTML = '<img src="' + p.src + '" alt="' + p.title + '"><div class="overlay"><h3>' + p.title + '</h3><p>' + (p.desc || 'Photographie · Studio') + '</p><div class="view">Agrandir ↗</div></div>';
        g.addEventListener('click', function () { lightbox(p.src, p.title); });
        grid.appendChild(g);
      }
      if (story) {
        var s = document.createElement('div');
        s.className = 'story-item reveal';
        s.innerHTML = '<img src="' + p.src + '" alt="' + p.title + '"><div class="story-caption"><h3>' + p.title + '</h3><p>' + (p.desc || 'Photographie · Studio') + '</p></div>';
        s.addEventListener('click', function () { lightbox(p.src, p.title); });
        story.appendChild(s);
      }
    });
    carIndex = 0;
    updateCarousel();
    scheduleAuto();
    if (story && 'IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); so.unobserve(e.target); } }); }, { threshold: 0.1 });
      story.querySelectorAll('.story-item').forEach(function (el) { so.observe(el); });
    }
  }

  /* ---------- Lightbox ---------- */
  function lightbox(src, title) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.style.cssText = 'position:fixed;inset:0;z-index:20000;background:rgba(3,3,5,.94);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:18px;cursor:zoom-out;padding:30px;';
    box.innerHTML = '<img src="' + src + '" alt="' + title + '" style="max-width:90vw;max-height:82vh;object-fit:contain;box-shadow:0 30px 90px rgba(0,0,0,.8);">' +
      '<div style="color:var(--accent);letter-spacing:3px;text-transform:uppercase;font-size:.7rem">' + title + ' — cliquez pour fermer</div>';
    box.addEventListener('click', function () { box.remove(); });
    document.body.appendChild(box);
  }

  /* ---------- Modes de visionnage ---------- */
  var viewMode = 'carousel';
  var views = { carousel: 'carouselViewport', grid: 'gridView', story: 'storyView' };
  document.querySelectorAll('.view-mode').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-view') || (btn.textContent.toLowerCase().includes('grille') ? 'grid' : btn.textContent.toLowerCase().includes('plein') ? 'story' : 'carousel');
      viewMode = mode;
      Object.keys(views).forEach(function (k) {
        var el = document.getElementById(views[k]);
        if (!el) return;
        if (k !== mode) { el.style.display = 'none'; return; }
        el.style.display = k === 'grid' ? 'grid' : (k === 'story' ? 'block' : 'block');
      });
      document.querySelectorAll('.view-mode').forEach(function (b) { b.classList.toggle('active', b === btn); });
      if (mode === 'carousel') { updateCarousel(); scheduleAuto(); }
      else clearTimeout(autoTimer);
    });
  });

  if (document.getElementById('carPrev')) document.getElementById('carPrev').addEventListener('click', function () { goTo(carIndex - 1); });
  if (document.getElementById('carNext')) document.getElementById('carNext').addEventListener('click', function () { goTo(carIndex + 1); });
  if (viewport) {
    viewport.addEventListener('mouseenter', function () { clearTimeout(autoTimer); });
    viewport.addEventListener('mouseleave', function () { scheduleAuto(); });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearTimeout(autoTimer); else scheduleAuto();
  });

  /* ---------- Formulaire de contact ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cfName');
      var email = document.getElementById('cfEmail');
      var msg = document.getElementById('cfMessage');
      var status = document.getElementById('cfStatus');
      if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
        if (status) status.textContent = 'Remplissez tous les champs.';
        return;
      }
      function done(ok) {
        if (status) {
          if (ok) {
            status.textContent = 'Message envoyé, merci !';
          } else {
            var href = 'mailto:sayskothemix+contact@gmail.com?subject=' + encodeURIComponent('Message depuis le site') + '&body=' + encodeURIComponent(msg.value.trim() + '\n\n' + name.value.trim() + ' — ' + email.value.trim());
            status.innerHTML = 'Envoi direct indisponible : <a href="' + href + '" style="color:var(--accent)">envoyer par e-mail</a>';
          }
        }
        if (ok) { name.value = ''; email.value = ''; msg.value = ''; }
      }
      fetch('/api/message', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.value.trim(), email: email.value.trim(), message: msg.value.trim() })
      }).then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); }).then(function (d) {
        done(!!(d && d.ok));
      }).catch(function () {
        done(false);
      });
    });
  }

  /* ---------- Bouton Admin (renvoie vers l'accueil) ---------- */
  var adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    if (/localhost|127\.0\.0\.1/.test(location.hostname)) {
      adminBtn.addEventListener('click', function () { window.location.href = 'index.html#admin'; });
    } else {
      adminBtn.style.display = 'none';
    }
  }

  /* ---------- Démarrage ---------- */
  loadData(renderGallery);
})();
