// Mobile menu
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

// Highlight current section in the sidebar
const navLinks = document.querySelectorAll('[data-nav]');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(
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
  sections.forEach((section) => observer.observe(section));
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mini header + back-to-top appear after the hero
const miniHeader = document.getElementById('miniHeader');
const backToTop = document.getElementById('backToTop');
const hero = document.querySelector('.hero');

if (hero) {
  const onScroll = () => {
    const past = window.scrollY > hero.offsetHeight * 0.8;
    if (miniHeader) miniHeader.classList.toggle('visible', past);
    if (backToTop) backToTop.classList.toggle('visible', past);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
