/* Transition iris partagée entre les pages (ouverture après changement de page). */
(function () {
  'use strict';
  var params = new URLSearchParams(location.search);
  if (params.get('iris') !== '1') return;
  params.delete('iris');
  var clean = location.pathname + (params.toString() ? '?' + params.toString() : '') + location.hash;

  var css = document.createElement('style');
  css.textContent =
    '.iris-page{position:fixed;inset:0;z-index:10001;background:#000;opacity:1;transition:opacity .3s ease}' +
    '.iris-page.is-fading{opacity:0}' +
    '.iris-page svg{display:block;width:100%;height:100%}' +
    '.iris-page .blades{opacity:1}' +
    '.iris-page.is-opening .blades{opacity:0;transition:opacity .1s linear}';
  document.head.appendChild(css);

  var wrap = document.createElement('div');
  wrap.className = 'iris-page';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<svg viewBox="0 0 100 100" preserveAspectRatio="none">' +
      '<defs>' +
        '<linearGradient id="ip-metal" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#29282d"/><stop offset=".18" stop-color="#111114"/>' +
          '<stop offset=".48" stop-color="#08080a"/><stop offset=".72" stop-color="#1b1a1f"/>' +
          '<stop offset="1" stop-color="#050506"/>' +
        '</linearGradient>' +
        '<radialGradient id="ip-screw" cx="35%" cy="30%" r="80%">' +
          '<stop offset="0" stop-color="#9a9aa2"/><stop offset=".55" stop-color="#3a3a41"/>' +
          '<stop offset="1" stop-color="#0a0a0c"/>' +
        '</radialGradient>' +
        '<mask id="ip-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">' +
          '<rect id="ip-rect" x="0" y="0" width="100" height="100" fill="#fff"/>' +
          '<path id="ip-hole" fill="#000" d=""/>' +
        '</mask>' +
      '</defs>' +
      '<rect id="ip-cover" x="0" y="0" width="100" height="100" fill="#000" mask="url(#ip-mask)"/>' +
      '<g class="blades" id="ip-blades"></g>' +
      '<circle id="ip-ring" cx="50" cy="50" r="0" fill="none" stroke="#4a4a52" stroke-width=".7" opacity=".85"/>' +
      '<g id="ip-pivots"></g>' +
    '</svg>';
  document.body.appendChild(wrap);

  var svg = wrap.querySelector('svg');
  var hole = wrap.querySelector('#ip-hole');
  var cover = wrap.querySelector('#ip-cover');
  var rect = wrap.querySelector('#ip-rect');
  var mask = wrap.querySelector('#ip-mask');
  var bladesGroup = wrap.querySelector('#ip-blades');
  var pivotGroup = wrap.querySelector('#ip-pivots');
  var ring = wrap.querySelector('#ip-ring');
  var count = 9, blades = [], edges = [];
  var cx = 50, cy = 50, maxR = 80, pivotR = 0, len = 0, fx = 0, fy = 0;
  var openAngle = -40 * Math.PI / 180, amount = 1;

  function fmt(v) { return v.toFixed(3); }
  function bladePath() {
    var r = maxR, l = len;
    return 'M ' + fmt(-l) + ' 0 C ' + fmt(-l * .94) + ' ' + fmt(-r * .055) +
      ', ' + fmt(-l * .69) + ' ' + fmt(-r * .31) + ', ' + fmt(-r * .22) + ' ' + fmt(-r * .37) +
      ' C ' + fmt(-r * .01) + ' ' + fmt(-r * .44) + ', ' + fmt(r * .26) + ' ' + fmt(-r * .32) +
      ', ' + fmt(r * .37) + ' ' + fmt(-r * .08) + ' C ' + fmt(r * .45) + ' ' + fmt(r * .12) +
      ', ' + fmt(r * .25) + ' ' + fmt(r * .33) + ', ' + fmt(-r * .05) + ' ' + fmt(r * .29) +
      ' C ' + fmt(-l * .42) + ' ' + fmt(r * .25) + ', ' + fmt(-l * .86) + ' ' + fmt(r * .12) +
      ', ' + fmt(-l) + ' 0 Z';
  }
  function slotAngle(a) {
    var x = pivotR + fx * Math.cos(a) - fy * Math.sin(a);
    var y = fx * Math.sin(a) + fy * Math.cos(a);
    return Math.atan2(y, x);
  }
  function bladeAngleFor(v) {
    var closed = slotAngle(0), opened = slotAngle(openAngle);
    var target = closed + (opened - closed) * v, lo = openAngle, hi = 0;
    for (var i = 0; i < 24; i++) {
      var mid = (lo + hi) / 2;
      if (slotAngle(mid) > target) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }
  function aperture(tips) {
    var d = 'M ' + tips[0][0].toFixed(3) + ' ' + tips[0][1].toFixed(3);
    var half = Math.cos(Math.PI / count);
    for (var i = 0; i < count; i++) {
      var s = tips[i], e = tips[(i + 1) % count];
      var sa = Math.atan2(s[1] - cy, s[0] - cx), ea = Math.atan2(e[1] - cy, e[0] - cx);
      if (ea <= sa) ea += Math.PI * 2;
      var rad = Math.sqrt(Math.pow(s[0] - cx, 2) + Math.pow(s[1] - cy, 2));
      var ma = (sa + ea) / 2, mr = rad * (half + .035);
      var m = [cx + Math.cos(ma) * mr, cy + Math.sin(ma) * mr];
      var c1 = [s[0] + (m[0] - s[0]) * 2 / 3, s[1] + (m[1] - s[1]) * 2 / 3];
      var c2 = [e[0] + (m[0] - e[0]) * 2 / 3, e[1] + (m[1] - e[1]) * 2 / 3];
      d += ' C ' + c1[0].toFixed(3) + ' ' + c1[1].toFixed(3) + ', ' + c2[0].toFixed(3) + ' ' + c2[1].toFixed(3) + ', ' + e[0].toFixed(3) + ' ' + e[1].toFixed(3);
    }
    return d + ' Z';
  }
  function render(v) {
    amount = v;
    var ba = bladeAngleFor(v), tips = [], sum = 0;
    for (var i = 0; i < count; i++) {
      var pa = i * Math.PI * 2 / count, br = pa + ba;
      var px = cx + pivotR * Math.cos(pa), py = cy + pivotR * Math.sin(pa);
      var tr = 'translate(' + fmt(px) + ' ' + fmt(py) + ') rotate(' + fmt(br * 180 / Math.PI) + ')';
      blades[i].setAttribute('transform', tr);
      edges[i].setAttribute('transform', tr);
      var tx = px - len * Math.cos(br), ty = py - len * Math.sin(br);
      tips.push([tx, ty]);
      sum += Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
    }
    hole.setAttribute('d', aperture(tips));
    ring.setAttribute('r', fmt(Math.max(0, sum / count + .9)));
  }
  function resize() {
    var s = 100 / Math.max(1, Math.min(innerWidth, innerHeight));
    var w = innerWidth * s, h = innerHeight * s;
    cx = w / 2; cy = h / 2;
    maxR = Math.sqrt(cx * cx + cy * cy) + 2;
    pivotR = maxR * 1.6; len = pivotR;
    fx = -maxR * .52; fy = maxR * .16;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    [cover, rect].forEach(function (r) { r.setAttribute('width', w); r.setAttribute('height', h); });
    mask.setAttribute('width', w); mask.setAttribute('height', h);
    for (var i = 0; i < count; i++) {
      blades[i].setAttribute('d', bladePath());
      edges[i].setAttribute('d', bladePath());
    }
    pivotGroup.innerHTML = '';
    for (var j = 0; j < count; j++) {
      var a = j * Math.PI * 2 / count;
      var x = cx + pivotR * Math.cos(a), y = cy + pivotR * Math.sin(a);
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', fmt(x)); c.setAttribute('cy', fmt(y)); c.setAttribute('r', '1.7');
      c.setAttribute('fill', 'url(#ip-screw)'); c.setAttribute('stroke', 'rgba(0,0,0,.65)');
      c.setAttribute('stroke-width', '.28'); pivotGroup.appendChild(c);
      var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', fmt(x - .75)); l.setAttribute('y1', fmt(y));
      l.setAttribute('x2', fmt(x + .75)); l.setAttribute('y2', fmt(y));
      l.setAttribute('stroke', 'rgba(0,0,0,.55)'); l.setAttribute('stroke-width', '.32');
      pivotGroup.appendChild(l);
    }
    render(amount);
  }
  for (var i = 0; i < count; i++) {
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('fill', 'url(#ip-metal)'); p.setAttribute('stroke', 'rgba(138,138,150,.52)');
    p.setAttribute('stroke-width', '.18'); bladesGroup.appendChild(p); blades.push(p);
    var e = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    e.setAttribute('fill', 'none'); e.setAttribute('stroke', '#e6e6ec');
    e.setAttribute('stroke-width', '.55'); e.setAttribute('opacity', '.7');
    bladesGroup.appendChild(e); edges.push(e);
  }
  addEventListener('resize', resize, { passive: true });

  // Son du miroir qui revient, sans bloquer l'animation.
  function mirror() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    var ctx = new AC();
    fetch('reflex-shutter.mp3').then(function (r) { return r.arrayBuffer(); })
      .then(function (b) { return ctx.decodeAudioData(b); })
      .then(function (buf) {
        var src = ctx.createBufferSource(), gain = ctx.createGain();
        gain.gain.value = .35; src.buffer = buf;
        src.connect(gain); gain.connect(ctx.destination); src.start(0);
      }).catch(function () {});
  }

  resize();
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      mirror();
      wrap.classList.add('is-opening');
      var start = performance.now();
      function frame(now) {
        var p = Math.min(1, (now - start) / 1100);
        var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        render(e);
        if (p < 1) requestAnimationFrame(frame);
        else {
          wrap.classList.add('is-fading');
          setTimeout(function () {
            wrap.remove();
            css.remove();
            history.replaceState(null, '', clean);
          }, 320);
        }
      }
      requestAnimationFrame(frame);
    });
  });
})();
