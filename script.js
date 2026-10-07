/* ==========================================================
   Portfolio interactions (vanilla JS)
   Edit the PROJECTS array and CONFIG below to customise.
   ========================================================== */
'use strict';

const CONFIG = { githubUser: 'Lakshmisowjanya929', titles: ['AI & Data Science Graduate', 'Machine Learning Enthusiast', 'Software Developer'] };
const GH_REPO_URL = 'https://github.com/' + CONFIG.githubUser;

const PROJECTS = [
  { id: 'plant', cat: 'ml', featured: true, art: 'CNN', c1: '#2f6f5e', c2: '#3b5bdb',
    title: 'Agriculture Photo Analysis / Plant Disease Detector',
    desc: 'An AI-powered application that analyzes plant images to identify possible crop diseases and provides disease information, confidence results, fertilizer recommendations, and treatment suggestions.',
    tech: ['Flutter', 'Dart', 'Python', 'FastAPI', 'TensorFlow', 'CNN', 'Firebase', 'Firestore'],
    features: ['Plant image upload/capture', 'Disease prediction', 'Confidence score', 'Fertilizer/treatment recommendations', 'Prediction history', 'Firebase authentication', 'Cloud-ready backend'] },
  { id: 'fraud', cat: 'ml ds', art: 'FD', c1: '#7a3b9e', c2: '#3b5bdb',
    title: 'Credit Card Fraud Detection',
    desc: 'Machine learning application designed to detect potentially fraudulent credit card transactions.',
    tech: ['Python', 'Machine Learning', 'FastAPI', 'Streamlit'] },
  { id: 'plag', cat: 'ml', art: 'NLP', c1: '#1c7c8c', c2: '#5b4bd6',
    title: 'AI Plagiarism Detection',
    desc: 'An AI-based system designed to identify similarities between submitted content and detect potential plagiarism.',
    tech: ['Python', 'NLP', 'Machine Learning'] },
  { id: 'senti', cat: 'ml ds', art: '+/-', c1: '#b0507a', c2: '#5b4bd6',
    title: 'Sentiment Analysis Tool',
    desc: 'A machine learning/NLP application that analyzes text and determines the sentiment of the input.',
    tech: ['Python', 'NLP', 'Machine Learning'] },
  { id: 'dogcat', cat: 'ml', art: 'D|C', c1: '#c26a2e', c2: '#3b5bdb',
    title: 'Dogs vs Cats Image Classification',
    desc: 'A CNN-based image classification project that identifies whether an uploaded image contains a dog or cat.',
    tech: ['Python', 'TensorFlow', 'CNN', 'Deep Learning'] },
  { id: 'netflix', cat: 'web', art: '</>', c1: '#a3283a', c2: '#2b2f45',
    title: 'Netflix Clone',
    desc: 'A responsive Netflix-inspired frontend website created to practice modern frontend development.',
    tech: ['HTML', 'CSS', 'JavaScript'] }
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Theme toggle (remembers choice when storage is available) ---------- */
const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
$('#themeToggle').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

/* ---------- Mobile menu ---------- */
const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
const setMenu = open => { navLinks.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); };
menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
$$('a', navLinks).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); closeModal(); } });

/* ---------- Scroll: navbar effect, back-to-top, active link ---------- */
const navbar = $('#navbar'), toTop = $('#toTop');
const sections = $$('main section[id]');
const links = $$('a', navLinks);
function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  toTop.classList.toggle('show', y > 600);
  let current = 'home';
  sections.forEach(s => { if (y + 120 >= s.offsetTop) current = s.id; });
  if (current === 'certifications') current = 'education';
  if (current === 'github') current = 'projects';
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Typing animation ---------- */
(function typing() {
  const el = $('#typed'); let i = 0, j = 0, del = false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = CONFIG.titles[0]; return; }
  (function tick() {
    const word = CONFIG.titles[i];
    el.textContent = word.slice(0, del ? --j : ++j);
    let delay = del ? 35 : 70;
    if (!del && j === word.length) { del = true; delay = 1600; }
    else if (del && j === 0) { del = false; i = (i + 1) % CONFIG.titles.length; delay = 350; }
    setTimeout(tick, delay);
  })();
})();

/* ---------- Scroll reveal (also drives timeline items) ---------- */
const revealObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); } });
}, { threshold: .12 });
$$('.reveal').forEach(el => revealObs.observe(el));

/* ---------- Animated counters ---------- */
function runCounter(el) {
  const target = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suffix = el.dataset.suffix || '';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = target.toFixed(dec) + suffix; return; }
  const start = performance.now(), dur = 1400;
  (function step(now) {
    const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(dec) + (p === 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
const countObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); } });
}, { threshold: .6 });
$$('[data-count]').forEach(el => countObs.observe(el));

/* ---------- Projects: render, filter, modal ---------- */
const grid = $('#projectGrid');
function renderProjects(filter = 'all') {
  grid.innerHTML = '';
  PROJECTS.filter(p => filter === 'all' || p.cat.split(' ').includes(filter)).forEach(p => {
    const card = document.createElement('article');
    card.className = 'p-card glass' + (p.featured ? ' featured' : '');
    card.innerHTML = `
      <div class="p-art" style="--c1:${p.c1};--c2:${p.c2}" role="img" aria-label="${p.title} illustration">${p.art}</div>
      <div class="p-body">
        ${p.featured ? '<span class="p-tag">Featured project</span>' : ''}
        <h3>${p.title}</h3><p>${p.desc}</p>
        <ul class="chips">${p.tech.map(t => `<li>${t}</li>`).join('')}</ul>
        <div class="p-actions">
          <button class="btn btn-sm btn-primary" data-open="${p.id}">Details</button>
          <a class="btn btn-sm btn-ghost" href="${GH_REPO_URL}" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}
renderProjects();
$$('.chip-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('.chip-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
  btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
  renderProjects(btn.dataset.filter);
}));

const modal = $('#modal'); let lastFocus = null;
grid.addEventListener('click', e => {
  const b = e.target.closest('[data-open]'); if (!b) return;
  const p = PROJECTS.find(x => x.id === b.dataset.open);
  $('#mTitle').textContent = p.title; $('#mDesc').textContent = p.desc;
  $('#mTech').innerHTML = p.tech.map(t => `<li>${t}</li>`).join('');
  $('#mFeat').innerHTML = (p.features || []).map(f => `<li>${f}</li>`).join('');
  $('#mFeatWrap').hidden = !p.features;
  $('#mGit').href = GH_REPO_URL;
  lastFocus = b; modal.hidden = false; document.body.style.overflow = 'hidden'; $('#modalClose').focus();
});
function closeModal() { if (modal.hidden) return; modal.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

/* ---------- GitHub repos (public API, with static fallback) ---------- */
(async function loadRepos() {
  const box = $('#repoGrid');
  const card = (name, desc, lang, stars, url) => `
    <a class="repo glass" href="${url}" target="_blank" rel="noopener">
      <h3>${name}</h3><p>${desc}</p>
      <div class="repo-meta"><span>${lang}</span><span>★ ${stars}</span></div></a>`;
  try {
    const res = await fetch(`https://api.github.com/users/${CONFIG.githubUser}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error(res.status);
    const repos = (await res.json()).filter(r => !r.fork);
    if (!repos.length) throw new Error('empty');
    box.innerHTML = repos.map(r => card(r.name, r.description || 'No description added yet.', r.language || 'n/a', r.stargazers_count, r.html_url)).join('');
  } catch (err) {
    box.innerHTML = [1, 2, 3].map(n => card('Repository ' + n, 'Repository details load from GitHub when available. Visit the profile to browse all projects.', 'Language', '0', GH_REPO_URL)).join('');
  }
})();

/* ---------- Contact form validation + toast ---------- */
const form = $('#contactForm');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
  subject: v => v.trim().length >= 3 || 'Enter a subject (at least 3 characters).',
  message: v => v.trim().length >= 10 || 'Enter a message (at least 10 characters).'
};
function check(name) {
  const input = form.elements[name], r = rules[name](input.value), ok = r === true;
  input.closest('.field').classList.toggle('invalid', !ok);
  input.setAttribute('aria-invalid', !ok);
  $('#e-' + name).textContent = ok ? '' : r;
  return ok;
}
Object.keys(rules).forEach(n => form.elements[n].addEventListener('blur', () => check(n)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const results = Object.keys(rules).map(check);
  if (results.every(Boolean)) {
    toast('Form validated. Connect an email service to send messages.');
    form.reset();
  } else {
    form.querySelector('[aria-invalid="true"]').focus();
  }
});
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
}
