/*
 * 日中韓ごみ分別ゲーム — ゲームの しくみ
 * データ（国・ごみ箱・ごみ・絵）は data.js の window.GAME_DATA に あります。
 * ふつうは この ファイルを さわらなくても 問題を ふやせます。
 */
(function () {
  'use strict';

  var D = window.GAME_DATA;
  var app = document.getElementById('app');
  if (!D) {
    app.innerHTML = '<p class="fatal">data.js が 読みこめませんでした。index.html と 同じ フォルダに data.js が あるか たしかめてね。</p>';
    return;
  }

  /* ------------------------------------------------------------
   * 小さな 道具
   * ------------------------------------------------------------ */
  var STORAGE_KEY = 'gomi-bunbetsu-game-v1';
  var reduceMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reducedMotion() { return !!(reduceMQ && reduceMQ.matches); }

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* {漢字|よみ} → ruby、[zh]…[/zh] / [ko]…[/ko] → lang つき span */
  function rich(s) {
    var h = esc(s);
    h = h.replace(/\{([^{}|]+)\|([^{}]+)\}/g, '<ruby>$1<rt>$2</rt></ruby>');
    h = h.replace(/\[(zh|ko)\]([\s\S]*?)\[\/\1\]/g, function (m, lang, text) {
      return '<span lang="' + (lang === 'zh' ? 'zh-CN' : 'ko') + '">' + text + '</span>';
    });
    return h;
  }

  /* 読み上げ用（ふりがな・タグを はずす） */
  function plain(s) {
    return String(s == null ? '' : s)
      .replace(/\{([^{}|]+)\|([^{}]+)\}/g, '$1')
      .replace(/\[\/?(zh|ko)\]/g, '');
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function wait(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

  function shade(hex, amt) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return hex;
    var n = parseInt(m[1], 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function f(c) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt))); }
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }

  /* ------------------------------------------------------------
   * データの 下じゅんび
   * ------------------------------------------------------------ */
  var COUNTRY = {};
  D.countries.forEach(function (c) { COUNTRY[c.id] = c; });
  var ITEM = {};
  D.items.forEach(function (it) { ITEM[it.id] = it; });

  function binOf(country, binId) {
    for (var i = 0; i < country.bins.length; i++) if (country.bins[i].id === binId) return country.bins[i];
    return null;
  }

  /* 新しい ごみを 足した ときの まちがいを コンソールに 出す */
  function validateData() {
    var seen = {};
    D.items.forEach(function (it) {
      if (seen[it.id]) console.warn('[data.js] ごみの id が かぶっています: ' + it.id);
      seen[it.id] = true;
      if (!D.icons[it.icon]) console.warn('[data.js] 絵が ありません: items "' + it.id + '" の icon "' + it.icon + '"');
      Object.keys(it.answers || {}).forEach(function (cid) {
        var c = COUNTRY[cid];
        var a = it.answers[cid];
        if (!c) console.warn('[data.js] 国の id が ちがいます: items "' + it.id + '" の answers.' + cid);
        else if (a !== 'varies' && !binOf(c, a)) console.warn('[data.js] ごみ箱の id が ちがいます: items "' + it.id + '" の answers.' + cid + ' = "' + a + '"');
      });
    });
    D.countries.forEach(function (c) {
      (c.mustInclude || []).forEach(function (id) {
        if (!ITEM[id]) console.warn('[data.js] mustInclude の ごみが ありません: ' + c.id + ' → ' + id);
      });
      c.bins.forEach(function (b) {
        if (b.picto && !D.icons[b.picto]) console.warn('[data.js] ごみ箱の マークが ありません: ' + c.id + ' / ' + b.id + ' → ' + b.picto);
      });
    });
  }
  validateData();

  /* ------------------------------------------------------------
   * 保存（星・設定）
   * ------------------------------------------------------------ */
  function loadStore() {
    var s = { stars: {}, sound: true, ruby: true };
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') {
          if (o.stars && typeof o.stars === 'object') s.stars = o.stars;
          if (typeof o.sound === 'boolean') s.sound = o.sound;
          if (typeof o.ruby === 'boolean') s.ruby = o.ruby;
        }
      }
    } catch (e) { /* ブラウザが 保存を ゆるさない ときは 保存なしで あそぶ */ }
    return s;
  }
  function saveStore() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) { /* 何もしない */ }
  }
  var store = loadStore();

  /* ------------------------------------------------------------
   * 絵
   * ------------------------------------------------------------ */
  function icon(id, cls) {
    var inner = D.icons[id] || D.icons._missing || '';
    return '<svg class="' + (cls || 'icon') + '" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<g fill="#ffffff" stroke="#3a3a3a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g></svg>';
  }

  function binSVG(bin, cls) {
    var lid = shade(bin.color, -0.28);
    var picto = D.icons[bin.picto] || '';
    return '<svg class="' + (cls || 'bin-svg') + '" viewBox="0 0 100 100" aria-hidden="true" focusable="false" style="color:' + esc(bin.color) + '">' +
      '<g class="bin-lid"><rect x="40" y="2" width="20" height="9" rx="3" fill="' + lid + '"/>' +
      '<rect x="11" y="9" width="78" height="14" rx="6" fill="' + lid + '"/></g>' +
      '<path d="M17 24 L83 24 L77 92 Q76 97 70 97 L30 97 Q24 97 23 92 Z" fill="' + esc(bin.color) + '"/>' +
      '<path d="M24 30 L30 88" fill="none" stroke="#ffffff" stroke-opacity=".25" stroke-width="4" stroke-linecap="round"/>' +
      '<g transform="translate(29 35) scale(0.42)" fill="#ffffff" stroke="none">' + picto + '</g></svg>';
  }

  function chipHTML(country, answer) {
    if (answer === 'varies') {
      return '<span class="chip chip-varies">' + rich(D.variesText || 'まちによって ちがう') + '</span>';
    }
    var bin = binOf(country, answer);
    if (!bin) return '<span class="chip">?</span>';
    return '<span class="chip" style="--chip-c:' + esc(bin.color) + '">' + binSVG(bin, 'chip-bin') +
      '<span class="chip-text"><b>' + rich(bin.name) + '</b>' +
      (bin.native ? '<small>' + rich(bin.native) + '</small>' : '') + '</span></span>';
  }

  /* ------------------------------------------------------------
   * 音（WebAudio で その場で つくる。ファイル なし）
   * ------------------------------------------------------------ */
  var actx = null;
  function sound(kind) {
    if (!store.sound) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      actx = actx || new AC();
      if (actx.state === 'suspended') actx.resume();
      var now = actx.currentTime;
      var seq = kind === 'ok' ? [[660, 0], [990, 0.11]]
        : kind === 'ng' ? [[330, 0], [247, 0.16]]
          : kind === 'clear' ? [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.38]]
            : [[880, 0]];
      seq.forEach(function (n) {
        var o = actx.createOscillator();
        var g = actx.createGain();
        o.type = kind === 'ng' ? 'sawtooth' : 'triangle';
        o.frequency.value = n[0];
        var t = now + n[1];
        var vol = kind === 'ng' ? 0.06 : 0.16;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'clear' ? 0.35 : 0.22));
        o.connect(g); g.connect(actx.destination);
        o.start(t); o.stop(t + 0.4);
      });
    } catch (e) { /* 音が 出せない ときは しずかに つづける */ }
  }

  /* ------------------------------------------------------------
   * ポップアップ（alert / confirm は 使わない）
   * ------------------------------------------------------------ */
  var modal = null;
  var modalRoot = $('modal-root');

  function openModal(opts) {
    closeModal(true);
    var prev = document.activeElement;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    var box = document.createElement('div');
    box.className = 'modal ' + (opts.className || '');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<div class="modal-body">' + opts.html + '</div>';
    var h = box.querySelector('h2');
    if (h) { h.id = 'modal-title'; box.setAttribute('aria-labelledby', 'modal-title'); }

    var actions = document.createElement('div');
    actions.className = 'modal-actions';
    (opts.buttons || [{ label: 'とじる' }]).forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn' + (b.sub ? ' btn-sub' : '');
      btn.innerHTML = rich(b.label);
      btn.addEventListener('click', function () {
        closeModal();
        if (b.action) b.action();
      });
      actions.appendChild(btn);
    });
    box.appendChild(actions);
    overlay.appendChild(box);
    if (opts.dismissible) {
      overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    }
    modalRoot.appendChild(overlay);
    app.setAttribute('aria-hidden', 'true');
    if ('inert' in app) app.inert = true;
    modal = { overlay: overlay, prev: prev, dismissible: !!opts.dismissible };

    var primary = actions.querySelector('.btn:not(.btn-sub)') || actions.querySelector('button');
    if (primary) primary.focus();
  }

  function closeModal(silent) {
    if (!modal) return;
    var m = modal;
    modal = null;
    if (m.overlay.parentNode) m.overlay.parentNode.removeChild(m.overlay);
    app.removeAttribute('aria-hidden');
    if ('inert' in app) app.inert = false;
    if (!silent && m.prev && m.prev.focus && document.body.contains(m.prev)) {
      try { m.prev.focus({ preventScroll: true }); } catch (e) { m.prev.focus(); }
    }
  }

  function trapTab(e) {
    var f = modal.overlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!modal.overlay.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------------
   * 画面の きりかえ と 上の バー
   * ------------------------------------------------------------ */
  var state = { screen: 'title', country: null, queue: [], index: 0, score: 0, results: [], locked: false };
  var backAction = null;

  function show(screen) {
    state.screen = screen;
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].hidden = screens[i].id !== 'screen-' + screen;
    document.body.setAttribute('data-screen', screen);
    var main = $('main');
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
    var h1 = document.querySelector('#screen-' + screen + ' h1');
    if (h1) { h1.setAttribute('tabindex', '-1'); try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); } }
  }

  function setTopbar(opt) {
    var back = $('tb-back');
    if (opt.back) {
      back.hidden = false;
      back.querySelector('.tb-back-label').innerHTML = rich(opt.back.label);
      backAction = opt.back.action;
    } else {
      back.hidden = true;
      backAction = null;
    }
    $('tb-center').innerHTML = opt.center || '';
    if (opt.color) document.documentElement.style.setProperty('--c', opt.color);
    else document.documentElement.style.removeProperty('--c');
  }

  function applySettings() {
    document.body.classList.toggle('no-ruby', !store.ruby);
    var s = $('tb-sound'), r = $('tb-ruby');
    s.setAttribute('aria-pressed', String(store.sound));
    s.querySelector('.tool-label').textContent = store.sound ? 'おと オン' : 'おと オフ';
    s.classList.toggle('is-off', !store.sound);
    r.setAttribute('aria-pressed', String(store.ruby));
    r.querySelector('.tool-label').textContent = store.ruby ? 'ふりがな オン' : 'ふりがな オフ';
    r.classList.toggle('is-off', !store.ruby);
  }

  /* ------------------------------------------------------------
   * タイトル
   * ------------------------------------------------------------ */
  function goTitle() {
    setTopbar({});
    show('title');
  }

  function renderTitleArt() {
    var art = $('title-art');
    if (!art) return;
    var html = '';
    D.countries.forEach(function (c) { html += icon(c.landmark, 'title-landmark'); });
    art.innerHTML = html;
    var row = $('title-items');
    if (row) {
      row.innerHTML = ['banana', 'pet', 'egg', 'battery', 'newspaper', 'can'].map(function (id) {
        return D.icons[id] ? icon(id, 'title-item') : '';
      }).join('');
    }
  }

  function howTo() {
    var steps = [
      ['国を えらぶ', '日本 → {上海|シャンハイ} → ソウルの じゅんばんが おすすめ。'],
      ['ごみを ごみ箱へ', 'ごみの カードを ごみ箱まで ドラッグするか、ごみ箱を タップ（クリック）してね。'],
      ['「なぜ？」を 読もう', 'こたえの あとに、その 国が そう 分ける わけが 出るよ。ほかの 国の こたえも くらべてみよう。'],
      ['まとめ', '3つの 国を あそんだら「まとめ」で くらべよう。']
    ];
    openModal({
      className: 'modal-help',
      dismissible: true,
      html:
        '<h2>あそびかた</h2>' +
        '<ol class="howto">' + steps.map(function (s) {
          return '<li><b>' + rich(s[0]) + '</b><br>' + rich(s[1]) + '</li>';
        }).join('') + '</ol>' +
        '<p class="howto-key">キーボードの 1〜4 の キーでも こたえられるよ。</p>',
      buttons: [{ label: 'わかった！' }]
    });
  }

  /* ------------------------------------------------------------
   * 国えらび
   * ------------------------------------------------------------ */
  function starsHTML(n, total) {
    var s = '';
    for (var i = 0; i < (total || 3); i++) s += '<span class="star' + (i < n ? ' on' : '') + '">' + (i < n ? '★' : '☆') + '</span>';
    return '<span class="stars" aria-label="ほし ' + n + 'こ">' + s + '</span>';
  }

  function goSelect() {
    setTopbar({ back: { label: 'タイトル', action: goTitle } });
    var grid = $('country-grid');
    grid.innerHTML = '';
    D.countries.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'country-card';
      b.style.setProperty('--c', c.color);
      var got = store.stars[c.id];
      b.innerHTML =
        '<span class="cc-num">' + (i + 1) + '</span>' +
        icon(c.landmark, 'cc-landmark') +
        '<span class="cc-name">' + rich(c.name) + '</span>' +
        (c.place ? '<span class="cc-place">' + rich(c.place) + '</span>' : '<span class="cc-place">&nbsp;</span>') +
        (typeof got === 'number' ? starsHTML(got) : '<span class="cc-new">まだ あそんでいない</span>');
      b.addEventListener('click', function () { goIntro(c.id); });
      grid.appendChild(b);
    });
    show('select');
  }

  /* ------------------------------------------------------------
   * 国の しょうかい
   * ------------------------------------------------------------ */
  function goIntro(cid) {
    var c = COUNTRY[cid];
    if (!c) { goSelect(); return; }
    setTopbar({ back: { label: 'もどる', action: goSelect }, color: c.color });
    var el = $('screen-intro');
    var bins = c.bins.map(function (b) {
      return '<li class="intro-bin" style="--bin-c:' + esc(b.color) + '">' + binSVG(b) +
        '<span class="ib-text"><span class="ib-name">' + rich(b.name) + '</span>' +
        (b.native ? '<span class="ib-native">' + rich(b.native) + (b.reading ? ' <span class="ib-reading">' + esc(b.reading) + '</span>' : '') + '</span>' : '') +
        '<span class="ib-desc">' + rich(b.desc || '') + '</span></span></li>';
    }).join('');
    el.innerHTML =
      '<div class="page">' +
      '<div class="intro-head">' + icon(c.landmark, 'intro-landmark') +
      '<div><h1>' + rich(c.name) + '</h1>' + (c.place ? '<p class="intro-place">' + rich(c.place) + '</p>' : '') + '</div></div>' +
      (c.notice ? '<p class="notice' + (c.id === 'jp' ? ' notice-warn' : '') + '">' + rich(c.notice) + '</p>' : '') +
      (c.intro || []).map(function (t) { return '<p class="intro-line">' + rich(t) + '</p>'; }).join('') +
      '<ul class="intro-bins">' + bins + '</ul>' +
      '<div class="page-actions"><button type="button" class="btn btn-big" id="btn-go">スタート！</button></div>' +
      '</div>';
    $('btn-go').addEventListener('click', function () { startStage(cid); });
    show('intro');
  }

  /* ------------------------------------------------------------
   * ゲーム本体
   * ------------------------------------------------------------ */
  function buildQueue(c) {
    var pool = D.items.filter(function (it) {
      return it.answers && binOf(c, it.answers[c.id]);
    });
    var n = Math.min(D.questionsPerStage || 8, pool.length);
    var picked = [];
    function take(it) { if (it && picked.indexOf(it) < 0 && picked.length < n) picked.push(it); }
    (c.mustInclude || []).forEach(function (id) {
      take(pool.filter(function (it) { return it.id === id; })[0]);
    });
    /* どの ごみ箱も 1回は せいかいに なるように */
    shuffle(c.bins.slice()).forEach(function (b) {
      take(shuffle(pool.filter(function (it) { return it.answers[c.id] === b.id && picked.indexOf(it) < 0; }))[0]);
    });
    shuffle(pool.slice()).forEach(take);
    return shuffle(picked);
  }

  function startStage(cid) {
    var c = COUNTRY[cid];
    state.country = c;
    state.queue = buildQueue(c);
    state.index = 0;
    state.score = 0;
    state.results = [];
    state.locked = false;
    renderBins(c);
    var pn = $('play-notice');
    if (c.playNotice) { pn.innerHTML = '<span aria-hidden="true">⚠</span> ' + rich(c.playNotice); pn.hidden = false; }
    else { pn.innerHTML = ''; pn.hidden = true; }
    show('play');
    renderQuestion();
  }

  function updatePlayBar() {
    var c = state.country;
    setTopbar({
      back: { label: 'やめる', action: confirmQuit },
      color: c.color,
      center: '<span class="tb-country">' + rich(c.short || c.name) + '</span>' +
        '<span class="tb-progress">' + Math.min(state.index + 1, state.queue.length) + ' / ' + state.queue.length + '</span>' +
        '<span class="tb-score" aria-label="せいかい ' + state.score + 'もん">○ ' + state.score + '</span>'
    });
  }

  function renderBins(c) {
    var wrap = $('bins');
    wrap.innerHTML = '';
    c.bins.forEach(function (b, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bin';
      btn.setAttribute('data-bin', b.id);
      btn.style.setProperty('--bin-c', b.color);
      btn.innerHTML =
        '<span class="bin-key" aria-hidden="true">' + (i + 1) + '</span>' +
        binSVG(b) +
        '<span class="bin-name">' + rich(b.name) + '</span>' +
        (b.native ? '<span class="bin-native">' + rich(b.native) + '</span>' : '') +
        (b.reading ? '<span class="bin-reading" aria-hidden="true">' + esc(b.reading) + '</span>' : '');
      btn.setAttribute('aria-label', (i + 1) + ': ' + plain(b.name) + (b.native ? '（' + plain(b.native) + '）' : ''));
      btn.addEventListener('click', function () { choose(b.id, btn); });
      wrap.appendChild(btn);
    });
  }

  function renderQuestion() {
    var it = state.queue[state.index];
    var card = $('trash-card');
    card.className = 'trash-card';
    card.style.transform = '';
    card._tx = 0; card._ty = 0;
    card.innerHTML = icon(it.icon, 'card-icon') + '<span class="card-name">' + rich(it.name) + '</span>';
    card.setAttribute('aria-label', plain(it.name));
    if (!reducedMotion()) {
      void card.offsetWidth;
      card.classList.add('enter');
    }
    $('sr-live').textContent = (state.index + 1) + 'もんめ：' + plain(it.name);
    state.locked = false;
    updatePlayBar();
  }

  function binButton(binId) {
    return document.querySelector('#bins .bin[data-bin="' + binId + '"]');
  }

  function choose(binId, binEl) {
    if (state.locked || state.screen !== 'play' || modal) return;
    state.locked = true;
    var it = state.queue[state.index];
    var c = state.country;
    var correct = it.answers[c.id] === binId;
    if (correct) state.score++;
    state.results.push({ item: it, chosen: binId, correct: correct });
    flyCard(binEl || binButton(binId)).then(function () {
      sound(correct ? 'ok' : 'ng');
      showFeedback(it, binId, correct);
    });
  }

  function flyCard(binEl) {
    var card = $('trash-card');
    card.classList.remove('dragging', 'snap', 'enter');
    if (reducedMotion() || !binEl) {
      card.style.transform = '';
      card.classList.add('gone');
      return Promise.resolve();
    }
    var cr = card.getBoundingClientRect();
    var br = binEl.getBoundingClientRect();
    var dx = (br.left + br.width / 2) - (cr.left + cr.width / 2) + (card._tx || 0);
    var dy = (br.top + br.height * 0.3) - (cr.top + cr.height / 2) + (card._ty || 0);
    card.classList.add('fly');
    void card.offsetWidth;
    card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.15)';
    binEl.classList.add('gulp');
    return wait(320).then(function () { binEl.classList.remove('gulp'); });
  }

  function showFeedback(it, chosen, correct) {
    var c = state.country;
    var answer = it.answers[c.id];
    var bin = binOf(c, answer);
    var why = (it.why && it.why[c.id]) || (bin && bin.why) || '';
    var note = it.notes && it.notes[c.id];

    var others = D.countries.filter(function (o) {
      return o.id !== c.id && it.answers[o.id];
    }).map(function (o) {
      return '<li><span class="oc-name">' + rich(o.short || o.name) + '</span>' + chipHTML(o, it.answers[o.id]) + '</li>';
    }).join('');

    var mark = correct
      ? '<svg viewBox="0 0 100 100" class="fb-mark" aria-hidden="true"><circle cx="50" cy="50" r="36" fill="none" stroke="#27ae60" stroke-width="12"/></svg>'
      : '<svg viewBox="0 0 100 100" class="fb-mark" aria-hidden="true"><path d="M24 24 L76 76 M76 24 L24 76" stroke="#e74c3c" stroke-width="12" stroke-linecap="round"/></svg>';

    var html =
      '<div class="fb ' + (correct ? 'fb-ok' : 'fb-ng') + '">' +
      '<div class="fb-top">' + mark + '<h2>' + (correct ? 'せいかい！' : 'ざんねん…') + '</h2></div>' +
      '<div class="fb-item">' + icon(it.icon, 'fb-icon') + '<span>' + rich(it.name) + '</span></div>' +
      '<p class="fb-row"><span class="fb-label">こたえ</span>' + chipHTML(c, answer) + '</p>' +
      (correct ? '' : '<p class="fb-row fb-yours"><span class="fb-label">えらんだ 箱</span>' + chipHTML(c, chosen) + '</p>') +
      (why ? '<div class="fb-why"><span class="fb-why-label">なぜ？</span><p>' + rich(why) + '</p></div>' : '') +
      (note ? '<p class="fb-note"><span aria-hidden="true">⚠</span> ' + rich(note) + '</p>' : '') +
      (others ? '<div class="fb-others"><h3>ほかの 国では？</h3><ul>' + others + '</ul></div>' : '') +
      '</div>';

    var last = state.index >= state.queue.length - 1;
    openModal({
      className: 'modal-feedback',
      html: html,
      buttons: [{ label: last ? 'けっかを 見る ▶' : 'つぎへ ▶', action: nextQuestion }]
    });
  }

  function nextQuestion() {
    state.index++;
    if (state.index >= state.queue.length) finishStage();
    else renderQuestion();
  }

  function confirmQuit() {
    openModal({
      className: 'modal-small',
      dismissible: true,
      html: '<h2>とちゅうで やめる？</h2><p>ここまでの けっかは のこらないよ。</p>',
      buttons: [
        { label: 'やめる', sub: true, action: function () { goSelect(); } },
        { label: 'つづける' }
      ]
    });
  }

  /* ------------------------------------------------------------
   * ドラッグ（Pointer Events。マウス・指・ペン ぜんぶ OK）
   * ------------------------------------------------------------ */
  function setupDrag() {
    var card = $('trash-card');
    var drag = null;
    var over = null;

    function binRects() {
      var list = [];
      var bins = document.querySelectorAll('#bins .bin');
      for (var i = 0; i < bins.length; i++) {
        list.push({ el: bins[i], id: bins[i].getAttribute('data-bin'), r: bins[i].getBoundingClientRect() });
      }
      return list;
    }
    function hit(x, y, rects) {
      var pad = 10;
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i].r;
        if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) return rects[i];
      }
      return null;
    }
    function setOver(t) {
      if (over === t) return;
      if (over) over.el.classList.remove('is-over');
      over = t;
      if (over) over.el.classList.add('is-over');
    }

    card.addEventListener('pointerdown', function (e) {
      if (state.locked || modal || state.screen !== 'play') return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      try { card.setPointerCapture(e.pointerId); } catch (err) { /* テスト用の にせイベント など */ }
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, rects: binRects() };
      card.classList.remove('snap', 'enter');
    });

    card.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 6) {
        drag.moved = true;
        card.classList.add('dragging');
      }
      if (drag.moved) {
        card._tx = dx; card._ty = dy;
        card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + Math.max(-12, Math.min(12, dx / 25)) + 'deg) scale(0.88)';
        setOver(hit(e.clientX, e.clientY, drag.rects));
      }
    });

    function end(e, cancelled) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag;
      drag = null;
      var target = (!cancelled && d.moved) ? hit(e.clientX, e.clientY, d.rects) : null;
      setOver(null);
      try { card.releasePointerCapture(e.pointerId); } catch (err) { /* 何もしない */ }
      if (target) {
        choose(target.id, target.el);
        return;
      }
      card.classList.remove('dragging');
      if (d.moved) {
        if (!reducedMotion()) card.classList.add('snap');
        card.style.transform = '';
        card._tx = 0; card._ty = 0;
      } else {
        /* タップだけ → 「ごみ箱へ はこんでね」と 合図 */
        if (!reducedMotion()) {
          card.classList.remove('wiggle');
          void card.offsetWidth;
          card.classList.add('wiggle');
        }
        var hint = $('play-hint');
        if (hint) { hint.classList.remove('flash'); void hint.offsetWidth; hint.classList.add('flash'); }
      }
    }
    card.addEventListener('pointerup', function (e) { end(e, false); });
    card.addEventListener('pointercancel', function (e) { end(e, true); });
    card.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    card.addEventListener('dragstart', function (e) { e.preventDefault(); });
    card.addEventListener('transitionend', function () { card.classList.remove('snap'); });
    card.addEventListener('animationend', function () { card.classList.remove('enter', 'wiggle'); });
  }

  /* ------------------------------------------------------------
   * けっか
   * ------------------------------------------------------------ */
  function finishStage() {
    var c = state.country;
    var n = state.queue.length;
    var s = state.score;
    var stars = s === n ? 3 : s >= Math.ceil(n * 0.75) ? 2 : s >= Math.ceil(n * 0.4) ? 1 : 0;
    var best = store.stars[c.id];
    store.stars[c.id] = typeof best === 'number' ? Math.max(best, stars) : stars;
    saveStore();

    setTopbar({ back: { label: '国を えらぶ', action: goSelect }, color: c.color });

    var msg = stars === 3 ? 'パーフェクト！ すごい！' : stars === 2 ? 'よく できたね！' : stars === 1 ? 'おしい！ もう いちど やってみよう' : 'むずかしかったね。「なぜ？」を 読んで もう いちど！';

    var miss = state.results.filter(function (r) { return !r.correct; }).map(function (r) {
      return '<li>' + icon(r.item.icon, 'miss-icon') + '<div class="miss-body"><span class="miss-name">' + rich(r.item.name) + '</span>' +
        '<span class="miss-arrow" aria-hidden="true">→</span>' + chipHTML(c, r.item.answers[c.id]) + '</div></li>';
    }).join('');

    var points = (c.points || []).map(function (p) {
      return '<li class="point"><h3>' + rich(p.title) + '</h3><p>' + rich(p.text) + '</p></li>';
    }).join('');

    var diff = (c.cityDiff || []).map(function (d) {
      return '<li class="diff">' + icon(d.icon, 'diff-icon') + '<div><h3>' + rich(d.title) + '</h3><p>' + rich(d.text) + '</p></div></li>';
    }).join('');

    var allDone = D.countries.every(function (cc) { return typeof store.stars[cc.id] === 'number'; });
    var nextC = null;
    for (var i = 0; i < D.countries.length; i++) {
      if (typeof store.stars[D.countries[i].id] !== 'number') { nextC = D.countries[i]; break; }
    }

    var el = $('screen-result');
    el.innerHTML =
      '<div class="page">' +
      '<div class="result-head">' + icon(c.landmark, 'intro-landmark') +
      '<div><h1>' + rich(c.short || c.name) + ' クリア！</h1>' +
      '<p class="result-score"><b>' + s + '</b> / ' + n + ' もん せいかい</p>' + starsHTML(stars) +
      '<p class="result-msg">' + rich(msg) + '</p></div></div>' +
      (miss ? '<section class="card-block"><h2>まちがえた ごみ</h2><ul class="miss-list">' + miss + '</ul></section>' : '') +
      (points ? '<section class="card-block"><h2>' + rich(c.short || c.name) + 'の ポイント</h2><ul class="point-list">' + points + '</ul></section>' : '') +
      (diff ? '<section class="card-block card-warn"><h2>' + rich(c.cityDiffTitle || 'ほかの まちでは？') + '</h2><ul class="diff-list">' + diff + '</ul></section>' : '') +
      (c.think ? '<section class="think"><h2><span aria-hidden="true">💭</span> かんがえよう</h2><p>' + rich(c.think) + '</p></section>' : '') +
      '<div class="page-actions">' +
      '<button type="button" class="btn btn-sub" id="btn-retry">もう いちど</button>' +
      (nextC ? '<button type="button" class="btn" id="btn-next">つぎは ' + rich(nextC.short || nextC.name) + ' ▶</button>' : '') +
      (allDone ? '<button type="button" class="btn" id="btn-summary">まとめを 見る ▶</button>' : '') +
      '</div></div>';

    $('btn-retry').addEventListener('click', function () { startStage(c.id); });
    if (nextC) $('btn-next').addEventListener('click', function () { goIntro(nextC.id); });
    if (allDone) $('btn-summary').addEventListener('click', goSummary);

    show('result');
    sound('clear');
    if (stars >= 2) confetti();
  }

  function confetti() {
    if (reducedMotion()) return;
    var box = $('confetti');
    box.innerHTML = '';
    var colors = ['#e8603c', '#2f6fdf', '#d6336c', '#2e9d5b', '#f5b700'];
    for (var i = 0; i < 48; i++) {
      var s = document.createElement('span');
      s.style.left = (Math.random() * 100) + '%';
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = (Math.random() * 0.7) + 's';
      s.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
      box.appendChild(s);
    }
    setTimeout(function () { box.innerHTML = ''; }, 3800);
  }

  /* ------------------------------------------------------------
   * まとめ
   * ------------------------------------------------------------ */
  function goSummary() {
    var S = D.summary || {};
    setTopbar({ back: { label: '国を えらぶ', action: goSelect } });

    var types = (S.types || []).map(function (t) {
      return '<li class="type" style="--c:' + esc(t.color || '#555') + '"><h3>' + rich(t.title) + '</h3>' +
        '<p class="type-who">' + rich(t.who || '') + '</p><p>' + rich(t.text) + '</p></li>';
    }).join('');

    var head = '<tr><th scope="col">ごみ</th>' + D.countries.map(function (c) {
      return '<th scope="col" style="--c:' + esc(c.color) + '">' + rich(c.short || c.name) +
        (c.place ? '<small>' + rich(c.place) + '</small>' : '') + '</th>';
    }).join('') + '</tr>';

    var rows = (S.compareItems || []).map(function (id) {
      var it = ITEM[id];
      if (!it) return '';
      return '<tr><th scope="row"><span class="rowhead">' + icon(it.icon, 'tbl-icon') + '<span>' + rich(it.name) + '</span></span></th>' +
        D.countries.map(function (c) {
          var a = it.answers[c.id];
          return '<td>' + (a ? chipHTML(c, a) : '<span class="chip chip-none">—</span>') + '</td>';
        }).join('') + '</tr>';
    }).join('');

    var think = (S.think || []).map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('');

    var el = $('screen-summary');
    el.innerHTML =
      '<div class="page">' +
      '<h1>' + rich(S.title || 'まとめ') + '</h1>' +
      (types ? '<ul class="type-list">' + types + '</ul>' : '') +
      (rows ? '<section class="card-block"><h2>' + rich(S.compareTitle || 'くらべてみよう') + '</h2>' +
        '<div class="table-wrap"><table class="compare"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div></section>' : '') +
      (think ? '<section class="think"><h2><span aria-hidden="true">💭</span> かんがえよう</h2><ol>' + think + '</ol></section>' : '') +
      '<div class="page-actions"><button type="button" class="btn btn-sub" id="btn-sum-select">国を えらぶ</button>' +
      '<button type="button" class="btn" id="btn-sum-title">タイトルへ</button></div>' +
      '</div>';
    $('btn-sum-select').addEventListener('click', goSelect);
    $('btn-sum-title').addEventListener('click', goTitle);
    show('summary');
  }

  /* ------------------------------------------------------------
   * はじめの せってい
   * ------------------------------------------------------------ */
  function init() {
    renderTitleArt();
    setupDrag();
    applySettings();

    $('btn-start').addEventListener('click', goSelect);
    $('btn-howto').addEventListener('click', howTo);
    $('btn-summary-top').addEventListener('click', goSummary);
    $('tb-back').addEventListener('click', function () { if (backAction) backAction(); });
    $('tb-help').addEventListener('click', howTo);
    $('tb-sound').addEventListener('click', function () {
      store.sound = !store.sound; saveStore(); applySettings();
      if (store.sound) sound('tap');
    });
    $('tb-ruby').addEventListener('click', function () {
      store.ruby = !store.ruby; saveStore(); applySettings();
    });

    document.addEventListener('keydown', function (e) {
      if (modal) {
        if (e.key === 'Escape' && modal.dismissible) { e.preventDefault(); closeModal(); }
        else if (e.key === 'Tab') trapTab(e);
        return;
      }
      if (state.screen === 'play' && !state.locked && !e.altKey && !e.ctrlKey && !e.metaKey && /^[1-9]$/.test(e.key)) {
        var b = state.country.bins[parseInt(e.key, 10) - 1];
        if (b) { e.preventDefault(); choose(b.id); }
      }
    });

    /* index.html#jp / #sh / #kr で その国から、#summary で まとめから はじめられる */
    var hash = (location.hash || '').replace('#', '');
    if (COUNTRY[hash]) goIntro(hash);
    else if (hash === 'summary') goSummary();
    else goTitle();
  }

  init();
})();
