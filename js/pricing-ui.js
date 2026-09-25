/**
 * КАЛЬКУЛЯТОР СТОИМОСТИ — интерфейс
 * =================================
 * Считает js/pricing-calc.js, цифры лежат в js/pricing-config.js.
 * Здесь только форма, смета и пересчёт на каждое изменение.
 *
 * ПОРЯДОК ШАГОВ. Сначала тип работы, потом объём, потом этапы, и лишь
 * затем сложность. Так человек отвечает от знакомого к специальному:
 * «мне нужна аранжировка номера» он знает сразу, а на вопрос про divisi
 * с ходу не ответит. Заодно к моменту вопросов о сложности уже известно,
 * какие из них вообще уместны — про хор не спрашиваем, если считается
 * один нотный набор.
 *
 * ДВА РЕЖИМА.
 *   Публичный — итог показывается вилкой, ставки не выводятся нигде.
 *   Рабочий (pro) — точная сумма, ставка в каждой строке, минуты
 *     исходника и круги правок. Включается services.html#pro,
 *     запоминается в браузере, выключается services.html#pro-off.
 *   Это не защита: расчёт идёт в браузере, файл со ставками читаем.
 *   Смысл в том, чтобы прайс не был опубликован.
 *
 * СОСТОЯНИЕ живёт в модуле, а не в DOM: при смене языка страница
 * перерисовывается целиком (см. switchLang в common.js), и введённые
 * данные должны пережить перерисовку.
 */

window.PricingUI = (function () {
  "use strict";

  var PRO_KEY = "price-pro";
  var NBSP = " ";

  var state = {
    workType: "arrangement",
    manualCategory: null,   /* null — считать по вопросам */
    answers: {},
    minutes: 4,
    pieces: 1,
    pages: 12,
    sourceMinutes: "",
    modules: {},
    units: {},
    variants: {},
    addons: {},
    urgency: "normal",
    sources: false,
    purpose: null,          /* null — цель не выбрана, ступень стоит вручную */
    rightsTier: "once",
    rightsAddons: {},
    client: "person",
    segment: false,
    extraRevisions: 0
  };
  var initialized = false;
  var pro = false;

  var C, cfg, Calc, lang, root;

  /* ---------- Мелкие помощники ---------- */

  function L(obj) {
    if (!obj) return "";
    return obj[lang] !== undefined ? obj[lang] : obj.ru;
  }

  /**
   * Рубли с разделителем разрядов. В русской версии разряды делит
   * неразрывный пробел, в английской — запятая: в остальном контенте
   * страницы цены записаны так же («от 3 000 ₽» / «from 3,000 ₽»).
   */
  function money(value) {
    var n = Math.round(Number(value) || 0);
    var sep = lang === "en" ? "," : NBSP;
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) + NBSP + "₽";
  }

  function num(value) {
    return String(value).replace(".", lang === "ru" ? "," : ".");
  }

  /** «1 номер», «2 номера», «10 номеров» — иначе смета читается как черновик. */
  function plural(n, key) {
    var forms = L(TXT[key]);
    if (lang !== "ru") return forms[n === 1 ? 0 : 1];
    var tail = n % 10, hundred = n % 100;
    if (tail === 1 && hundred !== 11) return forms[0];
    if (tail >= 2 && tail <= 4 && (hundred < 10 || hundred >= 20)) return forms[1];
    return forms[2];
  }

  function esc(s) { return C.esc(s); }

  /* ---------- Тексты интерфейса ----------
     Живут здесь, а не в content.js: они намертво связаны со структурой
     формы, и редактировать их из админки без риска сломать расчёт
     нельзя. Тексты самого раздела — как обычно, в content.js. */
  var TXT = {
    step1: { ru: "Что нужно сделать", en: "What needs doing" },
    step1Sub: {
      ru: "Выберите ближайший тип работы — этапы и вопросы подстроятся под него. Всё можно поправить дальше.",
      en: "Pick the nearest type of job — the stages and questions adjust to it. Everything stays editable."
    },
    step2: { ru: "Объём", en: "Scope" },
    step2Sub: {
      ru: "Сколько всего музыки и на сколько отдельных номеров она разбита.",
      en: "How much music there is in total, and how many separate numbers it splits into."
    },
    step3: { ru: "Этапы работы", en: "Stages of work" },
    step3Sub: {
      ru: "Отмечен нужный минимум. Снимайте лишнее и добавляйте недостающее — платить придётся только за отмеченное.",
      en: "The necessary minimum is ticked. Remove what you don't need, add what's missing — you pay for what is ticked."
    },
    step4: { ru: "Сложность материала", en: "Complexity of the material" },
    step4Sub: {
      ru: "Вопросы подобраны под выбранные этапы. Отвечайте примерно — категорию всё равно уточним по нотам.",
      en: "The questions follow the stages you picked. Rough answers are fine — the category is confirmed against the score anyway."
    },
    step5: { ru: "Срок и сдача", en: "Timeline and delivery" },
    step5Sub: {
      ru: "Срок считается от передачи материала и предоплаты, а не от дня договорённости.",
      en: "The deadline runs from handover of the material and the advance, not from the day we agree."
    },
    step6: { ru: "Права на результат", en: "Rights to the result" },
    step6Sub: {
      ru: "Разовое исполнение входит в цену. Запись, гастроли или реклама стоят дороже — выберите, что ближе.",
      en: "A single performance is included in the price. Recording, touring or advertising cost more — pick the closest."
    },
    step7: { ru: "Заказчик и документы", en: "The client and the paperwork" },
    step7Sub: {
      ru: "Ставки за работу от этого не меняются, отличается только налог.",
      en: "This does not change the rates for the work, only the tax."
    },

    manualOn: { ru: "Задать категорию вручную", en: "Set the category by hand" },
    manualOff: { ru: "Вернуться к вопросам", en: "Back to the questions" },
    manualHint: {
      ru: "Если категория уже известна по прошлым работам — поставьте её сразу.",
      en: "If you already know the category from previous work, set it directly."
    },

    minutesLabel: { ru: "Минут музыки", en: "Minutes of music" },
    minutesHint: { ru: "Общая длительность, можно дробно — 15,7", en: "Total duration, decimals allowed — 15.7" },
    piecesLabel: { ru: "Номеров в проекте", en: "Numbers in the project" },
    unitLabel: { ru: "Чем мерить объём", en: "How to measure the job" },
    bundledMark: { ru: "в связке", en: "bundled" },
    piecesHint: {
      ru: "Отдельных пьес, которые сдаются своим комплектом нот",
      en: "Separate pieces, each delivered as its own set of parts"
    },
    piecesWhy: {
      ru: "Десять коротких номеров дороже одного длинного той же общей длительности: у каждого свой проект, свой вывод партитуры и свой комплект партий.",
      en: "Ten short numbers cost more than one long one of the same total length: each has its own project, its own score export and its own set of parts."
    },
    sourceMinutesLabel: { ru: "Минут исходника для снятия", en: "Source minutes to transcribe" },
    sourceMinutesHint: { ru: "Если отличается от общей длительности", en: "If different from the total duration" },
    revisionsLabel: { ru: "Дополнительные круги правок", en: "Extra revision rounds" },
    revisionsHint: { ru: "Два круга входят в стоимость", en: "Two rounds are included" },
    urgencyLabel: { ru: "Срок", en: "Timeline" },

    resultLabel: { ru: "Предварительная оценка", en: "Preliminary estimate" },
    resultExactLabel: { ru: "Расчёт", en: "Quote" },
    emptyTitle: { ru: "Смета появится здесь", en: "The estimate will appear here" },
    emptyText: {
      ru: "Отметьте хотя бы один этап — расчёт соберётся сразу, отправлять ничего не нужно.",
      en: "Tick at least one stage — the total appears at once, nothing is submitted."
    },
    categoryWord: { ru: "Категория", en: "Category" },
    urgencyLine: { ru: "Срочность", en: "Rush" },
    sourcesLine: { ru: "Передача исходников", en: "Editable project files" },
    rightsLine: { ru: "Объём прав", en: "Scope of rights" },
    segmentLine: { ru: "Учебная скидка", en: "Educational discount" },
    taxLine: { ru: "В том числе НПД", en: "Including tax on professional income" },
    tierManual: { ru: "Или задайте объём прав сами", en: "Or set the scope of rights yourself" },
    minimumLine: { ru: "До минимального заказа", en: "Up to the project minimum" },
    minimumNote: {
      ru: "Любая работа требует согласования, подготовки и сдачи, поэтому проект не может стоить меньше минимума.",
      en: "Any job needs briefing, setup and delivery, so a project cannot cost less than the minimum."
    },
    revisionsLine: { ru: "Дополнительные правки", en: "Extra revisions" },
    totalLine: { ru: "Итого", en: "Total" },
    disclaimer: {
      ru: "Расчёт предварительный. Точная стоимость определяется после разбора материала: категория может измениться, когда виден реальный состав и фактура.",
      en: "This is a preliminary estimate. The exact figure is set after reviewing the material: the category can change once the real ensemble and texture are visible."
    },
    priceListNote: {
      ru: "Полный прайс-лист со ставками по всем этапам вышлю по запросу.",
      en: "The full rate card for every stage is available on request."
    },
    ctaExact: { ru: "Запросить точный расчёт", en: "Request an exact quote" },
    copy: { ru: "Скопировать расчёт", en: "Copy the estimate" },
    copied: { ru: "Скопировано", en: "Copied" },
    copyFail: { ru: "Не вышло — выделите вручную", en: "Failed — select it manually" },
    copyHeader: { ru: "Предварительный расчёт", en: "Preliminary estimate" },
    proBadge: { ru: "Рабочий режим · точные цифры", en: "Working mode · exact figures" },
    proOff: { ru: "Выключить", en: "Turn off" },
    perMinute: { ru: "мин", en: "min" },
    perPiece: { ru: "ном.", en: "pcs" },
    /* Три формы для русского счёта, две для английского. */
    pieceForms: { ru: ["номер", "номера", "номеров"], en: ["number", "numbers"] },
    discountMark: { ru: "со скидкой", en: "discounted" },
    blockedWord: { ru: "Не нужен здесь", en: "Not needed here" },
    /* Коротко, чтобы метка помещалась рядом с семизначной вилкой
       на экране шириной 375 px. */
    barLabel: { ru: "Примерно", en: "Approx." },
    barLabelExact: { ru: "Расчёт", en: "Quote" },
    barAction: { ru: "Показать смету", en: "Show the breakdown" }
  };

  function txt(key) { return L(TXT[key]); }

  /* ---------- Режим «для себя» ---------- */

  function detectPro() {
    var hash = location.hash, search = location.search;
    try {
      if (hash === "#pro-off" || /[?&]pro=0/.test(search)) {
        localStorage.removeItem(PRO_KEY);
        return false;
      }
      if (hash === "#pro" || /[?&]pro=1/.test(search)) {
        localStorage.setItem(PRO_KEY, "1");
        return true;
      }
      return localStorage.getItem(PRO_KEY) === "1";
    } catch (e) {
      return hash === "#pro";
    }
  }

  /* ---------- Производные от состояния ---------- */

  function workType() {
    return cfg.workTypes.filter(function (w) { return w.id === state.workType; })[0] || cfg.workTypes[0];
  }

  /** Этапы, показываемые при выбранном типе работы. */
  function visibleModules() {
    var allowed = workType().available;
    return cfg.modules.filter(function (m) {
      return !allowed || allowed.indexOf(m.id) !== -1;
    });
  }

  /** Нужно ли поле хронометража: не всякая работа меряется минутами. */
  function needsMinutes() {
    var chosen = cfg.modules.filter(function (m) { return state.modules[m.id]; });
    if (!chosen.length) return true;
    return chosen.some(function (m) {
      if (m.kind === "per-unit") return currentUnit(m).qtyField === "minutes";
      return m.kind !== "per-piece";
    });
  }

  /** Единица, которой сейчас меряется этап с несколькими единицами. */
  function currentUnit(mod) {
    if (!mod.units) return null;
    var id = state.units[mod.id];
    return mod.units.filter(function (u) { return u.id === id; })[0] || mod.units[0];
  }

  /** Идёт ли этап «в нагрузку» к уже выбранному соседу. */
  function isBundled(mod) {
    return (mod.bundledWith || []).some(function (id) { return state.modules[id]; });
  }

  function currentInput() {
    return {
      category: state.manualCategory,
      answers: state.answers,
      minutes: needsMinutes() ? state.minutes : 0,
      pieces: state.pieces,
      pages: state.pages,
      units: state.units,
      sourceMinutes: pro ? state.sourceMinutes : "",
      modules: state.modules,
      variants: state.variants,
      addons: state.addons,
      urgency: state.urgency,
      sources: state.sources,
      rightsTier: state.rightsTier,
      rightsAddons: state.rightsAddons,
      client: state.client,
      segment: state.segment,
      extraRevisions: pro ? state.extraRevisions : 0
    };
  }

  function result() { return Calc.calculate(currentInput(), cfg); }

  /* ---------- Шаг 1. Тип работы ---------- */

  function typesHTML() {
    return '<div class="calc-types">' +
      cfg.workTypes.map(function (w) {
        return '<button type="button" class="calc-type' + (state.workType === w.id ? " is-on" : "") +
               '" data-type="' + esc(w.id) + '" aria-pressed="' + (state.workType === w.id) + '">' +
          '<span class="calc-type-title">' + esc(L(w.label)) + "</span>" +
          '<span class="calc-type-desc">' + esc(L(w.description)) + "</span>" +
        "</button>";
      }).join("") +
    "</div>";
  }

  /* ---------- Шаг 2. Объём ---------- */

  function scopeHTML() {
    var showMinutes = needsMinutes();
    return '<div class="calc-scope">' +
      (showMinutes
        ? '<label class="calc-field">' +
            "<span>" + esc(txt("minutesLabel")) + "<em>" + esc(txt("minutesHint")) + "</em></span>" +
            '<input type="text" inputmode="decimal" value="' + esc(num(state.minutes)) +
              '" data-field="minutes" class="calc-input" autocomplete="off">' +
          "</label>"
        : "") +
      '<label class="calc-field">' +
        "<span>" + esc(txt("piecesLabel")) + "<em>" + esc(txt("piecesHint")) + "</em></span>" +
        '<input type="number" min="1" step="1" value="' + state.pieces +
          '" data-field="pieces" class="calc-input" autocomplete="off">' +
      "</label>" +
      '<p class="calc-hint-block">' + esc(txt("piecesWhy")) + "</p>" +
    "</div>";
  }

  /* ---------- Шаг 3. Этапы ---------- */

  function addonHTML(mod, addon) {
    var key = mod.id + ":" + addon.id;
    var id = "add-" + mod.id + "-" + addon.id;
    return '<label class="calc-check calc-check--sm" for="' + id + '">' +
      '<input type="checkbox" id="' + id + '" data-addon="' + esc(key) + '"' +
        (state.addons[key] ? " checked" : "") + ">" +
      '<span class="calc-check-box" aria-hidden="true"></span>' +
      '<span class="calc-module-text">' +
        '<span class="calc-addon-title">' + esc(L(addon.label)) + "</span>" +
        (addon.hint ? '<span class="calc-module-desc">' + esc(L(addon.hint)) + "</span>" : "") +
      "</span>" +
      (pro ? '<span class="calc-module-unit calc-module-unit--rate">+' +
             Math.round(addon.factor * 100) + "%</span>" : "") +
    "</label>";
  }

  /** Ставка этапа строкой — только в рабочем режиме. */
  function moduleRateHTML(mod, category) {
    if (!pro) {
      /* У этапа с несколькими единицами подпись показывает выбранную,
         иначе справа висит бессмысленное «по выбранной единице». */
      var plain = mod.kind === "per-unit"
        ? L(currentUnit(mod).label).toLowerCase()
        : L(mod.unit);
      return '<span class="calc-module-unit">' + esc(plain) + "</span>";
    }
    var text;
    if (mod.kind === "per-minute-category") {
      text = money(isBundled(mod) && typeof mod.bundledRate === "number"
        ? mod.bundledRate : mod.rate[category]) + " / " + txt("perMinute");
    }
    else if (mod.kind === "per-minute-flat") text = money(mod.rate) + " / " + txt("perMinute");
    else if (mod.kind === "program-tier") text = money(mod.base) + " + " + money(mod.perExtraMinute) + " / " + txt("perMinute");
    else if (mod.kind === "share-of-module") text = money(Calc.moduleById(mod.ofModule, cfg).rate[category] * mod.factor) + " / " + txt("perMinute");
    else if (mod.kind === "per-piece") text = money(mod.variants[0].rate) + " / " + txt("perPiece");
    else if (mod.kind === "per-unit") {
      var unit = currentUnit(mod);
      var variant = (mod.variants || []).filter(function (v) {
        return v.id === (state.variants[mod.id] || mod.variants[0].id);
      })[0] || mod.variants[0];
      text = money(unit.rate[variant.id]) + " / " + L(unit.short);
    }
    else text = L(mod.unit);
    return '<span class="calc-module-unit calc-module-unit--rate" data-rate-for="' + mod.id + '">' + esc(text) + "</span>";
  }

  function modulesHTML(category) {
    return '<div class="calc-modules">' + visibleModules().map(function (mod) {
      var on = !!state.modules[mod.id];
      var conflict = on ? null : Calc.conflictsFor(mod.id, state.modules, cfg);
      var blocked = !!conflict;
      var extras = "";

      /* Подполя раскрываются только у выбранного этапа: пустая форма
         не должна пугать количеством вопросов. */
      if (on && mod.units) {
        var unit = currentUnit(mod);
        extras += '<div class="calc-subfield">' +
          '<span class="calc-subfield-label">' + esc(txt("unitLabel")) + "</span>" +
          '<div class="calc-subgroup">' +
            mod.units.map(function (u) {
              var id = "unit-" + mod.id + "-" + u.id;
              return '<input type="radio" class="calc-radio" id="' + id + '" name="unit-' + mod.id + '"' +
                     ' data-unit="' + mod.id + '" value="' + u.id + '"' + (u.id === unit.id ? " checked" : "") + ">" +
                     '<label class="calc-option calc-option--sm" for="' + id + '">' + esc(L(u.label)) + "</label>";
            }).join("") +
          "</div></div>";

        /* Минуты и номера человек уже ввёл выше; своё поле нужно только
           той единице, которой в шаге «Объём» нет. */
        if (unit.qtyField === "pages") {
          extras += '<label class="calc-field calc-field--inline">' +
              "<span>" + esc(L(unit.qtyLabel)) + "</span>" +
              '<input type="text" inputmode="numeric" value="' + esc(String(state.pages)) +
                '" data-field="pages" class="calc-input calc-input--narrow">' +
            "</label>";
        }
      }

      /* Состояние исходника. У аудиоверсии его спрашивают, только когда
         она заказана отдельно: в связке партитура уже в работе. */
      if (on && mod.variants && !(mod.bundledWith && isBundled(mod))) {
        extras += '<div class="calc-subfield">' +
          (mod.variantsLabel
            ? '<span class="calc-subfield-label">' + esc(L(mod.variantsLabel)) + "</span>"
            : "") +
          '<div class="calc-subgroup">' +
            mod.variants.map(function (v) {
              var id = "var-" + mod.id + "-" + v.id;
              var checked = (state.variants[mod.id] || mod.variants[0].id) === v.id;
              return '<input type="radio" class="calc-radio" id="' + id + '" name="var-' + mod.id + '"' +
                     ' data-variant="' + mod.id + '" value="' + v.id + '"' + (checked ? " checked" : "") + ">" +
                     '<label class="calc-option calc-option--sm" for="' + id + '">' +
                       '<span class="calc-option-main">' + esc(L(v.label)) + "</span>" +
                       (v.note ? '<span class="calc-option-note">' + esc(L(v.note)) + "</span>" : "") +
                     "</label>";
            }).join("") +
          "</div></div>";
      }

      /* А в связке — вместо вопроса объяснение, почему ставка ниже. */
      if (on && mod.bundledWith && isBundled(mod) && mod.bundledNote) {
        extras += '<p class="calc-subnote">' + esc(L(mod.bundledNote)) + "</p>";
      }

      if (on) {
        extras += (mod.addons || []).map(function (a) { return addonHTML(mod, a); }).join("");
      }
      if (on && pro && mod.minutesField === "sourceMinutes") {
        extras += '<label class="calc-field calc-field--inline">' +
            "<span>" + esc(txt("sourceMinutesLabel")) + "<em>" + esc(txt("sourceMinutesHint")) + "</em></span>" +
            '<input type="text" inputmode="decimal" placeholder="' + esc(num(state.minutes)) + '" value="' +
              esc(state.sourceMinutes) + '" data-field="sourceMinutes" class="calc-input calc-input--narrow">' +
          "</label>";
      }

      return '<div class="calc-module' + (on ? " is-on" : "") + (blocked ? " is-blocked" : "") + '">' +
        '<label class="calc-check" for="mod-' + mod.id + '">' +
          '<input type="checkbox" id="mod-' + mod.id + '" data-module="' + mod.id + '"' +
            (on ? " checked" : "") + (blocked ? " disabled" : "") + ">" +
          '<span class="calc-check-box" aria-hidden="true"></span>' +
          '<span class="calc-module-text">' +
            '<span class="calc-module-title">' + esc(L(mod.title)) + "</span>" +
            '<span class="calc-module-desc">' + esc(L(mod.description)) + "</span>" +
          "</span>" +
          moduleRateHTML(mod, category) +
        "</label>" +
        (blocked && conflict.reason
          ? '<p class="calc-module-blocked"><span>' + esc(txt("blockedWord")) + "</span>" +
            esc(L(conflict.reason)) + "</p>"
          : "") +
        (extras ? '<div class="calc-module-extra">' + extras + "</div>" : "") +
      "</div>";
    }).join("") + "</div>";
  }

  /* ---------- Шаг 4. Сложность ---------- */

  function questionsHTML() {
    var questions = Calc.activeQuestions(state.modules, cfg);
    if (!questions.length) return "";
    return '<div class="calc-questions">' + questions.map(function (q) {
      return '<fieldset class="calc-question">' +
        "<legend>" + esc(L(q.label)) +
          (q.hint ? '<span class="calc-question-hint">' + esc(L(q.hint)) + "</span>" : "") +
        "</legend>" +
        '<div class="calc-options">' +
          q.options.map(function (o, i) {
            var id = "q-" + q.id + "-" + i;
            var checked = state.answers[q.id] === o.score ||
                          (state.answers[q.id] === undefined && o.score === 0);
            return '<input type="radio" class="calc-radio" id="' + id + '" name="q-' + esc(q.id) + '"' +
                   ' data-question="' + esc(q.id) + '" value="' + o.score + '"' + (checked ? " checked" : "") + ">" +
                   '<label class="calc-option" for="' + id + '">' +
                     '<span class="calc-option-main">' + esc(L(o.label)) + "</span>" +
                     (o.note ? '<span class="calc-option-note">' + esc(L(o.note)) + "</span>" : "") +
                     (pro ? '<span class="calc-option-score">+' + o.score + "</span>" : "") +
                   "</label>";
          }).join("") +
        "</div></fieldset>";
    }).join("") + "</div>";
  }

  function manualHTML() {
    return '<p class="calc-hint-block">' + esc(txt("manualHint")) + "</p>" +
      '<div class="calc-options calc-options--wide">' +
      cfg.category.order.map(function (id) {
        return '<input type="radio" class="calc-radio" id="cat-' + id + '" name="manual-category" value="' + id + '"' +
               (state.manualCategory === id ? " checked" : "") + ">" +
               '<label class="calc-option" for="cat-' + id + '">' +
                 '<span class="calc-option-main"><strong>' + id + "</strong> " +
                   esc(L(cfg.category.names[id])) + "</span></label>";
      }).join("") +
    "</div>";
  }

  /* ---------- Шаг 5. Срок ---------- */

  function timelineHTML() {
    return '<div class="calc-options calc-options--wide">' +
      cfg.urgency.map(function (u) {
        var id = "urg-" + u.id;
        return '<input type="radio" class="calc-radio" id="' + id + '" name="urgency" value="' + u.id + '"' +
               (state.urgency === u.id ? " checked" : "") + ">" +
               '<label class="calc-option" for="' + id + '">' +
                 '<span class="calc-option-main">' + esc(L(u.label)) + "</span>" +
                 '<span class="calc-option-note">' + esc(L(u.hint)) + "</span></label>";
      }).join("") +
    "</div>" +
    '<div class="calc-modules calc-modules--flat">' +
      '<div class="calc-module' + (state.sources ? " is-on" : "") + '">' +
        '<label class="calc-check" for="opt-sources">' +
          '<input type="checkbox" id="opt-sources" data-field="sources"' + (state.sources ? " checked" : "") + ">" +
          '<span class="calc-check-box" aria-hidden="true"></span>' +
          '<span class="calc-module-text">' +
            '<span class="calc-module-title">' + esc(L(cfg.sources.label)) + "</span>" +
            '<span class="calc-module-desc">' + esc(L(cfg.sources.hint)) + "</span>" +
          "</span>" +
          (pro ? '<span class="calc-module-unit calc-module-unit--rate">×' + num(cfg.sources.factor) + "</span>" : "") +
        "</label>" +
      "</div>" +
    "</div>" +
    (pro
      ? '<label class="calc-field calc-field--inline calc-field--pro">' +
          "<span>" + esc(txt("revisionsLabel")) + "<em>" + esc(txt("revisionsHint")) + "</em></span>" +
          '<input type="number" min="0" step="1" value="' + state.extraRevisions +
            '" data-field="extraRevisions" class="calc-input calc-input--narrow">' +
        "</label>"
      : "");
  }

  /* ---------- Шаг 6. Права ---------- */

  /**
   * Цель использования не имеет своего коэффициента: она подставляет
   * ступень прав и надбавки к ней, а платится ступень. Иначе «цель»,
   * «периодичность» и «объём прав» перемножились бы втроём и дали ×4
   * на ровном месте.
   */
  function rightsHTML() {
    var r = cfg.rights;
    var capped = state.segment && cfg.segment.maxTier;
    var order = r.tiers.map(function (t) { return t.id; });
    var capIndex = order.indexOf(cfg.segment.maxTier);

    var purposes = '<fieldset class="calc-question">' +
      "<legend>" + esc(L(r.purposeLabel)) +
        (pro ? '<span class="calc-question-hint">' + esc(L(r.purposeHint)) + "</span>" : "") +
      "</legend>" +
      '<div class="calc-options">' +
        r.purposes.map(function (pu, i) {
          var id = "purpose-" + pu.id;
          return '<input type="radio" class="calc-radio" id="' + id + '" name="purpose"' +
                 ' data-purpose="' + esc(pu.id) + '" value="' + esc(pu.id) + '"' +
                 (state.purpose === pu.id ? " checked" : "") + ">" +
                 '<label class="calc-option" for="' + id + '">' +
                   '<span class="calc-option-main">' + esc(L(pu.label)) + "</span>" +
                 "</label>";
        }).join("") +
      "</div></fieldset>";

    var tiers = '<fieldset class="calc-question">' +
      "<legend>" + esc(L(r.tierLabel)) +
        '<span class="calc-question-hint">' + esc(txt("tierManual")) + "</span>" +
      "</legend>" +
      '<div class="calc-options calc-options--wide">' +
        r.tiers.map(function (t, i) {
          var id = "tier-" + t.id;
          /* Со скидкой ступень срезана сверху: показываем это гашением,
             а не молчаливой подменой при расчёте. */
          var blocked = capped && i > capIndex;
          return '<input type="radio" class="calc-radio" id="' + id + '" name="rights-tier"' +
                 ' data-tier="' + esc(t.id) + '" value="' + esc(t.id) + '"' +
                 (state.rightsTier === t.id ? " checked" : "") + (blocked ? " disabled" : "") + ">" +
                 '<label class="calc-option' + (blocked ? " is-blocked" : "") + '" for="' + id + '">' +
                   '<span class="calc-option-main">' + esc(L(t.label)) + "</span>" +
                   '<span class="calc-option-note">' + esc(L(t.hint)) + "</span>" +
                   (pro ? '<span class="calc-option-score">×' + num(t.factor) + "</span>" : "") +
                 "</label>";
        }).join("") +
      "</div></fieldset>";

    var addons = '<fieldset class="calc-question">' +
      "<legend>" + esc(L(r.addonsLabel)) + "</legend>" +
      '<div class="calc-modules calc-modules--flat">' +
        r.addons.map(function (a) {
          var id = "rights-" + a.id;
          var off = state.segment && (cfg.segment.blockedAddons || []).indexOf(a.id) !== -1;
          return '<div class="calc-module' + (state.rightsAddons[a.id] && !off ? " is-on" : "") +
                 (off ? " is-blocked" : "") + '">' +
            '<label class="calc-check calc-check--sm" for="' + id + '">' +
              '<input type="checkbox" id="' + id + '" data-rights-addon="' + esc(a.id) + '"' +
                (state.rightsAddons[a.id] && !off ? " checked" : "") + (off ? " disabled" : "") + ">" +
              '<span class="calc-check-box" aria-hidden="true"></span>' +
              '<span class="calc-module-text">' +
                '<span class="calc-addon-title">' + esc(L(a.label)) + "</span>" +
                '<span class="calc-module-desc">' + esc(L(a.hint)) + "</span>" +
              "</span>" +
              (pro ? '<span class="calc-module-unit calc-module-unit--rate">+' +
                     Math.round(a.factor * 100) + "%</span>" : "") +
            "</label>" +
          "</div>";
        }).join("") +
      "</div></fieldset>";

    /* Заказчику хватает одного вопроса — как будет звучать музыка: ответ
       сам подставляет ступень и надбавки. Ступени, надбавки и оговорка про
       права на оригинал — в рабочем режиме; про оригинал сказано и в
       условиях работы на странице. */
    if (!pro) {
      return '<div class="calc-questions">' + purposes + "</div>" +
        (capped ? '<p class="calc-note">' + esc(L(cfg.segment.cappedNote)) + "</p>" : "");
    }

    return '<p class="calc-hint-block">' + esc(L(r.warning)) + "</p>" +
      '<div class="calc-questions">' + purposes + tiers + addons + "</div>" +
      (capped ? '<p class="calc-note">' + esc(L(cfg.segment.cappedNote)) + "</p>" : "");
  }

  /* ---------- Шаг 7. Заказчик ---------- */

  function clientHTML() {
    return '<fieldset class="calc-question">' +
      "<legend>" + esc(L(cfg.client.label)) +
        '<span class="calc-question-hint">' + esc(L(cfg.client.hint)) + "</span>" +
      "</legend>" +
      '<div class="calc-options calc-options--wide">' +
        cfg.client.types.map(function (c) {
          var id = "client-" + c.id;
          return '<input type="radio" class="calc-radio" id="' + id + '" name="client"' +
                 ' data-client="' + esc(c.id) + '" value="' + esc(c.id) + '"' +
                 (state.client === c.id ? " checked" : "") + ">" +
                 '<label class="calc-option" for="' + id + '">' +
                   '<span class="calc-option-main">' + esc(L(c.label)) + "</span>" +
                   '<span class="calc-option-note">' + esc(L(c.note)) + "</span>" +
                   (pro ? '<span class="calc-option-score">' + Math.round(c.tax * 100) + "%</span>" : "") +
                 "</label>";
        }).join("") +
      "</div></fieldset>" +
      '<div class="calc-modules calc-modules--flat">' +
        '<div class="calc-module' + (state.segment ? " is-on" : "") + '">' +
          '<label class="calc-check" for="opt-segment">' +
            '<input type="checkbox" id="opt-segment" data-field="segment"' + (state.segment ? " checked" : "") + ">" +
            '<span class="calc-check-box" aria-hidden="true"></span>' +
            '<span class="calc-module-text">' +
              '<span class="calc-module-title">' + esc(L(cfg.segment.label)) + "</span>" +
              '<span class="calc-module-desc">' + esc(L(cfg.segment.hint)) + "</span>" +
            "</span>" +
            (pro ? '<span class="calc-module-unit calc-module-unit--rate">×' + num(cfg.segment.factor) + "</span>" : "") +
          "</label>" +
        "</div>" +
      "</div>";
  }

  /* ---------- Сборка формы ---------- */

  function step(index, titleKey, subKey, body, aside) {
    return '<section class="calc-step">' +
      '<header class="calc-step-head">' +
        '<span class="calc-step-index">' + String(index).padStart(2, "0") + "</span>" +
        '<div class="calc-step-title">' +
          "<h3>" + esc(txt(titleKey)) + "</h3>" +
          (aside || "") +
        "</div>" +
        "<p>" + esc(txt(subKey)) + "</p>" +
      "</header>" + body +
    "</section>";
  }

  function formHTML(res) {
    var manual = state.manualCategory !== null;
    var complexityBody = manual ? manualHTML() : questionsHTML();
    var toggle = '<button type="button" class="calc-linkbtn" data-manual-toggle>' +
      esc(manual ? txt("manualOff") : txt("manualOn")) + "</button>";

    return '<form class="calc-form" novalidate>' +
      step(1, "step1", "step1Sub", typesHTML()) +
      step(2, "step2", "step2Sub", scopeHTML()) +
      step(3, "step3", "step3Sub", modulesHTML(res.category)) +
      (complexityBody ? step(4, "step4", "step4Sub", complexityBody, toggle) : "") +
      step(5, "step5", "step5Sub", timelineHTML()) +
      step(6, "step6", "step6Sub", rightsHTML()) +
      step(7, "step7", "step7Sub", clientHTML()) +
    "</form>";
  }

  /* ---------- Смета ---------- */

  function lineHTML(label, value, cls) {
    return '<li class="calc-line' + (cls ? " " + cls : "") + '">' +
      '<span class="calc-line-label">' + label + "</span>" +
      '<span class="calc-line-value">' + esc(value) + "</span></li>";
  }

  /** Пояснение к строке этапа: «9 000 ₽ × 12 мин» — только в рабочем режиме. */
  function lineMeta(line) {
    if (!pro) return "";
    var parts = [];
    /* Показываем ставку ДО надбавки: рядом стоит «+30%», и умножение
       не должно выглядеть посчитанным дважды. */
    var shownRate = line.addonFactor && line.addonFactor !== 1
      ? line.rate / line.addonFactor
      : line.rate;
    if (line.kind === "program-tier") {
      var mod = Calc.moduleById(line.id, cfg);
      parts.push(money(mod.base) + (line.extraMinutes ? " + " + num(line.extraMinutes) + " " + txt("perMinute") : ""));
    } else if (line.kind === "per-unit") {
      var mod = Calc.moduleById(line.id, cfg);
      var unit = (mod.units || []).filter(function (u) { return u.id === line.unit; })[0];
      if (line.rate) parts.push(money(shownRate));
      if (line.quantity) parts.push(num(line.quantity) + " " + (unit ? L(unit.short) : ""));
    } else {
      if (line.rate) parts.push(money(shownRate));
      if (line.pieces) parts.push(line.pieces + " " + txt("perPiece"));
      else if (line.minutes) parts.push(num(line.minutes) + " " + txt("perMinute"));
    }
    var tail = [];
    if (line.bundled) tail.push(txt("bundledMark"));
    if (line.addonFactor && line.addonFactor !== 1) tail.push("+" + Math.round((line.addonFactor - 1) * 100) + "%");
    if (line.discounted) tail.push(txt("discountMark"));
    var text = parts.join(" × ") + (tail.length ? ", " + tail.join(", ") : "");
    return text ? '<em class="calc-line-meta">' + esc(text) + "</em>" : "";
  }

  /** Шкала A–B–C–D: категория читается взглядом, а не пересчётом баллов. */
  function scaleHTML(res) {
    var current = cfg.category.order.indexOf(res.category);
    return '<div class="calc-scale" role="img" aria-label="' +
      esc(txt("categoryWord") + " " + res.category + " — " + L(cfg.category.names[res.category])) + '">' +
      cfg.category.order.map(function (id, i) {
        var cls = i < current ? " is-passed" : (i === current ? " is-current" : "");
        return '<span class="calc-scale-step' + cls + '" aria-hidden="true">' + id + "</span>";
      }).join("") +
    "</div>";
  }

  function sumText(res) {
    if (pro) return money(res.total);
    if (res.range.low === res.range.high) return money(res.range.low);
    /* Пробелы вокруг тире обычные, а не неразрывные: в узкой карточке
       длинная вилка должна иметь право перенестись на вторую строку,
       иначе она вылезает за край. */
    return money(res.range.low).replace(NBSP + "₽", "") + " — " + money(res.range.high);
  }

  function resultHTML(res) {
    if (res.empty) {
      return '<div class="calc-result-card calc-result-card--empty">' +
        '<p class="calc-result-empty-title">' + esc(txt("emptyTitle")) + "</p>" +
        '<p class="calc-result-empty-text">' + esc(txt("emptyText")) + "</p>" +
      "</div>";
    }

    var lines = res.lines.map(function (line) {
      return lineHTML(esc(L(line.title)) + lineMeta(line), money(line.amount));
    }).join("");

    if (res.delivery) {
      lines += lineHTML(
        esc(L(cfg.delivery.title)) +
        ' <em class="calc-line-meta">' +
          esc((pro ? money(res.delivery.rate) + " × " : "") + res.delivery.pieces + " " + plural(res.delivery.pieces, "pieceForms")) +
        "</em>",
        money(res.delivery.amount));
    }

    var coefficients = "";
    if (res.urgency.amount > 0) {
      coefficients += lineHTML(esc(txt("urgencyLine")) + ' <em class="calc-line-meta">×' + num(res.urgency.factor) + "</em>",
        "+" + NBSP + money(res.urgency.amount), "calc-line--coef");
    }
    if (res.sources.amount > 0) {
      coefficients += lineHTML(esc(txt("sourcesLine")) + ' <em class="calc-line-meta">×' + num(res.sources.factor) + "</em>",
        "+" + NBSP + money(res.sources.amount), "calc-line--coef");
    }
    if (res.rights.amount > 0) {
      var tierName = "";
      cfg.rights.tiers.forEach(function (t) { if (t.id === res.rights.tier) tierName = L(t.label); });
      coefficients += lineHTML(
        esc(txt("rightsLine")) + ' <em class="calc-line-meta">' + esc(tierName) +
          ", ×" + num(res.rights.factor) + "</em>",
        "+" + NBSP + money(res.rights.amount), "calc-line--coef");
    }
    if (res.segment.applied && res.segment.amount !== 0) {
      coefficients += lineHTML(
        esc(txt("segmentLine")) + ' <em class="calc-line-meta">×' + num(res.segment.factor) + "</em>",
        "−" + NBSP + money(Math.abs(res.segment.amount)), "calc-line--coef");
    }
    if (res.revisions.amount > 0) {
      coefficients += lineHTML(esc(txt("revisionsLine")) + ' <em class="calc-line-meta">×' + res.revisions.rounds + "</em>",
        "+" + NBSP + money(res.revisions.amount), "calc-line--coef");
    }
    if (res.intake) {
      coefficients += lineHTML(
        esc(L(cfg.intake.title)) + ' <em class="calc-line-meta">' + esc(L(cfg.intake.description)) + "</em>",
        money(res.intake.amount));
    }
    if (res.client.contractFee > 0) {
      coefficients += lineHTML(
        esc(L(cfg.client.contractTitle)) + ' <em class="calc-line-meta">' + esc(L(cfg.client.contractDescription)) + "</em>",
        money(res.client.contractFee));
    }
    /* Налог — только в рабочем режиме. Публично он внутри цены: НПД не
       НДС, предъявлять его заказчику строкой нельзя. */
    if (pro && res.client.taxAmount > 0) {
      coefficients += lineHTML(
        esc(txt("taxLine")) + ' <em class="calc-line-meta">' + Math.round(res.client.tax * 100) + "%</em>",
        money(Math.round(res.client.taxAmount)), "calc-line--coef");
    }
    if (res.minimum.applied) {
      coefficients += lineHTML(esc(txt("minimumLine")) + ' <em class="calc-line-meta">' + esc(money(res.minimum.value)) + "</em>",
        "+" + NBSP + money(res.minimum.value - res.minimum.before), "calc-line--coef");
    }

    return '<div class="calc-result-card">' +
      '<div class="calc-result-top">' +
        '<span class="calc-result-label">' + esc(pro ? txt("resultExactLabel") : txt("resultLabel")) + "</span>" +
        '<p class="calc-result-sum">' + esc(sumText(res)) + "</p>" +
        '<div class="calc-result-cat">' +
          scaleHTML(res) +
          "<span>" + esc(txt("categoryWord") + " " + res.category + " · " + L(cfg.category.names[res.category])) + "</span>" +
        "</div>" +
      "</div>" +

      '<ul class="calc-lines">' + lines + coefficients +
        lineHTML("<strong>" + esc(txt("totalLine")) + "</strong>", sumText(res), "calc-line--total") +
      "</ul>" +

      (res.minimum.applied ? '<p class="calc-note">' + esc(txt("minimumNote")) + "</p>" : "") +
      '<p class="calc-disclaimer">' + esc(txt("disclaimer")) + "</p>" +

      '<div class="calc-actions">' +
        '<a href="index.html#contact" class="btn btn-primary btn-small">' + esc(txt("ctaExact")) + "</a>" +
        '<button type="button" class="calc-copy" data-copy>' + esc(txt("copy")) + "</button>" +
      "</div>" +
      '<p class="calc-pricelist-note">' + esc(txt("priceListNote")) + "</p>" +
    "</div>";
  }

  /**
   * Липкая полоса с одним итогом. Нужна там, где смета не помещается
   * рядом с формой и уезжает вниз: на телефоне человек иначе не видит,
   * что цифра меняется от каждой галочки, а прилипшая целиком карточка
   * занимала половину экрана. Полоса прячется сама, когда до полной
   * сметы уже доскроллили, и по нажатию к ней же прокручивает.
   */
  function barHTML(res) {
    if (res.empty) return "";
    return '<span class="calc-bar-label">' +
        esc(pro ? txt("barLabelExact") : txt("barLabel")) +
      "</span>" +
      '<span class="calc-bar-sum">' + esc(sumText(res)) + "</span>" +
      '<span class="calc-bar-go" aria-hidden="true">' +
        '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" ' +
        'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M8 3v10M3.5 8.5 8 13l4.5-4.5"/></svg>' +
      "</span>";
  }

  /**
   * Полоса видна, пока читатель внутри калькулятора и полная смета ещё
   * не показалась на экране. На широком экране смета висит рядом всегда,
   * поэтому там полоса не появляется вовсе — это решает CSS, а не скрипт.
   *
   * Считаем положение сами, на прокрутке. IntersectionObserver здесь не
   * годится: он молчит, пока документ не композитится (в предпросмотре
   * это воспроизводится стабильно), и полоса тогда просто не появится —
   * отказ тихий, а проверить его на устройстве заказчика нечем.
   */
  function applyBarVisibility() {
    var bar = root.querySelector(".calc-bar");
    if (!bar) return;
    if (!bar.innerHTML) { bar.hidden = true; return; }

    var view = window.innerHeight || document.documentElement.clientHeight;
    var calc = root.getBoundingClientRect();
    var inCalc = calc.bottom > 0 && calc.top < view;

    var card = root.querySelector(".calc-result");
    var rect = card ? card.getBoundingClientRect() : null;
    /* Запас в 40 px: полоса уходит, когда смета действительно выехала
       на экран, а не показалась кромкой из-под неё самой. */
    var resultShown = !!rect && rect.top < view - 40 && rect.bottom > 0;

    /* Пишем, только когда состояние поменялось: присваивание на каждый
       кадр прокрутки заставляло бы браузер пересчитывать стиль впустую. */
    var next = !inCalc || resultShown;
    if (bar.hidden !== next) bar.hidden = next;
  }

  function watchBar() {
    applyBarVisibility();
    if (watchBar.wired) return;
    watchBar.wired = true;
    /* Без requestAnimationFrame: пока страница не композитится (фоновая
       вкладка, свёрнутая панель предпросмотра), кадры не выдаются, и
       отложенный пересчёт не случается вовсе. Два чтения геометрии на
       событие прокрутки дешевле, чем полоса, застрявшая в чужом
       состоянии. */
    window.addEventListener("scroll", applyBarVisibility, { passive: true });
    window.addEventListener("resize", applyBarVisibility);
  }

  /* ---------- Текст для мессенджера ---------- */

  function copyText(res) {
    var out = [];
    var plain = function (s) { return s.replace(/ /g, " "); };
    out.push(txt("copyHeader"));
    out.push(L(workType().label));
    out.push(txt("categoryWord") + " " + res.category + " — " + L(cfg.category.names[res.category]));
    if (needsMinutes()) out.push(txt("minutesLabel") + ": " + num(state.minutes));
    out.push(txt("piecesLabel") + ": " + state.pieces);
    cfg.modules.forEach(function (mod) {
      if (!state.modules[mod.id] || !mod.units) return;
      var unit = currentUnit(mod);
      if (unit.qtyField === "pages") out.push(L(unit.qtyLabel) + ": " + state.pages);
    });
    out.push("");
    res.lines.forEach(function (line) {
      out.push("· " + L(line.title) + " — " + plain(money(line.amount)));
    });
    if (res.delivery) out.push("· " + L(cfg.delivery.title) + " — " + plain(money(res.delivery.amount)));
    if (res.urgency.amount > 0) out.push("· " + txt("urgencyLine") + " ×" + num(res.urgency.factor) + " — +" + plain(money(res.urgency.amount)));
    if (res.sources.amount > 0) out.push("· " + txt("sourcesLine") + " ×" + num(res.sources.factor) + " — +" + plain(money(res.sources.amount)));
    if (res.rights.amount > 0) {
      var tierName = "";
      cfg.rights.tiers.forEach(function (t) { if (t.id === res.rights.tier) tierName = L(t.label); });
      out.push("· " + txt("rightsLine") + ": " + tierName + " ×" + num(res.rights.factor) +
               " — +" + plain(money(res.rights.amount)));
    }
    if (res.segment.applied && res.segment.amount !== 0) {
      out.push("· " + txt("segmentLine") + " ×" + num(res.segment.factor) + " — −" + plain(money(Math.abs(res.segment.amount))));
    }
    if (res.revisions.amount > 0) out.push("· " + txt("revisionsLine") + " ×" + res.revisions.rounds + " — +" + plain(money(res.revisions.amount)));
    if (res.intake) out.push("· " + L(cfg.intake.title) + " — " + plain(money(res.intake.amount)));
    if (res.client.contractFee > 0) out.push("· " + L(cfg.client.contractTitle) + " — " + plain(money(res.client.contractFee)));
    if (pro && res.client.taxAmount > 0) {
      out.push("· " + txt("taxLine") + " " + Math.round(res.client.tax * 100) + "% — " + plain(money(Math.round(res.client.taxAmount))));
    }
    if (res.minimum.applied) out.push("· " + txt("minimumLine") + " — +" + plain(money(res.minimum.value - res.minimum.before)));
    out.push("");
    out.push(txt("totalLine") + ": " + plain(sumText(res)));
    out.push("");
    out.push(txt("disclaimer"));
    return out.join("\n");
  }

  function copyToClipboard(text, button) {
    function done(ok) {
      button.textContent = ok ? txt("copied") : txt("copyFail");
      button.classList.toggle("is-copied", ok);
      setTimeout(function () {
        button.textContent = txt("copy");
        button.classList.remove("is-copied");
      }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      return;
    }
    /* Запасной путь для окружений без Clipboard API (в том числе file://). */
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      done(ok);
    } catch (e) {
      done(false);
    }
  }

  /* ---------- Отрисовка ---------- */

  /**
   * `only === "result"` перерисовывает только смету: при вводе в поле
   * нельзя трогать форму, иначе курсор выпрыгивает из инпута.
   * Полная перерисовка запоминает и возвращает фокус — иначе смена
   * этапа (она меняет набор вопросов) выбрасывала бы с клавиатуры.
   */
  function paint(only) {
    var res = result();
    var resultHost = root.querySelector(".calc-result-inner");

    if (only === "result") {
      refreshRates(res.category);
    } else {
      var active = document.activeElement;
      var focusId = active && root.contains(active) ? active.id : null;
      root.querySelector(".calc-form-host").innerHTML = formHTML(res);
      if (focusId) {
        var again = root.querySelector("#" + CSS.escape(focusId));
        if (again) again.focus({ preventScroll: true });
      }
    }
    resultHost.innerHTML = resultHTML(res);

    var bar = root.querySelector(".calc-bar");
    if (bar) {
      bar.innerHTML = barHTML(res);
      bar.setAttribute("aria-label", txt("barAction"));
      applyBarVisibility();
    }
  }

  /**
   * Обновление ставок в списке этапов без перерисовки формы: ответ на
   * вопрос меняет категорию, а с ней и ставки, но пересобирать форму
   * ради этого нельзя.
   */
  function refreshRates(category) {
    if (!pro) return;
    cfg.modules.forEach(function (mod) {
      var node = root.querySelector('[data-rate-for="' + mod.id + '"]');
      if (!node) return;
      var fresh = document.createElement("div");
      fresh.innerHTML = moduleRateHTML(mod, category);
      node.textContent = fresh.firstChild.textContent;
    });
  }

  /** Тип работы задаёт этапы, надбавки и точку старта по объёму. */
  function applyWorkType(id) {
    var type = cfg.workTypes.filter(function (w) { return w.id === id; })[0];
    if (!type) return;
    state.workType = id;
    state.modules = {};
    type.modules.forEach(function (m) { state.modules[m] = true; });
    state.addons = {};
    /* Единица расчёта и состояние исходника принадлежат прежней задаче —
       при смене типа работы их незачем тащить за собой. */
    state.units = {};
    state.variants = {};
    Object.keys(type.addons || {}).forEach(function (k) { state.addons[k] = type.addons[k]; });
    state.minutes = type.minutes;
    state.pieces = type.pieces;
    state.sourceMinutes = "";
    paint();
  }

  /**
   * Снимает этапы, несовместимые с только что включённым. Пользователь
   * не должен разбираться, что с чем не сочетается: включил новую
   * оркестровку — адаптация ушла сама, и на её месте написано почему.
   */
  /**
   * Цель использования подставляет ступень прав и надбавки к ней.
   * Именно подставляет, а не назначает: любой переключатель ниже
   * остаётся живым, и стоит его тронуть — цель гаснет, чтобы форма не
   * спорила сама с собой.
   */
  function applyPurpose(id) {
    var purpose = cfg.rights.purposes.filter(function (p) { return p.id === id; })[0];
    if (!purpose) return;
    state.purpose = id;
    var suggests = purpose.suggests || {};
    if (suggests.tier) state.rightsTier = suggests.tier;
    state.rightsAddons = {};
    (suggests.addons || []).forEach(function (a) { state.rightsAddons[a] = true; });
    paint();
  }

  function dropConflicts(id) {
    var mod = Calc.moduleById(id, cfg);
    cfg.modules.forEach(function (other) {
      if (other.id === id || !state.modules[other.id]) return;
      var mutual = (mod.conflictsWith || []).indexOf(other.id) !== -1 ||
                   (other.conflictsWith || []).indexOf(id) !== -1;
      if (mutual) state.modules[other.id] = false;
    });
  }

  function bindEvents() {
    root.addEventListener("change", function (e) {
      var node = e.target;

      if (node.name === "manual-category") { state.manualCategory = node.value; paint(); return; }
      if (node.name === "urgency") { state.urgency = node.value; paint("result"); return; }

      /* Цель подставляет ступень и надбавки — и перерисовывает форму
         целиком, потому что двигает переключатели ниже по шагу. */
      var purpose = node.getAttribute && node.getAttribute("data-purpose");
      if (purpose) { applyPurpose(purpose); return; }

      var tier = node.getAttribute && node.getAttribute("data-tier");
      if (tier) { state.rightsTier = tier; state.purpose = null; paint(); return; }

      var rightsAddon = node.getAttribute && node.getAttribute("data-rights-addon");
      if (rightsAddon) { state.rightsAddons[rightsAddon] = node.checked; state.purpose = null; paint("result"); return; }

      var client = node.getAttribute && node.getAttribute("data-client");
      if (client) { state.client = client; paint("result"); return; }

      var question = node.getAttribute && node.getAttribute("data-question");
      if (question) { state.answers[question] = Number(node.value); paint("result"); return; }

      var moduleId = node.getAttribute && node.getAttribute("data-module");
      if (moduleId) {
        state.modules[moduleId] = node.checked;
        if (node.checked) dropConflicts(moduleId);
        paint();
        return;
      }

      var unitOf = node.getAttribute && node.getAttribute("data-unit");
      if (unitOf) { state.units[unitOf] = node.value; paint(); return; }

      var variantOf = node.getAttribute && node.getAttribute("data-variant");
      if (variantOf) { state.variants[variantOf] = node.value; paint(); return; }

      var addon = node.getAttribute && node.getAttribute("data-addon");
      if (addon) { state.addons[addon] = node.checked; paint("result"); return; }

      if (node.getAttribute && node.getAttribute("data-field") === "sources") {
        state.sources = node.checked; paint(); return;
      }

      /* Скидка режет ступень прав сверху, поэтому перерисовка полная:
         часть переключателей выше должна погаснуть. */
      if (node.getAttribute && node.getAttribute("data-field") === "segment") {
        state.segment = node.checked;
        /* Ступень выше потолка не должна остаться отмеченной и погашенной
           одновременно: переводим выбор на потолок сразу. */
        if (state.segment && cfg.segment.maxTier) {
          var order = cfg.rights.tiers.map(function (t) { return t.id; });
          if (order.indexOf(state.rightsTier) > order.indexOf(cfg.segment.maxTier)) {
            state.rightsTier = cfg.segment.maxTier;
            state.purpose = null;
          }
          (cfg.segment.blockedAddons || []).forEach(function (a) {
            if (state.rightsAddons[a]) { state.rightsAddons[a] = false; state.purpose = null; }
          });
        }
        paint();
        return;
      }
    });

    /* input, а не change: смета обязана меняться на каждую цифру. */
    root.addEventListener("input", function (e) {
      var field = e.target.getAttribute && e.target.getAttribute("data-field");
      if (!field || field === "sources" || field === "segment") return;
      var raw = String(e.target.value).replace(",", ".");
      if (field === "sourceMinutes") state.sourceMinutes = e.target.value;
      else if (field === "pieces") state.pieces = Math.max(1, Math.round(Number(raw) || 1));
      else if (field === "pages") state.pages = Math.max(1, Math.round(Number(raw) || 1));
      else if (field === "extraRevisions") state.extraRevisions = Math.max(0, Number(raw) || 0);
      else if (field === "minutes") state.minutes = Math.max(0, Number(raw) || 0);
      paint("result");
    });

    root.addEventListener("click", function (e) {
      var type = e.target.closest("[data-type]");
      if (type) { applyWorkType(type.getAttribute("data-type")); return; }

      if (e.target.closest("[data-manual-toggle]")) {
        state.manualCategory = state.manualCategory === null ? result().category : null;
        paint();
        return;
      }

      if (e.target.closest("[data-bar]")) {
        var card = root.querySelector(".calc-result");
        if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      var copy = e.target.closest("[data-copy]");
      if (copy) { copyToClipboard(copyText(result()), copy); return; }

      if (e.target.closest("[data-pro-off]")) {
        try { localStorage.removeItem(PRO_KEY); } catch (err) {}
        pro = false;
        if (location.hash === "#pro") history.replaceState(null, "", location.pathname + location.search);
        mount(root);
      }
    });
  }

  /* ---------- Точка входа ---------- */

  function mount(node) {
    C = window.SiteCommon;
    cfg = window.PRICING_CONFIG;
    Calc = window.PricingCalc;
    lang = C.state.lang;
    root = node;
    pro = detectPro();

    if (!initialized) applyWorkTypeDefaults();

    root.className = "calc" + (pro ? " calc--pro" : "");
    root.innerHTML =
      (pro
        ? '<p class="calc-pro-badge">' + esc(txt("proBadge")) +
          ' <button type="button" data-pro-off>' + esc(txt("proOff")) + "</button></p>"
        : "") +
      '<div class="calc-layout">' +
        '<div class="calc-form-host"></div>' +
        '<aside class="calc-result">' +
          '<div class="calc-result-inner" aria-live="polite" aria-atomic="true"></div>' +
        "</aside>" +
      "</div>" +
      '<button type="button" class="calc-bar" data-bar hidden></button>';

    paint();
    watchBar();
    if (!initialized) { bindEvents(); initialized = true; }
  }

  /** Первый показ: калькулятор не должен открываться пустым. */
  function applyWorkTypeDefaults() {
    var type = cfg.workTypes.filter(function (w) { return w.id === state.workType; })[0] || cfg.workTypes[0];
    state.workType = type.id;
    type.modules.forEach(function (m) { state.modules[m] = true; });
    Object.keys(type.addons || {}).forEach(function (k) { state.addons[k] = type.addons[k]; });
    state.minutes = type.minutes;
    state.pieces = type.pieces;
  }

  return { mount: mount, state: state };
})();
