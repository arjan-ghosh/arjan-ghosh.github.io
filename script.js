document.documentElement.classList.add('js');

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Theme toggle ----------
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

// ---------- Mobile menu ----------
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  const setOpen = (open) => {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn.addEventListener('click', () => setOpen(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

// ---------- Scroll: nav style, progress bar, back-to-top ----------
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
const toTop = document.getElementById('toTop');
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (nav) nav.classList.toggle('scrolled', y > 10);
  if (progress) progress.style.setProperty('--p', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
  if (toTop) toTop.classList.toggle('show', y > 700);
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// ---------- Active nav link ----------
const links = document.querySelectorAll('[data-nav]');
const sections = Array.from(links).map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));
}

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  revealEls.forEach((el) => {
    const sibs = el.parentElement ? Array.from(el.parentElement.children) : [];
    el.style.setProperty('--d', (Math.min(Math.max(sibs.indexOf(el), 0), 5) * 0.08).toFixed(2) + 's');
  });
  const rv = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      rv.unobserve(entry.target);
      // drop the delay afterwards so hover feels instant
      setTimeout(() => entry.target.style.removeProperty('--d'), 1200);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  revealEls.forEach((el) => rv.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// ---------- Count-up numbers ----------
const counters = document.querySelectorAll('[data-count]');
const runCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const dec = parseInt(el.dataset.dec || '0', 10);
  const start = performance.now();
  const dur = 1400;
  const step = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(dec);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(dec);
  };
  requestAnimationFrame(step);
};
if ('IntersectionObserver' in window && !reduceMotion) {
  const co = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runCount(entry.target);
      co.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => co.observe(c));
}

// ---------- Tabs ----------
const tabs = Array.from(document.querySelectorAll('.tab'));
const activate = (tab) => {
  tabs.forEach((t) => {
    const on = t === tab;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    if (panel) { panel.hidden = !on; panel.classList.toggle('active', on); }
  });
};
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    activate(next);
    next.focus();
  });
});

// ---------- Footer year ----------
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
