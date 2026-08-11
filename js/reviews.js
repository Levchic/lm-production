/**
 * Отзывы: карточки, карусель и форма «оставить отзыв».
 *
 * Отзывы хранятся там же, где весь контент — в js/content.js
 * (раздел testimonials.items). На сайте видны только те, у которых
 * status = "published"; форма присылает новый отзыв со статусом "pending",
 * и он появляется в админке в разделе «Отзывы».
 *
 * Отправка идёт на send.php: он ничего не хранит, а сразу пересылает отзыв
 * в Telegram. Оттуда отзыв переносится на сайт через админку — так на сервере
 * не накапливаются чужие персональные данные.
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
              esc(d.testimonials.sourceLinkLabel || "Первоисточник") + " →</a>"
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

  /* ---------------- форма ---------------- */

  var formState = { rating: 0 };

  function renderRatingInput() {
    var box = $("#reviewRating");
    if (!box) return;
    box.innerHTML = "";
    for (var i = 1; i <= 5; i++) {
      var star = el("button", "star-btn" + (i <= formState.rating ? " on" : ""), "★");
      star.type = "button";
      star.setAttribute("aria-label", i + " / 5");
      (function (value) {
        star.onclick = function () {
          formState.rating = formState.rating === value ? 0 : value;
          renderRatingInput();
        };
      })(i);
      box.appendChild(star);
    }
  }

  function renderForm() {
    var d = t();
    var f = d.testimonials.form || {};
    $("#reviewOpen").textContent = d.testimonials.addLabel || f.heading || "";
    $("#reviewFormHeading").textContent = f.heading || "";
    $("#reviewFormSub").textContent = f.sub || "";
    $("#reviewNameLabel").textContent = f.name || "";
    $("#reviewName").placeholder = f.namePlaceholder || "";
    $("#reviewRoleLabel").textContent = f.role || "";
    $("#reviewProfileLabel").textContent = f.profile || "";
    $("#reviewProfileHint").textContent = f.profileHint || "";
    $("#reviewVkBtn").textContent = f.vkButton || "";
    $("#reviewTgBtn").textContent = f.tgButton || "";
    $("#reviewRatingLabel").textContent = f.rating || "";
    $("#reviewTextLabel").textContent = f.text || "";
    $("#reviewConsentLabel").innerHTML = esc(f.consent || "") +
      ' <a href="privacy.html" target="_blank" rel="noopener">' +
      esc(C.state.lang === "en" ? "Privacy policy" : "Политика конфиденциальности") + "</a>";
    $("#reviewSubmit").textContent = f.submit || "";
    $("#reviewCancel").textContent = f.cancel || "";
    renderRatingInput();
  }

  function note(text, isError) {
    var node = $("#reviewNote");
    node.textContent = text;
    node.style.color = isError ? "var(--copper)" : "var(--bone-dim)";
  }

  function openForm(open) {
    var wrap = $("#reviewFormWrap");
    wrap.hidden = !open;
    $("#reviewOpen").hidden = open;
    if (open) $("#reviewName").focus();
  }

  function prefillProfile(prefix) {
    var input = $("#reviewProfile");
    if (!input.value || /^https:\/\/(vk\.com|t\.me)\/?$/.test(input.value)) input.value = prefix;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function submitForm(e) {
    e.preventDefault();
    var d = t();
    var f = d.testimonials.form || {};

    var payload = {
      type: "review",
      name: $("#reviewName").value.trim(),
      role: $("#reviewRole").value.trim(),
      profileUrl: $("#reviewProfile").value.trim(),
      rating: formState.rating,
      text: $("#reviewText").value.trim(),
      consent: $("#reviewConsent").checked,
      website: $("#reviewHp").value,   // ловушка для ботов, проверяет сервер
      lang: C.state.lang
    };
    if (!payload.name || !payload.text || !payload.consent) {
      note(f.required || "", true);
      return;
    }

    var button = $("#reviewSubmit");
    button.disabled = true;
    note("…");

    fetch("send.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.data && r.data.error ? r.data.error : "error");
        $("#reviewForm").reset();
        formState.rating = 0;
        renderRatingInput();
        note(f.success || "");
        window.setTimeout(function () { openForm(false); note(""); }, 4000);
      })
      .catch(function () { note(f.error || "", true); })
      .then(function () { button.disabled = false; });
  }

  function setupForm() {
    if (!$("#reviewForm")) return;
    $("#reviewOpen").onclick = function () { openForm(true); };
    $("#reviewCancel").onclick = function () { openForm(false); note(""); };
    $("#reviewVkBtn").onclick = function () { prefillProfile("https://vk.com/"); };
    $("#reviewTgBtn").onclick = function () { prefillProfile("https://t.me/"); };
    $("#reviewForm").addEventListener("submit", submitForm);
  }

  /** Вызывается при каждом рендере главной (в том числе при смене языка). */
  function render() {
    renderList();
    renderForm();
  }

  document.addEventListener("DOMContentLoaded", setupForm);

  return { render: render };
})();
