/**
 * ROMANTIC LOVE WEBSITE - INTERACTIVE SCRIPTS
 * Built with love and care for your special someone.
 */

// ==========================================================================
// 1. ROMANTIC PARTICLES CANVAS (Floating Hearts, Petals & Stardust)
// ==========================================================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let confetti = [];
const particleCount = 45;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class RomanticParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 50;
    this.size = Math.random() * 14 + 10;
    this.speedY = Math.random() * 1.2 + 0.5;
    this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.8;
    this.type = Math.random() > 0.4 ? 'heart' : 'petal';
    this.opacity = Math.random() * 0.5 + 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.03;
    this.hue = Math.random() > 0.5 ? 340 : 355; // Pink / Rose
  }

  update() {
    this.y -= this.speedY;
    this.x += Math.sin(this.y * 0.015) * 0.8 + this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    if (this.type === 'heart') {
      ctx.fillStyle = `hsl(${this.hue}, 90%, 65%)`;
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 2, 0, this.size);
      ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
    } else {
      // Rose petal
      ctx.fillStyle = `hsl(${this.hue}, 80%, 75%)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.4, this.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Confetti for celebrations
class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 6;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 2;
    this.gravity = 0.25;
    this.color = ['#ff4d8d', '#f43f5e', '#fb7185', '#fcd34d', '#38bdf8', '#a855f7', '#ffffff'][Math.floor(Math.random() * 7)];
    this.opacity = 1;
    this.rotation = Math.random() * 360;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.opacity -= 0.012;
    this.rotation += 4;
  }

  draw() {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

for (let i = 0; i < particleCount; i++) {
  const p = new RomanticParticle();
  p.y = Math.random() * canvas.height;
  particles.push(p);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].update();
    confetti[i].draw();
    if (confetti[i].opacity <= 0) {
      confetti.splice(i, 1);
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

function launchConfetti(x, y, count = 75) {
  for (let i = 0; i < count; i++) {
    confetti.push(new ConfettiParticle(x, y));
  }
}

// ==========================================================================
// 2. ROMANTIC AMBIENT AUDIO SYNTHESIZER & MP3 PLAYER
// ==========================================================================
let audioCtx = null;
let synthInterval = null;
let isAudioPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const discVinyl = document.getElementById('discVinyl');
const musicStatusText = document.getElementById('musicStatusText');
const volumeSlider = document.getElementById('volumeSlider');

// Native Audio Event Listeners for reliable playback state
if (bgMusic) {
  bgMusic.addEventListener('play', () => {
    isAudioPlaying = true;
    updateMusicUI(true);
  });
  bgMusic.addEventListener('pause', () => {
    isAudioPlaying = false;
    updateMusicUI(false);
  });
  bgMusic.addEventListener('ended', () => {
    // Ensure seamless looping
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  });
  bgMusic.addEventListener('error', (e) => {
    console.warn('Audio element notice:', e);
  });
}

// Romantic Chord Progressions (Canon in D / Romantic Lofi Melody in Web Audio)
const romanceMelody = [
  // Chords: D, A, Bm, F#m, G, D, G, A
  { note: 293.66, dur: 0.6 }, // D4
  { note: 369.99, dur: 0.6 }, // F#4
  { note: 440.00, dur: 0.8 }, // A4
  { note: 587.33, dur: 1.0 }, // D5
  { note: 440.00, dur: 0.6 }, // A4
  { note: 369.99, dur: 0.6 }, // F#4
  { note: 329.63, dur: 0.8 }, // E4
  { note: 493.88, dur: 1.0 }, // B4
  { note: 392.00, dur: 0.6 }, // G4
  { note: 329.63, dur: 0.6 }, // E4
  { note: 293.66, dur: 1.2 }, // D4
  { note: 369.99, dur: 0.6 }, // F#4
  { note: 440.00, dur: 1.4 }  // A4
];

let melodyIndex = 0;

function playSynthTone(freq, duration = 0.8) {
  if (!audioCtx) return;
  const masterVolume = parseFloat(volumeSlider ? volumeSlider.value : 0.15) || 0.15;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Warm Rhodes / Music Box bell-like tone
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  // Soft attack and gentle decay
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2 * masterVolume, audioCtx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function startSynthMusic() {
  if (synthInterval) clearInterval(synthInterval);
  synthInterval = setInterval(() => {
    if (!isAudioPlaying) return;
    const current = romanceMelody[melodyIndex % romanceMelody.length];
    playSynthTone(current.note, current.dur);
    // Harmonize occasionally
    if (melodyIndex % 3 === 0) {
      playSynthTone(current.note * 0.5, 1.5); // Warm bass note
    }
    melodyIndex++;
  }, 750);
}

function startMusic() {
  if (!bgMusic) return;

  const currentVol = parseFloat(volumeSlider ? volumeSlider.value : 0.15) || 0.15;
  bgMusic.volume = currentVol;
  if (volumeSlider) volumeSlider.value = currentVol;

  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isAudioPlaying = true;
      updateMusicUI(true);
    }).catch((err) => {
      console.warn('Audio waiting for user gesture:', err);
    });
  }
}

function stopMusic() {
  isAudioPlaying = false;
  if (bgMusic) {
    bgMusic.pause();
  }
  updateMusicUI(false);
}

function updateMusicUI(playing) {
  if (playing) {
    discVinyl.classList.add('spinning');
    musicStatusText.textContent = 'Best Part 🎵';
  } else {
    discVinyl.classList.remove('spinning');
    musicStatusText.textContent = 'Musik Dijeda 🔇';
  }
}

musicToggleBtn.addEventListener('click', () => {
  if (!bgMusic.paused) {
    stopMusic();
  } else {
    startMusic();
  }
});

volumeSlider.addEventListener('input', (e) => {
  bgMusic.volume = e.target.value;
});

// ==========================================================================
// 3. WELCOME ENVELOPE OPENING ANIMATION
// ==========================================================================
const welcomeOverlay = document.getElementById('welcomeOverlay');
const waxSealBtn = document.getElementById('waxSealBtn');
const envelopeBox = document.getElementById('envelopeBox');

function openSurpriseLetter() {
  // Trigger audio
  startMusic();

  // Burst confetti
  const rect = waxSealBtn.getBoundingClientRect();
  launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);

  // Fade out welcome overlay
  envelopeBox.style.transform = 'scale(0.85) rotate(-5deg)';
  setTimeout(() => {
    welcomeOverlay.classList.add('opened');
  }, 400);
}

waxSealBtn.addEventListener('click', openSurpriseLetter);
envelopeBox.addEventListener('click', openSurpriseLetter);
waxSealBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openSurpriseLetter();
  }
});

// ==========================================================================
// 4. RELATIONSHIP LOVE COUNTER
// ==========================================================================
const DEFAULT_START_DATE = '2026-08-27T00:00:00';
let relationshipDate = new Date(DEFAULT_START_DATE);
try {
  localStorage.setItem('loveAnniversaryDate', DEFAULT_START_DATE);
} catch (e) {}

const timerDays = document.getElementById('timerDays');
const timerHours = document.getElementById('timerHours');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');

function updateLoveCounter() {
  const now = new Date();
  const diffMs = Math.max(0, now - relationshipDate);

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
  if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
  if (timerMinutes) timerMinutes.textContent = String(minutes).padStart(2, '0');
  if (timerSeconds) timerSeconds.textContent = String(seconds).padStart(2, '0');
}

setInterval(updateLoveCounter, 1000);
updateLoveCounter();

// ==========================================================================
// 5. POLAROID GALLERY LIGHTBOX (20 PHOTOS)
// ==========================================================================
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

if (lightboxModal && lightboxImg && lightboxCaption) {
  document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      const caption = card.getAttribute('data-caption') || card.querySelector('.caption-text').textContent;
      if (img) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });
}

// ==========================================================================
// 6. DUAL VIDEO PLAYER SWITCHER & AUDIO INTERACTION
// ==========================================================================
const coupleVideo = document.getElementById('coupleVideo');
const filmTitle = document.getElementById('filmTitle');
const videoCaptionText = document.getElementById('videoCaptionText');
const videoButtons = document.querySelectorAll('.video-select-btn');

let wasMusicPlayingBeforeVideo = false;

if (coupleVideo) {
  // When video starts playing: turn off/pause background music
  coupleVideo.addEventListener('play', () => {
    if (isAudioPlaying || !bgMusic.paused) {
      wasMusicPlayingBeforeVideo = true;
      stopMusic();
    }
  });

  // When video finishes (ended): resume background music at 15% volume
  coupleVideo.addEventListener('ended', () => {
    if (wasMusicPlayingBeforeVideo) {
      if (volumeSlider) {
        volumeSlider.value = 0.15;
      }
      bgMusic.volume = 0.15;
      startMusic();
      wasMusicPlayingBeforeVideo = false;
    }
  });

  // Disable download options and context menu on video element
  coupleVideo.setAttribute('controlsList', 'nodownload noplaybackrate nofullscreen');
  coupleVideo.setAttribute('disablePictureInPicture', 'true');
  coupleVideo.addEventListener('contextmenu', (e) => e.preventDefault());

  if (videoButtons.length > 0) {
    videoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        videoButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const src = btn.getAttribute('data-src');
        const title = btn.getAttribute('data-title');
        const caption = btn.getAttribute('data-caption');

        if (filmTitle && title) {
          filmTitle.textContent = title;
        }
        if (videoCaptionText && caption) {
          videoCaptionText.textContent = caption;
        }

        // Instant direct switch of video source via progressive streaming
        coupleVideo.pause();
        const videoSource = document.getElementById('videoSource');
        if (videoSource) {
          videoSource.src = src;
        }
        coupleVideo.src = src;
        coupleVideo.load();
        coupleVideo.currentTime = 0;
        
        const playPromise = coupleVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Deferred until user hits play on controls
          });
        }
      });
    });
  }
}

// ==========================================================================
// 7. LOVE JAR - 25 REASONS WHY I LOVE YOU
// ==========================================================================
const loveReasons = [
  "Kamu adalah alasan kenapa setiap pagi aku bangun dengan penuh semangat dan senyuman di wajah.",
  "Cara manismu menatapku selalu berhasil meluluhkan segala gundah dan rasa lelahku.",
  "Kamu selalu percaya pada impian-impianku, bahkan saat aku sendiri sedang merasa ragu.",
  "Tawa manismu adalah melodi terindah yang tidak akan pernah bosan kudengar sepanjang hidupku.",
  "Kamu memiliki hati yang luar biasa tulus, lembut, dan selalu peduli pada orang di sekitarmu.",
  "Genggaman tanganmu selalu memberiku ketenangan luar biasa yang tidak bisa kutemukan di tempat lain.",
  "Bahkan saat kamu sedang ngambek atau cemberut, di mataku kamu tetap makhluk paling menggemaskan sedunia!",
  "Kamu menerima segala kekuranganku dan menjadikanku pribadi yang jauh lebih baik setiap harinya.",
  "Wangi khasmu dan pelukan hangatmu selalu terasa seperti 'rumah' paling nyaman bagiku.",
  "Setiap obrolan kecil kita dari hal receh hingga masa depan selalu jadi momen paling berharga.",
  "Matamu yang berbinar indah adalah pemandangan terfavoritku di seluruh penjuru bumi.",
  "Kamu selalu mengerti perasaanku bahkan tanpa perlu kuucapkan dengan kata-kata.",
  "Kehadiranmu membuat hari yang mendung dan dingin berubah menjadi hangat dan penuh warna.",
  "Karena bersama dirimu, aku tidak perlu pura-pura jadi orang lain. Aku bisa seutuhnya menjadi diriku.",
  "Aku mencintai caramu merawat hal-hal kecil dengan penuh kasih sayang.",
  "Karena setiap kali membayangkan masa depanku, wajahmulah satu-satunya yang selalu ada di sana.",
  "Kesabaranmu saat menghadapi sikapku yang kadang bandel atau keras kepala adalah bukti cinta terbesarmu.",
  "Karena cinta ini tidak butuh syarat apa pun—aku mencintaimu hanya karena kamu adalah KAMU.",
  "Setiap detik yang kuhabiskan bersamamu adalah berkah terindah yang selalu kusyukuri kepada Tuhan.",
  "Karena di antara miliaran manusia di dunia, hanya padamu hatiku bisa berlabuh dengan begitu tenang.",
  "I Love You bukan hanya untuk saat ini, tapi sampai rambut kita sama-sama memutih nanti. ❤️"
];

let reasonIndex = 0;
const loveJarBtn = document.getElementById('loveJarBtn');
const noteText = document.getElementById('noteText');
const noteIndex = document.getElementById('noteIndex');
const notePaper = document.querySelector('.note-paper');

function drawLoveNote() {
  reasonIndex = (reasonIndex + 1) % loveReasons.length;
  
  // Animation replay
  notePaper.style.animation = 'none';
  void notePaper.offsetWidth; // Trigger reflow
  notePaper.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

  noteText.textContent = loveReasons[reasonIndex];
  noteIndex.textContent = `Pesan Cinta #${reasonIndex + 1} dari ${loveReasons.length}`;

  // Confetti burst from jar
  const rect = loveJarBtn.getBoundingClientRect();
  launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
}

loveJarBtn.addEventListener('click', drawLoveNote);
loveJarBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    drawLoveNote();
  }
});

// ==========================================================================
// 8. LOVE METER ANIMATION (OVERLOAD TO INFINITY)
// ==========================================================================
const boostLoveBtn = document.getElementById('boostLoveBtn');
const meterFill = document.getElementById('meterFill');
const meterScoreText = document.getElementById('meterScoreText');
const meterResultDesc = document.getElementById('meterResultDesc');

let meterInterval = null;

boostLoveBtn.addEventListener('click', () => {
  boostLoveBtn.disabled = true;
  boostLoveBtn.textContent = 'Menghitung detak cinta... 💓';

  let currentPercent = 0;
  if (meterInterval) clearInterval(meterInterval);

  meterInterval = setInterval(() => {
    currentPercent += 2;
    meterFill.style.width = Math.min(100, currentPercent) + '%';
    
    if (currentPercent <= 100) {
      meterScoreText.textContent = `${currentPercent}%`;
    } else if (currentPercent <= 200) {
      meterScoreText.textContent = `${currentPercent * 10}% OVERLOAD!`;
    } else {
      clearInterval(meterInterval);
      meterScoreText.textContent = '∞ TAK TERHINGGA!';
      meterFill.style.width = '100%';
      meterResultDesc.innerHTML = '✨ <strong>Error Cinta Terlalu Besar:</strong> Sistem tidak mampu mengukur cintaku padamu karena rasa sayang ini sudah melampaui batas semesta! 🌌💖';
      boostLoveBtn.disabled = false;
      boostLoveBtn.textContent = '💖 Ukur Lagi (Tetap Tak Terhingga)';

      const rect = meterScoreText.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 90);
    }
  }, 25);
});

// ==========================================================================
// 9. DODGING "NGGAK" BUTTON & SWEET PROPOSAL
// ==========================================================================
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const sweetResponseBox = document.getElementById('sweetResponseBox');

function moveNoButton() {
  const container = document.querySelector('.answer-buttons-group');
  const containerRect = container.getBoundingClientRect();

  const maxX = 120;
  const maxY = 50;

  const randomX = (Math.random() - 0.5) * maxX * 2;
  const randomY = (Math.random() - 0.5) * maxY * 2;

  btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
  
  // Also enlarge YES button each time she tries to click NO!
  const currentScale = parseFloat(btnYes.getAttribute('data-scale') || '1');
  const newScale = Math.min(currentScale + 0.1, 1.6);
  btnYes.setAttribute('data-scale', newScale);
  btnYes.style.transform = `scale(${newScale})`;
}

btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
});

btnYes.addEventListener('click', () => {
  sweetResponseBox.classList.add('show');
  btnNo.style.display = 'none';
  btnYes.textContent = 'SELAMANYA MILIKMU! 💕';
  btnYes.style.transform = 'scale(1)';

  // Epic confetti explosion
  const rect = sweetResponseBox.getBoundingClientRect();
  launchConfetti(rect.left + rect.width / 2, rect.top + 30, 150);
  setTimeout(() => {
    launchConfetti(window.innerWidth * 0.3, window.innerHeight * 0.4, 70);
    launchConfetti(window.innerWidth * 0.7, window.innerHeight * 0.4, 70);
  }, 400);
});
