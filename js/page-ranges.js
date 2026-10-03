/**
 * Справочник диапазонов: таблица диапазонов на оси-клавиатуре.
 * Данные и названия нот — js/ranges-data.js. Ось — 88 клавиш, A0 (21) … C8 (108).
 */
(function () {
  "use strict";
  var C = window.SiteCommon, N = window.RangeNotes;
  var LO = 21, HI = 108, KEYS = HI - LO + 1;
  var state = { fam: "all", note: null, open: null };
  var $ = function (id) { return document.getElementById(id); };
  var pct = function (m) { return ((m - LO) / KEYS * 100).toFixed(3) + "%"; };
  var span = function (a, b) { return ((b - a + 1) / KEYS * 100).toFixed(3) + "%"; };
  var label = function (m) { return N.sci(m) + " (" + N.ru(m) + ")"; };

  /* ---------- Звук: простой тон по нажатию ---------- */
  var ac = null;
  function tone(m) {
    if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = "triangle"; o.frequency.value = N.hz(m);
    o.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    o.start(t); o.stop(t + 1.25);
  }

  /* ---------- Отрисовка ---------- */
  function zone(r, m) {
    if (m === null) return "";
    if (m >= r.clo && m <= r.chi) return "comf";
    if (m >= r.lo && m <= r.hi) return "edge";
    return "out";
  }
  function axis() {
    var keys = "", labels = "";
    for (var m = LO; m <= HI; m++) {
      keys += '<i class="' + (N.isBlack(m) ? "b" : "w") + (m === state.note ? " sel" : "") + '" data-note="' + m + '" title="' + label(m) + '"></i>';
      if (m % 12 === 0) labels += '<span style="left:' + pct(m) + '">' + N.sci(m) + "</span>";
    }
    return '<div class="rg-row rg-axis"><div class="rg-label"></div><div class="rg-track"><div class="rg-keys">' + keys + '</div><div class="rg-oct">' + labels + "</div></div></div>";
  }
  function details(r) {
    var wr = r.tr ? "<dt>Запись</dt><dd>" + N.sci(r.lo + r.tr) + " — " + N.sci(r.hi + r.tr) + "</dd>" : "";
    return '<div class="rg-details">' +
      "<dl>" +
        "<dt>Звучит</dt><dd>" + label(r.lo) + " — " + label(r.hi) + "</dd>" +
        "<dt>Удобно</dt><dd>" + N.sci(r.clo) + " — " + N.sci(r.chi) + "</dd>" + wr +
        "<dt>Транспозиция</dt><dd>" + N.transposition(r.tr) + "</dd>" +
        "<dt>Ключ</dt><dd>" + C.esc(r.clef) + "</dd>" +
      "</dl>" +
      "<p>" + C.esc(r.note) + "</p>" +
    "</div>";
  }
  function row(r) {
    var z = zone(r, state.note), open = state.open === r.id;
    return '<div class="rg-row' + (z ? " is-" + z : "") + (open ? " is-open" : "") + '" data-id="' + r.id + '">' +
      '<button type="button" class="rg-label" data-act="open" aria-expanded="' + open + '">' +
        "<span>" + C.esc(r.name) + "</span><small>" + C.esc(r.abbr) + "</small>" +
      "</button>" +
      '<div class="rg-track" data-act="pick">' +
        '<span class="rg-full" style="left:' + pct(r.lo) + ";width:" + span(r.lo, r.hi) + '"></span>' +
        '<span class="rg-comf" style="left:' + pct(r.clo) + ";width:" + span(r.clo, r.chi) + '"></span>' +
        (z === "edge" ? '<em class="rg-tag" style="left:' + pct(state.note) + '">на краю</em>' : "") +
      "</div>" +
    "</div>" + (open ? details(r) : "");
  }
  function render() {
    var list = window.RANGES.filter(function (r) { return state.fam === "all" || r.fam === state.fam; });
    var grid = "";
    for (var m = 24; m <= HI; m += 12) grid += '<i style="left:' + pct(m) + '"></i>';
    var line = state.note !== null ? '<b style="left:calc(' + pct(state.note) + " + " + (50 / KEYS).toFixed(3) + '%)"></b>' : "";
    $("rgChart").innerHTML = axis() + list.map(row).join("") + '<div class="rg-overlay" aria-hidden="true">' + grid + line + "</div>";
    readout(list);
  }
  function readout(list) {
    if (state.note === null) return;
    var m = state.note, n = { comf: 0, edge: 0, out: 0 };
    list.forEach(function (r) { n[zone(r, m)]++; });
    $("rgReadout").innerHTML = "<b>" + N.sci(m) + "</b> " + N.ru(m) + " · " + Math.round(N.hz(m) * 10) / 10 + " Гц" +
      '<span class="rg-counts"><span class="c">удобно ' + n.comf + "</span><span>на краю " + n.edge + '</span><span class="o">недоступно ' + n.out + "</span></span>";
  }

  /* ---------- События ---------- */
  function noteFromEvent(e, track) {
    var rect = track.getBoundingClientRect();
    var m = LO + Math.floor((e.clientX - rect.left) / rect.width * KEYS);
    return Math.max(LO, Math.min(HI, m));
  }
  function pick(m) { state.note = m; tone(m); render(); }

  document.addEventListener("DOMContentLoaded", function () {
    C.init();
    $("rgFams").innerHTML = [{ id: "all", name: "Все" }].concat(window.RANGE_FAMILIES).map(function (f) {
      return '<button type="button" class="rf-chip" data-fam="' + f.id + '" aria-pressed="' + (f.id === "all") + '">' + f.name + "</button>";
    }).join("");
    $("rgFams").addEventListener("click", function (e) {
      var b = e.target.closest("[data-fam]"); if (!b) return;
      state.fam = b.getAttribute("data-fam");
      Array.prototype.forEach.call(this.children, function (c) { c.setAttribute("aria-pressed", c === b); });
      render();
    });
    $("rgChart").addEventListener("click", function (e) {
      var key = e.target.closest("[data-note]");
      if (key) { pick(+key.getAttribute("data-note")); return; }
      var open = e.target.closest('[data-act="open"]');
      if (open) {
        var id = open.closest(".rg-row").getAttribute("data-id");
        state.open = state.open === id ? null : id;
        render(); return;
      }
      var track = e.target.closest('[data-act="pick"]');
      if (track) pick(noteFromEvent(e, track));
    });
    // Стрелки ← → двигают выбранную ноту по полутонам
    document.addEventListener("keydown", function (e) {
      if (state.note === null || e.target.closest("input, textarea")) return;
      if (e.key === "ArrowLeft" && state.note > LO) { e.preventDefault(); pick(state.note - 1); }
      if (e.key === "ArrowRight" && state.note < HI) { e.preventDefault(); pick(state.note + 1); }
    });
    render();
  });
})();
