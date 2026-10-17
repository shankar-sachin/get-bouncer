/* Bouncer landing page: OS detection, release lookup, copy buttons, theme toggle. Vanilla JS, no build. */
(function () {
  'use strict';

  var REPO = 'shankar-sachin/get-bouncer';
  var RELEASES_URL = 'https://github.com/' + REPO + '/releases';
  var API_URL = 'https://api.github.com/repos/' + REPO + '/releases?per_page=10';
  var THEME_KEY = 'bouncer-theme';

  var OS_LABEL = { mac: 'macOS', win: 'Windows', linux: 'Linux', other: '' };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ---------- platform detection ---------- */

  function detectOS() {
    var ua = navigator.userAgent || '';
    var uad = navigator.userAgentData;
    var platform = (uad && uad.platform) || navigator.platform || '';
    if (/iPhone|iPad|iPod|Android/i.test(ua)) return 'other';
    if (/mac/i.test(platform) || /Macintosh|Mac OS X/.test(ua)) return 'mac';
    if (/win/i.test(platform) || /Windows/.test(ua)) return 'win';
    if (/linux|x11|cros/i.test(platform) || /Linux|X11/.test(ua)) return 'linux';
    return 'other';
  }

  /* Resolves to 'arm' or 'x86'. Apple Silicon is the default on macOS when the browser does not say. */
  function detectArch(os) {
    var fallback = os === 'mac' ? 'arm' : 'x86';
    var uad = navigator.userAgentData;
    if (!uad || typeof uad.getHighEntropyValues !== 'function') {
      return Promise.resolve(fallback);
    }
    return uad
      .getHighEntropyValues(['architecture'])
      .then(function (values) {
        if (values && values.architecture) return values.architecture === 'arm' ? 'arm' : 'x86';
        return fallback;
      })
      .catch(function () {
        return fallback;
      });
  }

  /* ---------- release lookup ---------- */

  function fetchLatestRelease() {
    return fetch(API_URL, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub responded ' + res.status);
        return res.json();
      })
      .then(function (releases) {
        if (!Array.isArray(releases)) return null;
        for (var i = 0; i < releases.length; i++) {
          if (!releases[i].draft && Array.isArray(releases[i].assets) && releases[i].assets.length) {
            return releases[i];
          }
        }
        return null;
      });
  }

  /* Matches the installer names: Bouncer-<v>-arm64.dmg, Bouncer-<v>.dmg, Bouncer-Setup-<v>.exe, Bouncer-<v>.AppImage, .deb */
  function pickAssets(assets) {
    function find(test) {
      for (var i = 0; i < assets.length; i++) {
        if (test(assets[i].name || '')) return assets[i];
      }
      return null;
    }
    return {
      macArm: find(function (n) {
        return /^Bouncer.*arm64\.dmg$/i.test(n);
      }),
      macIntel: find(function (n) {
        return /^Bouncer.*\.dmg$/i.test(n) && !/arm64/i.test(n);
      }),
      win: find(function (n) {
        return /Setup.*\.exe$/i.test(n);
      }),
      appimage: find(function (n) {
        return /\.AppImage$/i.test(n);
      }),
      deb: find(function (n) {
        return /\.deb$/i.test(n);
      })
    };
  }

  function versionOf(release) {
    return (release.tag_name || release.name || '').replace(/^v/i, '');
  }

  /* ---------- rendering ---------- */

  var state = { release: null, assets: null, os: 'other', arch: 'x86' };

  function setBadge(text, live) {
    var badge = $('#release-badge');
    if (!badge) return;
    var label = $('[data-release-label]', badge);
    if (label) label.textContent = text;
    badge.classList.toggle('is-live', !!live);
  }

  function setPrimary(label, href) {
    var btn = $('#hero-download');
    if (!btn) return;
    btn.textContent = label;
    btn.setAttribute('href', href);
  }

  function renderPlatformList(assets) {
    $all('[data-state]').forEach(function (cell) {
      var key = cell.getAttribute('data-state');
      var asset = assets && assets[key];
      var row = cell.parentNode;
      var fileEl = $('[data-file="' + key + '"]', row);
      if (asset) {
        cell.textContent = '';
        var link = document.createElement('a');
        link.href = asset.browser_download_url;
        link.textContent = 'download';
        link.setAttribute('aria-label', 'download ' + asset.name);
        cell.appendChild(link);
        if (fileEl) fileEl.textContent = asset.name;
      } else {
        cell.textContent = 'coming soon';
      }
    });
  }

  function render() {
    var release = state.release;
    var assets = state.assets;
    var osLabel = OS_LABEL[state.os];
    var status = $('#download-status');

    if (!release || !assets) {
      setBadge('prerelease · coming soon', false);
      setPrimary('Downloads coming soon', RELEASES_URL);
      if (status) {
        status.textContent =
          'No installers are published yet. The first prerelease will appear on the releases page, and this page will link to it.';
      }
      renderPlatformList(null);
      return;
    }

    var version = versionOf(release);
    setBadge('prerelease · v' + version, true);

    var primaryAsset = null;
    var label = 'Download Bouncer';
    if (state.os === 'mac') {
      primaryAsset = state.arch === 'arm' ? assets.macArm || assets.macIntel : assets.macIntel || assets.macArm;
      label = 'Download for macOS';
    } else if (state.os === 'win') {
      primaryAsset = assets.win;
      label = 'Download for Windows';
    } else if (state.os === 'linux') {
      primaryAsset = assets.appimage || assets.deb;
      label = 'Download for Linux';
    }

    if (primaryAsset) {
      setPrimary(label, primaryAsset.browser_download_url);
    } else {
      setPrimary(label === 'Download Bouncer' ? label : label + ' (not in this release)', RELEASES_URL);
    }

    if (status) {
      status.textContent = 'Latest prerelease: v' + version + '. Installers are unsigned, see the FAQ.';
    }
    renderPlatformList(assets);
  }

  function collectAssets(release) {
    return release ? pickAssets(release.assets) : null;
  }

  /* ---------- copy buttons ---------- */

  function setupCopy() {
    $all('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        var done = function () {
          btn.textContent = 'copied';
          setTimeout(function () {
            btn.textContent = 'copy';
          }, 1600);
        };
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () {
              btn.textContent = 'select the text';
            });
          } else {
            btn.textContent = 'select the text';
          }
        } catch (e) {
          btn.textContent = 'select the text';
        }
      });
    });
  }

  /* ---------- theme toggle ---------- */

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

  /* Screenshots come in a light and an obsidian version. Without a stored choice the browser picks by the
     system preference (<picture> media queries). A manual choice overrides that: the matching source is
     enabled and the other one is switched off, so the image follows the toggle. */
  function applyScreens(theme) {
    var pictures = document.querySelectorAll('picture');
    for (var i = 0; i < pictures.length; i++) {
      var dark = pictures[i].querySelector('source[data-scheme="dark"]');
      var light = pictures[i].querySelector('source[data-scheme="light"]');
      if (!dark || !light) continue;
      dark.setAttribute('media', theme === 'dark' ? 'all' : 'not all');
      light.setAttribute('media', theme === 'light' ? 'all' : 'not all');
    }
  }

  function setupTheme() {
    var btn = $('#theme-toggle');
    if (!btn) return;
    labelToggle(btn, currentTheme());
    if (document.documentElement.getAttribute('data-theme')) applyScreens(currentTheme());
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      labelToggle(btn, next);
      applyScreens(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* private mode or blocked storage: the choice still applies for this visit */
      }
    });
  }

  /* ---------- boot ---------- */

  function init() {
    setupTheme();
    setupCopy();

    state.os = detectOS();
    var label = OS_LABEL[state.os];
    if (label) {
      setPrimary('Download for ' + label, RELEASES_URL);
    } else {
      setPrimary('Download Bouncer', RELEASES_URL);
    }

    var archPromise = detectArch(state.os).then(function (arch) {
      state.arch = arch;
    });

    fetchLatestRelease()
      .then(function (release) {
        state.release = release;
        state.assets = collectAssets(release);
        return archPromise.then(function () {
          render();
        });
      })
      .catch(function () {
        state.release = null;
        state.assets = null;
        render();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
