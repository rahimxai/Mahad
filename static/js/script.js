/* ================================================================
   MAHAD HAMZA — PORTFOLIO
   Main JavaScript
================================================================ */
'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ================================================================
// CUSTOM CURSOR (desktop only)
// ================================================================
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -200, mouseY = -200;
  let followerX = -200, followerY = -200;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursor.style.left   = mouseX + 'px';
    cursor.style.top    = mouseY + 'px';
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  const interactiveEls = 'a, button, .video-card, .tool-tag, .social-link, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveEls)) {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveEls)) {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    }
  });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
})();

// ================================================================
// NAVBAR — scroll-based background
// ================================================================
(function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ================================================================
// MOBILE MENU
// ================================================================
(function initMobileMenu() {
  const btn   = $('#menuBtn');
  const menu  = $('#mobileMenu');
  const links = $$('.menu-link');
  if (!btn || !menu) return;

  function open()  { menu.classList.add('open'); btn.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { menu.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = ''; }

  btn.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  links.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ================================================================
// HERO IMAGE — fade in when loaded
// ================================================================
(function initHeroImage() {
  const img = $('#heroBgImg');
  if (!img) return;
  function markLoaded() { img.classList.add('loaded'); }
  img.addEventListener('load', markLoaded);
  if (img.complete && img.naturalWidth > 0) markLoaded();
})();

// ================================================================
// HERO BG TEXT — cursor-follow glow effect
// ================================================================
(function initHeroBgTextGlow() {
  const el = $('.hero-name');
  if (!el) return;

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.textShadow = `
      ${(x - rect.width / 2) * 0.04}px ${(y - rect.height / 2) * 0.04}px 20px rgba(204, 17, 17, 0.9),
      0 0 60px rgba(204, 17, 17, 0.5),
      0 0 120px rgba(204, 17, 17, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.6)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.textShadow = '';
  });
})();

// ================================================================
// HERO PARALLAX — photo scales + shifts on scroll
// ================================================================
(function initParallax() {
  const bgText  = $('.hero-name');
  const bgPhoto = $('.hero-bg-photo');
  const hero    = $('.hero');

  function onScroll() {
    const s = window.scrollY;
    const heroH = hero ? hero.offsetHeight : 900;
    const ratio = Math.min(s / heroH, 1); // 0 → 1 over hero height

    if (bgText) {
      bgText.style.transform = `translateY(${s * -0.08}px)`;
    }
    // Photo scales up and shifts down as you scroll — feels alive
    if (bgPhoto) {
      const scale = 1 + ratio * 0.12; // 1 → 1.12
      bgPhoto.style.transform = `scale(${scale}) translateY(${s * 0.04}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ================================================================
// PASSION PROJECTS CAROUSEL
// ================================================================
(function initPassionCarousel() {
  const pages     = $$('.carousel-page');
  const prevBtn   = $('#passionPrev');
  const nextBtn   = $('#passionNext');
  const indicator = $('#passionIndicator');

  if (!pages.length || !prevBtn || !nextBtn) return;

  const total = pages.length;
  let current = 0;

  function show(index) {
    pages.forEach((p, i) => {
      p.classList.toggle('active', i === index);
    });
    current = index;
    indicator.textContent = `${current + 1} / ${total}`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', () => { if (current > 0) show(current - 1); });
  nextBtn.addEventListener('click', () => { if (current < total - 1) show(current + 1); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!document.querySelector('.passion-section:hover')) return;
    if (e.key === 'ArrowRight' && current < total - 1) show(current + 1);
    if (e.key === 'ArrowLeft' && current > 0) show(current - 1);
  });

  show(0);
})();

// ================================================================
// SCROLL REVEAL
// ================================================================
(function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ================================================================
// SKILL BARS
// ================================================================
(function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.dataset.width;
        if (width) requestAnimationFrame(() => { target.style.width = width + '%'; });
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(f => { f.style.width = '0'; observer.observe(f); });
})();

// ================================================================
// ACTIVE NAV
// ================================================================
(function initActiveNav() {
  const navLinks = $$('.nav-links a');
  const sections = $$('section[id]');
  if (!navLinks.length || !sections.length) return;

  function update() {
    const scrollY = window.scrollY + 120;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].offsetTop <= scrollY) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = navLinks.find(l => l.getAttribute('href') === '#' + sections[i].id);
        if (active) active.classList.add('active');
        break;
      }
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ================================================================
// SMOOTH SCROLL
// ================================================================
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
})();

// ================================================================
// CONTACT FORM — posts to Flask /contact endpoint
// ================================================================
(function initContactForm() {
  const form      = $('#contactForm');
  const submitBtn = $('#submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) return;

    const btnText  = submitBtn.querySelector('.btn-text');
    const btnArrow = submitBtn.querySelector('.btn-arrow');

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (res.ok) {
        submitBtn.classList.add('success');
        if (btnText)  btnText.textContent  = 'Message Sent!';
        if (btnArrow) btnArrow.textContent = '✓';
        form.reset();
      }
    } catch {
      // Silently fail — form stays as-is
    }

    setTimeout(() => {
      submitBtn.classList.remove('success');
      if (btnText)  btnText.textContent  = 'Send Message';
      if (btnArrow) btnArrow.textContent = '→';
    }, 4000);
  });
})();

// ================================================================
// MARQUEE — pause on hover
// ================================================================
(function initMarquee() {
  const track = $('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
  track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
})();

// ================================================================
// WORK CATEGORY TABS + PER-PANEL 2-VIDEO CAROUSEL
// ================================================================
(function initWorkTabs() {
  const workSection = document.getElementById('work');
  if (!workSection) return;
  const tabs   = $$('.work-tab',   workSection);
  const panels = $$('.work-panel', workSection);
  if (!tabs.length) return;

  // ── Per-panel carousel state ──────────────────────────────────
  panels.forEach(panel => {
    const pages     = $$('.wc-page', panel);
    const prevBtn   = panel.querySelector('.wc-prev');
    const nextBtn   = panel.querySelector('.wc-next');
    const indicator = panel.querySelector('.wc-indicator');
    if (!pages.length) return;

    let current = 0;

    function goTo(idx) {
      pages[current].classList.remove('active');
      current = idx;
      pages[current].classList.add('active');
      if (indicator) indicator.textContent = `${current + 1} / ${pages.length}`;
      if (prevBtn)   prevBtn.disabled  = current === 0;
      if (nextBtn)   nextBtn.disabled  = current === pages.length - 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (current < pages.length - 1) goTo(current + 1); });

    goTo(0); // init state
  });

  // ── Tab switching ─────────────────────────────────────────────
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();

// ================================================================
// BRANDING TABS (Pictures / Videos) — same pattern as work tabs
// ================================================================
(function initBrandingTabs() {
  const brandSection = document.getElementById('branding');
  if (!brandSection) return;
  const tabs   = $$('.work-tab',   brandSection);
  const panels = $$('.work-panel', brandSection);
  if (!tabs.length) return;

  // Per-panel carousel (reuses .wc-page / .wc-nav)
  panels.forEach(panel => {
    const pages     = $$('.wc-page', panel);
    const prevBtn   = panel.querySelector('.wc-prev');
    const nextBtn   = panel.querySelector('.wc-next');
    const indicator = panel.querySelector('.wc-indicator');
    if (!pages.length) return;

    let current = 0;

    function goTo(idx) {
      pages[current].classList.remove('active');
      current = idx;
      pages[current].classList.add('active');
      if (indicator) indicator.textContent = `${current + 1} / ${pages.length}`;
      if (prevBtn)   prevBtn.disabled  = current === 0;
      if (nextBtn)   nextBtn.disabled  = current === pages.length - 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (current < pages.length - 1) goTo(current + 1); });

    goTo(0);
  });

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.btab;
      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = brandSection.querySelector('#btab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();
