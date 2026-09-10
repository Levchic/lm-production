(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t;

  function render() {
    var d = t();
    $("#eyebrow").textContent = d.services.eyebrow;
    $("#heading").textContent = d.services.heading;
    $("#sub").textContent = d.services.subheading;
    $("#note").textContent = d.services.note;

    var host = $("#servicesGroups"); host.innerHTML = "";
    C.servicesByGroup(d).forEach(function (bucket, i) {
      var block = el("section", "service-group");

      if (bucket.group) {
        block.appendChild(el("div", "service-group-head reveal",
          '<span class="service-group-index">' + String(i + 1).padStart(2, "0") + "</span>" +
          "<h2>" + C.esc(bucket.group.title) + "</h2>" +
          (bucket.group.summary ? "<p>" + C.esc(bucket.group.summary) + "</p>" : "")));
        block.lastChild.setAttribute("data-reveal", "");
      }

      var list = el("ul", "price-list");
      bucket.items.forEach(function (item) { list.appendChild(C.priceRow(item, d)); });
      block.appendChild(list);
      host.appendChild(block);
    });
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
