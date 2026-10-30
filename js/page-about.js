(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t, esc = C.esc;

  function render() {
    var d = t();
    $("#eyebrow").textContent = d.about.eyebrow;
    $("#heading").textContent = d.about.heading;

    var intro = $("#intro"); intro.innerHTML = "";
    d.about.paragraphs.forEach(function (p) { intro.appendChild(el("p", null, esc(p))); });

    var long = $("#longParagraphs"); long.innerHTML = "";
    d.about.long.forEach(function (p, i) {
      // «## Заголовок» — подзаголовок, **текст** — выделение
      var head = /^##\s/.test(p);
      var node = el(head ? "h3" : "p", head ? "reveal about-subhead" : "reveal", head ? esc(p.slice(3)) : C.emphasize(p));
      node.setAttribute("data-reveal", "");
      node.style.setProperty("--reveal-delay", Math.min(i, 8) * 60 + "ms");
      long.appendChild(node);
    });

    var gallery = $("#aboutGallery"); gallery.innerHTML = "";
    (d.about.gallery || []).filter(Boolean).forEach(function (src, i) {
      var img = el("img", i === 0 ? "is-current" : "");
      img.src = src; img.alt = ""; img.decoding = "async";
      gallery.appendChild(img);
    });
    syncGallery();

    var tags = $("#tags"); tags.innerHTML = "";
    d.about.tags.forEach(function (tag) { tags.appendChild(el("span", null, esc(tag))); });

    var heroPortrait = $("#aboutHeroPortrait");
    if (d.about.portrait) {
      heroPortrait.style.backgroundImage = "url(" + d.about.portrait + ")";
      heroPortrait.style.display = "";
    } else {
      heroPortrait.style.display = "none";
    }

    $("#aboutToPortfolio").innerHTML = C.withArrow(d.portfolio.viewAll);
  }

  /* Кадр в рамке рядом с текстом: номер последнего подзаголовка, который
     читатель уже прошёл (поднялся выше 40% экрана), по кругу. */
  var galleryIndex = -1;
  function syncGallery() {
    var imgs = $("#aboutGallery").children;
    if (!imgs.length) return;
    var heads = document.querySelectorAll("#longParagraphs .about-subhead");
    var line = window.innerHeight * 0.4, passed = 0;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top < line) passed = i;
    }
    var next = passed % imgs.length;
    if (next === galleryIndex && imgs[next].classList.contains("is-current")) return;
    for (var j = 0; j < imgs.length; j++) imgs[j].classList.toggle("is-current", j === next);
    galleryIndex = next;
  }
  window.addEventListener("scroll", syncGallery, { passive: true });

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
