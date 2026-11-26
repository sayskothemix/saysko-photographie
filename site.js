/* ============================================================
   SAYSKO PHOTOGRAPHIE — script commun aux pages
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Retour à la version mobile ---------- */
  (function () {
    var fromMobile = false;
    try { fromMobile = sessionStorage.getItem('saysko_from_mobile') === '1'; } catch (e) {}
    if (!fromMobile) return;
    var a = document.createElement('a');
    a.href = 'mobile.html';
    a.textContent = '◄ Mobile';
    a.setAttribute('aria-label', 'Retour à la version mobile');
    a.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:9999;padding:9px 13px;background:rgba(8,11,18,.92);border:1px solid rgba(169,199,232,.5);color:#a9c7e8;font:600 .62rem Montserrat,sans-serif;letter-spacing:1px;text-transform:uppercase;text-decoration:none;border-radius:3px;box-shadow:0 6px 18px rgba(0,0,0,.5)';
    document.body.appendChild(a);
  })();

  /* ---------- Reveal au scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { rootMargin: '200px 0px', threshold: 0 });
    reveals.forEach(function (el) { ro.observe(el); });
    // Sécurité : révéler ce qui est déjà dans la fenêtre au chargement
    reveals.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + 200 && r.bottom > -200) el.classList.add('visible');
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }
  // Les cartes injectées après le chargement (grilles de schémas) doivent aussi apparaître
  window.addEventListener('load', function () {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + 200 && r.bottom > -200) el.classList.add('visible');
    });
  });

  /* ---------- Header : effet au scroll + lien actif ---------- */
  var header = document.querySelector('header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Compteurs du menu « Apprendre » ---------- */
  (function () {
    var targets = {
      cours: ['cours.html', '.cours-section'],
      glossaire: ['glossaire.html', '.gloss-card'],
      eclairage: ['eclairage.html', '.lc-section']
    };
    var spans = document.querySelectorAll('.nav-count[data-count]');
    if (!spans.length) return;
    Object.keys(targets).forEach(function (key) {
      var conf = targets[key];
      fetch(conf[0]).then(function (r) { return r.ok ? r.text() : Promise.reject(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var n = doc.querySelectorAll(conf[1]).length;
          if (!n) return;
          spans.forEach(function (s) { if (s.dataset.count === key) s.textContent = '(' + n + ')'; });
        })
        .catch(function () {});
    });
  })();

  /* ---------- Accordéons des cours ---------- */
  document.querySelectorAll('.cours-section-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var section = head.closest('.cours-section');
      if (!section) return;
      var open = section.classList.toggle('open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
      var btnLbl = section.querySelector('.btn-lbl');
      if (btnLbl) btnLbl.textContent = open ? 'Fermer' : 'Ouvrir';
    });
  });

  /* ---------- Menu déroulant de navigation ---------- */
  function closeNavDropdowns(except) {
    document.querySelectorAll('.nav-dropdown.open').forEach(function (drop) {
      if (drop === except) return;
      drop.classList.remove('open');
      var btn = drop.querySelector('.nav-drop-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.nav-dropdown').forEach(function (drop) {
    var btn = drop.querySelector('.nav-drop-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !drop.classList.contains('open');
      closeNavDropdowns(drop);
      drop.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) closeNavDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNavDropdowns();
  });

  /* ---------- Vidéos chargées au clic ---------- */
  document.querySelectorAll('.cours-video-frame iframe[src*="youtube"]').forEach(function (iframe) {
    var frame = iframe.closest('.cours-video-frame');
    if (!frame) return;
    var src = iframe.getAttribute('src') || '';
    var match = src.match(/embed\/([^?&]+)/);
    if (!match) return;
    var videoId = match[1];
    var title = iframe.getAttribute('title') || 'Lire la vidéo';
    var poster = 'url("https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg")';
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'cours-video-lazy';
    button.style.backgroundImage = poster;
    button.setAttribute('aria-label', 'Lire la vidéo : ' + title);
    button.innerHTML = '<span class="cours-video-play" aria-hidden="true"><span>▶</span></span>';
    button.addEventListener('click', function () {
      var player = document.createElement('iframe');
      player.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&mute=0&rel=0&playsinline=1&controls=1';
      player.title = title;
      player.loading = 'eager';
      player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      player.allowFullscreen = true;
      frame.replaceChildren(player);
    });
    frame.replaceChildren(button);
  });

  /* ---------- Galerie : données ---------- */
  var FALLBACK = [
    { title: 'Lumière Dorée', src: 'galerie-AB9A7835.jpg', desc: 'Portrait · Studio' },
    { title: 'Noir & Blanc', src: 'galerie-AB9A7833_2.jpg', desc: 'Portrait · Studio' },
    { title: 'Portrait Studio', src: 'galerie-portrait_nette.jpg', desc: 'Portrait · Strobisme' },
    { title: 'Shooting Couple', src: 'galerie-AB9A7956.jpg', desc: 'Portrait · Studio' },
    { title: 'Denim', src: 'galerie-AB9A7830.jpg', desc: 'Portrait · Studio' },
    { title: 'Shooting Extérieur', src: 'shooting-exterieur.jpg', desc: 'Lifestyle · Nature' }
  ];
  var photos = FALLBACK.slice();
  var activeFilter = 'all';

  function addLocalPhotos() {
    // Photos ajoutées localement par le propriétaire (visibles sur ce navigateur seulement).
    try {
      var extra = JSON.parse(localStorage.getItem('saysko_gallery_extra') || '[]');
      if (Array.isArray(extra) && extra.length) photos = photos.concat(extra);
    } catch (e) {}
  }
  function loadData(cb) {
    if (!/localhost|127\.0\.0\.1|trycloudflare\.com/.test(location.hostname)) { addLocalPhotos(); cb(); return; }
    fetch('/api/state', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var payload = d && d.data ? d.data : d;
        if (payload && Array.isArray(payload.photos) && payload.photos.length) photos = payload.photos;
        addLocalPhotos();
        cb();
      })
      .catch(function () { addLocalPhotos(); cb(); });
  }

  /* ---------- Carrousel 3D ---------- */
  var viewport = document.getElementById('carouselViewport');
  var track = document.getElementById('carouselTrack');
  var dotsBox = document.getElementById('carDots');
  var counter = document.getElementById('carCount');
  var carIndex = 0;
  var autoTimer = null;
  var AUTO_DELAY = 8000;
  var tiltX = 0, tiltY = 0;
  var dragActive = false, dragStartX = 0, dragStartIndex = 0, dragVel = 0, inertiaRaf = null;
  var flashTimer = null;

  /* ---------- Carrousel : habitacle studio (faisceau, rideau, slate) ---------- */
  function ensureChrome() {
    if (!viewport) return;
    if (!viewport.querySelector('.car-beam')) {
      var beam = document.createElement('div');
      beam.className = 'car-beam';
      viewport.appendChild(beam);
    }
    if (!viewport.querySelector('.car-slate')) {
      var slate = document.createElement('div');
      slate.className = 'car-slate';
      slate.innerHTML = '<span class="slate-label">Plan</span><span class="slate-num" id="carSlateNum">01</span>';
      viewport.appendChild(slate);
    }
  }

  function triggerFlash() {
    if (!viewport) return;
    viewport.classList.remove('flashing');
    void viewport.offsetWidth;
    viewport.classList.add('flashing');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { viewport.classList.remove('flashing'); }, 1300);
  }

  function radius() {
    var w = viewport ? viewport.clientWidth : 980;
    return Math.max(Math.round(w * 0.48), 420);
  }

  function updateCarousel() {
    if (!track || !photos.length) return;
    var slides = track.querySelectorAll('.slide');
    var dots = dotsBox ? dotsBox.querySelectorAll('.car-dot') : [];
    var total = slides.length || photos.length;
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
      s.style.transform = 'translate(-50%, -50%) rotateX(' + tiltX.toFixed(2) + 'deg) rotateY(' + (angle + tiltY).toFixed(1) + 'deg) translateZ(' + z + 'px) scale(' + scale.toFixed(3) + ')';
      s.style.opacity = active ? '1' : (dist > 2 ? '0.04' : '0.22');
      s.style.filter = active ? 'none' : 'blur(' + Math.min(dist * 1.4, 5).toFixed(1) + 'px) brightness(0.42)';
      s.style.zIndex = String(100 - dist);
      s.style.pointerEvents = active ? 'auto' : 'none';
      s.classList.toggle('is-active', active);
    });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === carIndex); });
    if (counter) counter.innerHTML = '<b>' + String(carIndex + 1).padStart(2, '0') + '</b> / ' + String(total).padStart(2, '0');
    var slateNum = document.getElementById('carSlateNum');
    if (slateNum) slateNum.textContent = String(carIndex + 1).padStart(2, '0');
  }

  function goTo(i) {
    var n = track ? track.querySelectorAll('.slide').length : photos.length;
    if (!n) return;
    carIndex = (i + n) % n;
    updateCarousel();
    triggerFlash();
    scheduleAuto();
  }

  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (!track || !photos.length) return;
    autoTimer = setTimeout(function () { goTo(carIndex + 1); }, AUTO_DELAY);
  }

  function renderGallery() {
    if (!track) return;
    ensureChrome();
    track.innerHTML = '';
    if (dotsBox) dotsBox.innerHTML = '';
    var grid = document.getElementById('gridView');
    var story = document.getElementById('storyView');
    if (grid) grid.innerHTML = '';
    if (story) story.innerHTML = '';

    var visiblePhotos = photos.filter(function (p) {
      if (activeFilter === 'all') return true;
      return ((p.desc || '') + ' ' + (p.title || '')).toLowerCase().indexOf(activeFilter.toLowerCase()) !== -1;
    });
    if (!visiblePhotos.length) visiblePhotos = photos;

    visiblePhotos.forEach(function (p, i) {
      var slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = '<img src="' + p.src + '" alt="">' +
        '<div class="overlay"><h3>' + p.title + '</h3><p>' + (p.desc || 'Photographie · Studio') + '</p><div class="view">Agrandir ↗</div></div>' +
        '<div class="photo-watermark"><span class="wm-mark">◆</span>SAYSKO<span class="wm-dot">·</span>STUDIO</div>';
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
        g.innerHTML = '<span class="grid-num">' + String(i + 1).padStart(2, '0') + '</span><img src="' + p.src + '" alt="' + p.title + '"><div class="overlay"><h3>' + p.title + '</h3><p>' + (p.desc || 'Photographie · Studio') + '</p><div class="view">Agrandir ↗</div></div>';
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
  /* ---------- Inclinaison 3D et reflet suivant le curseur ---------- */
  if (viewport && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    viewport.addEventListener('pointermove', function (e) {
      var r = viewport.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      tiltY = (px - 0.5) * 6;
      tiltX = (0.5 - py) * 4;
      viewport.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      viewport.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      updateCarousel();
    });
    viewport.addEventListener('pointerleave', function () {
      tiltX = 0; tiltY = 0;
      updateCarousel();
    });

    /* ---------- Glisser-déposer avec inertie (rotation de l'anneau) ---------- */
    viewport.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragActive = true; dragStartX = e.clientX; dragStartIndex = carIndex;
      dragVel = 0;
      if (inertiaRaf) { cancelAnimationFrame(inertiaRaf); inertiaRaf = null; }
      clearTimeout(autoTimer);
      viewport.setPointerCapture && viewport.setPointerCapture(e.pointerId);
      viewport.classList.add('is-dragging');
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!dragActive) return;
      var n = track ? track.querySelectorAll('.slide').length : photos.length;
      if (!n) return;
      var dx = e.clientX - dragStartX;
      var stepPx = 90;
      var raw = dragStartIndex - dx / stepPx;
      dragVel = (dragStartX - e.clientX - (dragVel || 0)) * 0.35;
      carIndex = ((Math.round(raw) % n) + n) % n;
      updateCarousel();
    });
    function endDrag() {
      if (!dragActive) return;
      dragActive = false;
      viewport.classList.remove('is-dragging');
      var n = track ? track.querySelectorAll('.slide').length : photos.length;
      var glide = Math.round(Math.max(-3, Math.min(3, dragVel)));
      if (glide) goTo(carIndex + glide);
      dragVel = 0;
      scheduleAuto();
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
  }
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
      var body = new FormData();
      body.append('name', name.value.trim());
      body.append('email', email.value.trim());
      body.append('message', msg.value.trim());
      body.append('_subject', 'Message depuis le site — Saysko Photographie');
      body.append('_replyto', email.value.trim());
      fetch('https://formsubmit.co/ajax/sayskothemix%2Bcontact@gmail.com', {
        method: 'POST', body: body
      }).then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); }).then(function (d) {
        done(!!(d && (d.success === 'true' || d.success === true)));
      }).catch(function () {
        done(false);
      });
    });
  }

  /* ---------- Bouton Admin (renvoie vers l'accueil) ---------- */
  var adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    if (/localhost|127\.0\.0\.1|trycloudflare\.com/.test(location.hostname)) {
      adminBtn.addEventListener('click', function () { window.location.href = 'admin.html'; });
    } else {
      adminBtn.style.display = 'none';
    }
  }

  /* Les vignettes de catégories sont des liens vers des pages dédiées.
     On force la navigation au clic pour éviter tout blocage résiduel. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.filter-btn[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href && href !== '#' && !e.defaultPrevented) {
      e.preventDefault();
      window.location.href = href;
    }
  });

  /* ---------- Démarrage ---------- */
  loadData(renderGallery);
})();

/* Menu mobile - global (toutes les pages) */
(function () {
  var btn = document.querySelector('.menu-toggle');
  var nav = document.querySelector('header nav') || document.querySelector('nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function (e) { e.stopPropagation(); nav.classList.toggle('open'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
  document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target) && !e.target.closest('.menu-toggle')) nav.classList.remove('open'); });
  window.addEventListener('resize', function () { if (window.innerWidth > 780) nav.classList.remove('open'); });
})();

/* ---------- Halo studio : suit la souris (softbox virtuelle) ---------- */
(function () {
  if (!window.matchMedia || !matchMedia('(pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var x = -500, y = -500, raf = null;
  function paint() {
    raf = null;
    document.body.style.setProperty('--halo-x', x + 'px');
    document.body.style.setProperty('--halo-y', y + 'px');
    document.body.classList.add('has-cursor-halo');
  }
  document.addEventListener('mousemove', function (e) {
    x = e.clientX; y = e.clientY;
    if (raf === null) raf = requestAnimationFrame(paint);
  }, { passive: true });
  document.addEventListener('mouseleave', function () {
    document.body.classList.remove('has-cursor-halo');
  });
})();
