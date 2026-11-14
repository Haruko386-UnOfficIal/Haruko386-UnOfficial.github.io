(function () {
  'use strict';
  const home = document.querySelector('.home-view');
  const machine = document.querySelector('.machine-view');
  let current = null;
  const scroll = { home: 0, machine: 0 };

  function syncView() {
    const next = location.hash === '#world-machine' ? 'machine' : 'home';
    if (next === current) return;
    const previous = current;
    if (previous) scroll[previous] = window.scrollY;
    current = next;
    const isMachine = next === 'machine';
    document.documentElement.dataset.view = next;
    home.inert = isMachine;
    machine.inert = !isMachine;
    home.setAttribute('aria-hidden', String(isMachine));
    machine.setAttribute('aria-hidden', String(!isMachine));
    document.dispatchEvent(new CustomEvent(isMachine ? 'desktop:enter' : 'desktop:leave'));
    if (previous) {
      window.scrollTo({ top: scroll[next], behavior: 'instant' });
      const target = isMachine ? document.querySelector('.desktop-tab') : home.querySelector('main');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      // Keep the desktop button in the normal keyboard navigation order.
      if (isMachine) target.removeAttribute('tabindex');
    }
  }
  window.addEventListener('hashchange', syncView);
  window.addEventListener('pageshow', syncView);
  syncView();
})();
