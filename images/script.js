/**
 * ProCore Services — script.js
 * Vanilla JavaScript — no external dependencies
 */

'use strict';

/* ─────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 }
  );
  document.querySelectorAll('.rv').forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────
   NAVIGATION — shrink on scroll + active links
───────────────────────────────────── */
(function initNav() {
  const nav     = document.getElementById('nav');
  const burger  = document.getElementById('nav-burger');
  const navList = document.getElementById('nav-links');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navAnchors = document.querySelectorAll('#nav-links a[href^="#"]');

  // Hamburger toggle
  if (burger && navList) {
    burger.addEventListener('click', () => {
      navList.classList.toggle('open');
    });
    // Close on link click (mobile)
    navList.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => navList.classList.remove('open'));
    });
  }

  // Scroll: shrink nav + update active link
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 80);

    // Back-to-top
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 500);

    // Active link highlight
    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─────────────────────────────────────
   BACK TO TOP
───────────────────────────────────── */
(function initBTT() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─────────────────────────────────────
   HERO SLIDESHOW
───────────────────────────────────── */
(function initHero() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current  = 0;
  let timer    = null;

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.i, 10));
      startTimer();
    });
  });

  startTimer();
})();

/* ─────────────────────────────────────
   GALLERY FILTER
───────────────────────────────────── */
(function initGallery() {
  const filterBtns = document.querySelectorAll('.gf-btn');
  const items      = document.querySelectorAll('.gal-item');
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;

      items.forEach((item) => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* ─────────────────────────────────────
   SMART LOCK TABS
───────────────────────────────────── */
(function initLockTabs() {
  const tabs   = document.querySelectorAll('.lock-tab');
  const panels = document.querySelectorAll('.lock-panel');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add('active');
    });
  });
})();

/* ─────────────────────────────────────
   LIGHTBOX
───────────────────────────────────── */
(function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbCap   = document.getElementById('lb-caption');
  if (!lb) return;

  function open(src, caption) {
    lbImg.src = src;
    if (lbCap) lbCap.textContent = caption || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (lbImg) lbImg.src = ''; }, 300);
  }

  // Attach to all [data-lb] elements
  document.querySelectorAll('[data-lb]').forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => open(el.dataset.lb, el.dataset.caption || ''));
  });

  lbClose?.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ─────────────────────────────────────
   CONTACT FORM — basic feedback
───────────────────────────────────── */
(function initForm() {
  const btn = document.getElementById('form-submit');
  if (!btn) return;
  btn.addEventListener('click', function () {
    this.textContent = '✓ Message Sent — We\'ll be in touch shortly!';
    this.style.background = '#16a34a';
    this.disabled = true;
  });
})();

/* ─────────────────────────────────────
   SMOOTH SCROLL for anchor links
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '68', 10);
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
