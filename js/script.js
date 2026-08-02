/* ================================================================
   MAHAD HAMZA — PORTFOLIO
   Main JavaScript
================================================================ */

'use strict';

// ================================================================
// UTILITIES
// ================================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ================================================================
// CUSTOM CURSOR  (desktop only)
// ================================================================
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');

  if (!cursor || !follower || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -200, mouseY = -200;
  let followerX = -200, followerY = -200;
  let rafId;

  // Track real mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follower loop
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;

    cursor.style.left   = mouseX + 'px';
    cursor.style.top    = mouseY + 'px';
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';

    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale on interactive elements
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

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });
})();

// ================================================================
// NAVBAR — scroll-based background
// ================================================================
(function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

// ================================================================
// MOBILE MENU
// ================================================================
(function initMobileMenu() {
  const btn    = $('#menuBtn');
  const menu   = $('#mobileMenu');
  const links  = $$('.menu-link');
  if (!btn || !menu) return;

  function openMenu()  {
    menu.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  links.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();

// ================================================================
// HERO BACKGROUND IMAGE — fade in when loaded
// ================================================================
(function initHeroImage() {
  const img = $('#heroBgImg');
  if (!img) return;

  function markLoaded() {
    img.classList.add('loaded');
  }

  img.addEventListener('load', markLoaded);

  // If already cached / instantly available
  if (img.complete && img.naturalWidth > 0) {
    markLoaded();
  }
})();

// ================================================================
// HERO PARALLAX — photo shifts slightly on scroll (depth effect)
// ================================================================
(function initParallax() {
  const bgText  = $('.hero-bg-text');
  const bgPhoto = $('#heroBgImg');

  function onScroll() {
    const scrolled = window.scrollY;
    // Text drifts upward slightly (right-anchored, so only Y axis)
    if (bgText) {
      bgText.style.transform = `translateY(calc(-50% + ${scrolled * 0.12}px))`;
    }
    // Photo moves at a slower rate — creates depth between text and photo
    if (bgPhoto) {
      bgPhoto.style.transform = `translateY(${scrolled * 0.06}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ================================================================
// SCROLL REVEAL — Intersection Observer for .reveal elements
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ================================================================
// SKILL BARS — animate width when scrolled into view
// ================================================================
(function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.dataset.width;
        if (width) {
          // Small delay so the CSS transition fires after layout paint
          requestAnimationFrame(() => {
            target.style.width = width + '%';
          });
        }
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(fill => {
    fill.style.width = '0';
    observer.observe(fill);
  });
})();

// ================================================================
// ACTIVE NAV LINKS — highlight current section
// ================================================================
(function initActiveNav() {
  const navLinks = $$('.nav-links a');
  const sections = $$('section[id]');
  if (!navLinks.length || !sections.length) return;

  function update() {
    const scrollY = window.scrollY + 120;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.offsetTop <= scrollY) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = navLinks.find(l => l.getAttribute('href') === '#' + section.id);
        if (active) active.classList.add('active');
        break;
      }
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ================================================================
// SMOOTH SCROLL for anchor links
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
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

// ================================================================
// CONTACT FORM — basic submit handler
// ================================================================
(function initContactForm() {
  const form      = $('#contactForm');
  const submitBtn = $('#submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) return;

    // Simulate send (replace with real form handling / EmailJS / Formspree)
    const btnText  = submitBtn.querySelector('.btn-text');
    const btnArrow = submitBtn.querySelector('.btn-arrow');

    submitBtn.classList.add('success');
    if (btnText)  btnText.textContent  = 'Message Sent!';
    if (btnArrow) btnArrow.textContent = '✓';

    setTimeout(() => {
      submitBtn.classList.remove('success');
      if (btnText)  btnText.textContent  = 'Send Message';
      if (btnArrow) btnArrow.textContent = '→';
      form.reset();
    }, 4000);
  });
})();

// ================================================================
// MARQUEE — pause on hover for accessibility
// ================================================================
(function initMarquee() {
  const track = $('.marquee-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
  track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
})();
