/**
 * Чтение и запись контента сайта.
 *
 * Единственный источник правды — js/content.js. Файл устроен так:
 *   <комментарий-шапка>
 *   window.SITE_CONTENT = { ...строгий JSON... };
 * Поэтому его одновременно (а) грузит браузер обычным <script> — без fetch,
 * без бэкенда, работает даже с file://, и (б) читает/переписывает админка.
 *
 * Перед каждой записью старая версия складывается в backups/ — если что-то
 * пошло не так, файл можно просто вернуть оттуда.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_FILE = path.join(ROOT, "js", "content.js");
const BACKUP_DIR = path.join(ROOT, "backups");
const KEEP_BACKUPS = 30;

const HEADER = `/**
 * ЕДИНЫЙ ФАЙЛ КОНТЕНТА САЙТА
 * ==========================
 * Всё, что видно на сайте (тексты, проекты, услуги, отзывы, новости, контакты),
 * лежит здесь на двух языках — ru и en.
 *
 * ВАЖНО: этот файл редактируется через админку (admin.html) — она читает и
 * перезаписывает его автоматически. Поэтому объект ниже записан строгим JSON
 * (все ключи в кавычках) и без комментариев внутри. Руками править тоже можно,
 * но не ломайте JSON-синтаксис, иначе админка не сможет его прочитать.
 *
 * Запуск админки:  npm start  (или ./start.command)
 */

window.SITE_CONTENT = `;

function extractJSON(raw) {
  const marker = raw.indexOf("window.SITE_CONTENT");
  if (marker === -1) throw new Error("В js/content.js не найдено window.SITE_CONTENT");
  const start = raw.indexOf("{", marker);
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("js/content.js: не найден объект контента");
  return raw.slice(start, end + 1);
}

function read() {
  const raw = fs.readFileSync(CONTENT_FILE, "utf8");
  try {
    return JSON.parse(extractJSON(raw));
  } catch (err) {
    throw new Error("js/content.js не разбирается как JSON: " + err.message);
  }
}

function backup() {
  if (!fs.existsSync(CONTENT_FILE)) return;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.copyFileSync(CONTENT_FILE, path.join(BACKUP_DIR, `content-${stamp}.js`));

  const old = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("content-"))
    .sort()
    .slice(0, -KEEP_BACKUPS);
  old.forEach((f) => fs.unlinkSync(path.join(BACKUP_DIR, f)));
}

function validate(data) {
  if (!data || typeof data !== "object") throw new Error("Контент должен быть объектом");
  for (const lang of ["ru", "en"]) {
    if (!data[lang]) throw new Error(`Нет раздела "${lang}"`);
    for (const key of ["meta", "nav", "hero", "about", "portfolio", "services", "testimonials", "blog", "contact", "footer"]) {
      if (!data[lang][key]) throw new Error(`Нет ${lang}.${key}`);
    }
    if (!Array.isArray(data[lang].portfolio.projects)) throw new Error(`${lang}.portfolio.projects должен быть массивом`);
  }
  const ids = data.ru.portfolio.projects.map((p) => p.id);
  if (new Set(ids).size !== ids.length) throw new Error("Есть проекты с одинаковым id");
  if (ids.some((id) => !id)) throw new Error("У проекта пустой id");
  if (data.ru.portfolio.projects.length !== data.en.portfolio.projects.length) {
    throw new Error("Число проектов в ru и en не совпадает");
  }
  return true;
}

function write(data) {
  validate(data);
  backup();
  const body = HEADER + JSON.stringify(data, null, 2) + ";\n";
  const tmp = CONTENT_FILE + ".tmp";
  fs.writeFileSync(tmp, body, "utf8");
  fs.renameSync(tmp, CONTENT_FILE);
  return true;
}

module.exports = { read, write, validate, ROOT, CONTENT_FILE };
