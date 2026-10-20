/* Bouncer docs viewer: renders docs/*.md in the browser. Hash routing (#/page, #/page#heading),
   marked + DOMPurify from jsDelivr. No build step. Sections match .github/scripts/docs-to-wiki.mjs. */
(function () {
  'use strict';

  var THEME_KEY = 'bouncer-theme';
  var REPO = 'shankar-sachin/get-bouncer';
  var EDIT_BASE = 'https://github.com/' + REPO + '/blob/main/docs/';
  var DEFAULT_PAGE = 'getting-started';
  // #/index shows docs/README.md. It is not in the sidebar.
  var INDEX_ROUTE = 'index';

  // Same grouping as the wiki sidebar. Titles here label the sidebar and pager.
  var SECTIONS = [
    {
      title: 'Start',
      pages: [
        ['getting-started', 'Getting started'],
        ['install', 'Install Bouncer'],
        ['updates', 'Updates'],
        ['system-requirements', 'System requirements'],
      ],
    },
    {
      title: 'Use Bouncer',
      pages: [
        ['chat', 'Chat'],
        ['rebound', 'Rebound'],
        ['code', 'Bouncer Code'],
        ['scheduled-tasks', 'Scheduled tasks'],
        ['ide', 'IDE'],
        ['models', 'Models'],
      ],
    },
    {
      title: 'Reference',
      pages: [
        ['slash-commands', 'Slash commands'],
        ['keyboard-shortcuts', 'Keyboard shortcuts'],
        ['file-formats', 'File formats'],
        ['settings', 'Settings'],
        ['privacy', 'Privacy'],
      ],
    },
    {
      title: 'Help',
      pages: [
        ['troubleshooting', 'Troubleshooting'],
        ['faq', 'FAQ'],
        ['other-providers', 'Models from other apps'],
      ],
    },
    {
      title: 'Build',
      pages: [['plugins', 'Plugins']],
    },
  ];

  var FLAT = [];
  var TITLES = {};
  SECTIONS.forEach(function (s) {
    s.pages.forEach(function (p) {
      FLAT.push({ slug: p[0], title: p[1], section: s.title });
      TITLES[p[0]] = p[1];
    });
  });

  var $ = function (id) {
    return document.getElementById(id);
  };
  var renderSeq = 0;

  /* ---------- helpers ---------- */

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function isKnown(slug) {
    return slug === INDEX_ROUTE || Object.prototype.hasOwnProperty.call(TITLES, slug);
  }

  function sourceName(slug) {
    return slug === INDEX_ROUTE ? 'README' : slug;
  }

  function parseHash() {
    var h = location.hash.replace(/^#\/?/, '');
    var i = h.indexOf('#');
    var page = i === -1 ? h : h.slice(0, i);
    var anchor = i === -1 ? '' : h.slice(i + 1);
    try {
      page = decodeURIComponent(page);
      anchor = decodeURIComponent(anchor);
    } catch (e) {
      /* malformed escape: keep the raw text */
    }
    return { page: page || DEFAULT_PAGE, anchor: anchor };
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[`*_]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  function scrollToAnchor(id) {
    if (!id) return;
    var target = document.getElementById(id);
    if (target) target.scrollIntoView({ block: 'start' });
  }

  /* ---------- theme toggle (same key and behaviour as the landing page) ---------- */

  function currentTheme() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function labelToggle(btn, theme) {
    var next = theme === 'light' ? 'dark' : 'light';
    btn.setAttribute('aria-label', 'switch to ' + next + ' theme');
    btn.setAttribute('title', 'switch to ' + next + ' theme');
  }

  /* Light and obsidian screenshots are <picture> sources. Without a stored choice the browser picks by the
     system preference; a manual choice switches the matching source on and the other one off. Same logic
     as the landing page (app.js). Sources need data-scheme, which rewriteImages sets from the media query. */
  function applyScreens(theme) {
    var pictures = document.querySelectorAll('#docs-article picture');
    Array.prototype.forEach.call(pictures, function (picture) {
      var dark = picture.querySelector('source[data-scheme="dark"]');
      var light = picture.querySelector('source[data-scheme="light"]');
      if (!dark || !light) return;
      dark.setAttribute('media', theme === 'dark' ? 'all' : 'not all');
      light.setAttribute('media', theme === 'light' ? 'all' : 'not all');
    });
  }

  function syncScreens() {
    if (document.documentElement.getAttribute('data-theme')) applyScreens(currentTheme());
  }

  function setupTheme() {
    var btn = $('theme-toggle');
    if (!btn) return;
    labelToggle(btn, currentTheme());
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      labelToggle(btn, next);
      applyScreens(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* storage blocked: the choice still applies for this visit */
      }
    });
  }

  /* ---------- sidebar, drawer, pager ---------- */

  function buildNav() {
    var nav = $('docs-nav');
    nav.textContent = '';
    SECTIONS.forEach(function (s) {
      nav.appendChild(el('p', 'docs-nav-title', s.title));
      var ul = el('ul', 'docs-nav-list');
      s.pages.forEach(function (p) {
        var li = el('li');
        var a = el('a', null, p[1]);
        a.href = '#/' + p[0];
        a.setAttribute('data-slug', p[0]);
        li.appendChild(a);
        ul.appendChild(li);
      });
      nav.appendChild(ul);
    });
  }

  function highlightNav(slug) {
    var links = document.querySelectorAll('#docs-nav a[data-slug]');
    Array.prototype.forEach.call(links, function (a) {
      if (a.getAttribute('data-slug') === slug) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function setDrawer(open) {
    $('docs-sidebar').classList.toggle('is-open', open);
    $('docs-backdrop').hidden = !open;
    $('menu-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setupDrawer() {
    $('menu-toggle').addEventListener('click', function () {
      setDrawer(!$('docs-sidebar').classList.contains('is-open'));
    });
    $('docs-backdrop').addEventListener('click', function () {
      setDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
    });
  }

  function setPager(slug) {
    var pager = $('docs-pager');
    pager.textContent = '';
    var idx = -1;
    FLAT.forEach(function (p, i) {
      if (p.slug === slug) idx = i;
    });
    if (idx === -1) {
      pager.hidden = true;
      return;
    }
    pager.hidden = false;
    var prev = FLAT[idx - 1];
    var next = FLAT[idx + 1];
    if (prev) pager.appendChild(pagerLink('prev', prev, 'previous'));
    else pager.appendChild(el('span'));
    if (next) pager.appendChild(pagerLink('next', next, 'next'));
  }

  function pagerLink(cls, page, label) {
    var a = el('a', 'docs-pager-' + cls);
    a.href = '#/' + page.slug;
    a.appendChild(el('span', 'docs-pager-label', label));
    a.appendChild(el('span', 'docs-pager-page', page.title));
    return a;
  }

  /* ---------- rendering ---------- */

  function setStatus(text) {
    var article = $('docs-article');
    article.textContent = '';
    article.appendChild(el('p', 'docs-status', text));
  }

  function setEdit(slug) {
    var a = $('docs-edit');
    a.href = EDIT_BASE + sourceName(slug) + '.md';
    a.parentNode.hidden = false;
  }

  function showNotFound(slug) {
    var article = $('docs-article');
    article.textContent = '';
    article.appendChild(el('p', 'docs-kicker', '404'));
    article.appendChild(el('h1', null, 'page not found'));
    var p = el('p');
    p.appendChild(document.createTextNode('There is no page called '));
    p.appendChild(el('code', null, slug));
    p.appendChild(document.createTextNode('. Pick one from the list, or start with '));
    var a = el('a', null, 'getting started');
    a.href = '#/' + DEFAULT_PAGE;
    p.appendChild(a);
    p.appendChild(document.createTextNode('.'));
    article.appendChild(p);
    document.title = 'page not found · Bouncer docs';
    $('docs-toc-nav').textContent = '';
    $('docs-toc-nav').parentNode.hidden = true;
    $('docs-pager').hidden = true;
    $('docs-edit').parentNode.hidden = true;
    window.scrollTo(0, 0);
  }

  function showError() {
    setStatus('This page could not be loaded. Check your connection and try again, or read it on GitHub.');
    $('docs-toc-nav').parentNode.hidden = true;
    $('docs-pager').hidden = true;
  }

  function rewriteLinks(article, slug) {
    var anchors = article.querySelectorAll('a[href]');
    Array.prototype.forEach.call(anchors, function (a) {
      var href = a.getAttribute('href');
      var m;
      if (/^#/.test(href)) {
        a.setAttribute('href', '#/' + slug + href);
      } else if ((m = href.match(/^(?:\.\/)?([a-z0-9-]+)\.md(#.*)?$/i))) {
        var target = m[1].toLowerCase();
        if (target === 'readme') a.setAttribute('href', '#/' + INDEX_ROUTE);
        else a.setAttribute('href', '#/' + target + (m[2] || ''));
      } else if (/^https?:\/\//i.test(href)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  function rewriteImages(article) {
    var imgs = article.querySelectorAll('img[src]');
    Array.prototype.forEach.call(imgs, function (img) {
      var src = img.getAttribute('src');
      if (/^(https?:|data:|\/)/i.test(src)) return;
      var rel = src.replace(/^\.\//, '');
      img.setAttribute('src', 'docs/' + rel);
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
    // Light and obsidian screenshots are <picture> sources (see the README pattern in the docs).
    var sources = article.querySelectorAll('source[srcset]');
    Array.prototype.forEach.call(sources, function (source) {
      var srcset = source.getAttribute('srcset');
      if (/^(https?:|data:|\/)/i.test(srcset)) return;
      source.setAttribute('srcset', 'docs/' + srcset.replace(/^\.\//, ''));
      var media = source.getAttribute('media') || '';
      if (/dark/.test(media)) source.setAttribute('data-scheme', 'dark');
      else if (/light/.test(media)) source.setAttribute('data-scheme', 'light');
    });
  }

  function addHeadingIds(article) {
    var seen = {};
    var heads = article.querySelectorAll('h2, h3');
    Array.prototype.forEach.call(heads, function (h) {
      var base = slugify(h.textContent) || 'section';
      var id = base;
      var n = 2;
      while (seen[id]) id = base + '-' + n++;
      seen[id] = true;
      h.id = id;
    });
  }

  function wrapTablesAndCode(article) {
    Array.prototype.forEach.call(article.querySelectorAll('table'), function (t) {
      var wrap = el('div', 'table-wrap');
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
    Array.prototype.forEach.call(article.querySelectorAll('pre'), function (pre) {
      var block = el('div', 'code-block');
      pre.parentNode.insertBefore(block, pre);
      block.appendChild(pre);
      var btn = el('button', 'code-copy', 'copy');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'copy code');
      btn.addEventListener('click', function () {
        var text = pre.textContent;
        var done = function (label) {
          btn.textContent = label;
          setTimeout(function () {
            btn.textContent = 'copy';
          }, 1600);
        };
        try {
          navigator.clipboard.writeText(text).then(
            function () {
              done('copied');
            },
            function () {
              done('select the text');
            },
          );
        } catch (e) {
          done('select the text');
        }
      });
      block.appendChild(btn);
    });
  }

  var tocObserver = null;

  function buildToc(article) {
    var nav = $('docs-toc-nav');
    var aside = nav.parentNode;
    nav.textContent = '';
    if (tocObserver) tocObserver.disconnect();
    var heads = article.querySelectorAll('h2, h3');
    if (!heads.length) {
      aside.hidden = true;
      return;
    }
    aside.hidden = false;
    var ul = el('ul', 'docs-toc-list');
    var parent = ul;
    var links = {};
    Array.prototype.forEach.call(heads, function (h) {
      var a = el('a', null, h.textContent);
      a.href = '#/' + currentSlug() + '#' + h.id;
      links[h.id] = a;
      var li = el('li', h.tagName === 'H3' ? 'is-sub' : null);
      li.appendChild(a);
      if (h.tagName === 'H3' && parent.lastChild && parent.lastChild.querySelector) {
        var sub = parent.lastChild.querySelector('ul');
        if (!sub) {
          sub = el('ul');
          parent.lastChild.appendChild(sub);
        }
        sub.appendChild(li);
      } else {
        parent.appendChild(li);
      }
    });
    nav.appendChild(ul);

    if ('IntersectionObserver' in window) {
      tocObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            Object.keys(links).forEach(function (id) {
              links[id].removeAttribute('aria-current');
            });
            links[entry.target.id].setAttribute('aria-current', 'true');
          });
        },
        { rootMargin: '0px 0px -70% 0px' },
      );
      Array.prototype.forEach.call(heads, function (h) {
        tocObserver.observe(h);
      });
    }
  }

  var activeSlug = null;
  function currentSlug() {
    return activeSlug || DEFAULT_PAGE;
  }

  function renderMarkdown(slug, md, anchor) {
    var article = $('docs-article');
    var html = window.marked.parse(md, { gfm: true });
    article.innerHTML = window.DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

    var h1 = article.querySelector('h1');
    var title = h1 ? h1.textContent : TITLES[slug];
    document.title = title + ' · Bouncer docs';

    addHeadingIds(article);
    rewriteLinks(article, slug);
    rewriteImages(article);
    syncScreens();
    wrapTablesAndCode(article);
    buildToc(article);
    setPager(slug);
    setEdit(slug);

    if (anchor) scrollToAnchor(anchor);
    else window.scrollTo(0, 0);
  }

  function renderPage(slug, anchor) {
    var seq = ++renderSeq;
    activeSlug = slug;
    highlightNav(slug);
    setDrawer(false);

    if (!isKnown(slug)) {
      showNotFound(slug);
      return;
    }
    if (!window.marked || !window.DOMPurify) {
      showError();
      return;
    }
    setStatus('loading');
    $('docs-toc-nav').parentNode.hidden = true;

    fetch('docs/' + sourceName(slug) + '.md', { cache: 'no-cache' })
      .then(function (res) {
        if (res.status === 404) throw new Error('missing');
        if (!res.ok) throw new Error('http ' + res.status);
        return res.text();
      })
      .then(function (md) {
        if (seq !== renderSeq) return;
        renderMarkdown(slug, md, anchor);
      })
      .catch(function (err) {
        if (seq !== renderSeq) return;
        if (err && err.message === 'missing') showNotFound(slug);
        else showError();
      });
  }

  // A hash change that only moves the anchor scrolls instead of refetching.
  var lastRoute = null;
  function route() {
    var r = parseHash();
    if (lastRoute && r.page === lastRoute.page) {
      lastRoute = r;
      scrollToAnchor(r.anchor);
      return;
    }
    lastRoute = r;
    renderPage(r.page, r.anchor);
  }

  /* ---------- boot ---------- */

  // The landing header wraps on narrow screens, so the sticky offsets follow its real height.
  function setHeaderOffset() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    document.documentElement.style.setProperty('--docs-top', header.offsetHeight + 'px');
  }

  function init() {
    setupTheme();
    buildNav();
    setupDrawer();
    setHeaderOffset();
    window.addEventListener('resize', setHeaderOffset);
    if ('ResizeObserver' in window) new ResizeObserver(setHeaderOffset).observe(document.querySelector('.site-header'));
    window.addEventListener('hashchange', route);
    route();
  }

  init();
})();
