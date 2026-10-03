/**
 * РАСЧЁТ СТОИМОСТИ — чистая функция, без DOM
 * ==========================================
 * Отделена от интерфейса намеренно: её покрывают тесты
 * (tests/pricing-calc.test.js, запуск `npm test`), и в неё же ходит
 * pro-режим, где нужны точные цифры без округлений.
 *
 * ПОРЯДОК ОПЕРАЦИЙ МЕНЯТЬ НЕЛЬЗЯ — по нему согласованы сметы:
 *   1. категория (по доле набранных баллов или выбрана вручную)
 *   2. сумма этапов
 *   3. + оформление и сдача комплекта, по числу номеров
 *   4. × коэффициент срочности
 *   5. × передача исходных файлов
 *   6. × объём прав (ступень + надбавки)
 *   7. × сегментная скидка
 *   8. + дополнительные круги правок (надбавка сверх сметы, не объём работ)
 *   9. + приём и сдача проекта (фикс, вне множителей: это не музыка)
 *  10. + работа по договору, если заказчик — организация
 *  11. × налог, gross-up: цена уже включает НПД
 *  12. итог не ниже минимального заказа, если тот задан
 *
 * Множители 4–7 идут именно в таком порядке и все считаются от суммы
 * этапов, а не друг от друга: срочность — свойство срока, права —
 * свойство использования, скидка — свойство заказчика. Строки 9 и 10
 * стоят после множителей намеренно: приёмка и бумаги не дорожают
 * оттого, что заказчик берёт больше прав.
 *
 * Ставки и коэффициенты сюда не вписаны — они приходят конфигом
 * (js/pricing-config.js). Здесь только арифметика.
 */

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PricingCalc = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function selectedIds(modules) {
    return Object.keys(modules || {}).filter(function (id) { return modules[id]; });
  }

  /**
   * Вопросы, которые имеют смысл при выбранных этапах. Спрашивать про
   * хор, когда считается только нотный набор, незачем — и балл за него
   * не должен утяжелять категорию.
   */
  function activeQuestions(modules, config) {
    var chosen = selectedIds(modules);
    if (!chosen.length) return config.category.questions.slice();
    return config.category.questions.filter(function (q) {
      return q.appliesTo.some(function (id) { return chosen.indexOf(id) !== -1; });
    });
  }

  /** Сумма баллов по активным вопросам. */
  function scoreAnswers(answers, modules, config) {
    return activeQuestions(modules, config).reduce(function (sum, q) {
      var value = answers && answers[q.id];
      return sum + (typeof value === "number" ? value : 0);
    }, 0);
  }

  /** Максимум, который можно набрать на текущем наборе вопросов. */
  function maxScore(modules, config) {
    return activeQuestions(modules, config).reduce(function (sum, q) {
      return sum + Math.max.apply(null, q.options.map(function (o) { return o.score; }));
    }, 0);
  }

  /**
   * Категория по ДОЛЕ набранных баллов. Набор вопросов меняется вместе
   * с этапами, поэтому абсолютная шкала («8 баллов — это C») теряет
   * смысл: восемь баллов из четырнадцати и восемь из восьми — разные
   * партитуры.
   */
  function categoryForScore(score, max, config) {
    var last = config.category.order[config.category.order.length - 1];
    if (!max) return config.category.order[0];
    var ratio = score / max;
    var found = config.category.thresholds.filter(function (t) {
      return t.maxRatio === null || ratio <= t.maxRatio;
    })[0];
    return found ? found.id : last;
  }

  /** Тип заказчика из конфига; по умолчанию — частное лицо. */
  function clientType(id, config) {
    var types = (config.client && config.client.types) || [];
    return types.filter(function (t) { return t.id === id; })[0] || types[0] || null;
  }

  /** Ступень прав по id; по умолчанию — самая узкая. */
  function rightsTier(id, config) {
    var tiers = (config.rights && config.rights.tiers) || [];
    return tiers.filter(function (t) { return t.id === id; })[0] || tiers[0] || null;
  }

  /**
   * Коэффициент прав: ступень ПЛЮС выбранные надбавки, не умножение.
   * Умножение даёт взрыв на ровном месте — исключительная лицензия с
   * правом на изображение выходила бы ×2,9 вместо ×2,4, и объяснить
   * эту цифру заказчику нечем.
   */
  function rightsFactor(tier, chosen, config) {
    var factor = tier ? tier.factor : 1;
    var used = [];
    ((config.rights && config.rights.addons) || []).forEach(function (addon) {
      if (chosen && chosen[addon.id]) {
        factor += addon.factor;
        used.push(addon.id);
      }
    });
    return { factor: factor, addons: used };
  }

  function moduleById(id, config) {
    return config.modules.filter(function (m) { return m.id === id; })[0] || null;
  }

  /**
   * Этапы, которые нельзя брать вместе с уже выбранными. Конфликт
   * объявлен с одной стороны, а действует в обе: если снятие гасит
   * набор, то и набор гасит снятие.
   */
  function conflictsFor(id, modules, config) {
    var mod = moduleById(id, config);
    if (!mod) return null;
    var chosen = selectedIds(modules).filter(function (other) { return other !== id; });
    var blockers = chosen.filter(function (other) {
      var o = moduleById(other, config);
      return (mod.conflictsWith || []).indexOf(other) !== -1 ||
             ((o && o.conflictsWith) || []).indexOf(id) !== -1;
    });
    if (!blockers.length) return null;
    var source = moduleById(blockers[0], config);
    return {
      by: blockers[0],
      reason: (source && source.conflictReason) || mod.conflictReason || null
    };
  }

  /**
   * Стоимость одного этапа. Возвращает { amount, rate, ... } либо null,
   * если этап не выбран или его нельзя посчитать формулой.
   *
   * `rate` — ставка, по которой посчитана строка: она нужна pro-режиму,
   * чтобы показать «9 000 ₽ × 12 мин», а не голую сумму.
   */
  function moduleAmount(mod, input, config) {
    var category = input.category;
    var minutes = Number(input.minutes) || 0;
    var selected = input.modules || {};

    /* Скидка за смежный этап: снятие и макет дешевле, когда партитуру
       делаю я же. Считается от ставки, а не от итога строки. */
    var discount = 1;
    if (mod.discountWith && selected[mod.discountWith.module]) {
      discount = mod.discountWith.factor;
    }

    /* Надбавки внутри этапа — например саунд-дизайн поверх плейбэка. */
    var addonFactor = 1;
    var addonsUsed = [];
    (mod.addons || []).forEach(function (addon) {
      if (input.addons && input.addons[mod.id + ":" + addon.id]) {
        addonFactor += addon.factor;
        addonsUsed.push(addon.id);
      }
    });

    /* Этап идёт «в нагрузку», когда рядом выбран тот, внутри которого
       материал и так открыт: тогда своя ставка вместо категорийной. */
    var bundled = (mod.bundledWith || []).some(function (id) { return selected[id]; });

    /* Вариант — это состояние исходника. У этапов за минуту он задаёт
       множитель, у этапов за единицу — свою колонку ставок. */
    function chosenVariant() {
      var id = input.variants && input.variants[mod.id];
      return (mod.variants || []).filter(function (v) { return v.id === id; })[0] ||
             (mod.variants || [])[0] || null;
    }

    if (mod.kind === "per-minute-category") {
      /* У снятия на слух своя длительность: минуты исходника могут не
         совпадать с минутами готовой музыки (медли короче оригиналов). */
      var mins = minutes;
      if (mod.minutesField && input[mod.minutesField] !== undefined &&
          input[mod.minutesField] !== null && input[mod.minutesField] !== "") {
        mins = Number(input[mod.minutesField]) || 0;
      }
      var rate;
      var variantUsed = null;
      if (bundled && typeof mod.bundledRate === "number") {
        rate = mod.bundledRate;
      } else {
        var v = mod.variants ? chosenVariant() : null;
        variantUsed = v ? v.id : null;
        rate = mod.rate[category] * (v && v.factor ? v.factor : 1);
      }
      rate *= discount;
      return {
        amount: rate * addonFactor * mins, rate: rate, minutes: mins,
        discounted: discount !== 1, bundled: bundled, variant: variantUsed,
        addonFactor: addonFactor, addons: addonsUsed
      };
    }

    /* Одна работа, померенная по-разному: страницами, минутами или
       номерами. Ставка стоит на пересечении единицы и состояния
       исходника, поэтому таблица в конфиге двумерная. */
    if (mod.kind === "per-unit") {
      var unitId = input.units && input.units[mod.id];
      var unit = mod.units.filter(function (u) { return u.id === unitId; })[0] || mod.units[0];
      var variant = chosenVariant();
      var qty = Number(input[unit.qtyField]) || 0;
      if (unit.qtyField === "pieces") qty = Math.max(1, Math.round(qty));
      var unitRate = unit.rate[variant ? variant.id : Object.keys(unit.rate)[0]];
      if (typeof unitRate !== "number") return null;
      unitRate *= addonFactor * discount;
      return {
        amount: unitRate * qty, rate: unitRate, quantity: qty,
        unit: unit.id, qtyField: unit.qtyField, variant: variant ? variant.id : null,
        addonFactor: addonFactor, addons: addonsUsed
      };
    }

    if (mod.kind === "per-minute-flat") {
      var flat = mod.rate * discount;
      return { amount: flat * addonFactor * minutes, rate: flat, minutes: minutes,
               addonFactor: addonFactor, addons: addonsUsed };
    }

    if (mod.kind === "program-tier") {
      var extra = Math.max(0, minutes - mod.includedMinutes);
      return {
        amount: (mod.base + extra * mod.perExtraMinute) * discount * addonFactor,
        rate: null, minutes: minutes, extraMinutes: extra,
        addonFactor: addonFactor, addons: addonsUsed
      };
    }

    if (mod.kind === "share-of-module") {
      var source = moduleById(mod.ofModule, config);
      if (!source) return null;
      var baseRate = source.rate[category] * mod.factor * discount;
      return { amount: baseRate * addonFactor * minutes, rate: baseRate, minutes: minutes,
               addonFactor: addonFactor, addons: addonsUsed };
    }

    if (mod.kind === "per-piece") {
      var pieces = Math.max(1, Number(input.pieces) || 1);
      var variantId = input.variants && input.variants[mod.id];
      var variant = (mod.variants || []).filter(function (v) { return v.id === variantId; })[0] || mod.variants[0];
      var pieceRate = variant.rate * addonFactor * discount;
      return { amount: pieceRate * pieces, rate: pieceRate, pieces: pieces,
               variant: variant.id, addonFactor: addonFactor, addons: addonsUsed };
    }

    return null;
  }

  /**
   * Полный расчёт.
   *
   * input = {
   *   category: "A".."D" | null,   — если null, берётся из answers
   *   answers: { ensemble: 2, ... },
   *   minutes: 12.5,
   *   pieces: 4,
   *   pages: 20,                   — для набора нот постранично
   *   units: { m8: "page" },       — чем мерить этап, где единиц несколько
   *   sourceMinutes: 14,           — необязательно, только для снятия
   *   modules: { m2: true, m4: true },
   *   variants: { m8: "midi" },
   *   addons: { "m5:sound": true, "m8:parts": true },
   *   urgency: "normal" | "rush" | "urgent",
   *   sources: false,
   *   extraRevisions: 0
   * }
   */
  function calculate(input, config) {
    input = input || {};
    var selected = input.modules || {};
    var score = scoreAnswers(input.answers, selected, config);
    var max = maxScore(selected, config);
    var category = input.category || categoryForScore(score, max, config);
    var pieces = Math.max(1, Number(input.pieces) || 1);

    var lines = [];
    var subtotal = 0;

    config.modules.forEach(function (mod) {
      if (!selected[mod.id]) return;
      /* Конфликтующая пара до расчёта не доходит: интерфейс её не даёт
         выбрать, но если состояние пришло из старой ссылки — молча
         игнорируем более поздний этап, а не считаем обе строки. */
      if (conflictsFor(mod.id, selected, config) &&
          config.modules.findIndex(function (m) { return m.id === mod.id; }) >
          config.modules.findIndex(function (m) { return m.id === conflictsFor(mod.id, selected, config).by; })) {
        return;
      }
      var result = moduleAmount(mod, {
        category: category,
        minutes: input.minutes,
        sourceMinutes: input.sourceMinutes,
        pages: input.pages,
        modules: selected,
        pieces: pieces,
        units: input.units,
        variants: input.variants,
        addons: input.addons
      }, config);
      if (!result || !(result.amount > 0)) return;
      subtotal += result.amount;
      lines.push({
        id: mod.id, title: mod.title, amount: result.amount, rate: result.rate,
        minutes: result.minutes, pieces: result.pieces, extraMinutes: result.extraMinutes,
        quantity: result.quantity, unit: result.unit, qtyField: result.qtyField,
        variant: result.variant, bundled: !!result.bundled,
        discounted: !!result.discounted, addonFactor: result.addonFactor,
        addons: result.addons || [], kind: mod.kind
      });
    });

    /* 3. Партитура и партии — за каждый номер.
       Десять коротких пьес требуют десяти выводов и десяти комплектов
       партий, одна длинная — одного. Музыки при этом может быть поровну. */
    var delivery = null;
    var needsDelivery = lines.some(function (line) {
      return config.delivery.appliesWhen.indexOf(line.id) !== -1;
    });
    if (needsDelivery) {
      var deliveryRate = config.delivery.rate[category];
      delivery = { rate: deliveryRate, pieces: pieces, amount: deliveryRate * pieces };
      subtotal += delivery.amount;
    }

    var modulesSubtotal = subtotal;

    /* 4. Срочность */
    var urgency = (config.urgency.filter(function (u) { return u.id === input.urgency; })[0]) || config.urgency[0];
    var urgencyAmount = subtotal * (urgency.factor - 1);
    subtotal *= urgency.factor;

    /* 5. Передача исходных файлов */
    var sourcesAmount = 0;
    if (input.sources) {
      sourcesAmount = subtotal * (config.sources.factor - 1);
      subtotal *= config.sources.factor;
    }

    /* 6. Объём прав.
       Сегментная скидка ограничивает ступень сверху: дешевле отдаётся
       то, что не пойдёт зарабатывать. Ступень при этом не «ломается»
       молча — в результате видно, что она была срезана (capped). */
    var segmentOn = !!input.segment && !!config.segment;
    var askedTier = rightsTier(input.rightsTier, config);
    var tier = askedTier;
    var tierCapped = false;
    if (segmentOn && config.segment.maxTier) {
      var order = (config.rights.tiers || []).map(function (t) { return t.id; });
      var cap = rightsTier(config.segment.maxTier, config);
      if (askedTier && cap && order.indexOf(askedTier.id) > order.indexOf(cap.id)) {
        tier = cap;
        tierCapped = true;
      }
    }
    /* Скидка снимает и коммерческие надбавки: «для школы» и «в рекламу»
       не могут стоять в одной смете. */
    var askedAddons = input.rightsAddons || {};
    var allowedAddons = askedAddons;
    if (segmentOn && (config.segment.blockedAddons || []).length) {
      allowedAddons = {};
      Object.keys(askedAddons).forEach(function (id) {
        if (config.segment.blockedAddons.indexOf(id) === -1) allowedAddons[id] = askedAddons[id];
      });
    }
    var rights = rightsFactor(tier, allowedAddons, config);
    var rightsAmount = subtotal * (rights.factor - 1);
    subtotal *= rights.factor;

    /* 7. Сегментная скидка */
    var segmentAmount = 0;
    if (segmentOn) {
      segmentAmount = subtotal * (config.segment.factor - 1);
      subtotal *= config.segment.factor;
    }

    /* 8. Дополнительные круги правок — надбавка поверх сметы */
    var extraRevisions = Math.max(0, Math.round(Number(input.extraRevisions) || 0));
    var revisionsAmount = extraRevisions * config.revisions.perRound;
    var total = subtotal + revisionsAmount;

    /* 9. Ведение проекта. Фиксом и вне множителей: разобрать
       присланное и сдать файлы стоит одинаково и для минутного клика,
       и для отделения — и не дорожает оттого, что заказчик берёт
       больше прав. Появляется только там, где вообще есть работа. */
    var intake = null;
    if (lines.length > 0 && config.intake && config.intake.amount > 0) {
      intake = { amount: config.intake.amount };
      total += intake.amount;
    }

    /* 10. Работа по договору — только если заказчик организация или ИП */
    var client = clientType(input.client, config);
    var contractFee = (lines.length > 0 && client && client.contractFee) || 0;
    total += contractFee;

    /* 11. Налог. Gross-up: цена уже включает НПД, а не прибавляет его
       строкой сверху. Отдельной строкой «+6%» показывать нельзя — НПД
       не НДС, предъявить его заказчику не выйдет. */
    var taxRate = (client && client.tax) || 0;
    var beforeTax = total;
    if (taxRate > 0 && taxRate < 1) total = total / (1 - taxRate);
    var taxAmount = total - beforeTax;

    /* 12. Минимальный заказ — последним, то есть это сумма К ОПЛАТЕ.
       По умолчанию отключён (minimum: 0): его работу делает строка
       «Ведение проекта». */
    var beforeMinimum = total;
    var minimumApplied = lines.length > 0 && config.minimum > 0 && total < config.minimum;
    if (minimumApplied) total = config.minimum;

    return {
      category: category,
      score: score,
      maxScore: max,
      ratio: max ? score / max : 0,
      lines: lines,
      delivery: delivery,
      modulesSubtotal: modulesSubtotal,
      urgency: { id: urgency.id, factor: urgency.factor, amount: urgencyAmount },
      sources: { applied: !!input.sources, factor: config.sources.factor, amount: sourcesAmount },
      rights: {
        tier: tier ? tier.id : null,
        askedTier: askedTier ? askedTier.id : null,
        capped: tierCapped,
        factor: rights.factor,
        addons: rights.addons,
        amount: rightsAmount
      },
      segment: { applied: segmentOn, factor: config.segment ? config.segment.factor : 1, amount: segmentAmount },
      intake: intake,
      client: {
        id: client ? client.id : null,
        tax: taxRate,
        taxAmount: taxAmount,
        contractFee: contractFee
      },
      minimum: { applied: minimumApplied, value: config.minimum, before: beforeMinimum },
      revisions: { rounds: extraRevisions, amount: revisionsAmount },
      total: Math.round(total),
      /* Публичная вилка. Когда сумму задал минимальный заказ, вилки нет:
         минимум — твёрдая цифра, а не оценка. */
      range: minimumApplied
        ? { low: Math.round(total), high: Math.round(total) }
        : rangeFor(total, config),
      empty: lines.length === 0
    };
  }

  /** Вилка вокруг итога, округлённая до шага из конфига. */
  function rangeFor(total, config) {
    var r = config.publicRange;
    var step = r.roundTo || 1;
    return {
      low: Math.floor((total * r.low) / step) * step,
      high: Math.ceil((total * r.high) / step) * step
    };
  }

  return {
    calculate: calculate,
    scoreAnswers: scoreAnswers,
    categoryForScore: categoryForScore,
    maxScore: maxScore,
    activeQuestions: activeQuestions,
    conflictsFor: conflictsFor,
    moduleById: moduleById,
    clientType: clientType,
    rightsTier: rightsTier,
    rightsFactor: rightsFactor,
    rangeFor: rangeFor
  };
});
