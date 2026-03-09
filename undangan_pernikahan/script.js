/* ============================================================
   UNDANGAN PERNIKAHAN — Sophia & Rayhan
   script.js
   ============================================================ */

/* ── OPEN INVITATION ── */
function openInvitation() {
  document.getElementById('splash').classList.add('hide');
  document.body.classList.remove('locked');
  setTimeout(() => { if (!playing && ytReady) toggleMusic(); }, 1000);
}

/* ── COUNTDOWN ── */
const weddingDate = new Date('2025-06-14T08:00:00');

function updateCountdown() {
  const diff = weddingDate - new Date();
  if (diff <= 0) {
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent  = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── YOUTUBE MUSIC ── */
const musicIcon  = document.getElementById('music-icon');
const musicLabel = document.getElementById('music-label');
const musicBars  = document.getElementById('music-bars');
const musicBtn   = document.getElementById('music-btn');
let playing = false, ytPlayer = null, ytReady = false;

const ytScript = document.createElement('script');
ytScript.src   = 'https://www.youtube.com/iframe_api';
document.head.appendChild(ytScript);

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('yt-player', {
    videoId: '06-XXOTP3Gc',
    playerVars: { autoplay:0, controls:0, loop:1, playlist:'06-XXOTP3Gc', modestbranding:1, rel:0, fs:0, iv_load_policy:3 },
    events: { onReady: () => { ytReady = true; } }
  });
};

function toggleMusic() {
  if (!ytReady) return;
  if (playing) {
    ytPlayer.pauseVideo();
    musicIcon.textContent  = '▶';
    musicLabel.textContent = 'Putar Musik';
    musicBars.classList.remove('active');
    musicBtn.classList.remove('playing');
  } else {
    ytPlayer.playVideo();
    musicIcon.textContent  = '⏸';
    musicLabel.textContent = 'Pause';
    musicBars.classList.add('active');
    musicBtn.classList.add('playing');
  }
  playing = !playing;
}

/* ── WEDDING GIFT COPY ── */
function copyGift(id, btn) {
  const text = document.getElementById(id).innerText.replace(/\u2013|\u2014|\u00a0/g, '-').replace(/\s/g, '');
  navigator.clipboard.writeText(text).then(() => {
    btn.querySelector('span').textContent = '✓ Tersalin!';
    btn.classList.add('copied');
    setTimeout(() => { btn.querySelector('span').textContent = 'Salin Nomor'; btn.classList.remove('copied'); }, 2200);
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = text; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
    btn.querySelector('span').textContent = '✓ Tersalin!';
    btn.classList.add('copied');
    setTimeout(() => { btn.querySelector('span').textContent = 'Salin Nomor'; btn.classList.remove('copied'); }, 2200);
  });
}

/* ── UCAPAN & DOA ── */
let selectedAttend = '';

function setAttend(val) {
  selectedAttend = val;
  document.querySelectorAll('.attend-pill').forEach(b => b.classList.remove('active'));
  const map = { hadir:'attend-yes', tidak:'attend-no', mungkin:'attend-maybe' };
  document.getElementById(map[val]).classList.add('active');
}

function submitWish() {
  const name    = document.getElementById('wish-name').value.trim();
  const message = document.getElementById('wish-message').value.trim();
  if (!name)    { alert('Mohon isi nama Anda.'); return; }
  if (!message) { alert('Mohon tuliskan ucapan Anda.'); return; }

  const attend  = selectedAttend || 'mungkin';
  const initial = name.charAt(0).toUpperCase();
  const attendMap = {
    hadir:   '<div class="wc-attend hadir">✓ Hadir</div>',
    tidak:   '<div class="wc-attend tidak">✗ Tidak Hadir</div>',
    mungkin: '<div class="wc-attend mungkin">? Mungkin Hadir</div>',
  };

  const card = document.createElement('div');
  card.className = 'wish-card';
  card.innerHTML = `
    <div class="wc-header">
      <div class="wc-avatar">${initial}</div>
      <div>
        <div class="wc-name">${name}</div>
        ${attendMap[attend]}
      </div>
    </div>
    <div class="wc-msg">"${message}"</div>
  `;

  const list = document.getElementById('wishes-list');
  list.insertBefore(card, list.firstChild);

  document.getElementById('wish-name').value    = '';
  document.getElementById('wish-message').value = '';
  selectedAttend = '';
  document.querySelectorAll('.attend-pill').forEach(b => b.classList.remove('active'));
  card.scrollIntoView({ behavior:'smooth', block:'center' });
}
