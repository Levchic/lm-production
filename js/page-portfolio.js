(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, $all = C.$all, el = C.el, t = C.t;
  var filter = "all";

  function renderFilters() {
    var d = t();
    var wrap = $("#portfolioFilters"); wrap.innerHTML = "";
    var keysInUse = {};
    d.portfolio.projects.forEach(function (p) { keysInUse[p.category] = true; });
    d.portfolio.filters.forEach(function (f) {
      if (f.key !== "all" && !keysInUse[f.key]) return;
      var btn = el("button", "filter-btn" + (f.key === filter ? " active" : ""), C.esc(f.label));
      btn.type = "button";
      btn.setAttribute("data-filter", f.key);
      wrap.appendChild(btn);
    });
  }

  function applyFilter() {
    var shown = 0;
    $all(".project-card").forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-category") === filter;
      card.classList.toggle("hidden", !match);
      if (match) shown++;
    });
    var empty = $("#portfolioEmpty");
    if (empty) {
      empty.textContent = C.state.lang === "en" ? "Nothing in this category yet." : "В этой категории пока пусто.";
      empty.style.display = shown ? "none" : "block";
    }
  }

  function renderGrid() {
    var d = t();
    var grid = $("#portfolioGrid"); grid.innerHTML = "";
    d.portfolio.projects.forEach(function (proj, i) {
      var card = el("a", "project-card reveal", C.projectCardHTML(proj, d));
      card.href = "project.html?id=" + encodeURIComponent(proj.id);
      card.setAttribute("data-reveal", "");
      card.setAttribute("data-category", proj.category);
      card.style.transitionDelay = Math.min(i, 8) * 45 + "ms";
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
      applyFilter();
      C.initReveal();
    });
  });
})();
