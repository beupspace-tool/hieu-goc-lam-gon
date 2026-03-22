/*
 * tree-navigation.js — Tree Visual Enhancement
 * Handles click navigation on tree nodes
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Make entire tree-node article clickable (not just the circle link)
    var nodes = document.querySelectorAll('article.tree-node[data-href]');
    nodes.forEach(function(node) {
      node.style.cursor = 'pointer';
      node.addEventListener('click', function(e) {
        // Don't hijack if user clicked on the actual link
        if (e.target.closest('a')) return;
        var href = node.getAttribute('data-href');
        if (href) window.location.href = href;
      });
    });
  });
})();
