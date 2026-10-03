/**
 * Справочник «Барабанные паттерны»: фильтры, плеер на Web Audio, экспорт MIDI.
 * Данные и запись MIDI — js/drum-patterns.js. Текст страницы статический
 * (ради поиска), поэтому при смене языка перерисовывать нечего.
 */
(function () {
  "use strict";
  var C = window.SiteCommon;
  var PATTERNS = window.DRUM_PATTERNS;
  var $ = function (id) { return document.getElementById(id); };

  var state = { genre: "all", moods: {}, query: "", open: null, playing: null, bpm: 90 };

  /* ---------- Звук: синтез без сэмплов ---------- */
  var ac = null;
  function ctx() {
    // Создаём по первому нажатию Play: это жест пользователя, Safari доволен
    if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    return ac;
  }
  function noise(dur) {
    var buf = ac.createBuffer(1, Math.max(1, Math.floor(ac.sampleRate * dur)), ac.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var src = ac.createBufferSource(); src.buffer = buf;
    return src;
  }
  function env(node, t, peak, dur) {
    var g = ac.createGain();
    node.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    return g;
  }
  function filtered(src, type, freq, q) {
    var f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
    src.connect(f); return f;
  }
  function osc(freq, type) { var o = ac.createOscillator(); o.frequency.value = freq; if (type) o.type = type; return o; }
  function play(node, t, dur) { node.start(t); node.stop(t + dur); }

  function kick(t) {
    var o = osc(160); o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.09);
    env(o, t, 1.1, 0.4); play(o, t, 0.41);
  }
  function snare(t) {
    var n = noise(0.18); env(filtered(n, "bandpass", 2200, 0.7), t, 0.8, 0.18); play(n, t, 0.19);
    var o = osc(195); env(o, t, 0.6, 0.1); play(o, t, 0.11);
  }
  function hat(t, open) {
    var dur = open ? 0.28 : 0.05, n = noise(dur);
    env(filtered(n, "highpass", open ? 6500 : 8500), t, open ? 0.22 : 0.16, dur * 0.88); play(n, t, dur);
  }
  function clap(t) {
    for (var i = 0; i < 3; i++) {
      var s = t + i * 0.012, n = noise(0.06);
      env(filtered(n, "bandpass", 1100, 0.5), s, 0.55, 0.07); play(n, s, 0.08);
    }
  }
  function tom(t, f) {
    var o = osc(f); o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.45, t + 0.14);
    env(o, t, 0.75, 0.28); play(o, t, 0.29);
  }
  function rim(t) { var o = osc(900); env(o, t, 0.4, 0.05); play(o, t, 0.06); }
  function cowbell(t) {
    var a = osc(562, "square"), b = osc(845, "square"), g = ac.createGain();
    a.connect(g); b.connect(g); env(g, t, 0.28, 0.32); play(a, t, 0.33); play(b, t, 0.33);
  }
  function shaker(t) { var n = noise(0.04); env(filtered(n, "highpass", 7500), t, 0.14, 0.04); play(n, t, 0.05); }

  var VOICES = {
    BD: kick, SN: snare, CL: clap, HC: clap, RS: rim, CB: cowbell, SH: shaker,
    CH: function (t) { hat(t, false); }, OH: function (t) { hat(t, true); }, CY: function (t) { hat(t, true); },
    HT: function (t) { tom(t, 520); }, MT: function (t) { tom(t, 330); }, LT: function (t) { tom(t, 185); }
  };

  /* ---------- Секвенсор: планирование с запасом, подсветка по времени звука ---------- */
  var step = 0, nextTime = 0, timer = null;
  function schedule() {
    var p = PATTERNS[state.playing];
    while (nextTime < ac.currentTime + 0.12) {
      Object.keys(p.inst).forEach(function (k) {
        if (p.inst[k].indexOf(step + 1) !== -1) (VOICES[k] || VOICES.CH)(nextTime);
      });
      highlightAt(step, nextTime);
      step = (step + 1) % 16;
      nextTime += 60 / state.bpm / 4;
    }
    timer = setTimeout(schedule, 30);
  }
  function highlightAt(s, when) {
    var id = state.playing;
    setTimeout(function () {
      if (state.playing !== id) return;
      markStep(id, s);
    }, Math.max(0, (when - ac.currentTime) * 1000));
  }
  function markStep(id, s) {
    var card = document.querySelector('.rf-card[data-id="' + id + '"]');
    if (!card) return;
    Array.prototype.forEach.call(card.querySelectorAll(".rf-cells i"), function (c) {
      c.classList.toggle("now", +c.getAttribute("data-s") === s);
    });
  }
  function stop() {
    clearTimeout(timer); timer = null;
    markStep(state.playing, -1);
    var card = document.querySelector('.rf-card[data-id="' + state.playing + '"]');
    if (card) card.classList.remove("is-playing");
    state.playing = null;
  }
  function start(id) {
    stop();
    ctx();
    state.playing = id; step = 0; nextTime = ac.currentTime + 0.06;
    var card = document.querySelector('.rf-card[data-id="' + id + '"]');
    if (card) card.classList.add("is-playing");
    schedule();
  }

  /* ---------- MIDI ---------- */
  function download(id) {
    var p = PATTERNS[id];
    var blob = new Blob([window.drumPatternToMidi(p, state.bpm)], { type: "audio/midi" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (p.name + (p.sub ? " " + p.sub : "")).replace(/[^\wа-яё\- ]/gi, "").replace(/\s+/g, "_") + "_" + state.bpm + "bpm.mid";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
  }

  /* ---------- Отрисовка ---------- */
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  }
  function grid(inst) {
    return Object.keys(inst).map(function (k) {
      var cells = "";
      for (var s = 1; s <= 16; s++) {
        var on = inst[k].indexOf(s) !== -1;
        cells += '<i class="' + (on ? "on" : "") + (on && s === 1 ? " one" : "") + '" data-s="' + (s - 1) + '"></i>';
      }
      return '<div class="rf-grid-row"><span>' + k + "</span><div class=\"rf-cells\">" + cells + "</div></div>";
    }).join("");
  }
  function matches(p) {
    if (state.genre !== "all" && p.genre !== state.genre) return false;
    var moods = Object.keys(state.moods);
    if (moods.length && !moods.some(function (m) { return m === "ab" ? !!p.sub : (p.tags || []).indexOf(m) !== -1; })) return false;
    if (state.query) {
      var hay = (p.name + " " + p.genre + " " + (p.sub || "") + " " + Object.keys(p.inst).join(" ")).toLowerCase();
      if (hay.indexOf(state.query) === -1) return false;
    }
    return true;
  }
  function render() {
    var list = [];
    PATTERNS.forEach(function (p, id) { if (matches(p)) list.push(id); });
    if (state.playing !== null && list.indexOf(state.playing) === -1) stop();

    var total = PATTERNS.length;
    $("rfCount").textContent = list.length === total
      ? total + " " + plural(total, "паттерн", "паттерна", "паттернов")
      : "Найдено " + list.length + " из " + total;

    $("rfList").innerHTML = list.length ? list.map(function (id) {
      var p = PATTERNS[id], open = state.open === id, playing = state.playing === id;
      return '<article class="rf-card' + (open ? " is-open" : "") + (playing ? " is-playing" : "") + '" data-id="' + id + '">' +
        '<button type="button" class="rf-head" data-act="toggle" aria-expanded="' + open + '">' +
          '<span class="rf-name">' + C.esc(p.name) + (p.sub ? ' <small>' + C.esc(p.sub) + "</small>" : "") + "</span>" +
          '<span class="rf-inst">' + Object.keys(p.inst).join(" · ") + "</span>" +
          '<span class="rf-genre">' + C.esc(p.genre) + "</span>" +
        "</button>" +
        (open ? '<div class="rf-body">' +
          '<div class="rf-grid">' + grid(p.inst) + "</div>" +
          '<div class="rf-actions">' +
            '<button type="button" class="rf-play" data-act="play" aria-label="' + (playing ? "Остановить" : "Слушать") + '">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon class="i-play" points="7,4 20,12 7,20"/><rect class="i-stop" x="6" y="6" width="12" height="12"/></svg>' +
            "</button>" +
            '<button type="button" class="rf-midi" data-act="midi">Скачать MIDI</button>' +
          "</div>" +
        "</div>" : "") +
      "</article>";
    }).join("") : '<p class="rf-empty">Ничего не нашлось. Уберите часть фильтров или измените запрос.</p>';
  }

  /* ---------- События ---------- */
  function setBpm(v) {
    state.bpm = Math.min(180, Math.max(60, parseInt(v, 10) || 90));
    $("rfBpm").value = state.bpm;
  }
  function setup() {
    var genres = [];
    PATTERNS.forEach(function (p) { if (genres.indexOf(p.genre) === -1) genres.push(p.genre); });
    $("rfGenres").innerHTML = ["all"].concat(genres).map(function (g) {
      return '<button type="button" class="rf-chip" data-genre="' + C.esc(g) + '" aria-pressed="' + (g === "all") + '">' + (g === "all" ? "Все жанры" : C.esc(g)) + "</button>";
    }).join("");

    $("rfGenres").addEventListener("click", function (e) {
      var b = e.target.closest("[data-genre]"); if (!b) return;
      state.genre = b.getAttribute("data-genre");
      Array.prototype.forEach.call(this.children, function (c) { c.setAttribute("aria-pressed", c === b); });
      render();
    });
    $("rfMoods").addEventListener("click", function (e) {
      var b = e.target.closest("[data-mood]"); if (!b) return;
      var m = b.getAttribute("data-mood");
      if (state.moods[m]) delete state.moods[m]; else state.moods[m] = true;
      b.setAttribute("aria-pressed", !!state.moods[m]);
      render();
    });
    $("rfSearch").addEventListener("input", function () { state.query = this.value.toLowerCase().trim(); render(); });
    $("rfBpm").addEventListener("change", function () { setBpm(this.value); });
    $("rfBpmDown").addEventListener("click", function () { setBpm(state.bpm - 5); });
    $("rfBpmUp").addEventListener("click", function () { setBpm(state.bpm + 5); });

    $("rfList").addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b) return;
      var id = +b.closest(".rf-card").getAttribute("data-id"), act = b.getAttribute("data-act");
      if (act === "toggle") {
        state.open = state.open === id ? null : id;
        if (state.playing !== null && state.playing !== state.open) stop();
        render();
      } else if (act === "play") {
        if (state.playing === id) stop(); else start(id);
        b.setAttribute("aria-label", state.playing === id ? "Остановить" : "Слушать");
      } else if (act === "midi") {
        download(id);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.playing !== null) stop();
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(); setup(); });
})();
