/**
 * Общая логика для всех страниц: язык (с сохранением в localStorage),
 * рендер шапки/подвала из content.js, скролл-эффекты, зерно-текстура,
 * плитки фото/видео/аудио и лайтбокс.
 * Конкретный контент каждой страницы рендерят js/page-*.js.
 */
window.SiteCommon = (function () {
  "use strict";

  var LANG_KEY = "site-lang";
  var NAV_BREAKPOINT = 1024;
  var state = { lang: localStorage.getItem(LANG_KEY) || "ru" };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pageRenderFn = null;
  var revealObserver = null;
  var glowFields = [];
  var photoLayers = [];
  var lightbox = { node: null, items: [], index: 0 };

  function t() { return window.SITE_CONTENT[state.lang]; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) { return acc && acc[key] !== undefined ? acc[key] : ""; }, obj);
  }
  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  /**
   * Выделение куска текста жирным — звёздочками, как в мессенджерах:
   *   «полный цикл **от идеи до концертных партий.**»
   * Текст сначала экранируется, поэтому вставить через админку разметку
   * или скрипт нельзя — только это выделение.
   */
  function emphasize(text) {
    return esc(text || "").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function esc(str) {
    return String(str === undefined || str === null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function currentPage() {
    var file = location.pathname.split("/").pop();
    return file === "" ? "index.html" : file;
  }

  /* ---------- Простой data-bind по тексту/атрибутам ---------- */
  function bindTexts(root) {
    var data = t();
    $all("[data-bind]", root).forEach(function (node) {
      var val = getPath(data, node.getAttribute("data-bind"));
      if (typeof val === "string") node.textContent = val;
    });
    $all("[data-bind-attr]", root).forEach(function (node) {
      var spec = node.getAttribute("data-bind-attr").split(":");
      var val = getPath(data, spec[1]);
      if (typeof val === "string") node.setAttribute(spec[0], val);
    });
    document.documentElement.lang = state.lang;
  }

  /* ---------- Заголовок вкладки: свой на каждой странице ---------- */
  function setDocumentTitle() {
    var data = t();
    var key = document.body.getAttribute("data-title-key");
    var pageTitle = key ? getPath(data, key) : "";
    document.title = pageTitle ? pageTitle + " — " + data.hero.name : data.meta.title;
  }

  /* ---------- Шапка и подвал ---------- */
  function renderChrome() {
    var data = t();
    setDocumentTitle();
    var metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", data.meta.description);

    var navUl = $("#navLinks");
    if (navUl) {
      navUl.innerHTML = "";
      var page = currentPage();
      data.nav.links.forEach(function (link) {
        var li = el("li");
        var a = el("a", null, esc(link.label));
        a.setAttribute("href", link.href);
        var linkPage = link.href.split("#")[0] || "index.html";
        if (linkPage === page && link.href.indexOf("#") === -1) a.classList.add("active");
        li.appendChild(a);
        navUl.appendChild(li);
      });
    }
    $all("[data-bind='nav.brand']").forEach(function (n) { n.textContent = data.nav.brand; });
    $all("[data-bind='nav.cta']").forEach(function (n) { n.textContent = data.nav.cta; });
    var langCurrent = $(".lang-current");
    var langOther = $(".lang-other");
    if (langCurrent) langCurrent.textContent = data.langSwitch.current;
    if (langOther) langOther.textContent = data.langSwitch.other;

    var footerRights = $("#footerRights");
    if (footerRights) footerRights.textContent = "© " + new Date().getFullYear() + " " + data.hero.name + ". " + data.footer.rights;
    $all("[data-bind='footer.tagline']").forEach(function (n) { n.textContent = data.footer.tagline; });
  }

  /* ---------- Переключение языка ---------- */
  function switchLang() {
    var body = document.body;
    function apply() {
      state.lang = state.lang === "ru" ? "en" : "ru";
      localStorage.setItem(LANG_KEY, state.lang);
      renderChrome();
      if (pageRenderFn) pageRenderFn();
      afterRender();
    }
    if (reduceMotion) { apply(); return; }
    body.classList.add("lang-fading-out");
    setTimeout(function () {
      apply();
      body.classList.remove("lang-fading-out");
      body.classList.add("lang-fading-in");
      setTimeout(function () { body.classList.remove("lang-fading-in"); }, 240);
    }, 180);
  }

  /* ---------- Скролл: состояние шапки + прогресс ---------- */
  function setupScrollFx() {
    var header = $("#siteHeader");
    var progress = $("#scrollProgress");
    var ticking = false;

    function paint() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("scrolled", y > 20);
      if (progress) {
        // scaleX вместо width: ширина — свойство раскладки, её пересчёт
        // на каждый кадр прокрутки бьёт по плавности
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;
        progress.style.transform = "scaleX(" + ratio + ")";
      }
      updateGlowParallax();
    }
    function onScroll() {
      // измерения и стили — один раз на кадр, иначе прокрутка начинает дёргаться
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    paint();
  }

  /* ---------- Клики: меню, язык, видео, лайтбокс ---------- */
  function setupEvents() {
    document.addEventListener("click", function (e) {
      if (e.target.closest("#langToggle")) { switchLang(); return; }

      var burger = e.target.closest("#navBurger");
      if (burger) {
        var nav = $("#mainNav");
        var open = nav.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
        return;
      }
      if (e.target.closest("#navLinks a")) {
        closeNav();
        return;
      }

      var priceRowNode = e.target.closest(".price-row.is-expandable");
      if (priceRowNode) {
        toggleService(priceRowNode);
        return;
      }

      var faqRowNode = e.target.closest(".faq-row");
      if (faqRowNode) {
        toggleFaq(faqRowNode);
        return;
      }

      var videoTile = e.target.closest(".video-tile[data-video-src]");
      if (videoTile) {
        playVideo(videoTile);
        return;
      }

      var zoom = e.target.closest("[data-lightbox]");
      if (zoom) {
        openLightbox(zoom.getAttribute("data-lightbox-group"), parseInt(zoom.getAttribute("data-lightbox-index"), 10) || 0);
        return;
      }
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.node || !lightbox.node.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > NAV_BREAKPOINT) closeNav();
      refreshOpenServices();
    });
  }

  /** Свечение в карточках «Для кого» идёт за курсором — только на десктопе. */
  function setupCardGlow() {
    if (!window.matchMedia("(hover: hover)").matches) return;
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest(".for-whom-card");
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (((e.clientX - rect.left) / rect.width) * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (((e.clientY - rect.top) / rect.height) * 100).toFixed(1) + "%");
    }, { passive: true });
  }

  function closeNav() {
    var mn = $("#mainNav"), nb = $("#navBurger");
    if (mn) mn.classList.remove("open");
    if (nb) { nb.classList.remove("open"); nb.setAttribute("aria-expanded", "false"); }
    document.body.style.overflow = "";
  }

  function playVideo(tile) {
    var src = tile.getAttribute("data-video-src");
    var v = document.createElement("video");
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.className = "video-el";
    v.addEventListener("loadedmetadata", function () {
      if (v.videoWidth && v.videoHeight) setTileAspect(tile, v.videoWidth / v.videoHeight);
    }, { once: true });
    tile.classList.add("is-playing");
    tile.removeAttribute("data-video-src");
    var btn = tile.querySelector(".video-play");
    if (btn) btn.remove();
    tile.appendChild(v);
  }

  /* ---------- Лайтбокс для фото ---------- */
  function ensureLightbox() {
    if (lightbox.node) return lightbox.node;
    var node = el("div", "lightbox");
    node.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Закрыть">✕</button>' +
      '<button class="lightbox-nav prev" type="button" aria-label="Предыдущее">‹</button>' +
      '<img alt="">' +
      '<button class="lightbox-nav next" type="button" aria-label="Следующее">›</button>' +
      '<div class="lightbox-counter"></div>';
    document.body.appendChild(node);
    node.addEventListener("click", function (e) {
      if (e.target.closest(".lightbox-nav.next")) { stepLightbox(1); return; }
      if (e.target.closest(".lightbox-nav.prev")) { stepLightbox(-1); return; }
      if (e.target.closest(".lightbox-close") || e.target === node) closeLightbox();
    });
    lightbox.node = node;
    return node;
  }
  function openLightbox(group, index) {
    var sources = $all('[data-lightbox][data-lightbox-group="' + group + '"]').map(function (n) {
      return n.getAttribute("data-lightbox");
    });
    if (!sources.length) return;
    lightbox.items = sources;
    lightbox.index = index;
    var node = ensureLightbox();
    paintLightbox();
    node.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function paintLightbox() {
    var node = lightbox.node;
    node.querySelector("img").src = lightbox.items[lightbox.index];
    node.querySelector(".lightbox-counter").textContent = (lightbox.index + 1) + " / " + lightbox.items.length;
    var many = lightbox.items.length > 1;
    $all(".lightbox-nav", node).forEach(function (b) { b.style.display = many ? "flex" : "none"; });
  }
  function stepLightbox(delta) {
    lightbox.index = (lightbox.index + delta + lightbox.items.length) % lightbox.items.length;
    paintLightbox();
  }
  function closeLightbox() {
    if (!lightbox.node) return;
    lightbox.node.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- Зерно (один раз на страницу) ---------- */
  function injectGrain() {
    if ($(".grain-overlay")) return;
    document.body.appendChild(el("div", "grain-overlay"));
  }

  /**
   * Чернильное поле в шапках внутренних страниц. Пятна создаются здесь, а не
   * в разметке, чтобы не дублировать пять одинаковых блоков по всем страницам.
   */
  function injectInkFields() {
    $all(".ink-stain").forEach(function (node) {
      if (node.children.length) return;
      node.innerHTML = '<span class="ink-blob b1"></span>' +
        '<span class="ink-blob b2"></span>' +
        '<span class="ink-blob b3"></span>' +
        '<span class="ink-blob b4"></span>' +
        '<span class="ink-blob b5"></span>' +
        '<span class="ink-blob b6"></span>';
    });
  }

  /**
   * Световые пятна в однотонных разделах главной. Проявляются, когда раздел
   * входит в экран, и гаснут, когда выходит — отсюда ощущение, что фон живёт
   * вместе с прокруткой.
   */
  function injectGlowFields() {
    $all("[data-glow]").forEach(function (section) {
      if ($(".glow-field", section)) return;
      section.classList.add("section--glow");
      var field = el("div", "glow-field", '<span class="glow g1"></span><span class="glow g2"></span><span class="glow g3"></span>');
      field.setAttribute("aria-hidden", "true");
      // раскладка и фазы у каждого раздела свои: иначе пятна во всех
      // разделах оказываются в одних и тех же местах
      field.classList.add("glow-field--" + "abcd"[glowFields.length % 4]);
      $all(".glow", field).forEach(function (glow, k) {
        glow.style.animationDelay = "-" + (glowFields.length * 9 + k * 13) + "s, -" + (glowFields.length * 5 + k * 7) + "s";
      });
      section.insertBefore(field, section.firstChild);
      glowFields.push(field);
    });
    if (!glowFields.length) return;

    if (reduceMotion) {
      glowFields.forEach(function (f) { f.classList.add("visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    }, { threshold: 0, rootMargin: "-8% 0px -8% 0px" });
    glowFields.forEach(function (f) { obs.observe(f); });
  }

  /**
   * Лёгкий параллакс при прокрутке: и световые пятна, и фото в фонах разделов
   * отстают от страницы. У фото для этого есть запас — они выводятся крупнее
   * раздела (inset у .section-photo-bg).
   */
  function shiftOf(rect, viewportHeight, strength) {
    var progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    return (Math.max(-1.6, Math.min(1.6, progress)) * -strength).toFixed(1) + "px";
  }
  function updateGlowParallax() {
    if (reduceMotion) return;
    var vh = window.innerHeight;
    glowFields.forEach(function (field) {
      if (!field.classList.contains("visible")) return;
      field.style.setProperty("--glow-shift", shiftOf(field.getBoundingClientRect(), vh, 46));
    });
    photoLayers.forEach(function (layer) {
      var rect = layer.parentElement.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > vh + 120) return;
      layer.style.setProperty("--parallax", shiftOf(rect, vh, 34));
    });
  }

  /**
   * Подгоняем пропорции видео-плитки под реальный кадр: вертикальные ролики
   * не растягиваются в горизонтальную рамку и не обрезаются.
   */
  function setTileAspect(tile, ratio) {
    if (!tile || !ratio || !isFinite(ratio)) return;
    tile.style.aspectRatio = ratio.toFixed(4);
    tile.classList.toggle("video-tile--tall", ratio < 0.95);
  }

  function applyVideoAspects() {
    $all(".video-tile").forEach(function (tile) {
      var img = $(".video-poster", tile);
      if (img) {
        // есть кадр-заглушка — пропорции берём из неё, файл грузить не нужно
        var fromPoster = function () {
          if (img.naturalWidth && img.naturalHeight) setTileAspect(tile, img.naturalWidth / img.naturalHeight);
        };
        if (img.complete) fromPoster();
        else img.addEventListener("load", fromPoster, { once: true });
        return;
      }
      // Постера нет: подтягиваем только метаданные ролика, чтобы вертикальное
      // видео не показывалось в горизонтальной рамке с обрезкой.
      var src = tile.getAttribute("data-video-src");
      if (!src || tile.dataset.aspectProbed) return;
      tile.dataset.aspectProbed = "1";
      var probe = document.createElement("video");
      probe.preload = "metadata";
      probe.muted = true;
      probe.addEventListener("loadedmetadata", function () {
        if (probe.videoWidth && probe.videoHeight) setTileAspect(tile, probe.videoWidth / probe.videoHeight);
        probe.src = "";
      }, { once: true });
      probe.src = src;
    });
  }

  function afterRender() {
    initReveal();
    applyVideoAspects();
  }

  /**
   * Проекты, которые видно на сайте. Черновики (галочка «Черновик» в
   * админке) остаются в данных и в админке, но из портфолио и с главной
   * исчезают: незаконченный проект можно сохранять и дозаполнять, не
   * удаляя и не показывая его посетителям.
   */
  function visibleProjects(d) {
    return ((d || t()).portfolio.projects || []).filter(function (p) { return !p.hidden; });
  }

  /* ---------- Появление при скролле ---------- */
  function initReveal() {
    if (revealObserver) revealObserver.disconnect();
    if (reduceMotion) { $all("[data-reveal]").forEach(function (n) { n.classList.add("in-view"); }); return; }
    revealObserver = new IntersectionObserver(function (entries) {
      // Если в кадр въезжает сразу ряд карточек, они появлялись
      // одновременно — стеной. Расставляем каскад по 60 мс: порядок
      // чтения становится виден, но ждать последнюю карточку не приходится.
      var arriving = entries.filter(function (e) { return e.isIntersecting; });
      arriving.sort(function (a, b) {
        return a.boundingClientRect.top - b.boundingClientRect.top ||
               a.boundingClientRect.left - b.boundingClientRect.left;
      });
      arriving.forEach(function (entry, i) {
        var delay = Math.min(i, 5) * 60; // потолок — чтобы хвост списка не ждал
        if (delay) entry.target.style.setProperty("--reveal-delay", delay + "ms");
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    $all("[data-reveal]").forEach(function (n) { revealObserver.observe(n); });
  }

  /* ---------- Подсветка пункта меню при скролле по якорям ---------- */
  function setupSectionObserver() {
    var sections = $all("main > section[id]");
    if (!sections.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var href = "index.html#" + entry.target.id;
        $all("#navLinks a").forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === href || a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { threshold: 0.5, rootMargin: "-72px 0px -40% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- Иконки для цифр в кейсе ---------- */
  function statIconSVG(key) {
    var icons = {
      clock: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
      steps: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19h4v-4H4v4zm6 0h4v-9h-4v9zm6 0h4V6h-4v13z"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>',
      ensemble: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="9" r="2.6"/><circle cx="17" cy="9" r="2.6"/><path d="M3 19c0-2.8 2.2-5 5-5s5 2.2 5 5M11 19c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>'
    };
    return icons[key] || '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/></svg>';
  }

  /** Иконка соцсети по названию из админки — узнаём по ключевому слову. */
  /**
   * Стрелка в ссылках-переходах. Раньше здесь стоял символ «→» из шрифта:
   * он не совпадал по весу и оптическому размеру с текстом и менялся вместе
   * с гарнитурой. Нарисованная стрелка живёт в одном штрихе с остальными
   * иконками сайта.
   */
  function arrowSVG(dir) {
    var path = dir === "left"
      ? "M10.5 4 4.5 10l6 6M5 10h11"
      : "M9.5 4l6 6-6 6M15 10H4";
    return '<svg class="link-arrow" viewBox="0 0 20 20" width="15" height="15" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="' + path + '"/></svg>';
  }

  /** Подпись со стрелкой: текст экранируется, стрелка добавляется разметкой. */
  function withArrow(text, dir) {
    var label = esc(text || "");
    return dir === "left" ? arrowSVG("left") + label : label + arrowSVG();
  }

  function socialIconSVG(label) {
    var key = String(label || "").toLowerCase();
    var icons = {
      telegram: '<path d="M21 4.5 2.8 11.4c-1 .4-1 1.8.1 2.1l4.6 1.4 1.7 5.2c.3.8 1.3 1 1.9.4l2.5-2.4 4.5 3.3c.7.5 1.7.1 1.9-.7L22.9 5.7c.2-.9-.7-1.6-1.5-1.2Z"/>',
      vk: '<path d="M12.9 16.9c-5 0-8-3.5-8.1-9.2h2.6c.1 4.2 2 6 3.4 6.4V7.7h2.4v3.7c1.4-.2 2.9-1.8 3.4-3.7h2.4c-.4 2.3-1.9 3.9-3 4.5 1.1.5 2.8 1.9 3.4 4.7h-2.6c-.5-1.7-1.9-3-3.6-3.2v3.2h-.3Z"/>',
      youtube: '<path d="M21.6 7.7c-.2-1-1-1.7-1.9-1.9C17.9 5.4 12 5.4 12 5.4s-5.9 0-7.7.4c-1 .2-1.7 1-1.9 1.9C2 9.5 2 12 2 12s0 2.5.4 4.3c.2 1 1 1.7 1.9 1.9 1.8.4 7.7.4 7.7.4s5.9 0 7.7-.4c1-.2 1.7-1 1.9-1.9.4-1.8.4-4.3.4-4.3s0-2.5-.4-4.3ZM10 15.1V8.9l5.2 3.1L10 15.1Z"/>',
      instagram: '<path d="M12 2.8c3 0 3.3 0 4.5.1 1.1.1 1.7.2 2.1.4.5.2.9.5 1.3.9.4.4.7.8.9 1.3.2.4.3 1 .4 2.1.1 1.2.1 1.5.1 4.4s0 3.2-.1 4.4c-.1 1.1-.2 1.7-.4 2.1-.2.5-.5.9-.9 1.3-.4.4-.8.7-1.3.9-.4.2-1 .3-2.1.4-1.2.1-1.5.1-4.5.1s-3.3 0-4.5-.1c-1.1-.1-1.7-.2-2.1-.4-.5-.2-.9-.5-1.3-.9-.4-.4-.7-.8-.9-1.3-.2-.4-.3-1-.4-2.1-.1-1.2-.1-1.5-.1-4.4s0-3.2.1-4.4c.1-1.1.2-1.7.4-2.1.2-.5.5-.9.9-1.3.4-.4.8-.7 1.3-.9.4-.2 1-.3 2.1-.4C8.7 2.8 9 2.8 12 2.8Zm0 3.9a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6Zm0 8.7a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Zm6.7-8.9a1.2 1.2 0 1 1-2.5 0 1.2 1.2 0 0 1 2.5 0Z"/>',
      rutube: '<path d="M4 5h11.5c2.5 0 4 1.5 4 3.8 0 2-1.2 3.4-3.1 3.7l3.4 6.5h-3l-3.1-6.2H6.8V19H4V5Zm2.8 2.4v3.1h8.3c1 0 1.6-.6 1.6-1.5s-.6-1.6-1.6-1.6H6.8Z"/>'
    };
    // Подписи в контенте русские («Сообщество ВКонтакте», «Телеграм»),
    // поэтому ищем и по кириллическим названиям — иначе вместо иконки
    // соцсети везде вставал запасной глобус.
    var aliases = {
      telegram: ["telegram", "телеграм", "тг"],
      vk: ["vk", "вконтакте", "вк"],
      youtube: ["youtube", "ютуб"],
      instagram: ["instagram", "инстаграм"],
      rutube: ["rutube", "рутуб"]
    };
    var name = Object.keys(aliases).filter(function (k) {
      return aliases[k].some(function (a) { return key.indexOf(a) > -1; });
    })[0];
    var path = name ? icons[name] : '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3.2a19 19 0 0 1 2.3 5.6H9.7A19 19 0 0 1 12 5.2ZM5.4 10.8a6.8 6.8 0 0 1 3.4-4.5 21 21 0 0 0-1.6 4.5H5.4Zm0 2.4h1.8a21 21 0 0 0 1.6 4.5 6.8 6.8 0 0 1-3.4-4.5Zm6.6 5.6a19 19 0 0 1-2.3-5.6h4.6a19 19 0 0 1-2.3 5.6Zm3.2-1.1a21 21 0 0 0 1.6-4.5h1.8a6.8 6.8 0 0 1-3.4 4.5Zm1.6-6.9a21 21 0 0 0-1.6-4.5 6.8 6.8 0 0 1 3.4 4.5h-1.8Z"/>';
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' + path + "</svg>";
  }

  /* ---------- Плитки: заглушки, фото, видео ---------- */
  function waveformHTML(n) {
    var bars = "";
    for (var i = 0; i < (n || 28); i++) {
      var h = 20 + Math.round(Math.random() * 80);
      bars += '<span style="height:' + h + '%"></span>';
    }
    return '<div class="waveform">' + bars + "</div>";
  }
  function iconSVG(kind) {
    if (kind === "video") return '<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="10"/><path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none"/></svg>';
    if (kind === "score") return '<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="10.3" x2="21" y2="10.3"/><line x1="3" y1="13.6" x2="21" y2="13.6"/><line x1="3" y1="16.9" x2="21" y2="16.9"/><circle cx="9" cy="16.9" r="1.6" fill="currentColor" stroke="none"/><circle cx="16" cy="13.6" r="1.6" fill="currentColor" stroke="none"/></svg>';
    return '<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>';
  }

  /** Превью проекта в карточке: реальное фото либо тематическая заглушка. */
  function projectThumb(project, categoryLabel) {
    var media = project.media || {};
    var inner, phClass = "";
    if (media.src && media.type === "photo") {
      inner = '<img class="card-photo media-fill" src="' + esc(media.src) + '" alt="" loading="lazy">';
    } else if (media.type === "audio") {
      inner = waveformHTML();
      phClass = " project-thumb--ph";
    } else {
      inner = '<div class="media-icon">' + iconSVG(media.type) + "</div>";
      phClass = " project-thumb--ph";
    }
    return '<div class="project-thumb' + phClass + '">' +
      '<span class="project-category-tag">' + esc(categoryLabel) + "</span>" +
      inner +
      "</div>";
  }

  /** Карточка проекта — одинаковая на главной и на странице портфолио. */
  function projectCardHTML(proj, d) {
    return projectThumb(proj, proj.categoryLabel) +
      '<div class="project-body">' +
        "<h3>" + esc(proj.title) + "</h3>" +
        '<p class="project-meta">' + esc(proj.meta) + "</p>" +
        '<p class="project-desc">' + esc(proj.description) + "</p>" +
        (proj.isPlaceholder ? '<span class="placeholder-flag">' + esc(d.common.placeholderFlag) + "</span>" : "") +
        '<span class="project-more">' + withArrow(d.portfolio.detailsLabel) + "</span>" +
      "</div>";
  }

  /**
   * Карточка новости — одинаковая на главной и на странице «Новости».
   * Целиком ссылка на post.html: обложка (если задана), дата, рубрика, анонс.
   */
  function blogCardHTML(post, d) {
    var date = post.date && post.date !== "—" ? post.date : "";
    var hasVideo = !!post.video;
    var cover = post.cover || (post.photos || [])[0] || "";

    // Без обложки карточка была бы просто текстом в рамке — рисуем
    // «нотный» фон, чтобы лента новостей выглядела ровно.
    var media = cover
      ? '<img class="media-fill" src="' + esc(cover) + '" alt="" loading="lazy">'
      : '<div class="blog-cover-fallback">' + iconSVG("score") + "</div>";

    return '<div class="blog-cover">' + media +
        (hasVideo ? '<span class="blog-play" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>' : "") +
        (post.category ? '<span class="blog-tag">' + esc(post.category) + "</span>" : "") +
      "</div>" +
      '<div class="blog-body-wrap">' +
        (date ? '<div class="blog-meta">' + esc(date) + "</div>" : "") +
        "<h3>" + esc(post.title) + "</h3>" +
        "<p>" + esc(post.excerpt) + "</p>" +
        (post.isPlaceholder ? '<span class="placeholder-flag">' + esc(d.common.placeholderFlag) + "</span>" : "") +
        '<span class="blog-more">' + withArrow(d.blog.readMore || "Читать") + "</span>" +
      "</div>";
  }

  /** Готовая карточка новости как ссылка на страницу статьи. */
  function blogCard(post, index, d) {
    var card = el("a", "blog-card reveal" + (post.cover ? " has-cover" : ""), blogCardHTML(post, d));
    card.href = "post.html?id=" + encodeURIComponent(post.id || "");
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--reveal-delay", Math.min(index, 8) * 55 + "ms");
    return card;
  }

  /**
   * Услуги разложены по направлениям из services.groups. Услуга без группы
   * (или с группой, которой больше нет) не теряется — она попадает в конец
   * списка отдельным блоком без заголовка.
   */
  function servicesByGroup(d) {
    var groups = (d.services && d.services.groups) || [];
    var items = (d.services && d.services.items) || [];
    var known = {};
    var buckets = groups.map(function (group) {
      known[group.id] = true;
      return { group: group, items: [] };
    });
    var rest = [];
    items.forEach(function (item) {
      if (item.group && known[item.group]) {
        buckets.filter(function (b) { return b.group.id === item.group; })[0].items.push(item);
      } else {
        rest.push(item);
      }
    });
    var result = buckets.filter(function (b) { return b.items.length; });
    if (rest.length) result.push({ group: null, items: rest });
    return result;
  }

  /**
   * Строка прайса на странице услуг: название и короткое описание слева,
   * цена справа. Подробности раскрываются по клику — цены остаются в одной
   * колонке и сравниваются глазом, а список не разрастается.
   */
  function priceRow(item, d) {
    var points = (item.bullets || []).filter(Boolean);
    var expandable = !!(item.detail || points.length);
    var labels = d.services || {};
    var row = el("li", "price-row reveal" + (expandable ? " is-expandable" : ""));
    row.setAttribute("data-reveal", "");

    var main = el(expandable ? "button" : "div", "price-row-main",
      '<span class="price-row-text">' +
        '<span class="price-row-title">' + esc(item.title) + "</span>" +
        '<span class="price-row-desc">' + esc(item.description) + "</span>" +
      "</span>" +
      '<span class="price-row-price">' + esc(item.price) + "</span>" +
      (expandable ? '<span class="price-row-plus" aria-hidden="true"></span>' : ""));
    if (expandable) {
      main.type = "button";
      main.setAttribute("aria-expanded", "false");
      main.setAttribute("aria-label", item.title + " — " + (labels.detailsLabel || "Подробнее"));
    }
    row.appendChild(main);

    if (expandable) {
      row.appendChild(el("div", "price-row-detail",
        '<div class="price-row-detail-inner">' +
          (item.detail ? "<p>" + esc(item.detail) + "</p>" : "") +
          (points.length
            ? '<ul class="service-points">' + points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>"
            : "") +
        "</div>"));
    }
    return row;
  }

  /**
   * Строка «вопрос — ответ» в разделе частых вопросов. Механика та же, что у
   * прайса: ответ скрыт и раскрывается по клику — но без цены, и вопрос набран
   * крупнее, чтобы свёрнутый список читался как оглавление.
   */
  function faqRow(item, d, index) {
    var labels = (d && d.faq) || {};
    var row = el("li", "faq-row reveal");
    row.setAttribute("data-reveal", "");
    row.style.setProperty("--reveal-delay", Math.min(index || 0, 8) * 45 + "ms");

    var main = el("button", "faq-question",
      '<span class="faq-question-text">' + esc(item.question) + "</span>" +
      '<span class="faq-sign" aria-hidden="true"></span>');
    main.type = "button";
    main.setAttribute("aria-expanded", "false");
    main.setAttribute("aria-label", item.question + " — " + (labels.openLabel || "Раскрыть ответ"));
    row.appendChild(main);

    row.appendChild(el("div", "faq-answer",
      '<div class="faq-answer-inner"><p>' + esc(item.answer) + "</p></div>"));
    return row;
  }

  /** Карточка направления на главной: название, суть и состав услуг. */
  function directionCard(bucket, index, d) {
    var group = bucket.group || {};
    var card = el("article", "direction-card reveal",
      '<span class="direction-index">' + String(index + 1).padStart(2, "0") + "</span>" +
      "<h3>" + esc(group.title || "") + "</h3>" +
      (group.summary ? "<p>" + esc(group.summary) + "</p>" : "") +
      '<ul class="direction-list">' +
        bucket.items.map(function (item) { return "<li>" + esc(item.title) + "</li>"; }).join("") +
      "</ul>");
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--reveal-delay", Math.min(index, 8) * 50 + "ms");
    return card;
  }

  /* Современные браузеры умеют анимировать height до auto
     (interpolate-size). Там, где умеют, высоту не измеряем и не
     пересчитываем после смены ширины — этим занимается CSS. */
  var AUTO_HEIGHT = typeof CSS !== "undefined" && CSS.supports &&
    CSS.supports("interpolate-size", "allow-keywords");

  function toggleService(row) {
    var open = row.classList.toggle("open");
    var detail = $(".price-row-detail", row);
    if (detail && !AUTO_HEIGHT) detail.style.maxHeight = open ? detail.scrollHeight + "px" : "";

    var button = $(".price-row-main", row);
    if (!button) return;
    button.setAttribute("aria-expanded", open ? "true" : "false");
    var labels = t().services || {};
    var title = $(".price-row-title", row);
    button.setAttribute("aria-label", (title ? title.textContent : "") + " — " +
      (open ? (labels.hideLabel || "Свернуть") : (labels.detailsLabel || "Подробнее")));
  }

  function toggleFaq(row) {
    var open = row.classList.toggle("open");
    var answer = $(".faq-answer", row);
    if (answer && !AUTO_HEIGHT) answer.style.maxHeight = open ? answer.scrollHeight + "px" : "";

    var button = $(".faq-question", row);
    if (!button) return;
    button.setAttribute("aria-expanded", open ? "true" : "false");
    var labels = t().faq || {};
    var question = $(".faq-question-text", row);
    button.setAttribute("aria-label", (question ? question.textContent : "") + " — " +
      (open ? (labels.hideLabel || "Свернуть ответ") : (labels.openLabel || "Раскрыть ответ")));
  }

  /** Запасной путь: после смены ширины высота раскрытого текста меняется,
      и зафиксированный max-height приходится пересчитывать. */
  function refreshOpenServices() {
    if (AUTO_HEIGHT) return;
    $all(".price-row.open .price-row-detail, .faq-row.open .faq-answer").forEach(function (detail) {
      detail.style.maxHeight = "none";
      var height = detail.scrollHeight;
      detail.style.maxHeight = height + "px";
    });
  }

  /** Фото в галерее: заполняет плитку, по клику открывается целиком. */
  function photoTile(src, alt, group, index) {
    return '<div class="media-tile is-clickable" data-lightbox="' + esc(src) + '" ' +
      'data-lightbox-group="' + esc(group || "gallery") + '" data-lightbox-index="' + (index || 0) + '">' +
      '<img class="media-fill" src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy">' +
      "</div>";
  }

  /**
   * Видео-плитка. Постер вписывается целиком, поэтому вертикальные ролики
   * не обрезаются; пустое место закрывает размытая копия кадра.
   */
  function videoTile(src, poster, extraClass) {
    var p = esc(poster || "");
    return '<div class="video-tile ' + (extraClass || "") + '" data-video-src="' + esc(src) + '">' +
      (p ? '<div class="video-blur" style="background-image:url(' + p + ')"></div>' : "") +
      (p ? '<img class="video-poster" src="' + p + '" alt="" loading="lazy">' : "") +
      '<button class="video-play" type="button" aria-label="Play video"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>' +
      "</div>";
  }

  /**
   * Ссылка на ролик с YouTube / VK / Rutube → адрес встраиваемого плеера.
   * Понимает обычные ссылки из адресной строки; уже готовый embed-адрес
   * возвращает как есть.
   */
  function embedURL(url) {
    var u = String(url || "").trim();
    if (!u) return "";
    var m;
    if ((m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/i))) {
      // youtube-nocookie: плеер не ставит отслеживающие cookie, пока ролик
      // не запустили. Функционально это тот же плеер.
      return "https://www.youtube-nocookie.com/embed/" + m[1];
    }
    if (u.indexOf("video_ext.php") > -1) return u;
    if ((m = u.match(/vk(?:video)?\.(?:com|ru)\/(?:[^?]*[?&]z=)?video(-?\d+)_(\d+)/i))) {
      return "https://vk.com/video_ext.php?oid=" + m[1] + "&id=" + m[2] + "&hd=2";
    }
    if ((m = u.match(/rutube\.ru\/(?:video|play\/embed)\/([\w-]+)/i))) {
      return "https://rutube.ru/play/embed/" + m[1];
    }
    return u;
  }

  function videoEmbed(url, title) {
    var src = embedURL(url);
    if (!src) return "";
    return '<div class="video-embed"><iframe src="' + esc(src) + '" title="' + esc(title || "") +
      '" loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
  }

  function audioItem(track) {
    return '<div class="audio-item">' +
      (track.title ? '<div class="audio-title">' + esc(track.title) + "</div>" : "") +
      '<audio controls preload="none" src="' + esc(track.src) + '"></audio>' +
      "</div>";
  }

  /**
   * «Коротко из ролика»: пересказ видео текстом — для тех, кто не хочет
   * смотреть, у кого не грузится видео, и для поисковых систем, которым
   * звук из mp4 недоступен. Пустые поля блок не рисуют.
   */
  function introDigest(intro) {
    intro = intro || {};
    var summary = (intro.summary || "").trim();
    var points = (intro.points || []).filter(Boolean);
    if (!summary && !points.length) return "";

    var head = "";
    if (intro.digestLabel || intro.duration) {
      head = '<div class="intro-digest-head">' +
        (intro.digestLabel ? "<span>" + esc(intro.digestLabel) + "</span>" : "") +
        (intro.duration ? '<span class="intro-digest-time">' + esc(intro.duration) + "</span>" : "") +
        "</div>";
    }
    return '<div class="intro-digest">' + head +
      (summary ? '<p class="intro-digest-summary">' + emphasize(summary) + "</p>" : "") +
      (points.length
        ? '<ul class="intro-digest-points">' + points.map(function (point, i) {
            return "<li><i>" + String(i + 1).padStart(2, "0") + "</i>" + emphasize(point) + "</li>";
          }).join("") + "</ul>"
        : "") +
      "</div>";
  }

  /* ---------- Точка входа для каждой страницы ---------- */
  function init(renderPageFn) {
    pageRenderFn = renderPageFn || null;
    injectGrain();
    injectInkFields();
    injectGlowFields();
    photoLayers = $all(".section-photo-bg");
    bindTexts();
    renderChrome();
    if (pageRenderFn) pageRenderFn();
    setupScrollFx();
    setupEvents();
    setupCardGlow();
    setupSectionObserver();
    afterRender();
  }

  return {
    state: state, t: t, $: $, $all: $all, el: el, esc: esc, emphasize: emphasize, getPath: getPath,
    bindTexts: bindTexts, renderChrome: renderChrome, initReveal: initReveal, afterRender: afterRender,
    visibleProjects: visibleProjects,
    waveformHTML: waveformHTML, iconSVG: iconSVG, statIconSVG: statIconSVG,
    projectThumb: projectThumb, projectCardHTML: projectCardHTML,
    servicesByGroup: servicesByGroup, priceRow: priceRow, directionCard: directionCard,
    faqRow: faqRow,
    socialIconSVG: socialIconSVG, arrowSVG: arrowSVG, withArrow: withArrow,
    blogCardHTML: blogCardHTML, blogCard: blogCard, introDigest: introDigest,
    photoTile: photoTile, videoTile: videoTile, videoEmbed: videoEmbed, audioItem: audioItem,
    init: init
  };
})();
