/* ============================================
   RAHUL S BAISANI — PORTFOLIO SCRIPT
   ============================================ */

'use strict';

/* =====================
   MOBILE NAV TOGGLE
   ===================== */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(0, 7.5px)';
    spans[1].style.transform = 'rotate(-45deg) translate(0, -7.5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

/* =====================
   ACTIVE NAV ON SCROLL
   ===================== */
const navLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('section[id]');

const updateActiveLink = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
};

window.addEventListener('scroll', updateActiveLink, { passive: true });

/* =====================
   SCROLL REVEAL
   ===================== */
const revealSelectors = [
  '.skill-row',
  '.exp-item',
  '.project-card',
  '.edu-item',
  '.cert-list li',
  '.contact-link',
  '.about-content p',
  '.stat-block',
  '.extracurr-item',
  '.two-col-layout > div',
];

document.querySelectorAll(revealSelectors.join(',')).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 5) * 0.07}s`;
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.07, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* =====================
   HEADER SHADOW ON SCROLL
   ===================== */
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.style.borderBottomColor = window.scrollY > 40
    ? 'rgba(197,64,30,0.15)'
    : '';
}, { passive: true });

/* =====================
   SMOOTH SCROLL
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =====================
   STAT COUNTER ANIMATION
   ===================== */
const statNums = document.querySelectorAll('.stat-big');

const animateCount = (el) => {
  const raw = el.textContent.trim();
  const hasDot = raw.includes('.');
  const hasPlus = raw.includes('+');
  const target = parseFloat(raw);
  if (isNaN(target)) return;

  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target * ease;

    el.textContent = (hasDot ? val.toFixed(2) : Math.floor(val)) + (hasPlus ? '+' : '');

    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = raw;
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });

statNums.forEach(el => counterObserver.observe(el));

/* =====================
   PROJECT CARD HOVER TILT
   ===================== */
document.querySelectorAll('.project-card:not(.project-featured)').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    card.style.transform = `perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

console.log('RSB Portfolio — ECE \'26, DSATM, Bengaluru 🛠');
