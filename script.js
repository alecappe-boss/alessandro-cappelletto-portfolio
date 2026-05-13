
/* ---- SCROLL TO TOP ON RELOAD ---- */
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ---- CURSOR ---- */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left  = mx - 4 + 'px';
  dot.style.top   = my - 4 + 'px';
});

function animRing() {
  rx += (mx - rx - 18) * 0.15;
  ry += (my - ry - 18) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a,button,.project-card,.stat-card,.skill-cat,.edu-card,.contact-card,.cert-card,.lang-card,.hobby-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


/* ---- LOADER ---- */
const loaderTexts = [
  'Initializing...', 'Loading modules...', 'Compiling assets...', 'Ready.'
];
const loaderTextEl = document.getElementById('loader-text');
let lt = 0;
const ltInterval = setInterval(() => {
  lt++;
  if (lt < loaderTexts.length) loaderTextEl.textContent = loaderTexts[lt];
  else clearInterval(ltInterval);
}, 450);

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1900);
});


/* ---- CANVAS BACKGROUND (animated grid + particles) ---- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.5 + 0.5;
    this.a  = Math.random() * 0.6 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,180,${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawBg() {
  ctx.clearRect(0, 0, W, H);
  const step = 60;
  ctx.strokeStyle = 'rgba(0,255,180,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  particles.forEach(p => { p.update(); p.draw(); });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,255,180,${0.08 * (1 - d/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawBg);
}
drawBg();


/* ---- TERMINAL ANIMATION ---- */
const lines = [
  { type: 'cmd',  text: 'whoami' },
  { type: 'out',  text: 'Alessandro Cappelletto', cls: 'accent' },
  { type: 'cmd',  text: 'cat role.txt' },
  { type: 'out',  text: 'Full Stack Developer', cls: '' },
  { type: 'cmd',  text: 'ls skills/' },
  { type: 'out',  text: 'JavaScript  Node.js  Java  Python  MySQL  Git', cls: 'dim' },
  { type: 'cmd',  text: 'echo $STATUS' },
  { type: 'out',  text: 'Building scalable solutions — one commit at a time', cls: '' },
];

const tb = document.getElementById('terminal-body');
let lineIdx = 0;
let charIdx = 0;
let currentEl = null;
let isTyping = false;

function nextLine() {
  if (lineIdx >= lines.length) {
    const cursor = document.createElement('span');
    cursor.className = 't-cursor';
    tb.appendChild(cursor);
    return;
  }
  const line = lines[lineIdx];
  const el = document.createElement('div');
  el.className = 't-line';
  el.style.animationDelay = '0s';
  if (line.type === 'cmd') {
    el.innerHTML = `<span class="t-prompt">▸&nbsp;</span><span class="t-cmd"></span>`;
  } else {
    el.innerHTML = `<span class="t-out${line.cls ? ' ' + line.cls : ''}"></span>`;
  }
  tb.appendChild(el);
  currentEl = el.querySelector(line.type === 'cmd' ? '.t-cmd' : '.t-out');
  charIdx = 0;
  isTyping = true;
  typeChar(line);
}

function typeChar(line) {
  if (!isTyping) return;
  if (charIdx <= line.text.length) {
    currentEl.textContent = line.text.slice(0, charIdx);
    charIdx++;
    const delay = line.type === 'cmd' ? 55 + Math.random() * 40 : 18;
    setTimeout(() => typeChar(line), delay);
  } else {
    lineIdx++;
    const pause = line.type === 'cmd' ? 300 : 600;
    setTimeout(nextLine, pause);
  }
}

setTimeout(nextLine, 2200);


/* ---- SCROLL REVEALS ---- */
const revealEls = document.querySelectorAll('.reveal');
const timelineItems = document.querySelectorAll('.timeline-item');
const langBars = document.querySelectorAll('.lang-skill-bar');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));
timelineItems.forEach(el => observer.observe(el));

// Lang bars
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const w = e.target.getAttribute('data-w');
      setTimeout(() => { e.target.style.width = w + '%'; }, 100);
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

langBars.forEach(b => barObserver.observe(b));




/* ---- FORM SUBMIT FX ---- */
document.querySelector('.form-submit').addEventListener('click', function() {
  this.textContent = '✓ Inviato!';
  this.style.background = '#00ffb4';
  setTimeout(() => {
    this.textContent = 'Invia messaggio →';
    this.style.background = '';
  }, 2000);
});

/* ---- BACK TO TOP LOGIC ---- */
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Integrazione con il tuo cursore personalizzato
backToTopBtn.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
backToTopBtn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('nav-hamburger');
const mobileDrawer = document.getElementById('nav-mobile-drawer');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileDrawer.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

hamburger.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
hamburger.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));

/* ---- SKILL CARD SPOTLIGHT ---- */
document.querySelectorAll('.skill-icon-card').forEach(card => {
  // Random delay so beams are out of sync
  const delay = -(Math.random() * 3.5).toFixed(2);
  card.style.setProperty('--beam-delay', delay + 's');

  // inject spotlight div
  const spot = document.createElement('div');
  spot.className = 'card-spotlight';
  card.prepend(spot);

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
    card.style.setProperty('--mx', x);
    card.style.setProperty('--my', y);
  });
  card.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
