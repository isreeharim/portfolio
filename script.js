/* ============================================================
   PORTFOLIO SCRIPT — Emil Kowalski Craft Standard
   Dynamic Data Hydration, Fluid Interactions & Physics Easing
============================================================ */

// ── 1. TYPING ANIMATION ENGINE ────────────────────────────────
let phrases = [
    'engineer resilient full-stack systems.',
    'craft human-centered digital products.',
    'build intelligent AI-powered apps.',
    'obsess over UI polish & micro-interactions.',
    'turn ambitious ideas into reality.'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
let typingTimeout = null;
const typedEl = document.getElementById('typed-text');

function type() {
    if (!typedEl) return;
    if (!phrases || phrases.length === 0) {
        typedEl.textContent = 'build high-impact software.';
        return;
    }

    if (phraseIndex >= phrases.length) phraseIndex = 0;
    const current = phrases[phraseIndex];

    if (isDeleting) {
        typedEl.textContent = current.substring(0, --charIndex);
    } else {
        typedEl.textContent = current.substring(0, ++charIndex);
    }

    let delay = isDeleting ? 35 : 75;
    if (!isDeleting && charIndex === current.length) {
        delay = 2200; // Pause on completed sentence
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400; // Brief pause before starting next sentence
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(type, delay);
}

// ── 2. PAGE LOADER & FADE-UP ANIMATIONS ───────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            triggerHeroAnimations();
        }, 750);
    }
});

function triggerHeroAnimations() {
    const fadeEls = document.querySelectorAll('.fade-up');
    fadeEls.forEach(el => {
        setTimeout(() => el.classList.add('visible'), 50);
    });
}

// ── 3. DATA HYDRATION: RENDER PAGE FROM DATA STORE ───────────
function renderPortfolio() {
    if (typeof getPortfolioData !== 'function') return;
    const data = getPortfolioData();

    // A. Meta & Branding
    if (data.meta) {
        if (data.meta.siteTitle) document.title = data.meta.siteTitle;
        const metaDescEl = document.getElementById('meta-desc');
        if (metaDescEl && data.meta.metaDescription) metaDescEl.setAttribute('content', data.meta.metaDescription);

        const brandLogo = document.getElementById('nav-logo');
        if (brandLogo) {
            brandLogo.innerHTML = `
                <span class="logo-text">${escapeHtml(data.meta.brandName || 'Sreehari')}</span><span class="logo-dot">.</span><span class="logo-sub">${escapeHtml(data.meta.brandDot || 'M')}</span>
                <span class="online-indicator" title="Available for opportunities"></span>
            `;
        }

        const loaderLogo = document.getElementById('loader-logo');
        if (loaderLogo) {
            loaderLogo.innerHTML = `${escapeHtml(data.meta.loaderText || 'S')}<span>.</span>`;
        }

        const footerText = document.getElementById('footer-text');
        if (footerText && data.meta.footerText) {
            footerText.innerHTML = `${escapeHtml(data.meta.footerText)}`;
        }
    }

    // B. Hero Section
    if (data.hero) {
        const badgeEl = document.getElementById('hero-badge');
        if (badgeEl) badgeEl.textContent = data.hero.badge || data.meta?.statusBadge || 'Available for new opportunities';

        const greetingEl = document.getElementById('hero-greeting');
        if (greetingEl) greetingEl.textContent = data.hero.greeting || "Hello, I'm";

        const nameEl = document.getElementById('hero-name');
        if (nameEl) nameEl.innerHTML = `${escapeHtml(data.hero.name || 'Sreehari M')}<span class="hero-period">.</span>`;

        const summaryEl = document.getElementById('hero-summary');
        if (summaryEl) summaryEl.textContent = data.hero.summary || '';

        const projBtn = document.getElementById('hero-projects-btn');
        if (projBtn) {
            projBtn.querySelector('span').textContent = data.hero.primaryBtnText || 'Explore My Work';
            projBtn.setAttribute('href', data.hero.primaryBtnLink || '#projects');
        }

        const contactBtn = document.getElementById('hero-contact-btn');
        if (contactBtn) {
            contactBtn.querySelector('span').textContent = data.hero.secondaryBtnText || 'Get in Touch';
            contactBtn.setAttribute('href', data.hero.secondaryBtnLink || '#contact');
        }

        if (Array.isArray(data.hero.phrases) && data.hero.phrases.length > 0) {
            phrases = data.hero.phrases;
            phraseIndex = 0;
            charIndex = 0;
            isDeleting = false;
        }
    }

    // C. Sidebars & Socials
    if (data.socials) {
        const emailLink = document.getElementById('sidebar-email-link');
        if (emailLink && data.socials.email) {
            emailLink.textContent = data.socials.email;
            emailLink.setAttribute('href', `mailto:${data.socials.email}`);
        }

        const mobileEmail = document.getElementById('mobile-email-link');
        if (mobileEmail && data.socials.email) {
            mobileEmail.textContent = data.socials.email;
            mobileEmail.setAttribute('href', `mailto:${data.socials.email}`);
        }

        const gh = document.getElementById('social-github');
        if (gh) gh.href = data.socials.github || '#';

        const li = document.getElementById('social-linkedin');
        if (li) li.href = data.socials.linkedin || '#';

        const tw = document.getElementById('social-twitter');
        if (tw) tw.href = data.socials.twitter || '#';

        const ig = document.getElementById('social-instagram');
        if (ig) ig.href = data.socials.instagram || '#';
    }

    // D. About Section
    if (data.about) {
        const aboutTitleText = document.getElementById('about-title-text');
        if (aboutTitleText) aboutTitleText.textContent = data.about.headingTitle || 'About & Philosophy';

        const paragraphsContainer = document.getElementById('about-paragraphs');
        if (paragraphsContainer && Array.isArray(data.about.paragraphs)) {
            paragraphsContainer.innerHTML = data.about.paragraphs.map(p => {
                const formatted = escapeHtml(p).replace(/\n/g, '<br>');
                return `<p>${formatted}</p>`;
            }).join('');
        }

        // Skills List
        const skillsContainer = document.getElementById('skills-list');
        if (skillsContainer && Array.isArray(data.about.skills)) {
            skillsContainer.innerHTML = data.about.skills.map(s => `<li>${escapeHtml(s)}</li>`).join('');
        }

        // Code Terminal Card
        const codeCardContent = document.getElementById('code-card-content');
        if (codeCardContent && data.about.codeCard) {
            const cc = data.about.codeCard;
            codeCardContent.innerHTML = `<span class="t-kw">const</span> <span class="t-fn">developer</span>: <span class="t-type">DeveloperProfile</span> = {
  name:     <span class="t-str">"${escapeHtml(cc.name || 'Sreehari M')}"</span>,
  role:     <span class="t-str">"${escapeHtml(cc.role || 'Software Developer')}"</span>,
  location: <span class="t-str">"${escapeHtml(cc.location || 'India')}"</span>,
  passion:  <span class="t-str">"${escapeHtml(cc.passion || 'Crafting Great Software')}"</span>,
  coffee:   <span class="t-bool">${Boolean(cc.coffee)}</span>,
  open:     <span class="t-bool">${Boolean(cc.open)}</span>
};`;
        }
    }

    // E. Projects Section (CRUD Render)
    const projectGrid = document.getElementById('project-grid');
    if (projectGrid && Array.isArray(data.projects)) {
        const visibleProjects = data.projects.filter(p => p.visible !== false);

        if (visibleProjects.length === 0) {
            projectGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-secondary); font-family: var(--font-mono);">
                    <p>No projects visible. Manage projects in the Admin Studio.</p>
                </div>
            `;
        } else {
            projectGrid.innerHTML = visibleProjects.map((p, index) => {
                const techList = (p.techStack || []).map(t => `<li>${escapeHtml(t)}</li>`).join('');

                let linkIcons = '';
                if (p.githubUrl && p.githubUrl.trim() !== '') {
                    linkIcons += `
                        <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository" class="icon-btn" title="View Source Code">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                    `;
                }
                if (p.liveUrl && p.liveUrl.trim() !== '') {
                    linkIcons += `
                        <a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Live Demo" class="icon-btn" title="Open Live Site">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                    `;
                }

                return `
                    <div class="project-card" id="${escapeHtml(p.id || 'project-' + index)}">
                        <div class="card-glow"></div>
                        <div class="project-inner">
                            <div class="project-top">
                                <div class="folder-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                                <div class="project-links">
                                    ${linkIcons}
                                </div>
                            </div>
                            <h3 class="project-title">${escapeHtml(p.title || 'Untitled Project')}</h3>
                            <p class="project-description">${escapeHtml(p.description || '')}</p>
                        </div>
                        <ul class="project-tech-list">
                            ${techList}
                        </ul>
                    </div>
                `;
            }).join('');
        }

        bindCardSpotlight();
    }

    // F. Contact Form Text & Details
    if (data.contact) {
        const overline = document.getElementById('contact-overline');
        if (overline) overline.textContent = data.contact.overline || "04. What's Next?";

        const heading = document.getElementById('contact-heading');
        if (heading) heading.textContent = data.contact.heading || "Let's Build Something Together";

        const desc = document.getElementById('contact-desc');
        if (desc) desc.textContent = data.contact.description || "";

        const submitBtnText = document.getElementById('submit-btn-text');
        if (submitBtnText) submitBtnText.textContent = data.contact.btnText || "Send Message";
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ── 4. CARD SPOTLIGHT CURSOR TRACKING ─────────────────────────
function bindCardSpotlight() {
    document.querySelectorAll('.project-card').forEach(card => {
        const glow = card.querySelector('.card-glow');
        if (!glow) return;

        card.onmousemove = e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            glow.style.background =
                `radial-gradient(circle at ${x}% ${y}%, rgba(100, 255, 218, 0.15) 0%, transparent 65%)`;
        };
        card.onmouseleave = () => {
            glow.style.background =
                'radial-gradient(circle at 50% 0%, rgba(100, 255, 218, 0.05) 0%, transparent 60%)';
        };
    });
}

// ── 5. TERMINAL COPY SNIPPET BUTTON ───────────────────────────
function initCopyCodeButton() {
    const btn = document.getElementById('copy-code-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const codeEl = document.getElementById('code-card-content');
        if (!codeEl) return;
        const text = codeEl.innerText || codeEl.textContent;

        navigator.clipboard.writeText(text).then(() => {
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
        }).catch(err => {
            console.error('Failed to copy code:', err);
        });
    });
}

// ── 6. AMBIENT PARTICLES CANVAS ───────────────────────────────
const canvas = document.getElementById('particles-canvas');
let ctx, particles = [];

if (canvas) {
    ctx = canvas.getContext('2d');

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
            this.size = Math.random() * 1.4 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.25;
            this.speedY = (Math.random() - 0.5) * 0.25;
            this.alpha = Math.random() * 0.35 + 0.08;
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

    for (let i = 0; i < 70; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ── 7. MOUSE BLOB DRIFT ───────────────────────────────────────
const blob = document.getElementById('blob');
if (blob) {
    document.addEventListener('mousemove', e => {
        blob.animate({
            left: `${e.clientX - 300}px`,
            top:  `${e.clientY - 300}px`
        }, { duration: 3500, fill: 'forwards' });
    });
}

// ── 8. NAVBAR SCROLL & ACTIVE SPY ─────────────────────────────
let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (navbar) {
        if (currentY > lastScrollY && currentY > 120) {
            navbar.classList.add('scroll-down');
        } else {
            navbar.classList.remove('scroll-down');
        }
    }
    lastScrollY = currentY;
    updateActiveNav();
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links .nav-link');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 220) current = section.id;
    });
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${current}`);
    });
}

// ── 9. SCROLL REVEAL OBSERVER ─────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

// ── 10. CONTACT FORM HANDLER ──────────────────────────────────
const form = document.getElementById('contact-form');
const statusDiv = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = (typeof getPortfolioData === 'function') ? getPortfolioData() : {};
        const recipientEmail = (data.contact && data.contact.formEmail) ? data.contact.formEmail : 'isreeharim@gmail.com';

        const btn = form.querySelector('.btn-submit-action');
        const span = btn ? btn.querySelector('span') : null;
        const originalText = span ? span.textContent : 'Send Message';
        if (span) span.textContent = 'Sending...';
        if (btn) btn.disabled = true;

        fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(r => r.json())
        .then(res => {
            if (span) span.textContent = originalText;
            if (btn) btn.disabled = false;
            if (res.success) {
                statusDiv.style.color = 'var(--accent)';
                statusDiv.textContent = '✓ Message delivered successfully!';
                form.reset();
            } else {
                statusDiv.style.color = '#ff6b6b';
                statusDiv.textContent = '✗ Something went wrong. Please try again.';
            }
            setTimeout(() => statusDiv.textContent = '', 5000);
        })
        .catch(() => {
            if (span) span.textContent = originalText;
            if (btn) btn.disabled = false;
            statusDiv.style.color = '#ff6b6b';
            statusDiv.textContent = '✗ Network error. Please try again.';
            setTimeout(() => statusDiv.textContent = '', 5000);
        });
    });
}

// ── 11. MOBILE DRAWER NAVIGATION ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');

function openMobileNav() {
    if (mobileNav) mobileNav.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMobileNav);
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMobileNav));

// ── 12. ADMIN SHORTCUT: Ctrl + Shift + A ──────────────────────
window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = 'admin.html';
    }
});

// ── 13. INITIALIZATION & CROSS-TAB SYNC ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolio();
    initCopyCodeButton();
    setTimeout(type, 1000);
});

window.addEventListener('portfolioDataUpdated', () => {
    renderPortfolio();
});

window.addEventListener('storage', e => {
    if (e.key === STORAGE_KEY) {
        renderPortfolio();
    }
});
