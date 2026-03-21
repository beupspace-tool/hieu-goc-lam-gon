/**
 * code-copy.js — Add "Copy" button to all code blocks
 * Hiểu Gốc — Làm Gọn
 *
 * Targets: pre > code
 * Adds a small "Copy" button absolutely positioned top-right of <pre>.
 * On click: copies code text, shows "Copied!" for 2s.
 */

(function () {
  'use strict';

  var COPY_LABEL   = 'Copy';
  var COPIED_LABEL = 'Copied!';
  var RESET_DELAY  = 2000; // ms

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve();
      } catch (e) {
        document.body.removeChild(textarea);
        reject(e);
      }
    });
  }

  function createCopyButton() {
    var btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.textContent = COPY_LABEL;
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.setAttribute('type', 'button');
    return btn;
  }

  function attachButton(pre) {
    // Avoid double-attaching
    if (pre.querySelector('.code-copy-btn')) return;

    // Make sure pre is positioned (needed for absolute button)
    var position = window.getComputedStyle(pre).position;
    if (position === 'static') {
      pre.style.position = 'relative';
    }

    var btn = createCopyButton();

    btn.addEventListener('click', function () {
      var codeEl = pre.querySelector('code');
      var text = codeEl ? codeEl.textContent : pre.textContent;

      copyToClipboard(text).then(function () {
        btn.textContent = COPIED_LABEL;
        btn.classList.add('copied');
        btn.setAttribute('aria-label', 'Copied!');
        setTimeout(function () {
          btn.textContent = COPY_LABEL;
          btn.classList.remove('copied');
          btn.setAttribute('aria-label', 'Copy code to clipboard');
        }, RESET_DELAY);
      }).catch(function () {
        // Silent fail — clipboard not available (e.g. no HTTPS)
        btn.textContent = 'Error';
        setTimeout(function () {
          btn.textContent = COPY_LABEL;
        }, RESET_DELAY);
      });
    });

    pre.appendChild(btn);
  }

  function init() {
    // Target all pre elements that contain a code child
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.querySelector('code')) {
        attachButton(pre);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // Also handle dynamically injected code blocks (e.g. after tab switch)
  var domObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return; // elements only
        if (node.tagName === 'PRE' && node.querySelector('code')) {
          attachButton(node);
        }
        node.querySelectorAll && node.querySelectorAll('pre').forEach(function (pre) {
          if (pre.querySelector('code')) attachButton(pre);
        });
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    domObserver.observe(document.body, { childList: true, subtree: true });
  });
})();
