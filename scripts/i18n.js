// i18n.js — language detection, JSON loading, DOM text swap

const STORAGE_KEY = 'ilaikoto-lang';
let currentStrings = {};

function getStoredLang() {
  return localStorage.getItem(STORAGE_KEY);
}

function getDefaultLang() {
  const lang = navigator.language || navigator.userLanguage || 'en';
  return lang.startsWith('fr') ? 'fr' : 'en';
}

async function loadStrings(lang) {
  try {
    const res = await fetch(`data/${lang}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[i18n] Failed to load ${lang}.json, falling back to en.`, err);
    if (lang !== 'en') {
      const res = await fetch('data/en.json');
      return res.json();
    }
    return {};
  }
}

function applyStrings(strings) {
  currentStrings = strings;

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (strings[key] !== undefined) {
      el.textContent = strings[key];
    }
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (strings[key] !== undefined) {
      el.placeholder = strings[key];
    }
  });

  // aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (strings[key] !== undefined) {
      el.setAttribute('aria-label', strings[key]);
    }
  });
}

async function setLang(lang) {
  const strings = await loadStrings(lang);
  applyStrings(strings);
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem(STORAGE_KEY, lang);

  // Update toggle button label to show the OTHER language
  const btn = document.getElementById('btn-lang');
  if (btn) {
    btn.textContent = strings['lang_toggle'] || (lang === 'fr' ? 'EN' : 'FR');
  }
}

async function toggleLang() {
  const current = localStorage.getItem(STORAGE_KEY) || getDefaultLang();
  const next = current === 'fr' ? 'en' : 'fr';
  await setLang(next);
}

async function initI18n() {
  const stored = getStoredLang();
  const lang   = stored || getDefaultLang();
  await setLang(lang);

  const btn = document.getElementById('btn-lang');
  if (btn) {
    btn.addEventListener('click', toggleLang);
  }
}

function getString(key) {
  return currentStrings[key] || key;
}

export { initI18n, setLang, toggleLang, getString };