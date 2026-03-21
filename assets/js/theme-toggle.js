/**
 * theme-toggle.js — Light/Dark theme persistence
 * Hiểu Gốc — Làm Gọn
 *
 * Reads from / writes to localStorage key: hgln-theme
 * Sets data-theme on <html>. Exposes window.themeToggle globally.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'hgln-theme';
  const THEMES = { LIGHT: 'light', DARK: 'dark' };

  /** Read saved theme, defaulting to system preference */
  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === THEMES.DARK || saved === THEMES.LIGHT) return saved;
    // Respect OS preference as default
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
    return THEMES.LIGHT;
  }

  /** Apply theme to <html> and update all toggle buttons */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateButtons(theme);
  }

  /** Persist + apply */
  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    // Notify other components
    document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }

  /** Flip between light and dark */
  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
    setTheme(current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  }

  /** Update aria-label and icon on all .theme-toggle buttons */
  function updateButtons(theme) {
    const isDark = theme === THEMES.DARK;
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
      // Icon: moon for dark mode trigger, sun for light mode trigger
      btn.textContent = isDark ? '☀️' : '🌙';
    });
  }

  /** Wire up click handlers on .theme-toggle buttons */
  function bindButtons() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      // Avoid duplicate listeners if script loads twice
      if (btn.dataset.themeToggleBound) return;
      btn.dataset.themeToggleBound = 'true';
      btn.addEventListener('click', toggle);
    });
  }

  // Apply theme immediately (before paint) to prevent flash
  applyTheme(getSavedTheme());

  // Bind buttons once DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    bindButtons();
    updateButtons(getSavedTheme());
  });

  // Also re-bind if content loads dynamically
  document.addEventListener('DOMContentLoaded', function () {
    const observer = new MutationObserver(function () {
      bindButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });

  // Expose global API for inline onclick="" usage
  window.themeToggle = {
    toggle: toggle,
    set: setTheme,
    get: function () {
      return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
    },
  };
})();
