/**
 * Мастерская (refs.html): тексты и список инструментов — из content.js
 * (раздел workshop, правится в админке). Фильтр по разделам: кнопки
 * строятся из групп, выбор живёт в адресе (refs.html#logic).
 */
(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t, esc = C.esc;

  function show(key) {
    var groups = Array.prototype.slice.call(document.querySelectorAll(".rf-group"));
    if (!groups.some(function (g) { return g.dataset.cat === key; })) key = "all";
    groups.forEach(function (g) { g.hidden = key !== "all" && g.dataset.cat !== key; });
    // Номера идут подряд по видимым пунктам: в фильтре «Logic» — 01, 02, а не 08, 09
    var n = 0;
    groups.forEach(function (g) {
      if (g.hidden) return;
      Array.prototype.forEach.call(g.querySelectorAll(".rf-hub-n"), function (node) { node.textContent = String(++n).padStart(2, "0"); });
    });
    Array.prototype.forEach.call($("#rfFilters").children, function (b) {
      var on = b.dataset.filter === key;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on);
    });
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
    var host = $("#rfGroups"); host.innerHTML = "";
    groups.forEach(function (g) {
      var box = el("div", "rf-group");
      box.dataset.cat = g.id;
      box.appendChild(el("h2", "eyebrow rf-hub-cat", esc(g.title)));
      var hub = el("div", "rf-hub");
      g.items.forEach(function (item) {
        var a = el("a", "rf-hub-item",
          '<span class="rf-hub-n"></span>' +
          '<span class="rf-hub-text"><b>' + esc(item.title) + "</b>" + esc(item.text) + "</span>" +
          '<span class="rf-hub-go" aria-hidden="true">→</span>');
        a.href = item.href;
        hub.appendChild(a);
      });
      box.appendChild(hub);
      host.appendChild(box);
    });

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
