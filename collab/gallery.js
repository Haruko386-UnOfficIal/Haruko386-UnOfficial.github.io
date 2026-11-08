(() => {
  'use strict';
  const validImages = items => Array.isArray(items)
    ? items.filter(image => image && typeof image.src === 'string' && image.src.trim()) : [];
  const seen = new Set();
  const collections = (window.galleryCollections || []).filter(collection => {
    if (!collection || !/^[a-z0-9-]+$/i.test(collection.id || '') || seen.has(collection.id)) return false;
    seen.add(collection.id);
    return true;
  }).map(collection => ({ ...collection, images: validImages(collection.images) }));
  const navigation = document.querySelector('.navigation');
  const photoView = document.querySelector('.photo-view');
  const archiveView = document.querySelector('.archive-view');
  const message = document.querySelector('.gallery-message');
  const photo = document.querySelector('#photograph');
  const photoLink = document.querySelector('.photo-link');
  const title = document.querySelector('#photo-title');
  const count = document.querySelector('#photo-count');
  const thumbnails = document.querySelector('.thumbnails');
  const paging = document.querySelector('.paging');
  const number = value => String(value + 1).padStart(2, '0');
  const collectionHash = collection => `#gallery/${collection.id}`;
  const photoHash = (collection, position) => `${collectionHash(collection)}/photo/${number(position)}`;
  const initialIndex = collection => Math.max(0, Math.min(
    Number.isInteger(collection.initialIndex) ? collection.initialIndex : 0,
    Math.max(0, collection.images.length - 1),
  ));
  const wrap = (value, length) => (value + length) % length;
  const cache = new Map();
  const failures = new Set();
  let active = null;
  let index = 0;
  let showingArchive = false;
  let renderVersion = 0;
  let touchStart = null;
  let suppressClickUntil = 0;

  function showMessage(text) {
    message.textContent = text;
    message.hidden = false;
    photoView.hidden = true;
    archiveView.hidden = true;
  }
  if (!collections.length) { showMessage('暂无作品集'); return; }

  const navLinks = collections.map(collection => {
    const link = document.createElement('a');
    link.href = collectionHash(collection);
    link.textContent = collection.name || collection.id;
    link.dataset.collection = collection.id;
    return link;
  });
  navigation.replaceChildren(...navLinks);
  document.querySelector('.home').href = collectionHash(collections[0]);

  function route() {
    const hash = location.hash;
    // Preserve links shared before collections were introduced.
    if (hash === '#archive') {
      return { collection: collections.find(item => item.view === 'archive') || collections[0], archive: true };
    }
    const legacy = hash.match(/^#photo-(\d+)$/);
    if (legacy) return { collection: collections[0], position: Number(legacy[1]) - 1, archive: false };
    const match = hash.match(/^#gallery\/([a-z0-9-]+)(?:\/photo\/(\d+))?$/i);
    const collection = collections.find(item => item.id === match?.[1]) || collections[0];
    const position = match?.[2] ? Number(match[2]) - 1 : initialIndex(collection);
    return { collection, position, archive: !match?.[2] && collection.view !== 'photo' };
  }

  function preload(image) {
    if (!cache.has(image.src)) {
      cache.set(image.src, new Promise(resolve => {
        const loader = new Image();
        loader.onload = () => resolve(true);
        loader.onerror = () => { failures.add(image.src); resolve(false); };
        loader.src = image.src;
      }));
    }
    return cache.get(image.src);
  }

  function step(direction) {
    if (!active?.images.length) return;
    let next = index;
    for (let attempts = 0; attempts < active.images.length; attempts++) {
      next = wrap(next + direction, active.images.length);
      if (!failures.has(active.images[next].src)) {
        index = next;
        location.hash = photoHash(active, next);
        return;
      }
    }
  }

  function buildArchive(collection) {
    const entries = collection.images.map((image, position) => {
      const link = document.createElement('a');
      link.className = 'thumbnail';
      link.href = photoHash(collection, position);
      const thumbnail = document.createElement('img');
      thumbnail.alt = image.alt || image.title || '';
      thumbnail.width = 150;
      thumbnail.height = 150;
      thumbnail.loading = 'lazy';
      thumbnail.decoding = 'async';
      thumbnail.addEventListener('error', () => {
        if (image.thumbnail && thumbnail.getAttribute('src') !== image.src) thumbnail.src = image.src;
      }, { once: true });
      thumbnail.src = image.thumbnail || image.src;
      const label = document.createElement('span');
      label.textContent = image.title || '';
      link.append(thumbnail, label);
      return link;
    });
    thumbnails.replaceChildren(...entries);
  }

  async function render() {
    const version = ++renderVersion;
    const selected = route();
    const collection = selected.collection;
    const changed = active !== collection;
    const wasArchive = showingArchive;
    active = collection;
    showingArchive = selected.archive;
    touchStart = null;
    message.hidden = true;
    document.title = `${collection.name || collection.id} — Haruko386`;
    navLinks.forEach(link => {
      if (link.dataset.collection === collection.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (changed) {
      buildArchive(collection);
      photo.hidden = true;
      title.textContent = '';
      count.textContent = '';
      paging.hidden = true;
    }
    if (!collection.images.length) { showMessage('这个作品集还没有照片'); return; }
    photoView.hidden = showingArchive;
    archiveView.hidden = !showingArchive;
    if (showingArchive) {
      if (photoView.contains(document.activeElement)) thumbnails.querySelector('a')?.focus({ preventScroll: true });
      return;
    }
    index = Math.max(0, Math.min(collection.images.length - 1, selected.position));
    const requestedIndex = index;
    const image = collection.images[requestedIndex];
    const loaded = await preload(image);
    // A slower request from another collection must never overwrite this view.
    if (version !== renderVersion) return;
    if (!loaded) {
      if (collection.images.some(item => !failures.has(item.src))) step(1);
      else showMessage('图片暂时无法加载');
      return;
    }
    photo.src = image.src;
    photo.hidden = false;
    photo.alt = image.alt || image.title || '';
    photo.style.objectPosition = image.objectPosition || 'center';
    title.textContent = image.title || '';
    count.textContent = `${number(requestedIndex)} / ${collection.images.length}`;
    photoLink.href = image.src;
    paging.hidden = collection.images.length < 2;
    if (wasArchive && archiveView.contains(document.activeElement)) photoLink.focus({ preventScroll: true });
    preload(collection.images[wrap(requestedIndex - 1, collection.images.length)]);
    preload(collection.images[wrap(requestedIndex + 1, collection.images.length)]);
  }

  photoLink.addEventListener('click', event => {
    event.preventDefault();
    if (performance.now() >= suppressClickUntil) step(1);
  });
  document.querySelector('#previous').addEventListener('click', () => step(-1));
  document.querySelector('#next').addEventListener('click', () => step(1));
  document.addEventListener('keydown', event => {
    if (showingArchive || !message.hidden || event.altKey || event.ctrlKey || event.metaKey || event.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  photoLink.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && event.isPrimary) touchStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  photoLink.addEventListener('pointerup', event => {
    if (!touchStart || event.pointerId !== touchStart.id) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      suppressClickUntil = performance.now() + 400;
      step(dx < 0 ? 1 : -1);
    }
  });
  photoLink.addEventListener('pointercancel', () => { touchStart = null; });
  window.addEventListener('hashchange', render);
  render();
})();
