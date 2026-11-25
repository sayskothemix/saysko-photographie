/* Ajout de photos réservé au propriétaire du site. */
(function () {
  'use strict';
  if (!document.getElementById('portfolio')) return;
  var HASH = 'e07b1dac4e2e9b461ca384087c9c35027bb585c6ecc24a57a0147fe26d2c2853';
  function sha(s) {
    if (!window.crypto || !crypto.subtle) return null;
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  var OK = sessionStorage.getItem('saysko_gallery_owner') === '1';

  var btn = document.createElement('button');
  btn.className = 'owner-add-btn';
  btn.textContent = '+ Ajouter une photo';
  btn.style.cssText = 'position:fixed;right:20px;bottom:88px;z-index:9999;padding:10px 14px;background:#e0bd85;color:#14100a;border:0;border-radius:2px;font:600 .68rem Montserrat,sans-serif;letter-spacing:1.4px;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.5)';
  btn.hidden = !OK;
  document.body.appendChild(btn);

  function askCode() {
    var v = prompt('Code propriétaire :');
    if (!v) return;
    sha(v).then(function (h) {
      if (h === HASH) { sessionStorage.setItem('saysko_gallery_owner', '1'); location.reload(); }
      else alert('Code incorrect.');
    });
  }
  if (!OK) {
    var unlock = document.createElement('button');
    unlock.textContent = '🔒';
    unlock.title = 'Espace propriétaire';
    unlock.style.cssText = 'position:fixed;right:20px;bottom:88px;z-index:9999;width:38px;height:38px;border:1px solid rgba(224,189,133,.4);background:rgba(224,189,133,.08);color:#e0bd85;border-radius:50%;cursor:pointer;font-size:.9rem';
    unlock.addEventListener('click', askCode);
    document.body.appendChild(unlock);
  }

  btn.addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var data = reader.result;
        var extra;
        try { extra = JSON.parse(localStorage.getItem('saysko_gallery_extra') || '[]'); }
        catch (e) { extra = []; }
        extra.push({ title: f.name.replace(/\.[^.]+$/, ''), src: data, desc: 'Ajouté par vous' });
        localStorage.setItem('saysko_gallery_extra', JSON.stringify(extra));
        location.reload();
      };
      reader.readAsDataURL(f);
    });
    input.click();
  });
})();
