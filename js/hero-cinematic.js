/**
 * Кинематографичный первый экран (включается флагом heroCinematic в js/flags.js).
 *
 * Сцена, разложенная по прокрутке первого экрана:
 *   0.05–0.55  фото растворяется, вместо него проступают световые пятна;
 *   0.25–0.62  описание и кнопки гаснут, а надпись «Ознакомительный ролик»
 *              с заголовком подъезжает снизу к имени;
 *   0.45–0.85  справа от текста всплывает сам ролик.
 *
 * Если флаг выключен, файл ничего не делает: класс на <body> не ставится,
 * стили из css/hero-cinematic.css не срабатывают, «мостик» и ролик в первом
 * экране остаются скрытыми, а обычный раздел с видео работает как раньше.
 */
window.SiteHeroCinematic = (function () {
  "use strict";

  var C = window.SiteCommon;
  var $ = C.$;
  var enabled = !!(window.SITE_FLAGS && window.SITE_FLAGS.heroCinematic);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var started = false;
  var glowNode = null;

  var FADED = [".hero-credit"];
  var leadHeight = 0;

  // Ниже этой ширины ролик рядом с текстом уже не помещается, поэтому
  // первый экран и раздел «Ознакомительный ролик» работают по-старому,
  // как два отдельных раздела. Значение совпадает с media-запросом в
  // css/hero-cinematic.css.
  var MIN_WIDTH = 1025;

  function isActive() {
    return enabled && !reduceMotion && window.innerWidth >= MIN_WIDTH;
  }

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /** 0 → верх страницы, 1 → первый экран прокручен полностью. */
  function progress() {
    var hero = $(".hero");
    if (!hero) return 0;
    var travel = hero.offsetHeight - window.innerHeight;
    return travel > 0 ? clamp01((window.scrollY || window.pageYOffset) / travel) : 0;
  }

  /** Плавный участок: 0 до `from`, 1 после `to`. */
  function ramp(value, from, to) {
    return clamp01((value - from) / (to - from));
  }

  /** Световые пятна первого экрана — та же вёрстка, что в разделах ниже. */
  function ensureGlow() {
    if (glowNode) return glowNode;
    var hero = $(".hero");
    if (!hero) return null;
    glowNode = C.el("div", "glow-field glow-field--b hero-glow",
      '<span class="glow g1"></span><span class="glow g2"></span><span class="glow g3"></span>');
    glowNode.setAttribute("aria-hidden", "true");
    hero.insertBefore(glowNode, hero.firstChild);
    return glowNode;
  }

  /** Своя высота блока описания — нужна, чтобы плавно её схлопывать. */
  function measureLead() {
    var lead = $("#heroLead");
    if (!lead) return 0;
    var saved = lead.style.height;
    lead.style.height = "auto";
    var height = lead.scrollHeight;
    lead.style.height = saved;
    return height;
  }

  function reset() {
    [".hero-media", ".hero-scrim"].forEach(function (sel) {
      var node = $(sel);
      if (!node) return;
      node.style.opacity = "";
      node.style.transform = "";
      node.classList.remove("is-gone");
    });
    FADED.forEach(function (sel) {
      var node = $(sel);
      if (node) node.style.opacity = "";
    });
    [$("#heroIntroBridge"), $("#heroIntroVideo")].forEach(function (node) {
      if (node) { node.style.opacity = ""; node.style.transform = ""; }
    });
    var lead = $("#heroLead");
    if (lead) { lead.style.height = ""; lead.style.opacity = ""; }
    if (glowNode) glowNode.style.opacity = "";
    drawArrow(0);
  }

  /** Стрелка «рисуется»: сначала линия, в конце — наконечник. */
  function drawArrow(amount) {
    var arrow = $("#heroIntroArrow");
    if (!arrow) return;
    var line = arrow.querySelector(".arrow-line");
    var head = arrow.querySelector(".arrow-head");
    if (line) line.style.strokeDashoffset = String(1 - clamp01(amount / 0.78));
    if (head) head.style.strokeDashoffset = String(1 - ramp(amount, 0.72, 1));
  }

  function paint() {
    var media = $(".hero-media");
    if (!media) return;
    if (!isActive()) { reset(); return; }

    var p = progress();
    var fade = ramp(p, 0.05, 0.55);   // фото уходит, фон оживает
    var swap = ramp(p, 0.25, 0.62);   // описание сменяется надписью о ролике
    var show = ramp(p, 0.45, 0.85);   // ролик всплывает справа

    media.style.opacity = String(1 - fade);
    media.style.transform = "scale(" + (1 + fade * 0.06).toFixed(4) + ")";
    media.classList.toggle("is-gone", fade >= 1);

    var scrim = $(".hero-scrim");
    if (scrim) {
      scrim.style.opacity = String(1 - fade * 0.9);
      scrim.classList.toggle("is-gone", fade >= 1);
    }

    var glow = ensureGlow();
    if (glow) glow.style.opacity = fade.toFixed(3);

    FADED.forEach(function (sel) {
      var node = $(sel);
      if (node) node.style.opacity = String(1 - swap);
    });

    // описание сжимается, и всё, что ниже, само подтягивается вверх
    var lead = $("#heroLead");
    if (lead) {
      if (!leadHeight) leadHeight = measureLead();
      lead.style.height = (leadHeight * (1 - swap)).toFixed(1) + "px";
      lead.style.opacity = String(clamp01(1 - swap * 1.3));
    }

    var bridge = $("#heroIntroBridge");
    if (bridge) {
      bridge.style.opacity = swap.toFixed(3);
      bridge.style.transform = "translateY(" + ((1 - swap) * 18).toFixed(1) + "px)";
    }

    var video = $("#heroIntroVideo");
    if (video) {
      video.style.opacity = show.toFixed(3);
      video.style.transform = "translateY(" + ((1 - show) * 38).toFixed(1) + "px)";
    }

    drawArrow(ramp(p, 0.5, 0.88));
  }

  /**
   * Наполняет первый экран содержимым раздела «Ознакомительный ролик»:
   * надпись и заголовок — под текстом, плеер — справа.
   */
  function renderIntro() {
    var bridge = $("#heroIntroBridge");
    var video = $("#heroIntroVideo");
    var d = C.t();
    var intro = d.introVideo || {};
    if (!bridge || !video) return;

    // В узком окне первый экран обычный, а ролик показывает свой раздел —
    // «мостик» и плитку в шапке прячем, чтобы видео не задвоилось.
    if (!enabled || !intro.src || !isActive()) {
      bridge.hidden = true;
      video.hidden = true;
      video.innerHTML = "";
      return;
    }

    bridge.hidden = false;
    $("#heroIntroEyebrow").textContent = intro.eyebrow || "";
    $("#heroIntroHeading").textContent = intro.heading || "";
    $("#heroIntroSub").textContent = intro.subheading || "";
    $("#heroIntroCue").textContent = C.state.lang === "en" ? "Play the video" : "Смотреть ролик";

    video.hidden = false;
    video.innerHTML = C.videoTile(intro.src, intro.poster, "intro-video-tile");
    C.afterRender();
  }

  function start() {
    if (!enabled) return;
    document.body.classList.add("hero-cinematic");
    if (started) return;
    started = true;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; paint(); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      leadHeight = 0;
      renderIntro();   // окно могло пересечь границу узкого режима
      onScroll();
    }, { passive: true });
    paint();
  }

  /** Вызывается из page-home.js после каждого рендера (в т.ч. смены языка). */
  function render() {
    if (!enabled) return;
    start();
    renderIntro();
    leadHeight = 0;   // текст мог смениться (например, при переключении языка)
    paint();
  }

  return { render: render, enabled: enabled };
})();
