/* PixelForge — shared utilities */
var PF = {};

/* Nav toggle */
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('nav-toggle')) {
    var nl = document.querySelector('.nav-links');
    if (nl) nl.classList.toggle('open');
  }
});

/* Year */
document.querySelectorAll('[data-year]').forEach(function(el) { el.textContent = new Date().getFullYear(); });

/* Toast */
PF.toast = function(msg, err) {
  var t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.toggle('err', !!err);
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(function() { t.classList.remove('show'); }, 2200);
};

/* Download helper */
PF.download = function(blob, name) {
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 5000);
};

/* Read file as image */
PF.readImage = function(file, cb) {
  if (!file || !file.type.startsWith('image/')) { PF.toast('Please select an image file', true); return; }
  var img = new Image();
  img.onload = function() { cb(img, file); };
  img.onerror = function() { PF.toast('Could not load image', true); };
  img.src = URL.createObjectURL(file);
};

/* Drop zone setup */
PF.setupDrop = function(zoneEl, cb) {
  var fileInput = zoneEl.querySelector('input[type=file]');
  ['dragenter', 'dragover'].forEach(function(ev) {
    zoneEl.addEventListener(ev, function(e) { e.preventDefault(); zoneEl.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(function(ev) {
    zoneEl.addEventListener(ev, function(e) { e.preventDefault(); zoneEl.classList.remove('dragover'); });
  });
  zoneEl.addEventListener('drop', function(e) {
    var f = e.dataTransfer.files[0];
    if (f) cb(f);
  });
  zoneEl.addEventListener('click', function(e) {
    if (e.target === fileInput) return;
    if (fileInput) fileInput.click();
  });
  if (fileInput) fileInput.addEventListener('change', function() {
    if (this.files[0]) cb(this.files[0]);
    this.value = '';
  });
};

/* Format bytes */
PF.fmtBytes = function(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
};

/* Search filter for tool cards */
(function() {
  var s = document.getElementById('toolSearch');
  if (!s) return;
  s.addEventListener('input', function() {
    var q = this.value.toLowerCase();
    document.querySelectorAll('.tool-card').forEach(function(card) {
      var text = (card.textContent || '').toLowerCase();
      card.style.display = text.indexOf(q) > -1 ? '' : 'none';
    });
  });
})();
