/* ============================================================
   PORTFOLIO SCRIPT — Premium Interactions
============================================================ */

// ── Page Loader ──────────────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        triggerHeroAnimations();
    }, 900);
});

// ── Hero Fade-Up Animations ───────────────────────────────────
function triggerHeroAnimations() {
    const fadeEls = document.querySelectorAll('.fade-up');
    fadeEls.forEach(el => {
        setTimeout(() => el.classList.add('visible'), 100);
    });
}

// ── Typing Effect ─────────────────────────────────────────────
const phrases = [
    'build things for the web.',
    'craft digital experiences.',
    'turn ideas into reality.',
    'love clean, impactful code.'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
    if (!typedEl) return;
    const current = phrases[phraseIndex];
    if (isDeleting) {
        typedEl.textContent = current.substring(0, --charIndex);
    } else {
        typedEl.textContent = current.substring(0, ++charIndex);
    }
    let delay = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
    }
    setTimeout(type, delay);
}
setTimeout(type, 1800);

// ── Particle Canvas ───────────────────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 218, ${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Blob Follow Mouse ─────────────────────────────────────────
const blob = document.getElementById('blob');
document.addEventListener('mousemove', e => {
    blob.animate({
        left: `${e.clientX}px`,
        top:  `${e.clientY}px`
    }, { duration: 4000, fill: 'forwards' });
});

// ── Navbar: Scroll Hide/Show + Scrolled Class ─────────────────
let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 100) {
        navbar.classList.add('scroll-down');
    } else {
        navbar.classList.remove('scroll-down');
    }
    navbar.classList.toggle('scrolled', currentY > 50);
    lastScrollY = currentY;
    updateActiveNav();
});

// ── Active Nav Highlighting ───────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links .nav-link');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) current = section.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

// ── Intersection Observer ─────────────────────────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

// ── Card Glow on Mouse Move ───────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.querySelector('.card-glow').style.background =
            `radial-gradient(circle at ${x}% ${y}%, rgba(100,255,218,0.1) 0%, transparent 60%)`;
    });
    card.addEventListener('mouseleave', () => {
        card.querySelector('.card-glow').style.background =
            'radial-gradient(circle at 50% 0%, rgba(100,255,218,0.06) 0%, transparent 60%)';
    });
});

// ── Contact Form ──────────────────────────────────────────────
const form = document.getElementById('contact-form');
const statusDiv = document.getElementById('form-status');

form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    const span = btn.querySelector('span');
    const originalText = span.textContent;
    span.textContent = 'Sending...';
    btn.disabled = true;

    fetch('https://formsubmit.co/ajax/isreeharim@gmail.com', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    })
    .then(r => r.json())
    .then(data => {
        span.textContent = originalText;
        btn.disabled = false;
        if (data.success) {
            statusDiv.style.color = 'var(--accent)';
            statusDiv.textContent = '✓ Message sent successfully!';
            form.reset();
        } else {
            statusDiv.style.color = '#ff6b6b';
            statusDiv.textContent = '✗ Something went wrong. Try again.';
        }
        setTimeout(() => statusDiv.textContent = '', 5000);
    })
    .catch(() => {
        span.textContent = originalText;
        btn.disabled = false;
        statusDiv.style.color = '#ff6b6b';
        statusDiv.textContent = '✗ Network error. Please try again.';
        setTimeout(() => statusDiv.textContent = '', 5000);
    });
});

// ── Mobile Hamburger ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');

function openMobileNav() {
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileNav);
mobileNavClose.addEventListener('click', closeMobileNav);
mobileOverlay.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMobileNav));
