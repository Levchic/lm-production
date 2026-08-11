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
      var node = el("p", "reveal", esc(p));
      node.setAttribute("data-reveal", "");
      node.style.transitionDelay = Math.min(i, 8) * 60 + "ms";
      long.appendChild(node);
    });

    var tags = $("#tags"); tags.innerHTML = "";
    d.about.tags.forEach(function (tag) { tags.appendChild(el("span", null, esc(tag))); });

    var heroPortrait = $("#aboutHeroPortrait");
    if (d.about.portrait) {
      heroPortrait.style.backgroundImage = "url(" + d.about.portrait + ")";
      heroPortrait.style.display = "";
    } else {
      heroPortrait.style.display = "none";
    }

    $("#aboutToPortfolio").textContent = d.portfolio.viewAll + " →";
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
