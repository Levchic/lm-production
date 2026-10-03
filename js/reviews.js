/**
 * Отзывы: карточки и карусель.
 *
 * Отзывы хранятся там же, где весь контент — в js/content.js
 * (раздел testimonials.items). На сайте видны только те, у которых
 * status = "published"; добавляет и публикует их владелец сайта через
 * админку.
 *
 * Формы «оставить отзыв» здесь намеренно нет: сайт ничего не принимает
 * от посетителей и не собирает персональные данные.
 */
window.SiteReviews = (function () {
  "use strict";

  var C = window.SiteCommon;
  var $ = C.$, $all = C.$all, el = C.el, t = C.t, esc = C.esc;
  var carousel = null;

  /* ---------------- карточка ---------------- */

  function initials(name) {
    return String(name || "?").trim().split(/\s+/).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }

  function starsHTML(rating) {
    var value = Math.round(Number(rating) || 0);
    if (value < 1) return "";
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out += '<span class="star' + (i <= value ? " on" : "") + '">★</span>';
    }
    return '<div class="t-rating" aria-label="' + value + ' из 5">' + out + "</div>";
  }

  function sourceBadge(item, d) {
    var key = item.source || "site";
    if (key === "site") return "";
    var labels = d.testimonials.sourceLabels || {};
    return '<span class="t-source t-source--' + esc(key) + '">' + esc(labels[key] || labels.other || key) + "</span>";
  }

  function cardHTML(item, d) {
    var name = esc(item.name || "");
    var nameNode = item.profileUrl
      ? '<a class="testimonial-name" href="' + esc(item.profileUrl) + '" target="_blank" rel="noopener noreferrer nofollow">' + name + "</a>"
      : '<span class="testimonial-name">' + name + "</span>";
    var role = [item.role, item.isPlaceholder ? d.common.placeholderFlagShort : ""].filter(Boolean).join(" · ");

    return '<div class="t-head">' +
        '<div class="t-avatar">' +
          (item.avatar
            ? '<img src="' + esc(item.avatar) + '" alt="" loading="lazy">'
            : '<span>' + esc(initials(item.name)) + "</span>") +
        "</div>" +
        "<div class=\"t-who\">" + nameNode +
          (role ? '<span class="testimonial-role">' + esc(role) + "</span>" : "") +
        "</div>" +
        sourceBadge(item, d) +
      "</div>" +
      starsHTML(item.rating) +
      '<div class="quote-box"><p class="quote">' + esc(item.text || "").replace(/\n/g, "<br>") + "</p></div>" +
      '<button class="quote-more" type="button" hidden>' + esc(d.common.readFull || "Читать полностью") + "</button>" +
      '<div class="t-foot">' +
        '<span class="t-date">' + esc(item.date || "") + "</span>" +
        (item.sourceUrl
          ? '<a class="t-source-link" href="' + esc(item.sourceUrl) + '" target="_blank" rel="noopener noreferrer nofollow">' +
              C.withArrow(d.testimonials.sourceLinkLabel || "Первоисточник") + "</a>"
          : "") +
      "</div>";
  }

  /* ---------------- карусель ---------------- */

  function setupCarousel() {
    var track = $("#testimonialsTrack");
    var prev = $("#testimonialsPrev");
    var next = $("#testimonialsNext");
    var dots = $("#testimonialsDots");
    if (!track) return null;

    function cards() { return $all(".testimonial-card", track); }

    function step() {
      var list = cards();
      if (list.length < 2) return track.clientWidth;
      return list[1].offsetLeft - list[0].offsetLeft;
    }

    function activeIndex() {
      var s = step();
      return s ? Math.round(track.scrollLeft / s) : 0;
    }

    /** Сколько карточек помещается в ленту целиком — столько же «страниц» лишних. */
    function maxIndex() {
      var list = cards();
      var s = step();
      if (!s || !list.length) return 0;
      return Math.max(0, Math.ceil((track.scrollWidth - track.clientWidth) / s));
    }

    function go(index) {
      var s = step();
      track.scrollTo({ left: Math.max(0, index) * s, behavior: "smooth" });
    }

    function paint() {
      var i = activeIndex();
      var max = maxIndex();
      prev.disabled = i <= 0;
      next.disabled = i >= max;
      var hidden = max <= 0;
      prev.hidden = next.hidden = hidden;
      dots.hidden = hidden;
      $all("button", dots).forEach(function (dot, k) { dot.classList.toggle("on", k === i); });
    }

    function buildDots() {
      dots.innerHTML = "";
      var max = maxIndex();
      for (var i = 0; i <= max; i++) {
        var dot = el("button", null, "");
        dot.type = "button";
        dot.setAttribute("aria-label", "Отзыв " + (i + 1));
        (function (index) { dot.onclick = function () { go(index); }; })(i);
        dots.appendChild(dot);
      }
      paint();
    }

    prev.onclick = function () { go(activeIndex() - 1); };
    next.onclick = function () { go(activeIndex() + 1); };
    track.addEventListener("scroll", function () {
      window.clearTimeout(paint._timer);
      paint._timer = window.setTimeout(paint, 90);
    }, { passive: true });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(activeIndex() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(activeIndex() - 1); }
    });
    window.addEventListener("resize", buildDots);

    return { refresh: buildDots };
  }

  /** Длинные отзывы прячем под «Читать полностью», чтобы карточки были ровными. */
  function setupClamp(track) {
    $all(".testimonial-card", track).forEach(function (card) {
      var box = $(".quote-box", card);
      var more = $(".quote-more", card);
      if (!box || !more) return;
      if (box.scrollHeight - box.clientHeight > 4) {
        more.hidden = false;
        more.onclick = function () {
          var open = card.classList.toggle("expanded");
          more.textContent = open
            ? (t().common.hideFull || "Свернуть")
            : (t().common.readFull || "Читать полностью");
          if (carousel) carousel.refresh();
        };
      }
    });
  }

  /* ---------------- список отзывов ---------------- */

  function renderList() {
    var d = t();
    var track = $("#testimonialsTrack");
    if (!track) return;
    track.innerHTML = "";

    var published = (d.testimonials.items || []).filter(function (item) {
      return !item.status || item.status === "published";
    });

    var wrap = $("#testimonialsCarousel");
    if (!published.length) {
      if (wrap) wrap.hidden = true;
      $("#testimonialsDots").hidden = true;
      if (!$("#testimonialsEmpty")) {
        var note = el("p", "empty-note", esc(d.testimonials.emptyNote || ""));
        note.id = "testimonialsEmpty";
        wrap.parentNode.insertBefore(note, wrap);
      } else {
        $("#testimonialsEmpty").textContent = d.testimonials.emptyNote || "";
        $("#testimonialsEmpty").hidden = false;
      }
      return;
    }
    if (wrap) wrap.hidden = false;
    if ($("#testimonialsEmpty")) $("#testimonialsEmpty").hidden = true;

    published.forEach(function (item) {
      var card = el("article", "testimonial-card", cardHTML(item, d));
      track.appendChild(card);
    });

    if (!carousel) carousel = setupCarousel();
    if (carousel) carousel.refresh();
    setupClamp(track);
  }

  /** Вызывается при каждом рендере главной (в том числе при смене языка). */
  function render() {
    renderList();
  }

  return { render: render };
})();
