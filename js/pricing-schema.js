/**
 * СХЕМА РЕДАКТОРА ПРАЙСА — какие поля показывать и как их звать
 * ============================================================
 * Чистые данные, без DOM: на вход прайс, на выход список групп с полями.
 * Рисуют по ней двое — админка (js/admin.js) и автономный калькулятор
 * (standalone/app.js), — и оба должны показывать одно и то же. Пока
 * список полей жил внутри одного из них, второй про новые блоки просто
 * не знал: права, налог и приёмка появились в прайсе, а в автономной
 * версии их было не найти.
 *
 * Схема строится ОТ САМОГО ПРАЙСА, а не задана списком путей: этапы,
 * вопросы и ступени перебираются циклом. Поэтому новый этап в
 * pricing-config.js появляется в редакторе сам, без правки этого файла.
 *
 * Тип поля (kind) решает, как значение показать и как записать обратно:
 *   money   — рубли, целые
 *   ratio   — множитель (1,3)
 *   percent — в прайсе доля (0,4), в поле проценты (40): так понятнее
 *   int     — целое
 *   text    — строка
 */

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.PricingSchema = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var CATS = ["A", "B", "C", "D"];

  function f(path, label, kind, wide) {
    return { path: path, label: label, kind: kind || "money", wide: !!wide };
  }
  function block(title, note, fields) {
    return { title: title, note: note || "", fields: fields.filter(Boolean) };
  }
  function ru(obj) {
    return obj && obj.ru !== undefined ? obj.ru : "";
  }

  /* Ставки этапа зависят от того, как он считается: у одного четыре
     категории, у другого таблица «единица × состояние оригинала». */
  function moduleRates(mod, i) {
    var base = "modules." + i;
    if (mod.kind === "per-minute-category") {
      return CATS.map(function (c) { return f(base + ".rate." + c, "Категория " + c); });
    }
    if (mod.kind === "per-minute-flat") {
      return [f(base + ".rate", "Ставка за минуту")];
    }
    if (mod.kind === "program-tier") {
      return [
        f(base + ".base", "За программу"),
        f(base + ".includedMinutes", "Минут в базе", "int"),
        f(base + ".perExtraMinute", "За минуту сверх")
      ];
    }
    if (mod.kind === "share-of-module") {
      return [f(base + ".factor", "Доля от оркестровки, %", "percent")];
    }
    if (mod.kind === "per-unit") {
      var out = [];
      (mod.units || []).forEach(function (u, ui) {
        (mod.variants || []).forEach(function (v) {
          out.push(f(base + ".units." + ui + ".rate." + v.id, ru(u.label) + " · " + ru(v.label)));
        });
      });
      return out;
    }
    return [];
  }

  function modulesGroup(cfg) {
    return {
      title: "Этапы работы",
      note: cfg.modules.length + " шт. — из них собирается смета",
      open: true,
      blocks: cfg.modules.map(function (mod, i) {
        var base = "modules." + i;
        var fields = [f(base + ".title.ru", "Название этапа", "text", true)];

        fields = fields.concat(moduleRates(mod, i));

        if (typeof mod.bundledRate === "number") {
          fields.push(f(base + ".bundledRate", "Ставка в связке"));
        }
        /* Множитель у варианта есть только там, где вариант меняет цену
           долей, а не собственной колонкой ставок. */
        (mod.variants || []).forEach(function (v, vi) {
          if (typeof v.factor === "number") {
            fields.push(f(base + ".variants." + vi + ".factor", ru(v.label) + ", ×", "ratio"));
          }
        });
        (mod.addons || []).forEach(function (a, ai) {
          fields.push(f(base + ".addons." + ai + ".factor", "Надбавка «" + ru(a.label) + "», %", "percent"));
        });
        if (mod.discountWith) {
          fields.push(f(base + ".discountWith.factor", "Со скидкой в связке, %", "percent"));
        }
        return block(ru(mod.title), ru(mod.description), fields);
      })
    };
  }

  function rightsGroup(cfg) {
    if (!cfg.rights) return null;
    return {
      title: "Права на результат",
      note: "работа и права на неё — две разные цены",
      blocks: [
        block("Ступени", "Множитель к сумме этапов. Разовое исполнение — база, оно всегда ×1.",
          cfg.rights.tiers.map(function (t, i) {
            return f("rights.tiers." + i + ".factor", ru(t.label) + ", ×", "ratio");
          })),
        block("Надбавки", "Складываются со ступенью, а не умножаются на неё.",
          cfg.rights.addons.map(function (a, i) {
            return f("rights.addons." + i + ".factor", ru(a.label) + ", %", "percent");
          }))
      ]
    };
  }

  function clientGroup(cfg) {
    if (!cfg.client) return null;
    var blocks = [
      block("Налог и документы",
        "Ставка НПД считается gross-up: она уже внутри цены, отдельной строкой заказчику не показывается.",
        cfg.client.types.reduce(function (acc, c, i) {
          acc.push(f("client.types." + i + ".tax", ru(c.label) + " — налог, %", "percent"));
          acc.push(f("client.types." + i + ".contractFee", ru(c.label) + " — за договор"));
          return acc;
        }, []))
    ];
    if (cfg.segment) {
      blocks.push(block("Учебная скидка", ru(cfg.segment.hint), [
        f("segment.factor", "Множитель к смете", "ratio")
      ]));
    }
    return { title: "Заказчик и налог", note: "", blocks: blocks };
  }

  function categoryGroup(cfg) {
    return {
      title: "Категории сложности",
      note: "названия и границы",
      blocks: [
        block("Названия", "", CATS.map(function (c) {
          return f("category.names." + c + ".ru", "Категория " + c, "text");
        })),
        block("Границы",
          "Доля набранных баллов, до которой держится категория. Последняя берёт всё, что выше.",
          cfg.category.thresholds.slice(0, CATS.length - 1).map(function (t, i) {
            return f("category.thresholds." + i + ".maxRatio", t.id + " — до, %", "percent");
          }))
      ]
    };
  }

  function questionsGroup(cfg) {
    return {
      title: "Вопросы и баллы",
      note: cfg.category.questions.length + " шт. — по ним считается категория",
      blocks: cfg.category.questions.map(function (q, i) {
        var fields = [f("category.questions." + i + ".label.ru", "Текст вопроса", "text", true)];
        q.options.forEach(function (o, oi) {
          var p = "category.questions." + i + ".options." + oi;
          fields.push(f(p + ".label.ru", "Вариант " + (oi + 1), "text"));
          fields.push(f(p + ".score", "Баллов", "int"));
        });
        return block(ru(q.label), ru(q.hint), fields);
      })
    };
  }

  function workTypesGroup(cfg) {
    return {
      title: "Типы работы",
      note: "названия и объём, с которого открывается калькулятор",
      blocks: cfg.workTypes.map(function (w, i) {
        return block(ru(w.label), ru(w.description), [
          f("workTypes." + i + ".label.ru", "Название", "text", true),
          f("workTypes." + i + ".minutes", "Минут по умолчанию", "ratio"),
          f("workTypes." + i + ".pieces", "Номеров по умолчанию", "int")
        ]);
      })
    };
  }

  function rulesGroup(cfg) {
    var blocks = [
      /* Название берётся из прайса, а не пишется здесь: зашитая строка
         разъехалась бы с ним при первом же переименовании. */
      block(ru(cfg.delivery.title), ru(cfg.delivery.description),
        CATS.map(function (c) { return f("delivery.rate." + c, "Категория " + c); }))
    ];
    if (cfg.intake) {
      blocks.push(block(ru(cfg.intake.title), ru(cfg.intake.description),
        [f("intake.amount", "Сумма на проект")]));
    }
    blocks.push(block("Срочность", "Множитель ко всей сумме этапов.",
      cfg.urgency.map(function (u, i) {
        return f("urgency." + i + ".factor", ru(u.label) + ", ×", "ratio");
      })));
    blocks.push(block("Передача исходных файлов", ru(cfg.sources.hint),
      [f("sources.factor", "Множитель", "ratio")]));
    blocks.push(block("Правки", "Сколько кругов входит в стоимость и почём следующие.", [
      f("revisions.included", "Входит кругов", "int"),
      f("revisions.perRound", "За круг сверх")
    ]));
    blocks.push(block("Минимальный заказ",
      "Порог применяется последним, то есть задаёт сумму к оплате. Ноль — порога нет, его работу делает «Ведение проекта».",
      [f("minimum", "Сумма")]));
    blocks.push(block("Вилка в публичном режиме",
      "Во сколько раз верхняя граница выше расчёта и до чего округлять.", [
      f("publicRange.high", "Верхняя граница, ×", "ratio"),
      f("publicRange.roundTo", "Округление до")
    ]));
    return { title: "Коэффициенты и правила", note: "", blocks: blocks };
  }

  function extrasGroup(cfg) {
    return {
      title: "Прикладные работы",
      note: "справочный список под калькулятором, формулой не считается",
      blocks: cfg.extraServices.map(function (s, i) {
        return block(ru(s.title), "", [
          f("extraServices." + i + ".title.ru", "Название", "text", true),
          f("extraServices." + i + ".price.ru", "Цена строкой", "text")
        ]);
      })
    };
  }

  /** Полная схема: список групп, в порядке показа. */
  function build(cfg) {
    return [
      modulesGroup(cfg),
      rulesGroup(cfg),
      rightsGroup(cfg),
      clientGroup(cfg),
      categoryGroup(cfg),
      questionsGroup(cfg),
      workTypesGroup(cfg),
      extrasGroup(cfg)
    ].filter(Boolean);
  }

  /** Все пути схемы одним списком — для проверок и сброса. */
  function paths(cfg) {
    var out = [];
    build(cfg).forEach(function (g) {
      g.blocks.forEach(function (b) {
        b.fields.forEach(function (fl) { out.push(fl.path); });
      });
    });
    return out;
  }

  /* Как значение показать в поле и как прочитать обратно. */
  var KIND = {
    money:   { show: showNumber, parse: parseNumber },
    ratio:   { show: showNumber, parse: parseNumber },
    percent: {
      show: function (v) { return showNumber(v === null || v === undefined ? v : Math.round(v * 1000) / 10); },
      parse: function (v) { var n = parseNumber(v); return n === null ? null : n / 100; }
    },
    int:     { show: function (v) { return v === null || v === undefined ? "" : String(v); },
               parse: function (v) { var n = parseNumber(v); return n === null ? null : Math.round(n); } },
    text:    { show: function (v) { return v === undefined || v === null ? "" : String(v); },
               parse: function (v) { return String(v); } }
  };

  function parseNumber(raw) {
    var clean = String(raw).replace(/\s| /g, "").replace(",", ".");
    if (clean === "") return null;
    var n = Number(clean);
    return isFinite(n) ? n : null;
  }
  function showNumber(value) {
    return String(value === undefined || value === null ? "" : value).replace(".", ",");
  }

  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc === undefined || acc === null ? undefined : acc[key];
    }, obj);
  }
  function setPath(obj, path, value) {
    var keys = path.split(".");
    var last = keys.pop();
    var host = keys.reduce(function (acc, key) {
      return acc === undefined || acc === null ? undefined : acc[key];
    }, obj);
    if (host) host[last] = value;
    return !!host;
  }

  /** Прайс с наложенными правками. Исходник не трогается. */
  function apply(base, overrides) {
    var cfg = JSON.parse(JSON.stringify(base));
    Object.keys(overrides || {}).forEach(function (path) {
      setPath(cfg, path, overrides[path]);
    });
    return cfg;
  }

  return {
    build: build,
    paths: paths,
    apply: apply,
    getPath: getPath,
    setPath: setPath,
    KIND: KIND,
    CATS: CATS
  };
});
