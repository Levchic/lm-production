(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t;

  /** Ориентиры по услугам — витрина в начале страницы. */
  function renderShowcase(d) {
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

  /** Четыре принципа, по которым складывается цена. */
  function renderPrinciples(d) {
    var p = d.services.pricing || {};
    $("#pricingEyebrow").textContent = p.eyebrow || "";
    $("#pricingHeading").textContent = p.heading || "";
    $("#pricingSub").textContent = p.subheading || "";

    var host = $("#pricingPrinciples"); host.innerHTML = "";
    (p.principles || []).forEach(function (item, i) {
      var card = el("article", "principle reveal",
        '<span class="principle-index">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<h3>" + C.esc(item.title) + "</h3>" +
        "<p>" + C.esc(item.text) + "</p>");
      card.setAttribute("data-reveal", "");
      card.style.setProperty("--reveal-delay", Math.min(i, 8) * 60 + "ms");
      host.appendChild(card);
    });
  }

  /**
   * Калькулятор. Узел #calcHost статический — js/pricing-ui.js наполняет
   * его сам и держит на нём состояние формы, поэтому пересоздавать узел
   * при смене языка нельзя.
   */
  function renderCalculator(d) {
    var c = d.services.calculator || {};
    $("#calcEyebrow").textContent = c.eyebrow || "";
    $("#calcHeading").textContent = c.heading || "";
    $("#calcSub").textContent = c.subheading || "";
    if (window.PricingUI && window.PRICING_CONFIG) window.PricingUI.mount($("#calcHost"));
  }

  /** Прикладные работы: цены живут в прайс-конфиге, рядом со ставками. */
  function renderExtras(d) {
    var e = d.services.extra || {};
    $("#extraEyebrow").textContent = e.eyebrow || "";
    $("#extraHeading").textContent = e.heading || "";
    $("#extraSub").textContent = e.subheading || "";

    var host = $("#extraList"); host.innerHTML = "";
    var lang = C.state.lang;
    ((window.PRICING_CONFIG && window.PRICING_CONFIG.extraServices) || []).forEach(function (item) {
      host.appendChild(C.priceRow({
        title: item.title[lang] || item.title.ru,
        description: item.description[lang] || item.description.ru,
        price: item.price[lang] || item.price.ru,
        bullets: []
      }, d));
    });
  }

  function renderTerms(d) {
    var terms = d.services.terms || {};
    $("#termsEyebrow").textContent = terms.eyebrow || "";
    $("#termsHeading").textContent = terms.heading || "";
    $("#termsCtaHeading").textContent = terms.ctaHeading || "";
    $("#termsCtaText").textContent = terms.ctaText || "";
    $("#termsCtaLink").textContent = terms.ctaLabel || "";

    var host = $("#termsList"); host.innerHTML = "";
    (terms.items || []).forEach(function (item, i) {
      var node = el("div", "term reveal",
        "<h3>" + C.esc(item.title) + "</h3>" +
        "<p>" + C.esc(item.text) + "</p>");
      node.setAttribute("data-reveal", "");
      node.style.setProperty("--reveal-delay", Math.min(i, 8) * 40 + "ms");
      host.appendChild(node);
    });
  }

  function render() {
    var d = t();
    renderShowcase(d);
    renderPrinciples(d);
    renderCalculator(d);
    renderExtras(d);
    renderTerms(d);
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
