/**
 * Мастерская (refs.html): тексты и карточки инструментов — из content.js
 * (раздел workshop, правится в админке). Фильтр по разделам: кнопки
 * строятся из групп, выбор живёт в адресе (refs.html#logic).
 */
(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t, esc = C.esc;

  function show(key) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".ws-card"));
    if (!cards.some(function (c) { return c.dataset.cat === key; })) key = "all";
    cards.forEach(function (c) { c.hidden = key !== "all" && c.dataset.cat !== key; });
    Array.prototype.forEach.call($("#rfFilters").children, function (b) {
      var on = b.dataset.filter === key;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on);
    });
  }

  function card(item, group) {
    var a = el("a", "ws-card");
    a.href = item.href;
    a.dataset.cat = group.id;
    var cover = '<div class="ws-cover">' +
      (item.image ? '<img src="' + esc(item.image) + '" alt="" loading="lazy" decoding="async">' : "") +
      (item.badge ? '<span class="ws-badge">' + esc(item.badge) + "</span>" : "") + "</div>";
    var tags = (item.tags || []).filter(Boolean).map(function (tag) { return "<li>" + esc(tag) + "</li>"; }).join("");
    a.innerHTML = cover +
      '<div class="ws-body">' +
        '<span class="ws-cat">' + esc(group.title) + "</span>" +
        '<h3 class="ws-title">' + esc(item.title) + "</h3>" +
        '<p class="ws-text">' + esc(item.text) + "</p>" +
        '<div class="ws-foot"><ul class="ws-tags">' + tags + '</ul><span class="ws-go" aria-hidden="true">→</span></div>' +
      "</div>";
    return a;
  }

  function render() {
    var w = t().workshop || {};
    $("#wsEyebrow").textContent = w.eyebrow || "";
    $("#wsHeading").textContent = w.heading || "";
    $("#wsIntro").textContent = w.intro || "";
    $("#wsCtaText").textContent = w.ctaText || "";
    $("#wsCtaPrimary").textContent = w.ctaPrimary || "";
    $("#wsCtaSecondary").textContent = w.ctaSecondary || "";

    var groups = (w.groups || []).filter(function (g) { return (g.items || []).length; });
    var grid = el("div", "ws-grid");
    groups.forEach(function (g) {
      g.items.forEach(function (item) { grid.appendChild(card(item, g)); });
    });
    var host = $("#rfGroups"); host.innerHTML = "";
    host.appendChild(grid);

    var bar = $("#rfFilters"); bar.innerHTML = "";
    var total = 0;
    [{ id: "all", title: w.allLabel || "Все" }].concat(groups).forEach(function (g) {
      var n = g.id === "all" ? 0 : g.items.length;
      total += n;
      var b = el("button", "filter-btn", esc(g.title) + '<span class="filter-count"></span>');
      b.type = "button";
      b.dataset.filter = g.id;
      b.lastChild.textContent = n;
      bar.appendChild(b);
    });
    if (bar.firstChild) bar.firstChild.lastChild.textContent = total;
    show(location.hash.slice(1));
  }

  document.addEventListener("DOMContentLoaded", function () {
    C.init(render);
    $("#rfFilters").addEventListener("click", function (e) {
      var b = e.target.closest(".filter-btn");
      if (!b) return;
      show(b.dataset.filter);
      history.replaceState(null, "", b.dataset.filter === "all" ? location.pathname : "#" + b.dataset.filter);
    });
  });
})();
