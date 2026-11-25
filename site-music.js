/* Musique de fond partagée par toutes les pages, avec état mémorisé. */
(function () {
  'use strict';
  if (document.getElementById('bgMusic')) return; // Déjà géré par index.html

  var KEY = 'saysko_music_state';
  var state = {};
  try { state = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (e) {}
  var muted = state.muted === true;
  var time = Number(state.time) || 0;

  var audio = document.createElement('audio');
  audio.id = 'bgMusic';
  audio.src = 'fashion-session.mp3';
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.55;
  audio.muted = muted;
  audio.style.display = 'none';
  document.body.appendChild(audio);

  function save() {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ muted: audio.muted, time: audio.currentTime }));
    } catch (e) {}
  }
  function play() {
    var p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  audio.addEventListener('loadedmetadata', function () {
    try { audio.currentTime = time; } catch (e) {}
  });
  audio.addEventListener('timeupdate', save);
  window.addEventListener('pagehide', save);

  // Sur Chrome, l'autoplay est bloqué : on démarre au premier geste utilisateur.
  function unlock() {
    if (!audio.muted) { audio.currentTime = time; play(); }
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  }
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);
  if (!muted) play();

  // Bouton son dans l'en-tête, s'il existe.
  var btn = document.getElementById('soundBtn');
  function update() {
    if (!btn) return;
    var off = audio.muted;
    btn.setAttribute('aria-label', off ? 'Activer la musique' : 'Couper la musique');
    btn.title = off ? 'Activer la musique' : 'Couper la musique';
    btn.dataset.muted = off ? '1' : '0';
    var waves = document.getElementById('soundWaves');
    if (waves) waves.style.opacity = off ? '0.15' : '1';
  }
  if (btn) {
    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      e.stopPropagation();
      audio.muted = !audio.muted;
      if (!audio.muted) { time = audio.currentTime; play(); }
      save();
      update();
    });
  }
  update();
})();
