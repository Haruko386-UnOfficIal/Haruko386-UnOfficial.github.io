(function () {
  'use strict';

  var body = document.body;
  var root = body.dataset.blogRoot || './';
  var active = body.dataset.page || '';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  window.Blog = {
    root: root,
    escapeHtml: escapeHtml,
    postUrl: function (post) { return root + 'post/?p=' + encodeURIComponent(post.slug); },
    loadPosts: function () {
      return fetch(root + 'posts.json', { cache: 'no-cache' }).then(function (response) {
        if (!response.ok) throw new Error('文章索引加载失败（' + response.status + '）');
        return response.json();
      }).then(function (posts) { return Array.isArray(posts) ? posts : []; });
    }
  };

  var header = document.querySelector('[data-site-header]');
  if (header) {
    var items = [
      ['about', '关于', root + 'about/'],
      ['archives', '归档', root + 'archives/'],
      ['home', '首页', root],
      ['links', '链接', root + 'links/']
    ];
    header.innerHTML = '<nav class="navbar' + (body.classList.contains('has-compact-hero') ? ' navbar-solid' : '') + '" id="navbar">' +
      '<div class="navbar-inner"><a class="navbar-brand" href="' + root + '">Haruko386 の blog</a>' +
      '<button class="navbar-toggle" type="button" aria-label="打开导航" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '<div class="navbar-links">' + items.map(function (item) {
        return '<a' + (active === item[0] ? ' class="active" aria-current="page"' : '') + ' href="' + item[2] + '">' + item[1] + '</a>';
      }).join('') + '</div></div></nav>';

    var nav = document.getElementById('navbar');
    var toggle = nav.querySelector('.navbar-toggle');
    var links = nav.querySelector('.navbar-links');
    function updateNav() { nav.classList.toggle('scrolled', window.scrollY > 30); }
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function () { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
  }

  var topButton = document.querySelector('[data-scroll-top]');
  if (topButton) {
    function updateTopButton() { topButton.classList.toggle('visible', window.scrollY > 420); }
    updateTopButton();
    window.addEventListener('scroll', updateTopButton, { passive: true });
    topButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  var footer = document.querySelector('[data-site-footer]');
  if (footer) {
    footer.innerHTML = '<div>© ' + new Date().getFullYear() + ' Haruko386</div><div>Powered by HTML · CSS · JavaScript</div>';
  }
})();
