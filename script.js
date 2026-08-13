/* ============================================================
   PORTFOLIO SCRIPT — Dynamic Data Hydration & Premium Interactions
============================================================ */

// ── Typing Effect State ───────────────────────────────────────
let phrases = [
    'build things for the web.',
    'craft digital experiences.',
    'turn ideas into reality.',
    'love clean, impactful code.'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
let typingTimeout = null;

// ── Page Loader ──────────────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            triggerHeroAnimations();
        }, 800);
    }
});

// ── Hero Fade-Up Animations ───────────────────────────────────
function triggerHeroAnimations() {
    const fadeEls = document.querySelectorAll('.fade-up');
    fadeEls.forEach(el => {
        setTimeout(() => el.classList.add('visible'), 100);
    });
}

// ── Dynamic Typing Effect ─────────────────────────────────────
const typedEl = document.getElementById('typed-text');

function type() {
    if (!typedEl) return;
    if (!phrases || phrases.length === 0) {
        typedEl.textContent = 'build impactful software.';
        return;
    }
    
    if (phraseIndex >= phrases.length) phraseIndex = 0;
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
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(type, delay);
}

// ── Data Hydration: Render Page from Data Store ──────────────
function renderPortfolio() {
    if (typeof getPortfolioData !== 'function') return;
    const data = getPortfolioData();

    // 1. Meta & Branding
    if (data.meta) {
        if (data.meta.siteTitle) document.title = data.meta.siteTitle;
        const metaDescEl = document.getElementById('meta-desc');
        if (metaDescEl && data.meta.metaDescription) metaDescEl.setAttribute('content', data.meta.metaDescription);
        
        const brandLogo = document.getElementById('nav-logo');
        if (brandLogo) {
            brandLogo.innerHTML = `${escapeHtml(data.meta.brandName || 'Sreehari')}<span class="dot">.</span>${escapeHtml(data.meta.brandDot || 'M')}`;
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

    // 2. Hero Section
    if (data.hero) {
        const greetingEl = document.getElementById('hero-greeting');
        if (greetingEl) greetingEl.textContent = data.hero.greeting || 'Hi, my name is';
        
        const nameEl = document.getElementById('hero-name');
        if (nameEl) nameEl.textContent = data.hero.name || 'Sreehari';
        
        const summaryEl = document.getElementById('hero-summary');
        if (summaryEl) summaryEl.textContent = data.hero.summary || '';
        
        const projBtn = document.getElementById('hero-projects-btn');
        if (projBtn) {
            projBtn.textContent = data.hero.primaryBtnText || 'Check out my work';
            projBtn.setAttribute('href', data.hero.primaryBtnLink || '#projects');
        }
        
        const contactBtn = document.getElementById('hero-contact-btn');
        if (contactBtn) {
            contactBtn.textContent = data.hero.secondaryBtnText || 'Get in touch';
            contactBtn.setAttribute('href', data.hero.secondaryBtnLink || '#contact');
        }

        if (Array.isArray(data.hero.phrases) && data.hero.phrases.length > 0) {
            phrases = data.hero.phrases;
            phraseIndex = 0;
            charIndex = 0;
            isDeleting = false;
        }
    }

    // 3. Sidebars & Socials
    if (data.socials) {
        const emailLink = document.getElementById('sidebar-email-link');
        if (emailLink && data.socials.email) {
            emailLink.textContent = data.socials.email;
            emailLink.setAttribute('href', `mailto:${data.socials.email}`);
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

    // 4. About Section
    if (data.about) {
        const aboutTitleText = document.getElementById('about-title-text');
        if (aboutTitleText) aboutTitleText.textContent = data.about.headingTitle || 'About Me';

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

        // Code Card
        const codeCardContent = document.getElementById('code-card-content');
        if (codeCardContent && data.about.codeCard) {
            const cc = data.about.codeCard;
            codeCardContent.innerHTML = `<span class="kw">const</span> <span class="fn">developer</span> = {
  name:    <span class="str">"${escapeHtml(cc.name || 'Sreehari')}"</span>,
  role:    <span class="str">"${escapeHtml(cc.role || 'Full Stack')}"</span>,
  passion: <span class="str">"${escapeHtml(cc.passion || 'Coding')}"</span>,
  coffee:  <span class="bool">${Boolean(cc.coffee)}</span>,
  open:    <span class="bool">${Boolean(cc.open)}</span>
};`;
        }
    }

    // 5. Projects Section (CRUD Render)
    const projectGrid = document.getElementById('project-grid');
    if (projectGrid && Array.isArray(data.projects)) {
        const visibleProjects = data.projects.filter(p => p.visible !== false);
        
        if (visibleProjects.length === 0) {
            projectGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-secondary); font-family: var(--font-mono);">
                    <p>No projects visible yet. Add projects in the <a href="admin.html" style="color:var(--accent); text-decoration: underline;">Admin Studio</a>.</p>
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
                        <div class="project-content">
                            <div class="project-top">
                                <div class="folder-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                                <div class="project-links">
                                    ${linkIcons}
                                </div>
                            </div>
                            <h3 class="project-title">${escapeHtml(p.title || 'Untitled Project')}</h3>
                            <div class="project-description">
                                <p>${escapeHtml(p.description || '')}</p>
                            </div>
                        </div>
                        <ul class="project-tech-list">
                            ${techList}
                        </ul>
                    </div>
                `;
            }).join('');
        }
        
        // Re-attach card glow events
        bindCardGlow();
    }

    // 6. Contact Form Text & Details
    if (data.contact) {
        const overline = document.getElementById('contact-overline');
        if (overline) overline.textContent = data.contact.overline || "03. What's Next?";
        
        const heading = document.getElementById('contact-heading');
        if (heading) heading.textContent = data.contact.heading || "Get In Touch";
        
        const desc = document.getElementById('contact-desc');
        if (desc) desc.textContent = data.contact.description || "";
        
        const submitBtnText = document.getElementById('submit-btn-text');
        if (submitBtnText) submitBtnText.textContent = data.contact.btnText || "Say Hello";
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

// ── Particle Canvas ───────────────────────────────────────────
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
}

// ── Blob Follow Mouse ─────────────────────────────────────────
const blob = document.getElementById('blob');
if (blob) {
    document.addEventListener('mousemove', e => {
        blob.animate({
            left: `${e.clientX}px`,
            top:  `${e.clientY}px`
        }, { duration: 4000, fill: 'forwards' });
    });
}

// ── Navbar: Scroll Hide/Show + Scrolled Class ─────────────────
let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (navbar) {
        if (currentY > lastScrollY && currentY > 100) {
            navbar.classList.add('scroll-down');
        } else {
            navbar.classList.remove('scroll-down');
        }
        navbar.classList.toggle('scrolled', currentY > 50);
    }
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
function bindCardGlow() {
    document.querySelectorAll('.project-card').forEach(card => {
        const glow = card.querySelector('.card-glow');
        if (!glow) return;
        
        card.onmousemove = e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            glow.style.background =
                `radial-gradient(circle at ${x}% ${y}%, rgba(100,255,218,0.12) 0%, transparent 60%)`;
        };
        card.onmouseleave = () => {
            glow.style.background =
                'radial-gradient(circle at 50% 0%, rgba(100,255,218,0.06) 0%, transparent 60%)';
        };
    });
}

// ── Contact Form ──────────────────────────────────────────────
const form = document.getElementById('contact-form');
const statusDiv = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = (typeof getPortfolioData === 'function') ? getPortfolioData() : {};
        const recipientEmail = (data.contact && data.contact.formEmail) ? data.contact.formEmail : 'isreeharim@gmail.com';
        
        const btn = form.querySelector('.submit-btn');
        const span = btn ? btn.querySelector('span') : null;
        const originalText = span ? span.textContent : 'Say Hello';
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
                statusDiv.textContent = '✓ Message sent successfully!';
                form.reset();
            } else {
                statusDiv.style.color = '#ff6b6b';
                statusDiv.textContent = '✗ Something went wrong. Try again.';
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

// ── Mobile Hamburger ──────────────────────────────────────────
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

// ── Keyboard shortcut to open Admin: Ctrl + Shift + A ────────
window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = 'admin.html';
    }
});

// ── Initial Render & Cross-Tab Synchronization ──────────────
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolio();
    setTimeout(type, 1200);
});

// Re-render when data is updated via Admin or another tab
window.addEventListener('portfolioDataUpdated', () => {
    renderPortfolio();
});

window.addEventListener('storage', e => {
    if (e.key === STORAGE_KEY) {
        renderPortfolio();
    }
});
