/**
 * progress-tracker.js — Lesson completion tracking
 * Hiểu Gốc — Làm Gọn
 *
 * Storage key: hgln-progress
 * Data model: { "levelId/lessonId": { completed: bool, timestamp: ISO } }
 *
 * Lesson IDs come from data-lesson-id on <body> or <main>.
 * Level IDs come from data-level-id on the same element.
 *
 * Dispatches: CustomEvent "progress-updated" on document.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'hgln-progress';

  // ---------------------------------------------------------------------------
  // Storage helpers
  // ---------------------------------------------------------------------------

  function loadData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (_) {
      return {};
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[progress-tracker] Could not save to localStorage:', e);
    }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Mark a lesson as complete.
   * @param {string} lessonId — e.g. "0/phan-mem-la-gi"
   */
  function markComplete(lessonId) {
    if (!lessonId) return;
    const data = loadData();
    data[lessonId] = { completed: true, timestamp: new Date().toISOString() };
    saveData(data);
    notifyUpdate(lessonId);
  }

  /**
   * Mark a lesson as incomplete (undo).
   * @param {string} lessonId
   */
  function markIncomplete(lessonId) {
    if (!lessonId) return;
    const data = loadData();
    delete data[lessonId];
    saveData(data);
    notifyUpdate(lessonId);
  }

  /**
   * Toggle a lesson's completion state.
   * @param {string} lessonId
   * @returns {boolean} new completed state
   */
  function toggleComplete(lessonId) {
    if (isComplete(lessonId)) {
      markIncomplete(lessonId);
      return false;
    } else {
      markComplete(lessonId);
      return true;
    }
  }

  /**
   * Check if a lesson is complete.
   * @param {string} lessonId
   * @returns {boolean}
   */
  function isComplete(lessonId) {
    if (!lessonId) return false;
    const data = loadData();
    return !!(data[lessonId] && data[lessonId].completed);
  }

  /**
   * Get progress for all lessons in a level.
   * @param {string} levelId — e.g. "0"
   * @param {number} total — total lessons in the level (read from DOM or pass in)
   * @returns {{ completed: number, total: number, percent: number }}
   */
  function getLevelProgress(levelId, total) {
    const data = loadData();
    const prefix = String(levelId) + '/';
    let completed = 0;

    // Count from storage keys
    Object.keys(data).forEach(function (key) {
      if (key.startsWith(prefix) && data[key].completed) {
        completed++;
      }
    });

    // If total not passed, try to infer from DOM
    if (!total) {
      total = document.querySelectorAll('[data-lesson-id^="' + prefix + '"]').length || completed;
    }

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed: completed, total: total, percent: percent };
  }

  /**
   * Get overall progress across all levels.
   * Relies on data-total-lessons on <body> or <main>, or counts from DOM.
   * @returns {{ completed: number, total: number, percent: number }}
   */
  function getOverallProgress() {
    const data = loadData();
    const completed = Object.values(data).filter(function (v) { return v.completed; }).length;

    // Try to read total from a data attribute on <main> or <body>
    const totalEl = document.querySelector('[data-total-lessons]');
    let total = totalEl ? parseInt(totalEl.dataset.totalLessons, 10) : 0;

    // Fallback: count all lesson IDs in DOM
    if (!total) {
      total = document.querySelectorAll('[data-lesson-id]').length || completed;
    }

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed: completed, total: total, percent: percent };
  }

  // ---------------------------------------------------------------------------
  // Event dispatch
  // ---------------------------------------------------------------------------

  function notifyUpdate(lessonId) {
    document.dispatchEvent(new CustomEvent('progress-updated', {
      detail: {
        lessonId: lessonId,
        completed: isComplete(lessonId),
        overall: getOverallProgress(),
      },
    }));
  }

  // ---------------------------------------------------------------------------
  // UI sync — runs on page load
  // ---------------------------------------------------------------------------

  function syncUI() {
    // Sync the current page's complete button
    const lessonId = getCurrentLessonId();

    if (lessonId) {
      const done = isComplete(lessonId);
      document.querySelectorAll('.btn-complete, [data-complete-btn]').forEach(function (btn) {
        btn.classList.toggle('is-complete', done);
        btn.textContent = done ? '✓ Đã hoàn thành' : 'Đánh dấu hoàn thành';
        btn.setAttribute('aria-pressed', String(done));
      });
    }

    // Sync progress bars on level hub / landing pages
    document.querySelectorAll('[data-progress-level]').forEach(function (el) {
      const lvl = el.dataset.progressLevel;
      const total = parseInt(el.dataset.progressTotal, 10) || undefined;
      const progress = getLevelProgress(lvl, total);
      syncProgressElement(el, progress.percent);
    });

    // Sync overall progress
    document.querySelectorAll('[data-progress-overall]').forEach(function (el) {
      const progress = getOverallProgress();
      syncProgressElement(el, progress.percent);
    });

    // Sync lesson-card completion state
    document.querySelectorAll('[data-lesson-id]').forEach(function (el) {
      const id = el.dataset.lessonId;
      const done = isComplete(id);
      el.classList.toggle('lesson-card--complete', done);
      const check = el.querySelector('.lesson-card-check');
      if (check) {
        check.textContent = done ? '✓' : '';
        check.setAttribute('aria-label', done ? 'Completed' : 'Not yet completed');
      }
    });
  }

  /** Update a .progress-bar or .progress-ring element by percent */
  function syncProgressElement(el, percent) {
    // Progress bar fill
    const fill = el.querySelector('.progress-bar-fill');
    if (fill) {
      fill.style.width = percent + '%';
      fill.classList.toggle('progress-bar-fill--complete', percent >= 100);
    }

    // Progress ring SVG
    const ringFill = el.querySelector('.progress-ring-fill');
    if (ringFill) {
      const r = parseFloat(ringFill.getAttribute('r') || 18);
      const circumference = 2 * Math.PI * r;
      const offset = circumference - (percent / 100) * circumference;
      ringFill.style.strokeDasharray = circumference;
      ringFill.style.strokeDashoffset = offset;
      ringFill.classList.toggle('progress-ring-fill--complete', percent >= 100);
    }

    // Label
    const label = el.querySelector('.progress-ring-label, [data-progress-label]');
    if (label) {
      label.textContent = percent + '%';
    }
  }

  /** Read current lesson ID from body/main data attribute */
  function getCurrentLessonId() {
    const el = document.querySelector('[data-lesson-id]') ||
               document.querySelector('body[data-current-lesson]') ||
               document.querySelector('main[data-current-lesson]');
    if (!el) return null;
    return el.dataset.lessonId || el.dataset.currentLesson || null;
  }

  // ---------------------------------------------------------------------------
  // Bind complete buttons
  // ---------------------------------------------------------------------------

  function bindCompleteButtons() {
    document.querySelectorAll('.btn-complete, [data-complete-btn]').forEach(function (btn) {
      if (btn.dataset.progressBound) return;
      btn.dataset.progressBound = 'true';

      btn.addEventListener('click', function () {
        const lessonId = btn.dataset.lessonId ||
                         getCurrentLessonId() ||
                         document.body.dataset.currentLesson;
        if (!lessonId) return;
        const isNowComplete = toggleComplete(lessonId);
        // Sync UI immediately
        btn.classList.toggle('is-complete', isNowComplete);
        btn.textContent = isNowComplete ? '✓ Đã hoàn thành' : 'Đánh dấu hoàn thành';
        btn.setAttribute('aria-pressed', String(isNowComplete));
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    syncUI();
    bindCompleteButtons();
  });

  // Re-sync when progress changes (e.g. different tab)
  document.addEventListener('progress-updated', syncUI);
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) syncUI();
  });

  // ---------------------------------------------------------------------------
  // Expose global API
  // ---------------------------------------------------------------------------

  window.progressTracker = {
    markComplete:       markComplete,
    markIncomplete:     markIncomplete,
    toggleComplete:     toggleComplete,
    isComplete:         isComplete,
    getLevelProgress:   getLevelProgress,
    getOverallProgress: getOverallProgress,
  };
})();
