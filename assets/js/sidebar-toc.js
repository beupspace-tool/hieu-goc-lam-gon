/**
 * sidebar-toc.js — Active heading highlight in sidebar TOC
 * Hiểu Gốc — Làm Gọn
 *
 * Watches h1[id], h2[id], h3[id] inside .content.
 * Adds/removes .active on matching .sidebar a[href="#id"].
 */

(function () {
  'use strict';

  function init() {
    const content = document.querySelector('.content');
    const sidebar = document.querySelector('.sidebar-toc');

    if (!content || !sidebar) return;

    const headings = Array.from(
      content.querySelectorAll('h1[id], h2[id], h3[id]')
    );

    if (headings.length === 0) return;

    // All TOC links in the sidebar
    const tocLinks = Array.from(sidebar.querySelectorAll('a[href^="#"]'));

    if (tocLinks.length === 0) return;

    let activeId = null;

    function setActive(id) {
      if (id === activeId) return;
      activeId = id;

      tocLinks.forEach(function (link) {
        const href = link.getAttribute('href').slice(1); // strip leading #
        link.classList.toggle('active', href === id);
      });

      // Scroll active link into view within sidebar (if needed)
      if (id) {
        const activeLink = sidebar.querySelector('a[href="#' + id + '"]');
        if (activeLink) {
          scrollLinkIntoView(activeLink);
        }
      }
    }

    /** Gently scroll the active TOC link into the visible area of the sidebar */
    function scrollLinkIntoView(link) {
      const tocRect = sidebar.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      const isAbove = linkRect.top < tocRect.top + 40;
      const isBelow = linkRect.bottom > tocRect.bottom - 40;

      if (isAbove || isBelow) {
        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    // IntersectionObserver: fire when heading enters upper portion of viewport
    const observer = new IntersectionObserver(
      function (entries) {
        // Find the highest heading currently visible
        let topEntry = null;

        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!topEntry || entry.boundingClientRect.top < topEntry.boundingClientRect.top) {
              topEntry = entry;
            }
          }
        });

        if (topEntry) {
          setActive(topEntry.target.id);
        } else {
          // If nothing is intersecting, find the last heading above the viewport
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          let closest = null;

          headings.forEach(function (heading) {
            const top = heading.getBoundingClientRect().top + scrollTop;
            if (top <= scrollTop + window.innerHeight * 0.2) {
              closest = heading;
            }
          });

          if (closest) {
            setActive(closest.id);
          }
        }
      },
      {
        root: null,
        // Trigger when heading is in the top 30% of the viewport
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0,
      }
    );

    headings.forEach(function (heading) {
      observer.observe(heading);
    });

    // Set initial active on page load (handle deep links / pre-scrolled pages)
    window.addEventListener('load', function () {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActive(hash);
      } else if (headings.length > 0) {
        setActive(headings[0].id);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
