/**
 * Справочник «Термины и приёмы игры»: поиск, фильтр по типу и разделу.
 * Данные — js/terms-data.js. У каждой статьи свой якорь (#t-…), чтобы
 * на термин можно было дать ссылку.
 */
(function () {
  "use strict";
  var C = window.SiteCommon;
  var GROUPS = window.TERM_GROUPS, TERMS = window.TERMS;
  var state = { kind: "all", group: "all", query: "" };
  var $ = function (id) { return document.getElementById(id); };

  // Поиск без учёта регистра, диакритики, «ё» и «ß»: «massig» найдёт «Mäßig», «cedez» — «Cédez»
  function fold(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ё/g, "е").replace(/ß/g, "ss");
  }
  function slug(t) { return "t-" + fold(t).replace(/[^a-z0-9а-я]+/g, "-").replace(/^-|-$/g, ""); }
  var seen = {};
  TERMS.forEach(function (x) {
    x.hay = fold([x.t, x.a, x.d, x.n].join(" "));
    x.id = slug(x.t);
    if (seen[x.id]) x.id += "-" + x.c; // одно слово в двух разделах (sostenuto)
    seen[x.id] = true;
  });
  var kindOf = {};
  GROUPS.forEach(function (g) { kindOf[g.id] = g.kind; });

  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  }
  function item(x) {
    return '<article class="tm-item" id="' + x.id + '">' +
      '<h3 class="tm-term">' + C.esc(x.t) +
        '<span class="tm-lang">' + C.esc(x.l) + "</span>" +
        (x.a ? '<span class="tm-abbr">' + C.esc(x.a) + "</span>" : "") +
      "</h3>" +
      '<p class="tm-def">' + C.esc(x.d) + "</p>" +
      (x.n ? '<p class="tm-note"><span>В нотах</span>' + C.esc(x.n) + "</p>" : "") +
    "</article>";
  }
  function renderGroups() {
    var list = GROUPS.filter(function (g) { return state.kind === "all" || g.kind === state.kind; });
    if (state.group !== "all" && !list.some(function (g) { return g.id === state.group; })) state.group = "all";
    $("tmGroups").innerHTML = [{ id: "all", name: "Все разделы" }].concat(list).map(function (g) {
      return '<button type="button" class="rf-chip" data-group="' + g.id + '" aria-pressed="' + (g.id === state.group) + '">' + C.esc(g.name) + "</button>";
    }).join("");
  }
  function render() {
    var q = fold(state.query.trim()), html = "", total = 0;
    GROUPS.forEach(function (g) {
      if (state.kind !== "all" && g.kind !== state.kind) return;
      if (state.group !== "all" && g.id !== state.group) return;
      var items = TERMS.filter(function (x) { return x.c === g.id && (!q || x.hay.indexOf(q) !== -1); });
      if (!items.length) return;
      total += items.length;
      html += '<section class="tm-group"><h2 class="tm-group-title">' +
        (g.kind === "tech" ? "Приёмы: " : "") + C.esc(g.name) + "<span>" + items.length + "</span></h2>" +
        items.map(item).join("") + "</section>";
    });
    $("tmCount").textContent = q || state.kind !== "all" || state.group !== "all"
      ? "Найдено " + total + " из " + TERMS.length
      : TERMS.length + " " + plural(TERMS.length, "статья", "статьи", "статей");
    $("tmList").innerHTML = html || '<p class="rf-empty">Ничего не нашлось. Попробуйте другое написание или сбросьте фильтры.</p>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    C.init();
    renderGroups();
    $("tmKinds").addEventListener("click", function (e) {
      var b = e.target.closest("[data-kind]"); if (!b) return;
      state.kind = b.getAttribute("data-kind");
      Array.prototype.forEach.call(this.children, function (c) { c.setAttribute("aria-pressed", c === b); });
      renderGroups(); render();
    });
    $("tmGroups").addEventListener("click", function (e) {
      var b = e.target.closest("[data-group]"); if (!b) return;
      state.group = b.getAttribute("data-group");
      Array.prototype.forEach.call(this.children, function (c) { c.setAttribute("aria-pressed", c === b); });
      render();
    });
    $("tmSearch").addEventListener("input", function () { state.query = this.value; render(); });
    render();
    // Ссылка вида terms.html#t-allegro — прокрутить к статье и подсветить её
    var el = location.hash && document.getElementById(location.hash.slice(1));
    if (el) {
      el.classList.add("is-target");
      // После загрузки шрифтов и мгновенно: плавный скролл на всю страницу срывается
      window.addEventListener("load", function () { el.scrollIntoView({ block: "start", behavior: "instant" }); });
    }
  });
})();
