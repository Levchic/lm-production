/**
 * Страница «Частые вопросы»: полный список вопросов и ответов.
 * На главной живут только первые пять — см. renderFaqPreview в page-home.js.
 */
(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, t = C.t;

  /**
   * Разметка FAQPage для поисковиков: ответы попадают в выдачу прямо под
   * ссылкой на сайт. Пересобирается при смене языка, поэтому старый блок
   * каждый раз удаляем.
   */
  function renderSchema(items) {
    var old = document.getElementById("faqSchema");
    if (old) old.remove();
    if (!items.length) return;

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faqSchema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map(function (item) {
        return {
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        };
      })
    });
    document.head.appendChild(script);
  }

  function render() {
    var d = t();
    var faq = d.faq || { items: [] };
    $("#eyebrow").textContent = faq.eyebrow || "";
    $("#heading").textContent = faq.heading || "";
    $("#sub").textContent = faq.subheading || "";
    $("#note").textContent = faq.note || "";

    var items = faq.items || [];
    var list = $("#faqList"); list.innerHTML = "";
    items.forEach(function (item, i) { list.appendChild(C.faqRow(item, d, i)); });
    renderSchema(items);
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
