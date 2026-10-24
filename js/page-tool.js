/**
 * Страница плагина: переключатель ОС у кнопки скачивания.
 * По умолчанию — система посетителя; панели с data-os-panel (скачивание,
 * шаги установки) показываются только для выбранной ОС.
 */
document.addEventListener("DOMContentLoaded", function () {
  SiteCommon.init();
  var box = document.getElementById("tlDownload");
  var buttons = Array.prototype.slice.call(box.querySelectorAll(".tl-os-btn"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-os-panel]"));

  function show(os) {
    buttons.forEach(function (b) {
      var on = b.getAttribute("data-os") === os;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on);
    });
    panels.forEach(function (p) { p.hidden = p.getAttribute("data-os-panel") !== os; });
  }
  box.addEventListener("click", function (e) {
    var b = e.target.closest(".tl-os-btn");
    if (b) show(b.getAttribute("data-os"));
  });
  show(/Windows/i.test(navigator.userAgent) ? "win" : "mac");
});
