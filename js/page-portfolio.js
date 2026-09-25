(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, $all = C.$all, el = C.el, t = C.t;
  var filter = "all";

  function renderFilters() {
    var d = t();
    var wrap = $("#portfolioFilters"); wrap.innerHTML = "";
    var count = {};
    var projects = C.visibleProjects(d);
    projects.forEach(function (p) { count[p.category] = (count[p.category] || 0) + 1; });
    d.portfolio.filters.forEach(function (f) {
      var n = f.key === "all" ? projects.length : count[f.key];
      if (!n) return;
      var btn = el("button", "filter-btn" + (f.key === filter ? " active" : ""),
        C.esc(f.label) + '<span class="filter-count">' + n + "</span>");
      btn.type = "button";
      btn.setAttribute("data-filter", f.key);
      wrap.appendChild(btn);
    });
  }

  /**
   * @param {boolean} byClick — фильтр переключил человек. Тогда карточки
   *   показываем сразу и без каскада: он рассказывает про прокрутку, а
   *   здесь событие другое. При первой отрисовке каскад, наоборот, нужен.
   */
  function applyFilter(byClick) {
    var shown = 0;
    $all(".project-card").forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-category") === filter;
      card.classList.toggle("hidden", !match);
      if (match) {
        shown++;
        if (byClick) {
          // Скрытая фильтром карточка ни разу не попадала в поле зрения
          // наблюдателя и осталась прозрачной — показываем её сами.
          card.style.setProperty("--reveal-delay", "0ms");
          card.classList.add("in-view");
        }
      }
    });
    var empty = $("#portfolioEmpty");
    if (empty) {
      empty.textContent = C.state.lang === "en" ? "Nothing in this category yet." : "В этой категории пока пусто.";
      empty.style.display = shown ? "none" : "block";
    }
  }

  /**
   * Смена фильтра. Раньше карточки просто исчезали и появлялись — сетка
   * перескакивала, и было не понять, что убралось, а что осталось.
   * View Transitions делают перестроение сами: браузер снимает состояние
   * до и после и довозит карточки на новые места.
   * Там, где API нет или человек просил меньше движения, — как раньше.
   */
  function runFilter() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !document.startViewTransition) { applyFilter(true); return; }
    document.startViewTransition(function () { applyFilter(true); });
  }

  function renderGrid() {
    var d = t();
    var grid = $("#portfolioGrid"); grid.innerHTML = "";
    C.visibleProjects(d).forEach(function (proj, i) {
      var card = el("a", "project-card reveal", C.projectCardHTML(proj, d));
      card.href = "project.html?id=" + encodeURIComponent(proj.id);
      card.setAttribute("data-reveal", "");
      card.setAttribute("data-category", proj.category);
      // Инлайновый transitionDelay здесь раньше задавал каскад появления,
      // но заодно тормозил и наведение: у восьмой карточки отклик приходил
      // через 360 мс. Каскад теперь через переменную, она действует только
      // на появление.
      card.style.setProperty("--reveal-delay", Math.min(i, 8) * 45 + "ms");
      // Имя для View Transitions: по нему браузер узнаёт карточку
      // в состояниях «до» и «после» и переносит её, а не перерисовывает.
      card.style.viewTransitionName = "proj-" + String(proj.id).replace(/[^a-zA-Z0-9_-]/g, "-");
      grid.appendChild(card);
    });
    applyFilter();
  }

  function render() {
    var d = t();
    $("#eyebrow").textContent = d.portfolio.eyebrow;
    $("#heading").textContent = d.portfolio.heading;
    $("#sub").textContent = d.portfolio.subheading;
    renderFilters();
    renderGrid();
  }

  document.addEventListener("DOMContentLoaded", function () {
    C.init(render);
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filter = btn.getAttribute("data-filter");
      $all(".filter-btn").forEach(function (b) { b.classList.toggle("active", b === btn); });
      runFilter();
    });
  });
})();
