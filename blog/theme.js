(function () {
  'use strict';

  var storageKey = 'blog-theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function savedTheme() {
    try {
      var value = localStorage.getItem(storageKey);
      return value === 'light' || value === 'dark' ? value : '';
    } catch (error) {
      return '';
    }
  }

  function systemTheme() {
    return media.matches ? 'dark' : 'light';
  }

  function apply(theme, remember) {
    document.documentElement.dataset.theme = theme;
    if (remember) {
      try { localStorage.setItem(storageKey, theme); } catch (error) { /* Storage may be disabled. */ }
    }
    window.dispatchEvent(new CustomEvent('blogthemechange', { detail: { theme: theme } }));
  }

  window.BlogTheme = {
    current: function () { return document.documentElement.dataset.theme || systemTheme(); },
    toggle: function () {
      var next = this.current() === 'dark' ? 'light' : 'dark';
      apply(next, true);
      return next;
    },
    followSystem: function () {
      try { localStorage.removeItem(storageKey); } catch (error) { /* Storage may be disabled. */ }
      apply(systemTheme(), false);
    }
  };

  apply(savedTheme() || systemTheme(), false);
  var onSystemChange = function () { if (!savedTheme()) apply(systemTheme(), false); };
  if (media.addEventListener) media.addEventListener('change', onSystemChange);
  else if (media.addListener) media.addListener(onSystemChange);
})();
