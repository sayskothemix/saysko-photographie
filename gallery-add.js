/* Ajout et publication de photos, réservés au propriétaire du site. */
(function () {
  'use strict';
  if (!document.getElementById('portfolio')) return;
  var HASH = 'e07b1dac4e2e9b461ca384087c9c35027bb585c6ecc24a57a0147fe26d2c2853';
  function sha(s) {
    if (!window.crypto || !crypto.subtle) return Promise.resolve(null);
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  var OK = sessionStorage.getItem('saysko_gallery_owner') === '1';
  var STYLE = 'position:fixed;right:20px;z-index:9999;padding:10px 14px;border:0;border-radius:2px;font:600 .68rem Montserrat,sans-serif;letter-spacing:1.4px;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.5)';

  var add = document.createElement('button');
  add.className = 'owner-add-btn';
  add.textContent = '+ Ajouter une photo';
  add.style.cssText = STYLE + ';bottom:88px;background:#e0bd85;color:#14100a';
  add.hidden = !OK;
  document.body.appendChild(add);

  var publish = document.createElement('button');
  publish.className = 'owner-publish-btn';
  publish.textContent = '↑ Publier';
  publish.style.cssText = STYLE + ';bottom:132px;background:#1d1a20;color:#e0bd85;border:1px solid rgba(224,189,133,.5)';
  publish.hidden = !OK;
  document.body.appendChild(publish);

  function askCode() {
    var v = prompt('Code propriétaire :');
    if (!v) return;
    sha(v).then(function (h) {
      if (h === HASH) { sessionStorage.setItem('saysko_gallery_owner', '1'); location.reload(); }
      else alert('Code incorrect.');
    });
  }
  if (!OK) {
    var lock = document.createElement('button');
    lock.textContent = '🔒';
    lock.title = 'Espace propriétaire';
    lock.style.cssText = STYLE + ';bottom:88px;width:38px;height:38px;padding:0;background:rgba(224,189,133,.08);color:#e0bd85;border:1px solid rgba(224,189,133,.4);border-radius:50%';
    lock.addEventListener('click', askCode);
    document.body.appendChild(lock);
  }

  add.addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var extra;
        try { extra = JSON.parse(localStorage.getItem('saysko_gallery_extra') || '[]'); }
        catch (e) { extra = []; }
        extra.push({ title: f.name.replace(/\.[^.]+$/, ''), src: reader.result, desc: 'Ajouté par vous' });
        localStorage.setItem('saysko_gallery_extra', JSON.stringify(extra));
        location.reload();
      };
      reader.readAsDataURL(f);
    });
    input.click();
  });

  publish.addEventListener('click', function () {
    var extra;
    try { extra = JSON.parse(localStorage.getItem('saysko_gallery_extra') || '[]'); }
    catch (e) { extra = []; }
    if (!extra.length) { alert('Aucune photo ajoutée à publier.'); return; }
    var blob = new Blob([JSON.stringify({ photos: extra }, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'saysko-photos-a-publier.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    alert('Fichier téléchargé. Donne-le à OpenBot pour publier les photos sur le site.');
  });
})();
