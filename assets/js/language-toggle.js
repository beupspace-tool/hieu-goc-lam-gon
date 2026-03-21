/**
 * language-toggle.js — Bilingual VI/EN navigation
 * Hiểu Gốc — Làm Gọn
 *
 * URL convention:
 *   Vietnamese (default): /levels/0-hat-giong/lesson-1.html
 *   English:              /en/levels/0-hat-giong/lesson-1.html
 *
 * Detects language from URL path.
 * Sets .active on .lang-btn[data-lang] elements.
 * On click: navigates to equivalent page in the other language.
 */

(function () {
  'use strict';

  var LANG = {
    VI: 'vi',
    EN: 'en',
  };

  /**
   * Detect current language from URL path.
   * @returns {'vi' | 'en'}
   */
  function detectLanguage() {
    var path = window.location.pathname;
    // English pages live under /en/
    if (/^\/en(\/|$)/.test(path)) return LANG.EN;
    return LANG.VI;
  }

  /**
   * Get the equivalent URL in the target language.
   * @param {'vi' | 'en'} targetLang
   * @returns {string} new URL path
   */
  function getEquivalentUrl(targetLang) {
    var path = window.location.pathname;
    var search = window.location.search;
    var hash = window.location.hash;

    if (targetLang === LANG.EN) {
      // Add /en/ prefix (strip it first to avoid double)
      var stripped = path.replace(/^\/en(\/|$)/, '/');
      // Ensure leading slash
      if (!stripped.startsWith('/')) stripped = '/' + stripped;
      return '/en' + stripped + search + hash;
    } else {
      // Remove /en/ prefix
      var withoutEn = path.replace(/^\/en(\/|$)/, '/');
      return withoutEn + search + hash;
    }
  }

  /** Update active state on all language buttons */
  function updateButtons(currentLang) {
    document.querySelectorAll('.lang-btn[data-lang]').forEach(function (btn) {
      var lang = btn.dataset.lang;
      btn.classList.toggle('active', lang === currentLang);
      btn.setAttribute('aria-current', lang === currentLang ? 'true' : 'false');
    });
  }

  /** Navigate to the language-equivalent URL */
  function switchTo(targetLang) {
    var currentLang = detectLanguage();
    if (targetLang === currentLang) return; // already on that language

    var newUrl = getEquivalentUrl(targetLang);
    window.location.href = newUrl;
  }

  function bindButtons() {
    document.querySelectorAll('.lang-btn[data-lang]').forEach(function (btn) {
      if (btn.dataset.langBound) return;
      btn.dataset.langBound = 'true';

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        switchTo(btn.dataset.lang);
      });
    });
  }

  function init() {
    var lang = detectLanguage();
    updateButtons(lang);
    bindButtons();

    // Store in sessionStorage so other JS can read it without re-parsing URL
    try {
      sessionStorage.setItem('hgln-lang', lang);
    } catch (_) {}
  }

  document.addEventListener('DOMContentLoaded', init);

  // Expose globally
  window.languageToggle = {
    current: detectLanguage,
    switchTo: switchTo,
  };
})();
