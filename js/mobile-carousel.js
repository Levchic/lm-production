/**
 * Мобильная карусель.
 *
 * На узком экране сетки карточек, галереи и списки-окошки листаются вбок:
 * контейнеру добавляется класс .mcar (вся раскладка — в css/styles.css),
 * а следом за ним появляется строка точек-индикаторов. Разметка страниц
 * не меняется — значит, фильтры портфолио, лайтбокс и раскрывающиеся
 * услуги продолжают работать как были.
 *
 * Список шагов рабочего процесса (.process-steps) сознательно не трогаем:
 * там важна вертикальная последовательность.
 */
(function () {
  "use strict";

  /* Контейнеры, которые превращаются в ленту. Порядок не важен: каждый
     элемент обслуживается своим контроллером. */
  var SELECTOR = [
    ".card-grid",      /* портфолио, услуги, новости */
    ".media-grid",     /* фото и видео в кейсе и новости */
    ".audio-list",     /* аудио в кейсе */
    ".case-stats"      /* цифры в шапке кейса */
  ].join(", ");

  var MOBILE = "(max-width: 760px)";
  var mq = window.matchMedia(MOBILE);
  var carousels = [];

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /** Скрытые карточки (фильтр портфолио) в счёт страниц не идут. */
  function visibleChildren(node) {
    return Array.prototype.filter.call(node.children, function (child) {
      return child.getClientRects().length > 0;
    });
  }

  function Carousel(node) {
    this.node = node;
    this.on = false;

    this.dots = document.createElement("div");
    this.dots.className = "mcar-dots";
    this.dots.hidden = true;
    node.parentNode.insertBefore(this.dots, node.nextSibling);

    var self = this;
    this.onScroll = function () {
      window.clearTimeout(self._paintTimer);
      self._paintTimer = window.setTimeout(function () { self.paint(); }, 90);
    };
    this.onChange = function () {
      window.clearTimeout(self._buildTimer);
      self._buildTimer = window.setTimeout(function () { if (self.on) self.build(); }, 60);
    };
    this.onKey = function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); self.go(self.index() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); self.go(self.index() - 1); }
    };

    /* Содержимое приходит из JS и перерисовывается при смене языка или
       фильтра — следим за детьми контейнера и за их классами. */
    this.observer = new MutationObserver(function (records) {
      var touched = records.some(function (r) { return r.type === "childList" || r.target !== node; });
      if (touched) self.onChange();
    });
    this.observer.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden"]
    });
  }

  /** Шаг прокрутки — расстояние между началами соседних карточек. */
  Carousel.prototype.step = function () {
    var list = visibleChildren(this.node);
    if (list.length < 2) return this.node.clientWidth;
    return list[1].offsetLeft - list[0].offsetLeft;
  };

  Carousel.prototype.index = function () {
    var s = this.step();
    return s ? Math.round(this.node.scrollLeft / s) : 0;
  };

  Carousel.prototype.lastIndex = function () {
    var s = this.step();
    if (!s) return 0;
    return Math.max(0, Math.round((this.node.scrollWidth - this.node.clientWidth) / s));
  };

  Carousel.prototype.go = function (index) {
    this.node.scrollTo({ left: Math.max(0, index) * this.step(), behavior: "smooth" });
  };

  Carousel.prototype.paint = function () {
    var i = this.index();
    $all("button", this.dots).forEach(function (dot, k) { dot.classList.toggle("on", k === i); });
  };

  Carousel.prototype.build = function () {
    var self = this;

    /* Список сменился (фильтр портфолио, другой язык) — возвращаем ленту
       к началу, иначе она осталась бы прокрученной в пустоту. */
    var count = visibleChildren(this.node).length;
    if (this._count !== undefined && this._count !== count) this.node.scrollLeft = 0;
    this._count = count;

    var last = this.lastIndex();
    /* Одна карточка (или всё влезло) — листать нечего, точки не нужны. */
    this.dots.hidden = last <= 0;
    this.dots.innerHTML = "";
    if (last <= 0) return;

    for (var i = 0; i <= last; i++) {
      var dot = document.createElement("button");
      dot.type = "button";
      /* подпись без слов — она одинаково читается и в русской, и в
         английской версии сайта */
      dot.setAttribute("aria-label", (i + 1) + " / " + (last + 1));
      (function (index) { dot.onclick = function () { self.go(index); }; })(i);
      this.dots.appendChild(dot);
    }
    this.paint();
  };

  Carousel.prototype.enable = function () {
    if (this.on) return;
    this.on = true;
    this.node.classList.add("mcar");
    /* прокручиваемую область должно быть видно и с клавиатуры */
    this.node.setAttribute("tabindex", "0");
    this.node.addEventListener("scroll", this.onScroll, { passive: true });
    this.node.addEventListener("keydown", this.onKey);
  };

  Carousel.prototype.disable = function () {
    if (!this.on) return;
    this.on = false;
    this.node.removeEventListener("scroll", this.onScroll);
    this.node.removeEventListener("keydown", this.onKey);
    this.node.scrollLeft = 0;
    this.node.classList.remove("mcar");
    this.node.removeAttribute("tabindex");
    this.dots.hidden = true;
    this.dots.innerHTML = "";
  };

  function apply() {
    var mobile = mq.matches;
    carousels.forEach(function (c) {
      if (mobile) { c.enable(); c.build(); } else { c.disable(); }
    });
  }

  function init() {
    carousels = $all(SELECTOR).map(function (node) { return new Carousel(node); });
    apply();

    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(apply, 150);
    });
    /* Картинки в галереях догружаются позже и меняют ширину ленты. */
    window.addEventListener("load", apply);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
