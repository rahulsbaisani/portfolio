/* ============================================
   RAHUL S BAISANI — PORTFOLIO SCRIPT
   ============================================ */

'use strict';

/* =====================
   NAVBAR — scroll + mobile toggle
   ===================== */
const navbar    = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');
const navLinks  = document.querySelectorAll('.nav-link');

// Scrolled class
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile toggle
hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    const spans  = hamburger.querySelectorAll('span');
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 7px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -7px)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
            s.style.transform = '';
            s.style.opacity   = '';
        });
    });
});

/* =====================
   ACTIVE NAV LINK on scroll
   ===================== */
const sections = document.querySelectorAll('section[id]');

const setActiveLink = () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
            current = sec.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
};

window.addEventListener('scroll', setActiveLink, { passive: true });

/* =====================
   SCROLL REVEAL
   ===================== */
const revealEls = [
    '.skill-card',
    '.project-card',
    '.timeline-item',
    '.cert-card',
    '.contact-card',
    '.stat-card',
    '.exp-card',
    '.extracurr-item',
    '.about-text p',
    '.section-title',
];

// Add reveal class to elements
document.querySelectorAll(revealEls.join(',')).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
});

const revealObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =====================
   STAT COUNTER ANIMATION
   ===================== */
const statNums = document.querySelectorAll('.stat-num[data-target]');

const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal || '0');
    const duration = 1600;
    const start    = performance.now();

    const update = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 4);
        const value    = target * ease;

        el.textContent = decimals > 0
            ? value.toFixed(decimals)
            : Math.floor(value) + (el.dataset.suffix || '');

        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = decimals > 0
            ? target.toFixed(decimals)
            : target + (el.dataset.suffix || '');
    };

    requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

/* =====================
   PROJECT CARD — subtle 3D tilt
   ===================== */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left - rect.width  / 2;
        const y      = e.clientY - rect.top  - rect.height / 2;
        const rotateX = -(y / rect.height) * 6;
        const rotateY =  (x / rect.width)  * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

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
   CURSOR TRAIL (desktop only)
   ===================== */
if (window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const TRAIL_COUNT = 14;
    const trail = Array.from({ length: TRAIL_COUNT }, () => {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        document.body.appendChild(dot);
        return { el: dot, x: 0, y: 0 };
    });

    const style = document.createElement('style');
    style.textContent = `
        .cursor-trail {
            position: fixed;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(99, 232, 255, 0.4);
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s;
        }
    `;
    document.head.appendChild(style);

    let mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const animateTrail = () => {
        let x = mouse.x, y = mouse.y;
        trail.forEach((dot, i) => {
            const scale = (TRAIL_COUNT - i) / TRAIL_COUNT;
            dot.el.style.cssText = `
                left: ${x - 3}px;
                top:  ${y - 3}px;
                transform: scale(${scale});
                opacity: ${scale * 0.5};
            `;
            dot.x = x;
            dot.y = y;
            const next = trail[i + 1] || trail[0];
            x += (next.x - x) * 0.4;
            y += (next.y - y) * 0.4;
        });
        requestAnimationFrame(animateTrail);
    };

    animateTrail();
}

console.log('Portfolio loaded. CGPA 8.51 and climbing 🚀');
