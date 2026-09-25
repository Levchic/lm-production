(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t, esc = C.esc;

  function renderHero() {
    var d = t();
    $("#heroAnnotation").textContent = d.hero.annotation;
    $("#heroName").textContent = d.hero.name;
    $("#heroRole").textContent = d.hero.role;
    $("#heroDesc").innerHTML = C.emphasize(d.hero.description);
    $("#heroCtaPrimary").textContent = d.hero.ctaPrimary;
    $("#heroCtaSecondary").textContent = d.hero.ctaSecondary;
    $("#heroMarginNote").textContent = d.hero.marginNote;
    $("#heroMarginNote").hidden = !d.hero.marginNote;
    $("#heroPhotoCaption").textContent = d.hero.photoCaption;

    renderHeroMedia(d);
    renderHeroTicker(d);
  }

  /* ---------- Первый экран: фон и титры ----------
     Фон — одна фотография или медленная смена нескольких: слои лежат
     стопкой, видимый помечен .is-current, остальные ждут с нулевой
     прозрачностью. Список задаётся в админке; если он пуст, работает
     прежнее одиночное фото. */

  var HERO_SLIDE_MS = 7000;      /* сколько держится кадр */
  var heroReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var heroSlideTimer = 0;
  var heroSlideIndex = 0;
  var heroParallaxBound = false;

  function renderHeroMedia(d) {
    var media = $("#heroMedia");
    if (!media) return;
    var list = (d.hero.photos || []).filter(Boolean);
    if (!list.length && d.hero.photoSrc) list = [d.hero.photoSrc];

    window.clearInterval(heroSlideTimer);
    heroSlideTimer = 0;
    heroSlideIndex = 0;
    media.innerHTML = "";
    if (!list.length) return;

    list.forEach(function (src, i) {
      var img = el("img", "hero-slide" + (i === 0 ? " is-current" : ""));
      img.alt = "";
      if (i === 0) {
        img.id = "heroPhotoImg";           /* на него смотрит js/hero-cinematic.js */
        img.setAttribute("fetchpriority", "high");
      } else {
        img.loading = "lazy";
        img.decoding = "async";
      }
      img.src = src;
      media.appendChild(img);
    });

    setupHeroParallax();
    renderHeroFrames(list.length);
    if (list.length < 2 || heroReduceMotion) return;
    startHeroRotation();
  }

  /** Показать кадр n. Отсчёт до следующей смены начинается заново —
      иначе кадр, выбранный рукой, мог смениться через полсекунды. */
  function showHeroSlide(index) {
    var media = $("#heroMedia");
    if (!media || !media.children.length) return;
    var slides = media.children;
    slides[heroSlideIndex].classList.remove("is-current");
    heroSlideIndex = (index + slides.length) % slides.length;
    slides[heroSlideIndex].classList.add("is-current");
    var marks = $("#heroFrames");
    if (marks) {
      Array.prototype.forEach.call(marks.children, function (mark, i) {
        mark.classList.toggle("is-current", i === heroSlideIndex);
      });
    }
    if (heroSlideTimer) startHeroRotation();
  }

  function startHeroRotation() {
    window.clearInterval(heroSlideTimer);
    heroSlideTimer = window.setInterval(function () {
      /* во вкладке, на которую не смотрят, кадр не меняем: иначе человек
         возвращается — и кадр уже другой, без перехода */
      if (document.hidden) return;
      showHeroSlide(heroSlideIndex + 1);
    }, HERO_SLIDE_MS);
  }

  /** Метки кадров: сколько фотографий в фоне и какая сейчас. */
  function renderHeroFrames(count) {
    var marks = $("#heroFrames");
    if (!marks) return;
    marks.innerHTML = "";
    if (count < 2 || heroReduceMotion) return;
    var labels = t().hero.frameLabel || "Кадр";
    for (var i = 0; i < count; i++) {
      var b = el("button", i === 0 ? "is-current" : "");
      b.type = "button";
      b.setAttribute("aria-label", labels + " " + (i + 1));
      b.addEventListener("click", (function (index) {
        return function () { showHeroSlide(index); };
      })(i));
      marks.appendChild(b);
    }
  }

  /** Титры: дисциплины бегущей строкой. Дорожка склеена из двух
      одинаковых половин — сдвиг ровно на -50% возвращает её в начало,
      и шов не виден. */
  function renderHeroTicker(d) {
    var box = $("#heroTicker"), track = $("#heroTickerTrack");
    if (!box || !track) return;
    var words = (d.hero.ticker || []).filter(Boolean);
    var hero = box.parentNode;
    track.innerHTML = "";
    if (words.length < 2) {
      box.hidden = true;
      hero.style.setProperty("--ticker-h", "0px");   /* не занимать место */
      return;
    }
    box.hidden = false;
    hero.style.removeProperty("--ticker-h");
    for (var copy = 0; copy < 2; copy++) {
      var row = el("div", "hero-ticker-row");
      words.forEach(function (word) {
        row.appendChild(el("span", null, esc(word)));
        row.appendChild(el("b", null, "\u25C6"));
      });
      track.appendChild(row);
    }
  }

  /** Фон чуть смещается за курсором — на 16 px, не больше: он должен
      дышать, а не ездить. Плавность даёт переход в CSS, а не расчёт:
      значение просто перенацеливается на каждом кадре. */
  function setupHeroParallax() {
    if (heroParallaxBound) return;
    var hero = document.querySelector(".hero"), inner = $(".hero-media-inner");
    if (!hero || !inner) return;
    if (heroReduceMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    heroParallaxBound = true;

    var frame = 0, x = 0, y = 0;
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width - 0.5) * -16;
      y = ((e.clientY - r.top) / r.height - 0.5) * -10;
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        frame = 0;
        inner.style.transform = "translate3d(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px, 0)";
      });
    });
    hero.addEventListener("pointerleave", function () { inner.style.transform = ""; });
  }

  function renderIntroVideo() {
    var d = t();
    if (!d.introVideo || !d.introVideo.src) return;
    $("#introVideoEyebrow").textContent = d.introVideo.eyebrow;
    $("#introVideoHeading").textContent = d.introVideo.heading;
    $("#introVideoSub").textContent = d.introVideo.subheading;
    $("#introVideoPlayer").innerHTML = C.videoTile(d.introVideo.src, d.introVideo.poster, "intro-video-tile");
    $("#introVideoDigest").innerHTML = C.introDigest(d.introVideo);
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
    $("#aboutReadMore").innerHTML = C.withArrow(d.about.readMore);
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
     ["#faqBgPhoto", d.faq && d.faq.bgPhoto],
     ["#blogBgPhoto", d.blog.bgPhoto],
     ["#contactBgPhoto", d.contact.bgPhoto]].forEach(function (pair) {
      setBgPhoto(pair[0], pair[1]);
    });
  }

  function renderForWhom() {
    var d = t();
    $("#forWhomEyebrow").textContent = d.forWhom.eyebrow;
    $("#forWhomHeading").textContent = d.forWhom.heading;
    $("#forWhomSub").textContent = d.forWhom.subheading;
    // заголовок раздела выезжает оттуда же, что и строки
    var head = $("#forWhomHeading").closest(".section-head");
    if (head) head.setAttribute("data-reveal", "side");
    /* Реестр, а не сетка карточек: слева номер и «кто», справа описание и
       строка ярлыков. Те же правила, что у услуг на главной. */
    var grid = $("#forWhomGrid"); grid.innerHTML = "";
    d.forWhom.items.forEach(function (item, i) {
      var tasks = (item.tasks || []).filter(Boolean);
      var card = el("div", "whom-row reveal",
        '<span class="direction-index">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<h3>" + esc(item.title) + "</h3>" +
        "<p>" + esc(item.description) + "</p>" +
        (tasks.length
          ? '<ul class="direction-list">' + tasks.map(function (task) {
              return "<li>" + esc(task) + "</li>";
            }).join("") + "</ul>"
          : ""));
      // side — появление справа, каскадом; см. css/animations.css
      card.setAttribute("data-reveal", "side");
      card.style.setProperty("--reveal-delay", Math.min(i, 8) * 60 + "ms");
      grid.appendChild(card);
    });
  }

  /* ---------- Процесс: карточки и линия маршрута ----------
     Этапы идут змейкой, между ними прочерчивается линия со стрелкой.
     Кривые считаются по фактическому положению карточек (offsetLeft/Top —
     они, в отличие от getBoundingClientRect, не учитывают transform, а
     карточки в момент замера ещё сдвинуты анимацией появления).
     Раскладка живёт в css/styles.css: змейка на широком экране, столбик
     на узком — геометрия подстраивается сама. */

  var SVG_NS = "http://www.w3.org/2000/svg";
  var routeReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var routeObserver = null;   /* следит за въездом карточек в кадр */
  var routeDrawn = [];        /* какие связи уже прочерчены — переживает пересчёт */
  var routeSizeObserver = null;
  var routeFrame = 0;

  function renderProcess() {
    var d = t();
    $("#processEyebrow").textContent = d.process.eyebrow;
    $("#processHeading").textContent = d.process.heading;
    $("#processSub").textContent = d.process.subheading;
    var list = $("#processSteps"); list.innerHTML = "";
    routeDrawn = [];
    d.process.steps.forEach(function (step, i) {
      var li = el("li", "process-step reveal", "");
      li.setAttribute("data-reveal", "");
      li.style.setProperty("--reveal-delay", Math.min(i, 8) * 55 + "ms");
      /* Крупный контурный номер в пустой половине строки: на широком
         экране карточки иначе плавают в пустоте. Это фон, поэтому от
         скринридера он скрыт — номер уже есть в карточке. */
      li.innerHTML = '<span class="process-ghost" aria-hidden="true">' +
          String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="idx">' + String(i + 1).padStart(2, "0") + "</span>" +
        "<h3>" + esc(step.title) + "</h3><p>" + esc(step.description) + "</p>" +
        (step.result
          ? '<p class="process-result"><span>' + esc(d.process.resultLabel || "На выходе") + "</span>" +
            esc(step.result) + "</p>"
          : "");
      list.appendChild(li);
    });
    setupRoute();
  }

  /** Отступ от края карточки до середины номера: линия входит и выходит
      ровно по колонке номера, а не «где-то сбоку». */
  function stepAnchor(step) {
    var num = step.querySelector(".idx");
    if (!num) return Math.min(56, step.offsetWidth * 0.12);
    return num.offsetLeft + num.offsetWidth / 2;
  }

  function pathNode(cls, d) {
    var node = document.createElementNS(SVG_NS, "path");
    node.setAttribute("class", cls);
    node.setAttribute("d", d);
    return node;
  }

  /** Пересчитывает кривые под текущую раскладку. Уже прочерченные связи
      остаются прочерченными: пересчёт не должен выглядеть перерисовкой. */
  function drawRoute() {
    var route = $("#processRoute"), svg = $("#processRouteLine"), list = $("#processSteps");
    if (!route || !svg || !list) return;
    var steps = Array.prototype.slice.call(list.children);
    svg.innerHTML = "";
    if (steps.length < 2) return;
    svg.setAttribute("viewBox", "0 0 " + route.offsetWidth + " " + route.offsetHeight);

    for (var i = 0; i < steps.length - 1; i++) {
      var a = steps[i], b = steps[i + 1];
      /* Линия выходит и приходит по колонке номера: стрелка указывает
         ровно на «02», а не куда-то в середину грани. На узком экране,
         где карточки идут столбиком, из этого получается прямая
         вертикаль вдоль номеров. */
      var x1 = a.offsetLeft + stepAnchor(a), y1 = a.offsetTop + a.offsetHeight;
      var x2 = b.offsetLeft + stepAnchor(b), y2 = b.offsetTop;
      var k = Math.max(24, (y2 - y1) * 0.55);  /* длина ручек: чем шире шаг вбок, тем положе S */
      var line = pathNode("process-link-line",
        "M" + x1 + " " + y1 + " C" + x1 + " " + (y1 + k) + " " + x2 + " " + (y2 - k) + " " + x2 + " " + y2);
      /* касательная в конце всегда вертикальна — остриё можно не поворачивать */
      var tip = pathNode("process-link-tip",
        "M" + (x2 - 6) + " " + (y2 - 9) + " L" + x2 + " " + y2 + " L" + (x2 + 6) + " " + (y2 - 9));

      var link = document.createElementNS(SVG_NS, "g");
      link.setAttribute("class", "process-link");
      link.appendChild(line);
      link.appendChild(tip);
      svg.appendChild(link);

      line.style.setProperty("--len", line.getTotalLength());
      if (routeDrawn[i] || routeReduceMotion) link.classList.add("is-drawn");
    }
  }

  /* Пересчёты склеиваем кадром: подгрузка шрифтов и смена ширины идут
     очередью, а перерисовка нужна одна. В скрытой вкладке кадры не
     выдаются вовсе — там считаем сразу, иначе линия останется пустой
     до момента, когда на вкладку посмотрят. */
  function scheduleRoute() {
    if (document.hidden) { drawRoute(); return; }
    if (routeFrame) window.cancelAnimationFrame(routeFrame);
    routeFrame = window.requestAnimationFrame(function () { routeFrame = 0; drawRoute(); });
  }

  function markDrawn(index) {
    if (index < 0 || routeDrawn[index]) return;
    routeDrawn[index] = true;
    var link = $("#processRouteLine").children[index];
    if (link) link.classList.add("is-drawn");
  }

  function setupRoute() {
    var route = $("#processRoute"), list = $("#processSteps");
    if (!route || !list) return;
    scheduleRoute();

    /* Пересчёт при смене ширины, подгрузке шрифтов, любом изменении
       высоты блока. Сам блок от перерисовки линии не меняется — цикла нет. */
    if (!routeSizeObserver && window.ResizeObserver) {
      routeSizeObserver = new ResizeObserver(scheduleRoute);
      routeSizeObserver.observe(route);
    } else if (!routeSizeObserver) {
      window.addEventListener("resize", scheduleRoute);
      routeSizeObserver = true;
    }

    if (routeReduceMotion) return;
    var steps = Array.prototype.slice.call(list.children);
    if (routeObserver) routeObserver.disconnect();
    routeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var i = steps.indexOf(entry.target);
        markDrawn(i);      /* линия к следующей карточке — ведёт взгляд вперёд */
        markDrawn(i - 1);  /* и входящая: если страницу открыли с середины */
        routeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    steps.forEach(function (step) { routeObserver.observe(step); });
  }

  function renderPortfolioPreview() {
    var d = t();
    $("#portfolioEyebrow").textContent = d.portfolio.eyebrow;
    $("#portfolioHeading").textContent = d.portfolio.heading;
    $("#portfolioSub").textContent = d.portfolio.subheading;
    $("#portfolioViewAll").innerHTML = C.withArrow(d.portfolio.viewAll);
    var grid = $("#portfolioGrid"); grid.innerHTML = "";
    C.visibleProjects(d).slice(0, 3).forEach(function (proj, i) {
      var card = el("a", "project-card reveal", C.projectCardHTML(proj, d));
      card.href = "project.html?id=" + encodeURIComponent(proj.id);
      card.setAttribute("data-reveal", "");
      card.style.setProperty("--reveal-delay", Math.min(i, 8) * 55 + "ms");
      grid.appendChild(card);
    });
  }

  function renderServicesPreview() {
    var d = t();
    $("#servicesEyebrow").textContent = d.services.eyebrow;
    $("#servicesHeading").textContent = d.services.heading;
    $("#servicesSub").textContent = d.services.subheading;
    $("#servicesViewAll").innerHTML = C.withArrow(d.services.viewAll);
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
    var published = (d.testimonials.items || []).some(function (item) {
      return !item.status || item.status === "published";
    });
    $("#testimonials").hidden = !published;
    // карточки, карусель и форма живут в js/reviews.js
    if (window.SiteReviews) window.SiteReviews.render();
  }

  function renderFaqPreview() {
    var d = t();
    var faq = d.faq || { items: [] };
    $("#faqEyebrow").textContent = faq.eyebrow || "";
    $("#faqHeading").textContent = faq.heading || "";
    $("#faqSub").textContent = faq.subheading || "";
    $("#faqViewAll").innerHTML = C.withArrow(faq.viewAll || "");
    var list = $("#faqList"); list.innerHTML = "";
    (faq.items || []).slice(0, 5).forEach(function (item, i) {
      list.appendChild(C.faqRow(item, d, i));
    });
  }

  function renderBlogPreview() {
    var d = t();
    $("#blogEyebrow").textContent = d.blog.eyebrow;
    $("#blogHeading").textContent = d.blog.heading;
    $("#blogSub").textContent = d.blog.subheading;
    $("#blogViewAll").innerHTML = C.withArrow(d.blog.viewAll);
    var grid = $("#blogGrid"); grid.innerHTML = "";
    d.blog.posts.slice(0, 3).forEach(function (post, i) {
      grid.appendChild(C.blogCard(post, i, d));
    });
  }

  /** Приводит ссылку к узнаваемому «адресу»: @ник для Telegram и YouTube,
      домен с путём для остального. Так строка сразу читается человеком,
      а не только браузером. */
  function channelHandle(href) {
    try {
      var u = new URL(href);
      var path = u.pathname.replace(/\/+$/, "");
      var host = u.hostname.replace(/^www\./, "");
      if (host === "t.me" || host === "telegram.me") return "@" + path.replace(/^\//, "");
      if (host.indexOf("youtube.com") > -1 && path.indexOf("/@") === 0) return path.replace(/^\//, "");
      return host + path;
    } catch (e) {
      return "";
    }
  }

  function renderContact() {
    var d = t();
    var c = d.contact;
    $("#contactEyebrow").textContent = c.eyebrow;
    $("#contactHeading").textContent = c.heading;
    $("#contactSub").textContent = c.subheading;
    $("#contactDirectHeading").textContent = c.directHeading || "";
    $("#contactDirectNote").textContent = c.directNote || "";
    $("#contactDirectFoot").textContent = c.directFoot || "";

    // Почта. Если адрес в контенте не заполнен, блок просто не показываем —
    // пустая строка «Почта» без адреса выглядит как поломка.
    var mailWrap = $(".contact-mail");
    var mail = (c.email || "").trim();
    if (mailWrap) mailWrap.hidden = !mail;
    if (mail) {
      var link = $("#contactMail");
      link.textContent = mail;
      link.href = "mailto:" + mail;
      $("#contactMailLabel").textContent = c.emailLabel || "";
      $("#contactCopyLabel").textContent = c.copyLabel || "";
    }

    // Ссылки-заглушки («#» или пустой https://) в списке не показываем —
    // лучше три живые соцсети, чем шесть, половина из которых никуда не ведёт.
    var social = $("#contactSocial"); social.innerHTML = "";
    var primaryShown = false;
    (c.social || [])
      .filter(function (s) { return s.href && s.href !== "#" && !/^https?:\/\/?$/.test(s.href.trim()); })
      .forEach(function (s) {
        var handle = channelHandle(s.href);
        /* Telegram выделен как основной канал: туда пишут чаще всего и
           отвечаю там быстрее. Определяем по адресу, а не по флагу в
           контенте — админка переписывает список соцсетей и лишнее поле
           из него бы потерялось. */
        /* Бейдж — только на первой ссылке Telegram: следом идёт канал,
           а написать в канал нельзя. */
        var isPrimary = !primaryShown && /(^|\/\/)(t\.me|telegram\.me)\//i.test(s.href);
        if (isPrimary) primaryShown = true;
        var a = el("a", "social-row" + (isPrimary ? " is-primary" : ""),
          '<span class="social-icon">' + C.socialIconSVG(s.label) + "</span>" +
          '<span class="social-name">' + esc(s.label) + "</span>" +
          '<span class="social-handle">' + esc(handle) + "</span>" +
          '<span class="social-go">' + C.arrowSVG() + "</span>" +
          (isPrimary ? '<span class="social-badge">' + esc((c.primaryBadge || "")) + "</span>" : ""));
        a.href = s.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        social.appendChild(a);
      });
  }

  /** Копирование почты. Отклик обязателен: без него человек не понимает,
      сработало нажатие или нет. Подпись возвращается через 2 секунды. */
  function setupMailCopy() {
    var button = $("#contactCopy");
    var label = $("#contactCopyLabel");
    if (!button || !label) return;
    var timer = null;

    function fallbackCopy(text) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(area);
      return ok;
    }

    function done(ok) {
      var c = t().contact;
      label.textContent = ok ? (c.copiedLabel || "") : (c.copyFailLabel || "");
      button.classList.toggle("is-copied", ok);
      clearTimeout(timer);
      timer = setTimeout(function () {
        label.textContent = t().contact.copyLabel || "";
        button.classList.remove("is-copied");
      }, 2000);
    }

    button.addEventListener("click", function () {
      var mail = (t().contact.email || "").trim();
      if (!mail) return;
      // navigator.clipboard есть только в защищённом контексте (https или
      // localhost) — на всякий случай оставляем старый способ.
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(function () { done(true); }, function () { done(fallbackCopy(mail)); });
      } else {
        done(fallbackCopy(mail));
      }
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
    renderFaqPreview();
    renderBlogPreview();
    renderContact();
    // кинематографичный первый экран — только если включён флаг в js/flags.js
    if (window.SiteHeroCinematic) window.SiteHeroCinematic.render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    C.init(renderHome);
    setupMailCopy();
  });
})();
