/**
 * Чтение и запись правок прайса.
 *
 * Сам прайс — js/pricing-config.js — админка НЕ трогает. Тот файл почти
 * целиком состоит из комментариев: почему ставка такая, откуда взялся
 * коэффициент, что с чем несовместимо. Переписать его из админки значило
 * бы стереть эту документацию первым же сохранением.
 *
 * Поэтому правки живут отдельно, плоской картой «путь → значение»:
 *
 *   js/pricing-overrides.js
 *   window.PRICING_OVERRIDES = { "modules.0.rate.B": 4500 };
 *
 * Файл грузится сразу после прайса и накладывается поверх него. Что это
 * даёт:
 *   • комментарии в прайсе целы, руками его править по-прежнему можно;
 *   • видно, что именно изменено относительно исходного прайса, — а
 *     значит, есть и «сбросить»;
 *   • новый этап, дописанный в прайс руками, появляется в калькуляторе
 *     сам: правки к нему просто не относятся;
 *   • формат тот же, что у автономной версии, — прайс переносится между
 *     ними файлом.
 *
 * Перед каждой записью старая версия складывается в backups/.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "js", "pricing-overrides.js");
const BACKUP_DIR = path.join(ROOT, "backups");
const KEEP_BACKUPS = 30;

const MARKER = "window.PRICING_OVERRIDES";
const SENTINEL = "/* ——— конец правок ——— */";

const HEADER = `/**
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

${MARKER} = `;

const FOOTER = `
${SENTINEL}

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
`;

const EMPTY = "{}";

function extractJSON(raw) {
  const marker = raw.indexOf(MARKER);
  if (marker === -1) throw new Error(`В js/pricing-overrides.js не найдено ${MARKER}`);
  const start = raw.indexOf("{", marker);
  /* Ищем закрывающую скобку до маркера конца, а не последнюю в файле:
     ниже идёт код применения, и в нём скобок хватает. */
  const stop = raw.indexOf(SENTINEL);
  const end = raw.lastIndexOf("}", stop === -1 ? raw.length : stop);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("js/pricing-overrides.js: не найден объект правок");
  }
  return raw.slice(start, end + 1);
}

function read() {
  if (!fs.existsSync(FILE)) return {};
  const raw = fs.readFileSync(FILE, "utf8");
  try {
    return JSON.parse(extractJSON(raw));
  } catch (err) {
    throw new Error("js/pricing-overrides.js не разбирается как JSON: " + err.message);
  }
}

function backup() {
  if (!fs.existsSync(FILE)) return;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.copyFileSync(FILE, path.join(BACKUP_DIR, `pricing-overrides-${stamp}.js`));

  const old = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("pricing-overrides-"))
    .sort()
    .slice(0, -KEEP_BACKUPS);
  old.forEach((f) => fs.unlinkSync(path.join(BACKUP_DIR, f)));
}

/**
 * Проверка правок. Строгая намеренно: файл подставляется в расчёт денег,
 * и опечатка вроде строки вместо числа не должна доехать до сметы.
 */
function validate(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Правки должны быть объектом");
  }
  for (const key of Object.keys(data)) {
    if (!/^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/.test(key)) {
      throw new Error(`Недопустимый путь: ${key}`);
    }
    const value = data[key];
    const type = typeof value;
    if (value === null || (type !== "number" && type !== "string" && type !== "boolean")) {
      throw new Error(`Значение по пути ${key} должно быть числом, строкой или флагом`);
    }
    if (type === "number" && !isFinite(value)) {
      throw new Error(`Значение по пути ${key} не число`);
    }
  }
  return true;
}

function write(data) {
  validate(data);
  backup();
  const keys = Object.keys(data).sort();
  const ordered = {};
  keys.forEach((k) => { ordered[k] = data[k]; });
  const body = HEADER + (keys.length ? JSON.stringify(ordered, null, 2) : EMPTY) + ";\n" + FOOTER;
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, body, "utf8");
  fs.renameSync(tmp, FILE);
  return true;
}

/** Создаёт пустой файл, если его ещё нет: сайт грузит его безусловно. */
function ensure() {
  if (!fs.existsSync(FILE)) write({});
  return FILE;
}

module.exports = { read, write, validate, ensure, ROOT, FILE };
