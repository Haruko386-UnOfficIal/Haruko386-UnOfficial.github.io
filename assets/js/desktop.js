(function () {
  'use strict';

  const desktop = document.querySelector('.desktop');
  const area = document.getElementById('work-area');
  const layer = document.getElementById('window-layer');
  const tabs = document.getElementById('window-tabs');
  const announcement = document.getElementById('desktop-announcement');
  const windows = new Map();
  let topOrder = 0;
  let active = null;
  let gesture = null;

  const apps = {
    note: { title: 'Note', template: 'note-content', color: 'yellow', width: 330, height: 380 },
    folders: { title: 'Folders', template: 'folders-content', color: 'coral', width: 310, height: 235 },
    links: { title: 'Links', template: 'links-content', color: 'mint', width: 285, height: 246 },
    blog: { title: 'Blog', url: 'blog/', color: 'coral', width: 920, height: 610 },
    gallery: { title: 'Gallery', url: 'collab/', color: 'yellow', width: 920, height: 610 },
    about: { title: 'About', url: 'https://haruko386.github.io/', color: 'mint', width: 860, height: 600 },
    github: { title: 'GitHub', external: 'https://github.com/Haruko386' },
    bilibili: { title: 'Bilibili', external: 'https://space.bilibili.com/291003955' },
    instagram: { title: 'Instagram', external: 'https://www.instagram.com/endless_developy' },
    speedrun: { title: 'Speedrun', external: 'https://www.speedrun.com/users/Limpid' },
    steam: { title: 'Steam', external: 'https://steamcommunity.com/profiles/76561198217881431/' }
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function bounds(rect) {
    const width = Math.min(Math.max(250, rect.width), area.clientWidth);
    const height = Math.min(Math.max(110, rect.height), area.clientHeight);
    return {
      width, height,
      x: Math.max(0, Math.min(rect.x, area.clientWidth - width)),
      y: Math.max(0, Math.min(rect.y, area.clientHeight - height))
    };
  }

  function paint(state) {
    state.rect = bounds(state.rect);
    const rect = state.maximized ? { x: 0, y: 0, width: area.clientWidth, height: area.clientHeight } : state.rect;
    Object.assign(state.node.style, { left: rect.x + 'px', top: rect.y + 'px', width: rect.width + 'px', height: rect.height + 'px' });
    state.node.classList.toggle('is-maximized', state.maximized);
    state.maxButton.textContent = state.maximized ? '▣' : '□';
    state.maxButton.setAttribute('aria-label', state.maximized ? '还原窗口' : '最大化窗口');
    state.maxButton.title = state.maxButton.getAttribute('aria-label');
    state.maxButton.setAttribute('aria-pressed', String(state.maximized));
  }

  function updateTabs() {
    windows.forEach(state => {
      const selected = state.id === active && !state.minimized;
      state.node.classList.toggle('is-active', selected);
      state.tab.setAttribute('aria-pressed', String(selected));
      state.tab.dataset.minimized = String(state.minimized);
      state.tab.setAttribute('aria-label', state.config.title + (state.minimized ? '，已最小化，点击恢复' : '，切换窗口'));
    });
    document.querySelector('.desktop-tab').setAttribute('aria-pressed', String(active === null));
  }

  function activate(state, focus = true) {
    state.minimized = false;
    state.node.hidden = false;
    state.node.style.zIndex = ++topOrder;
    active = state.id;
    updateTabs();
    if (focus) state.titlebar.focus({ preventScroll: true });
  }

  function nextWindow() {
    const visible = Array.from(windows.values()).filter(state => !state.minimized);
    visible.sort((a, b) => Number(b.node.style.zIndex) - Number(a.node.style.zIndex));
    if (visible[0]) activate(visible[0]);
    else { active = null; updateTabs(); document.querySelector('.desktop-tab').focus(); }
  }

  function minimize(state) {
    state.minimized = true;
    state.node.hidden = true;
    if (active === state.id) nextWindow();
    else updateTabs();
    announcement.textContent = state.config.title + ' 已最小化';
  }

  function close(state) {
    state.node.remove();
    state.tab.remove();
    window.clearTimeout(state.loadTimer);
    windows.delete(state.id);
    if (active === state.id) nextWindow();
    else updateTabs();
    announcement.textContent = state.config.title + ' 已关闭';
  }

  function maximize(state) {
    state.maximized = !state.maximized;
    paint(state);
    activate(state, false);
  }

  function makeFrame(state, content) {
    content.classList.add('frame-content');
    const toolbar = element('div', 'browser-toolbar');
    const reload = element('button', '', '↻');
    reload.type = 'button';
    reload.setAttribute('aria-label', '重新加载页面');
    const address = element('span', 'address', state.config.url);
    const outside = element('a', '', '↗');
    outside.href = state.config.url;
    outside.target = '_blank';
    outside.rel = 'noopener noreferrer';
    outside.title = '在新标签页打开';
    outside.setAttribute('aria-label', '在新标签页打开');
    toolbar.append(reload, address, outside);
    const status = element('p', 'frame-status', '正在加载…');
    status.setAttribute('role', 'status');
    const frame = element('iframe', 'app-frame');
    frame.title = state.config.title;
    // Local pages keep their own scripts and navigation; external services use launch cards.
    frame.src = state.config.url;
    state.frame = frame;
    state.loadTimer = window.setTimeout(() => {
      status.textContent = '加载较慢，可通过右上角 ↗ 打开。';
      status.hidden = false;
    }, 15000);
    frame.addEventListener('load', () => {
      window.clearTimeout(state.loadTimer);
      status.hidden = true;
      try {
        const url = new URL(frame.contentWindow.location.href);
        if (/^https?:$/.test(url.protocol)) {
          address.textContent = url.pathname + url.search + url.hash;
          outside.href = url.href;
        }
        frame.contentDocument.addEventListener('pointerdown', () => activate(state, false));
        frame.contentDocument.addEventListener('focusin', () => activate(state, false));
      } catch (_) { /* A cross-origin page remains usable through its own document. */ }
    });
    reload.addEventListener('click', () => {
      try { frame.contentWindow.location.reload(); }
      catch (_) { frame.src = state.config.url; }
    });
    content.append(toolbar, status, frame);
  }

  function open(id, initial = false) {
    if (!apps[id]) return;
    if (windows.has(id)) { activate(windows.get(id)); return; }
    const config = apps[id];
    const node = element('section', 'app-window');
    node.id = 'app-' + id;
    node.setAttribute('role', 'region');
    node.setAttribute('aria-labelledby', 'title-' + id);
    node.style.setProperty('--title-color', 'var(--' + (config.color || 'mint') + ')');
    const titlebar = element('header', 'window-titlebar');
    titlebar.tabIndex = 0;
    titlebar.title = '拖动移动，双击最大化；方向键移动窗口';
    const title = element('h2', 'window-title', config.title);
    title.id = 'title-' + id;
    const controls = element('div', 'window-controls');
    const buttons = {};
    [['minimize', '−', '最小化'], ['maximize', '□', '最大化窗口'], ['close', '×', '关闭']].forEach(([action, icon, label]) => {
      const button = element('button', '', icon);
      button.type = 'button';
      button.dataset.action = action;
      button.title = label;
      button.setAttribute('aria-label', label);
      buttons[action] = button;
      controls.append(button);
    });
    titlebar.append(title, controls);
    const content = element('div', 'window-content');
    const resize = element('button', 'resize-handle');
    resize.type = 'button';
    resize.setAttribute('aria-label', '调整窗口大小，使用方向键或拖动');
    resize.title = '拖动或使用方向键调整大小';
    node.append(titlebar, content, resize);
    const tab = element('button', 'window-tab', config.title);
    tab.type = 'button';
    tab.setAttribute('aria-controls', node.id);
    const offset = (windows.size % 5) * 22;
    let rect = { x: 120 + offset, y: 20 + offset, width: config.width || 430, height: config.height || 240 };
    if (initial) {
      if (id === 'note') rect = { ...rect, x: 145, y: 30 };
      if (id === 'links') rect = { ...rect, x: area.clientWidth - 335, y: 26 };
      if (id === 'folders') rect = { ...rect, x: area.clientWidth - 365, y: area.clientHeight - 270 };
    }
    const state = { id, config, node, tab, titlebar, maxButton: buttons.maximize, rect, minimized: false, maximized: area.clientWidth <= 700 };
    windows.set(id, state);
    if (config.template) content.append(document.getElementById(config.template).content.cloneNode(true));
    else if (config.url) makeFrame(state, content);
    else {
      const card = element('div', 'external-content');
      const address = element('p', '', config.external.replace('https://', ''));
      const link = element('a', '', '在新标签页打开 ↗');
      link.href = config.external;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      card.append(address, link);
      content.append(card);
    }
    tab.addEventListener('click', () => activate(state));
    buttons.minimize.addEventListener('click', () => minimize(state));
    buttons.maximize.addEventListener('click', () => maximize(state));
    buttons.close.addEventListener('click', () => close(state));
    node.addEventListener('pointerdown', () => activate(state, false));
    node.addEventListener('focusin', () => { if (active !== id) activate(state, false); });
    titlebar.addEventListener('dblclick', event => { if (!event.target.closest('button')) maximize(state); });
    titlebar.addEventListener('pointerdown', event => startGesture(event, state, 'move'));
    resize.addEventListener('pointerdown', event => startGesture(event, state, 'resize'));
    function keyboard(event, kind) {
      if (event.target !== event.currentTarget || state.maximized || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const step = event.shiftKey ? 30 : 10;
      const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
      const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
      if (kind === 'move') { state.rect.x += dx; state.rect.y += dy; }
      else { state.rect.width += dx; state.rect.height += dy; }
      paint(state);
    }
    titlebar.addEventListener('keydown', event => keyboard(event, 'move'));
    resize.addEventListener('keydown', event => keyboard(event, 'resize'));
    layer.append(node);
    tabs.append(tab);
    paint(state);
    activate(state, !initial);
    document.dispatchEvent(new CustomEvent('desktop:opened', { detail: id }));
  }

  function startGesture(event, state, kind) {
    if (event.button !== 0 || state.maximized || (kind === 'move' && event.target.closest('button'))) return;
    event.preventDefault();
    const handle = event.currentTarget;
    gesture = { state, kind, handle, pointer: event.pointerId, x: event.clientX, y: event.clientY, rect: { ...state.rect } };
    handle.setPointerCapture(event.pointerId);
    desktop.classList.add('is-interacting');
  }
  document.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.pointer) return;
    const { state, kind, rect } = gesture;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (kind === 'move') state.rect = { ...rect, x: rect.x + dx, y: rect.y + dy };
    else state.rect = { ...rect, width: Math.min(rect.width + dx, area.clientWidth - rect.x), height: Math.min(rect.height + dy, area.clientHeight - rect.y) };
    paint(state);
  });
  function endGesture() {
    if (!gesture) return;
    const previous = gesture;
    gesture = null;
    if (previous.handle.hasPointerCapture(previous.pointer)) previous.handle.releasePointerCapture(previous.pointer);
    desktop.classList.remove('is-interacting');
  }
  document.addEventListener('pointerup', endGesture);
  document.addEventListener('pointercancel', endGesture);
  document.addEventListener('lostpointercapture', endGesture);
  document.addEventListener('desktop:leave', endGesture);
  window.addEventListener('blur', () => {
    endGesture();
    window.setTimeout(() => {
      windows.forEach(state => { if (state.frame && document.activeElement === state.frame && !state.minimized) activate(state, false); });
    }, 0);
  });
  document.addEventListener('click', event => {
    const launcher = event.target.closest('[data-app]');
    if (launcher && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
      event.preventDefault();
      open(launcher.dataset.app);
    }
    if (event.target.closest('[data-desktop]')) {
      windows.forEach(state => { state.minimized = true; state.node.hidden = true; });
      active = null;
      updateTabs();
      document.querySelector('.desktop-tab').focus();
    }
  });
  window.addEventListener('resize', () => { endGesture(); windows.forEach(paint); });
  let initialized = false;
  document.addEventListener('desktop:enter', () => {
    if (!initialized) {
      initialized = true;
      open('note', true);
      if (area.clientWidth > 700) { open('links', true); open('folders', true); }
      activate(windows.get('note'), false);
    }
    windows.forEach(paint);
  });
  const folderLink = element('a', 'utility-launcher');
  folderLink.append(element('span', 'utility-icon', '▤'), element('span', '', 'Folders'));
  folderLink.href = '#world-machine'; folderLink.dataset.app = 'folders'; folderLink.setAttribute('aria-label', '文件夹');
  document.querySelector('.dock').append(folderLink);
})();
