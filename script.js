
// ─── ÉTAT ───────────────────────────
const S = {
    theme: localStorage.getItem('cv-theme') || 'dark'
};

// ─── BOOT ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    document.getElementById('themeBtn')?.addEventListener('click', toggleTheme);
    generateParticles();
});

window.addEventListener('load', () => setTimeout(runLoader, 80));

// ─── LOADER ─────────────────────────
function runLoader() {
    const loader = document.getElementById('loader');
    const pctEl = document.getElementById('loaderPct');
    if (!loader) return;

    let v = 0;
    const iv = setInterval(() => {
        v += Math.random() * 20;
        if (v >= 100) {
            v = 100;
            clearInterval(iv);
            if (pctEl) pctEl.textContent = '100%';
            setTimeout(() => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: loader,
                        opacity: [1, 0],
                        duration: 400,
                        easing: 'easeInOutQuad',
                        complete: () => { loader.classList.add('hidden'); onLoaded(); }
                    });
                } else {
                    loader.classList.add('hidden');
                    onLoaded();
                }
            }, 200);
        }
        if (pctEl) pctEl.textContent = Math.floor(v) + '%';
    }, 90);
}

// ─── ANIMATIONS APRÈS CHARGEMENT ─────
function onLoaded() {
    animateHeader();
    animateLeft();
    initSkillBars();
    initScrollReveal();
    startRoleRotation();
}

/* Header */
function animateHeader() {
    if (typeof anime === 'undefined') return;
    anime({
        targets: '.code-comment',
        opacity: [0, 1], translateY: [-10, 0],
        duration: 600, delay: 200, easing: 'easeOutExpo'
    });
    // Nom lettre par lettre (typewriter sur le lastName)
    const last = document.querySelector('.hn-last');
    if (last) {
        const txt = last.textContent;
        last.textContent = '';
        anime({
            targets: { v: 0 }, v: txt.length,
            duration: 900, delay: 400, easing: 'easeInOutQuad',
            update(a) { last.textContent = txt.substring(0, Math.floor(a.animatables[0].target.v)); }
        });
    }
    anime({
        targets: '.header-subtitle',
        opacity: [0, 1], translateX: [-20, 0],
        duration: 700, delay: 900, easing: 'easeOutExpo'
    });
}

/* Colonne gauche : stagger */
function animateLeft() {
    if (typeof anime === 'undefined') return;
    anime({
        targets: '.portrait-ring',
        opacity: [0, 1], scale: [0.7, 1], rotate: [-15, 0],
        duration: 1000, delay: 300,
        easing: 'easeOutElastic(1, .7)'
    });
    anime({
        targets: '.left-block',
        opacity: [0, 1], translateX: [-20, 0],
        delay: anime.stagger(100, { start: 600 }),
        duration: 600, easing: 'easeOutExpo'
    });
}

/* Barres de compétences */
function initSkillBars() {
    const items = document.querySelectorAll('.skill-item');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const item = e.target;
            const fill = item.querySelector('.sk-fill');
            const pctEl = item.querySelector('.sk-pct');
            const pct = parseInt(item.dataset.pct || 0);
            if (fill && typeof anime !== 'undefined') {
                anime({
                    targets: fill,
                    width: ['0%', pct + '%'],
                    duration: 1500, delay: 150, easing: 'easeOutExpo'
                });
                anime({
                    targets: { v: 0 }, v: pct,
                    duration: 1500, delay: 150, easing: 'easeOutExpo',
                    update(a) {
                        if (pctEl) pctEl.textContent = Math.floor(a.animatables[0].target.v) + '%';
                    }
                });
            }
            obs.unobserve(item);
        });
    }, { threshold: 0.4 });
    items.forEach(i => obs.observe(i));
}

/* Scroll reveal : cards droite */
function initScrollReveal() {
    const els = document.querySelectorAll('.tl-card, .edu-card, .cv-section');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            if (typeof anime !== 'undefined') {
                anime({
                    targets: el,
                    opacity: [0, 1], translateY: [20, 0],
                    duration: 600, easing: 'easeOutExpo'
                });
            } else {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
            obs.unobserve(el);
        });
    }, { threshold: 0.12 });

    els.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        obs.observe(el);
    });
}

/* Rotation du rôle */
function startRoleRotation() {
    const roles = [
        'Développeur Web',
        'HTML · CSS · JavaScript',
        'React & Node.js',
        'En reconversion 🚀'
    ];
    let i = 0;
    const el = document.getElementById('rotatingRole');
    if (!el) return;
    setInterval(() => {
        i = (i + 1) % roles.length;
        if (typeof anime !== 'undefined') {
            anime({
                targets: el,
                opacity: [1, 0], translateY: [0, -8],
                duration: 250, easing: 'easeInQuad',
                complete() {
                    el.textContent = roles[i];
                    anime({ targets: el, opacity: [0, 1], translateY: [8, 0], duration: 300, easing: 'easeOutQuad' });
                }
            });
        } else {
            el.textContent = roles[i];
        }
    }, 3200);
}

// ─── THÈME ──────────────────────────
function applyTheme() {
    document.body.setAttribute('data-theme', S.theme);
    const icon = document.querySelector('#themeBtn i');
    if (icon) icon.className = S.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}
function toggleTheme() {
    S.theme = S.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('cv-theme', S.theme);
    applyTheme();
}

// ─── PARTICULES ─────────────────────
function generateParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const syms = ['{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']'];
    for (let i = 0; i < 16; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = syms[Math.floor(Math.random() * syms.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 18 + 's';
        p.style.animationDuration = (10 + Math.random() * 12) + 's';
        container.appendChild(p);
    }
}