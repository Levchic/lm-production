/**
 * Прайс-лист для печати (price.html). Данные — services из content.js:
 * направления и услуги, примеры бюджетов, принципы, условия, контакты.
 */
(function () {
  "use strict";
  var lang = /[?&]lang=en/.test(location.search) ? "en" : "ru";
  var d = window.SITE_CONTENT[lang];
  var s = d.services;
  document.documentElement.lang = lang;

  function esc(text) {
    return String(text == null ? "" : text).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }
  var L = lang === "en"
    ? { title: "Rates", role: "Arranger and orchestrator", examples: "Example budgets", principle: "How the price is formed", terms: "Terms", valid: "Updated" }
    : { title: "Прайс-лист", role: "Аранжировщик и оркестровщик", examples: "Примеры бюджетов", principle: "Как формируется цена", terms: "Условия работы", valid: "Обновлено в" };

  // «Обновлено в октябре 2026» — предложный падеж toLocaleDateString не умеет
  var now = new Date();
  var month = lang === "en"
    ? now.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : ["январе", "феврале", "марте", "апреле", "мае", "июне", "июле", "августе", "сентябре", "октябре", "ноябре", "декабре"][now.getMonth()] + " " + now.getFullYear();
  var telegram = (d.contact.social || []).filter(function (x) { return /t\.me\//.test(x.href); })[0];
  var contacts = ["lm-production.ru", d.contact.email, telegram ? telegram.href.replace(/^https?:\/\//, "") : ""]
    .filter(Boolean).map(esc).join('<span class="ps-dot">·</span>');

  var html = '<header class="ps-head">' +
    '<div><div class="ps-brand">' + esc(d.nav.brand) + '</div><div class="ps-name">' + esc(d.hero.name) + " — " + esc(L.role.toLowerCase()) + "</div></div>" +
    '<div class="ps-head-right"><div class="ps-title">' + esc(L.title) + '</div><div class="ps-valid">' + esc(L.valid) + " " + esc(month) + "</div></div>" +
    "</header>" +
    '<p class="ps-lead">' + esc(s.subheading) + "</p>";

  // Направления и услуги
  (s.groups || []).forEach(function (g) {
    var items = (s.items || []).filter(function (i) { return i.group === g.id; });
    if (!items.length) return;
    html += '<section class="ps-group"><h2>' + esc(g.title) + "</h2>" +
      (g.summary ? '<p class="ps-group-sum">' + esc(g.summary) + "</p>" : "") +
      '<table class="ps-table">' + items.map(function (i) {
        return "<tr><td><b>" + esc(i.title) + "</b>" + (i.description ? "<span>" + esc(i.description) + "</span>" : "") +
          '</td><td class="ps-price">' + esc(i.price) + "</td></tr>";
      }).join("") + "</table></section>";
  });

  // Принципы — коротко, в две колонки
  var p = s.pricing || {};
  if ((p.principles || []).length) {
    html += '<section class="ps-block"><h2>' + esc(p.heading || L.principle) + '</h2><div class="ps-cols">' +
      p.principles.map(function (x) { return "<div><b>" + esc(x.title) + "</b><span>" + esc(x.text) + "</span></div>"; }).join("") +
      "</div></section>";
  }

  // Примеры бюджетов
  var b = s.budgets || {};
  if ((b.items || []).length) {
    html += '<section class="ps-block ps-budgets"><h2>' + esc(b.heading || L.examples) + "</h2>" +
      (b.subheading ? '<p class="ps-group-sum">' + esc(b.subheading) + "</p>" : "") +
      '<div class="ps-cards">' + b.items.map(function (x) {
        return '<article class="ps-card"><div class="ps-card-head"><b>' + esc(x.title) + '</b><span class="ps-price">' + esc(x.price) + "</span></div>" +
          (x.summary ? "<p>" + esc(x.summary) + "</p>" : "") +
          ((x.stages || []).length ? '<p class="ps-stages">' + x.stages.map(esc).join(" · ") + "</p>" : "") +
          '<p class="ps-meta">' + (x.duration ? esc(b.durationLabel || "") + ": " + esc(x.duration) : "") +
          (x.calc ? '<span class="ps-dot">·</span>' + esc(x.calc) : "") + "</p></article>";
      }).join("") + "</div></section>";
  }

  // Условия
  var t = s.terms || {};
  if ((t.items || []).length) {
    html += '<section class="ps-block"><h2>' + esc(t.heading || L.terms) + '</h2><div class="ps-cols">' +
      t.items.map(function (x) { return "<div><b>" + esc(x.title) + "</b><span>" + esc(x.text) + "</span></div>"; }).join("") +
      "</div></section>";
  }

  html += '<footer class="ps-foot"><p>' + esc(s.note) + '</p><p class="ps-contacts">' + contacts + "</p></footer>";
  document.getElementById("sheet").innerHTML = html;
  document.title = L.title + " — " + d.hero.name;
})();
