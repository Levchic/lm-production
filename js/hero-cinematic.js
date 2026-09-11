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
  // верхняя группа прибита к верху экрана — переключатель в js/flags.js
  var topAnchored = !!(window.SITE_FLAGS && window.SITE_FLAGS.heroTopAnchored);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var started = false;
  var glowNode = null;

  var FADED = [".hero-credit", ".hero-ticker", ".hero-frames"];
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

  /**
   * Первый экран центрируем по вертикали: залипающий блок встаёт так,
   * чтобы текст оказался посередине окна.
   *
   * Считаем от ПОЛНОЙ высоты блока — с раскрытым описанием, даже если
   * сейчас оно наполовину сжато прокруткой. Иначе центр пересчитывался бы
   * на каждом кадре сцены, и текст поехал бы вверх вслед за сжимающимся
   * описанием. При такой привязке имя стоит на месте от начала до конца.
   */
  function updateStickyTop() {
    var hero = $(".hero"), text = $(".hero-text"), lead = $("#heroLead");
    var bridge = $("#heroIntroBridge"), video = $("#heroIntroVideo");
    if (!hero || !text) return;
    if (!isActive()) {
      hero.style.removeProperty("--hero-sticky-top");
      if (video) video.style.marginTop = "";
      return;
    }

    /* Меряем два состояния сцены — начало и конец. В начале раскрыто
       описание с кнопками, в конце оно сжато, зато развёрнут «мостик» с
       пересказом ролика. Оба раза берём прямоугольники, а не offsetTop:
       у блоков свои отступы, и арифметика по offset'ам промахивалась на
       десяток пикселей. */
    var savedHeight = lead ? lead.style.height : "";
    var savedOpacity = lead ? lead.style.opacity : "";
    function band(bottomNode) {
      if (!bottomNode) return 0;
      return bottomNode.getBoundingClientRect().bottom - text.getBoundingClientRect().top;
    }

    if (lead) { lead.style.height = "auto"; lead.style.opacity = "1"; }
    var startHeight = lead ? band(lead) : text.offsetHeight;

    function measureScene() {
      if (!bridge || bridge.hidden) return 0;
      var keep = lead ? lead.style.height : "";
      if (lead) lead.style.height = "0px";
      var value = band(bridge);
      if (lead) lead.style.height = keep;
      return value;
    }
    var sceneHeight = measureScene();
    if (lead) { lead.style.height = savedHeight; lead.style.opacity = savedOpacity; }

    var styles = getComputedStyle(document.documentElement);
    var header = parseFloat(styles.getPropertyValue("--header-h")) || 72;
    // Центр считаем не по всему окну, а по свободной полосе между шапкой
    // и титрами внизу — иначе текст оптически проваливается вниз.
    var ticker = parseFloat(getComputedStyle(hero).getPropertyValue("--ticker-h")) || 0;
    var free = window.innerHeight - header - ticker;
    var top;

    if (topAnchored) {
      /* Верхняя группа стоит у верхнего края, а не по центру. Всё, что
         ниже, центрируется в оставшейся высоте — этим занимается
         centerBelowTop(). */
      top = header + Math.max(20, Math.round(window.innerHeight * 0.05));
    } else {
      top = header + Math.max(16, Math.round((free - startHeight) / 2));
      /* В конце сцены блок выше, чем в начале: если центрировать только по
         началу, низ пересказа уезжает за край окна. Титры к этому моменту
         погашены, поэтому нижнюю границу считаем по всей высоте окна. */
      if (sceneHeight) {
        top = Math.min(top, Math.max(header + 16, window.innerHeight - sceneHeight - 24));
      }
    }
    hero.style.setProperty("--hero-sticky-top", Math.round(top) + "px");
    centerBelowTop(text, lead, bridge, top, ticker);
    // поля сдвинули содержимое — высоту сцены пересчитываем заново
    sceneHeight = measureScene();

    /* Ролик равняем по тексту, а не по окну: колонки в сетке стоят по
       верху, высота у них разная, и по центру окна ролик уезжал
       относительно соседней колонки. Теперь у обеих колонок общая
       середина. Двигаем отступом, а не сдвигом: transform у ролика занят
       появлением сцены. */
    if (!video) return;
    var videoHeight = video.offsetHeight;
    if (!videoHeight || !sceneHeight) { video.style.marginTop = ""; return; }
    var shift = Math.round((sceneHeight - videoHeight) / 2);
    shift = Math.max(shift, Math.round(header + 16 - top));   // выше шапки не поднимаем
    video.style.marginTop = shift + "px";

    updateArrow(video);
  }

  /**
   * Раскладка «верх прибит, низ по центру».
   *
   * Верхняя группа — надпись над именем, имя и подзаголовок — стоит у
   * верхнего края. Ниже идут описание с кнопками, а по ходу сцены — надпись
   * о ролике с пересказом; они центрируются в оставшейся высоте.
   *
   * Отступы ставятся полями, а не выравниванием: во время сцены описание
   * сжимается до нуля, но своё поле сохраняет — поэтому «мостик» считает
   * своё положение с оглядкой на него. При выключенном переключателе поля
   * снимаются, и всё возвращается к сплошному центрированию.
   */
  function centerBelowTop(text, lead, bridge, top, ticker) {
    if (!topAnchored) {
      if (lead) lead.style.marginTop = "";
      if (bridge) bridge.style.marginTop = "";
      return;
    }
    var role = $(".hero-role");
    if (!role || !lead) return;

    var textTop = text.getBoundingClientRect().top;
    var topGroup = role.getBoundingClientRect().bottom - textTop;   // до конца подзаголовка
    // свободная высота под верхней группой; титры внизу оставляем себе
    var band = window.innerHeight - ticker - top - topGroup - 24;

    var savedHeight = lead.style.height, savedMargin = lead.style.marginTop;
    lead.style.marginTop = "0px";
    lead.style.height = "auto";
    var leadHeight = lead.getBoundingClientRect().height;
    lead.style.height = savedHeight;

    var leadMargin = Math.max(24, Math.round((band - leadHeight) / 2));
    lead.style.marginTop = leadMargin + "px";

    if (!bridge || bridge.hidden) return;
    bridge.style.marginTop = "0px";
    var bridgeHeight = bridge.getBoundingClientRect().height;
    /* В конце сцены описание сжато до нуля, но его поле остаётся — значит
       «мостику» достаётся разница, и она бывает отрицательной: он выше
       описания и его центр приходится поднять. Выше подзаголовка всё же
       не пускаем — там начинается верхняя группа. */
    var bridgeMargin = Math.round((band - bridgeHeight) / 2) - leadMargin;
    bridgeMargin = Math.max(bridgeMargin, 24 - leadMargin);
    bridge.style.marginTop = bridgeMargin + "px";
  }

  /**
   * Ширина стрелки: от её начала (сразу за текстом) до плитки минус
   * зазор. В CSS этого не выразить — расстояние зависит от ширины обеих
   * колонок, а они резиновые. Пропорции рисунка сохраняются: высота
   * растёт вместе с шириной.
   */
  function updateArrow(video) {
    var arrow = $("#heroIntroArrow");
    if (!arrow || !video) return;
    if (!isActive() || getComputedStyle(arrow).display === "none") {
      arrow.style.width = "";
      return;
    }
    arrow.style.width = "";                     // сначала вернём значение из CSS
    var from = arrow.getBoundingClientRect().left;
    var to = video.getBoundingClientRect().left;
    // остриё не упирается в кадр: зазор растёт вместе с окном
    var gap = Math.min(90, Math.max(40, Math.round(window.innerWidth * 0.03)));
    var width = Math.round(to - from - gap);
    if (width > 150) arrow.style.width = width + "px";
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
    // метки кадров кликабельны, поэтому их мало погасить — на погасшие
    // нельзя и нажимать
    var frames = $(".hero-frames");
    if (frames) frames.style.pointerEvents = swap > 0.6 ? "none" : "";

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
    /* Описание раздела и пересказ ролика говорят одно и то же. В «мостике»
       место дорого, поэтому при заполненном пересказе описание убираем. */
    var digest = C.introDigest(intro);
    $("#heroIntroSub").textContent = intro.subheading || "";
    $("#heroIntroSub").hidden = !!digest;
    $("#heroIntroCue").textContent = C.state.lang === "en" ? "Play the video" : "Смотреть ролик";
    $("#heroIntroDigest").innerHTML = digest;

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
      updateStickyTop();
      onScroll();
    }, { passive: true });
    // шрифты меняют высоту текста уже после первой отрисовки
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateStickyTop);
    }
    /* Высоту ролику проставляет JS по пропорциям кадра — то есть позже,
       чем считается раскладка. Пересчитываем, когда она появится. */
    var videoNode = $("#heroIntroVideo");
    if (videoNode && window.ResizeObserver) {
      new ResizeObserver(function () { updateStickyTop(); }).observe(videoNode);
    }
    updateStickyTop();
    paint();
  }

  /** Вызывается из page-home.js после каждого рендера (в т.ч. смены языка). */
  function render() {
    if (!enabled) return;
    start();
    renderIntro();
    leadHeight = 0;   // текст мог смениться (например, при переключении языка)
    updateStickyTop();
    paint();
  }

  return { render: render, enabled: enabled };
})();
