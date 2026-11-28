/* Contrôle du son partagé par toutes les pages : un seul bouton, état mémorisé. */
(function () {
  'use strict';

  var KEY = 'saysko_sound_muted';
  var muted = false;
  try { muted = localStorage.getItem(KEY) === '1'; } catch (e) {}

  function audios() {
    return Array.prototype.slice.call(document.querySelectorAll('audio'));
  }

  function save() {
    try { localStorage.setItem(KEY, muted ? '1' : '0'); } catch (e) {}
  }

  function applyState() {
    audios().forEach(function (a) { a.muted = muted; });
  }

  // Une seule piste relancée à l'activation : les autres suivent leur propre logique.
  function playMain() {
    var all = audios();
    if (!all.length) return;
    var main = document.getElementById('bgMusic') || all[0];
    if (main.paused) {
      var p = main.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }
  }

  // Musique de fond seulement si la page n'a aucun lecteur audio.
  function ensureAudio() {
    if (audios().length) return;
    var a = document.createElement('audio');
    a.id = 'bgMusic';
    a.src = 'fashion-session.mp3';
    a.loop = true;
    a.preload = 'auto';
    a.volume = 0.55;
    a.style.display = 'none';
    document.body.appendChild(a);
  }

  function makeButton() {
    var btn = document.createElement('button');
    btn.id = 'soundBtn';
    btn.type = 'button';
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h3l5-4v14l-5-4H4z"/><path class="sound-waves" d="M16 8.5a4 4 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12"/><path class="sound-mute" d="M16 9l5 6M21 9l-5 6" style="display:none"/></svg>';
    return btn;
  }

  // Ajoute l'icône « son coupé » aux boutons déjà présents dans les pages.
  function normalizeIcon(btn) {
    var svg = btn.querySelector('svg');
    if (!svg) return;
    var waves = btn.querySelector('#soundWaves') || btn.querySelector('.sound-waves');
    if (waves) waves.classList.add('sound-waves');
    if (!btn.querySelector('.sound-mute')) {
      var cross = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      cross.setAttribute('class', 'sound-mute');
      cross.setAttribute('d', 'M16 9l5 6M21 9l-5 6');
      cross.style.display = 'none';
      svg.appendChild(cross);
    }
  }

  function getButton() {
    var btn = document.getElementById('soundBtn') || document.getElementById('sound');
    if (btn) {
      // Reprend le bouton existant en retirant les écouteurs déjà posés par la page.
      var clone = btn.cloneNode(true);
      normalizeIcon(clone);
      btn.parentNode.replaceChild(clone, btn);
      return clone;
    }
    if (!audios().length) return null;
    var wrap = document.querySelector('.site-controls');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'site-controls';
      document.body.appendChild(wrap);
    }
    var b = makeButton();
    wrap.insertBefore(b, wrap.firstChild);
    return b;
  }
  function update(btn) {
    if (!btn) return;
    btn.setAttribute('aria-label', muted ? 'Activer la musique' : 'Couper la musique');
    btn.title = muted ? 'Activer la musique' : 'Couper la musique';
    btn.dataset.muted = muted ? '1' : '0';
    btn.classList.toggle('off', muted);
    btn.classList.toggle('muted', muted);
    var waves = btn.querySelector('.sound-waves') || document.getElementById('soundWaves');
    var cross = btn.querySelector('.sound-mute');
    if (waves) waves.style.display = muted ? 'none' : '';
    if (cross) cross.style.display = muted ? '' : 'none';
  }

  function toggle(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    muted = !muted;
    save();
    applyState();
    if (!muted) playMain();
    update(btn);
  }

  function unlock() {
    if (!muted) playMain();
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  }

  var btn = null;

  function init() {
    ensureAudio();
    applyState();
    btn = getButton();
    if (btn) {
      btn.addEventListener('click', toggle);
      update(btn);
    }
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API partagée pour les pages qui gèrent elles-mêmes leur lecture.
  window.SayskoSound = {
    isMuted: function () { return muted; },
    setMuted: function (v) { muted = !!v; save(); applyState(); update(btn); },
    toggle: function () { toggle(); }
  };
})();
