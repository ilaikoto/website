// theme.js — theme detection, toggle, logo swap, persistence

const STORAGE_KEY = 'ilaikoto-theme';
const LOGO_LIGHT = 'assets/logo.light.svg';
const LOGO_DARK  = 'assets/logo.dark.svg';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  html.classList.add(theme);

  // Swap logos: dark mode = light logo, light mode = dark logo
  const logoSrc = theme === 'dark' ? LOGO_LIGHT : LOGO_DARK;
  document.querySelectorAll('.theme-logo').forEach(img => {
    img.src = logoSrc;
  });

  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = theme === 'dark' ? '#000000' : '#FFFFFF';
  }

  localStorage.setItem(STORAGE_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  const stored = getStoredTheme();
  const theme  = stored || "light"; // default to light mode
  applyTheme(theme);

  const btn = document.getElementById('btn-theme');
  if (btn) {
    btn.addEventListener('click', toggleTheme);
    btn.setAttribute('aria-label', 'Toggle color theme');
  }

  // Listen for system changes (only if user hasn't manually set a preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

export { initTheme, applyTheme, toggleTheme };