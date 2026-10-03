/**
 * ПРАВКИ ПРАЙСА ИЗ АДМИНКИ
 * =======================
 * Этот файл создаёт админка (admin.html → «Калькулятор»). Руками его
 * править не нужно и не стоит: он перезаписывается целиком.
 *
 * Здесь лежат только ОТЛИЧИЯ от js/pricing-config.js — плоская карта
 * «путь внутри прайса → новое значение». Всё, чего здесь нет, берётся
 * из прайса как есть. Пустой объект ниже означает, что прайс не правили.
 *
 * Постоянные изменения лучше вносить в сам js/pricing-config.js: там
 * рядом со ставкой стоит объяснение, откуда она взялась. Админка — для
 * быстрой правки цифр, когда открывать редактор кода не хочется.
 */

window.PRICING_OVERRIDES = {};

/* ——— конец правок ——— */

/* Накладываем правки на прайс. Путь, которого в прайсе больше нет
   (этап переименовали или удалили руками), молча пропускаем: создавать
   по нему пустую ветку — значит копить мусор, который никто не читает. */
(function () {
  var over = window.PRICING_OVERRIDES;
  var cfg = window.PRICING_CONFIG;
  if (!cfg || !over) return;
  Object.keys(over).forEach(function (path) {
    var keys = path.split(".");
    var last = keys.pop();
    var host = keys.reduce(function (acc, key) {
      return acc === undefined || acc === null ? undefined : acc[key];
    }, cfg);
    if (host && Object.prototype.hasOwnProperty.call(host, last)) host[last] = over[path];
  });
})();
