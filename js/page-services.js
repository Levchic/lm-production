(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, t = C.t;

  function render() {
    var d = t();
    $("#eyebrow").textContent = d.services.eyebrow;
    $("#heading").textContent = d.services.heading;
    $("#sub").textContent = d.services.subheading;
    $("#note").textContent = d.services.note;

    var grid = $("#servicesGrid"); grid.innerHTML = "";
    d.services.items.forEach(function (item, i) {
      grid.appendChild(C.serviceCard(item, i, d));
    });
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
