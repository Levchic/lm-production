(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t, esc = C.esc;

  function renderHero() {
    var d = t();
    $("#heroAnnotation").textContent = d.hero.annotation;
    $("#heroName").textContent = d.hero.name;
    $("#heroRole").textContent = d.hero.role;
    $("#heroDesc").textContent = d.hero.description;
    $("#heroCtaPrimary").textContent = d.hero.ctaPrimary;
    $("#heroCtaSecondary").textContent = d.hero.ctaSecondary;
    $("#heroMarginNote").textContent = d.hero.marginNote;
    $("#heroPhotoCaption").textContent = d.hero.photoCaption;

    var heroImg = $("#heroPhotoImg");
    if (d.hero.photoSrc) {
      heroImg.src = d.hero.photoSrc;
      heroImg.style.display = "block";
    } else {
      heroImg.removeAttribute("src");
      heroImg.style.display = "none";
    }
  }

  function renderIntroVideo() {
    var d = t();
    if (!d.introVideo || !d.introVideo.src) return;
    $("#introVideoEyebrow").textContent = d.introVideo.eyebrow;
    $("#introVideoHeading").textContent = d.introVideo.heading;
    $("#introVideoSub").textContent = d.introVideo.subheading;
    $("#introVideoPlayer").innerHTML = C.videoTile(d.introVideo.src, d.introVideo.poster, "intro-video-tile");
  }

  function renderAbout() {
    var d = t();
    $("#aboutEyebrow").textContent = d.about.eyebrow;
    $("#aboutHeading").textContent = d.about.heading;
    var p = $("#aboutParagraphs"); p.innerHTML = "";
    d.about.paragraphs.forEach(function (text) { p.appendChild(el("p", null, esc(text))); });

    var portrait = $("#aboutPortrait");
    if (d.about.portrait) {
      portrait.style.backgroundImage = "url(" + d.about.portrait + ")";
      portrait.style.display = "";
    } else {
      portrait.style.display = "none";
    }
    var tags = $("#aboutTags"); tags.innerHTML = "";
    d.about.tags.forEach(function (tag) { tags.appendChild(el("span", null, esc(tag))); });
    $("#aboutReadMore").textContent = d.about.readMore + " →";
  }

  /**
   * Фон раздела: если в админке задано фото — показываем его и прячем
   * световые пятна; если поле пустое — раздел остаётся однотонным с пятнами.
   */
  function setBgPhoto(id, src) {
    var node = $(id);
    if (!node) return;
    var section = node.parentElement;
    var glow = section.querySelector(".glow-field");
    if (src) {
      node.style.backgroundImage = "url(" + src + ")";
      node.style.display = "";
      section.classList.add("section--photo");
      if (glow) glow.style.display = "none";
    } else {
      node.style.backgroundImage = "";
      node.style.display = "none";
      section.classList.remove("section--photo");
      if (glow) glow.style.display = "";
    }
  }

  function renderSectionBackgrounds() {
    var d = t();
    [["#introVideoBgPhoto", d.introVideo && d.introVideo.bgPhoto],
     ["#aboutBgPhoto", d.about.bgPhoto],
     ["#forWhomBgPhoto", d.forWhom.bgPhoto],
     ["#processBgPhoto", d.process.bgPhoto],
     ["#portfolioBgPhoto", d.portfolio.bgPhoto],
     ["#servicesBgPhoto", d.services.bgPhoto],
     ["#testimonialsBgPhoto", d.testimonials.bgPhoto],
     ["#blogBgPhoto", d.blog.bgPhoto],
     ["#faqBgPhoto", d.faq && d.faq.bgPhoto],
     ["#contactBgPhoto", d.contact.bgPhoto]].forEach(function (pair) {
      setBgPhoto(pair[0], pair[1]);
    });
  }

  function renderForWhom() {
    var d = t();
    $("#forWhomEyebrow").textContent = d.forWhom.eyebrow;
    $("#forWhomHeading").textContent = d.forWhom.heading;
    $("#forWhomSub").textContent = d.forWhom.subheading;
    var grid = $("#forWhomGrid"); grid.innerHTML = "";
    d.forWhom.items.forEach(function (item, i) {
      var card = el("div", "for-whom-card reveal", "<h3>" + esc(item.title) + "</h3><p>" + esc(item.description) + "</p>");
      card.setAttribute("data-reveal", "");
      card.style.transitionDelay = (i * 60) + "ms";
      grid.appendChild(card);
    });
  }

  function renderProcess() {
    var d = t();
    $("#processEyebrow").textContent = d.process.eyebrow;
    $("#processHeading").textContent = d.process.heading;
    $("#processSub").textContent = d.process.subheading;
    var list = $("#processSteps"); list.innerHTML = "";
    d.process.steps.forEach(function (step, i) {
      var li = el("li", "process-step reveal", "");
      li.setAttribute("data-reveal", "");
      li.style.transitionDelay = (i * 55) + "ms";
      li.innerHTML = '<div class="idx">' + String(i + 1).padStart(2, "0") + "</div>" +
        "<div><h3>" + esc(step.title) + "</h3><p>" + esc(step.description) + "</p></div>";
      list.appendChild(li);
    });
  }

  function renderPortfolioPreview() {
    var d = t();
    $("#portfolioEyebrow").textContent = d.portfolio.eyebrow;
    $("#portfolioHeading").textContent = d.portfolio.heading;
    $("#portfolioSub").textContent = d.portfolio.subheading;
    $("#portfolioViewAll").textContent = d.portfolio.viewAll + " →";
    var grid = $("#portfolioGrid"); grid.innerHTML = "";
    d.portfolio.projects.slice(0, 3).forEach(function (proj, i) {
      var card = el("a", "project-card reveal", C.projectCardHTML(proj, d));
      card.href = "project.html?id=" + encodeURIComponent(proj.id);
      card.setAttribute("data-reveal", "");
      card.style.transitionDelay = (i * 55) + "ms";
      grid.appendChild(card);
    });
  }

  function renderServicesPreview() {
    var d = t();
    $("#servicesEyebrow").textContent = d.services.eyebrow;
    $("#servicesHeading").textContent = d.services.heading;
    $("#servicesSub").textContent = d.services.subheading;
    $("#servicesViewAll").textContent = d.services.viewAll + " →";
    // На главной — направления целиком, а не первые три услуги из семи:
    // выборка «первых трёх» читалась как случайная.
    var grid = $("#servicesGrid"); grid.innerHTML = "";
    C.servicesByGroup(d).forEach(function (bucket, i) {
      if (!bucket.group) return;
      grid.appendChild(C.directionCard(bucket, i, d));
    });
  }

  function renderTestimonials() {
    var d = t();
    $("#testimonialsEyebrow").textContent = d.testimonials.eyebrow;
    $("#testimonialsHeading").textContent = d.testimonials.heading;
    $("#testimonialsSub").textContent = d.testimonials.subheading;
    // карточки, карусель и форма живут в js/reviews.js
    if (window.SiteReviews) window.SiteReviews.render();
  }

  function renderBlogPreview() {
    var d = t();
    $("#blogEyebrow").textContent = d.blog.eyebrow;
    $("#blogHeading").textContent = d.blog.heading;
    $("#blogSub").textContent = d.blog.subheading;
    $("#blogViewAll").textContent = d.blog.viewAll + " →";
    var grid = $("#blogGrid"); grid.innerHTML = "";
    d.blog.posts.slice(0, 3).forEach(function (post, i) {
      grid.appendChild(C.blogCard(post, i, d));
    });
  }

  /** На главной — первые пять вопросов, остальные на faq.html. */
  function renderFaqPreview() {
    var d = t();
    if (!d.faq) return;
    $("#faqEyebrow").textContent = d.faq.eyebrow;
    $("#faqHeading").textContent = d.faq.heading;
    $("#faqSub").textContent = d.faq.subheading;
    $("#faqViewAll").textContent = d.faq.viewAll + " →";
    var list = $("#faqList"); list.innerHTML = "";
    (d.faq.items || []).slice(0, 5).forEach(function (item, i) {
      list.appendChild(C.faqRow(item, d, i));
    });
  }

  function renderContact() {
    var d = t();
    $("#contactEyebrow").textContent = d.contact.eyebrow;
    $("#contactHeading").textContent = d.contact.heading;
    $("#contactSub").textContent = d.contact.subheading;
    var l = d.contact.formLabels;
    $("#labelName").textContent = l.name;
    $("#labelContact").textContent = l.contact;
    $("#labelType").textContent = l.type;
    $("#labelMessage").textContent = l.message;
    // «политика конфиденциальности» в тексте согласия — сразу ссылкой
    $("#labelConsent").innerHTML = esc(l.consent || "").replace(
      /(политикой конфиденциальности|privacy policy)/i,
      '<a href="privacy.html" target="_blank" rel="noopener">$1</a>');
    $("#formSubmit").textContent = l.submit;
    $("#formNote").textContent = d.contact.formNote;
    var select = $("#fieldType"); select.innerHTML = "";
    l.typeOptions.forEach(function (opt) { var o = el("option", null, esc(opt)); o.value = opt; select.appendChild(o); });
    $("#contactDirectHeading").textContent = d.contact.directHeading || "";
    $("#contactDirectNote").textContent = d.contact.directNote || "";
    $("#contactDirectFoot").textContent = d.contact.directFoot || "";

    // Ссылки-заглушки («#» или пустой https://) в списке не показываем —
    // лучше три живые соцсети, чем шесть, половина из которых никуда не ведёт.
    var social = $("#contactSocial"); social.innerHTML = "";
    d.contact.social
      .filter(function (s) { return s.href && s.href !== "#" && !/^https?:\/\/?$/.test(s.href.trim()); })
      .forEach(function (s) {
        var a = el("a", "social-row",
          '<span class="social-icon">' + C.socialIconSVG(s.label) + "</span>" +
          '<span class="social-name">' + esc(s.label) + "</span>" +
          '<span class="social-go" aria-hidden="true">→</span>');
        a.href = s.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        social.appendChild(a);
      });
  }

  function renderHome() {
    renderSectionBackgrounds();
    renderHero();
    renderIntroVideo();
    renderAbout();
    renderForWhom();
    renderProcess();
    renderPortfolioPreview();
    renderServicesPreview();
    renderTestimonials();
    renderBlogPreview();
    renderFaqPreview();
    renderContact();
    // кинематографичный первый экран — только если включён флаг в js/flags.js
    if (window.SiteHeroCinematic) window.SiteHeroCinematic.render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    C.init(renderHome);
    // Заявка уходит в Telegram через send.php: на сайте ничего не хранится
    var form = $("#contactForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var d = t();
        var note = $("#formNote");
        var button = $("#formSubmit");
        var en = C.state.lang === "en";

        var payload = {
          type: "lead",
          name: $("#fieldName").value.trim(),
          contact: $("#fieldContact").value.trim(),
          service: $("#fieldType").value,
          message: $("#fieldMessage").value.trim(),
          consent: $("#fieldConsent").checked,
          website: $("#fieldSite").value,   // ловушка для ботов
          lang: C.state.lang
        };
        if (!payload.name || !payload.contact || !payload.message || !payload.consent) {
          note.textContent = en
            ? "Please fill in your name, contact, task description and tick the consent box."
            : "Заполните имя, контакт, описание задачи и отметьте согласие.";
          note.style.color = "var(--copper)";
          return;
        }

        button.disabled = true;
        note.textContent = en ? "Sending…" : "Отправляю…";
        note.style.color = "var(--mute)";

        fetch("send.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) { return res.json().then(function (data) { return { ok: res.ok && data.ok, data: data }; }); })
          .then(function (r) {
            if (!r.ok) throw new Error((r.data && r.data.error) || "error");
            form.reset();
            note.textContent = en
              ? "Thank you! The message has been sent — I'll get back to you shortly."
              : "Спасибо! Заявка отправлена — отвечу в ближайшее время.";
            note.style.color = "var(--bone-dim)";
          })
          .catch(function () {
            note.textContent = en
              ? "The message could not be sent. Please write via Telegram or VK — links are on the right."
              : "Не получилось отправить. Напишите, пожалуйста, в Telegram или ВКонтакте — ссылки справа.";
            note.style.color = "var(--copper)";
          })
          .then(function () { button.disabled = false; });
      });
    }
  });
})();
