(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t, esc = C.esc;

  function render() {
    var d = t();
    $("#eyebrow").textContent = d.blog.eyebrow;
    $("#heading").textContent = d.blog.heading;
    $("#sub").textContent = d.blog.subheading;
    $("#note").textContent = d.blog.note || "";

    var grid = $("#blogGrid");
    var empty = $("#blogEmpty");
    grid.innerHTML = "";

    if (!d.blog.posts.length) {
      grid.style.display = "none";
      empty.style.display = "block";
      empty.textContent = C.state.lang === "en" ? "No news yet." : "Новостей пока нет.";
      return;
    }
    grid.style.display = "";
    empty.style.display = "none";

    // первая новость — крупной карточкой на две колонки
    d.blog.posts.forEach(function (post, i) {
      var card = C.blogCard(post, i, d);
      if (i === 0) card.classList.add("is-lead");
      grid.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
