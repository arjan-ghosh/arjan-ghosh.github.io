// ---------- Theme toggle (light / dark) ----------
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

// ---------- Mobile menu ----------
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const sidebar = document.getElementById('sidebar');

if (navToggle && siteNav) {
  const setOpen = (open) => {
    siteNav.classList.toggle('open', open);
    sidebar.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => setOpen(!siteNav.classList.contains('open')));
  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
}

// ---------- Highlight current section in the sidebar ----------
const navLinks = document.querySelectorAll('[data-nav]');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = document.querySelector('[data-nav][href="#' + entry.target.id + '"]');
        if (!link) return;
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );
  sections.forEach((section) => spy.observe(section));
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Scroll progress, mini header, back-to-top ----------
const miniHeader = document.getElementById('miniHeader');
const backToTop = document.getElementById('backToTop');
const progress = document.getElementById('scrollProgress');
const hero = document.querySelector('.hero');

let ticking = false;
const onScroll = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.setProperty('--p', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
  if (hero) {
    const past = y > hero.offsetHeight * 0.8;
    if (miniHeader) miniHeader.classList.toggle('visible', past);
    if (backToTop) backToTop.classList.toggle('visible', past);
  }
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---------- Gentle reveal on scroll ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  const targets = document.querySelectorAll(
    '.block h2, .block-body, .timeline-item, .research-col, .cert-list, .icon-list li, .contact-card'
  );

  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        reveal.unobserve(el);
        // Clean up so hover effects are not slowed by the reveal transition
        setTimeout(() => el.classList.remove('reveal', 'in'), 1100);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );

  targets.forEach((el) => {
    const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
    const index = Math.max(siblings.indexOf(el), 0);
    el.style.setProperty('--d', (Math.min(index, 4) * 0.07).toFixed(2) + 's');
    el.classList.add('reveal');
    reveal.observe(el);
  });
}
